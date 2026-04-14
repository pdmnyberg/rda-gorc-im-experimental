"use client"
import { AppConfig, ConfigContext, parseAppConfig } from "@/contexts/ConfigContext";
import { PropsWithChildren} from "react";
import useSWR from "swr";

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

export function JSONConfigProvider({src, children}: PropsWithChildren<{src: string}>) {
  const {data, isLoading} = useSWR(src, loadConfig, {fallbackData: null});
  return !isLoading && data ? (
    <ConfigContext.Provider value={data}>{children}</ConfigContext.Provider>
  ) : (
    <></>
  )
}