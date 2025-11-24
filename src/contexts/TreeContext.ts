import React from "react";
import { Node, Edge, XYPosition, MarkerType } from "@xyflow/react";
import { GORCNode, NodeId } from "../modules/GORCNodes";
import * as d3 from "d3";

export interface TreeManager<T extends Record<string, unknown> = GORCNode> {
  getNodes(): Node<T>[];
  getEdges(): Edge[];
}

export const TreeContext = React.createContext<TreeManager>({
  getNodes: () => [],
  getEdges: () => [],
});

export function useTreeContext() {
  const context = React.useContext(TreeContext);
  return context;
}

function getBaseLayout(nodes: HierarchyNode[], nodeSize: number): TreeLayout {
  const nodeMap = nodes.reduce<{ [x: string]: HierarchyNode }>((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {});

  const nodeDepthMap = nodes.reduce<{ [x: string]: number }>((acc, node) => {
    let depth = -1;
    let currentNode: HierarchyNode | null = node;
    while (currentNode) {
      depth += 1;
      currentNode =
        "childOf" in currentNode ? nodeMap[currentNode.childOf] : null;
    }
    acc[node.id] = depth;
    return acc;
  }, {});

  const nodeSizeMap = nodes.reduce<{ [x: string]: number }>((acc, node) => {
    let currentNode: HierarchyNode | null = node;
    let depth = 0;
    while (currentNode) {
      depth += 1;
      acc[currentNode.id] = Math.max(acc[currentNode.id] || 0, depth);
      currentNode =
        "childOf" in currentNode ? nodeMap[currentNode.childOf] : null;
    }
    return acc;
  }, {});

  const getNodeSize = (n: HierarchyNode): number => {
    return nodeSizeMap[n.id] * nodeSize;
  };
  const levels = Array.from(new Set(Object.values(nodeDepthMap))).sort();
  const nodeRadialPosition: { [x: string]: number } = {};
  const positions = levels.reduce<{ [x: string]: XYPosition }>((acc, level) => {
    const levelNodes = nodes.filter((node) => nodeDepthMap[node.id] === level);
    const groups = Array.from(
      new Set(levelNodes.map((n) => ("childOf" in n ? n.childOf : null)))
    );
    for (const group of groups) {
      const groupNodes = levelNodes.filter((n) =>
        "childOf" in n ? n.childOf === group : true
      );
      const levelSize = groupNodes.map(getNodeSize).reduce((a, b) => a + b);
      const levelRadius = levelSize / (2 * Math.PI);
      const useRadians = level < 2 ? 2 * Math.PI : 2 * Math.PI;
      const parentRadialPosition =
        (group ? nodeRadialPosition[group] : 0) - useRadians * 0.5;
      let lastPosition = 0;
      for (const node of groupNodes) {
        const parentPosition: XYPosition =
          "childOf" in node ? acc[node.childOf] : { x: 0, y: 0 };
        const currentNodeSize = getNodeSize(node);
        const radialPosition =
          parentRadialPosition +
          (useRadians * (lastPosition + 0.5 * currentNodeSize)) / levelSize;
        const nodeRadius = levelRadius + currentNodeSize * 0.5;
        nodeRadialPosition[node.id] = radialPosition;
        acc[node.id] = {
          x: parentPosition.x + nodeRadius * Math.sin(radialPosition),
          y: parentPosition.y + nodeRadius * Math.cos(radialPosition),
        };
        lastPosition += currentNodeSize;
      }
    }
    return acc;
  }, {});
  return positions;
}

type HierarchyNode = { id: string } | { id: string; childOf: string };

export type TreeLayout = { [x: string]: XYPosition };

export function getD3Layout(
  nodes: GORCNode[],
  nodeSize: number = 120
): TreeLayout {
  const useNodes = nodes
    .filter((n): n is GORCNode => n.type !== "kpi")
    .map<HierarchyNode>((n) =>
      "childOf" in n
        ? {
            id: n.id,
            childOf: n.childOf,
          }
        : { id: n.id, childOf: "__root" }
    );
  useNodes.push({
    id: "__root",
  });

  const edges = useNodes
    .filter((n): n is HierarchyNode & { childOf: NodeId } => "childOf" in n)
    .map(({ id, childOf }) => ({ source: childOf, target: id }));

  const positions = getBaseLayout(useNodes, nodeSize);
  const d3Nodes = useNodes.map((n) => ({
    ...n,
    x: positions[n.id]?.x || 0,
    y: positions[n.id]?.y || 0,
  }));

  const spreadFactor = 1.2;
  const collideStrength = 0.5; // needs to be between 0 and 1 according to d3's documentation
  const numberOfIterations = 500;

  const simulation = d3
    .forceSimulation(d3Nodes)
    .force(
      "link",
      d3
        .forceLink(edges)
        .id((d: unknown) => (d as {id: string | number}).id)
        .distance(nodeSize * spreadFactor)
    )
    .force("center", d3.forceCenter())
    .force(
      "collide",
      d3
        .forceCollide()
        .strength(collideStrength)
        .radius(nodeSize * spreadFactor)
    );

  simulation.tick(numberOfIterations);
  simulation.stop();
  const layout: TreeLayout = d3Nodes.reduce((acc, node) => {
    acc[node.id] = { x: node.x, y: node.y };
    return acc;
  }, {} as TreeLayout);

  return layout;
}

export function useTreeManagerFromModelNodes(
  nodes: GORCNode[],
  layout: TreeLayout = {}
): TreeManager<GORCNode> {
  const useNodes = React.useMemo(
    () => nodes.filter((n): n is GORCNode => n.type !== "kpi"),
    [nodes]
  );
  const treeNodes = React.useMemo(
    () => useNodes.map<Node<GORCNode>>((n) => nodeFromGORCNode(n, layout)),
    [useNodes, layout]
  );
  const treeEdges = React.useMemo(
    () =>
      useNodes
        .filter((n): n is GORCNode & { childOf: NodeId } => "childOf" in n)
        .map<Edge>(edgeFromGORCNode),
    [useNodes]
  );

  return React.useMemo<TreeManager<GORCNode>>(
    () => ({
      getNodes: () => treeNodes,
      getEdges: () => treeEdges,
    }),
    [treeNodes, treeEdges]
  );
}

function nodeFromGORCNode(node: GORCNode, layout: TreeLayout): Node<GORCNode> {
  const position = layout[node.id] || {
    x: Math.random() * 300,
    y: Math.random() * 300,
  };
  return {
    id: node.id,
    type: "gorc",
    position: position,
    data: node,
  };
}

function edgeFromGORCNode(node: GORCNode & { childOf: NodeId }): Edge {
  return {
    id: `${node.childOf}<->${node.id}`,
    source: node.childOf,
    target: node.id,
    type: "straight",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 30,
      height: 30,
    },
  };
}
