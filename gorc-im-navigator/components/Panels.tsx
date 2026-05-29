"use client"
import { useConfig } from "@/contexts/ConfigContext";
import { useNodeSelection } from "@/contexts/SelectionContexts";
import { useDeferredValue, useMemo, useState } from "react";
import { NavBar, NavItem } from "./NavBar";
import { OffCanvas } from "./OffCanvas";
import { NodeInfoPanel } from "./NodeInfoPanel";
import { SettingsPanel } from "./SettingsPanel";
import gorcLogo from '../img/gorc-im-icon.png'
import { settingsToParams, useSettings } from "@/contexts/SettingsContext";
import { usePathname } from "next/navigation";

export function Panels() {
  const [selectedNode, setSelectedNode] = useNodeSelection();
  const [activePanel, setActivePanel] = useState<"settings" | null>(null);
  const deferredNode = useDeferredValue(selectedNode);
  const config = useConfig();
  const settings = useSettings();
  const params = settingsToParams(settings);
  const pathname = usePathname();
  const navItems = useMemo<NavItem[]>(() => [
    {label: "Model", action: () => setActivePanel((current) => current === "settings" ? null : "settings"), id: "settings", type: "secondary", icon: "gear"},
    {label: "Viewer", href: `/?${String(params)}`, id: "/", icon: "diagram-3"},
    {label: "About", href: `/about/?${String(params)}`, id: "/about/", icon: "info-circle"}
  ], [setActivePanel, params])
  return (
    <>
      <NavBar
        title={config.title}
        subtitle={config.subtitle}
        logo={{src: gorcLogo.src, width: gorcLogo.width, height: gorcLogo.height}}
        items={navItems}
        activeId={activePanel || pathname || undefined}
      />
      <OffCanvas title={(selectedNode || deferredNode)?.shortName || "Node information" } position="start" isOpen={!!selectedNode} onClose={() => setSelectedNode(null)}>
        <NodeInfoPanel node={selectedNode || deferredNode} setNode={setSelectedNode}/>
      </OffCanvas>
      <OffCanvas title="Model" position="end" isOpen={activePanel === "settings"} onClose={() => setActivePanel(null)}>
        <SettingsPanel />
      </OffCanvas>
    </>
  )
}