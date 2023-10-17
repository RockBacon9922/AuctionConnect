import { updateInput } from "@acme/element-operations";

export const getLot = (consoleElementLotId: string) => {
  return document
    .getElementById(consoleElementLotId)
    ?.innerText.replace("Lot ", "");
};

export const getImage = (consoleLotImageElementId: string) => {
  // get image url
  const image = document.getElementById(
    consoleLotImageElementId,
  ) as HTMLImageElement;
  return image.src;
};

export const getAsk = (consoleElementAskId: string) => {
  return document
    .getElementById(consoleElementAskId)
    ?.innerText.replace("Asking: ", "")
    .replace(",", "");
};

export const getHammer = (consoleElementHammerId: string) => {
  return document
    .getElementById(consoleElementHammerId)
    ?.innerText.replace("Bid: ", "")
    .replace(",", "");
};

export const getLowEstimate = (consoleElementLowEstimateId: string) => {
  return document
    .getElementById(consoleElementLowEstimateId)
    ?.innerText.replace("Low Estimate: ", "")
    .replace(",", "");
};

export const getHighEstimate = (consoleElementHighEstimateId: string) => {
  return document
    .getElementById(consoleElementHighEstimateId)
    ?.innerText.replace("High Estimate: ", "")
    .replace(",", "");
};

export const getDescription = (consoleElementDesriptionId: string) => {
  return document
    .getElementById(consoleElementDesriptionId)
    ?.innerText.replace("description: ", "");
};

export const getBidder = (consoleElementCurrentBidderId: string) => {
  return document
    .getElementById(consoleElementCurrentBidderId)
    ?.innerText.replace("Bidder: ", "");
};

export const setAsk = (consoleElementAskInputId: string, ask: number) => {
  updateInput(consoleElementAskInputId, ask.toString());
  document.getElementById(consoleElementAskInputId)?.click();
};

export const clickBid = (consoleElementBidButtonId: string) => {
  document.getElementById(consoleElementBidButtonId)?.click();
};

export const clickSold = (consoleElementSellButtonId: string) => {
  document.getElementById(consoleElementSellButtonId)?.click();
};

export const clickPass = (consoleElementPassButtonId: string) => {
  document.getElementById(consoleElementPassButtonId)?.click();
};

export const clickRoom = (consoleElementRoomButtonId: string) => {
  document.getElementById(consoleElementRoomButtonId)?.click();
};

export const clickNextLot = (consoleElementNextLotButtonId: string) => {
  document.getElementById(consoleElementNextLotButtonId)?.click();
};
