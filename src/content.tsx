import React from "react";
import { createRoot } from "react-dom/client";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { StyledEngineProvider } from "@mui/material/styles";
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

createRoot(mount).render(
  <StyledEngineProvider injectFirst>
    <CacheProvider value={cache}>
      <PortalContainerProvider container={portalRoot}>
        <App />
      </PortalContainerProvider>
    </CacheProvider>
  </StyledEngineProvider>,
);
