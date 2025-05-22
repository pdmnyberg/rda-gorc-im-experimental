import React from "react";
import {
  Node,
  Edge,
  XYPosition,
} from "@xyflow/react";
import {GORCNode, QuestionNode, NodeId} from "../modules/GORCNodes"

export interface TreeManager {
    getNodes(): Node[];
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

export function getLayout(nodes: HierarchyNode[], nodeSize: number): Layout {
  const nodeMap = nodes.reduce<{[x: string]: HierarchyNode}>((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {});

  const nodeDepthMap = nodes.reduce<{[x: string]: number}>((acc, node) => {
    let depth = -1;
    let currentNode: HierarchyNode | null = node;
    while (currentNode) {
      depth += 1;
      currentNode = "parentId" in currentNode ? nodeMap[currentNode.parentId] : null;
    }
    acc[node.id] = depth;
    return acc;
  }, {});

  const nodeSizeMap = nodes.reduce<{[x: string]: number}>((acc, node) => {
    let currentNode: HierarchyNode | null = node;
    let depth = 0;
    while (currentNode) {
      depth += 1;
      acc[currentNode.id] = Math.max(acc[currentNode.id] || 0, depth);
      currentNode = "parentId" in currentNode ? nodeMap[currentNode.parentId] : null;
    }
    return acc;
  }, {});

  const levels = Array.from(new Set(Object.values(nodeDepthMap))).sort();
  const positions = levels.reduce<{[x: string]: XYPosition}>((acc, level) => {
    const levelNodes = nodes.filter(node => nodeDepthMap[node.id] === level);
    const groups = Array.from(new Set(levelNodes.map(n => "parentId" in n ? n.parentId : null)))
    let lastPosition = 0;
    for (const group of groups) {
      const groupNodes = levelNodes.filter(n => "parentId" in n ? n.parentId === group : true)
      const levelSize = groupNodes.map(n => Math.pow(2, nodeSizeMap[n.id]) * nodeSize).reduce((a, b) => a + b);
      const levelRadius = levelSize / (2 * Math.PI);
      for (const node of groupNodes) {
        const parentPosition: XYPosition = "parentId" in node ? acc[node.parentId] : {x: 0, y: 0};
        const currentNodeSize = Math.pow(2, nodeSizeMap[node.id]) * nodeSize;
        const radialPosition = (lastPosition + 0.5 * currentNodeSize) / levelSize;
        const nodeRadius = (levelRadius + currentNodeSize * 0.5);
        acc[node.id] = {
          x: parentPosition.x + nodeRadius * Math.sin(2 * Math.PI * radialPosition),
          y: parentPosition.y + nodeRadius * Math.cos(2 * Math.PI * radialPosition),
        }
        lastPosition += currentNodeSize;
      }
    }
    return acc;
  }, {});
  return positions;
}

type HierarchyNode = {id: string} | {id: string, parentId: string};

type Layout = {[x: string]: XYPosition}

export function createTreeManagerFromModelNodes(nodes: (GORCNode | QuestionNode)[], layout: Layout = {}): TreeManager {
  const useNodes = nodes.filter((n): n is GORCNode => n.type !== "question");
  const treeNodes = useNodes.map<Node>(n => nodeFromGORCNode(n, layout));
  const treeEdges = useNodes.filter((n): n is GORCNode & {parentId: NodeId} => "parentId" in n).map<Edge>(edgeFromGORCNode);

  return {
    getNodes: () => treeNodes,
    getEdges: () => treeEdges,
  }
}

function nodeFromGORCNode(node: GORCNode, layout: Layout): Node {
  const position = layout[node.id] || { x: Math.random() * 300, y: Math.random() * 300 }
  return {
    id: node.id,
    position: position,
    data: { label: node.name.longName },
  }
}

function edgeFromGORCNode(node: GORCNode & {parentId: NodeId}): Edge {
  return {
    id: `${node.parentId}<->${node.id}`,
    source: node.parentId,
    target: node.id,
  }
}
