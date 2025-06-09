import React from "react";
import { Tree } from "./components/Tree.tsx";
import { TreeContext, createTreeManagerFromModelNodes, getLayout } from "./contexts/TreeContext.ts"
import { ModelDefinition, getModelNodes, applyLayersAndSlices } from "./modules/LayeredModel.ts"
import { models as mockModels, profiles as mockProfiles, slices as mockSlices } from "../examples/example-models.ts"
import { createRepositoryManager } from "./contexts/RepositoryContext.ts"
import { StaticRepositorySource, HttpRepositorySource } from "./modules/RepositorySource.ts"
import {
  useModelSelectionManagers,
  RepositorySelectionContext,
  ModelSelectionContext,
  ProfileSelectionContext,
  SliceSelectionContext,
} from "./contexts/SelectionContexts.ts"
import "@xyflow/react/dist/style.css";
import "./App.css";
import { SettingsPanel } from "./components/SettingsPanel.tsx";
import Layout from "./components/Layout/Layout";
import SettingIcon from "./img/app-icon_settings.svg";


const AppBase = () => {
  return (
    <Layout
      panels={{
        settings: {
          component: <SettingsPanel />,
          icon: <img src={SettingIcon} />,
          label: "Settings"
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
      Object.values(mockModels),
      Object.values(mockProfiles),
      Object.values(mockSlices)
    ),
    new HttpRepositorySource({url: "http-repo/root.json", id: "http-repo", name: "HTTP Based Repo"})
  ]);
  const [
    repoSelection,
    modelSelection,
    profileSelection,
    sliceSelection,
  ] = useModelSelectionManagers(repositoryManager);
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
