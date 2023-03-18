import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")
  // get extension id
  const extensionId = chrome.runtime.getURL("").split("/")[2]

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h2>
        Welcome to your{" "}
        <a href="https://www.plasmo.com" target="_blank">
          Plasmo
        </a>{" "}
        Extension!
      </h2>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <a href="https://docs.plasmo.com" target="_blank">
        View Docs
      </a>
      <a
        href={"chrome-extension://" + extensionId + "/tabs/alist.html"}
        target="_blank">
        {extensionId}
      </a>
    </div>
  )
}

export default IndexPopup
