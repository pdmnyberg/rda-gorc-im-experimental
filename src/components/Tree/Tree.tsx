import { useCallback, useEffect } from "react";
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
import { useNodeSelection } from "../../contexts/SelectionContexts.ts";

const nodeTypes = { gorc: GORCNodeView };

export const Tree = () => {
  const treeManager = useTreeContext();
  const treeNodes = treeManager.getNodes();
  const [nodes, setNodes, onNodesChange] = useNodesState(treeNodes);
  const edges = treeManager.getEdges();
  const [selectedNode, setSelectedNode] = useNodeSelection();

  useEffect(() => {
    setNodes(treeNodes);
  }, [treeNodes, setNodes]);

  const onNodeClick = useCallback((_event: unknown, node: Node<GORCNode>) => {
    setSelectedNode(node.data);
  }, [setSelectedNode]);

  const closePanel = useCallback(() => setSelectedNode(null), [setSelectedNode]);

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
        <SidePanel onClose={closePanel} />
      </div>
    </>
  );
};
