import { expect, test } from "vitest";
import {
  ModelReferenceError,
  ParentTypeError,
  ParentReferenceError,
  validateRelations,
  validateModelHierarchy,
  parsePackage,
  parseRefOr,
  parseRelatedRefOr,
  parseRepository,
  parseObject,
  parseType,
  parseArray,
  parseModel,
  parseModelLayer,
  parseModelSlice,
  parseNode,
  parseEnumeration,
  validateModelRelations,
} from "././Validation";

import {
  ModelNode,
  ModelDefinition,
  ModelLayerDefinition,
  ModelSlice,
  Package,
  ModelRelation,
} from "./LayeredModel";
import { NodeId } from "./GORCNodes";
import { RepositoryRoot } from "./RepositorySource";

test("validateRelations for correct relations", () => {
  expect(
    Array.from(
      validateRelations(
        [{ id: "a", label: "a", version: "1.0.0" }],
        [{ id: "b", modelId: "a", label: "a", version: "1.0.0" }],
        [{ id: "c", modelId: "a", label: "a", version: "1.0.0" }]
      )
    )
  ).toStrictEqual([]);
});

test("validateRelations for missing model", () => {
  const b = { id: "b", modelId: "b", label: "a", version: "1.0.0" };
  const c = { id: "c", modelId: "b", label: "a", version: "1.0.0" };
  expect(
    Array.from(
      validateRelations([{ id: "a", label: "a", version: "1.0.0" }], [b], [c])
    )
  ).toStrictEqual([new ModelReferenceError(b), new ModelReferenceError(c)]);
});

test("validateModelHierarchy for correct model", () => {
  const baseNodes: ModelNode[] = [
    mockNode({ id: "a", type: "essential-element" }),
    mockNode({ id: "b", type: "category", childOf: "a" }),
    mockNode({ id: "c", type: "subcategory", childOf: "b" }),
    ...["a", "b", "c"].map((pid) =>
      mockNode({ id: `${pid}-attr`, type: "attribute", childOf: pid })
    ),
    ...["a", "b", "c"].map((pid) =>
      mockNode({ id: `${pid}-feat`, type: "feature", childOf: `${pid}-attr` })
    )
  ];
  const model: ModelDefinition = {
    nodes: [
      ...baseNodes,
    ],
  };
  expect(Array.from(validateModelHierarchy(model))).toStrictEqual([]);
});

test("validateModelHierarchy with incorrect parent types", () => {
  const baseNodes: ModelNode[] = [
    mockNode({ id: "a", type: "essential-element" }),
    mockNode({ id: "b", type: "category", childOf: "a" }),
    mockNode({ id: "c", type: "subcategory", childOf: "b" }),
    mockNode({ id: "a-attr", type: "attribute", childOf: "a" }),
    mockNode({ id: "a-attr-feat", type: "feature", childOf: "a-attr" }),
  ];
  const combinations: { node: ModelNode; parentType: ModelNode["type"] }[] = [
    // Test category parents
    {
      node: mockNode({ id: "t", type: "category", childOf: "b" }),
      parentType: "category",
    },
    {
      node: mockNode({ id: "t", type: "category", childOf: "c" }),
      parentType: "subcategory",
    },
    {
      node: mockNode({ id: "t", type: "category", childOf: "a-attr" }),
      parentType: "attribute",
    },
    {
      node: mockNode({ id: "t", type: "category", childOf: "a-attr-feat" }),
      parentType: "feature",
    },

    // Test subcategory parents
    {
      node: mockNode({ id: "t", type: "subcategory", childOf: "c" }),
      parentType: "subcategory",
    },
    {
      node: mockNode({ id: "t", type: "subcategory", childOf: "a-attr" }),
      parentType: "attribute",
    },
    {
      node: mockNode({ id: "t", type: "subcategory", childOf: "a-attr-feat" }),
      parentType: "feature",
    },

    // Test attribute parents
    {
      node: mockNode({ id: "t", type: "attribute", childOf: "a-attr" }),
      parentType: "attribute",
    },
    {
      node: mockNode({ id: "t", type: "attribute", childOf: "a-attr-feat" }),
      parentType: "feature",
    },

    // Test feature parents
    {
      node: mockNode({ id: "t", type: "feature", childOf: "a" }),
      parentType: "essential-element",
    },
    {
      node: mockNode({ id: "t", type: "feature", childOf: "b" }),
      parentType: "category",
    },
    {
      node: mockNode({ id: "t", type: "feature", childOf: "c" }),
      parentType: "subcategory",
    },
    {
      node: mockNode({ id: "t", type: "feature", childOf: "a-attr-feat" }),
      parentType: "feature",
    },
  ];
  for (const combination of combinations) {
    expect(
      Array.from(
        validateModelHierarchy({
          nodes: [...baseNodes, combination.node],
        })
      )
    ).toStrictEqual([
      new ParentTypeError(combination.node, combination.parentType),
    ]);
  }
});

test("validateModelHierarchy with missing parents", () => {
  const node = mockNode({ id: "b", type: "category", childOf: "c" });
  if ("childOf" in node) {
    expect(
      Array.from(
        validateModelHierarchy({
          nodes: [node],
        })
      )
    ).toStrictEqual([new ParentReferenceError(node, "childOf", node.childOf)]);
  } else {
    throw new Error("Missing childOf in test node");
  }
});

test("validateModelRelations for correct model", () => {
  const baseNodes: ModelNode[] = [
    mockNode({ id: "a", type: "essential-element" }),
    mockNode({ id: "b", type: "category", childOf: "a" }),
    mockNode({ id: "c", type: "subcategory", childOf: "b" }),
    ...["a", "b", "c"].map((pid) =>
      mockNode({ id: `${pid}-metric`, type: "metric", childOf: pid })
    ),
    ...["a", "b", "c"].map((pid) =>
      mockNode({ id: `${pid}-kpi`, type: "kpi", childOf: pid })
    ),
  ];
  const model: ModelDefinition = {
    nodes: [
      ...baseNodes,
    ],
  };
  expect(Array.from(validateModelRelations(model))).toStrictEqual([]);
});

test("validateModelRelations with missing relatives", () => {
  const node = mockNode({ id: "b", type: "kpi", childOf: "c" });
  if (node.type === "kpi" || node.type === "metric") {
    expect(
      Array.from(
        validateModelRelations({
          nodes: [node],
        })
      )
    ).toStrictEqual([
      new ParentReferenceError(node, "indicatorOf", node.indicatorOf[0]),
      new ParentReferenceError(node, "measurementOf", node.measurementOf[0]),
    ]);
  } else {
    throw new Error(`Incorrect node type for test (expected 'kpi' or 'metric'): ${node.type}`);
  }
})

test("parsePackage with simple package", () => {
  const data: Package & { mock: string } = {
    id: "a",
    label: "a-label",
    version: "1.0.0",
    mock: "data",
  };
  const packageParser = parsePackage(parseMock);
  const result = packageParser(data);
  expect(result.id).toBe("a");
  expect(result.label).toBe("a-label");
  expect(result.version).toBe("1.0.0");
  expect(result.mock).toBe("data");
});

test("parseRefOr with simple data", () => {
  const data: {
    mock: string;
  } = {
    mock: "data",
  };
  const parser = parseRefOr(parseMock);
  const result = parser(data);
  expect("mock" in result).toBe(true);
  expect("mock" in result && result["mock"]).toBe("data");
});

test("parseRefOr with reference", () => {
  const ref: {
    ref: string;
  } = {
    ref: "reference-id",
  };
  const parser = parseRefOr(parseMock);
  const result = parser(ref);
  expect("ref" in result).toBe(true);
  expect("ref" in result && result["ref"]).toBe("reference-id");
});

test("parseRelatedRefOr with simple data", () => {
  const data: ModelRelation & {
    mock: string;
  } = {
    modelId: "model-a",
    mock: "data",
  };
  const parser = parseRelatedRefOr(parseRelatedMock);
  const result = parser(data);
  expect("mock" in result).toBe(true);
  expect("mock" in result && result["mock"]).toBe("data");
  expect(data.modelId).toBe("model-a");
});

test("parseRelatedRefOr with reference", () => {
  const ref: ModelRelation & {
    ref: string;
  } = {
    modelId: "model-a",
    ref: "reference-id",
  };
  const parser = parseRelatedRefOr(parseRelatedMock);
  const result = parser(ref);
  expect("ref" in result).toBe(true);
  expect("ref" in result && result["ref"]).toBe("reference-id");
  expect(ref.modelId).toBe("model-a");
});

test("parseRepository with simple data", () => {
  const data: RepositoryRoot = {
    id: "repo-id",
    name: "repo-name",
    description: "repo-description",
    url: "local://repo",
    baseModels: [
      {
        id: "model-id",
        label: "model-label",
        nodes: [mockNode({ id: "a", type: "essential-element" })],
        version: "1.0.0",
      },
      {
        ref: "local://model-ref",
      },
    ],
    profiles: [
      {
        id: "profile-id",
        label: "profile-label",
        nodes: [mockNode({ id: "a", type: "essential-element" })],
        version: "1.0.0",
        modelId: "model-id",
      },
      {
        ref: "local://profile-ref",
        modelId: "model-a",
      },
    ],
    thematicSlices: [
      {
        id: "slice-id",
        label: "slice-label",
        nodes: [{ nodeId: "a" }],
        version: "1.0.0",
        modelId: "model-id",
      },
      {
        ref: "local://slice-ref",
        modelId: "model-a",
      },
    ],
  };
  const result = parseRepository(data);
  expect(result).toStrictEqual(data);
});

test("parseObject with simple data", () => {
  const data = {
    mock: "data",
  };
  const result = parseObject(data, {
    mock: parseType<string>("string"),
  });
  expect(result.mock).toBe("data");
});

test("parseObject with error", () => {
  const data = {
    mock: 3,
  };
  expect(() => {
    parseObject(data, {
      mock: parseType<string>("string"),
    });
  }).toThrowError(
    "parseObject: \n- mock: Error: Type 'number' is not compatible with 'string'"
  );
});

test("parseArray with simple data", () => {
  const data = ["a", "b", "c"];
  const parser = parseArray(parseType<string>("string"));
  const result = parser(data);
  expect(result).toStrictEqual(["a", "b", "c"]);
});

test("parseModel with simple data", () => {
  const model: ModelDefinition = {
    nodes: [
      mockNode({ id: "a", type: "essential-element" }),
      mockNode({ id: "b", type: "category", childOf: "a" }),
      mockNode({ id: "c", type: "subcategory", childOf: "b" }),
      mockNode({ id: "a-attr", type: "attribute", childOf: "a" }),
      mockNode({ id: "a-attr-feat", type: "feature", childOf: "a-attr" }),
      mockNode({ id: "a-attr-kpi", type: "kpi", childOf: "a-attr" }),
    ],
  };
  const result = parseModel(model);
  expect(model).toStrictEqual(result);
});

test("parseModelLayer with simple data", () => {
  const layer: ModelLayerDefinition & ModelRelation = {
    nodes: [
      mockNode({ id: "a", type: "essential-element" }),
      { id: "b", type: "nothing" },
    ],
    modelId: "test",
  };
  const result = parseModelLayer(layer);
  expect(layer).toStrictEqual(result);
});

test("parseModelSlice with simple data", () => {
  const slice: ModelSlice & ModelRelation = {
    nodes: [{ nodeId: "a" }],
    modelId: "test",
  };
  const result = parseModelSlice(slice);
  expect(slice).toStrictEqual(result);
});

test("parseNode with simple data", () => {
  const variants = [
    mockNode({ id: "a", type: "essential-element" }),
    mockNode({ id: "b", type: "category", childOf: "a" }),
    mockNode({ id: "c", type: "subcategory", childOf: "b" }),
    mockNode({ id: "a-attr", type: "attribute", childOf: "a" }),
    mockNode({ id: "a-attr-feat", type: "feature", childOf: "a-attr" }),
    mockNode({ id: "a-attr-kpi", type: "kpi", childOf: "a-attr" }),
  ];

  for (const data of variants) {
    const result = parseNode(data);
    expect(data).toStrictEqual(result);
  }
});

test("parseEnumeration with simple data", () => {
  const variants = ["a", "b", "c"];

  const parser = parseEnumeration(["a", "b", "c"]);
  for (const data of variants) {
    const result = parser(data);
    expect(data).toBe(result);
  }
  expect(() => {
    parser("d");
  }).toThrow('Value \'d\' is not in ["a","b","c"]');
});

function parseMock(d: unknown): { mock: string } {
  return {
    mock: d && typeof d === "object" && "mock" in d ? String(d["mock"]) : "",
  };
}

function parseRelatedMock(d: unknown): ModelRelation & { mock: string } {
  return {
    modelId:
      d && typeof d === "object" && "modelId" in d ? String(d["modelId"]) : "",
    ...parseMock(d),
  };
}

function mockNode(
  base:
    | {
        id: NodeId;
        childOf: NodeId;
        type:
          | "category"
          | "subcategory"
          | "attribute"
          | "feature"
          | "kpi"
          | "metric"
      }
    | { id: NodeId; type: "essential-element" }
): ModelNode {
  const id = base.id;
  switch (base.type) {
    case "category":
    case "subcategory":
    case "attribute":
    case "feature": {
      return {
        id: id,
        childOf: base.childOf,
        type: base.type,
        icon: `icons/${id}.png`,
        name: `Name of ${id}`,
        description: `Description of ${id}`,
        considerationLevel: "core",
      };
    }
    case "metric":
    case "kpi": {
      return {
        id: id,
        measurementOf: [base.childOf],
        indicatorOf: [base.childOf],
        type: base.type,
        icon: `icons/${id}.png`,
        name: `Name of ${id}`,
        description: `Description of ${id}`,
        considerationLevel: "core",
      };
    }
    case "essential-element": {
      return {
        id: id,
        type: base.type,
        icon: `icons/${id}.png`,
        name: `Name of ${id}`,
        description: `Description of ${id}`,
        considerationLevel: "core",
      };
    }
  }
}
