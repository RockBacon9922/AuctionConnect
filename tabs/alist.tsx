import { randomBytes } from "crypto"
import { useCallback, useEffect, useState } from "react"

const History = () => {
  // get the urls from storage
  const [urls, setUrls] = useState([])
  useEffect(() => {
    chrome.storage.local.get(["urls"], function (result) {
      setUrls(result.urls)
    })
    chrome.storage.onChanged.addListener(function (changes, namespace) {
      for (var key in changes) {
        var storageChange = changes[key]
        setUrls(storageChange.newValue)
      }
    })
  }, [])
  return (
    <div>
      <h1>History</h1>
      {urls.map((url) => (
        <div key={randomBytes(10).toString()}>{url}</div>
      ))}
      <p>{randomBytes(10).toString()}</p>
    </div>
  )
}

export default History
