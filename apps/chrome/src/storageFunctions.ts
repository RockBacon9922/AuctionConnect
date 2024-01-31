import { getState } from "~store";

export const getCurrentLot = () => {
  const auction = getState().auction;
  return auction.lots.find((lot) => lot.id === auction.currentLotId);
};
