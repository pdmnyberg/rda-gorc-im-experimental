import { useConfig } from "@/contexts/ConfigContext";
import { ModelContext } from "@/contexts/ModelContext";
import { useRepositoryManager } from "@/contexts/RepositoryContext";
import { 
    ModelSelectionContext,
    NodeSelectionManager,
    ProfileSelectionContext,
    RepositorySelectionContext,
    SliceSelectionContext,
    useModelSelectionManagers,
    useNodeSelectionManager
} from "@/contexts/SelectionContexts";
import { getD3Layout, TreeContext, useTreeManagerFromModelNodes } from "@/contexts/TreeContext";
import { applyLayersAndSlices, getModelNodes, ModelDefinition } from "@/modules/LayeredModel";
import { HttpRepositorySource } from "@/modules/RepositorySource";
import { PropsWithChildren, useMemo } from "react";

type AppContextProps = {
    nodeSize?: number;
}

export function AppContext({children, nodeSize}: PropsWithChildren<AppContextProps>) {
  nodeSize = nodeSize === undefined ? 120 : nodeSize;
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