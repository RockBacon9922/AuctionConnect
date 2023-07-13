import {
  Auction,
  createBid,
  createLot,
  selectAuction,
} from "~slices/auction-slice";
import { persister, RootState, store } from "~store";
import type { PlasmoCSConfig } from "plasmo";

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
