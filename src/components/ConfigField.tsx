import { TextField } from "@mui/material";

interface ConfigFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}

// Themed text field used throughout the config form, keeping the dark-theme
// styling in a single reusable place.
export function ConfigField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
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
    />
  );
}
