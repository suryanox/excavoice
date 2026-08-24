import type { ReactNode } from "react";
import { IconButton, Paper, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface PanelProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

// Reusable floating container used for both the config and logs views.
export function Panel({ title, onClose, children }: PanelProps) {
  return (
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
          {title}
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          aria-label="Close"
          sx={{ color: "#a0a0ab" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
      {children}
    </Paper>
  );
}
