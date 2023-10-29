import {
  createBid,
  createLot,
  setActiveLot,
  type CreateBid,
} from "~slices/auction-slice";
import { getState, persister, store } from "~store";

import { updateInput } from "@acme/element-operations";

// I need to redo all the functions below but the input argument is a HTMLElement or HTMLInputElement respectively

export const getLot = (currentLot: HTMLElement) => {
  return currentLot.innerText.replace("Lot ", "");
};

export const getImage = (lotImage: HTMLImageElement) => {
  // get image url
  return lotImage.src;
};

export const getAsk = (ask: HTMLElement) => {
  return ask.innerText.replace("Asking: ", "").replace(",", "");
};

export const getHammer = (hammer: HTMLElement) => {
  return hammer.innerText.replace("Bid: ", "").replace(",", "");
};

export const getLowEstimate = (lowEstimate: HTMLElement) => {
  return lowEstimate.innerText
    .replace("Est: ", "")
    .replaceAll("£", "")
    .split(" - ")[0];
};

export const getHighEstimate = (highEstimate: HTMLElement) => {
  return highEstimate.innerText
    .replace("Est: ", "")
    .replaceAll("£", "")
    .split(" - ")[1];
};

export const getDescription = (description: HTMLElement) => {
  return description.innerText.replace("description: ", "");
};

export const getBidder = (currentBidder: HTMLElement) => {
  return currentBidder.innerText;
};

export const setAsk = (askInput: HTMLInputElement, ask: number) => {
  updateInput(askInput, ask.toString());
  askInput.click();
};

export const clickBid = (bidButton: HTMLElement) => {
  bidButton.click();
};

export const clickSold = (sellButton: HTMLElement) => {
  sellButton.click();
};

export const clickPass = (passButton: HTMLElement) => {
  passButton.click();
};

export const clickRoom = (roomButton: HTMLElement) => {
  roomButton.click();
};

export const clickNextLot = (nextLotButton: HTMLElement) => {
  nextLotButton.click();
};

const createOrUpdateActiveLot = (
  lotId: string,
  asking: number,
  description: string,
  highEstimate: number,
  lowEstimate: number,
  image: string,
) => {
  const lotExists = getState().auction.lots.some((lot) => lot.id === lotId);
  // if lot does not exist. Create it!!!
  if (!lotExists) {
    store.dispatch(
      createLot({
        id: lotId,
        asking: asking,
        bids: [],
        description,
        highEstimate,
        lowEstimate,
        image,
        state: "unsold",
      }),
    );
  }
  store.dispatch(setActiveLot(lotId));
};
