import { Box, Stack } from "@mui/material";
import type { LogEntry } from "../hooks/useExcaVoice";

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
  return (
    <Stack spacing={1}>
      <Box
        sx={{
          bgcolor: "#1b1b1f",
          borderRadius: 1,
          p: 1,
          minHeight: 40,
          fontSize: 13,
          color: live ? "#ededf0" : "#a0a0ab",
          fontStyle: live ? "normal" : "italic",
        }}
      >
        {live || "Press the mic and describe your diagram…"}
      </Box>
      <Box
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
              color: LEVEL_COLOR[l.level] || "#a0a0ab",
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
