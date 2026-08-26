import { Box, Stack } from "@mui/material";
import { useEffect, useRef } from "react";
import type { LogEntry } from "../lib/logger";

const LEVEL_COLOR: Record<string, string> = {
  info: "#a0a0ab",
  req: "#9db4ff",
  success: "#4caf7d",
  warn: "#e0b34c",
  error: "#e0566f",
};

interface LogsPanelProps {
  logs: LogEntry[];
  live: string;
}

export function LogsPanel({ logs, live }: LogsPanelProps) {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logContainer = logContainerRef.current;
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }, [logs]);

  return (
    <Stack spacing={1}>
      <Box
        sx={{
          bgcolor: "background.default",
          borderRadius: 1,
          p: 1,
          minHeight: 40,
          fontSize: 13,
          color: live ? "text.primary" : "text.secondary",
          fontStyle: live ? "normal" : "italic",
        }}
      >
        {live || "Press the mic and describe your diagram…"}
      </Box>
      <Box
        ref={logContainerRef}
        role="log"
        aria-label="Log entries"
        sx={{
          maxHeight: 220,
          overflow: "auto",
          fontFamily: "monospace",
          fontSize: 11,
          lineHeight: 1.45,
        }}
      >
        {logs.map((l, i) => (
          <Box
            key={i}
            sx={{
              color: LEVEL_COLOR[l.level] || "text.secondary",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            [{l.t}] {l.level.toUpperCase().padEnd(7)}  {l.msg}
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
