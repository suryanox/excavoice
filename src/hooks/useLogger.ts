import { useCallback, useMemo, useState } from "react";
import type { Logger, LogEntry } from "../lib/logger";

export type LoggerState = Logger & { logs: LogEntry[] };

export function useLogger(): LoggerState {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const append = useCallback((level: LogEntry["level"], msg: string) => {
    const t = new Date().toLocaleTimeString("en-GB", { hour12: false });
    setLogs((prev) => [...prev, { t, level, msg }]);
  }, []);

  const logger = useMemo<Logger>(
    () => ({
      info: (m) => append("info", m),
      req: (m) => append("req", m),
      success: (m) => append("success", m),
      warn: (m) => append("warn", m),
      error: (m) => append("error", m),
    }),
    [append],
  );

  return { ...logger, logs };
}
