import { Button, Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import { ConfigField } from "./ConfigField";
import type { SaveStatus } from "../hooks/useConfig";

interface ConfigPanelProps {
  baseUrl: string;
  setBaseUrl: (v: string) => void;
  apiKey: string;
  setApiKey: (v: string) => void;
  model: string;
  setModel: (v: string) => void;
  freeModels: boolean;
  setFreeModels: (v: boolean) => void;
  status: SaveStatus | null;
  onSave: () => void;
}

export function ConfigPanel(props: ConfigPanelProps) {
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
      <FormControlLabel
        control={
          <Checkbox
            checked={props.freeModels}
            onChange={(e) => props.setFreeModels(e.target.checked)}
            sx={{ color: "#a0a0ab", "&.Mui-checked": { color: "#6965db" } }}
          />
        }
        label={
          <Typography variant="caption" sx={{ color: "#a0a0ab" }}>
            Use OpenRouter free models
          </Typography>
        }
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          variant="caption"
          sx={{ color: props.status?.ok ? "#4caf7d" : "#e0566f" }}
        >
          {props.status?.text || ""}
        </Typography>
        <Button variant="contained" onClick={props.onSave} sx={{ bgcolor: "#6965db" }}>
          Save
        </Button>
      </Stack>
    </Stack>
  );
}
