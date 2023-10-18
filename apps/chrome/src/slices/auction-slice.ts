import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

const bid = z.object({
  amount: z.number(),
  platform: z.string(),
  bidder: z.string(),
});

const lot = z.object({
  id: z.string(),
  description: z.string(),
  image: z.string(),
  lowEstimate: z.number(),
  highEstimate: z.number(),
  asking: z.number(),
  bids: z.array(bid),
  state: z.enum(["unsold", "sold", "passed"]),
});

export const auction = z.object({
  setup: z.boolean(),
  paused: z.boolean(),
  started: z.boolean(),
  date: z.string(),
  currentLotId: z.string(),
  name: z.string(),
  lots: z.array(lot),
});

export type Auction = z.infer<typeof auction>;
export type Lot = z.infer<typeof lot>;
export type Bid = z.infer<typeof bid>;
const currentDate = new Date().toISOString().split("T")[0];

const initialState: Auction = {
  setup: false,
  paused: false,
  started: false,
  date: currentDate,
  name: "",
  currentLotId: "0",
  lots: [],
};

export interface CreateBid extends Bid {
  lotId: string;
}

const auctionSlice = createSlice({
  name: "auction",
  initialState,
  reducers: {
    setSetup: (state, action: PayloadAction<boolean>) => {
      state.setup = action.payload;
    },
    setAuctionName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setAuctionDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
    setActiveLot: (state, action: PayloadAction<string>) => {
      state.currentLotId = action.payload;
    },
    setAuctionHouse: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    createLot: (state, action: PayloadAction<Lot>) => {
      const payload = lot.parse(action.payload);
      state.lots.push(payload);
    },
    setAsk: (state, action: PayloadAction<number>) => {
      const lot = state.lots.find((lot) => lot.id === state.currentLotId);
      if (!lot) throw new Error("Lot not found");
      lot.asking = action.payload;
    },
    createBid: (state, action: PayloadAction<CreateBid>) => {
      const lot = state.lots.find((lot) => lot.id === action.payload.lotId);
      if (!lot) throw new Error("Lot not found");
      lot.bids.push({
        amount: action.payload.amount,
        platform: action.payload.platform,
        bidder: action.payload.bidder,
      });
    },
    resetState: (state) => {
      // get current name of auction
      return {
        setup: false,
        paused: false,
        started: false,
        date: currentDate,
        name: state.name,
        currentLotId: "0",
        lots: [],
      };
    },
    sortBids: (state, action: PayloadAction<string>) => {
      const lot = state.lots.find((lot) => lot.id === action.payload);
      if (!lot || lot.bids.length <= 1) return;
      lot.bids.sort((a, b) => b.amount - a.amount);
    },
  },
});

export const {
  setSetup,
  setAuctionName,
  setAuctionDate,
  setAuctionHouse,
  setActiveLot,
  createLot,
  createBid,
  setAsk,
  sortBids,
  resetState,
} = auctionSlice.actions;

export default auctionSlice.reducer;
