import { on } from "events";
import { type PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://www.easyliveauction.com/auctioneer/index.cfm"],
  all_frames: true,
  run_at: "document_start",
};

document.addEventListener("DOMContentLoaded", () => {
  // find the element with the id of launchAuctioneer
  const launchAuctioneer = document.getElementById("launchAuctioneer");

  // get the contents of the onclick attribute
  const launchAuctioneerOnClick = launchAuctioneer.getAttribute("onclick");
  alert(launchAuctioneerOnClick);

  // "launchAuctioneer('32f22c89c0d5c49488edfe7f0120cab7b2cd883a378cede804dc80bf4ad6593c') parse the string to get the auction id
  const auctionId = launchAuctioneerOnClick.split("'")[1];

  // remove the onclick event listener
  launchAuctioneer.removeAttribute("onclick");

  // create a new event listener where it will open https://www.easyliveauction.com/live_v2/clerk.cfm?evtID= with the auction id
  launchAuctioneer.addEventListener("click", () => {
    window.open(
      `https://www.easyliveauction.com/live_v2/clerk.cfm?evtID=${auctionId}`,
      "_blank",
    );
  });
});
