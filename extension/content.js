const styles = `
.xcv-widget {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 2147483647;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
}

.xcv-panel {
  width: 320px;
  background: #26262b;
  border: 1px solid #3a3a42;
  border-radius: 12px;
  color: #ededf0;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
}

.xcv-panel[hidden] {
  display: none;
}

.xcv-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #2f2f36;
  border-bottom: 1px solid #3a3a42;
}

.xcv-panel__title {
  font-size: 13px;
  font-weight: 600;
}

.xcv-close {
  border: none;
  background: transparent;
  color: #a0a0ab;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0 4px;
}

.xcv-close:hover {
  color: #ededf0;
}

/* ---- config view ---- */
.xcv-config {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.xcv-config[hidden] {
  display: none;
}

.xcv-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.xcv-field__label {
  font-size: 12px;
  color: #a0a0ab;
}

.xcv-field__control {
  width: 100%;
  background: #2f2f36;
  border: 1px solid #3a3a42;
  border-radius: 8px;
  color: #ededf0;
  padding: 8px 10px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
}

.xcv-field__control:focus {
  border-color: #6965db;
}

.xcv-checkrow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #a0a0ab;
}

.xcv-checkrow input {
  accent-color: #6965db;
  width: 15px;
  height: 15px;
}

.xcv-config__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.xcv-status {
  font-size: 12px;
  color: #a0a0ab;
}

.xcv-status--ok {
  color: #4caf7d;
}

.xcv-save {
  border: none;
  background: #6965db;
  color: #fff;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
}

.xcv-save:hover {
  background: #7c78e6;
}

/* ---- logs view ---- */
.xcv-logs-view {
  display: flex;
  flex-direction: column;
}

.xcv-logs-view[hidden] {
  display: none;
}

.xcv-live {
  padding: 10px 12px;
  background: #1b1b1f;
  border-bottom: 1px solid #3a3a42;
  font-size: 13px;
  color: #ededf0;
  white-space: pre-wrap;
  word-break: break-word;
  min-height: 40px;
}

.xcv-live:empty::before {
  content: attr(data-empty);
  color: #a0a0ab;
  font-style: italic;
}

.xcv-logs {
  padding: 10px 12px;
  max-height: 220px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  line-height: 1.45;
}

.xcv-log {
  white-space: pre-wrap;
  word-break: break-word;
}

.xcv-log--info {
  color: #a0a0ab;
}

.xcv-log--req {
  color: #9db4ff;
}

.xcv-log--success {
  color: #4caf7d;
}

.xcv-log--warn {
  color: #e0b34c;
}

.xcv-log--error {
  color: #e0566f;
}

.xcv-logs-bar {
  display: flex;
  justify-content: flex-end;
  padding: 8px 12px;
  border-top: 1px solid #3a3a42;
}

.xcv-clear {
  border: 1px solid #3a3a42;
  background: #2f2f36;
  color: #a0a0ab;
  border-radius: 8px;
  padding: 5px 10px;
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
}

.xcv-clear:hover {
  border-color: #6965db;
  color: #ededf0;
}

/* ---- chip ---- */
.xcv-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #26262b;
  border: 1px solid #3a3a42;
  border-radius: 999px;
  padding: 6px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
}

.xcv-mic {
  flex: 1 1 auto;
  min-width: 150px;
  height: 44px;
  border-radius: 999px;
  border: none;
  background: #6965db;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  transition: background 0.15s ease, transform 0.15s ease;
}

.xcv-mic:hover {
  background: #7c78e6;
}

.xcv-mic--active {
  background: #e0566f;
  animation: xcv-pulse 1.4s ease-in-out infinite;
}

@keyframes xcv-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}

.xcv-iconbtn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #2f2f36;
  color: #a0a0ab;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.xcv-iconbtn:hover {
  background: #3a3a42;
  color: #ededf0;
}

.xcv-iconbtn--active {
  background: #6965db;
  color: #fff;
}
`;

const widget = document.createElement("div");
widget.className = "xcv-widget";
widget.innerHTML = `
  <div class="xcv-panel" hidden>
    <div class="xcv-panel__header">
      <span class="xcv-panel__title"></span>
      <button class="xcv-close" type="button" aria-label="Close">×</button>
    </div>

    <div class="xcv-config" hidden>
      <label class="xcv-field">
        <span class="xcv-field__label">API base URL</span>
        <input id="xcv-baseUrl" class="xcv-field__control" type="text" placeholder="https://litellm.example.com" autocomplete="off" spellcheck="false" />
      </label>
      <label class="xcv-field">
        <span class="xcv-field__label">API key</span>
        <input id="xcv-apiKey" class="xcv-field__control" type="password" placeholder="sk-..." autocomplete="off" />
      </label>
      <label class="xcv-field">
        <span class="xcv-field__label">Model</span>
        <input id="xcv-model" class="xcv-field__control" type="text" placeholder="gpt-4o-mini" autocomplete="off" spellcheck="false" />
      </label>
      <label class="xcv-checkrow">
        <input id="xcv-freeModels" type="checkbox" />
        <span>Use OpenRouter free models</span>
      </label>
      <div class="xcv-config__footer">
        <span id="xcv-status" class="xcv-status"></span>
        <button id="xcv-save" class="xcv-save" type="button">Save</button>
      </div>
    </div>

    <div class="xcv-logs-view" hidden>
      <div id="xcv-live" class="xcv-live" data-empty="Press the mic and describe your diagram…"></div>
      <div id="xcv-logs" class="xcv-logs"></div>
      <div class="xcv-logs-bar">
        <button id="xcv-clear" class="xcv-clear" type="button">Clear</button>
      </div>
    </div>
  </div>

  <div class="xcv-chip">
    <button class="xcv-mic" type="button">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2Z"/>
      </svg>
      <span>Describe</span>
    </button>
    <button class="xcv-iconbtn xcv-edit" type="button" title="Configuration" aria-label="Configuration">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.3 7.3 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.58.24-1.12.56-1.62.94l-2.39-.96a.5.5 0 0 0-.61.22L2.74 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.62-.06.94 0 .32.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.14.24.43.34.61.22l2.39-.96c.5.38 1.04.7 1.62.94l.36 2.54c.04.24.25.42.5.42h3.84c.25 0 .46-.18.5-.42l.36-2.54c.58-.24 1.12-.56 1.62-.94l2.39.96c.18.12.47.02.61-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z"/>
      </svg>
    </button>
    <button class="xcv-iconbtn xcv-logs-btn" type="button" title="Logs" aria-label="Logs">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h10v2H4v-2Z"/>
      </svg>
    </button>
  </div>
`;

const styleTag = document.createElement("style");
styleTag.textContent = styles;
document.head.appendChild(styleTag);
document.body.appendChild(widget);

const panel = widget.querySelector(".xcv-panel");
const panelTitle = widget.querySelector(".xcv-panel__title");
const closeBtn = widget.querySelector(".xcv-close");

const configView = widget.querySelector(".xcv-config");
const logsView = widget.querySelector(".xcv-logs-view");

const baseUrlEl = widget.querySelector("#xcv-baseUrl");
const apiKeyEl = widget.querySelector("#xcv-apiKey");
const modelEl = widget.querySelector("#xcv-model");
const freeModelsEl = widget.querySelector("#xcv-freeModels");
const statusEl = widget.querySelector("#xcv-status");
const saveBtn = widget.querySelector("#xcv-save");

const liveEl = widget.querySelector("#xcv-live");
const logsEl = widget.querySelector("#xcv-logs");
const clearBtn = widget.querySelector("#xcv-clear");

const micBtn = widget.querySelector(".xcv-mic");
const editBtn = widget.querySelector(".xcv-edit");
const logsBtn = widget.querySelector(".xcv-logs-btn");

/* ---------- logger ---------- */
function log(level, msg) {
  const t = new Date().toLocaleTimeString("en-GB", { hour12: false });
  const tag = level.toUpperCase().padEnd(7);
  const line = document.createElement("div");
  line.className = "xcv-log xcv-log--" + level;
  line.textContent = `[${t}] ${tag}  ${msg}`;
  logsEl.appendChild(line);
  logsEl.scrollTop = logsEl.scrollHeight;
}

/* ---------- config ---------- */
function showConfig() {
  panel.hidden = false;
  configView.hidden = false;
  logsView.hidden = true;
  panelTitle.textContent = "Configuration";
  editBtn.classList.add("xcv-iconbtn--active");
  logsBtn.classList.remove("xcv-iconbtn--active");
  window.Storage.getConfig().then((c) => {
    if (!c) return;
    baseUrlEl.value = c.baseUrl || "";
    apiKeyEl.value = c.apiKey || "";
    modelEl.value = c.model || "";
    freeModelsEl.checked = !!c.freeModels;
  });
}

function showLogs() {
  panel.hidden = false;
  configView.hidden = true;
  logsView.hidden = false;
  panelTitle.textContent = "Logs";
  logsBtn.classList.add("xcv-iconbtn--active");
  editBtn.classList.remove("xcv-iconbtn--active");
  logsEl.scrollTop = logsEl.scrollHeight;
}

function hidePanel() {
  panel.hidden = true;
  editBtn.classList.remove("xcv-iconbtn--active");
  logsBtn.classList.remove("xcv-iconbtn--active");
}

saveBtn.addEventListener("click", () => {
  const cfg = {
    baseUrl: baseUrlEl.value.trim(),
    apiKey: apiKeyEl.value.trim(),
    model: modelEl.value.trim(),
    freeModels: freeModelsEl.checked,
  };
  window.Storage.saveConfig(cfg).then(() => {
    statusEl.textContent = "Saved";
    statusEl.className = "xcv-status xcv-status--ok";
    log("success", "Configuration saved.");
  });
});

editBtn.addEventListener("click", () => {
  if (!panel.hidden && !configView.hidden) hidePanel();
  else showConfig();
});

logsBtn.addEventListener("click", () => {
  if (!panel.hidden && !logsView.hidden) hidePanel();
  else showLogs();
});

closeBtn.addEventListener("click", hidePanel);
clearBtn.addEventListener("click", () => {
  logsEl.innerHTML = "";
  log("info", "Logs cleared.");
});

/* ---------- transcription + LLM ---------- */
let recognition = null;
let listening = false;
let finalText = "";
let freeIdx = 0;
let freeModelsList = null;

function pickFreeModel() {
  const list =
    freeModelsList && freeModelsList.length
      ? freeModelsList
      : window.OpenRouter.FALLBACK_FREE_MODELS;
  const m = list[freeIdx % list.length];
  freeIdx++;
  return m;
}

async function ensureFreeModels(cfg) {
  if (freeModelsList) return freeModelsList;
  try {
    freeModelsList = await window.OpenRouter.fetchFreeModels(cfg.baseUrl, cfg.apiKey);
    log("info", "Loaded " + freeModelsList.length + " free model(s) from /models.");
  } catch (e) {
    freeModelsList = window.OpenRouter.FALLBACK_FREE_MODELS;
    log("warn", "Could not fetch free models, using fallback list.");
  }
  return freeModelsList;
}

async function handleTranscript(text) {
  const cfg = await window.Storage.getConfig();
  if (!cfg || !cfg.baseUrl || !cfg.apiKey) {
    log("error", "Missing API configuration. Open the config (gear) and save your settings.");
    return;
  }

  const messages = window.Prompt.buildMessages(text);
  let model = cfg.model;
  if (cfg.freeModels) {
    await ensureFreeModels(cfg);
    model = pickFreeModel();
    log("req", "Using free model: " + model);
  } else {
    log("req", "Model: " + model);
  }

  try {
    const mermaid = await window.LLM.complete(cfg, messages);
    log("success", "Mermaid received:\n" + mermaid);
    // TODO: convert mermaid -> Excalidraw elements and draw on canvas.
  } catch (err) {
    log("error", String((err && err.message) || err));
  }
}

function startListening() {
  const SR =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    log("error", "Speech recognition API is not available in this browser.");
    return;
  }

  showLogs();
  recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = navigator.language || "en-US";

  liveEl.textContent = "";
  finalText = "";
  log("info", "Listening…");

  recognition.onresult = (event) => {
    let interim = "";
    finalText = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const r = event.results[i];
      if (r.isFinal) finalText += r[0].transcript;
      else interim += r[0].transcript;
    }
    liveEl.textContent = finalText + interim;
  };

  recognition.onerror = (event) => {
    log("error", "Speech error: " + event.error);
  };

  recognition.onend = () => {
    listening = false;
    micBtn.classList.remove("xcv-mic--active");
    micBtn.querySelector("span").textContent = "Describe";
    if (finalText.trim()) {
      log("info", "Transcript: " + finalText.trim());
      handleTranscript(finalText.trim());
    } else {
      log("warn", "No speech detected.");
    }
  };

  recognition.start();
  listening = true;
  micBtn.classList.add("xcv-mic--active");
  micBtn.querySelector("span").textContent = "Stop";
}

micBtn.addEventListener("click", () => {
  if (listening) {
    if (recognition) recognition.stop();
    return;
  }
  startListening();
});
