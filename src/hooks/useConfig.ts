import { useCallback, useState } from "react";
import { getConfig, saveConfig, type ExcaVoiceConfig } from "../lib/storage";
import type { Logger } from "../lib/logger";

export interface SaveStatus {
  text: string;
  ok: boolean;
}

export interface ConfigState {
  baseUrl: string;
  setBaseUrl: (v: string) => void;
  apiKey: string;
  setApiKey: (v: string) => void;
  model: string;
  setModel: (v: string) => void;
  freeModels: boolean;
  setFreeModels: (v: boolean) => void;
  status: SaveStatus | null;
  load: () => void;
  save: () => void;
}

function validate(cfg: ExcaVoiceConfig): string | null {
  if (!cfg.baseUrl) return "API base URL is required.";
  if (!cfg.apiKey) return "API key is required.";
  if (!cfg.freeModels && !cfg.model) {
    return "Model is required unless free models is enabled.";
  }
  return null;
}

// Owns API configuration state plus load/save behaviour. The Logger is injected
// so config feedback is reported through the same channel as the rest of the app.
export function useConfig(logger: Logger): ConfigState {
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [freeModels, setFreeModels] = useState(false);
  const [status, setStatus] = useState<SaveStatus | null>(null);

  const load = useCallback(() => {
    void getConfig().then((c) => {
      if (c) {
        setBaseUrl(c.baseUrl || "");
        setApiKey(c.apiKey || "");
        setModel(c.model || "");
        setFreeModels(!!c.freeModels);
      }
    });
    setStatus(null);
  }, []);

  const save = useCallback(() => {
    const cfg: ExcaVoiceConfig = {
      baseUrl: baseUrl.trim(),
      apiKey: apiKey.trim(),
      model: model.trim(),
      freeModels,
    };

    const err = validate(cfg);
    if (err) {
      setStatus({ text: err, ok: false });
      logger.error("Config invalid: " + err);
      return;
    }

    void saveConfig(cfg).then(() => {
      setStatus({ text: "Saved", ok: true });
      logger.success("Configuration saved.");
      window.setTimeout(() => setStatus(null), 800);
    });
  }, [baseUrl, apiKey, model, freeModels, logger]);

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
    load,
    save,
  };
}
