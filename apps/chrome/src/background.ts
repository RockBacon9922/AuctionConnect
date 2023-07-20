import { getState, persister } from "~store";

export {};

persister.subscribe(() => {
  // This is going to get the current lot. All the bids and sort the bids by amount from highest to lowest
  const auctionState = getState().auction;
  // get current lot
  const lot = auctionState.lots.find(
    (lot) => lot.id === auctionState.currentLotId,
  );
  // if environment is not production log state
  if (process.env.NODE_ENV !== "production") {
    console.debug("auction state", auctionState);
  }
  // if lot is not in auction state return
  if (!lot) return;

  // for each bid in lot bids
  lot.bids.sort((a, b) => b.amount - a.amount);
});
