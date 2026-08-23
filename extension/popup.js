const els = {
  baseUrl: document.getElementById("baseUrl"),
  apiKey: document.getElementById("apiKey"),
  model: document.getElementById("model"),
  freeModels: document.getElementById("freeModels"),
  status: document.getElementById("status"),
  save: document.getElementById("save"),
};

function loadConfig() {
  chrome.storage.local.get("xcv-config", (res) => {
    const c = res["xcv-config"];
    if (!c) return;
    els.baseUrl.value = c.baseUrl || "";
    els.apiKey.value = c.apiKey || "";
    els.model.value = c.model || "";
    els.freeModels.checked = !!c.freeModels;
  });
}

function saveConfig() {
  const cfg = {
    baseUrl: els.baseUrl.value.trim(),
    apiKey: els.apiKey.value.trim(),
    model: els.model.value.trim(),
    freeModels: els.freeModels.checked,
  };
  chrome.storage.local.set({ "xcv-config": cfg }, () => {
    els.status.textContent = "Saved";
    els.status.className = "status status--ok";
  });
}

els.save.addEventListener("click", saveConfig);
loadConfig();
