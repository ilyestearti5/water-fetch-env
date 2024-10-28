import waterFetchConfig from "./waterfetch.config";
import type { CapacitorConfig } from "@capacitor/cli";
const config: CapacitorConfig = {
  appId: `com.${waterFetchConfig.appId}.app`,
  appName: waterFetchConfig.appName,
  webDir: "dist",
};
export default config;
