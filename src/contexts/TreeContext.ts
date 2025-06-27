import React from "react";
import { Node, Edge, XYPosition, MarkerType } from "@xyflow/react";
import { GORCNode, QuestionNode, NodeId } from "../modules/GORCNodes";

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

export function getLayout(nodes: HierarchyNode[], nodeSize: number) {
  const baseLayout = getBaseLayout(nodes, nodeSize);
  return tightenLayout(baseLayout, nodes, nodeSize, 1000);
}

function getBaseLayout(nodes: HierarchyNode[], nodeSize: number): Layout {
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
        "parentId" in currentNode ? nodeMap[currentNode.parentId] : null;
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
        "parentId" in currentNode ? nodeMap[currentNode.parentId] : null;
    }
    return acc;
  }, {});

  const getNodeSize = (n: HierarchyNode): number => {
    return Math.pow(2, nodeSizeMap[n.id]) * nodeSize;
  };
  const levels = Array.from(new Set(Object.values(nodeDepthMap))).sort();
  const nodeRadialPosition: { [x: string]: number } = {};
  const positions = levels.reduce<{ [x: string]: XYPosition }>((acc, level) => {
    const levelNodes = nodes.filter((node) => nodeDepthMap[node.id] === level);
    const groups = Array.from(
      new Set(levelNodes.map((n) => ("parentId" in n ? n.parentId : null)))
    );
    for (const group of groups) {
      const groupNodes = levelNodes.filter((n) =>
        "parentId" in n ? n.parentId === group : true
      );
      const levelSize = groupNodes.map(getNodeSize).reduce((a, b) => a + b);
      const levelRadius = levelSize / (2 * Math.PI);
      const useRadians = level < 2 ? 2 * Math.PI : 2 * Math.PI;
      const parentRadialPosition =
        (group ? nodeRadialPosition[group] : 0) - useRadians * 0.5;
      let lastPosition = 0;
      for (const node of groupNodes) {
        const parentPosition: XYPosition =
          "parentId" in node ? acc[node.parentId] : { x: 0, y: 0 };
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

function tightenLayout(
  layout: Layout,
  nodes: HierarchyNode[],
  nodeSize: number,
  iterations: number
) {
  const separation = nodeSize * 2;
  const nodeMap = nodes.reduce<Record<string, HierarchyNode>>((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {});
  let velocityMap: Layout = {};
  let updatedLayout = layout;
  const timeStep = 0.1;
  for (let i = 0; i < iterations; i++) {
    const forceMap: Layout = sumForces(
      getSeparationForces(updatedLayout, separation, 1),
      getSpringForces(nodeMap, updatedLayout, separation, 2)
    );
    velocityMap = applyForces(velocityMap, forceMap, timeStep, 0.5);
    updatedLayout = applyForces(updatedLayout, velocityMap, timeStep);
  }
  return updatedLayout;
}

function getSpringForces(
  nodeMap: Record<string, HierarchyNode>,
  layout: Layout,
  separation: number,
  scale: number = 1
): Layout {
  return Object.keys(nodeMap).reduce<Layout>((acc, nodeId) => {
    const node = nodeMap[nodeId];
    const parentId = "parentId" in node ? node.parentId : null;
    const a: XYPosition = layout[nodeId];
    const b: XYPosition = parentId ? layout[parentId] : { x: 0, y: 0 };
    const [distance, direction] = getNormalizedDirection(a, b);
    const forceSize = (distance - separation) * scale;
    acc[nodeId] = sumXY(acc[nodeId] || { x: 0, y: 0 }, {
      x: -direction.x * forceSize,
      y: -direction.y * forceSize,
    });
    if (parentId) {
      acc[parentId] = sumXY(acc[parentId] || { x: 0, y: 0 }, {
        x: direction.x * forceSize,
        y: direction.y * forceSize,
      });
    }
    return acc;
  }, {});
}

function getSeparationForces(
  layout: Layout,
  separation: number,
  scale: number
): Layout {
  const f = Object.keys(layout).reduce<Layout>((acc, nodeIdA) => {
    const a = layout[nodeIdA];
    for (const nodeIdB in layout) {
      if (nodeIdA !== nodeIdB) {
        const b = layout[nodeIdB];
        const [distance, direction] = getNormalizedDirection(a, b);
        const forceSize = (separation - Math.min(distance, separation)) * scale;
        const force =
          forceSize > 0
            ? { x: -direction.x * forceSize, y: -direction.y * forceSize }
            : { x: 0, y: 0 };
        acc[nodeIdA] = sumXY(acc[nodeIdA] || { x: 0, y: 0 }, {
          x: -force.x,
          y: -force.y,
        });
        acc[nodeIdB] = sumXY(acc[nodeIdB] || { x: 0, y: 0 }, {
          x: force.x,
          y: force.y,
        });
      }
    }
    return acc;
  }, {});
  return f;
}

function sumForces(fA: Layout, fB: Layout): Layout {
  return Object.keys(fA).reduce<Layout>((acc, nodeId) => {
    acc[nodeId] = sumXY(fA[nodeId], fB[nodeId]);
    return acc;
  }, {});
}

function applyForces(
  velocityMap: Layout,
  forceMap: Layout,
  time: number,
  dampening: number = 0
): Layout {
  const velocityReduction = 1 - Math.max(Math.min(dampening * time, 1), 0);
  const initialVelocities = Object.keys(velocityMap).reduce<Layout>(
    (acc, nodeId) => {
      const velocity = velocityMap[nodeId] || { x: 0, y: 0 };
      acc[nodeId] = {
        x: velocity.x * velocityReduction,
        y: velocity.y * velocityReduction,
      };
      return acc;
    },
    {}
  );

  return Object.keys(forceMap).reduce<Layout>((acc, nodeId) => {
    const velocity = acc[nodeId] || { x: 0, y: 0 };
    const force = forceMap[nodeId];
    acc[nodeId] = {
      x: velocity.x + force.x * time,
      y: velocity.y + force.y * time,
    };
    return acc;
  }, initialVelocities);
}

function sumXY(a: XYPosition, b: XYPosition): XYPosition {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

function getNormalizedDirection(
  a: XYPosition,
  b: XYPosition
): [number, XYPosition] {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance > 0
    ? [distance, { x: dx / distance, y: dy / distance }]
    : [distance, { x: 0, y: 0 }];
}

type HierarchyNode = { id: string } | { id: string; parentId: string };

type Layout = { [x: string]: XYPosition };

export function createTreeManagerFromModelNodes(
  nodes: (GORCNode | QuestionNode)[],
  layout: Layout = {}
): TreeManager<GORCNode> {
  const useNodes = React.useMemo(
    () => nodes.filter((n): n is GORCNode => n.type !== "question"),
    [nodes]
  );
  const treeNodes = React.useMemo(
    () => useNodes.map<Node<GORCNode>>((n) => nodeFromGORCNode(n, layout)),
    [useNodes]
  );
  const treeEdges = React.useMemo(
    () =>
      useNodes
        .filter((n): n is GORCNode & { parentId: NodeId } => "parentId" in n)
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

function nodeFromGORCNode(node: GORCNode, layout: Layout): Node<GORCNode> {
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

function edgeFromGORCNode(node: GORCNode & { parentId: NodeId }): Edge {
  return {
    id: `${node.parentId}<->${node.id}`,
    source: node.parentId,
    target: node.id,
    type: "straight",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 30,
      height: 30,
    },
  };
}
