/* This file is a content script for the chrome extensions gavelconnect. This script will be injected into the webpage dev.gavelconnect.com/thesaleroom. 
This webpage is a live updating dashboard which controls the auction. 
The purpose of this page is to link the redux state and the dashboard so that on a different chrome extension page you can control multiple auction platforms at once
 */

import { Auction, createLot } from "~slices/auction-slice";
import { Platform } from "~slices/platform-slice";
import { persister, store } from "~store";
import type { PlasmoCSConfig } from "plasmo";

import { updateInput } from "@acme/element-operations";

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
  image: "image",
  nextLotButton: "nextLotButton",
};

const platformName = "stoneham";
/* ---------- End of platform setup ---------- */

export const config: PlasmoCSConfig = {
  matches: ["https://dev.gavelconnect.com/thesaleroom"],
  all_frames: true,
  run_at: "document_start",
};

// Keep track of state
let auctionState = store.getState().auction as Auction;
let platformState = store.getState().platform as Platform[];
persister.subscribe(() => {
  auctionState = store.getState().auction;
  platformState = store.getState().platform;
  console.debug("auctionState", auctionState);
});

// get current platform
const currentPlatform = platformState.find(
  (platform) => platform.name === platformName,
);

// create event listener for when dom is loaded
document.addEventListener("DOMContentLoaded", () => {
  // check if lot is in auction state
  const lotExists = auctionState.lots.some((lot) => lot.id === getLot());

  if (!lotExists && currentPlatform?.primary) {
    // find lot in auction state
    setTimeout(() => {
      store.dispatch(
        createLot({
          id: getLot(),
          asking: getAsk(),
          bids: [],
          description: getDescription(),
          highEstimate: getHighEstimate(),
          lowEstimate: getLowEstimate(),
          image: "",
          state: "unsold",
        }),
      );
    }, 1000);
  }
});

const getLot = () => {
  return document
    .getElementById(consoleElements.currentLot)
    .innerText.replace("Lot ", "");
};

const getImage = () => {
  // get image url
  const image = document.getElementById(
    consoleElements.image,
  ) as HTMLImageElement;
  return image.src;
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

const clickBid = () => {
  document.getElementById(consoleElements.bidButton).click();
};

const clickAsk = () => {
  document.getElementById(consoleElements.askButton).click();
};

const clickSold = () => {
  document.getElementById(consoleElements.sellButton).click();
};
const clickPass = () => {
  document.getElementById(consoleElements.passButton).click();
};

const clickRoom = () => {
  document.getElementById(consoleElements.roomButton).click();
};

const clickNextLot = () => {
  document.getElementById(consoleElements.nextLotButton).click();
};
