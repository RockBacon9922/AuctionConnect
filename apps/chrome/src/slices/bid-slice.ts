import { createSlice } from "@reduxjs/toolkit";
import { set } from "zod";

export interface BidState {
  lot: number;
  amount: number;
  platform: string;
  bidderId: string;
  asking: number;
}
const bidSlice = createSlice({
  name: "bid",
  initialState: { lot: 0, amount: 0, platform: "", bidderId: "", asking: 1 },
  reducers: {
    setLot: (state, action) => {
      state.lot = action.payload;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    setPlatform: (state, action) => {
      state.platform = action.payload;
    },
    setBidderId: (state, action) => {
      state.bidderId = action.payload;
    },
    setAsking: (state, action) => {
      state.bidderId = action.payload;
    },
  },
});

export const { setLot, setAmount, setPlatform, setBidderId, setAsking } =
  bidSlice.actions;

export default bidSlice.reducer;
