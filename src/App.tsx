import { HashRouter, BrowserRouter, Routes, Route } from "react-router";
import React from "react";
import "./index.css";
import Home from "./pages/Home/Home.tsx";
import { About } from "./pages/About/About.tsx";
import {
  parseAppConfig,
  ConfigContext,
  AppConfig,
} from "./contexts/ConfigContext.ts";
import {
  useLocalStorageSettings,
  SettingsContext,
} from "./contexts/SettingsContext.ts";

async function loadConfig(url: string): Promise<AppConfig | null> {
  try {
    const appConfigData = await (await fetch(url)).json();
    return parseAppConfig(appConfigData);
  } catch (e) {
    console.warn(`No config found at: ${url}`);
    console.warn(e)
    return null;
  }
}

export const App = () => {
  const [config, setConfig] = React.useState<AppConfig | null>(null);
  React.useEffect(() => {
    loadConfig("config.json").then((loadedConfig) => {
      setConfig(loadedConfig);
    });
  }, [setConfig]);
  const settings = useLocalStorageSettings("rda-user-settings");

  const routes = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="about" element={<About />} />
    </Routes>
  );
  return config ? (
    <ConfigContext.Provider value={config}>
      <SettingsContext.Provider value={settings}>
        {config.useHashRouter ? (
          <HashRouter>{routes}</HashRouter>
        ) : (
          <BrowserRouter>{routes}</BrowserRouter>
        )}
      </SettingsContext.Provider>
    </ConfigContext.Provider>
  ) : (
    <div className="loading-config">Loading Config</div>
  );
};
