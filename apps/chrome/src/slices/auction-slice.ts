import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
  setup: z.boolean(),
  date: z.string(),
  currentLotNumber: z.number(),
  name: z.string(),
  lots: z.array(lot),
});

export type Auction = z.infer<typeof auction>;
export type Lot = z.infer<typeof lot>;
export type Bid = z.infer<typeof bid>;
const currentDate = new Date().toDateString();

const auctionSlice = createSlice({
  name: "auction",
  initialState: {
    setup: false,
    date: currentDate,
    name: "",
    currentLotNumber: 0,
    lots: [],
  },
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
    setAuctionHouse: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
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
    resetState: (state) => {
      // get current name of auction
      return {
        setup: false,
        date: currentDate,
        name: state.name,
        currentLotNumber: 0,
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
  createLot,
  createBid,
  setLotNumber,
  resetState,
} = auctionSlice.actions;

export default auctionSlice.reducer;
