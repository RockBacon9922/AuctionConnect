import { useEffect, useState } from "react";
import {
  resetState,
  setActiveLot,
  setAuctionDate,
  setAuctionName,
  setSetup,
} from "~slices/auction-slice";
import { useAppDispatch, useGetAuction } from "~store";
import Wrapper from "~tabs/Assets/wrapper";

function IndexPopup() {
  // get if setup is complete
  const setup = useGetAuction().setup;
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
  const auction = useGetAuction();
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col">
        <label htmlFor="auctionName">Auction Name</label>
        <input
          type="text"
          name="auctionName"
          defaultValue={auction.name}
          onChange={(e) => dispatch(setAuctionName(e.target.value))}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="auctionDate">Auction Date</label>
        <input
          type="date"
          name="auctionDate"
          defaultValue={auction.date}
          onChange={(e) => dispatch(setAuctionDate(e.target.value))}
        />
      </div>
      {/* auction lot start number */}
      <div className="flex flex-col">
        <label htmlFor="auctionLotStart">Auction Lot Start</label>
        <input
          type="number"
          name="auctionLotStart"
          defaultValue={auction.currentLotId}
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
      }}
    >
      Reset
    </button>
  );
};
