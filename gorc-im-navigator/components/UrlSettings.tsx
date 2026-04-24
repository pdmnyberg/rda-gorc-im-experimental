"use client"
import { SettingsContext, useUrlSettings } from "@/contexts/SettingsContext";
import { PropsWithChildren } from "react";

export function UrlSettings({children}: PropsWithChildren<{}>) {
  const settings = useUrlSettings();

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}