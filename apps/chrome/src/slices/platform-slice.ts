import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type status = "active" | "inactive";

type Platform = {
  name: string;
  primary: boolean;
  status: status;
};

export type Platforms = {
  easylive: Platform;
  theSaleroom: Platform;
};

//TODO: Make sure that one of the platforms is the primary when starting a new auction
const initialState: Platforms = {
  easylive: {
    name: "easylive",
    primary: true,
    status: "inactive",
  },
  theSaleroom: {
    name: "theSaleroom",
    primary: false,
    status: "inactive",
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
      action: PayloadAction<{ platformName: string; status: status }>,
    ) => {
      // get all platforms
      const platforms = Object.keys(state);
      // check if platform exists
      if (!platforms.includes(action.payload.platformName)) return;
      // set status
      state[action.payload.platformName].status = action.payload.status;
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
      const platforms = Object.keys(state);
      // check if platform exists
      if (!platforms.includes(action.payload)) return;
      // set all platforms to false
      platforms.forEach((platform) => {
        state[platform].primary = false;
      });
      // set status
      state[action.payload].primary = true;
    },
  },
});

export const { setStatus, setPrimary } = platformSlice.actions;

export default platformSlice.reducer;
