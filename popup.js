document.addEventListener("DOMContentLoaded", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { type: "GET_QUESTION" }, async (res) => {
    const titleEl = document.getElementById("title");
    const container = document.getElementById("hints-container");
    const loadingEl = document.getElementById("loading");

    if (!res || !res.question || res.question.trim().length < 50) {
      titleEl.textContent = "Once refresh and try once again -- Supported on LeetCode, Codeforces, HackerRank, etc. If you're on a problem page, try refreshing.";
      if (loadingEl) loadingEl.remove();
      return;
    }

    const questionText = res.question.trim();
    console.log("📘 Extracted Question:", questionText);

    titleEl.textContent = "Fetching Hints...";

    try {
      const hints = await fetchHints(questionText);
      if (loadingEl) loadingEl.remove();

      if (!hints.length) {
        titleEl.textContent = "No hints returned.";
        return;
      }

      titleEl.textContent = "Click to reveal hints:";

      hints.forEach((hint, i) => {
        const btn = document.createElement("button");
        btn.className = "hint-button";
        btn.textContent = `Hint ${i + 1}`;

        const div = document.createElement("div");
        div.className = "hint-text hidden";
        div.textContent = hint;

        btn.addEventListener("click", () => div.classList.toggle("hidden"));

        container.appendChild(btn);
        container.appendChild(div);
      });
    } catch (error) {
      titleEl.textContent = "Failed to load hints.";
      if (loadingEl) loadingEl.remove();
      console.error("❌ Error fetching hints:", error);
    }
  });
});

async function fetchHints(questionText) {
  console.log("🚀 Sending to backend:", questionText);

  try {
    const response = await fetch("https://backx-7awm.onrender.com/get-hints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question: questionText })
    });

    const resultText = await response.text();
    console.log("📩 Backend response:", resultText);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = JSON.parse(resultText);
    return Array.isArray(result.hints) ? result.hints : [];
  } catch (error) {
    console.error("❌ Failed to fetch hints:", error);
    return [];
  }
}
