"use client"
import { SettingsContext, useUrlSettings } from "@/contexts/SettingsContext";
import { PropsWithChildren, Suspense } from "react";


export function UrlSettingsBase({children}: PropsWithChildren<{}>) {
  const settings = useUrlSettings();

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export function UrlSettings({children}: PropsWithChildren<{}>) {
  return (
    <Suspense>
      <UrlSettingsBase>
        {children}
      </UrlSettingsBase>
    </Suspense>
  )
}