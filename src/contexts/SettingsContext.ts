import React from "react";

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
      localStorage.setItem(
        id,
        JSON.stringify(updatedSettingsData, replaceSets)
      );
    },
    [id]
  );
  const [settingsData, setSettingsData] = React.useState<SettingsData>(() => {
    const data = localStorage.getItem(id);
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
