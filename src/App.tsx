import { Tree } from "./components/Tree.tsx";
import { TreeContext, createTreeManagerFromModelNodes } from "./contexts/TreeContext.ts"
import { ModelDefinition, getModelNodes } from "./modules/LayeredModel.ts"
import { baseModel } from "../examples/example-models.ts"

import "@xyflow/react/dist/style.css";
import "./App.css";

const App = () => {
  const modelDefintion: ModelDefinition = baseModel;
  const nodes = getModelNodes(modelDefintion);
  const treeManager = createTreeManagerFromModelNodes(nodes);
  return (
    <TreeContext.Provider value={treeManager}>
      <Tree />
    </TreeContext.Provider>
  );
};

export default App;
