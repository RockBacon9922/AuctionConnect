import { useEffect, useState } from "react";
import {
  resetState,
  setAuctionDate,
  setAuctionHouse,
  setAuctionName,
} from "~slices/auction-slice";

function IndexPopup() {
  // get extension id
  const extensionId = chrome.runtime.getURL("").split("/")[2];
  // get extension version
  const manifest = chrome.runtime.getManifest();
  const version = manifest.version;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 200,
        padding: 10,
      }}
    >
      <h1
        style={{
          paddingBottom: 0,
          margin: 0,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        Auction Connect
      </h1>
      <ToConsole />
      <ul>
        <li>
          <h3>SaleRoom: ✔</h3>
        </li>
        <li>
          <h3>Easy Live: ✔</h3>
        </li>
      </ul>
      <p>Version: {version}</p>
    </div>
  );
}

export default IndexPopup;

const ToConsole = () => {
  const [buttonText, setButtonText] = useState("Launch Console");
  const extensionId = chrome.runtime.getURL("").split("/")[2];

  // remove event listener when component unmounts
  useEffect(() => {
    chrome.tabs.query(
      {
        url: "chrome-extension://" + extensionId + "/tabs/console.html",
      },
      (tabs) => {
        if (tabs.length > 0) {
          setButtonText("Open Opened Console");
        } else {
          setButtonText("Launch Console");
        }
      },
    );
  }, [chrome.tabs.onUpdated, chrome.tabs.onCreated]);
  return (
    <button
      onClick={() => {
        // check if console is open
        chrome.tabs.query(
          {
            url: "chrome-extension://" + extensionId + "/tabs/console.html",
          },
          (tabs) => {
            if (tabs.length > 0) {
              // if console is open then bring it into view
              chrome.tabs.update(tabs[0].id, { active: true });
              return;
            } else {
              chrome.tabs.create({
                url: "chrome-extension://" + extensionId + "/tabs/console.html",
              });
            }
          },
        );
      }}
    >
      {buttonText}
    </button>
  );
};
