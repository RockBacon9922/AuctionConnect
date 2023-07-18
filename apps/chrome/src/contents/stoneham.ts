/* This file is a content script for the chrome extensions gavelconnect. This script will be injected into the webpage dev.gavelconnect.com/thesaleroom. 
This webpage is a live updating dashboard which controls the auction. 
The purpose of this page is to link the redux state and the dashboard so that on a different chrome extension page you can control multiple auction platforms at once
 */

import { Auction, createLot, setActiveLot } from "~slices/auction-slice";
import { Platform } from "~slices/platform-slice";
import { persister, store } from "~store";
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
  // if environment is not production log state
  if (process.env.NODE_ENV !== "production") {
    console.debug("auction state", auctionState);
  }
});

// get current platform
const currentPlatform = platformState.find(
  (platform) => platform.name === platformName,
);

// create event listener for when dom is loaded
document.addEventListener("DOMContentLoaded", () => {
  observeElementContent(consoleElements.currentLot, () => {
    // check if lot is in auction state
    const lotId = getLot();
    if (lotId === "0") return;
    const lotExists = auctionState.lots.some((lot) => lot.id === lotId);

    // if not the primary platform you have no authority to control the auction
    if (!currentPlatform?.primary) return;

    // if lot does not exist. Create it!!!
    if (!lotExists) {
      // find lot in auction state
      store.dispatch(
        createLot({
          id: lotId,
          asking: getAsk(),
          bids: [],
          description: getDescription(),
          highEstimate: getHighEstimate(),
          lowEstimate: getLowEstimate(),
          image: "",
          state: "unsold",
        }),
      );
    }
    store.dispatch(setActiveLot(lotId));
  });
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
