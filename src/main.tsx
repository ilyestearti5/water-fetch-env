import "./index.css";
import "water-fetch/ui/style.css";
import { startApplication } from "water-fetch/ui/app";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
startApplication(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
