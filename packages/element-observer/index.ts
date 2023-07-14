// This function can be used to observe changes in the DOM
export const observeElementContent = (element, callback) => {
  const observer = new MutationObserver(function (mutationsList) {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        callback();
      }
    }
  });

  observer.observe(element, { childList: true });
};
