// This function can be used to observe changes in the DOM

/**
 *
 * @param elementId
 * @param callback
 * Function that runs a callback function everytime there is a change to the passed element in the DOM
 */

export const observeElementByIdContent = (
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

/**
 * @description Function that runs a callback function everytime there is a change to the passed element in the DOM
 *
 * @param {Element} element
 * @param {Function} callback
 */
export const observeElementContent = (
  element: Element, // The element to be observed
  callback: Function,
) => {
  if (!element) {
    throw new Error(`Passed element could not be found.`);
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

/**
 *
 * @param id
 * @param value
 */
export const updateInput = (id: string, value: string) => {
  const input = document.getElementById(id);
  // React >=16
  var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  )?.set;
  nativeInputValueSetter?.call(input, value);

  // i know for a fact that "input" event works for react. "change" event works for blazor and react let's hope that works for everything.
  var ev = new Event("change", { bubbles: true }); // Bubbles means event propogates across the whole DOM. I think writing this comment without internet.
  input?.dispatchEvent(ev);
};
