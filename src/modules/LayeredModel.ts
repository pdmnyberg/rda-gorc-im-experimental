import {GORCNode, QuestionNode, NodeId} from "./GORCNodes";

type ModelNode = GORCNode | QuestionNode;

export type BaseModel = Package & ModelDefinition;

export type ModelProfile = Package & ModelLayerDefinition;

export type ModelDefinition = {
    nodes: ModelNode[];
}

export type ModelLayerDefinition = {
    nodes: (ModelNode | Nothing)[];
}

export type ThematicSlice = Package & {
    nodes: {
        nodeId: NodeId;
    }[];
}

export type Package = {
    id: PackageId;
    label: string;
    version: SemanticVersionString;
}

type Nothing = {type: "nothing", id: NodeId};

type SemanticVersionString = string;

type PackageId = string;


export function applyLayers(model: ModelDefinition, layers: ModelLayerDefinition[]): ModelDefinition {
    const initialNodes = mapNodes(model.nodes);
    const allNodes = layers.reduce<{[x: NodeId]: ModelNode | Nothing}>(
        (acc, layer) => {
            const layerNodes = mapNodes(layer.nodes);
            return {...acc, ...layerNodes};
        },
        initialNodes
    );
    const modelNodes = (
        Object.keys(allNodes)
        .map(key => allNodes[key])
        .filter((node): node is ModelNode => node.type !== "nothing")
    );
    return {
        nodes: modelNodes
    }
}

export function getModelNodes(model: ModelDefinition): ModelNode[] {
    return model.nodes;
}

function mapNodes<T extends {id: NodeId}>(nodes: T[]): {[x: NodeId]: T} {
    return nodes.reduce<{[x: NodeId]: T}>((acc, node) => {
        acc[node.id] = node;
        return acc;
    }, {})
}
