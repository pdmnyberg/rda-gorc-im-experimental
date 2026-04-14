"use client"
import { SettingsContext, useLocalStorageSettings } from "@/contexts/SettingsContext";
import { PropsWithChildren } from "react";

export function LocalStorageSettings({id, children}: PropsWithChildren<{id: string}>) {
  const settings = useLocalStorageSettings(id);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}