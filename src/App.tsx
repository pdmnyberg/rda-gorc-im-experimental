import { Tree } from "./components/Tree.tsx";
import { TreeContext, createTreeManagerFromModelNodes } from "./contexts/TreeContext.ts"
import { ModelDefinition, getModelNodes, applyLayers } from "./modules/LayeredModel.ts"
import { baseModel, onlyGoLProfile } from "../examples/example-models.ts"

import "@xyflow/react/dist/style.css";
import "./App.css";

const App = () => {
  const modelDefintion: ModelDefinition = applyLayers(baseModel, [onlyGoLProfile]);
  const nodes = getModelNodes(modelDefintion);
  const treeManager = createTreeManagerFromModelNodes(nodes);
  return (
    <TreeContext.Provider value={treeManager}>
      <Tree />
    </TreeContext.Provider>
  );
};

export default App;
