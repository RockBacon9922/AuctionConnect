// TODO: Asking box doesn't update when new lot is selected
import { PersistGate } from "@plasmohq/redux-persist/integration/react";
import {
  persister,
  store,
  useAppDispatch,
  useAppSelector,
  useGetAuction,
  useGetCurrentLot,
} from "~store";
import { Provider } from "react-redux";

import "../style.css";

import { useMemo, useState } from "react";
import {
  Auction,
  createBid,
  createLot,
  selectAuction,
  setActiveLot,
  setAsk,
} from "~slices/auction-slice";

import { incrementPairs, increments } from "./Assets/increments";
import Wrapper from "./Assets/wrapper";

const Console = () => {
  // set Title of the page to console
  document.title = "Console: Gavel Connect";
  return (
    <div className="grid h-screen w-screen grid-cols-6 grid-rows-6 items-center gap-2 bg-gradient-to-br from-slate-300 to-slate-400 p-2">
      <LotNumber />
      <LotImage />
      <Box className="row-span-2 h-full flex-col bg-blue-600">
        <span>Easy Live ✔</span>
        <span>SaleRoom ❌</span>
        <i className="text-[0.35rem]">A/V Fault</i>
        <i className="text-[0.35rem]">Tab Not Open</i>
      </Box>
      <Button>Pass</Button>
      <Button>Sell</Button>
      <Button>Next Lot</Button>
      <div className="col-span-3 row-span-5 overflow-x-auto ">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Lot</th>
              <th>Description</th>
              <th>Estimate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>701</td>
              <td>description</td>
              <td>estimate</td>
            </tr>
            <tr>
              <td>702</td>
              <td>description</td>
              <td>estimate</td>
            </tr>
            <tr>
              <td>703</td>
              <td>description</td>
              <td>estimate</td>
            </tr>
            <tr>
              <td>704</td>
              <td>description</td>
              <td>estimate</td>
            </tr>
          </tbody>
        </table>
      </div>
      <BidLabel />
      <Button>Undo</Button>
      <Asking>Asking :</Asking>
      <Box className="row-span-3 h-full w-full flex-col gap-2 bg-blue-500 p-2">
        <Label className="w-[90%]">Quick Ask</Label>
        <Button className="w-[90%] bg-sky-300 hover:bg-sky-400">s</Button>
        <Button className="w-[90%] bg-sky-300 hover:bg-sky-400">s</Button>
        <Button className="w-[90%] bg-sky-300 hover:bg-sky-400">s</Button>
      </Box>
      <Button className="row-span-2">Bid</Button>
      <Button className="row-span-2">Split Bid</Button>
    </div>
  );
};

export default () => {
  return (
    <Wrapper>
      <Console />
    </Wrapper>
  );
};

const LotImage = () => {
  const auction = useAppSelector((state) => state.auction) as Auction;
  const currentLotId = auction.currentLotId;
  const currentLot = auction.lots.find((lot) => lot.id === currentLotId);
  return currentLot?.image ? (
    <div className="row-span-2 flex justify-start">
      <img
        className="h-20"
        src={currentLot?.image || "https://i.ibb.co/RS5zd7R/Desk.png"}
      />
    </div>
  ) : (
    <div className="row-span-2 flex aspect-square items-center justify-center border-2 text-center font-extrabold">
      <h2>No Image</h2>
    </div>
  );
};

const Button = ({ children, ...props }) => {
  // if props include b- in the class name, then use that colour
  // else use the default colour
  // check if props.className is undefined

  if (!props?.className?.includes("bg-")) {
    props.className += " bg-blue-500 hover:bg-blue-600";
  }
  props.className += " w-30 h-full rounded text-white";

  return <button {...props}>{children}</button>;
};

const BidLabel = () => {
  const [bgcolour, setBgColour] = useState("#1E40AF");
  const currentLot = useGetCurrentLot();
  // check if there are any bids
  if (!currentLot?.bids.length) {
    return (
      <div className="col-span-2 flex h-full items-center justify-center rounded text-center text-white"></div>
    );
  }
  // get the highest bid
  const highestBid = currentLot?.bids.reduce((prev, curr) => {
    return prev.amount > curr.amount ? prev : curr;
  });
  const colours = {
    easylive: ["#88dbff", "#50c4ff", "#28a6ff", "#0a70eb"],
    theSaleroom: ["#ed9ec8", "#eb6fa7", "#e04b8b", "#ca316a"],
  };
  setBgColour(
    useMemo(() => {
      // get current colour
      const currentColour = bgcolour;
      const newColour = bgcolour;
      if (highestBid.platform === "Room") {
        return "";
      }
      return colours[highestBid.platform][
        Math.floor(Math.random() * colours[highestBid.platform].length)
      ];
    }, [highestBid]),
  );

  return (
    <div
      className={
        "col-span-2 flex h-full items-center justify-center rounded text-center text-white"
      }
      style={{ backgroundColor: bgcolour }}
    >
      <h2>{highestBid.amount}</h2>
      <h3 className="text-md">{highestBid.platform}</h3>
    </div>
  );
};

const Label = ({ children, ...props }) => {
  props.className +=
    " text-center rounded text-white flex items-center justify-center";
  return (
    <div className={props.className}>
      <h3>{children}</h3>
    </div>
  );
};

const Box = ({ children, ...props }) => {
  props.className +=
    " text-center rounded text-white flex justify-center items-center";
  return <div className={props.className}>{children}</div>;
};

const Asking = ({ children }) => {
  const currentLot = useGetCurrentLot();
  const [asking, setReactAsking] = useState(currentLot?.asking.toString());
  const dispatch = useAppDispatch();
  return (
    <span className="col-span-2 flex h-full items-center justify-center rounded bg-blue-500 text-center text-white">
      <label
        style={{
          color: asking === currentLot?.asking.toString() ? "white" : "red",
        }}
      >
        Asking :{" "}
      </label>
      <input
        className="ml-2 w-[44%] text-black"
        inputMode="numeric"
        value={asking}
        onChange={(e) => setReactAsking(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            dispatch(setAsk(parseInt(asking) || currentLot?.asking));
          }
        }}
        pattern="[0-9]*"
        type="number"
      />
    </span>
  );
};

const Empty = () => {
  return <div className="bg-slate-950">a</div>;
};

const LotNumber = () => {
  // get current lot number
  const currentLotId = useAppSelector((state) => state.auction.currentLotId);
  return (
    <h1 className="row-span-2 text-xl font-extrabold">Lot {currentLotId}</h1>
  );
};
