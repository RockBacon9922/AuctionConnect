import { createLot, setActiveLot } from "~slices/auction-slice";
import { getState, store } from "~store";

import { updateInput } from "@acme/element-operations";

export const setAsk = (askInput: HTMLInputElement, ask: number) => {
  updateInput(askInput, ask.toString());
  askInput.click();
};

export const createOrUpdateActiveLot = (
  lotId: string,
  asking: number,
  description: string,
  highEstimate: number,
  lowEstimate: number,
  image: string,
) => {
  const lotExists = getState().auction.lots.some((lot) => lot.id === lotId);
  // if lot does not exist. Create it!!!
  if (!lotExists) {
    store.dispatch(
      createLot({
        id: lotId,
        asking: asking,
        bids: [],
        description,
        highEstimate,
        lowEstimate,
        image,
        state: "unsold",
      }),
    );
  }
  store.dispatch(setActiveLot(lotId));
};
