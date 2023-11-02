/* This file is a content script for the chrome extensions gavelconnect. This script will be injected into the webpage dev.gavelconnect.com/thesaleroom.
This webpage is a live updating dashboard which controls the auction.
The purpose of this page is to link the redux state and the dashboard so that on a different chrome extension page you can control multiple auction platforms at once
 */

// TODO: Purple bid detector

import { createBid, type CreateBid } from "~slices/auction-slice";
import { getState, persister, store } from "~store";
import type { PlasmoCSConfig } from "plasmo";

import { observeElementContent } from "@acme/element-operations";

import { createOrUpdateActiveLot, setAsk } from "./common/utils";

export const config: PlasmoCSConfig = {
  matches: ["https://www.easyliveauction.com/live_v2/*"],
  all_frames: false, // FIXME: This could be a potential issue. I have set it to false as we really only want to be controlling one instance of the dashboard
  run_at: "document_start",
};

const currentPlatform = getState().platform.easylive;
// create event listener for when dom is loaded
document.addEventListener("DOMContentLoaded", () => {
  // get the element bid-live-loading
  const bidLiveLoading = document.querySelector("#bid-live-loading");
  if (!bidLiveLoading) throw new Error("bid loading element not found");
  observeElementContent(bidLiveLoading, () => {
    if (bidLiveLoading.getAttribute("style") != "display: none;") return; // if the element is not hidden everything is not loaded yet stupid hydration

    // getting all the console elements
    const consoleElements = getConsoleElements();

    persister.subscribe(() => {
      const auctionState = getState().auction;
      const currentLot = auctionState.lots.find(
        (lot) => lot.id === auctionState.currentLotId, // get lot from store using currentLotID from store. May not exist
      );

      // if there is no lot create it and return
      if (!currentLot) {
        if (currentPlatform.primary) {
          createOrUpdateActiveLot(
            auctionState.currentLotId,
            getAsk(consoleElements.askInput),
            getDescription(consoleElements.description),
            getHighEstimate(consoleElements.highEstimate),
            getLowEstimate(consoleElements.lowEstimate),
            getImage(consoleElements.image),
          );
        }
        return;
      }
      // if ask is not the same as in state update it
      if (currentLot?.asking != getAsk(consoleElements.askInput)) {
        setAsk(consoleElements.askInput, currentLot.asking);
      }
      // Does redux show current lot as sold/unsold
      if (currentLot?.state === "sold") {
        consoleElements.sellButton.click();
        //TODO: add seller id
      } else if (currentLot?.state === "passed") {
        consoleElements.passButton.click();
      }
      // TODO: Next Lot
      // check if there are lots
      if (!auctionState.lots.length) return;
      const topBid = currentLot?.bids[0];
      // check if hammer matches the top bid in state
      if (
        getHammer(consoleElements.currentHammer) ===
          currentLot?.bids[0]?.amount &&
        topBid.platform !== currentPlatform.name
      ) {
        //TODO: Change bid to room
      }
      if (getHammer(consoleElements.currentHammer) > topBid?.amount) {
        //TODO: undo/delete bid
      }
      if (getHammer(consoleElements.currentHammer) < topBid?.amount) {
        setAsk(consoleElements.askInput, topBid?.amount);
        consoleElements.roomButton.click();
        setAsk(consoleElements.askInput, currentLot?.asking);
      }
    });

    // Lot Number
    // if the primary platform register event listener for lot number
    if (currentPlatform?.primary) {
      observeElementContent(consoleElements.currentLot, () => {
        createOrUpdateActiveLot(
          getLot(consoleElements.currentLot),
          getAsk(consoleElements.askInput),
          getDescription(consoleElements.description),
          getHighEstimate(consoleElements.highEstimate),
          getLowEstimate(consoleElements.lowEstimate),
          getImage(consoleElements.image),
        );
      });
    }
    // Bid
    observeElementContent(consoleElements.currentHammer, () => {
      const lotId = getLot(consoleElements.currentLot);
      const hammer = getHammer(consoleElements.currentHammer);
      const bidder = consoleElements.currentBidder.innerText;
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
        platform: currentPlatform.name,
        lotId: lotId,
      };
      store.dispatch(createBid(bid));
    });
  });
});

/**
 * @description Function to get all the console dom elements and return a type safe object
 * @returns Object with all the console dom elements
 * @throws Error if any of the elements are not found
 **/

export const getLot = (currentLot: HTMLElement) => {
  return currentLot.innerText.replace("Lot ", "");
};

export const getImage = (lotImage: HTMLImageElement) => {
  // get image url
  return lotImage.src;
};

export const getAsk = (ask: HTMLInputElement) => {
  return parseInt(ask.innerText.replace("Asking: ", "").replace(",", ""));
};

export const getHammer = (hammer: HTMLElement) => {
  return parseInt(hammer.innerText.replace("Bid: ", "").replace(",", ""));
};

export const getLowEstimate = (lowEstimate: HTMLElement) => {
  return parseInt(
    lowEstimate.innerText
      .replace("Est: ", "")
      .replaceAll("£", "")
      .split(" - ")[0],
  );
};

export const getHighEstimate = (highEstimate: HTMLElement) => {
  return parseInt(
    highEstimate.innerText
      .replace("Est: ", "")
      .replaceAll("£", "")
      .split(" - ")[1],
  );
};

export const getDescription = (description: HTMLElement) => {
  return description.innerText.replace("description: ", "");
};

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
    image: document.querySelector("#auctioneer-lot-img") as HTMLImageElement,
    startAuctionWindow: document.getElementById("auctioneer-start-overlay"),
    startAuctionWindowButton: document.getElementById("btn-start-auction"),
  };
  console.debug("consoleElements", consoleElements);
  type ConsoleElements = typeof consoleElements;
  // create a version of type ConsoleElements without the null
  // check if all the console elements exist
  for (const element in consoleElements) {
    if (consoleElements[element] === null) {
      throw new Error(`Element with ID '${element}' not found.`);
    }
  }
  type ConsoleElementsNotNull = {
    [key in keyof ConsoleElements]: ConsoleElements[key] extends HTMLInputElement
      ? HTMLInputElement
      : ConsoleElements[key] extends HTMLImageElement
      ? HTMLImageElement
      : HTMLElement;
  };
  return consoleElements as ConsoleElementsNotNull;
};
