import { stat } from "fs";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

const bid = z.object({
  amount: z.number(),
  platform: z.string(),
  bidder: z.string(),
  createdAt: z.date(),
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

const initialState: Auction = {
  setup: false,
  started: false,
  paused: false,
  date: new Date().toISOString().split("T")[0],
  name: "",
  currentLotId: "0",
  lots: [],
};

export interface CreateBid extends Bid {
  id: string;
}
export interface UpdateLot {
  id: string;
  changes: Partial<Lot>;
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
    createBid: (state, action: PayloadAction<CreateBid>) => {
      const payload = action.payload;
      const lot = state.lots.find((lot) => lot.id === payload.id);
      if (!lot) throw new Error("Lot not found");
      lot.bids.push({
        amount: payload.amount,
        bidder: payload.bidder,
        platform: payload.platform,
        createdAt: new Date(),
      });
    },
    updateLot: (state, action: PayloadAction<Lot>) => {
      const payload = action.payload;
      const lotInstance = state.lots.find((lot) => lot.id === payload.id);
      if (!lotInstance) throw new Error("Lot cannot be updated. Lot not found");
      lotInstance.description = payload.description || lotInstance.description;
      lotInstance.image = payload.image || lotInstance.image;
      lotInstance.lowEstimate = payload.lowEstimate || lotInstance.lowEstimate;
      lotInstance.highEstimate =
        payload.highEstimate || lotInstance.highEstimate;
      lotInstance.asking = payload.asking || lotInstance.asking;
      lotInstance.bids = payload.bids || lotInstance.bids;
      lotInstance.state = payload.state || lotInstance.state;
    },
    sortBids: (state, action: PayloadAction<string>) => {
      const lot = state.lots.find((lot) => lot.id === action.payload);
      if (!lot || lot.bids.length <= 1) return;
      lot.bids.sort((a, b) => b.amount - a.amount);
    },
    setLots: (state, action: PayloadAction<Lot[]>) => {
      state.lots = action.payload;
    },
    startAuction: (state) => {
      state.started = true;
    },
    setAuctionPausedState: (state, action: PayloadAction<boolean>) => {
      state.paused = action.payload;
    },
    resetState: (state) => {
      // get current name of auction
      return {
        setup: false,
        started: false,
        paused: false,
        date: new Date().toISOString().split("T")[0],
        name: state.name,
        currentLotId: "0",
        lots: [],
      };
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
  updateLot,
  sortBids,
  startAuction,
  setAuctionPausedState,
  resetState,
} = auctionSlice.actions;

export default auctionSlice.reducer;
