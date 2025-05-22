import React from "react";
import {
  Node,
  Edge
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

export function createTreeManagerFromModelNodes(nodes: (GORCNode | QuestionNode)[]): TreeManager {
  const useNodes = nodes.filter((n): n is GORCNode => n.type !== "question");
  const treeNodes = useNodes.map<Node>(nodeFromGORCNode);
  const treeEdges = useNodes.filter((n): n is GORCNode & {parentId: NodeId} => "parentId" in n).map<Edge>(edgeFromGORCNode);

  return {
    getNodes: () => treeNodes,
    getEdges: () => treeEdges,
  }
}

function nodeFromGORCNode(node: GORCNode): Node {
  return {
    id: node.id,
    position: { x: Math.random() * 300, y: Math.random() * 300 },
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
