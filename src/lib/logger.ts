export type LogLevel = "info" | "req" | "success" | "warn" | "error";

export interface LogEntry {
  t: string;
  level: LogLevel;
  msg: string;
}

// Minimal logging contract so consumers (hooks, services) stay decoupled
// from the concrete React state implementation.
export interface Logger {
  info(msg: string): void;
  req(msg: string): void;
  success(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}

export function formatError(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}
