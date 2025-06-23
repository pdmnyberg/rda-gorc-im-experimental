import {
  applyLayersAndSlices,
  ModelNode,
  ModelDefinition,
  ModelLayerDefinition,
  ModelSlice,
  ModelProfile,
  ThematicSlice,
  ModelRelation,
  Package,
  Nothing,
} from "./LayeredModel";
import {
  NodeId,
  EssentialElement,
  QuestionNode,
  Category,
  Subcategory,
  Attribute,
  Feature,
  KPI,
} from "./GORCNodes";
import { RepositoryRoot } from "./RepositorySource";

type OtherNodes = Category | Subcategory | Attribute | Feature | KPI;

export class ModelReferenceError {
  public readonly item: Package & ModelRelation;
  constructor(item: Package & ModelRelation) {
    this.item = item;
  }
  toString() {
    return `Model reference '${this.item.modelId}', used by '${this.item.id}', could not be found.`;
  }
}

export class IdConflictError {
  public readonly id: string;
  constructor(id: string) {
    this.id = id;
  }
  toString() {
    return `Duplicate id found: '${this.id}'`;
  }
}

export class ParentReferenceError {
  public readonly item: { id: NodeId; parentId: NodeId };
  constructor(item: { id: NodeId; parentId: NodeId }) {
    this.item = item;
  }
  toString() {
    return `Parent reference '${this.item.parentId}', used by '${this.item.id}', could not be found.`;
  }
}

export class ParentTypeError {
  public readonly parentType: ModelNode["type"] | null;
  public readonly node: ModelNode;
  constructor(node: ModelNode, parentType: ModelNode["type"] | null) {
    this.node = node;
    this.parentType = parentType;
  }
  toString() {
    return `Parent type '${this.parentType}', is not valid for '${this.node.id}'`;
  }
}

export type GroupedError =
  | unknown
  | string
  | Error
  | ModelReferenceError
  | ParentReferenceError
  | ParentTypeError
  | IdConflictError
  | ErrorGroup;

export class ErrorGroup {
  readonly errors: GroupedError[];
  readonly context: string;
  constructor(errors: GroupedError[] | GroupedError, context: string) {
    this.errors = Array.isArray(errors) ? errors : [errors];
    this.context = context;
  }
  toString(level: number = 0) {
    const depth = " ".repeat(level);
    return this.errors.length === 1 && !(this.errors[0] instanceof ErrorGroup)
      ? `${this.context}: ${String(this.errors[0])}`
      : `${this.context}: \n${depth}- ${this.errors.map((e) => this._errorToString(e, level + 1)).join(`\n${depth}- `)}`;
  }
  _errorToString(e: GroupedError, level: number = 0): string {
    if (e instanceof ErrorGroup) {
      return e.toString(level);
    } else {
      return String(e);
    }
  }
  static from(iterator: Iterable<GroupedError>, context: string) {
    const errors = Array.from(iterator);
    if (errors.length > 0) {
      return new ErrorGroup(errors, context);
    }
    return undefined;
  }
}

export function* validateRelations(
  models: Package[],
  profiles: (Package & ModelRelation)[],
  slices: (Package & ModelRelation)[]
) {
  const modelMap = models.reduce<{ [x: NodeId]: Package | undefined }>(
    (acc, model) => {
      acc[model.id] = model;
      return acc;
    },
    {}
  );
  for (const profile of profiles) {
    const model = modelMap[profile.modelId];
    if (!model) {
      yield new ModelReferenceError(profile);
    }
  }
  for (const slice of slices) {
    const model = modelMap[slice.modelId];
    if (!model) {
      yield new ModelReferenceError(slice);
    }
  }
}

export function* validateModelHierarchy(model: ModelDefinition) {
  const nodeMap = model.nodes.reduce<{ [x: NodeId]: ModelNode }>(
    (acc, node) => {
      acc[node.id] = node;
      return acc;
    },
    {}
  );
  const allowedParentsMap: {
    [P in ModelNode["type"]]: (ModelNode["type"] | null)[];
  } = {
    "essential-element": [null],
    category: ["essential-element"],
    subcategory: ["category"],
    attribute: ["essential-element", "category", "subcategory"],
    feature: ["attribute"],
    kpi: ["attribute", "feature"],
    question: [
      "essential-element",
      "category",
      "subcategory",
      "attribute",
      "feature",
      "kpi",
    ],
  };
  for (const node of model.nodes) {
    const parentNode = "parentId" in node ? nodeMap[node.parentId] : null;
    const parentType = parentNode ? parentNode.type : null;
    const allowedParents = allowedParentsMap[node.type];
    if (!allowedParents.includes(parentType)) {
      if (parentType !== null) {
        yield new ParentTypeError(node, parentType);
      } else if ("parentId" in node) {
        yield new ParentReferenceError(node);
      }
    }
  }
}

export function* validateUniqueIds(items: { id: string }[]) {
  const idSet = new Set<string>();
  for (const item of items) {
    if (idSet.has(item.id)) {
      yield new IdConflictError(item.id);
    }
    idSet.add(item.id);
  }
}

export function* validateProfile(
  model: ModelDefinition,
  profile: ModelProfile
) {
  const updatedModel = applyLayersAndSlices(model, [profile], []);
  for (const error of validateModelHierarchy(updatedModel)) {
    yield error;
  }
}

export function* validateThematicSlice(
  model: ModelDefinition,
  slice: ThematicSlice
) {
  const updatedModel = applyLayersAndSlices(model, [], [slice]);
  for (const error of validateModelHierarchy(updatedModel)) {
    yield error;
  }
}

export function requireNoErrors<T>(
  errorIterator: Iterable<T>,
  context: string
) {
  const allErrors = Array.from(errorIterator);
  if (allErrors.length > 0) {
    throw new Error(`${context}`);
  }
}

export function parsePackage<T>(
  parser: (d: unknown) => T
): (d: unknown) => Package & T {
  return (data: unknown) => {
    if (typeof data === "object" && data !== null) {
      const parsers: Parsers<Package> = {
        id: parseType("string"),
        label: parseType("string"),
        version: parseType("string"),
      };
      const packageInfo: Package = parseObject(data, parsers, "parsePackage");
      const packageData: T = parser(data);
      return {
        ...packageInfo,
        ...packageData,
      };
    }
    throw new Error("Data is not a Package");
  };
}

export function parseRefOr<T extends object>(
  parser: (d: unknown) => T
): (d: unknown) => T | { ref: string } {
  return (data: unknown) => {
    if (typeof data === "object" && data !== null) {
      if ("ref" in data) {
        const parsers: Parsers<{ ref: string }> = {
          ref: parseType("string"),
        };
        return parseObject(data, parsers, "parseRefOr");
      } else {
        return parser(data);
      }
    }
    throw new Error("Data is not data or reference");
  };
}

export function parseRelatedRefOr<T extends object>(
  parser: (d: unknown) => T
): (d: unknown) => T | (ModelRelation & { ref: string }) {
  return (data: unknown) => {
    if (typeof data === "object" && data !== null) {
      if ("ref" in data) {
        const parsers: Parsers<ModelRelation & { ref: string }> = {
          ref: parseType("string"),
          modelId: parseType("string"),
        };
        return parseObject(data, parsers, "parseRelatedRefOr");
      } else {
        return parser(data);
      }
    }
    throw new Error("Data is not data or related reference");
  };
}

export function parseRepository(data: unknown): RepositoryRoot {
  if (typeof data === "object" && data !== null) {
    const parsers: Parsers<RepositoryRoot> = {
      id: parseType("string"),
      name: parseType("string"),
      description: parseType("string", "undefined"),
      url: parseType("string", "undefined"),
      baseModels: parseArray(parseRefOr(parsePackage(parseModel))),
      profiles: parseArray(parseRelatedRefOr(parsePackage(parseModelLayer))),
      thematicSlices: parseArray(
        parseRelatedRefOr(parsePackage(parseModelSlice))
      ),
    };
    return parseObject(data, parsers, "parseRepository");
  }
  throw new Error("Data is not a RepositoryRoot");
}

export function parseModel(data: unknown): ModelDefinition {
  if (typeof data === "object" && data !== null) {
    const parsers: Parsers<ModelDefinition> = {
      nodes: parseArray(parseNode),
    };
    return parseObject(data, parsers, "parseModel");
  }
  throw new Error("Data is not a ModelDefinition");
}

export function parseModelLayer(
  data: unknown
): ModelRelation & ModelLayerDefinition {
  if (typeof data === "object" && data !== null) {
    const parsers: Parsers<ModelRelation & ModelLayerDefinition> = {
      nodes: parseArray(parseNodeOrNothing),
      modelId: parseType("string"),
    };
    return parseObject(data, parsers, "parseModelLayer");
  }
  throw new Error("Data is not a ModelLayerDefinition");
}

export function parseModelSlice(data: unknown): ModelRelation & ModelSlice {
  if (typeof data === "object" && data !== null) {
    const parsers: Parsers<ModelRelation & ModelSlice> = {
      nodes: parseArray(parseNodeRef),
      modelId: parseType("string"),
    };
    return parseObject(data, parsers, "parseModelSlice");
  }
  throw new Error("Data is not a ModelSlice");
}

export function parseNodeOrNothing(data: unknown): ModelNode | Nothing {
  if (typeof data === "object" && data !== null && "type" in data) {
    if (data.type === "nothing") {
      const parsers: Parsers<Nothing> = {
        type: parseEnumeration<Nothing["type"]>(["nothing"]),
        id: parseType("string"),
      };
      return parseObject(data, parsers, "parseNodeOrNothing");
    } else {
      return parseNode(data);
    }
  }
  throw new Error("Data is not a ModelLayerNode");
}

export function parseNode(data: unknown): ModelNode {
  if (typeof data === "object" && data !== null && "type" in data) {
    if (data.type === "essential-element") {
      const parsers: Parsers<EssentialElement> = {
        type: parseEnumeration<EssentialElement["type"]>(["essential-element"]),
        id: parseType("string"),
        icon: parseOptional(parseType("string", "undefined")),
        name: parseType("string"),
        shortName: parseOptional(parseType("string", "undefined")),
        description: parseType("string"),
        shortDescription: parseOptional(parseType("string", "undefined")),
        examples: parseOptional(parseArray(parseType("string"))),
        sources: parseOptional(parseArray(parseType("object"))),
        considerationLevel: parseEnumeration<
          EssentialElement["considerationLevel"]
        >(["core", "desirable", "optional"]),
      };
      return parseObject(data, parsers, "parseNode:EssentialElement");
    } else if (data.type === "question") {
      const parsers: Parsers<QuestionNode> = {
        type: parseEnumeration<QuestionNode["type"]>(["question"]),
        id: parseType("string"),
        parentId: parseType("string"),
        text: parseType("string"),
        description: parseType("string"),
      };
      return parseObject(data, parsers, "parseNode:Question");
    } else {
      const parsers: Parsers<Omit<OtherNodes, "type">> = {
        parentId: parseType("string"),
        id: parseType("string"),
        icon: parseOptional(parseType("string", "undefined")),
        name: parseType("string"),
        shortName: parseOptional(parseType("string", "undefined")),
        description: parseType("string"),
        shortDescription: parseOptional(parseType("string", "undefined")),
        examples: parseOptional(parseArray(parseType("string"))),
        sources: parseOptional(parseArray(parseType("object"))),
        considerationLevel: parseEnumeration<OtherNodes["considerationLevel"]>([
          "core",
          "desirable",
          "optional",
        ]),
      };
      const obj = parseObject(data, parsers, "parseNode:OtherNodes");
      return {
        type: parseEnumeration<OtherNodes["type"]>([
          "category",
          "subcategory",
          "attribute",
          "feature",
          "kpi",
        ])(data.type),
        ...obj,
      };
    }
  }
  throw new Error("Data is not a ModelNode");
}

function parseNodeRef(data: unknown): { nodeId: NodeId } {
  if (typeof data === "object" && data !== null && "nodeId" in data) {
    return {
      nodeId: parseType<string>("string")(data.nodeId),
    };
  }
  throw new Error("Data is not a ModelNode");
}

function parseType<T>(...types: string[]): (v: unknown) => T {
  return (value: unknown) => {
    const checkType = typeof value;
    if (types.includes(checkType)) {
      return value as T;
    } else {
      throw new Error(`Type ${checkType} is not compatible with ${types}`);
    }
  };
}

function parseArray<T>(parser: (value: unknown) => T): (v: unknown) => T[] {
  return (value: unknown) => {
    if (Array.isArray(value)) {
      return value.map(parser);
    } else {
      throw new Error(`Value '${value}' is not an array.`);
    }
  };
}

function parseOptional<T>(
  parser: (value: unknown) => T
): (v: unknown) => T | undefined {
  return (value: unknown) => {
    if (typeof value === "undefined") {
      return value;
    } else {
      return parser(value);
    }
  };
}

function parseEnumeration<T>(enumeration: T[]): (v: unknown) => T {
  return (value: unknown) => {
    const maybeValue = value as T;
    if (enumeration.includes(maybeValue)) {
      return maybeValue;
    } else {
      throw new Error(
        `Value ${value} is not in ${JSON.stringify(enumeration)}`
      );
    }
  };
}

type Parsers<T extends object> = {
  [P in keyof T]: (v: unknown) => Exclude<T[P], null>;
};

function parseObject<T extends object>(
  obj: object,
  parsers: Parsers<T>,
  context: string = "parseObject"
) {
  const maybeObject = obj as T;
  const parsed = {} as T;
  const errors: ErrorGroup[] = [];
  for (const key of Object.keys(parsers) as Array<keyof T>) {
    try {
      const parser = parsers[key];
      parsed[key] = parser(maybeObject[key]);
    } catch (e) {
      errors.push(new ErrorGroup(e, String(key)));
    }
  }
  if (errors.length > 0) {
    throw new ErrorGroup(errors, context);
  }
  return parsed;
}

export function* chain<T>(iterators: Iterable<T>[]) {
  for (const iterator of iterators) {
    for (const i of iterator) {
      yield i;
    }
  }
}
