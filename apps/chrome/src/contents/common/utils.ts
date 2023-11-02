import { createLot, setActiveLot } from "~slices/auction-slice";
import { getState, store } from "~store";

import { updateInput } from "@acme/element-operations";

export const setAsk = (askInput: HTMLInputElement, ask: number) => {
  updateInput(askInput, ask.toString());
  askInput.click();
};
