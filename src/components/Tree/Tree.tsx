import { useCallback, useState, useEffect, useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Node,
  useNodesState,
} from "@xyflow/react";
import { useTreeContext } from "../../contexts/TreeContext";
import { GORCNodeView } from "./../GORCNodeView/GORCNodeView";
import { SidePanel } from "./../SidePanel/SidePanel.tsx";

import "@xyflow/react/dist/style.css";
import { GORCNode } from "../../modules/GORCNodes";
import { GORCLegend } from "./../Legend/GORCLegend";
import "./Tree.css"

const nodeTypes = { gorc: GORCNodeView };

export const Tree = () => {
  const treeManager = useTreeContext();
  const [selectedNode, setSelectedNode] = useState<Node<GORCNode> | null>(null);
  const treeNodes = treeManager.getNodes();
  const initialNodes = useMemo(() => {
    return treeNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        isSelected: selectedNode?.id === node.id,
      },
    }));
  }, [treeNodes, selectedNode]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const edges = treeManager.getEdges();

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  const onNodeClick = useCallback((_event: unknown, node: Node<GORCNode>) => {
    setSelectedNode(node);
  }, []);

  const closePanel = () => setSelectedNode(null);

  return (
    <>
      <div className={`tree-stage ${selectedNode ? "left-panel-open" : ""}`}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          fitView
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          onNodesChange={onNodesChange}
          minZoom={0.1}
        >
          <MiniMap nodeStrokeWidth={3} />
          <Controls />
        </ReactFlow>
        <GORCLegend />
        <SidePanel node={selectedNode} onClose={closePanel} />
      </div>
    </>
  );
};
