console.log("✅ Content script loaded");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_QUESTION") {
    let questionText = "";
    const url = location.href;
    const host = location.hostname;

    // ✅ LeetCode
    if (host.includes("leetcode.com")) {
      const el = document.querySelector('[data-track-load="description_content"]');
      if (el) questionText = el.innerText.trim();
    }

    // ✅ Codeforces
    else if (host.includes("codeforces.com")) {
      const el = document.querySelector('.problem-statement');
      if (el) questionText = el.innerText.trim();
    }

    // ✅ CodeChef (only practice)
    else if (host.includes("codechef.com") && url.includes("/practice/")) {
      const el = document.querySelector('.problem-statement');
      if (el) questionText = el.innerText.trim();
    }

    // ✅ HackerRank
    else if (host.includes("hackerrank.com")) {
      const el = document.querySelector('.challenge-body-html');
      if (el) questionText = el.innerText.trim();
    }

    // ✅ AtCoder
    else if (host.includes("atcoder.jp")) {
      const el = document.querySelector('.lang-en');
      if (el) questionText = el.innerText.trim();
    }

    // ✅ GeeksforGeeks
    else if (host.includes("geeksforgeeks.org")) {
      const el = document.querySelector('.problem-page-wrapper');
      if (el) questionText = el.innerText.trim();
    }

    // ❌ Unsupported or not on a problem page
    if (!questionText || questionText.length < 50) {
      console.warn("⛔ Unsupported or unrecognized problem page.");
    } else {
      console.log("✅ Extracted question:", questionText.slice(0, 100));
    }

    sendResponse({ question: questionText });
  }
});
