import { randomBytes, randomFill } from "crypto"

export {}
// run when javascript has been hydrated
console.log("loaded")
// get url
const url = window.location.href.toString()
// send message to background script
chrome.runtime.sendMessage({ url })
// get all a tags
const aTags = document.querySelectorAll("a")
// add event listener to each a tag
aTags.forEach((aTag) => {
  // get the innerHTML of the a tag
  const innerHTML = aTag.innerHTML
  // change content of a tag
  // change colour of a tag
  // aTag.style.color = "red"
  aTag.addEventListener("click", (e) => {
    // get href value
    const href = aTag.getAttribute("href")
    // send message to background script
    chrome.runtime.sendMessage({ href })
    // redirect to href
  })
})
