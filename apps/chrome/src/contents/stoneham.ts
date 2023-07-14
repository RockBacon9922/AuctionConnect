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
import { persister, RootState, store } from "~store";
import type { PlasmoCSConfig } from "plasmo";

import { observeElementContent } from "@acme/element-observer";

export const config: PlasmoCSConfig = {
  matches: ["https://dev.gavelconnect.com/thesaleroom"],
  all_frames: true,
  run_at: "document_start",
};

// get every element and put the references in an object
const consoleElements = {
  // for each in consoleIDs add reference to element in this object
  currentLot: document.getElementById("currentLot"),
  currentAsk: document.getElementById("currentAsk"),
  currentBid: document.getElementById("currentBid"),
  bidButton: document.getElementById("bidButton"),
  askInput: document.getElementById("askInput"),
  roomButton: document.getElementById("Room"),
  sellButton: document.getElementById("sellButton"),
  passButton: document.getElementById("passButton"),
};

persister.subscribe(() => {
  console.log("hi");
  const state: Auction = selectAuction(store.getState());
  state.lots.forEach((lot) => {
    console.log(lot);
    alert("hi");
  });
});
