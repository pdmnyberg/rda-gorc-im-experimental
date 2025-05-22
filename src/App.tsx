import { Tree } from "./components/Tree.tsx";
import { TreeContext, createTreeManagerFromModelNodes } from "./contexts/TreeContext.ts"
import { ModelDefinition, getModelNodes } from "./modules/LayeredModel.ts"

import "@xyflow/react/dist/style.css";
import "./App.css";

const App = () => {
  const modelDefintion: ModelDefinition = {
    nodes: {
      "root-item" : {
        type: "essential-element",
        name: {
            shortName: "Root",
            longName: "Root Item"
        },
        description: "This is a Root item.",
        considerationLevel: "core",
      },
      "child-item-a" : {
        type: "category",
        parentId: "root-item",
        name: {
            shortName: "Child A",
            longName: "Child Item A"
        },
        description: "This is child item A",
        considerationLevel: "core",
      }
    }
  }
  const nodes = getModelNodes(modelDefintion);
  const treeManager = createTreeManagerFromModelNodes(nodes);
  return (
    <TreeContext.Provider value={treeManager}>
      <Tree />
    </TreeContext.Provider>
  );
};

export default App;
