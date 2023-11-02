import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Platform = {
  name: string;
  primary: boolean;
  status: boolean;
};

export type Platforms = {
  easylive: Platform;
  theSaleroom: Platform;
};

//TODO: Make sure that one of the platforms is the primary when starting a new auction
// name and id are required due to searching. //TODO: Convert back to list, it works better
const initialState: Platforms = {
  easylive: {
    name: "easylive",
    primary: true,
    status: false,
  },
  theSaleroom: {
    name: "theSaleroom",
    primary: false,
    status: false,
  },
};

const platformSlice = createSlice({
  name: "platform",
  initialState,
  reducers: {
    /**
     *
     * @param @ignore state -- automatically passed by redux
     * @param action Object containing platform name and desired status
     * @returns void
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
     * @param @ignore state -- automatically passed by redux
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
  },
});

export const { setStatus, setPrimary } = platformSlice.actions;

export default platformSlice.reducer;
