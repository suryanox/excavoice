const els = {
  baseUrl: document.getElementById("baseUrl"),
  apiKey: document.getElementById("apiKey"),
  model: document.getElementById("model"),
  freeModels: document.getElementById("freeModels"),
  status: document.getElementById("status"),
  save: document.getElementById("save"),
};

// UI only: wire up elements without business logic.
// Business logic (storage, LLM calls, speech capture) will be added later.

els.save.addEventListener("click", () => {
  els.status.textContent = "Saved (stub)";
  els.status.className = "status status--ok";
});
