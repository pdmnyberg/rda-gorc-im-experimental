import {
  GORCNode,
  Category,
  Subcategory,
  Feature,
  Attribute,
} from "../GORCNodes";
import { ModelDefinition, ThematicSlice, getModelNodes } from "../LayeredModel";
import { Package, PackageBundle, Event, UUID } from "./types";
import { v5 as uuidv5 } from "uuid";


export class KMPackager {
  private _idTickers: Record<string, number> = {};
  private _namespace = uuidv5("rda-gorc-im", "00000000-0000-0000-0000-000000000000");
  private _uuidSet = new Set<string>()

  createPackageBundleObject(
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

  createKMPackage(
    modelDefintion: ModelDefinition,
    slices: ThematicSlice[],
    name: string,
    kmId: string,
    version: string,
    organizationId: string
  ): Package {
    const createdAt = this.getDateStr();
    const parentUuid = "00000000-0000-0000-0000-000000000000";
    const kmUuid = this.getStableUUID(kmId);
    const nodes = getModelNodes(modelDefintion);
    const mainChapterEvents = nodes
      .filter((node): node is GORCNode => node.type !== "question")
      .filter((node) => !("parentId" in node))
      .reduce<Record<string, Event>>((acc, n) => {
        acc[n.id] = this.eventFromRootNode(n, parentUuid);
        return acc;
      }, {});

    const sliceTags = slices.reduce<
      Record<string, { event: Event; elements: Set<string> }>
    >((acc, slice) => {
      acc[slice.id] = {
        event: this.tagFromSlice(slice, kmUuid),
        elements: new Set(slice.nodes.map((n) => n.nodeId)),
      };
      return acc;
    }, {});

    const categoryQuestions = nodes
      .filter((node): node is Category => node.type === "category")
      .reduce<Record<string, ReturnType<typeof this.eventsFromCategoryNode>>>(
        (acc, node) => {
          acc[node.id] = this.eventsFromCategoryNode(
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
      .reduce<Record<string, ReturnType<typeof this.eventsFromCategoryNode>>>(
        (acc, node) => {
          acc[node.id] = this.eventsFromCategoryNode(
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
      .reduce<Record<string, ReturnType<typeof this.eventsFromCategoryNode>>>(
        (acc, node) => {
          const parentUuid =
            mainChapterEvents[node.parentId]?.entityUuid ||
            categoryQuestions[node.parentId]?.elaborateUuid ||
            subcategoryQuestions[node.parentId]?.elaborateUuid;
          if (parentUuid) {
            acc[node.id] = this.eventsFromCategoryNode(
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
      .reduce<Record<string, ReturnType<typeof this.eventsFromCategoryNode>>>(
        (acc, node) => {
          const parentUuid = attributeQuestions[node.parentId]?.elaborateUuid;
          if (parentUuid) {
            acc[node.id] = this.eventsFromCategoryNode(
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
          uuid: this.getEventUUID(kmId),
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

  protected tagFromSlice(slice: ThematicSlice, parentUuid: UUID): Event {
    const createdAt = this.getDateStr();
    return {
      eventType: "AddTagEvent",
      uuid: this.getEventUUID(slice.id),
      parentUuid: parentUuid,
      entityUuid: this.getStableUUID(slice.id),
      createdAt: createdAt,
      name: slice.label,
      description: null,
      color: "",
      annotations: [],
    };
  }

  protected eventsFromCategoryNode(
    node: Category | Subcategory | Attribute | Feature,
    parentUuid: string,
    tags: UUID[]
  ): {
    elaborateUuid: UUID;
    questionUuid: UUID;
    events: Event[];
  } {
    const createdAt = this.getDateStr();

    const question: Event = {
      annotations: [],
      createdAt: createdAt,
      entityUuid: this.getStableUUID(node.id),
      eventType: "AddQuestionEvent",
      parentUuid: parentUuid,
      questionType: "OptionsQuestion",
      requiredPhaseUuid: null,
      tagUuids: tags,
      text: node.description,
      title: node.name,
      uuid: this.getEventUUID(node.id),
    };

    const standardAnswers = [
      ["Elaborate now", "elaborate-now"],
      ["Elaborate later", "elaborate-later"],
      ["Not relevant", "not-relevant"],
    ].map<Event>(([label, id]) => ({
      eventType: "AddAnswerEvent",
      uuid: this.getEventUUID(node.id + ":" + id),
      parentUuid: question.entityUuid,
      entityUuid: this.getStableUUID(node.id + ":" + id),
      createdAt: createdAt,
      label: label,
      advice: null,
      metricMeasures: [],
      annotations: [],
    }));
    const elaborateUuid = standardAnswers[0].entityUuid;

    const overviewAnswer: Event = {
      eventType: "AddQuestionEvent",
      uuid: this.getEventUUID(node.id + ":elaborate-now:answer"),
      parentUuid: elaborateUuid,
      entityUuid: this.getStableUUID(node.id + ":elaborate-now:answer"),
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

  protected eventFromRootNode(node: GORCNode, parentUuid: string): Event {
    const createdAt = this.getDateStr();
    return {
      annotations: [],
      createdAt: createdAt,
      entityUuid: this.getEventUUID(node.id),
      eventType: "AddChapterEvent",
      parentUuid: parentUuid,
      text: node.description,
      title: node.name,
      uuid: this.getStableUUID(node.id),
    };
  }

  protected getStableUUID(base: string): string {
    return this.registerUUID(uuidv5(base, this._namespace));
  }

  protected getEventUUID(id: string): string {
    const tick = this.getTick(id);
    return this.registerUUID(
      uuidv5(`event-${id}-${tick}`, this._namespace)
    )
  }

  protected registerUUID(uuid: string) {
    if (this._uuidSet.has(uuid)) {
      throw new Error(`Duplicate UUID detected: '${uuid}'`)
    } else {
      this._uuidSet.add(uuid)
    }
    return uuid
  }

  protected getTick(id: string): number {
    return this._idTickers[id] = this._idTickers[id] || 0 + 1;
  }

  protected getDateStr() {
    return new Date().toISOString()
  }
}
