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

/* ---------- Update to setup platform ---------- */

const platformName = "easyliveAuction";
const platformState = getState().platform;
// get current platform
const currentPlatform = platformState.find(
  (platform) => platform.name === platformName,
);
/* ---------- End of platform setup ---------- */

// create event listener for when dom is loaded
document.addEventListener("DOMContentLoaded", () => {
  // getting all the console elements
  const consoleElements2 = {
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
  };
  // check if all the console elements exist
  for (const element in consoleElements2) {
    if (!consoleElements2[element]) {
      throw new Error(`${element} not found`);
    }
  }
  persister.subscribe(() => {
    const auctionState = getState().auction;
    // if environment is not production log state
    if (process.env.NODE_ENV !== "production") {
      console.debug("auction state", auctionState);
    }
    const lot = auctionState.lots.find(
      (lot) => lot.id === auctionState.currentLotId,
    );
    // if there is no lot create it and return
    if (!lot) {
      getSetCurrentLot();
      return;
    }
    // if ask is not the same as in state update it
    if (lot?.asking !== getAsk()) {
      setAsk(lot.asking);
    }
    // Does redux show current lot as sold/unsold
    if (lot?.state === "sold") {
      clickSold();
      //TODO: add seller id
    } else if (lot?.state === "passed") {
      clickPass();
    }
    // does current lot number match redux
    if (getLot() < auctionState.currentLotId) {
      clickNextLot();
      return;
    }
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
  // if the primary platform regester event listener for lot number
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
  const lotNumber = document
    .getElementById(consoleElements.currentLot)
    ?.innerText.replace("Lot ", "");
  if (lotNumber) return parseInt(lotNumber);
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
