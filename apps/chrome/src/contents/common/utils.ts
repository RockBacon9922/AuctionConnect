import { updateInput } from "@acme/element-operations";

export const setAsk = (askInput: HTMLInputElement, ask: number) => {
  updateInput(askInput, ask.toString());
  askInput.click();
};

export const waitForEvent = (event: string) => {
  return new Promise((resolve) => {
    document.addEventListener(event, resolve, { once: true });
  });
};
