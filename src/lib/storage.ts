export interface ExcaVoiceConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  freeModels: boolean;
  language: string;
}

const KEY = "xcv-config";
const DEFAULT_CONFIG: ExcaVoiceConfig = {
  baseUrl: "",
  apiKey: "",
  model: "",
  freeModels: false,
  language: "en",
};

export function getConfig(): Promise<ExcaVoiceConfig | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(KEY, (res) => {
      const stored = (res as Record<string, unknown>)[KEY];
      if (!stored || typeof stored !== "object") {
        resolve(null);
        return;
      }

      resolve({
        ...DEFAULT_CONFIG,
        ...(stored as Partial<ExcaVoiceConfig>),
      });
    });
  });
}

export function saveConfig(cfg: ExcaVoiceConfig): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [KEY]: cfg }, () => resolve());
  });
}
