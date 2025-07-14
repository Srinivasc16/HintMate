console.log("✅ Content script loaded");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_QUESTION") {
    const host = location.hostname;

    function tryExtractQuestion(retries = 10) {
      let questionText = "";

      if (host.includes("leetcode.com")) {
        const el = document.querySelector('[data-track-load="description_content"]');
        if (el) questionText = el.innerText.trim();
      } else if (host.includes("codeforces.com")) {
        const el = document.querySelector('.problem-statement');
        if (el) questionText = el.innerText.trim();
      } else if (host.includes("codechef.com")) {
        const el = document.querySelector(".no-print,#root, .content, .problem-body");
        if (el) questionText = el.innerText.trim();
      } else if (host.includes("hackerrank.com")) {
        const el = document.querySelector('.challenge-body-html');
        if (el) questionText = el.innerText.trim();
      } else if (host.includes("atcoder.jp")) {
        const el = document.querySelector('.lang-en');
        if (el) questionText = el.innerText.trim();
      } else if (host.includes("geeksforgeeks.org")) {
        const el = document.querySelector('.problem-page-wrapper,#scrollableDiv,.jsx-c095eb98ac24c0d7');
        if (el) questionText = el.innerText.trim();
      }

      if (questionText && questionText.length > 50) {
        console.log("✅ Extracted question:", questionText.slice(0, 100));
        sendResponse({ question: questionText });
      } else if (retries > 0) {
        console.log("⏳ Waiting for content to load...");
        setTimeout(() => tryExtractQuestion(retries - 1), 500);
      } else {
        console.warn("⛔ Unsupported or unrecognized problem page.");
        sendResponse({ question: "" });
      }
    }

    tryExtractQuestion();
    return true; // keep the message channel open for async sendResponse
  }
});
