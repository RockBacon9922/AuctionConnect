// TODO: Asking box doesn't update when new lot is selected
// TODO: System to help user fix errors
// TODO: Show when a platform has disconnected
import { getState, store } from "~store";

import "../style.css";

import { useAppDispatch, useAppSelector } from "~hooks";
import { createBid, setAsk } from "~slices/auction-slice";
import { cn } from "~utils/cn";

import Wrapper from "./Assets/wrapper";

const Console: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-pink-300 to-green-300 w-full h-screen flex flex-row">
      <div className="bg-white w-1/4 bg-opacity-25 ml-1 mt-1 mb-1">hey</div>
    </div>
  );
};

export default Console;
