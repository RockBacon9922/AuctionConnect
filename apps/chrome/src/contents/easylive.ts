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
  const consoleElements = getConsoleElements();

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

const getConsoleElements = () => {
  const consoleElements = {
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
  type ConsoleElements = typeof consoleElements;
  // create a version of type ConsoleElements without the null
  // check if all the console elements exist
  for (const element in consoleElements) {
    if (!consoleElements[element]) {
      throw new Error(`Element with ID '${element}' not found.`);
    }
  }
  type ConsoleElementsNotNull = {
    [key in keyof ConsoleElements]: ConsoleElements[key] extends HTMLInputElement
      ? HTMLInputElement
      : HTMLElement;
  };
  return consoleElements as ConsoleElementsNotNull;
};
