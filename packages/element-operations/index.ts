// This function can be used to observe changes in the DOM
export const observeElementContent = (
  elementId: string,
  callback: Function,
) => {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Element with ID '${elementId}' not found.`);
  }

  const observer = new MutationObserver(() => {
    callback();
  });

  observer.observe(element, {
    characterData: true,
    childList: true,
    subtree: true,
  });
};

export const updateInput = (id: string, value: string) => {
  const input = document.getElementById(id);
  // React >=16
  var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  )?.set;
  nativeInputValueSetter?.call(input, value);

  // i know for a fact that "input" event works for react. "change" event works for blazor and react let's hope that works for everything.
  var ev = new Event("change", { bubbles: true });
  input?.dispatchEvent(ev);
};
