import { useRef, useState } from "react";
import { getConfig, saveConfig, type ExcaVoiceConfig } from "../lib/storage";
import { buildMessages, complete } from "../lib/llm";
import { fetchModels } from "../lib/models";
import { startTranscription } from "../lib/speech";
import { sendToExcalidraw } from "../lib/excalidraw";

export interface LogEntry {
  t: string;
  level: string;
  msg: string;
}

export function useExcaVoice() {
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [freeModels, setFreeModels] = useState(false);
  const [status, setStatus] = useState<{ text: string; ok: boolean } | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [live, setLive] = useState("");
  const [listening, setListening] = useState(false);

  const stopRef = useRef<(() => void) | null>(null);
  const freeIdx = useRef(0);
  const modelList = useRef<string[] | null>(null);

  const log = (level: string, msg: string) => {
    const t = new Date().toLocaleTimeString("en-GB", { hour12: false });
    setLogs((p) => [...p, { t, level, msg }]);
  };

  const showConfig = () => {
    getConfig().then((c) => {
      if (c) {
        setBaseUrl(c.baseUrl || "");
        setApiKey(c.apiKey || "");
        setModel(c.model || "");
        setFreeModels(!!c.freeModels);
      }
    });
    setStatus(null);
  };

  const validate = (cfg: ExcaVoiceConfig): string | null => {
    if (!cfg.baseUrl) return "API base URL is required.";
    if (!cfg.apiKey) return "API key is required.";
    if (!cfg.freeModels && !cfg.model) return "Model is required unless free models is enabled.";
    return null;
  };

  const onSave = () => {
    const cfg: ExcaVoiceConfig = {
      baseUrl: baseUrl.trim(),
      apiKey: apiKey.trim(),
      model: model.trim(),
      freeModels,
    };
    const err = validate(cfg);
    if (err) {
      setStatus({ text: err, ok: false });
      log("error", "Config invalid: " + err);
      return;
    }
    saveConfig(cfg).then(() => {
      setStatus({ text: "Saved", ok: true });
      log("success", "Configuration saved.");
      window.setTimeout(() => setStatus(null), 800);
    });
  };

  const ensureModels = async (cfg: ExcaVoiceConfig) => {
    if (modelList.current) return modelList.current;
    try {
      modelList.current = await fetchModels(cfg.baseUrl, cfg.apiKey);
      log("info", "Loaded " + modelList.current.length + " model(s) from /v1/models.");
    } catch (e) {
      modelList.current = [];
      log("error", "Failed to load models: " + String((e as Error)?.message || e));
    }
    return modelList.current;
  };

  const handleTranscript = async (text: string) => {
    const cfg = await getConfig();
    if (!cfg || !cfg.baseUrl || !cfg.apiKey) {
      log("error", "Missing API configuration. Open the config (gear) and save your settings.");
      return;
    }

    const messages = buildMessages(text);

    let mermaid = "";
    if (cfg.freeModels) {
      await ensureModels(cfg);
      const list = modelList.current ?? [];
      if (list.length === 0) {
        log("error", "No models available. Check your /v1/models endpoint.");
        return;
      }
      const maxTries = Math.min(4, list.length);
      let tried = 0;
      let idx = freeIdx.current % list.length;
      while (tried < maxTries) {
        const model = list[idx];
        freeIdx.current = (idx + 1) % list.length;
        cfg.model = model;
        log("req", "Using model: " + model);
        tried++;
        try {
          mermaid = await complete(cfg, messages);
          log("success", "Generation successful.");
          break;
        } catch (err) {
          log("error", `Model ${model} failed: ${String((err as Error)?.message || err)}`);
        }
        idx = freeIdx.current % list.length;
      }
      if (!mermaid) {
        log("error", `All ${tried} free model(s) failed.`);
        return;
      }
    } else {
      log("req", "Model: " + cfg.model);
      try {
        mermaid = await complete(cfg, messages);
        log("success", "Generation successful.");
      } catch (err) {
        log("error", String((err as Error)?.message || err));
        return;
      }
    }

    try {
      await sendToExcalidraw(mermaid);
    } catch (err) {
      log("error", "Failed to insert diagram into Excalidraw: " + String((err as Error)?.message || err));
    }
  };

  const startListening = (onOpenLogs: () => void) => {
    onOpenLogs();
    setLive("");
    stopRef.current = startTranscription({
      onStart: () => log("info", "Microphone permission granted. Listening…"),
      onPartial: (t) => setLive(t),
      onFinal: (t) => {
        setListening(false);
        log("info", "Transcript: " + t);
        handleTranscript(t);
      },
      onError: (e) => {
        setListening(false);
        log("error", "Speech error: " + e);
      },
    });
    setListening(true);
    log("info", "Waiting for microphone permission…");
  };

  const onMic = (onOpenLogs: () => void) => {
    if (listening) {
      stopRef.current?.();
      stopRef.current = null;
      setListening(false);
      return;
    }
    startListening(onOpenLogs);
  };

  return {
    baseUrl,
    setBaseUrl,
    apiKey,
    setApiKey,
    model,
    setModel,
    freeModels,
    setFreeModels,
    status,
    logs,
    live,
    listening,
    showConfig,
    onSave,
    onMic,
  };
}
