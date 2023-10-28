/* This file is a content script for the chrome extensions gavelconnect. This script will be injected into the webpage dev.gavelconnect.com/thesaleroom.
This webpage is a live updating dashboard which controls the auction.
The purpose of this page is to link the redux state and the dashboard so that on a different chrome extension page you can control multiple auction platforms at once
 */

// TODO: Purple bid detector

import {
  createBid,
  createLot,
  setActiveLot,
  type CreateBid,
} from "~slices/auction-slice";
import { getState, persister, store } from "~store";
import type { PlasmoCSConfig } from "plasmo";

import { observeElementContent, updateInput } from "@acme/element-operations";

export const config: PlasmoCSConfig = {
  matches: ["https://www.easyliveauction.com/live_v2/clerk.cfm/*"],
  all_frames: true,
  run_at: "document_start",
};

// get current platform
const platformName = "easyliveAuction";
const currentPlatform = getState().platform.find(
  (platform) => platform.name === platformName,
);

// create event listener for when dom is loaded
document.addEventListener("DOMContentLoaded", () => {
  // getting all the console elements
  const consoleElements = getConsoleElements({
    currentLot: document.querySelector("#auctioneer-lot-no strong"),
    // currentAsk: document.querySelector(),
    currentHammer: document.querySelector("#text-current-bid112233"),
    currentBidder: document.querySelector("#client-bid"),
    description: document.querySelector("#auctioneer-lot-desc"),
    lowEstimate: document.querySelector("#auctioneer-lot-est"),
    highEstimate: document.querySelector("#auctioneer-lot-est"),
    bidButton: document.querySelector("#btn-sold"),
    askInput: document.querySelector("#bid-amount") as HTMLInputElement,
    askButton: document.querySelector("#btn-ask445566"),
    roomButton: document.querySelector("#btn-room"),
    sellButton: document.querySelector("#btn-sold"),
    passButton: document.querySelector("#btn-pass"),
    image: document.querySelector("#auctioneer-lot-img"),
  });

  persister.subscribe(() => {
    const auctionState = getState().auction;
    const lot = auctionState.lots.find(
      (lot) => lot.id === auctionState.currentLotId, // get lot from store using currentLotID from store. May not exist
    );
    // if there is no lot create it and return
    if (!lot) {
      getSetCurrentLot();
      return;
    }
    // if ask is not the same as in state update it
    if (lot?.asking != getAsk()) {
      setAsk(lot.asking);
    }
    // Does redux show current lot as sold/unsold
    if (lot?.state === "sold") {
      clickSold();
      //TODO: add seller id
    } else if (lot?.state === "passed") {
      clickPass();
    }
    // TODO: Next Lot
    // check if there are lots
    if (!auctionState.lots.length) return;
    const topBid = lot?.bids[0];
    // check if hammer matches the top bid in state
    if (
      getHammer() === lot?.bids[0]?.amount &&
      topBid.platform !== platformName
    ) {
      //TODO: Change bid to room
    }
    if (getHammer() > topBid?.amount) {
      //TODO: undo/delete bid
    }
    if (getHammer() < topBid?.amount) {
      setAsk(topBid.amount);
      clickRoom();
      setAsk(lot?.asking);
    }
  });

  // Lot Number
  // if the primary platform register event listener for lot number
  if (currentPlatform?.primary) {
    observeElementContent(consoleElements.currentLot, () => {
      getSetCurrentLot();
    });
  }
  // Bid
  observeElementContent(consoleElements.currentHammer, () => {
    const lotId = getLot();
    const hammer = getHammer();
    const bidder = getBidder();
    if (!lotId || !hammer || !bidder) return;
    console.debug("hammer", hammer);
    console.debug("type of hammer", typeof hammer);
    if (lotId === "0" && isNaN(hammer)) return;
    const lot = getState().auction.lots.find((lot) => lot.id === lotId);
    if (!lot) return;
    // check if lot is sold
    if (lot.state === "sold") return;

    // check if bidder is room
    if (bidder === "Room") return;

    // check if there is already a bid at this amount
    if (lot.bids.some((bid) => bid.amount === hammer)) return;
    // create bid object
    const bid: CreateBid = {
      amount: hammer,
      bidder: bidder,
      platform: platformName,
      lotId: lotId,
    };
    store.dispatch(createBid(bid));
  });
});

const getLot = () => {
  return consoleElements.currentLot.innerText.replace("Lot ", "");
  throw new Error("Lot number not found");
};

// create me a typesafe get image function
const getImage = () => {
  const image = document.getElementById(consoleElements.image);
  if (image) return image.getAttribute("src");
  throw new Error("Image element not found");
};

const getAsk = () => {
  const askElement = document.getElementById(consoleElements.currentAsk);
  if (askElement)
    return parseInt(
      askElement.innerText.replace("Asking: ", "").replace(",", ""),
    );
  throw new Error("Ask element not found");
};

const getHammer = () => {
  const hammerElement = document.getElementById(consoleElements.currentHammer);
  if (hammerElement)
    return parseInt(
      hammerElement.innerText.replace("Bid: ", "").replace(",", ""),
    );
  throw new Error("Hammer element not found");
};

const getLowEstimate = () => {
  const lowEstimateElement = document.getElementById(
    consoleElements.lowEstimate,
  );
  if (lowEstimateElement)
    return parseInt(
      lowEstimateElement.innerText
        .replace("Low Estimate: ", "")
        .replace(",", ""),
    );
  throw new Error("Low Estimate not found");
};

const getHighEstimate = () => {
  const highEstimateElement = document.getElementById(
    consoleElements.highEstimate,
  );
  if (highEstimateElement)
    return parseInt(
      highEstimateElement.innerText
        .replace("High Estimate: ", "")
        .replace(",", ""),
    );
};

const getDescription = () => {
  return document
    .getElementById(consoleElements.description)
    ?.innerText.replace("description: ", "");
};

const getBidder = () => {
  return document
    .getElementById(consoleElements.currentBidder)
    ?.innerText.replace("Bidder: ", "");
};

const setAsk = (ask: number) => {
  updateInput(consoleElements.askInput, ask.toString());
  document.getElementById(consoleElements.askButton)?.click();
};

const clickBid = () => {
  document.getElementById(consoleElements.bidButton)?.click();
};

const clickSold = () => {
  document.getElementById(consoleElements.sellButton)?.click();
};
const clickPass = () => {
  document.getElementById(consoleElements.passButton)?.click();
};

const clickRoom = () => {
  document.getElementById(consoleElements.roomButton)?.click();
};

const clickNextLot = () => {
  document.getElementById(consoleElements.nextLotButton)?.click();
};

// TODO: check if this fn is given a lot id that is already registered it doesn't shit itself
// TODO: Make sure that this function is only run if the lot is primary platform
const getSetCurrentLot = () => {
  const auctionState = getState().auction;
  // check if lot is in auction state
  const lotId = getLot();
  if (!lotId) return;
  const lotExists = auctionState.lots.some((lot) => lot.id === lotId);
  // if lot does not exist. Create it!!!
  if (!lotExists) {
    store.dispatch(
      createLot({
        id: lotId,
        asking: getAsk() || 0,
        bids: [],
        description: getDescription() || "",
        highEstimate: getHighEstimate() || 0,
        lowEstimate: getLowEstimate() || 0,
        image: getImage() || "",
        state: "unsold",
      }),
    );
  }
  store.dispatch(setActiveLot(lotId));
};

type ConsoleElements = {
  currentLot: HTMLElement | null;
  currentHammer: HTMLElement | null;
  currentBidder: HTMLElement | null;
  description: HTMLElement | null;
  lowEstimate: HTMLElement | null;
  highEstimate: HTMLElement | null;
  bidButton: HTMLElement | null;
  askInput: HTMLInputElement | null;
  askButton: HTMLElement | null;
  roomButton: HTMLElement | null;
  sellButton: HTMLElement | null;
  passButton: HTMLElement | null;
  image: HTMLElement | null;
};

const getConsoleElements = (elements: ConsoleElements) => {
  // check if all the console elements exist
  for (const element in elements) {
    if (!elements[element]) {
      throw new Error(`Element with ID '${element}' not found.`);
    }
  }
  // as we have checked that all the elements exist we can return them in a object with the same keys without the null
  return {
    currentLot: elements.currentLot as HTMLElement,
    currentHammer: elements.currentHammer as HTMLElement,
    currentBidder: elements.currentBidder as HTMLElement,
    description: elements.description as HTMLElement,
    lowEstimate: elements.lowEstimate as HTMLElement,
    highEstimate: elements.highEstiamte as HTMLElement,
    bidButton: elements.bidButton as HTMLElement,
    askInput: elements.askInput as HTMLInputElement,
    askButton: elements.askButton as HTMLElement,
    roomButton: elements.roomButton as HTMLElement,
    sellButton: elements.sellButton as HTMLElement,
    passButton: elements.passButton as HTMLElement,
    image: elements.image as HTMLElement,
  };
};
