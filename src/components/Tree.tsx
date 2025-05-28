import { useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Node,
} from "@xyflow/react";
import { useTreeContext } from "../contexts/TreeContext";

import "@xyflow/react/dist/style.css";

export const Tree = () => {
  const treeManager = useTreeContext();
  const nodes = treeManager.getNodes();
  const edges = treeManager.getEdges();

  const onNodeClick = useCallback((_event: unknown, node: Node) => {
    console.log(node)
  }, []);

  return (
    <>
      <div style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          fitView
          nodesDraggable={false}
        >
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
};
