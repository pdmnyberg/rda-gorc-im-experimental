import { usePathname, useSearchParams, useRouter, ReadonlyURLSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";

export type SettingsData = {
  repositoryId?: string;
  modelId?: string;
  profileIds: Set<string>;
  sliceIds: Set<string>;
};

type Settings = SettingsData & {
  update(data: Partial<SettingsData>): void;
};

export const SettingsContext = React.createContext<Settings>({
  repositoryId: undefined,
  modelId: undefined,
  profileIds: new Set(),
  sliceIds: new Set(),
  update() {},
});

export function useSettings() {
  const settings = React.useContext(SettingsContext);
  return settings;
}

function replaceSets(_key: string, value: unknown) {
  return value instanceof Set ? Array.from(value) : value;
}

export function useLocalStorageSettings(id: string) {
  const storeSettings = React.useCallback(
    (updatedSettingsData: SettingsData) => {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(
          id,
          JSON.stringify(updatedSettingsData, replaceSets)
        );
      }
    },
    [id]
  );
  const [settingsData, setSettingsData] = React.useState<SettingsData>(() => {
    const data = typeof localStorage !== "undefined" ? localStorage.getItem(id) : null;
    const s = parseSettingsData(data);
    storeSettings(s);
    return s;
  });
  const settings: Settings = React.useMemo(() => {
    return {
      ...settingsData,
      update(data) {
        setSettingsData((sd) => {
          const updatedSettingsData = {
            ...sd,
            ...data,
          };
          storeSettings(updatedSettingsData);
          return updatedSettingsData;
        });
      },
    };
  }, [settingsData, setSettingsData, storeSettings]);
  return settings;
}

export function useUrlSettings() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const settingsData = useMemo(() => parseSettingsDataFromParams(searchParams), [searchParams]);

  const storeSettings = React.useCallback(
    (updatedSettingsData: SettingsData) => {
      const params = settingsToParams(updatedSettingsData, searchParams)

      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  );

  const settings: Settings = React.useMemo(() => {
    return {
      ...settingsData,
      update(data) {
        storeSettings({
          ...settingsData,
          ...data,
        });
      },
    };
  }, [settingsData, storeSettings]);
  return settings;
}

export function settingsToParams(settingsData: SettingsData, initialParams?: URLSearchParams): URLSearchParams {
  return Object.entries(settingsData).reduce((acc, [key, value]) => {
    if (typeof value === "undefined") {
      acc.delete(key)
    } else if (typeof value === "string") {
      acc.set(key, value)
    } else if (value.size > 0) {
      acc.set(key, Array.from(value).join(","))
    } else if (value.size === 0) {
      acc.delete(key)
    }
    return acc;
  }, new URLSearchParams(initialParams));
}

function parseSettingsDataFromParams(params: ReadonlyURLSearchParams) {
  return parseSettingsData(JSON.stringify({
    repositoryId: params.get("repositoryId") || undefined,
    modelId: params.get("modelId") || undefined,
    profileIds: (params.get("profileIds") || "").split(",").filter(v => v),
    sliceIds: (params.get("sliceIds") || "").split(",").filter(v => v),
  }))
}

function parseSettingsData(data: string | null) {
  const defaults: SettingsData = {
    repositoryId: undefined,
    modelId: undefined,
    profileIds: new Set(),
    sliceIds: new Set(),
  };
  if (data === null) {
    return defaults;
  } else {
    try {
      const settingsData: Partial<SettingsData> = JSON.parse(data);
      return {
        ...defaults,
        ...settingsData,
        profileIds: new Set(settingsData.profileIds),
        sliceIds: new Set(settingsData.sliceIds),
      };
    } catch (e) {
      console.warn("Failed to load user settings. Falling back to defaults.");
      console.warn(e);
      return defaults;
    }
  }
}
