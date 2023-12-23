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

const Console = () => {
  // set Title of the page to console
  document.title = "Console: Gavel Connect";
  return <div className="w-full h-screen bg-abbey-700 flex flex-row"></div>;
};

const Export = () => {
  return (
    <Wrapper>
      <Console />
    </Wrapper>
  );
};

export default Export;

const Sidebar = () => {
  return (
    <div className="flex flex-col h-screen border-2 border-white">
      some test
    </div>
  );
};
