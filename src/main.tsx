import "./index.css";
import "@water-fetch/ui/dist/style.css";
import { startApplication } from "@water-fetch/ui/dist/app";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
startApplication(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
