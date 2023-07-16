import { Auction, selectAuction } from "~slices/auction-slice";
import { Platform, selectPlatform } from "~slices/platform-slice";
import { persister, store } from "~store";
import { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://dev.gavelconnect.com/demo"],
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

  const func = async () => {
    await delay(1000);
    console.log("hi");
    counter.innerText = String(parseInt(counter.innerText) + 1);
  };

  const click = () => {
    console.log("clicked");
    counter.click();
  };

  store.subscribe(() => {
    console.log("store updated");
    click();
  });
});
