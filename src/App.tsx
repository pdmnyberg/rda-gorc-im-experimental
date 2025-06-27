import { HashRouter, BrowserRouter, Routes, Route } from "react-router";
import React from "react";
import "./index.css";
import Home from "./pages/Home/Home.tsx";
import { Documentation } from "./pages/Documentation/Documentation.tsx";
import {
  parseAppConfig,
  ConfigContext,
  AppConfig,
} from "./contexts/ConfigContext.ts";

async function loadConfig(url: string): Promise<AppConfig | null> {
  try {
    const appConfigData = await (await fetch(url)).json();
    return parseAppConfig(appConfigData);
  } catch (_e) {
    console.warn(`No config found at: ${url}`);
    return null;
  }
}

export const App = () => {
  const [config, setConfig] = React.useState<AppConfig | null>(null);
  React.useEffect(() => {
    loadConfig("config.json").then((loadedConfig) => {
      setConfig(loadedConfig);
    });
  }, [setConfig, loadConfig]);

  const routes = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="documentation" element={<Documentation />} />
    </Routes>
  )
  return config ? (
    <ConfigContext.Provider value={config}>
      {config.useHashRouter ? (
        <HashRouter>{routes}</HashRouter>
      ) : (
        <BrowserRouter>{routes}</BrowserRouter>
      )}
    </ConfigContext.Provider>
  ) : (
    <div className="loading-config">Loading Config</div>
  );
};
