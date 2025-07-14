
document.addEventListener("DOMContentLoaded", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { type: "GET_QUESTION" }, async (res) => {
    const titleEl = document.getElementById("title");
    const container = document.getElementById("hints-container");

    if (!res || !res.question || res.question.trim().length < 50) {
  titleEl.textContent = "Supported in competitive Platforms like LeetCode, Codeforces, HackerRank and Soon all platforms will be available And if you are on correct page then try to refresh and click on the extension";
  
  // Remove loading spinner if it's there
// Remove loading spinner after hints are loaded
const loadingEl = document.getElementById("loading");
if (loadingEl) loadingEl.remove();

  
  return;
}

    titleEl.textContent = "Fetching Hints...";

    try {
      const hints = await fetchHints(res.question);

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
    } catch (e) {
      titleEl.textContent = "Failed to load hints.";
      console.error(e);
    }
  });
});

async function fetchHints(questionText) {
  const apiKey = "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"; // Replace with valid OpenRouter key

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant giving programming hints."
        },
        {
          role: "user",
          content: `Provide 5 insightful, concise hints that gently guide the user toward solving the problem without revealing the solution. Do not label them as "hints" or number them. Each hint should be a single, complete sentence that encourages problem-solving intuition, such as referencing useful patterns, data structures, or algorithms (e.g., "Consider how you might use a stack here"). Avoid vague process suggestions—make each line actionable, technical, and helpful, yet indirect.\n\nProblem:\n\n${questionText}`
        }
      ],
      max_tokens: 300
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Failed API response:", errorText);
    console.log(errorText);
    throw new Error("API error: " + response.status);
  }

  const data = await response.json();
  console.log("✅ API Response:", data);

  const content = data.choices?.[0]?.message?.content || "No hints found.";
  return content
    .split("\n")
    .filter(line => line.trim() && !line.trim().startsWith("Answer"))
    .slice(0, 5);
}
