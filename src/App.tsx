import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import "./App.css";

const initialBaseNodes = [
  {
    id: "one",
    position: { x: 30, y: 50 },
    data: { label: "Node 1" },
  },
  {
    id: "two",
    position: { x: 100, y: 100 },
    data: { label: "Node 2" },
  },
];

const initialChildNodes = [
  {
    id: "three",
    position: { x: 500, y: 100 },
    data: { label: "This is a very long label for node 3" },
  },
  {
    id: "four",
    position: { x: 600, y: 200 },
    data: { label: "Node 4" },
  },
  {
    id: "five",
    position: { x: 700, y: 300 },
    data: { label: "Node 5" },
  },
];

const initialBaseEdges = [
  {
    id: "one-two",
    source: "one",
    target: "two",
    style: { strokeWidth: 1 },
  },
];

const initialChildEdges = [
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

function App() {
  const [showChildren, setShowChildren] = useState(true);
  // React Flow state hooks (need stable setNodes/setEdges calls, so not recreated every rerender)
  const [nodes, setNodes, onNodesChange] = useNodesState([
    ...initialBaseNodes,
    ...initialChildNodes,
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    ...initialBaseEdges,
    ...initialChildEdges,
  ]);

  function getElements(showChildren) {
    const nodes = [
      ...initialBaseNodes,
      ...(showChildren ? initialChildNodes : []),
    ];
    const edges = [
      ...initialBaseEdges,
      ...(showChildren ? initialChildEdges : []),
    ];
    return { nodes, edges };
  }

  // When showChildren toggles, reset the node/edge state
  React.useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = getElements(showChildren);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [showChildren, setNodes, setEdges]);

  // Click node "two" (Node 2) to toggle
  const onNodeClick = useCallback((event, node) => {
    if (node.id === "two") {
      setShowChildren((prev) => !prev);
    }
  }, []);

  return (
    <>
      <p>RDA visualisation app</p>
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
}

export default App;
