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
  language: string;
  setLanguage: (v: string) => void;
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

export function useConfig(logger: Logger): ConfigState {
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [freeModels, setFreeModels] = useState(false);
  const [language, setLanguage] = useState("en");
  const [status, setStatus] = useState<SaveStatus | null>(null);

  const load = useCallback(() => {
    void getConfig().then((c) => {
      if (c) {
        setBaseUrl(c.baseUrl || "");
        setApiKey(c.apiKey || "");
        setModel(c.model || "");
        setFreeModels(!!c.freeModels);
        setLanguage(c.language || "en");
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
      language,
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
  }, [baseUrl, apiKey, model, freeModels, language, logger]);

  return {
    baseUrl,
    setBaseUrl,
    apiKey,
    setApiKey,
    model,
    setModel,
    freeModels,
    setFreeModels,
    language,
    setLanguage,
    status,
    load,
    save,
  };
}
