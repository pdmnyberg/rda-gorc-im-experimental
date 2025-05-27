import { NavLink } from "react-router";
import { Tree } from "./components/Tree.tsx";
import { TreeContext, createTreeManagerFromModelNodes, getLayout } from "./contexts/TreeContext.ts"
import { ModelDefinition, getModelNodes, applyLayers } from "./modules/LayeredModel.ts"
import { baseModel } from "../examples/example-models.ts"

import "@xyflow/react/dist/style.css";
import "./App.css";

const App = () => {
  const modelDefintion: ModelDefinition = applyLayers(baseModel, []);
  const nodes = getModelNodes(modelDefintion);
  const layout = getLayout(nodes, 100);
  const treeManager = createTreeManagerFromModelNodes(nodes, layout);
  return (
    <>
      <NavLink to="documentation">See Documentation</NavLink>
      <TreeContext.Provider value={treeManager}>
        <Tree />
      </TreeContext.Provider>
    </>
  );
};

export default App;
