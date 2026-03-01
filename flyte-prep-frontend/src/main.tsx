import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App"; // 👈 make sure this path matches your refactor
import { AppProviders } from "./app/providers"; // if you created it
import "./index.css"; // optional

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);