window.Storage = {
  async getConfig() {
    return new Promise((resolve) => {
      chrome.storage.local.get("xcv-config", (res) => {
        resolve(res["xcv-config"] || null);
      });
    });
  },
  async saveConfig(cfg) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ "xcv-config": cfg }, () => resolve());
    });
  },
};
