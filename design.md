# ExcaVoice

A browser extension that lets users speak a diagram description and renders the generated Mermaid diagram directly on Excalidraw.

## Requirements

* Run only on `excalidraw.com`.
* Capture voice input locally using speech-to-text (Google Chrome builtin sst?).
* Send the transcript to a user-configured LLM.
* Support LITELLM API endpoints (so can use with any provider).
* Let users configure the API base URL, API key, and model.
* Support OpenRouter as a provider.
* When OpenRouter free models are enabled, fetch available free models and distribute requests using round robin.
* Generate Mermaid from the user's request.
* Convert the Mermaid output into an Excalidraw diagram.
* Keep API configuration local to the browser.

## Design

### Extension

Use Chrome Manifest V3 with TypeScript and Vite.

The content script runs on Excalidraw and handles interaction with the canvas. The popup provides configuration for the LLM and voice settings.

### Speech

Use local Whisper for speech-to-text or google. Audio should not be sent to the LLM provider.

### LLM

Use a small provider abstraction so different OpenAI-compatible APIs can be supported.

```text
LLM Client
   |
   +-- OpenAI Compatible
   |
   +-- OpenRouter
          |
          +-- Free Model Pool
```

The LLM receives the transcript and returns Mermaid code.

### Mermaid

Validate and parse the Mermaid response before rendering it. The LLM should be instructed to return Mermaid only.

### Excalidraw

The content script takes the generated diagram and creates the corresponding Excalidraw elements on the current canvas.

### Flow

```text
Voice
  ↓
Local Whisper
  ↓
Transcript
  ↓
LLM
  ↓
Mermaid (meramid js paser)
  ↓
Parser
  ↓
Excalidraw Elements
```

## Initial Scope

The first version should focus on basic flowcharts and simple diagrams. More Mermaid diagram types can be added later.
