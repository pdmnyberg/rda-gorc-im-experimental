import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Node,
  useNodesState,
} from "@xyflow/react";
import { useTreeContext } from "../contexts/TreeContext";
import { GORCNodeView } from "./GORCNodeView/GORCNodeView";

import "@xyflow/react/dist/style.css";
import { GORCNode } from "../modules/GORCNodes";
import { useNodeSelection } from "../contexts/SelectionContexts";

const nodeTypes = { gorc: GORCNodeView };

export const Tree = () => {
  const treeManager = useTreeContext();
  const treeNodes = treeManager.getNodes();
  const [nodes, setNodes, onNodesChange] = useNodesState(treeNodes);
  const edges = treeManager.getEdges();
  const setSelectedNode = useNodeSelection()[1];

  useEffect(() => {
    setNodes(treeNodes);
  }, [treeNodes, setNodes]);

  const onNodeClick = useCallback((_event: unknown, node: Node<GORCNode>) => {
    setSelectedNode(node.data);
  }, [setSelectedNode]);

  return (
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
  );
};
