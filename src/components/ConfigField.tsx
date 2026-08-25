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
  const fieldSx = {
    InputLabelProps: { style: { color: "#a0a0ab" } },
    inputProps: { style: { color: "#ededf0" } },
  };

  return (
    <TextField
      label={label}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      fullWidth
      placeholder={placeholder}
      {...fieldSx}
      inputProps={{ ...fieldSx.inputProps, ...inputProps }}
    />
  );
}
