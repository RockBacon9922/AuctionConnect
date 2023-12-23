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

const Sidebar = () => {
  return (
    <div className="flex flex-col h-screen border-2 w-40 border-white items-center">
      <img
        src="https://www.gavelconnect.com/_astro/V5Light.l7c59huP_Z2eePU1.svg"
        alt="logo"
        width={100}
      />
    </div>
  );
};

const Console = () => {
  // set Title of the page to console
  document.title = "Console: Gavel Connect";
  return (
    <div className="w-full h-screen bg-abbey-700">
      <div className="bg-[url('https://www.gavelconnect.com/_astro/Background%20Pattern.JR-1fO_V_1qoH8c.webp')] bg-cover flex flex-row">
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
