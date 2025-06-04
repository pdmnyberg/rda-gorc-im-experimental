import React from "react";
import { Tree } from "./components/Tree.tsx";
import { TreeContext, createTreeManagerFromModelNodes, getLayout } from "./contexts/TreeContext.ts"
import { ModelDefinition, getModelNodes, applyLayersAndSlices, Package } from "./modules/LayeredModel.ts"
import { models as mockModels, profiles as mockProfiles, slices as mockSlices } from "../examples/example-models.ts"
import { createRepositoryManager } from "./contexts/RepositoryContext.ts"
import { StaticRepositorySource } from "./modules/RepositorySource.ts"
import { useRepositories } from "./contexts/SelectionContexts.ts"
import "@xyflow/react/dist/style.css";
import "./App.css";
import Layout from "./components/Layout/Layout";
import { MultiSelect, SingleSelect, SelectItem } from "./components/MultiSelect/MultiSelect";


function packageToSelectItem(p: Package): SelectItem {
  return {
    id: p.id,
    label: p.label,
    info: p.version
  }
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
    [repository, repositories, setRepository],
    [model, models, setModel],
    [selectedProfiles, profiles, setSelectedProfiles],
    [selectedSlices, slices, setSelectedSlices],
  ] = useRepositories(repositoryManager);
  const modelDefintion: ModelDefinition = React.useMemo(
    () => {
      return model ? applyLayersAndSlices(model, selectedProfiles, selectedSlices) : { nodes: []}
    },
    [model, selectedProfiles, selectedSlices]
  );
  const nodes = React.useMemo(() => getModelNodes(modelDefintion), [modelDefintion]);
  const nodeSize = 120;
  const layout = React.useMemo(() => getLayout(nodes, nodeSize), [nodes, nodeSize]);
  const treeManager = createTreeManagerFromModelNodes(nodes, layout);
  const setProfileIds = React.useCallback((profileIds: string[]) => {
    setSelectedProfiles(profiles.filter(p => profileIds.includes(p.id)))
  }, [profiles, setSelectedProfiles]);
  const setSliceIds = React.useCallback((sliceIds: string[]) => {
    setSelectedSlices(slices.filter(s => sliceIds.includes(s.id)))
  }, [slices, setSelectedSlices]);
  const setModelId = React.useCallback((modelId: string) => {
    const selectedModel = models.filter(m => m.id === modelId)[0];
    if (selectedModel) {
      setModel(selectedModel);
    }
  }, [models, setModel]);
  const setRepositoryId = React.useCallback((repoId: string) => {
    const nextRepo = repositories.filter(r => r.id === repoId)[0];
    if (nextRepo) {
      setRepository(nextRepo);
    }
  }, [repositories, setRepository]);

  const modelItems = models.map(packageToSelectItem);
  const repositoryItems = repositories.map(repo => ({
    id: repo.id,
    label: repo.info.name,
    info: repo.info.url || "Local source"
  }));
  const profileItems = profiles.map(packageToSelectItem);
  const sliceItems = slices.map(packageToSelectItem);
  const profileIds = selectedProfiles.map(p => p.id)
  const sliceIds = selectedSlices.map(s => s.id);

  React.useEffect(() => {
    if (repository === null && repositories.length > 0) {
      setRepository(repositories[0]);
    }
  }, [repositories, repository]);
  React.useEffect(() => {
    if (model === null && models.length > 0) {
      setModel(models[0]);
    }
  }, [model, models, setModel]);
  return (
    <>
      <TreeContext.Provider value={treeManager}>
        <Layout
          panels={{
            settings: {
              component: <>
                <h2>Select repository</h2>
                <SingleSelect items={repositoryItems} selection={repository ? repository.id : undefined} onChange={setRepositoryId}/>
                <h2>Select model</h2>
                <SingleSelect items={modelItems} selection={model ? model.id : undefined} onChange={setModelId}/>
                <h2>Select profiles</h2>
                <MultiSelect items={profileItems} selection={profileIds} onChange={setProfileIds}/>
                <h2>Select slices</h2>
                <MultiSelect items={sliceItems} selection={sliceIds} onChange={setSliceIds}/>
              </>,
              icon: <></>
            },
          }}
        >
          <div className="tree-container">
              <Tree />
          </div>
        </Layout>
      </TreeContext.Provider>
    </>
  );
};

export default App;
