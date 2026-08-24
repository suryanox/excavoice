import { Button, Checkbox, FormControlLabel, Stack, TextField, Typography } from "@mui/material";

interface ConfigPanelProps {
  baseUrl: string;
  setBaseUrl: (v: string) => void;
  apiKey: string;
  setApiKey: (v: string) => void;
  model: string;
  setModel: (v: string) => void;
  freeModels: boolean;
  setFreeModels: (v: boolean) => void;
  status: { text: string; ok: boolean } | null;
  onSave: () => void;
}

export function ConfigPanel(props: ConfigPanelProps) {
  const fieldSx = {
    InputLabelProps: { style: { color: "#a0a0ab" } },
    inputProps: { style: { color: "#ededf0" } },
  };

  return (
    <Stack spacing={1.5}>
      <TextField
        label="API base URL"
        value={props.baseUrl}
        onChange={(e) => props.setBaseUrl(e.target.value)}
        size="small"
        fullWidth
        placeholder="https://litellm.example.com"
        {...fieldSx}
      />
      <TextField
        label="API key"
        type="password"
        value={props.apiKey}
        onChange={(e) => props.setApiKey(e.target.value)}
        size="small"
        fullWidth
        placeholder="sk-..."
        {...fieldSx}
      />
      <TextField
        label="Model"
        value={props.model}
        onChange={(e) => props.setModel(e.target.value)}
        size="small"
        fullWidth
        placeholder="gpt-4o-mini"
        {...fieldSx}
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
