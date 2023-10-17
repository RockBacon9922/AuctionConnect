import { type PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://www.easyliveauction.com/auctioneer/index.cfm"],
  all_frames: true,
  run_at: "document_start",
};

// modify index.cfm to open the auctioneer in a new tab

document.addEventListener("DOMContentLoaded", () => {
  // find the element with the id of launchAuctioneer
  const launchAuctioneer = document.getElementById("launchAuctioneer");

  // get the contents of the onclick attribute
  const auctionId = launchAuctioneer.getAttribute("onclick").split("'")[1];

  // Because i can't remove the onClick event listener, i'm and going to create a new button copy the styles from the old button and place it into the new one. I am also going to move the image inside the old button into the new one.
  // create a new button
  const newButton = document.createElement("button");
  // copy the styles from the old button
  newButton.setAttribute("style", launchAuctioneer?.getAttribute("style"));
  // move the image into the new button
  newButton.appendChild(launchAuctioneer.children[0]);

  // create a new event listener where it will open https://www.easyliveauction.com/live_v2/clerk.cfm?evtID= with the auction id
  newButton.addEventListener("click", () => {
    window.open(
      `https://www.easyliveauction.com/live_v2/clerk.cfm?evtID=${auctionId}`,
      "_blank",
    );
  });

  // replace the old button with the new one
  launchAuctioneer.replaceWith(newButton);
});
