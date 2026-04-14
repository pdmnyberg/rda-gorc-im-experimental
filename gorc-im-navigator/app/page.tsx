"use client"
import { AppContext } from "@/components/AppContext";
import { LocalStorageSettings } from "@/components/LocalStorageSettings";
import { NavBar } from "@/components/NavBar";
import { NodeInfoPanel } from "@/components/NodeInfoPanel";
import { OffCanvas } from "@/components/OffCanvas";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Tree } from "@/components/Tree";
import { AppConfig, ConfigContext, parseAppConfig, useConfig } from "@/contexts/ConfigContext";
import { useNodeSelection } from "@/contexts/SelectionContexts";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import gorcLogo from '../img/gorc-im-icon.png'

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

function Panels() {
  const [selectedNode, setSelectedNode] = useNodeSelection();
  const [activePanel, setActivePanel] = useState<"settings" | null>(null);
  const deferredNode = useDeferredValue(selectedNode);
  const config = useConfig();
  const navItems = useMemo(() => [
    {label: "Settings", action: () => setActivePanel((current) => current === "settings" ? null : "settings"), id: "settings"},
    {label: "Info", href: "", id: "info"}
  ], [setActivePanel])
  return (
    <>
      <NavBar
        title={config.title}
        subtitle={config.subtitle}
        logo={{src: gorcLogo.src, width: 199, height: 229}}
        items={navItems}
        activeId={activePanel || undefined}
      />
      <OffCanvas title={(selectedNode || deferredNode)?.shortName || "Node information" } position="start" isOpen={!!selectedNode} onClose={() => setSelectedNode(null)}>
        <NodeInfoPanel node={selectedNode || deferredNode} setNode={setSelectedNode}/>
      </OffCanvas>
      <OffCanvas title="Settings" position="end" isOpen={activePanel === "settings"} onClose={() => setActivePanel(null)}>
        <SettingsPanel />
      </OffCanvas>
    </>
  )
}

export default function Home() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  useEffect(() => {
    loadConfig("config.json").then((loadedConfig) => {
      setConfig(loadedConfig);
    });
  }, [setConfig]);

  return config ? (
    <LocalStorageSettings id="gorc-im-navigator">
      <ConfigContext.Provider value={config}>
        <AppContext>
          <div className="tree-container d-flex flex-column align-self-stretch">
            <Panels />
            <div className="flex-grow-1 flex-shrink-1">
              <Tree />
            </div>
          </div>
        </AppContext>
      </ConfigContext.Provider>
    </LocalStorageSettings>
  ) : <></>;
}
