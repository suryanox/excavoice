import "@testing-library/jest-dom";

// Minimal chrome stub so modules that touch chrome.storage at call time don't
// blow up under jsdom (hook tests mock the storage module entirely, but this
// keeps things safe for component tests).
if (!(globalThis as { chrome?: unknown }).chrome) {
  (globalThis as { chrome?: unknown }).chrome = {
    storage: { local: { get: () => {}, set: () => {} } },
  };
}
