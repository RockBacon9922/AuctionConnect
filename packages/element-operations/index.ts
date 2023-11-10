// This function can be used to observe changes in the DOM

/**
 * @param {string} elementId - the Id of the element to be observed
 * @callback callback - Function to run when the element changes
 *
 * @description Function that runs a callback function everytime there is a change to the passed element in the DOM
 */

export const observeElementByIdContent = (
  elementId: string,
  callback: () => void,
  attributes = true,
  characterData = true,
  childList = true,
  subtree = true,
) => {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Element with ID '${elementId}' not found.`);
  }

  const observer = new MutationObserver(() => {
    callback();
  });

  observer.observe(element, {
    attributes,
    characterData,
    childList,
    subtree,
  });
};

/**
 * @param {Element} element - element to be observed
 * @callback callback - Function to run when the element changes
 *
 * @description Function that runs a callback function everytime there is a change to the passed element in the DOM
 */
export const observeElementContent = (
  element: Element, // The element to be observed
  callback: () => void,
  attributes = true,
  characterData = true,
  childList = true,
  subtree = true,
) => {
  if (!element) {
    throw new Error(`Passed element could not be found.`);
  }

  const observer = new MutationObserver(() => {
    callback();
  });

  observer.observe(element, {
    attributes,
    characterData,
    childList,
    subtree,
  });
};

/**
 *
 * @param id
 * @param value
 */
export const updateInputById = (id: string, value: string) => {
  const input = document.getElementById(id);
  // React >=16
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    // FIXME: I don't know
    window.HTMLInputElement.prototype,
    "value",
  )?.set;
  nativeInputValueSetter?.call(input, value);

  // i know for a fact that "input" event works for react. "change" event works for blazor and react let's hope that works for everything.
  const ev = new Event("change", { bubbles: true }); // Bubbles means event propogates across the whole DOM. I think writing this comment without internet.
  input?.dispatchEvent(ev);
};

/**
 * @description Function to update the value of an input element
 * @param {HTMLInputElement} input
 * @param {string} value
 * @returns {void}
 */

export const updateInput = (input: HTMLInputElement, value: string) => {
  // React >=16
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    // FIXME: I don't know
    window.HTMLInputElement.prototype,
    "value",
  )?.set;
  nativeInputValueSetter?.call(input, value);

  // i know for a fact that "input" event works for react. "change" event works for blazor and react let's hope that works for everything.
  const ev = new Event("change", { bubbles: true }); // Bubbles means event propogates across the whole DOM. I think writing this comment without internet.
  input?.dispatchEvent(ev);
};
