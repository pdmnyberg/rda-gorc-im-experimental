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
import gorcBgLogo from '../img/gorc-im-icon-black.svg'

import "@xyflow/react/dist/style.css";
import { GORCNode } from "../modules/GORCNodes";
import { useNodeSelection } from "../contexts/SelectionContexts";
import Image from "next/image";

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
    <>
      {nodes.length > 0 ? (
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
      ) : (
        <div className="align-middle h-100 w-100 d-flex justify-content-center align-items-center opacity-25 overflow-hidden flex-column">
          <Image
            src={gorcBgLogo.src}
            alt={""}
            width={gorcBgLogo.width * 3}
            height={gorcBgLogo.height * 3}
          />
          <div className="m-2">No model selected.</div>
        </div>
      )}
    </>
  );
};
