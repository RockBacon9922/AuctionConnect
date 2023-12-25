// TODO: Asking box doesn't update when new lot is selected
// TODO: System to help user fix errors
// TODO: Show when a platform has disconnected
import { getState, store } from "~store";

import "../style.css";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "~hooks";
import { createBid, setActiveLot, setAsk } from "~slices/auction-slice";
import { cn } from "~utils/cn";

import Wrapper from "./Assets/wrapper";

const Logo = () => (
  <img
    src="https://www.gavelconnect.com/_astro/V5LightInnerShadow.qVRUR3pd_Z22S8dR.svg"
    alt="logo"
    width={110}
  />
);

const LotListItem: React.FC<{
  LotId: string;
  LotImage: string;
  LotDescription: string;
  selected: boolean;
}> = ({ LotId, LotImage, LotDescription, selected }) => {
  const dispatch = useAppDispatch();
  const selfRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selected) {
      selfRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "start",
      });
    }
  }, [selected]);
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-start gap-3 w-max px-2 py-2 bg-white cursor-pointer",
        selected ? "bg-opacity-20" : "bg-opacity-0",
      )}
      onClick={() => dispatch(setActiveLot(LotId))}
      ref={selfRef}
    >
      <img src={LotImage} alt="lot" width={50} />
      <div className="flex flex-col w-full">
        <p className="text-white font-bold">{LotId}</p>
        <p className="text-white text-xs truncate h-2 w-full pr-10 overflow-clip">
          {LotDescription}
        </p>
      </div>
    </div>
  );
};

const Sidebar = () => {
  // get state from redux
  const { auction } = useAppSelector((state) => state);
  return (
    <div className="flex flex-col h-screen w-[25%] items-center py-2 bg-white bg-opacity-5">
      <Logo />
      <div className="flex flex-col w-full mt-4 overflow-y-scroll">
        {auction.lots.map((lot) => (
          <LotListItem
            key={lot.id}
            LotId={lot.id}
            LotImage={lot.image}
            LotDescription={lot.description}
            selected={lot.id === auction.currentLotId}
          />
        ))}
      </div>
    </div>
  );
};

const Console = () => {
  // set Title of the page to console
  document.title = "Console: Gavel Connect";
  return (
    <div className="w-full h-screen bg-abbey-800">
      <Sidebar />
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
