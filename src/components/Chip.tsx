import { Box, Button, IconButton, Stack } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";

interface ChipProps {
  listening: boolean;
  view: "none" | "config" | "logs";
  onMic: () => void;
  onToggleConfig: () => void;
  onToggleLogs: () => void;
}

export function Chip({ listening, view, onMic, onToggleConfig, onToggleLogs }: ChipProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ bgcolor: "#26262b", borderRadius: 999, p: 0.75, boxShadow: 3 }}
    >
      <Button
        variant="contained"
        onClick={onMic}
        startIcon={<MicIcon />}
        sx={{
          borderRadius: 999,
          px: 2,
          textTransform: "none",
          bgcolor: listening ? "#e0566f" : "#6965db",
          "&:hover": { bgcolor: listening ? "#e0566f" : "#7c78e6" },
        }}
      >
        {listening ? "Stop" : "Describe"}
      </Button>
      <IconButton
        onClick={onToggleConfig}
        sx={{ color: view === "config" ? "#6965db" : "#a0a0ab" }}
      >
        <SettingsIcon />
      </IconButton>
      <IconButton
        onClick={onToggleLogs}
        sx={{ color: view === "logs" ? "#6965db" : "#a0a0ab" }}
      >
        <ListAltIcon />
      </IconButton>
    </Stack>
  );
}
