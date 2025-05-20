import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
} from "@xyflow/react";

import { Node, Edge } from "../types.ts";
import "@xyflow/react/dist/style.css";

const initialBaseNodes: Node[] = [
  {
    id: "one",
    position: { x: 30, y: 30 },
    data: { label: "Governance & Leadership" },
  },
  {
    id: "two",
    position: { x: 100, y: 100 },
    data: { label: "Commons intent and definition" },
  },
];

const initialChildNodes: Node[] = [
  {
    id: "three",
    position: { x: 500, y: 100 },
    data: { label: "Development of values and/or guidance principles" },
  },
  {
    id: "four",
    position: { x: 600, y: 200 },
    data: {
      label:
        "Identification and definition of the commons community and stakeholders, " +
        "how their needs intersect with the commons, and how the commons engages " +
        "with the community to fulfill their needs",
    },
  },
  {
    id: "five",
    position: { x: 400, y: 300 },
    data: {
      label:
        "Statement of current commons nature, mandate and value proposition. " +
        "Reference to any prior mandates and how the commons has changed over time.",
    },
  },
];

const initialBaseEdges: Edge[] = [
  {
    id: "one-two",
    source: "one",
    target: "two",
    style: { strokeWidth: 1 },
  },
];

const initialChildEdges: Edge[] = [
  {
    id: "two-three",
    source: "two",
    target: "three",
  },
  {
    id: "two-four",
    source: "two",
    target: "four",
  },
  {
    id: "two-five",
    source: "two",
    target: "five",
  },
];

export const Tree = () => {
  const [showChildren, setShowChildren] = useState<boolean>(true);
  // React Flow state hooks (need stable setNodes/setEdges calls, so not recreated every rerender)
  const [nodes, setNodes, onNodesChange] = useNodesState([
    ...initialBaseNodes,
    ...initialChildNodes,
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    ...initialBaseEdges,
    ...initialChildEdges,
  ]);

  const getElements = (showChildren: boolean) => {
    const nodes = [
      ...initialBaseNodes,
      ...(showChildren ? initialChildNodes : []),
    ];
    const edges = [
      ...initialBaseEdges,
      ...(showChildren ? initialChildEdges : []),
    ];
    return { nodes, edges };
  };

  // When showChildren toggles, reset the node/edge state
  React.useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = getElements(showChildren);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [showChildren, setNodes, setEdges]);

  const onNodeClick = useCallback((event, node: Node) => {
    if (node.id === "two") {
      setShowChildren((prev) => !prev);
    }
  }, []);

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
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
