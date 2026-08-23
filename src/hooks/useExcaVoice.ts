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

function pauseSecondsOf(cfg: ExcaVoiceConfig): number {
  const raw = cfg.pauseSeconds;
  if (raw === "" || raw == null) return 5;
  const s = Number(raw);
  return isNaN(s) || s < 0 ? 0 : s;
}

export function useExcaVoice() {
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [freeModels, setFreeModels] = useState(false);
  const [pauseSeconds, setPauseSeconds] = useState("5");
  const [status, setStatus] = useState<{ text: string; ok: boolean } | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [live, setLive] = useState("");
  const [listening, setListening] = useState(false);

  const stopRef = useRef<(() => void) | null>(null);
  const genTimer = useRef<number | null>(null);
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
        setPauseSeconds(c.pauseSeconds != null && c.pauseSeconds !== "" ? c.pauseSeconds : "5");
      }
    });
    setStatus(null);
  };

  const validate = (cfg: ExcaVoiceConfig): string | null => {
    if (!cfg.baseUrl) return "API base URL is required.";
    if (!cfg.apiKey) return "API key is required.";
    if (!cfg.freeModels && !cfg.model) return "Model is required unless free models is enabled.";
    if (
      cfg.pauseSeconds !== "" &&
      (isNaN(Number(cfg.pauseSeconds)) || Number(cfg.pauseSeconds) < 0)
    ) {
      return "Generate after pause must be a number ≥ 0.";
    }
    return null;
  };

  const onSave = () => {
    const cfg: ExcaVoiceConfig = {
      baseUrl: baseUrl.trim(),
      apiKey: apiKey.trim(),
      model: model.trim(),
      freeModels,
      pauseSeconds: pauseSeconds.trim(),
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

  const pickModel = (): string => {
    const list = modelList.current ?? [];
    if (list.length === 0) return "";
    const m = list[freeIdx.current % list.length];
    freeIdx.current++;
    return m;
  };

  const runGeneration = async (
    cfg: ExcaVoiceConfig,
    messages: ReturnType<typeof buildMessages>,
  ) => {
    genTimer.current = null;
    try {
      const mermaid = await complete(cfg, messages);
      log("success", "Generation successful.");
      await sendToExcalidraw(mermaid);
    } catch (err) {
      log("error", String((err as Error)?.message || err));
    }
  };

  const handleTranscript = async (text: string) => {
    const cfg = await getConfig();
    if (!cfg || !cfg.baseUrl || !cfg.apiKey) {
      log("error", "Missing API configuration. Open the config (gear) and save your settings.");
      return;
    }

    const messages = buildMessages(text);
    let m = cfg.model;
    if (cfg.freeModels) {
      await ensureModels(cfg);
      m = pickModel();
      if (!m) {
        log("error", "No models available. Check your /v1/models endpoint.");
        return;
      }
      log("req", "Using model: " + m);
    } else {
      log("req", "Model: " + m);
    }
    cfg.model = m;

    const secs = pauseSecondsOf(cfg);
    if (secs > 0) {
      log("info", "Pause detected — generating in " + secs + "s. Press Describe to cancel.");
      if (genTimer.current) window.clearTimeout(genTimer.current);
      genTimer.current = window.setTimeout(() => runGeneration(cfg, messages), secs * 1000);
    } else {
      runGeneration(cfg, messages);
    }
  };

  const startListening = (onOpenLogs: () => void) => {
    if (genTimer.current) {
      window.clearTimeout(genTimer.current);
      genTimer.current = null;
    }
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
    pauseSeconds,
    setPauseSeconds,
    status,
    logs,
    live,
    listening,
    showConfig,
    onSave,
    onMic,
  };
}
