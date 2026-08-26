import { Button, IconButton, Stack } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import SettingsIcon from "@mui/icons-material/Settings";

interface ChipProps {
  listening: boolean;
  view: "none" | "config" | "logs";
  onMic: () => void;
  onToggleConfig: () => void;
}

export function Chip({ listening, view, onMic, onToggleConfig }: ChipProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ bgcolor: "background.paper", borderRadius: 999, p: 0.75, boxShadow: 3 }}
    >
      <Button
        variant="contained"
        onClick={onMic}
        startIcon={<MicIcon />}
        sx={{
          borderRadius: 999,
          px: 2,
          textTransform: "none",
          bgcolor: listening ? "error.main" : "primary.main",
          "&:hover": { bgcolor: listening ? "error.main" : "primary.dark" },
        }}
      >
        {listening ? "Stop" : "Describe"}
      </Button>
      <IconButton
        onClick={onToggleConfig}
        sx={{ color: view === "config" ? "primary.main" : "text.secondary" }}
      >
        <SettingsIcon />
      </IconButton>
    </Stack>
  );
}
