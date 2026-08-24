import { useState } from "react";
import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useExcaVoice } from "./hooks/useExcaVoice";
import { Chip } from "./components/Chip";
import { ConfigPanel } from "./components/ConfigPanel";
import { LogsPanel } from "./components/LogsPanel";

export function App() {
  const [view, setView] = useState<"none" | "config" | "logs">("none");
  const xv = useExcaVoice();

  const toggleConfig = () => {
    if (view === "config") {
      setView("none");
    } else {
      xv.showConfig();
      setView("config");
    }
  };

  const openLogs = () => setView("logs");

  return (
    <Box
      sx={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 2147483647,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 1,
      }}
    >
      {view !== "none" && (
        <Paper
          sx={{
            width: 320,
            p: 1.5,
            bgcolor: "#26262b",
            color: "#ededf0",
            borderRadius: 2,
            boxShadow: 6,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {view === "config" ? "Configuration" : "Logs"}
            </Typography>
            <IconButton size="small" onClick={() => setView("none")} sx={{ color: "#a0a0ab" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          {view === "config" ? (
            <ConfigPanel
              baseUrl={xv.baseUrl}
              setBaseUrl={xv.setBaseUrl}
              apiKey={xv.apiKey}
              setApiKey={xv.setApiKey}
              model={xv.model}
              setModel={xv.setModel}
              freeModels={xv.freeModels}
              setFreeModels={xv.setFreeModels}
              pauseSeconds={xv.pauseSeconds}
              setPauseSeconds={xv.setPauseSeconds}
              status={xv.status}
              onSave={xv.onSave}
            />
          ) : (
            <LogsPanel logs={xv.logs} live={xv.live} />
          )}
        </Paper>
      )}

      <Chip
        listening={xv.listening}
        view={view}
        onMic={() => xv.onMic(openLogs)}
        onToggleConfig={toggleConfig}
      />
    </Box>
  );
}
