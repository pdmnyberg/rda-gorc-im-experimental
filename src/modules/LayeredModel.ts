import {GORCNode, QuestionNode, NodeId, EssentialElement, Category, Subcategory, Feature, Attribute, KPI} from "./GORCNodes";

type ModelNode = (
    Omit<EssentialElement, "id">
    | Omit<Category, "id">
    | Omit<Subcategory, "id">
    | Omit<Feature, "id">
    | Omit<Attribute, "id">
    | Omit<KPI, "id">
    | Omit<QuestionNode, "id">
);

export type BaseModel = Package & ModelDefinition;

export type ModelProfile = Package & ModelLayerDefinition;

export type ModelDefinition = {
    nodes: {
        [id: NodeId]: ModelNode;
    };
}

export type ModelLayerDefinition = {
    nodes: {
        [id: NodeId]: ModelNode | Nothing;
    };
}

export type ThematicSlice = Package & {
    nodes: {
        nodeId: NodeId;
    }[];
}

type Package = {
    id: PackageId;
    label: string;
    version: SemanticVersionString;
}

type Nothing = {type: "nothing"}

type SemanticVersionString = string;

type PackageId = string;


export function applyLayers(model: ModelDefinition, layers: ModelLayerDefinition[]): ModelDefinition {
    const initialNodes: ModelLayerDefinition["nodes"] = {...model.nodes};
    const allNodes = layers.reduce<ModelLayerDefinition["nodes"]>(
        (acc, layer) => {
            return {...acc, ...layer.nodes};
        },
        initialNodes
    );
    const modelNodes: ModelDefinition["nodes"] = Object.keys(allNodes).reduce<ModelDefinition["nodes"]>((acc, key) => {
        const node = allNodes[key];
        if (node.type !== "nothing") {
            acc[key] = node;
        }
        return acc;
    }, {});
    return {
        nodes: modelNodes
    }
}

export function getModelNodes(model: ModelDefinition): (GORCNode | QuestionNode)[] {
    return Object.keys(model.nodes).map<GORCNode | QuestionNode>((key) => {
        const node = model.nodes[key];
        return {
            ...node,
            id: key
        }
    })
}
