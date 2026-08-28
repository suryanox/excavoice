# ExcaVoice

Speak a diagram description and ExcaVoice turns it into a Mermaid diagram on [Excalidraw](https://excalidraw.com).

It uses Excalidraw's built-in **Mermaid to diagram** tool to render the result directly on the canvas.

## Demo

<video src="./demo.mp4" controls width="720">
  Your browser does not support embedded video. [Watch the demo](./demo.mp4).
</video>

## How it works

1. ExcaVoice adds a small floating chip to Excalidraw.
2. Click the mic and describe your diagram.
3. Your speech is transcribed.
4. The transcript is sent to an OpenAI-compatible LLM.
5. The LLM returns Mermaid code.
6. ExcaVoice passes the Mermaid code to Excalidraw and renders the diagram.

## Requirements

* Google Chrome or another Chromium browser with MV3 support
* An OpenAI-compatible API and key
* Microphone access

## Build

```bash
npm install
npm run build
```

The unpacked extension is generated in `extension/`.

## Install

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `extension/` folder.
5. Open [Excalidraw](https://excalidraw.com).

## Configure

Click the gear icon on the ExcaVoice chip.

* **API base URL** — any OpenAI-compatible `/v1` endpoint. For example, `https://openrouter.ai/api/v1`.
* **API key** — your API key.
* **Model** — the model to use for Mermaid generation.
* **Free models** — optionally round-robin through models returned by `/v1/models`.
* **Generate after pause** — how long to wait after you stop speaking before generating the diagram.

Click **Save** when you're done.

## Use

Click the mic and describe the diagram.

For example:

> a login flow with a user, frontend, authentication server, and database

After you stop speaking, ExcaVoice generates the Mermaid diagram and adds it to the canvas.

The list icon opens the logs panel with request and transcript details.

## Release

Releases are triggered manually through GitHub Actions.
