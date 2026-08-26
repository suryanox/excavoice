import { TextField } from "@mui/material";

interface ConfigFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  inputProps?: Record<string, unknown>;
}

export function ConfigField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  inputProps,
}: ConfigFieldProps) {
  return (
    <TextField
      label={label}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      fullWidth
      placeholder={placeholder}
      inputProps={inputProps}
      sx={{
        "& .MuiInputBase-input": { color: "text.primary" },
        "& .MuiInputLabel-root": { color: "text.secondary" },
        "& .MuiInputLabel-root.Mui-focused": { color: "primary.main" },
      }}
    />
  );
}
