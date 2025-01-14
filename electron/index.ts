import {
  createMainWindow,
  setUpAppEnv,
  startApplicationForDesktop,
} from "biqpod/electron";
import { development, production } from "../app.json";

setUpAppEnv({
  devUrl: "http://localhost:" + development.port,
  prodUrl: production.url,
});

export var mainWindow: Electron.BrowserWindow | null = null;

startApplicationForDesktop(async () => {
  mainWindow = await createMainWindow();
});
