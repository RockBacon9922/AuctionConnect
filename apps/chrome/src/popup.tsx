// TODO: UI needs to stay in time with the state. e.g if i reset the auction one day and go to reset it on a different day the UI should like the state update with the new date

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "~hooks";
import {
  resetState,
  setActiveLot,
  setAuctionDate,
  setAuctionName,
  setSetup,
} from "~slices/auction-slice";
import { resetPlatformData } from "~slices/platform-slice";
import Wrapper from "~tabs/Assets/wrapper";

function IndexPopup() {
  // get if setup is complete
  const setup = useAppSelector((state) => state.auction.setup);
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
        Gavel Connect
      </h1>
      {setup ? (
        <ToConsole />
      ) : (
        <div>
          {process.env.NODE_ENV === "development" && <ToConsole />}
          <Setup />
        </div>
      )}
      <Version />
      <Reset />
      by William Stoneham
    </div>
  );
}

const Export = () => (
  <Wrapper>
    <IndexPopup />
  </Wrapper>
);
export default Export;

const Setup = () => {
  // create a rfc which is used to set the auction name and date
  const dispatch = useAppDispatch();
  const auction = useAppSelector((state) => state.auction);
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col">
        <label htmlFor="auctionName">Auction Name</label>
        <input
          type="text"
          name="auctionName"
          value={auction.name}
          onChange={(e) => dispatch(setAuctionName(e.target.value))}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="auctionDate">Auction Date</label>
        <input
          type="date"
          name="auctionDate"
          value={auction.date}
          onChange={(e) => dispatch(setAuctionDate(e.target.value))}
        />
      </div>
      {/* auction lot start number */}
      <div className="flex flex-col">
        <label htmlFor="auctionLotStart">current lot</label>
        <input
          type="number"
          name="auctionLotStart"
          value={auction.currentLotId}
          onChange={(e) => dispatch(setActiveLot(e.target.value))}
        />
      </div>
      <button
        onClick={() => {
          dispatch(setSetup(true));
        }}
      >
        Confirm
      </button>
    </div>
  );
};

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
          setButtonText("Goto Opened Console");
        } else {
          setButtonText("Launch Console");
        }
      },
    );
  }, [extensionId]);
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
              // check if tab id is found
              if (!tabs[0].id) throw new Error("Tab id not found");
              // if console is open then bring it into view
              void chrome.tabs.update(tabs[0].id, { active: true });
              void chrome.windows.update(tabs[0].windowId, { focused: true });
              return;
            } else {
              void chrome.tabs.create({
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

const Version = () => {
  const manifest = chrome.runtime.getManifest();
  const version = manifest.version;
  return <p>Version: {version}</p>;
};

const Reset = () => {
  const dispatch = useAppDispatch();
  return (
    <button
      onClick={() => {
        dispatch(resetState());
        dispatch(resetPlatformData());
      }}
    >
      Reset
    </button>
  );
};
