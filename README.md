# ExcaVoice

Speak a diagram description and ExcaVoice renders the generated Mermaid diagram
directly on [Excalidraw](https://excalidraw.com) using Excalidraw's own
"Mermaid to diagram" tool.

## What it does

1. A floating chip appears on Excalidraw (bottom-right).
2. Click the mic, describe a diagram (e.g. "a login flow with a user and a
   server"), and ExcaVoice transcribes your speech.
3. The transcript is sent to an OpenAI-compatible LLM (via a LiteLLM proxy or any
   `/v1` endpoint) that returns Mermaid code.
4. The Mermaid is pasted into Excalidraw's "Mermaid to diagram" menu and
   rendered as a real Excalidraw diagram.

## Requirements

- Google Chrome (or any Chromium-based browser with MV3 support).
- An OpenAI-compatible API base URL and key (e.g. `https://openrouter.ai/api/v1`).
- Microphone access.

## Build

```bash
npm install
npm run build
```

This produces the unpacked extension in the `extension/` folder.

## Install (load unpacked)

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked** and select the `extension/` folder in this repo.
4. Visit <https://excalidraw.com>.

## Configure

1. Click the gear icon on the floating chip.
2. Enter:
   - **API base URL** — e.g. `https://openrouter.ai/api/v1` (the `/v1` suffix
     is optional; it is handled automatically).
   - **API key**.
   - **Model** — or enable **Free models** to round-robin over the models
     returned by `/v1/models`.
   - **Generate after pause** — seconds of silence before diagram generation
     (press Describe/mic to cancel).
3. Click **Save**.

## Use

- Click the mic and speak your diagram description.
- A short pause triggers generation; the resulting diagram appears on the canvas.
- Click the list icon to open the logs panel for request/transcript details.

## Notes

- The extension only runs on `https://excalidraw.com/*`.
- Your config is stored locally in `chrome.storage`.
