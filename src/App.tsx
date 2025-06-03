import React from "react";
import { Tree } from "./components/Tree.tsx";
import { TreeContext, createTreeManagerFromModelNodes, getLayout } from "./contexts/TreeContext.ts"
import { ModelDefinition, getModelNodes, applyLayersAndSlices, Package } from "./modules/LayeredModel.ts"
import { models as mockModels, profiles as mockProfiles, slices as mockSlices } from "../examples/example-models.ts"
import { createRepositoryManager, useRepositoryModel } from "./contexts/RepositoryContext.ts"
import { StaticRepositorySource, RepositorySource } from "./modules/RepositorySource.ts"
import "@xyflow/react/dist/style.css";
import "./App.css";
import Layout from "./components/Layout/Layout";
import MultiSelect, {SelectItem} from "./components/MultiSelect/MultiSelect";


function usePackageSelect<T extends Package>(packages: T[] | Record<string, T>): [T[], SelectItem[], string[], (pkgs: string[]) => void] {
  const [packageIds, setPackageIds] = React.useState<string[]>([]);
  const selectedPackages = React.useMemo(() => Object.values(packages).filter(p => packageIds.includes(p.id)), [packages, packageIds]);
  return [
    selectedPackages,
    Object.values(packages).map(p => ({
      id: p.id,
      label: p.label,
      info: p.version
    })),
    packageIds,
    setPackageIds
  ]
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
    )
  ]);
  const [selectedRepository, setSelectedRepository] = React.useState<RepositorySource | null>(null);
  const [model, repoInfo, models, profiles, slices, setModel] = useRepositoryModel(selectedRepository);
  const [selectedProfiles, profileItems, profileIds, setProfileIds] = usePackageSelect(profiles);
  const [selectedSlices, sliceItems, sliceIds, setSliceIds] = usePackageSelect(slices);
  const modelDefintion: ModelDefinition = React.useMemo(
    () => model ? applyLayersAndSlices(model, selectedProfiles, selectedSlices) : { nodes: []},
    [model, selectedProfiles, selectedSlices]
  );
  const nodes = React.useMemo(() => getModelNodes(modelDefintion), [modelDefintion]);
  const nodeSize = 120;
  const layout = React.useMemo(() => getLayout(nodes, nodeSize), [nodes, nodeSize]);
  const treeManager = createTreeManagerFromModelNodes(nodes, layout);

  React.useEffect(() => {
    const repositories = repositoryManager.getRepositories();
    if (selectedRepository === null && repositories.length > 0) {
      setSelectedRepository(repositories[0]);
    }
  }, [repositoryManager, selectedRepository]);
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
