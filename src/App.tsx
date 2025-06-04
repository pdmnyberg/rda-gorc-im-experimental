import React from "react";
import { Tree } from "./components/Tree.tsx";
import { TreeContext, createTreeManagerFromModelNodes, getLayout } from "./contexts/TreeContext.ts"
import { ModelDefinition, getModelNodes, applyLayersAndSlices } from "./modules/LayeredModel.ts"
import { models as mockModels, profiles as mockProfiles, slices as mockSlices } from "../examples/example-models.ts"
import { createRepositoryManager } from "./contexts/RepositoryContext.ts"
import { StaticRepositorySource } from "./modules/RepositorySource.ts"
import {
  useRepositories,
  RepositorySelectionContext,
  ModelSelectionContext,
  ProfileSelectionContext,
  SliceSelectionContext,
} from "./contexts/SelectionContexts.ts"
import "@xyflow/react/dist/style.css";
import "./App.css";
import { SettingsPanel } from "./components/SettingsPanel.tsx";
import Layout from "./components/Layout/Layout";


const AppBase = () => {
  return (
    <Layout
      panels={{
        settings: {
          component: <SettingsPanel />,
          icon: <></>
        },
      }}
    >
      <div className="tree-container">
        <Tree />
      </div>
    </Layout>
  )
}

const App = () => {
  const repositoryManager = createRepositoryManager([
    new StaticRepositorySource(
      {
        id: "mock-repo",
        name: "Mock repo"
      },
      [mockModels.baseModel],
      Object.values(mockProfiles),
      Object.values(mockSlices)
    ),
    new StaticRepositorySource(
      {
        id: "oss-mock-repo",
        name: "OSS mock repo"
      },
      [mockModels.ossModel],
      [],
      []
    )
  ]);
  const [
    repoSelection,
    modelSelection,
    profileSelection,
    sliceSelection,
  ] = useRepositories(repositoryManager);
  const model = modelSelection[0];
  const profiles = profileSelection[0];
  const slices = sliceSelection[0];
  const modelDefintion: ModelDefinition = React.useMemo(
    () => {
      return model ? applyLayersAndSlices(model, profiles, slices) : { nodes: []}
    },
    [model, profiles, slices]
  );
  const nodes = React.useMemo(() => getModelNodes(modelDefintion), [modelDefintion]);
  const nodeSize = 120;
  const layout = React.useMemo(() => getLayout(nodes, nodeSize), [nodes, nodeSize]);
  const treeManager = createTreeManagerFromModelNodes(nodes, layout);
  return (
    <RepositorySelectionContext.Provider value={repoSelection}>
      <ModelSelectionContext.Provider value={modelSelection}>
        <ProfileSelectionContext.Provider value={profileSelection}>
          <SliceSelectionContext.Provider value={sliceSelection}>
            <TreeContext.Provider value={treeManager}>
              <AppBase />
            </TreeContext.Provider>
          </SliceSelectionContext.Provider>
        </ProfileSelectionContext.Provider>
      </ModelSelectionContext.Provider>
    </RepositorySelectionContext.Provider>
  );
};

export default App;
