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
  if (!lot) return;
  store.dispatch(sortBids(lot.id));
});

persister.subscribe(() => {
  // sort lots by lot number. lot numbers may have letters in them e.g lot 100 101 102A 103
  const auctionState = getState().auction;
  if (!auctionState.lots.length) return;
  // create auction state copy
  const auctionStateCopy = { ...auctionState, lots: [...auctionState.lots] };
  auctionStateCopy.lots.sort((a, b) => {
    // use regex to get the number from the lot number
    const aNum = Number(a.id.match(/\d+/g)?.join(""));
    const bNum = Number(b.id.match(/\d+/g)?.join(""));
    if (aNum === bNum) {
      // if the numbers are the same then check if there is a letter
      const aLetter = a.id.match(/[a-zA-Z]+/g)?.join("");
      const bLetter = b.id.match(/[a-zA-Z]+/g)?.join("");
      if (!aLetter) return -1;
      if (!bLetter) return 1;
      return aLetter.localeCompare(bLetter);
    }
    return aNum - bNum;
  });
  store.dispatch({ type: "auction/setLots", payload: auctionStateCopy.lots });
});
