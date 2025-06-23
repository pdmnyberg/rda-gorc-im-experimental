import { GORCNode, QuestionNode, NodeId } from "./GORCNodes";

export type ModelNode = GORCNode | QuestionNode;

export type BaseModel = Package & ModelDefinition;

export type ModelProfile = Package & ModelRelation & ModelLayerDefinition;

export type ThematicSlice = Package & ModelRelation & ModelSlice;

export type ModelDefinition = {
  nodes: ModelNode[];
};

export type ModelLayerDefinition = {
  nodes: (ModelNode | Nothing)[];
};

export type ModelSlice = {
  nodes: {
    nodeId: NodeId;
  }[];
};

export type Package = {
  id: PackageId;
  label: string;
  version: SemanticVersionString;
};

export type ModelRelation = {
  modelId: PackageId;
};

export type Nothing = { type: "nothing"; id: NodeId };

type SemanticVersionString = string;

type PackageId = string;

export function applyLayersAndSlices(
  model: ModelDefinition,
  layers: ModelLayerDefinition[],
  slices: ModelSlice[]
): ModelDefinition {
  const activeNodes =
    slices.length > 0
      ? slices.reduce<Set<NodeId>>((acc, slice) => {
          for (const node of slice.nodes) {
            acc.add(node.nodeId);
          }
          return acc;
        }, new Set())
      : null;
  const initialNodes = mapNodes(model.nodes);
  const allNodes = layers.reduce<{ [x: NodeId]: ModelNode | Nothing }>(
    (acc, layer) => {
      const layerNodes = mapNodes(layer.nodes);
      return { ...acc, ...layerNodes };
    },
    initialNodes
  );
  const modelNodes = Object.keys(allNodes)
    .map((key) => allNodes[key])
    .filter((node): node is ModelNode => node.type !== "nothing");
  const nodesInSlices = activeNodes
    ? modelNodes.filter((n) => activeNodes.has(n.id))
    : modelNodes;
  return {
    nodes: nodesInSlices,
  };
}

export function getModelNodes(model: ModelDefinition): ModelNode[] {
  return model.nodes;
}

function mapNodes<T extends { id: NodeId }>(nodes: T[]): { [x: NodeId]: T } {
  return nodes.reduce<{ [x: NodeId]: T }>((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {});
}
