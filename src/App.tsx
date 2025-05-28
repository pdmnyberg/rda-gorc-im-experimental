import { NavLink } from "react-router";
import React from "react";
import { Tree } from "./components/Tree.tsx";
import { TreeContext, createTreeManagerFromModelNodes, getLayout, tightenLayout } from "./contexts/TreeContext.ts"
import { ModelDefinition, getModelNodes, applyLayers } from "./modules/LayeredModel.ts"
import { baseModel } from "../examples/example-models.ts"
import "@xyflow/react/dist/style.css";
import "./App.css";
import Layout from "./components/Layout/Layout";

const App = () => {
  const modelDefintion: ModelDefinition = applyLayers(baseModel, []);
  const nodes = getModelNodes(modelDefintion);
  const nodeSize = 120;
  const layout = React.useMemo(() => {
    const baseLayout = getLayout(nodes, nodeSize);
    return tightenLayout(baseLayout, nodes, nodeSize, 5000);
  }, [nodes, nodeSize]);
  const treeManager = createTreeManagerFromModelNodes(nodes, layout);
  return (  
    <>
      <TreeContext.Provider value={treeManager}>
        <Layout>
          <div className="tree-container">
              <Tree />
          </div>
        </Layout>
      </TreeContext.Provider>
    </>
  );
};

export default App;
