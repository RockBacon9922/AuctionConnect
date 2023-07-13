import { PersistGate } from "@plasmohq/redux-persist/integration/react";
import { persister, store, useAppDispatch, useAppSelector } from "~store";
import { Provider } from "react-redux";

import "../style.css";

import { useState } from "react";
import { createBid, createLot, setLotNumber } from "~slices/auction-slice";

import { incrementPairs, increments } from "./Assets/increments";

const Console = () => {
  return (
    <div className="grid h-screen w-screen grid-cols-6 grid-rows-6 items-center gap-2 bg-gradient-to-br from-slate-300 to-slate-400 p-2">
      <h1 className="row-span-2 text-xl font-extrabold">Lot 701</h1>
      <div className="row-span-2 flex justify-start">
        <img className="h-20" src="https://i.ibb.co/6D5pzNZ/Antique-Desk.png" />
      </div>
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
      <BidLabel className="col-span-2 h-10">s</BidLabel>
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

const BidLabel = ({ children, ...props }) => {
  props.className +=
    " h-full text-center rounded text-white flex items-center justify-center";
  return (
    <div
      className={props.className}
      style={{ backgroundColor: props.bgcolour }}
    >
      <h3>{children}</h3>
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

const Asking = ({ children, ...props }) => {
  const [asking, setAsking] = useState();
  props.className +=
    " h-full text-center rounded text-white flex items-center justify-center bg-blue-500 col-span-2";
  const keyDownHandler = (e) => {
    if (e.key === "Enter") {
      props.submit();
      // highlight the input
      e.target.select();
    }
  };
  return (
    <span className={props.className}>
      <label>Asking : </label>
      <input
        className="ml-2 w-[44%] text-black"
        inputMode="numeric"
        value={props.asking}
        onChange={props.handler}
        onKeyDown={keyDownHandler}
        pattern="[0-9]*"
        type="number"
      />
    </span>
  );
};

const Empty = () => {
  return <div className="bg-slate-950">a</div>;
};

const Wrapper = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persister}>
        <Console />
      </PersistGate>
    </Provider>
  );
};

export default Wrapper;
