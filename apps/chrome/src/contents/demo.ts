import { Auction, selectAuction } from "~slices/auction-slice";
import { Platform, selectPlatform } from "~slices/platform-slice";
import { persister, store } from "~store";
import { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://dev.gavelconnect.com/demo", "https://localhost:3000/demo"],
  all_frames: true,
  run_at: "document_start",
};

const auctionState: Auction = selectAuction(store.getState());
const platformState: Platform[] = selectPlatform(store.getState());

persister.subscribe(() => {
  auctionState.lots.forEach((lot) => {
    console.log(lot);
    alert("hi");
  });
});

addEventListener("DOMContentLoaded", () => {
  const counter = document.getElementById("count");

  const delay = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  store.subscribe(() => {
    console.log("store updated");
    updateInput("word", "70");
  });
});

const updateInput = (id: string, value: string) => {
  const input = document.getElementById(id);
  // React >=16
  var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  ).set;
  nativeInputValueSetter.call(input, value);

  // i know for a fact that "input" event works for react. "change" event works for blazor and react let's hope that works for everything.
  var ev = new Event("change", { bubbles: true });
  input.dispatchEvent(ev);
};
