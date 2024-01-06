import { getState } from "~store";

export const getCurrentLot = () => {
  const auction = getState().auction;
  const lotNumber = auction.currentLotId;
  return auction.lots.find((lot) => lot.id === lotNumber);
};
