import { useCallback, useState } from "react";
import {
  DEFAULT_CONFIG,
  getConfig,
  saveConfig,
  type ExcaVoiceConfig,
} from "../lib/storage";
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
  pauseSeconds: number;
  setPauseSeconds: (v: number) => void;
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
  const [config, setConfig] = useState<ExcaVoiceConfig>(() => ({ ...DEFAULT_CONFIG }));
  const [status, setStatus] = useState<SaveStatus | null>(null);

  const updateField = useCallback(
    <K extends keyof ExcaVoiceConfig>(field: K, value: ExcaVoiceConfig[K]) => {
      setConfig((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const setBaseUrl = useCallback((value: string) => updateField("baseUrl", value), [updateField]);
  const setApiKey = useCallback((value: string) => updateField("apiKey", value), [updateField]);
  const setModel = useCallback((value: string) => updateField("model", value), [updateField]);
  const setFreeModels = useCallback(
    (value: boolean) => updateField("freeModels", value),
    [updateField],
  );
  const setLanguage = useCallback((value: string) => updateField("language", value), [updateField]);
  const setPauseSeconds = useCallback(
    (value: number) => updateField("pauseSeconds", value),
    [updateField],
  );

  const load = useCallback(() => {
    void getConfig().then((c) => {
      if (c) {
        setConfig({ ...DEFAULT_CONFIG, ...c });
      }
    });
    setStatus(null);
  }, []);

  const save = useCallback(() => {
    const cfg: ExcaVoiceConfig = {
      ...config,
      baseUrl: config.baseUrl.trim(),
      apiKey: config.apiKey.trim(),
      model: config.model.trim(),
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
  }, [config, logger]);

  return {
    ...config,
    setBaseUrl,
    setApiKey,
    setModel,
    setFreeModels,
    setLanguage,
    setPauseSeconds,
    status,
    load,
    save,
  };
}
