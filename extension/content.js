const styles = `
.xcv-widget {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 2147483647;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.xcv-mic {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: #6965db;
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(105, 101, 219, 0.45);
  transition: transform 0.15s ease, background 0.15s ease;
}

.xcv-mic:hover {
  transform: scale(1.05);
  background: #7c78e6;
}

.xcv-mic--active {
  background: #e0566f;
  box-shadow: 0 6px 18px rgba(224, 86, 111, 0.45);
  animation: xcv-pulse 1.4s ease-in-out infinite;
}

@keyframes xcv-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

.xcv-panel {
  width: 300px;
  background: #26262b;
  border: 1px solid #3a3a42;
  border-radius: 12px;
  color: #ededf0;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
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

.xcv-panel__body {
  padding: 12px;
  min-height: 64px;
}

.xcv-transcript {
  margin: 0;
  font-size: 13px;
  color: #ededf0;
  white-space: pre-wrap;
  word-break: break-word;
}

.xcv-transcript:empty::before {
  content: attr(data-empty);
  color: #a0a0ab;
  font-style: italic;
}

.xcv-result {
  margin: 10px 0 0;
  padding: 8px;
  background: #1b1b1f;
  border-radius: 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  line-height: 1.4;
  color: #9fe6b0;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 180px;
  overflow: auto;
}

.xcv-result[hidden] {
  display: none;
}

.xcv-result--error {
  color: #e0566f;
}

.xcv-panel__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-top: 1px solid #3a3a42;
  font-size: 12px;
  color: #a0a0ab;
}

.xcv-state {
  color: #6965db;
  font-weight: 500;
}
`;

const widget = document.createElement("div");
widget.className = "xcv-widget";
widget.innerHTML = `
  <button class="xcv-mic" type="button" aria-label="Start voice capture" title="Describe a diagram">
    <svg class="xcv-mic__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2Z"/>
    </svg>
  </button>
  <div class="xcv-panel" hidden>
    <div class="xcv-panel__header">
      <span class="xcv-panel__title">ExcaVoice</span>
      <button class="xcv-close" type="button" aria-label="Close">×</button>
    </div>
    <div class="xcv-panel__body">
      <p class="xcv-transcript" data-empty="Describe a diagram to draw…"></p>
      <pre class="xcv-result" hidden></pre>
    </div>
    <div class="xcv-panel__footer">
      <span class="xcv-state">Idle</span>
      <span class="xcv-timer">00:00</span>
    </div>
  </div>
`;

const styleTag = document.createElement("style");
styleTag.textContent = styles;
document.head.appendChild(styleTag);
document.body.appendChild(widget);

const mic = widget.querySelector(".xcv-mic");
const panel = widget.querySelector(".xcv-panel");
const close = widget.querySelector(".xcv-close");
const state = widget.querySelector(".xcv-state");
const transcriptEl = widget.querySelector(".xcv-transcript");
const resultEl = widget.querySelector(".xcv-result");

let recognition = null;
let listening = false;
let finalText = "";
let freeIdx = 0;
let freeModelsList = null;

async function ensureFreeModels(cfg) {
  if (freeModelsList) return freeModelsList;
  try {
    freeModelsList = await window.OpenRouter.fetchFreeModels(cfg.baseUrl, cfg.apiKey);
  } catch (e) {
    freeModelsList = window.OpenRouter.FALLBACK_FREE_MODELS;
  }
  return freeModelsList;
}

function pickFreeModel() {
  const list =
    freeModelsList && freeModelsList.length
      ? freeModelsList
      : window.OpenRouter.FALLBACK_FREE_MODELS;
  const m = list[freeIdx % list.length];
  freeIdx++;
  return m;
}

function startListening() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    state.textContent = "Speech API unavailable";
    return;
  }

  recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = navigator.language || "en-US";

  recognition.onresult = (event) => {
    let interim = "";
    finalText = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const r = event.results[i];
      if (r.isFinal) finalText += r[0].transcript;
      else interim += r[0].transcript;
    }
    transcriptEl.textContent = (finalText + interim).trim();
  };

  recognition.onerror = (event) => {
    state.textContent = "Speech error: " + event.error;
  };

  recognition.onend = () => {
    listening = false;
    mic.classList.remove("xcv-mic--active");
    if (finalText.trim()) {
      state.textContent = "Generating…";
      handleTranscript(finalText.trim());
    } else {
      state.textContent = "Idle";
    }
  };

  finalText = "";
  transcriptEl.textContent = "";
  resultEl.hidden = true;
  resultEl.textContent = "";
  resultEl.classList.remove("xcv-result--error");
  recognition.start();
  listening = true;
  state.textContent = "Listening…";
}

async function handleTranscript(text) {
  const cfg = await window.Storage.getConfig();
  if (!cfg || !cfg.baseUrl || !cfg.apiKey) {
    state.textContent = "Configure LLM in popup";
    resultEl.hidden = false;
    resultEl.classList.add("xcv-result--error");
    resultEl.textContent = "Missing API configuration. Open the ExcaVoice popup and save your settings.";
    return;
  }

  const messages = window.Prompt.buildMessages(text);
  if (cfg.freeModels) {
    await ensureFreeModels(cfg);
    cfg.model = pickFreeModel();
  }

  try {
    const mermaid = await window.LLM.complete(cfg, messages);
    resultEl.hidden = false;
    resultEl.classList.remove("xcv-result--error");
    resultEl.textContent = mermaid;
    state.textContent = "Done";
    // TODO: convert mermaid -> Excalidraw elements and draw on canvas.
  } catch (err) {
    state.textContent = "LLM error";
    resultEl.hidden = false;
    resultEl.classList.add("xcv-result--error");
    resultEl.textContent = String((err && err.message) || err);
  }
}

mic.addEventListener("click", () => {
  if (listening) {
    if (recognition) recognition.stop();
    return;
  }
  const open = !panel.hasAttribute("hidden");
  if (open) {
    panel.setAttribute("hidden", "");
    mic.classList.remove("xcv-mic--active");
    state.textContent = "Idle";
  } else {
    panel.removeAttribute("hidden");
    mic.classList.add("xcv-mic--active");
    startListening();
  }
});

close.addEventListener("click", () => {
  panel.setAttribute("hidden", "");
  if (recognition) recognition.stop();
  mic.classList.remove("xcv-mic--active");
  state.textContent = "Idle";
});
