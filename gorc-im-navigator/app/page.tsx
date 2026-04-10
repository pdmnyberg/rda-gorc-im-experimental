"use client"
import { NodeInfoPanel } from "@/components/NodeInfoPanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Tree } from "@/components/Tree";
import { AppConfig, ConfigContext, parseAppConfig, useConfig } from "@/contexts/ConfigContext";
import { ModelContext } from "@/contexts/ModelContext";
import { useRepositoryManager } from "@/contexts/RepositoryContext";
import { ModelSelectionContext, NodeSelectionManager, ProfileSelectionContext, RepositorySelectionContext, SliceSelectionContext, useModelSelectionManagers, useNodeSelection, useNodeSelectionManager } from "@/contexts/SelectionContexts";
import { SettingsContext, useLocalStorageSettings } from "@/contexts/SettingsContext";
import { getD3Layout, TreeContext, useTreeManagerFromModelNodes } from "@/contexts/TreeContext";
import { applyLayersAndSlices, getModelNodes, ModelDefinition } from "@/modules/LayeredModel";
import { HttpRepositorySource } from "@/modules/RepositorySource";
import { PropsWithChildren, Suspense, useDeferredValue, useEffect, useEffectEvent, useId, useMemo, useRef, useState } from "react";

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

function AppContext({children}: PropsWithChildren) {
  const config = useConfig()
  const repositories = useMemo(() => (
    config.repositories.map((r) => new HttpRepositorySource(r))
  ), [config])
  const repositoryManager = useRepositoryManager(repositories);
  const [repoSelection, modelSelection, profileSelection, sliceSelection] =
    useModelSelectionManagers(repositoryManager);

  const model = modelSelection[0];
  const profiles = profileSelection[0];
  const slices = sliceSelection[0];
  const modelDefintion: ModelDefinition = useMemo(() => {
    return model
      ? applyLayersAndSlices(model, profiles, slices)
      : { nodes: [] };
  }, [model, profiles, slices]);
  const nodes = useMemo(
    () => getModelNodes(modelDefintion),
    [modelDefintion]
  );
  const nodeSize = 120;

  const layout = useMemo(
    () => getD3Layout(nodes, nodeSize),
    [nodes, nodeSize]
  );
  
  const treeManager = useTreeManagerFromModelNodes(nodes, layout);
  const nodeSelectionManager = useNodeSelectionManager();

  return (
    <RepositorySelectionContext.Provider value={repoSelection}>
      <ModelSelectionContext.Provider value={modelSelection}>
        <ProfileSelectionContext.Provider value={profileSelection}>
          <SliceSelectionContext.Provider value={sliceSelection}>
            <TreeContext.Provider value={treeManager}>
              <ModelContext.Provider value={modelDefintion}>
                <NodeSelectionManager.Provider value={nodeSelectionManager}>
                  {children}
                </NodeSelectionManager.Provider>
              </ModelContext.Provider>
            </TreeContext.Provider>
          </SliceSelectionContext.Provider>
        </ProfileSelectionContext.Provider>
      </ModelSelectionContext.Provider>
    </RepositorySelectionContext.Provider>
  )
}

function Panels() {
  const [selectedNode, setSelectedNode] = useNodeSelection();
  const [activePanel, setActivePanel] = useState<"settings" | null>(null);
  const deferredNode = useDeferredValue(selectedNode);
  return (
    <>
      <button className="btn btn-primary" onClick={() => setActivePanel(activePanel === "settings" ? null : "settings")} type="button">Settings</button>
      <OffCanvas title={(selectedNode || deferredNode)?.shortName || "Node information" } position="start" isOpen={!!selectedNode} onClose={() => setSelectedNode(null)}>
        <NodeInfoPanel node={selectedNode || deferredNode} setNode={setSelectedNode}/>
      </OffCanvas>
      <OffCanvas title="Settings" position="end" isOpen={activePanel === "settings"} onClose={() => setActivePanel(null)}>
        <SettingsPanel />
      </OffCanvas>
    </>
  )
}

function LocalStorageSettings({id, children}: PropsWithChildren<{id: string}>) {
  const settings = useLocalStorageSettings(id);

  return (
    <Suspense>
      <SettingsContext.Provider value={settings}>
        {children}
      </SettingsContext.Provider>
    </Suspense>
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
          <div className="tree-container">

          <Panels />
            <Tree />
          </div>
        </AppContext>
      </ConfigContext.Provider>
    </LocalStorageSettings>
  ) : <></>;
}

type OffCanvasProps = {
  position: "start" | "end" | "top" | "bottom";
  isOpen: boolean;
  title: string;
  onClose?: () => void;
}




function OffCanvas({position, isOpen, onClose, title, children}: PropsWithChildren<OffCanvasProps>) {
  const [deferredIsOpen, setDeferredIsOpen] = useState<boolean>(isOpen);
  const labelId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const stateClass = deferredIsOpen ? (
    isOpen ? "show" : "show hiding"
  ) : (
    isOpen ? "showing" : "hide"
  )
  const finalizeState = useEffectEvent((nextIsOpen: boolean) => {
    setDeferredIsOpen(nextIsOpen)
  })
  useEffect(() => {
    const current = ref.current;
    if (current) {
      const listener = () => finalizeState(isOpen);
      current.addEventListener("transitionend", listener);
      return () => {
        current.removeEventListener("transitionend", listener);
      }
    }
  }, [isOpen, ref])
  return (
    <div ref={ref} className={`offcanvas offcanvas-${position} ${stateClass}`} data-bs-scroll="true" data-bs-backdrop="false" tabIndex={-1} aria-labelledby={labelId}>
      <div className="offcanvas-header align-items-start">
        <h5 className="offcanvas-title" id={labelId}>{title}</h5>
        <button type="button" className="btn-close flex-shrink-0" onClick={onClose} aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        {children}
      </div>
    </div>
  )
}