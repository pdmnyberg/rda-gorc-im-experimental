import { useCallback } from "react";
import { ReactFlow, MiniMap, Controls, Node } from "@xyflow/react";
import { useTreeContext } from "../contexts/TreeContext";
import { GORCNodeView } from "./GORCNodeView/GORCNodeView";

import "@xyflow/react/dist/style.css";

const nodeTypes = { gorc: GORCNodeView };

export const Tree = () => {
  const treeManager = useTreeContext();
  const nodes = treeManager.getNodes();
  const edges = treeManager.getEdges();

  const onNodeClick = useCallback((_event: unknown, node: Node) => {
    console.log(node);
  }, []);

  return (
    <>
      <div style={{ width: "100%", height: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          fitView
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          minZoom={0.1}
        >
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
};
