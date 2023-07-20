import { sortBids } from "~slices/auction-slice";
import { getState, persister, store } from "~store";

export {};

persister.subscribe(() => {
  // This is going to get the current lot. All the bids and sort the bids by amount from highest to lowest
  const auctionState = getState().auction;
  // Check if auction state has lots
  if (!auctionState?.lots?.length) return;
  // get current lot
  const lot = auctionState?.lots?.find(
    (lot) => lot.id === auctionState?.currentLotId,
  );
  // if environment is not production log state
  if (process.env.NODE_ENV !== "production") {
    console.debug("auction state", auctionState);
  }
  store.dispatch(sortBids(lot.id));
});
