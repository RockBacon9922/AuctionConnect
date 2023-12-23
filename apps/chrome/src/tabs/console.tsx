// TODO: Asking box doesn't update when new lot is selected
// TODO: System to help user fix errors
// TODO: Show when a platform has disconnected
import { getState, store } from "~store";

import "../style.css";

import { useEffect, useState, type ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "~hooks";
import { createBid, setAsk } from "~slices/auction-slice";
import { cn } from "~utils/cn";

import Wrapper from "./Assets/wrapper";

const Logo = () => (
  <img
    src="https://www.gavelconnect.com/_astro/V5Light.l7c59huP_Z2eePU1.svg"
    alt="logo"
    width={110}
  />
);

const LotListItem: React.FC<{
  LotId: string;
  LotImage: string;
  LotDescription: string;
}> = ({ LotId, LotImage, LotDescription }) => {
  const selected = false;
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between w-full px-2 py-2 border-b-2 border-white",
        selected ? "bg-abbey-600" : "bg-abbey-700",
      )}
    >
      <div className="flex flex-row items-center">
        <img src={LotImage} alt="lot" width={50} />
        <p className="text-white text-sm ml-2">{LotDescription}</p>
      </div>
      <p className="text-white text-sm">{LotId}</p>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="flex flex-col h-screen border-2 w-40 border-white items-center py-2">
      <Logo />
    </div>
  );
};

const Console = () => {
  // set Title of the page to console
  document.title = "Console: Gavel Connect";
  return (
    <div className="w-full h-screen bg-abbey-700">
      <div className="bg-[url('https://www.gavelconnect.com/_astro/Background%20Pattern.JR-1fO_V_1qoH8c.webp')] bg-cover bg-opacity-100 flex flex-row">
        <Sidebar />
      </div>
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
