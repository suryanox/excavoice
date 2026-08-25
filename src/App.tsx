import { useState } from "react";
import { Box } from "@mui/material";
import { useExcaVoice } from "./hooks/useExcaVoice";
import { Chip } from "./components/Chip";
import { ConfigPanel } from "./components/ConfigPanel";
import { LogsPanel } from "./components/LogsPanel";
import { Panel } from "./components/Panel";

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

  const saveConfig = async () => {
    if (await xv.onSave()) setView("none");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "0px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2147483647,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      {view !== "none" && (
        <Panel
          title={view === "config" ? "Configuration" : "Logs"}
          onClose={() => setView("none")}
        >
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
              language={xv.language}
              setLanguage={xv.setLanguage}
              pauseSeconds={xv.pauseSeconds}
              setPauseSeconds={xv.setPauseSeconds}
              status={xv.status}
              onSave={saveConfig}
            />
          ) : (
            <LogsPanel logs={xv.logs} live={xv.live} />
          )}
        </Panel>
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
