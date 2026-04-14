import React from "react";

export type AppConfig = {
  repositories: { url: string; id: string; name: string }[];
  title: string;
  subtitle?: string;
  useHashRouter: boolean;
};

export const ConfigContext = React.createContext<AppConfig>(parseAppConfig());

export function useConfig() {
  return React.useContext(ConfigContext);
}

export function parseAppConfig(data?: unknown): AppConfig {
  const defaults: AppConfig = {
    title: "RDA Visualisation App",
    repositories: [],
    useHashRouter: false,
  };
  if (data && typeof data === "object") {
    return {
      title:
        "title" in data && typeof data.title === "string"
          ? data.title
          : defaults.title,
      subtitle:
        "subtitle" in data && typeof data.subtitle === "string"
          ? data.subtitle
          : defaults.subtitle,
      repositories:
        "repositories" in data && Array.isArray(data.repositories)
          ? data.repositories.map<AppConfig["repositories"][number]>((r) => r)
          : defaults.repositories,
      useHashRouter:
        "useHashRouter" in data && typeof data.useHashRouter === "boolean"
          ? data.useHashRouter
          : defaults.useHashRouter,
    };
  } else {
    return defaults;
  }
}
