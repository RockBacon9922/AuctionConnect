import { useEffect, useState } from "react";
import {
  resetState,
  setAuctionDate,
  setAuctionName,
  setLotNumber,
  setSetup,
} from "~slices/auction-slice";
import { RootState, useAppDispatch, useAppSelector } from "~store";
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
        Auction Connect
      </h1>
      {setup ? <ToConsole /> : <Setup />}
      <ul>
        <li>
          <h3>SaleRoom: ✔</h3>
        </li>
        <li>
          <h3>Easy Live: ✔</h3>
        </li>
      </ul>
      <Version />
      <Reset />
    </div>
  );
}

export default () => (
  <Wrapper>
    <IndexPopup />
  </Wrapper>
);
const Setup = () => {
  // create a rfc which is used to set the auction name and date
  const dispatch = useAppDispatch();
  const auctionName = useAppSelector((state: RootState) => state.auction.name);
  const auctionDateString: string = useAppSelector(
    (state: RootState) => state.auction.date,
  );
  const setup = useAppSelector((state) => state.auction.setup);

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col">
        <label htmlFor="auctionName">Auction Name</label>
        <input
          type="text"
          name="auctionName"
          value={auctionName}
          onChange={(e) => dispatch(setAuctionName(e.target.value))}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="auctionDate">Auction Date</label>
        <input
          type="date"
          name="auctionDate"
          value={auctionDateString}
          onChange={(e) => dispatch(setAuctionDate(e.target.value))}
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
              chrome.windows.update(tabs[0].windowId, { focused: true });
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
