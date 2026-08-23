import { styles } from "./styles";

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
    </div>
    <div class="xcv-panel__footer">
      <span class="xcv-state">Idle</span>
      <span class="xcv-timer">00:00</span>
    </div>
  </div>
`;

injectStyles(styles);
document.body.appendChild(widget);

const mic = widget.querySelector(".xcv-mic") as HTMLButtonElement;
const panel = widget.querySelector(".xcv-panel") as HTMLDivElement;
const close = widget.querySelector(".xcv-close") as HTMLButtonElement;
const state = widget.querySelector(".xcv-state") as HTMLSpanElement;

// UI only: toggle states and controls without business logic.
// Recording / speech / diagram rendering will be added later.

mic.addEventListener("click", () => {
  const open = !panel.hasAttribute("hidden");
  if (open) {
    panel.setAttribute("hidden", "");
    mic.classList.remove("xcv-mic--active");
    state.textContent = "Idle";
  } else {
    panel.removeAttribute("hidden");
    mic.classList.add("xcv-mic--active");
    state.textContent = "Listening…";
  }
});

close.addEventListener("click", () => {
  panel.setAttribute("hidden", "");
  mic.classList.remove("xcv-mic--active");
  state.textContent = "Idle";
});

function injectStyles(css: string): void {
  const tag = document.createElement("style");
  tag.textContent = css;
  document.head.appendChild(tag);
}
