import {
  GORCNode,
  Category,
  Subcategory,
  Feature,
  Attribute,
} from "../GORCNodes";
import { ModelDefinition, ThematicSlice, getModelNodes } from "../LayeredModel";
import { Package, PackageBundle, Event, UUID } from "./types";
import { v4 as uuidv4 } from "uuid";

export function createPackageBundleObject(
  name: string,
  packages: Package[],
  kmId: string,
  version: string,
  organizationId: string
): PackageBundle {
  return {
    id: `${organizationId}:${kmId}:${version}`,
    kmId: kmId,
    metamodelVersion: 17,
    name: name,
    organizationId: organizationId,
    version: version,
    packages: packages,
  };
}

export function createKMPackage(
  modelDefintion: ModelDefinition,
  slices: ThematicSlice[],
  name: string,
  kmId: string,
  version: string,
  organizationId: string
): Package {
  const createdAt = new Date().toISOString();
  const parentUuid = "00000000-0000-0000-0000-000000000000";
  const kmUuid = uuidv4();
  const nodes = getModelNodes(modelDefintion);
  const mainChapterEvents = nodes
    .filter((node): node is GORCNode => node.type !== "question")
    .filter((node) => !("parentId" in node))
    .reduce<Record<string, Event>>((acc, n) => {
      acc[n.id] = eventFromRootNode(n, parentUuid);
      return acc;
    }, {});

  const sliceTags = slices.reduce<
    Record<string, { event: Event; elements: Set<string> }>
  >((acc, slice) => {
    acc[slice.id] = {
      event: tagFromSlice(slice, kmUuid),
      elements: new Set(slice.nodes.map((n) => n.nodeId)),
    };
    return acc;
  }, {});

  const categoryQuestions = nodes
    .filter((node): node is Category => node.type === "category")
    .reduce<Record<string, ReturnType<typeof eventsFromCategoryNode>>>(
      (acc, node) => {
        acc[node.id] = eventsFromCategoryNode(
          node,
          mainChapterEvents[node.parentId].entityUuid,
          Object.values(sliceTags)
            .filter((t) => t.elements.has(node.id))
            .map((t) => t.event.entityUuid)
        );
        return acc;
      },
      {}
    );

  const subcategoryQuestions = nodes
    .filter((node): node is Subcategory => node.type === "subcategory")
    .reduce<Record<string, ReturnType<typeof eventsFromCategoryNode>>>(
      (acc, node) => {
        acc[node.id] = eventsFromCategoryNode(
          node,
          categoryQuestions[node.parentId].elaborateUuid,
          Object.values(sliceTags)
            .filter((t) => t.elements.has(node.id))
            .map((t) => t.event.entityUuid)
        );
        return acc;
      },
      {}
    );

  const attributeQuestions = nodes
    .filter((node): node is Attribute => node.type === "attribute")
    .reduce<Record<string, ReturnType<typeof eventsFromCategoryNode>>>(
      (acc, node) => {
        const parentUuid =
          mainChapterEvents[node.parentId]?.entityUuid ||
          categoryQuestions[node.parentId]?.elaborateUuid ||
          subcategoryQuestions[node.parentId]?.elaborateUuid;
        if (parentUuid) {
          acc[node.id] = eventsFromCategoryNode(
            node,
            parentUuid,
            Object.values(sliceTags)
              .filter((t) => t.elements.has(node.id))
              .map((t) => t.event.entityUuid)
          );
        }
        return acc;
      },
      {}
    );

  const featureQuestions = nodes
    .filter((node): node is Feature => node.type === "feature")
    .reduce<Record<string, ReturnType<typeof eventsFromCategoryNode>>>(
      (acc, node) => {
        const parentUuid = attributeQuestions[node.parentId]?.elaborateUuid;
        if (parentUuid) {
          acc[node.id] = eventsFromCategoryNode(
            node,
            parentUuid,
            Object.values(sliceTags)
              .filter((t) => t.elements.has(node.id))
              .map((t) => t.event.entityUuid)
          );
        }
        return acc;
      },
      {}
    );

  return {
    createdAt: createdAt,
    forkOfPackageId: null as unknown as undefined,
    id: `${organizationId}:${kmId}:${version}`,
    kmId: kmId,
    license: "Apache 2.0",
    mergeCheckpointPackageId: null as unknown as undefined,
    metamodelVersion: 17,
    name: name,
    nonEditable: false,
    organizationId: organizationId,
    phase: "ReleasedPackagePhase",
    previousPackageId: null as unknown as undefined,
    description: `This is an export from the repository ${name}`,
    readme: `This is an export from the repository ${name}`,
    version: version,
    events: [
      {
        annotations: [],
        createdAt: createdAt,
        entityUuid: kmUuid,
        eventType: "AddKnowledgeModelEvent",
        parentUuid: parentUuid,
        uuid: uuidv4(),
      },
      ...Object.values(sliceTags).map((t) => t.event),
      ...Object.values(mainChapterEvents),
      ...Object.values(categoryQuestions).flatMap((d) => d.events),
      ...Object.values(subcategoryQuestions).flatMap((d) => d.events),
      ...Object.values(attributeQuestions).flatMap((d) => d.events),
      ...Object.values(featureQuestions).flatMap((d) => d.events),
    ],
  };
}

function tagFromSlice(slice: ThematicSlice, parentUuid: UUID): Event {
  const createdAt = new Date().toISOString();
  return {
    eventType: "AddTagEvent",
    uuid: uuidv4(),
    parentUuid: parentUuid,
    entityUuid: uuidv4(),
    createdAt: createdAt,
    name: slice.label,
    description: null,
    color: "",
    annotations: [],
  };
}

function eventsFromCategoryNode(
  node: Category | Subcategory | Attribute | Feature,
  parentUuid: string,
  tags: UUID[]
): {
  elaborateUuid: UUID;
  questionUuid: UUID;
  events: Event[];
} {
  const createdAt = new Date().toISOString();

  const question: Event = {
    annotations: [],
    createdAt: createdAt,
    entityUuid: uuidv4(),
    eventType: "AddQuestionEvent",
    parentUuid: parentUuid,
    questionType: "OptionsQuestion",
    requiredPhaseUuid: null,
    tagUuids: tags,
    text: node.description,
    title: node.name,
    uuid: uuidv4(),
  };

  const standardAnswers = [
    "Elaborate now",
    "Elaborate later",
    "Not relevant",
  ].map<Event>((label) => ({
    eventType: "AddAnswerEvent",
    uuid: uuidv4(),
    parentUuid: question.entityUuid,
    entityUuid: uuidv4(),
    createdAt: createdAt,
    label: label,
    advice: null,
    metricMeasures: [],
    annotations: [],
  }));
  const elaborateUuid = standardAnswers[0].entityUuid;

  const overviewAnswer: Event = {
    eventType: "AddQuestionEvent",
    uuid: uuidv4(),
    parentUuid: elaborateUuid,
    entityUuid: uuidv4(),
    createdAt: createdAt,
    questionType: "ValueQuestion",
    title: `Overview of ${node.name}`,
    text: "",
    requiredPhaseUuid: null,
    tagUuids: tags,
    valueType: "TextQuestionValueType",
    validations: [],
    annotations: [],
  };
  return {
    elaborateUuid: elaborateUuid,
    questionUuid: question.entityUuid,
    events: [question, ...standardAnswers, overviewAnswer],
  };
}

function eventFromRootNode(node: GORCNode, parentUuid: string): Event {
  const createdAt = new Date().toISOString();
  return {
    annotations: [],
    createdAt: createdAt,
    entityUuid: uuidv4(),
    eventType: "AddChapterEvent",
    parentUuid: parentUuid,
    text: node.description,
    title: node.name,
    uuid: uuidv4(),
  };
}
