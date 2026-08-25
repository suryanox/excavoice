export interface ExcaVoiceConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  freeModels: boolean;
  language: string;
  pauseSeconds: number;
}

const KEY = "xcv-config";
export const DEFAULT_CONFIG: ExcaVoiceConfig = {
  baseUrl: "",
  apiKey: "",
  model: "",
  freeModels: false,
  language: "en",
  pauseSeconds: 5,
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
