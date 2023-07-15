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

import { observeElementContent } from "@acme/element-observer";

/* ---------- Update to setup platform ---------- */

// get every element and put the references in an object
const consoleElements = {
  // for each in consoleIDs add reference to element in this object
  currentLot: "currentLot",
  currentAsk: "currentAsk",
  currentBid: "currentBid",
  bidButton: "bidButton",
  askInput: "askInput",
  roomButton: "Room",
  sellButton: "sellButton",
  passButton: "passButton",
};

const platformName = "GavelConnect";
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
  // Update current lot when it changes
  observeElementContent(consoleElements.currentLot, () => {
    const lot = document.getElementById(consoleElements.currentLot).innerText;
    console.log(lot);
    // check if primary platform
    // check if lot is equal to current lot
    // if not, update current lot
    // if so, do nothing
    // if (lot !== auctionState.currentLotNumber && currentPlatform?.primary) {
    //   store.dispatch(createLot(lot));
    // }
  });
});
