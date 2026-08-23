export interface ExcaVoiceConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  freeModels: boolean;
  pauseSeconds: string;
}

const KEY = "xcv-config";

export function getConfig(): Promise<ExcaVoiceConfig | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(KEY, (res) => {
      resolve(((res as Record<string, unknown>)[KEY] as ExcaVoiceConfig) ?? null);
    });
  });
}

export function saveConfig(cfg: ExcaVoiceConfig): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [KEY]: cfg }, () => resolve());
  });
}
