// This function can be used to observe changes in the DOM

/**
 * @param {string} elementId - the Id of the element to be observed
 * @callback callback - Function to run when the element changes
 * @param {boolean} opts.attributes - Set to true if mutations to target's attributes are to be observed. Can be omitted if attributeOldValue or attributeFilter is specified.
 * @param {boolean} opts.characterData - Set to true if mutations to target's data are to be observed. Can be omitted if characterDataOldValue is specified.
 * @param {boolean} opts.childList - Set to true if mutations to target's children are to be observed.
 * @param {boolean} opts.subtree - Set to true if mutations to not just target, but also target's descendants are to be observed.
 * @param {boolean} opts.initialRun - Set to true if you want the callback to run when listener is initialized
 *
 * @description Function that runs a callback function everytime there is a change to the passed element in the DOM
 */

export const observeElementByIdContent = (
  elementId: string,
  callback: () => void,
  opts: {
    attributes?: boolean;
    characterData?: boolean;
    childList?: boolean;
    subtree?: boolean;
    initialRun?: boolean;
  } = {},
) => {
  const {
    attributes = true,
    characterData = true,
    childList = true,
    subtree = true,
    initialRun = false,
  } = opts;
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Element with ID '${elementId}' not found.`);
  }

  if (initialRun) {
    callback();
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
 * @param {boolean} opts.attributes - Set to true if mutations to target's attributes are to be observed. Can be omitted if attributeOldValue or attributeFilter is specified.
 * @param {boolean} opts.characterData - Set to true if mutations to target's data are to be observed. Can be omitted if characterDataOldValue is specified.
 * @param {boolean} opts.childList - Set to true if mutations to target's children are to be observed.
 * @param {boolean} opts.subtree - Set to true if mutations to not just target, but also target's descendants are to be observed.
 * @param {boolean} opts.initialRun - Set to true if you want the callback to run when listener is initialized
 *
 * @description Function that runs a callback function everytime there is a change to the passed element in the DOM
 */
export const observeElementContent = (
  element: Element, // The element to be observed
  callback: () => void,
  opts: {
    attributes?: boolean;
    characterData?: boolean;
    childList?: boolean;
    subtree?: boolean;
    initialRun?: boolean;
  } = {},
) => {
  const {
    attributes = true,
    characterData = true,
    childList = true,
    subtree = true,
    initialRun = false,
  } = opts;
  if (!element) {
    throw new Error(`Passed element could not be found.`);
  }

  if (initialRun) {
    callback();
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
  const ev = [new Event("keydown", {bubbles: true}), new Event("change", { bubbles: true })] // Bubbles means event propogates across the whole DOM. I think writing this comment without internet.
  ev.forEach((e) => input?.dispatchEvent(e))
};

/**
 *
 * @param {string} selector
 * @returns {HTMLElement}
 */
export const getElementByQuerySelector = (selector: string) => {
  const element = document.querySelector(selector) as HTMLElement;
  if (!element)
    throw new Error(`Element with selector '${selector}' not found.`);
  return element;
};

/**
 *
 * @param {string} elementId
 * @returns {HTMLElement}
 */
export const getElementById = (id: string) => {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Element with ID '${id}' not found.`);
  return element;
};
