"use client"
import { SettingsContext, useLocalStorageSettings } from "@/contexts/SettingsContext";
import { PropsWithChildren, Suspense} from "react";

export function LocalStorageSettings({id, children}: PropsWithChildren<{id: string}>) {
  const settings = useLocalStorageSettings(id);

  return (
    <Suspense>
      <SettingsContext.Provider value={settings}>
        {children}
      </SettingsContext.Provider>
    </Suspense>
  )
}