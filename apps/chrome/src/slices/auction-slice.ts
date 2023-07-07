import { createSlice } from "@reduxjs/toolkit";
import { z } from "zod";

const bid = z.object({
  amount: z.number(),
  platform: z.string(),
  bidderId: z.string(),
});

const lot = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  lowEstimate: z.number(),
  highEstimate: z.number(),
  asking: z.number(),
  bids: z.array(bid),
  state: z.enum(["unsold", "sold"]),
});

export const auction = z.object({
  date: z.date(),
  currentLotNumber: z.number(),
  name: z.string(),
  lots: z.array(lot),
});

export type Auction = z.infer<typeof auction>;
export type Lot = z.infer<typeof lot>;
export type Bid = z.infer<typeof bid>;

const auctionSlice = createSlice({
  name: "auction",
  initialState: {
    date: new Date(),
    name: "",
    currentLotNumber: 0,
    lots: [],
  },
  reducers: {
    createAuction: (state, action) => {
      const payload = auction.parse(action.payload);
      state.date = payload.date;
      state.name = payload.name;
      state.lots = payload.lots;
    },
    createLot: (state, action) => {
      const payload = lot.parse(action.payload);
      state.lots.push(payload);
    },
    createBid: (state, action) => {
      const payload = bid.parse(action.payload);
      const lot = state.lots.find((lot) => lot.id === state.currentLotNumber);
      if (!lot) throw new Error("Lot not found");
      if (lot.state === "sold") return;
      lot.bids.push(payload);
    },
    setLotNumber: (state, action) => {
      state.currentLotNumber = action.payload;
    },
  },
});

export const { createAuction, createLot, createBid, setLotNumber } =
  auctionSlice.actions;

export default auctionSlice.reducer;
