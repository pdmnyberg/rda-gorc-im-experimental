import { NavLink } from "react-router";
import React from "react";
import { Tree } from "./components/Tree.tsx";
import { TreeContext, createTreeManagerFromModelNodes, getLayout, tightenLayout } from "./contexts/TreeContext.ts"
import { ModelDefinition, getModelNodes, applyLayers } from "./modules/LayeredModel.ts"
import { baseModel, profiles } from "../examples/example-models.ts"
import "@xyflow/react/dist/style.css";
import "./App.css";
import Layout from "./components/Layout/Layout";
import MultiSelect, {SelectItem} from "./components/MultiSelect/MultiSelect";

const App = () => {
  const [profileIds, setProfileIds] = React.useState<string[]>([]);
  const selectedProfiles = React.useMemo(() => Object.values(profiles).filter(p => profileIds.includes(p.id)), [profiles, profileIds]);
  const modelDefintion: ModelDefinition = React.useMemo(() => applyLayers(baseModel, selectedProfiles), [baseModel, selectedProfiles]);
  const nodes = React.useMemo(() => getModelNodes(modelDefintion), [modelDefintion]);
  const nodeSize = 120;
  const layout = React.useMemo(() => {
    const baseLayout = getLayout(nodes, nodeSize);
    return tightenLayout(baseLayout, nodes, nodeSize, 1000);
  }, [nodes, nodeSize]);
  const treeManager = createTreeManagerFromModelNodes(nodes, layout);
  const profileItems: SelectItem[] = Object.values(profiles).map(p => ({
    id: p.id,
      label: p.label,
      info: p.version
  }));
  return (
    <>
      <TreeContext.Provider value={treeManager}>
        <Layout
          settings={
            <>
              <h2>Select profiles</h2>
              <MultiSelect items={profileItems} selection={profileIds} onChange={setProfileIds}/>
            </>
          }
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
