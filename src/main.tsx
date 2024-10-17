import "./index.css";
import "water-fetch/ui/style.css";
import "./server";
import { startApplication } from "water-fetch/ui/app";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
startApplication({
  app: (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ),
  isDev: import.meta.env.DEV,
});
