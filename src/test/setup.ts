import "@testing-library/jest-dom";

if (!(globalThis as { chrome?: unknown }).chrome) {
  (globalThis as { chrome?: unknown }).chrome = {
    storage: { local: { get: () => {}, set: () => {} } },
  };
}
