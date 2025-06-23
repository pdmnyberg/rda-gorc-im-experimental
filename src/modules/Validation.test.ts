import { expect, test } from "vitest";
import {
  ModelReferenceError,
  ParentTypeError,
  ParentReferenceError,
  validateRelations,
  validateModelHierarchy,
} from "././Validation";

import { ModelNode, ModelDefinition } from "./LayeredModel";
import { NodeId } from "./GORCNodes";

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

function mockNode(
  base:
    | {
        id: NodeId;
        parentId: NodeId;
        type:
          | "category"
          | "subcategory"
          | "attribute"
          | "feature"
          | "kpi"
          | "question";
      }
    | { id: NodeId; type: "essential-element" }
): ModelNode {
  const id = base.id;
  switch (base.type) {
    case "category":
    case "subcategory":
    case "attribute":
    case "feature":
    case "kpi": {
      return {
        id: id,
        parentId: base.parentId,
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
    case "question": {
      return {
        type: base.type,
        id: id,
        description: `Description of ${id}`,
        text: `Text of ${id}`,
        parentId: base.parentId,
      };
    }
  }
}

test("validateModelHierarchy for correct model", () => {
  const baseNodes: ModelNode[] = [
    mockNode({ id: "a", type: "essential-element" }),
    mockNode({ id: "b", type: "category", parentId: "a" }),
    mockNode({ id: "c", type: "subcategory", parentId: "b" }),
    ...["a", "b", "c"].map((pid) =>
      mockNode({ id: `${pid}-attr`, type: "attribute", parentId: pid })
    ),
    ...["a", "b", "c"].map((pid) =>
      mockNode({ id: `${pid}-feat`, type: "feature", parentId: `${pid}-attr` })
    ),
    ...["a", "b", "c"].map((pid) =>
      mockNode({ id: `${pid}-attr-kpi`, type: "kpi", parentId: `${pid}-attr` })
    ),
    ...["a", "b", "c"].map((pid) =>
      mockNode({ id: `${pid}-feat-kpi`, type: "kpi", parentId: `${pid}-feat` })
    ),
  ];
  const model: ModelDefinition = {
    nodes: [
      ...baseNodes,
      ...baseNodes.map((n) =>
        mockNode({ id: `${n.id}-question`, type: "question", parentId: n.id })
      ),
    ],
  };
  expect(Array.from(validateModelHierarchy(model))).toStrictEqual([]);
});

test("validateModelHierarchy with incorrect parent types", () => {
  const baseNodes: ModelNode[] = [
    mockNode({ id: "a", type: "essential-element" }),
    mockNode({ id: "b", type: "category", parentId: "a" }),
    mockNode({ id: "c", type: "subcategory", parentId: "b" }),
    mockNode({ id: "a-attr", type: "attribute", parentId: "a" }),
    mockNode({ id: "a-attr-feat", type: "feature", parentId: "a-attr" }),
    mockNode({ id: "a-attr-kpi", type: "kpi", parentId: "a-attr" }),
    mockNode({ id: "a-question", type: "question", parentId: "a" }),
  ];
  const combinations: { node: ModelNode; parentType: ModelNode["type"] }[] = [
    // Test category parents
    {
      node: mockNode({ id: "t", type: "category", parentId: "b" }),
      parentType: "category",
    },
    {
      node: mockNode({ id: "t", type: "category", parentId: "c" }),
      parentType: "subcategory",
    },
    {
      node: mockNode({ id: "t", type: "category", parentId: "a-attr" }),
      parentType: "attribute",
    },
    {
      node: mockNode({ id: "t", type: "category", parentId: "a-attr-feat" }),
      parentType: "feature",
    },
    {
      node: mockNode({ id: "t", type: "category", parentId: "a-attr-kpi" }),
      parentType: "kpi",
    },
    {
      node: mockNode({ id: "t", type: "category", parentId: "a-question" }),
      parentType: "question",
    },

    // Test subcategory parents
    {
      node: mockNode({ id: "t", type: "subcategory", parentId: "c" }),
      parentType: "subcategory",
    },
    {
      node: mockNode({ id: "t", type: "subcategory", parentId: "a-attr" }),
      parentType: "attribute",
    },
    {
      node: mockNode({ id: "t", type: "subcategory", parentId: "a-attr-feat" }),
      parentType: "feature",
    },
    {
      node: mockNode({ id: "t", type: "subcategory", parentId: "a-attr-kpi" }),
      parentType: "kpi",
    },
    {
      node: mockNode({ id: "t", type: "subcategory", parentId: "a-question" }),
      parentType: "question",
    },

    // Test attribute parents
    {
      node: mockNode({ id: "t", type: "attribute", parentId: "a-attr" }),
      parentType: "attribute",
    },
    {
      node: mockNode({ id: "t", type: "attribute", parentId: "a-attr-feat" }),
      parentType: "feature",
    },
    {
      node: mockNode({ id: "t", type: "attribute", parentId: "a-attr-kpi" }),
      parentType: "kpi",
    },
    {
      node: mockNode({ id: "t", type: "attribute", parentId: "a-question" }),
      parentType: "question",
    },

    // Test feature parents
    {
      node: mockNode({ id: "t", type: "feature", parentId: "a" }),
      parentType: "essential-element",
    },
    {
      node: mockNode({ id: "t", type: "feature", parentId: "b" }),
      parentType: "category",
    },
    {
      node: mockNode({ id: "t", type: "feature", parentId: "c" }),
      parentType: "subcategory",
    },
    {
      node: mockNode({ id: "t", type: "feature", parentId: "a-attr-feat" }),
      parentType: "feature",
    },
    {
      node: mockNode({ id: "t", type: "feature", parentId: "a-attr-kpi" }),
      parentType: "kpi",
    },
    {
      node: mockNode({ id: "t", type: "feature", parentId: "a-question" }),
      parentType: "question",
    },

    // Test kpi parents
    {
      node: mockNode({ id: "t", type: "kpi", parentId: "a" }),
      parentType: "essential-element",
    },
    {
      node: mockNode({ id: "t", type: "kpi", parentId: "b" }),
      parentType: "category",
    },
    {
      node: mockNode({ id: "t", type: "kpi", parentId: "c" }),
      parentType: "subcategory",
    },
    {
      node: mockNode({ id: "t", type: "kpi", parentId: "a-attr-kpi" }),
      parentType: "kpi",
    },
    {
      node: mockNode({ id: "t", type: "kpi", parentId: "a-question" }),
      parentType: "question",
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
  const node = mockNode({ id: "b", type: "category", parentId: "c" });
  if ("parentId" in node) {
    expect(
      Array.from(
        validateModelHierarchy({
          nodes: [node],
        })
      )
    ).toStrictEqual([new ParentReferenceError(node)]);
  } else {
    throw new Error("Missing parentId in test node");
  }
});
