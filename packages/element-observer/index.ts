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
