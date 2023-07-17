/* This file is a content script for the chrome extensions gavelconnect. This script will be injected into the webpage dev.gavelconnect.com/thesaleroom. 
This webpage is a live updating dashboard which controls the auction. 
The purpose of this page is to link the redux state and the dashboard so that on a different chrome extension page you can control multiple auction platforms at once
 */

import {
  Auction,
  createBid,
  createLot,
  selectAuction,
} from "~slices/auction-slice";
import { Platform, selectPlatform } from "~slices/platform-slice";
import { persister, RootState, store } from "~store";
import type { PlasmoCSConfig } from "plasmo";

import { observeElementContent, updateInput } from "@acme/element-operations";

/* ---------- Update to setup platform ---------- */

// get every element and put the references in an object
const consoleElements = {
  // for each in consoleIDs add reference to element in this object
  currentLot: "currentLot",
  currentAsk: "currentAsk",
  currentHammer: "currentBid",
  currentBidder: "currentBidder",
  description: "description",
  lowEstimate: "lowEstimate",
  highEstimate: "highEstimate",
  bidButton: "bidButton",
  askInput: "askInput",
  askButton: "askButton",
  roomButton: "Room",
  sellButton: "sellButton",
  passButton: "passButton",
};

const platformName = "stoneham";
/* ---------- End of platform setup ---------- */

export const config: PlasmoCSConfig = {
  matches: ["https://dev.gavelconnect.com/thesaleroom"],
  all_frames: true,
  run_at: "document_start",
};

// get the auction state from the redux store. Plus add typescript type
const auctionState: Auction = selectAuction(store.getState());
const platformState: Platform[] = selectPlatform(store.getState());

// get current platform
const currentPlatform = platformState.find(
  (platform) => platform.name === platformName,
);

persister.subscribe(() => {
  auctionState.lots.forEach((lot) => {
    console.log(lot);
    alert("hi");
  });
});

// wait for dom to load
document.addEventListener("DOMContentLoaded", () => {
  // check if lot in in redux
  // if not, add it
  if (!auctionState.lots.find((lot) => lot.id === getLot())) {
    // store.dispatch(createLot({ id: getLot() }));
  }
  // Update current lot when it changes
  observeElementContent(consoleElements.currentLot, async () => {
    const lot = getLot();
    const ask = getAsk();
    const hammer = getHammer();
    const lowEstimate = getLowEstimate();
    const highEstimate = getHighEstimate();
    const description = getDescription();
    const bidder = getBidder();
    console.log("we are on lot number: " + lot);
    console.log("the ask is: " + ask);
    console.log("the bid is: " + hammer);
    console.log("the low estimate is: " + lowEstimate);
    console.log("the high estimate is: " + highEstimate);
    console.log("the description is: " + description);
    console.log("the bidder is: " + bidder);
    // check if primary platform
    // check if lot is equal to current lot
    // if not, update current lot
    // if so, do nothing
    if (lot !== auctionState.currentLotId && currentPlatform?.primary) {
      store.dispatch(
        createLot({
          id: lot,
          description: getDescription(),
          image: "",
          lowEstimate: getLowEstimate(),
          highEstimate: getHighEstimate(),
          asking: getAsk(),
          bids: [],
          state: "unsold",
        }),
      );
    }
  });
});

const getLot = () => {
  return document
    .getElementById(consoleElements.currentLot)
    .innerText.replace("Lot ", "");
};

const getAsk = () => {
  const stringAsk = document
    .getElementById(consoleElements.currentAsk)
    .innerText.replace("Asking: ", "");
  return parseInt(stringAsk.replace(",", ""));
};

const getHammer = () => {
  const stringBid = document
    .getElementById(consoleElements.currentHammer)
    .innerText.replace("Bid: ", "");
  return parseInt(stringBid.replace(",", ""));
};

const getLowEstimate = () => {
  const stringLowEstimate = document
    .getElementById(consoleElements.lowEstimate)
    .innerText.replace("Low Estimate: ", "");
  return parseInt(stringLowEstimate.replace(",", ""));
};

const getHighEstimate = () => {
  const stringHighEstimate = document
    .getElementById(consoleElements.highEstimate)
    .innerText.replace("High Estimate: ", "");
  return parseInt(stringHighEstimate.replace(",", ""));
};

const getDescription = () => {
  return document
    .getElementById(consoleElements.description)
    .innerText.replace("Description: ", "");
};

const getBidder = () => {
  return document
    .getElementById(consoleElements.currentBidder)
    .innerText.replace("Bidder: ", "");
};

const setAsk = (ask: number) => {
  updateInput(consoleElements.askInput, ask.toString());
  document.getElementById(consoleElements.askButton).click();
};
