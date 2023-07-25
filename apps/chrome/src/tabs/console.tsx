/* eslint-disable @next/next/no-img-element */
// TODO: Asking box doesn't update when new lot is selected
import {
  getState,
  store,
  useAppDispatch,
  useGetAuction,
  useGetCurrentLot,
} from "~store";

import "../style.css";

import { get } from "http";
import { useEffect, useState } from "react";
import { createBid, setAsk } from "~slices/auction-slice";

import getIncrementForPrice from "@acme/increments";

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
      <LotTable />
      <BidLabel />
      <Button>Undo</Button>
      <Asking />
      <Box className="row-span-3 h-full w-full flex-col gap-2 bg-blue-500 p-2">
        <Label className="w-[90%]">Quick Ask</Label>
        <Button className="w-[90%] bg-sky-300 hover:bg-sky-400">s</Button>
        <Button className="w-[90%] bg-sky-300 hover:bg-sky-400">s</Button>
        <Button className="w-[90%] bg-sky-300 hover:bg-sky-400">s</Button>
      </Box>
      <Button className="row-span-2" onClick={handleBid}>
        Bid
      </Button>
      <Button className="row-span-2">Split Bid</Button>
    </div>
  );
};

const Export = () => {
  return (
    <Wrapper>
      <Console />
    </Wrapper>
  );
};

export default Export;

const LotImage = () => {
  const auction = useGetAuction();
  const currentLotId = auction.currentLotId;
  const currentLot = auction.lots.find((lot) => lot.id === currentLotId);
  return currentLot?.image ? (
    <div className="row-span-2 flex justify-start">
      <img
        className="h-20"
        src={currentLot?.image || "https://i.ibb.co/RS5zd7R/Desk.png"}
        alt="Lot Image"
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
  // get the highest bid
  const highestBid = currentLot?.bids[0];

  // check if there are any bids
  if (!currentLot.bids.length) {
    return (
      <div className="col-span-2 flex h-full items-center justify-center rounded text-center text-white"></div>
    );
  } else if (highestBid?.bidder === "Room") {
    return (
      <div className="col-span-2 flex h-full items-center justify-center rounded text-center text-black">
        <h2>Room: {highestBid.amount}</h2>
      </div>
    );
  }

  return (
    <div
      className={
        "col-span-2 flex h-full items-center justify-center rounded text-center text-white"
      }
      style={{ backgroundColor: bgcolour }}
    >
      <h2>
        {highestBid?.platform.slice(0, 2).toUpperCase()}:
        {highestBid?.bidder.slice(0, 8)}:{highestBid?.amount}
      </h2>
    </div>
  );
};

const Label = ({ children, ...props }) => {
  props.className +=
    " text-center rounded text-white flex items-center justify-center";
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <div className={props.className}>
      <h3>{children}</h3>
    </div>
  );
};

const Box = ({ children, ...props }) => {
  props.className +=
    " text-center rounded text-white flex justify-center items-center";
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return <div className={props.className}>{children}</div>;
};

const Asking = () => {
  const currentLot = useGetCurrentLot();
  const [asking, setReactAsking] = useState(currentLot?.asking.toString());
  const dispatch = useAppDispatch();
  useEffect(() => {
    setReactAsking(currentLot?.asking.toString());
  }, [currentLot?.asking]);
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

const LotNumber = () => {
  // get current lot number
  const currentLotId = useGetCurrentLot()?.id;
  return (
    <h1 className="row-span-2 text-xl font-extrabold">Lot {currentLotId}</h1>
  );
};

const LotTable = () => {
  const auction = useGetAuction();
  return (
    <div className="col-span-3 row-span-5 overflow-x-auto ">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Lot</th>
            <th>Description</th>
            <th>Hammer</th>
          </tr>
        </thead>
        <tbody>
          {auction?.lots.map((lot) => (
            <tr key={lot.id}>
              <td>{lot.id}</td>
              <td>{lot.description}</td>
              <td>{lot.bids[0]?.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const handleBid = () => {
  const currentLot = getState().auction.lots.find(
    (e) => getState().auction.currentLotId === e.id,
  );
  // create a new bid
  // set bid platform to "Room"
  // set bid amount to the asking price
  const bid = {
    bidder: "Room",
    amount: currentLot.asking,
    platform: "GavelConnect",
    lotId: currentLot.id,
  };
  // add the bid to the current lot
  store.dispatch(createBid(bid));
};
