// getmessages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // add the request to storage
  console.log(request.href)
  chrome.storage.local.get("urls", function (result) {
    // if there is no urls key in storage
    if (!result.urls) {
      // add the request to storage
      chrome.storage.local.set({ urls: [request.href] })
    } else {
      // get the urls from storage
      const urls = result.urls
      // add the request to the urls array
      urls.push(request.href)
      // set the urls array to storage
      chrome.storage.local.set({ urls })
    }
  })
})
//
