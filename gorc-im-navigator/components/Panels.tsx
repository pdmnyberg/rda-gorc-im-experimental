import { useConfig } from "@/contexts/ConfigContext";
import { useNodeSelection } from "@/contexts/SelectionContexts";
import { useDeferredValue, useMemo, useState } from "react";
import { NavBar } from "./NavBar";
import { OffCanvas } from "./OffCanvas";
import { NodeInfoPanel } from "./NodeInfoPanel";
import { SettingsPanel } from "./SettingsPanel";
import gorcLogo from '../img/gorc-im-icon.png'

export function Panels() {
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