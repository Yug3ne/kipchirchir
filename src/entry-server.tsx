import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { Analytics } from "@vercel/analytics/react";

import App from "@/App";

export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
      <Analytics />
    </StrictMode>,
  );
}
