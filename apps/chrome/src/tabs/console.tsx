// TODO: Asking box doesn't update when new lot is selected
// TODO: System to help user fix errors
// TODO: Show when a platform has disconnected
import { getState, store } from "~store";

import "../style.css";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { useAppDispatch, useAppSelector } from "~hooks";
import { createBid, setActiveLot, setAsk } from "~slices/auction-slice";
import { cn } from "~utils/cn";
import Sidebar from "./Assets/Sidebar";
import { StatusBar } from "./Assets/StatusBar";
import Wrapper from "./Assets/wrapper";

const Console = () => {
  // set Title of the page to console
  document.title = "Console: Gavel Connect";
  return (
    <div className="h-screen bg-abbey-800 flex">
      <Sidebar />
      <main className="w-full flex relative">
        <StatusBar />
      </main>
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

const AskComponent = () => {
  const dispatch = useAppDispatch();
  const currentLotNumber = useAppSelector(
    (state) => state.auction.currentLotId,
  );
  const currentLot = useAppSelector(
    (state) => state.auction.lots[currentLotNumber],
  );
  return <></>;
};
