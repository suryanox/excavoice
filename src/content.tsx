import React from "react";
import { createRoot } from "react-dom/client";
import { useEffect, useMemo } from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { App } from "./App";
import { PortalContainerProvider } from "./components/PortalContainerContext";

const host = document.createElement("div");
host.id = "xcv-root";
const shadow = host.attachShadow({ mode: "open" });
const mount = document.createElement("div");
shadow.appendChild(mount);
const portalRoot = document.createElement("div");
portalRoot.id = "xcv-portal";
portalRoot.style.position = "relative";
portalRoot.style.zIndex = "2147483647";
shadow.appendChild(portalRoot);
document.body.appendChild(host);

const cache = createCache({ key: "xcv", container: shadow as unknown as HTMLElement });
function ThemedApp() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDark ? "dark" : "light",
          primary: { main: prefersDark ? "#6965db" : "#5b56d6" },
          background: prefersDark
            ? { default: "#1b1b1f", paper: "#26262b" }
            : { default: "#f5f5f7", paper: "#ffffff" },
        },
      }),
    [prefersDark],
  );

  useEffect(() => {
    portalRoot.style.colorScheme = prefersDark ? "dark" : "light";
  }, [prefersDark]);

  return (
    <ThemeProvider theme={theme}>
      <PortalContainerProvider container={portalRoot}>
        <App />
      </PortalContainerProvider>
    </ThemeProvider>
  );
}

createRoot(mount).render(
  <StyledEngineProvider injectFirst>
    <CacheProvider value={cache}>
      <ThemedApp />
    </CacheProvider>
  </StyledEngineProvider>,
);
