import { useCallback, useState } from "react";
import { ReactFlow, MiniMap, Controls, Node } from "@xyflow/react";
import { useTreeContext } from "../contexts/TreeContext";
import { GORCNodeView } from "./GORCNodeView/GORCNodeView";
import { SidePanel } from "./SidePanel/SidePanel.tsx";

import "@xyflow/react/dist/style.css";
import { GORCNode } from "../modules/GORCNodes";

const nodeTypes = { gorc: GORCNodeView };

export const Tree = () => {
  const treeManager = useTreeContext();
  const nodes = treeManager.getNodes();
  const edges = treeManager.getEdges();
  const [selectedNode, setSelectedNode] = useState<Node<GORCNode> | null>(null);

  const onNodeClick = useCallback((_event: unknown, node: Node<GORCNode>) => {
    setSelectedNode(node);
  }, []);

  const closePanel = () => setSelectedNode(null);

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
        <SidePanel node={selectedNode} onClose={closePanel} />
      </div>
    </>
  );
};
