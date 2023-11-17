import { createBid, createLot, updateLot } from "~slices/auction-slice";
import { setLots, setStatus } from "~slices/platform-slice";
import { getState, persister, store } from "~store";
import { type PlasmoCSConfig } from "plasmo";

import {
  getElementByQuerySelector,
  observeElementContent,
  updateInput,
} from "@acme/element-operations";

export const config: PlasmoCSConfig = {
  matches: ["https://www.easyliveauction.com/live_v2/*"],
  all_frames: false,
  run_at: "document_idle",
};

const currentPlatform = getState().platform.easylive;

// Function to understand when easylive is loaded
const bidLiveLoading = document.getElementById("bid-live-loading");
if (!bidLiveLoading) throw new Error("bid loading element not found");
observeElementContent(bidLiveLoading, () => {
  if (bidLiveLoading.style.display === "block") return;
  document.dispatchEvent(new Event("EasyLiveContentLoaded"));
});

// Pausing and resuming the auction
document.addEventListener("EasyLiveContentLoaded", () => {
  const consoleElements = getConsoleElements();
  console.debug("Console Elements", consoleElements);

  // close the start auction window if it is open
  if (consoleElements.startAuctionWindow.style.display != "none")
    consoleElements.startAuctionWindowButton.click();

  // check if the auction platform is connected
  observeElementContent(consoleElements.lostConnectionWindow, () => {
    if (consoleElements.lostConnectionWindow.style.display === "block") {
      // set status to disconnected
      store.dispatch(
        setStatus({
          platformName: currentPlatform.name,
          status: false,
        }),
      );
      return;
    }
    store.dispatch(
      setStatus({
        platformName: currentPlatform.name,
        status: true,
      }),
    );
  });
  // If window is open and auction is not paused close it
  observeElementContent(consoleElements.auctionPausedWindow, () => {
    if (
      consoleElements.auctionPausedWindow.style.display === "block" &&
      !getState().auction.paused
    ) {
      consoleElements.auctionPausedWindowButton.click();
    }
  });
  // if redux says auction is paused, pause it vise versa
  persister.subscribe(() => {
    if (getState().auction.paused) {
      consoleElements.pauseAndResumeAuctionButton.click();
    } else if (consoleElements.auctionPausedWindow.style.display === "block") {
      consoleElements.auctionPausedWindowButton.click();
    }
  });
});

// Create and update lot when platform is on the lot
document.addEventListener("EasyLiveContentLoaded", () => {
  const consoleElements = getConsoleElements();
  observeElementContent(
    consoleElements.lotDetails,
    () => {
      const state = getState();
      const lotId = getLot(consoleElements.lotDetails);
      const storeLotInstance = state.auction.lots.find(
        (state) => state.id === lotId,
      );
      if (!storeLotInstance) {
        store.dispatch(
          createLot({
            id: lotId,
            description: getDescription(consoleElements.lotDetails),
            lowEstimate: getLowEstimate(consoleElements.lotDetails),
            highEstimate: getHighEstimate(consoleElements.lotDetails),
            image: getImage(consoleElements.lotDetails),
            asking: getAsk(consoleElements.askInput),
            bids: [],
            state: "unsold",
          }),
        );
        return;
      }
      console.debug("Updating lot", storeLotInstance);
      // update content e.g description, estimate, image
      store.dispatch(
        updateLot({
          id: lotId,
          description: getDescription(consoleElements.lotDetails),
          lowEstimate: getLowEstimate(consoleElements.lotDetails),
          highEstimate: getHighEstimate(consoleElements.lotDetails),
          image: getImage(consoleElements.lotDetails),
          asking: getAsk(consoleElements.askInput),
          bids: storeLotInstance.bids,
          state: storeLotInstance.state,
        }),
      );
    },
    { initialRun: true },
  );
});

// get all the lot numbers and put them into the store so that we can compare them with other platforms
document.addEventListener("EasyLiveContentLoaded", () => {
  const consoleElements = getConsoleElements();
  consoleElements.lotTable.querySelectorAll("tr").forEach((tr) => {
    const lotNumber = tr.querySelector("td");
    if (!lotNumber) return;
    const lotId = lotNumber.innerText.trim();
    // check if the lot is already in the store
    !getState().platform.easylive.lots.includes(lotId) &&
      store.dispatch(
        setLots({
          platformName: currentPlatform.name,
          lots: [...getState().platform.easylive.lots, lotId],
        }),
      );

    // If primary platform and lot does not exist in the store, create it
    if (
      currentPlatform.primary &&
      !getState().auction.lots.find((lot) => lot.id === lotId)
    ) {
      store.dispatch(
        createLot({
          id: lotId,
          description: tr.children[1].textContent?.trim() || "",
          lowEstimate: parseInt(
            tr.children[2].textContent
              ?.trim()
              .replaceAll("£", "")
              .split(" to ")[0] || "0",
          ),
          highEstimate: parseInt(
            tr.children[2].textContent
              ?.trim()
              .replaceAll("£", "")
              .split(" to ")[1] || "0",
          ),
          image: "",
          asking: 0,
          bids: [],
          state: "unsold",
        }),
      );
    }
  });
});

// Interacting with the EL console when the store changes
document.addEventListener("EasyLiveContentLoaded", () => {
  const consoleElements = getConsoleElements();
  /**
   * TODO: Should this be store.subscribe?
   * @description Interacting with the EL console when the store changes
   * 1. Check if the lot is sold
   * * If so we need to sell the lot. And input the user who bought it if necessary
   * 2. If we have a bid, check if we are the highest bidder
   * * If so we need to room bid
   * 3. Update the ask price
   * 4. Compare the current lot with the currentlot in the store
   * * If they are different, we need to move to the correct lot
   */
  persister.subscribe(() => {
    const state = getState();
    const currentLot = state.auction.lots.find(
      (lot) => lot.id === state.auction.currentLotId,
    );
    // if there is no lot create it and return if not primary return anyway
    if (!currentLot) return;

    // 1. Check if the lot is sold
    if (currentLot.state === "sold") {
      console.debug("lot is sold");
    }
    // 2. If we have a bid, check if we are the highest bidder
    if (getHammer(consoleElements.currentHammer) < currentLot.bids[0].amount) {
      updateInput(
        consoleElements.askInput,
        currentLot.bids[0].amount.toString(),
      );
      consoleElements.askButton.click();
    }
    // 3. Update the ask price
    if (getAsk(consoleElements.askInput) != currentLot.asking) {
      updateInput(consoleElements.askInput, currentLot.asking.toString());
      consoleElements.askButton.click();
    }
    // 4. Compare the current lot with the currentlot in the store
    // * If they are different, we need to move to the correct lot
    if (getLot(consoleElements.lotDetails) != currentLot.id) {
      //TODO: code to move to the correct lot
    }
  });
});

// Incoming bid handler
document.addEventListener("EasyLiveContentLoaded", () => {
  const consoleElements = getConsoleElements();
  observeElementContent(consoleElements.currentBidder, () => {
    const statusLabel = consoleElements.currentBidder.innerText.trim();
    // if innerText looks something like this "Bid [x]" we have a bid
    const regex = /Bid \[\d+\]/;
    if (!regex.test(statusLabel)) return;
    const bidder = statusLabel.replace("Bid [", "").replace("]", "").trim();
    console.debug("Incoming bid", bidder);
    // create a bid
    store.dispatch(
      createBid({
        lotId: getLot(consoleElements.lotDetails),
        amount: getHammer(consoleElements.currentHammer),
        bidder,
        platform: currentPlatform.name,
      }),
    );
  });
});

const getAsk = (ask: HTMLInputElement) => {
  return parseInt(ask.value.replace("Asking: ", "").replace(",", ""));
};

const getHammer = (hammer: HTMLElement) => {
  return parseInt(hammer.innerText.replace("Bid: ", "").replace(",", ""));
};

const getLot = (lotDetails: HTMLElement) => {
  const lotElement = lotDetails.querySelector(
    "auctioneer-lot-no h4 strong",
  ) as HTMLElement;
  if (!lotElement) throw new Error("Lot element not found");
  return lotElement.innerText.trim();
};

const getLowEstimate = (lotDetails: HTMLElement) => {
  const lotEstimateElement = lotDetails.querySelector(
    "#auctioneer-lot-est h4 strong",
  ) as HTMLElement;
  if (!lotEstimateElement) throw new Error("Lot estimate element not found");
  return parseInt(
    lotEstimateElement.innerText
      .replace("Est: ", "")
      .replaceAll("£", "")
      .split(" - ")[0],
  );
};

const getHighEstimate = (lotDetails: HTMLElement) => {
  const lotEstimateElement = lotDetails.querySelector(
    "#auctioneer-lot-est",
  ) as HTMLElement;
  if (!lotEstimateElement) throw new Error("Lot estimate element not found");
  return parseInt(
    lotEstimateElement.innerText
      .replace("Est: ", "")
      .replaceAll("£", "")
      .split(" - ")[1],
  );
};

const getImage = (lotDetails: HTMLElement) => {
  const imageElement = lotDetails.querySelector(
    "#auctioneer-lot-img img",
  ) as HTMLImageElement;
  if (!imageElement) throw new Error("Image element not found");
  return imageElement.src;
};

const getDescription = (lotDetails: HTMLElement) => {
  const descriptionElement = lotDetails.querySelector(
    "#auctioneer-lot-desc",
  ) as HTMLElement;
  if (!descriptionElement) throw new Error("Description element not found");
  return descriptionElement.innerText.trim();
};

const getConsoleElements = () => {
  return {
    lotDetails: getElementByQuerySelector("#auctioneer-lot-details"),
    currentHammer: getElementByQuerySelector("#text-current-bid112233"),
    currentBidder: getElementByQuerySelector("#client-bid"),
    bidButton: getElementByQuerySelector("#btn-bid"),
    askInput: getElementByQuerySelector("#bid-amount") as HTMLInputElement,
    askButton: getElementByQuerySelector("#btn-ask445566"),
    roomButton: getElementByQuerySelector("#btn-room"),
    sellButton: getElementByQuerySelector("#btn-sold"),
    passButton: getElementByQuerySelector("#btn-pass"),
    startAuctionWindow: getElementByQuerySelector("#auctioneer-start-overlay"),
    startAuctionWindowButton: getElementByQuerySelector("#btn-start-auction"),
    lostConnectionWindow: getElementByQuerySelector("#bid-live-connection"), // nothing works when style is set to display: block;
    auctionPausedWindow: getElementByQuerySelector("#auctioneer-pause-overlay"),
    auctionPausedWindowButton: getElementByQuerySelector("#btn-resume"),
    pauseAndResumeAuctionButton: getElementByQuerySelector("#btn-pause"),
    lotTable: getElementByQuerySelector("#lot-listing tbody"),
  };
};
