const els = {
  baseUrl: document.getElementById("baseUrl") as HTMLInputElement,
  apiKey: document.getElementById("apiKey") as HTMLInputElement,
  model: document.getElementById("model") as HTMLInputElement,
  freeModels: document.getElementById("freeModels") as HTMLInputElement,
  status: document.getElementById("status") as HTMLSpanElement,
  save: document.getElementById("save") as HTMLButtonElement,
};

// UI only: wire up elements without business logic.
// Business logic (storage, LLM calls, speech capture) will be added later.

els.save.addEventListener("click", () => {
  els.status.textContent = "Saved (stub)";
  els.status.className = "status status--ok";
});
