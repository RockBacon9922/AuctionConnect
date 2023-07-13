import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://dev.gavelconnect.com/thesaleroom"],
  all_frames: true,
  run_at: "document_start",
};

// --- Define Console Interface Id ---
type ConsoleIDs = {
  currentLot: string;
  currentBid: string;
  currentAsk: string;
  bidButton: string;
  sellButton: string;
  passButton: string;
  roomButton: string;
  askInput: string;
};

// --- Define Console Interface ---
const consoleIDs: ConsoleIDs = {
  currentLot: "currentLot",
  currentAsk: "currentAsk",
  currentBid: "currentBid",
  bidButton: "bidButton",
  askInput: "askInput",
  roomButton: "Room",
  sellButton: "sellButton",
  passButton: "passButton",
};

alert("Hello from Stoneham!");
