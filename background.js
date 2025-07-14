chrome.runtime.onInstalled.addListener(() => {
  console.log("Competitive Helper extension installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "log") {
    console.log("LOG:", message.data);
  }

  // You could add other message handling here if needed.
  sendResponse({ status: "received" });
});
