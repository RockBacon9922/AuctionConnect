import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Platform = {
  name: string;
  primary: boolean;
  status: boolean;
  lots: string[];
};

export type Platforms = {
  // extend the platform type for easylive to add a boolean value for back office auctioneer software
  easylive: Platform & { backOffice: boolean };
  theSaleroom: Platform;
};

//TODO: Make sure that one of the platforms is the primary when starting a new auction
// name and id are required due to searching. //TODO: Convert back to list, it works better
const initialState: Platforms = {
  easylive: {
    name: "easylive",
    primary: true,
    status: false,
    lots: [],
    backOffice: true,
  },
  theSaleroom: {
    name: "theSaleroom",
    primary: false,
    status: false,
    lots: [],
  },
};

const platformSlice = createSlice({
  name: "platform",
  initialState,
  reducers: {
    /**
     *
     * @param action containing platform name and desired status
     * @returns {void}
     * @description Sets the status of a platform
     */
    setStatus: (
      state,
      action: PayloadAction<{ platformName: string; status: boolean }>,
    ) => {
      // find the object with the id of the platform
      const platform = Object.values(state).find(
        (platform) => platform.name === action.payload.platformName,
      );
      if (!platform) throw new Error("Platform not found");
      // set status
      platform.status = action.payload.status;
    },

    /**
     *
     * @param action String of platform name
     * @returns void
     * @description Sets the primary platform
     */
    setPrimary: (state, action: PayloadAction<string>) => {
      // get all platforms
      const platform = Object.values(state).find(
        (platform) => platform.name === action.payload,
      );
      if (!platform) throw new Error("Platform not found");
      // set all platforms to false
      Object.values(state).forEach((platform) => (platform.primary = false));
      // set status
      platform.primary = true;
    },
    /**
     *
     * @param action
     * @description Sets the lots for a specified platform
     */
    setLots: (
      state,
      action: PayloadAction<{ platformName: string; lots: string[] }>,
    ) => {
      // find the object with the id of the platform
      const platform = Object.values(state).find(
        (platform) => platform.name === action.payload.platformName,
      );
      if (!platform) throw new Error("Platform not found");
      // set status
      platform.lots = action.payload.lots;
    },
    resetPlatformData: () => initialState,
  },
});

export const { setStatus, setPrimary, setLots, resetPlatformData } =
  platformSlice.actions;

export default platformSlice.reducer;
