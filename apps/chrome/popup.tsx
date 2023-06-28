import { useState } from "react"

function IndexPopup() {
  // get extension id
  const extensionId = chrome.runtime.getURL("").split("/")[2]
  // get extension version
  const manifest = chrome.runtime.getManifest()
  const version = manifest.version

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 200,
        padding: 10
      }}>
      <h1
        style={{
          paddingBottom: 0,
          margin: 0,
          marginTop: 10
        }}>
        Auction Connect
      </h1>
      <h2
        style={{
          marginBottom: 10
        }}>
        <a
          href={"chrome-extension://" + extensionId + "/tabs/console.html"}
          target="_blank">
          Console
        </a>
      </h2>
      <ul>
        <li>
          <h3>SaleRoom: ✔</h3>
        </li>
        <li>
          <h3>Easy Live: ✔</h3>
        </li>
      </ul>
      <p>Version: {version}</p>
    </div>
  )
}

export default IndexPopup
