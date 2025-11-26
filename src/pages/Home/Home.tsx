import React from "react";
import "./Home.css";
import { Tree } from "../../components/Tree/Tree";
import Layout from "./../../components/Layout/Layout";
import { SettingsPanel } from "../../components/SettingsPanel";
import SettingIcon from "./../../img/app-icon_settings.svg";
import {
  TreeContext,
  useTreeManagerFromModelNodes,
  getD3Layout,
} from "../../contexts/TreeContext";
import {
  ModelDefinition,
  getModelNodes,
  applyLayersAndSlices,
} from "../../modules/LayeredModel";
import { useRepositoryManager } from "../../contexts/RepositoryContext";
import { HttpRepositorySource } from "../../modules/RepositorySource";
import {
  useModelSelectionManagers,
  RepositorySelectionContext,
  ModelSelectionContext,
  ProfileSelectionContext,
  SliceSelectionContext,
  useNodeSelectionManager,
  NodeSelectionManager,
} from "../../contexts/SelectionContexts";
import { useConfig } from "../../contexts/ConfigContext.ts";
import "@xyflow/react/dist/style.css";
import "./Home.css";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage.tsx";
import { ModelContext } from "../../contexts/ModelContext.ts";

const HomeBase = () => {
  const [selectedRepo] = React.useContext(RepositorySelectionContext);
  return (
    <Layout
      panels={{
        settings: {
          component: <SettingsPanel />,
          icon: <img src={SettingIcon} alt={"Gear icon"}/>,
          label: "Settings",
        },
      }}
    >
      {selectedRepo?.status.status === "ok" || !selectedRepo ? (
        <div className="tree-container">
          <Tree />
        </div>
      ) : (
        <ErrorMessage
          message={selectedRepo?.status.message || "No repository selected"}
        />
      )}
    </Layout>
  );
};

const Home = () => {
  const { repositories } = useConfig();
  const repositoryManager = useRepositoryManager(
    repositories.map((r) => new HttpRepositorySource(r))
  );
  const [repoSelection, modelSelection, profileSelection, sliceSelection] =
    useModelSelectionManagers(repositoryManager);
  const model = modelSelection[0];
  const profiles = profileSelection[0];
  const slices = sliceSelection[0];
  const modelDefintion: ModelDefinition = React.useMemo(() => {
    return model
      ? applyLayersAndSlices(model, profiles, slices)
      : { nodes: [] };
  }, [model, profiles, slices]);
  const nodes = React.useMemo(
    () => getModelNodes(modelDefintion),
    [modelDefintion]
  );
  const nodeSize = 120;

  const layout = React.useMemo(
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
                  <HomeBase />
                </NodeSelectionManager.Provider>
              </ModelContext.Provider>
            </TreeContext.Provider>
          </SliceSelectionContext.Provider>
        </ProfileSelectionContext.Provider>
      </ModelSelectionContext.Provider>
    </RepositorySelectionContext.Provider>
  );
};

export default Home;
