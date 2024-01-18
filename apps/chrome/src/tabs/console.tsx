// TODO: Asking box doesn't update when new lot is selected
// TODO: System to help user fix errors
// TODO: Show when a platform has disconnected
import { getState, store } from "~store";

import "../style.css";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { getAskFromPrice, getIncrementFromPrice } from "@acme/increments";

import {
  useAppDispatch,
  useAppSelector,
  useGetCurrentLotSelector,
} from "~hooks";
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
      <main className="w-full flex flex-col justify-end">
        <div className="w-full h-full flex justify-center items-center">
          <AskComponent />
        </div>
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
  const currentLotId = useAppSelector((state) => state.auction).currentLotId;
  const currentLot = useGetCurrentLotSelector();
  const currentIncrement = useMemo(
    () =>
      getIncrementFromPrice(
        currentLot?.bids[0]?.amount || currentLot?.asking || 0,
      ),
    [currentLot],
  );
  console.log(currentLot);
  if (!currentLot) {
    return (
      <div className="text-white text-2xl font-bold">
        Lot {currentLotId} not found
      </div>
    );
  }
  return (
    <div className="text-white font-semibold flex flex-col gap-4">
      <AskButton price={currentIncrement * 2 + currentLot.asking} />
      <AskButton price={currentIncrement + currentLot.asking} />
      <AskButton price={currentIncrement / 2 + currentLot.asking} />
      <PriceComponent price={currentLot.asking} background border />
      <AskButton price={currentLot.asking - currentIncrement / 2} />
      <AskButton price={currentLot.asking - currentIncrement} />
      <AskButton price={currentLot.asking - currentIncrement * 2} />
    </div>
  );
};

const AskButton = ({ price }: { price: number }) => {
  const currentLot = useGetCurrentLotSelector();
  const dispatch = useAppDispatch();
  return (
    <div onClick={() => dispatch(setAsk(price))}>
      <PriceComponent price={price} background />
    </div>
  );
};

const PriceComponent = ({
  price,
  border = false,
  background = false,
}: {
  price: number;
  border?: boolean;
  background?: boolean;
}) => {
  return (
    <div
      className={cn(
        "py-4 w-64 text-center text-2xl font-bold cursor-pointer",
        border && "border-abbey-50 border-2",
        background && "bg-abbey-900",
      )}
    >
      £ {price}
    </div>
  );
};
