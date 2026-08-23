window.OpenRouter = {
  // Fallback used if the models API can't be reached.
  FALLBACK_FREE_MODELS: [
    "mistralai/mistral-7b-instruct:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "google/gemma-2-9b-it:free",
    "qwen/qwen2.5-7b-instruct:free",
  ],

  async fetchFreeModels(baseUrl, apiKey) {
    const base = (baseUrl || "").replace(/\/+$/, "");
    if (!base) throw new Error("Missing API base URL");
    const url = base + "/models";

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (apiKey || ""),
      },
    });
    if (!res.ok) {
      throw new Error("Models request failed (" + res.status + ")");
    }
    const data = await res.json();
    const models = (data.data || [])
      .filter((m) => {
        const p = m.pricing || {};
        return p.prompt === "0" && p.completion === "0";
      })
      .map((m) => m.id);
    return models.length ? models : this.FALLBACK_FREE_MODELS;
  },
};
