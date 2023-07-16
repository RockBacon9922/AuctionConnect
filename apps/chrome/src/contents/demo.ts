import { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://dev.gavelconnect.com/demo"],
  all_frames: true,
  run_at: "document_start",
};

const counter = document.getElementById("count");

const delay = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

while (true) {
  await delay(1000);
  counter.innerText = String(parseInt(counter.innerText) + 1);
}
