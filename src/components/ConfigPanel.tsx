import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { ConfigField } from "./ConfigField";
import type { SaveStatus } from "../hooks/useConfig";
import { PortalContainerContext } from "./PortalContainerContext";

const LANGUAGES: { code: string; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish (Español)" },
  { code: "fr", label: "French (Français)" },
  { code: "de", label: "German (Deutsch)" },
  { code: "pt", label: "Portuguese (Português)" },
  { code: "hi", label: "Hindi (हिन्दी)" },
  { code: "ja", label: "Japanese (日本語)" },
  { code: "zh", label: "Chinese (中文)" },
  { code: "ru", label: "Russian (Русский)" },
  { code: "ar", label: "Arabic (العربية)" },
];

interface ConfigPanelProps {
  baseUrl: string;
  setBaseUrl: (v: string) => void;
  apiKey: string;
  setApiKey: (v: string) => void;
  model: string;
  setModel: (v: string) => void;
  freeModels: boolean;
  setFreeModels: (v: boolean) => void;
  language: string;
  setLanguage: (v: string) => void;
  pauseSeconds: number;
  setPauseSeconds: (v: number) => void;
  status: SaveStatus | null;
  onSave: () => void;
}

export function ConfigPanel(props: ConfigPanelProps) {
  const portalContainer = useContext(PortalContainerContext);

  return (
    <Stack spacing={1.5}>
      <ConfigField
        label="API base URL"
        value={props.baseUrl}
        onChange={props.setBaseUrl}
        placeholder="https://litellm.example.com"
      />
      <ConfigField
        label="API key"
        type="password"
        value={props.apiKey}
        onChange={props.setApiKey}
        placeholder="sk-..."
      />
      <ConfigField
        label="Model"
        value={props.model}
        onChange={props.setModel}
        placeholder="gpt-4o-mini"
      />
      <ConfigField
        label="Pause before submitting (seconds)"
        type="number"
        value={String(props.pauseSeconds)}
        onChange={(value) => {
          const seconds = Number(value);
          if (Number.isFinite(seconds) && seconds > 0) props.setPauseSeconds(seconds);
        }}
        inputProps={{ min: 0.5, max: 10, step: 0.5 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={props.freeModels}
            onChange={(e) => props.setFreeModels(e.target.checked)}
            sx={{ color: "text.secondary", "&.Mui-checked": { color: "primary.main" } }}
          />
        }
        label={
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Use OpenRouter free models
          </Typography>
        }
      />
      <FormControl size="small" fullWidth>
        <InputLabel sx={{ color: "text.secondary" }}>Language</InputLabel>
        <Select
          label="Language"
          value={props.language}
          onChange={(e) => props.setLanguage(e.target.value)}
          MenuProps={{
            container: portalContainer ?? undefined,
            PaperProps: {
              sx: {
                bgcolor: "background.paper",
                color: "text.primary",
              },
            },
          }}
          sx={{ color: "text.primary" }}
        >
          {LANGUAGES.map((l) => (
            <MenuItem
              key={l.code}
              value={l.code}
              sx={{
                color: "text.primary",
                "&:hover": { bgcolor: "action.hover" },
                "&.Mui-selected": { bgcolor: "action.selected" },
                "&.Mui-selected:hover": { bgcolor: "action.selected" },
              }}
            >
              {l.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          variant="caption"
          sx={{ color: props.status?.ok ? "success.main" : "error.main" }}
        >
          {props.status?.text || ""}
        </Typography>
        <Button variant="contained" onClick={props.onSave}>
          Save
        </Button>
      </Stack>
    </Stack>
  );
}
