import { NavLink } from "react-router";
import React from "react";
import { Tree } from "./components/Tree.tsx";
import { TreeContext, createTreeManagerFromModelNodes, getLayout } from "./contexts/TreeContext.ts"
import { ModelDefinition, getModelNodes, applyLayersAndSlices, Package } from "./modules/LayeredModel.ts"
import { baseModel, profiles, slices } from "../examples/example-models.ts"
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
  const [selectedProfiles, profileItems, profileIds, setProfileIds] = usePackageSelect(profiles);
  const [selectedSlices, sliceItems, sliceIds, setSliceIds] = usePackageSelect(slices);
  const modelDefintion: ModelDefinition = React.useMemo(
    () => applyLayersAndSlices(baseModel, selectedProfiles, selectedSlices),
    [baseModel, selectedProfiles, selectedSlices]
  );
  const nodes = React.useMemo(() => getModelNodes(modelDefintion), [modelDefintion]);
  const nodeSize = 120;
  const layout = React.useMemo(() => getLayout(nodes, nodeSize), [nodes, nodeSize]);
  const treeManager = createTreeManagerFromModelNodes(nodes, layout);
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
          header={
            <>
              <NavLink to="documentation">See Documentation</NavLink>
              <h1>RDA Visualisation App</h1>
            </>
          }
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
