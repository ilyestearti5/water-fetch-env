/// <reference types="vitest" />

import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import fs from "node:fs/promises";
import { defineConfig } from "vite";
import pkg from "./package.json";

function incrementVersion(version: string) {
  // Check if the version has a ~ or ^ prefix
  const prefix = version[0] === "~" || version[0] === "^" ? version[0] : "";
  const versionWithoutPrefix = prefix ? version.slice(1) : version;

  const parts = versionWithoutPrefix.split(".").map(Number);

  if (prefix === "~") {
    // Increment the last part for ~ prefix
    parts[2]++;
  } else if (prefix === "^") {
    // Increment the last part for ^ prefix
    parts[2]++;
  } else {
    // General increment logic
    for (let i = parts.length - 1; i >= 0; i--) {
      if (parts[i] < 9) {
        parts[i]++;
        break;
      } else {
        parts[i] = 0;
      }
    }
  }

  return prefix + parts.join(".");
}

// https://vitejs.dev/config/
export default defineConfig(async ({ command }) => {
  if (command == "build") {
    // update the version if it's in the build process
    const newVersion = incrementVersion(pkg.version);
    try {
      await fs.writeFile(
        "./package.json",
        JSON.stringify({ ...pkg, version: newVersion }, undefined, 2),
        "utf-8"
      );
    } catch {}
    console.log("Building For Version ...", newVersion);
  }
  return {
    plugins: [react(), legacy()],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  };
});
