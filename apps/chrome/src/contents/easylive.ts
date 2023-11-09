/* This file is a content script for the chrome extensions gavelconnect. This script will be injected into the webpage dev.gavelconnect.com/thesaleroom.
This webpage is a live updating dashboard which controls the auction.
The purpose of this page is to link the redux state and the dashboard so that on a different chrome extension page you can control multiple auction platforms at once
 */

// TODO: Purple bid detector

import { createBid, createLot, type CreateBid } from "~slices/auction-slice";
import { setStatus } from "~slices/platform-slice";
import { getState, persister, store } from "~store";
import type { PlasmoCSConfig } from "plasmo";

import { observeElementContent } from "@acme/element-operations";

import { setAsk } from "./common/utils";

export const config: PlasmoCSConfig = {
  matches: ["https://www.easyliveauction.com/live_v2/*"],
  all_frames: false, // FIXME: This could be a potential issue. I have set it to false as we really only want to be controlling one instance of the dashboard
  run_at: "document_start",
};

const currentPlatform = getState().platform.easylive;
// create event listener for when dom is loaded
document.addEventListener("DOMContentLoaded", () => {
  // get the element bid-live-loading
  const bidLiveLoading = document.getElementById("bid-live-loading");
  if (!bidLiveLoading) throw new Error("bid loading element not found");
  observeElementContent(bidLiveLoading, () => {
    if (bidLiveLoading.style.display === "block") return; // if the element is not hidden everything is not loaded yet stupid hydration

    // getting all the console elements
    const consoleElements = getConsoleElements();
    // check if start auction window is open
    if (consoleElements.startAuctionWindow.style.display === "none") return;
    consoleElements.startAuctionWindowButton.click();

    persister.subscribe(() => {
      const auctionState = getState().auction;
      const currentLot = auctionState.lots.find(
        (lot) => lot.id === auctionState.currentLotId, // get lot from store using currentLotID from store. May not exist
      );

      // if there is no lot create it and return if not primary return anyway
      if (!currentLot) {
        if (currentPlatform.primary) {
          store.dispatch(
            createLot({
              id: getLot(consoleElements.currentLot),
              image: consoleElements.image.src,
              asking: getAsk(consoleElements.askInput),
              lowEstimate: getLowEstimate(consoleElements.estimate),
              highEstimate: getHighEstimate(consoleElements.estimate),
              description: getDescription(consoleElements.description),
              bids: [],
              state: "unsold",
            }),
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
        alert("Lost connection to auction platform");
        return;
      }
      store.dispatch(
        setStatus({
          platformName: currentPlatform.name,
          status: true,
        }),
      );
    });
    // TODO: If this platform is primary. Handle the system to create a new lot if it doesn't exist?

    // TODO: Handle when a bid comes in on this platform

    //TODO: Handle when the system loses connection
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

export const getAsk = (ask: HTMLInputElement) => {
  return parseInt(ask.value.replace("Asking: ", "").replace(",", ""));
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
  return description.innerText.replace("description: ", "").trim();
};

const getConsoleElements = () => {
  const consoleElements = {
    currentLot: document.querySelector("#auctioneer-lot-no strong"),
    // currentAsk: document.querySelector(),
    currentHammer: document.querySelector("#text-current-bid112233"),
    currentBidder: document.querySelector("#client-bid"),
    description: document.querySelector("#auctioneer-lot-desc"),
    estimate: document.querySelector("#auctioneer-lot-est"),
    bidButton: document.querySelector("#btn-bid"),
    askInput: document.querySelector("#bid-amount") as HTMLInputElement,
    askButton: document.querySelector("#btn-ask445566"),
    roomButton: document.querySelector("#btn-room"),
    sellButton: document.querySelector("#btn-sold"),
    passButton: document.querySelector("#btn-pass"),
    image: document.querySelector(
      "#auctioneer-lot-img img",
    ) as HTMLImageElement,
    startAuctionWindow: document.getElementById("auctioneer-start-overlay"),
    startAuctionWindowButton: document.getElementById("btn-start-auction"),
    lostConnectionWindow: document.getElementById("bid-live-connection"), // nothing works when style is set to display: block;
    auctionPausedWindow: document.getElementById("auctioneer-pause-overlay"),
    auctionPausedWindowButton: document.getElementById("btn-resume"),
    pauseAndResumeAuctionButton: document.getElementById("btn-pause"),
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
