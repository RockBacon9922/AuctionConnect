import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "~store";
import { z } from "zod";

const platform = z.object({
  name: z.string(),
  primary: z.boolean(),
  status: z.enum(["active", "inactive"]),
});

export type Platform = z.infer<typeof platform>;

const initialState: Platform[] = [
  {
    name: "stoneham",
    primary: true,
    status: "inactive",
  },
  {
    name: "easyLive",
    primary: false,
    status: "inactive",
  },
  {
    name: "theSaleroom",
    primary: false,
    status: "inactive",
  },
];

const platformSlice = createSlice({
  name: "platform",
  initialState,
  reducers: {
    setStatus: (
      state,
      action: PayloadAction<{ name: string; status: "active" | "inactive" }>,
    ) => {
      const platform = state.find(
        (platform) => platform.name === action.payload.name,
      );
      if (platform) {
        platform.status = action.payload.status;
      }
    },
    setPrimary: (state, action: PayloadAction<string>) => {
      // set all platforms to false
      state.forEach((platform) => (platform.primary = false));
      const platform = state.find(
        (platform) => platform.name === action.payload,
      );
      if (platform) {
        platform.primary = true;
      }
    },
  },
});

export const { setStatus, setPrimary } = platformSlice.actions;

export default platformSlice.reducer;
