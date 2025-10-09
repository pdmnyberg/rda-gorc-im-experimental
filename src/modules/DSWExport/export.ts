import {
  GORCNode,
  Category,
  Subcategory,
  Feature,
  Attribute,
} from "../GORCNodes";
import { ModelDefinition, ModelLayerDefinition, ThematicSlice, ModelNode, getModelNodes, Nothing, ModelProfile } from "../LayeredModel";
import { Package, PackageBundle, Event, UUID, AddChapterEvent, AddListQuestionEvent, AddItemSelectQuestionEvent, AddAnswerEvent } from "./types";
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

  createKMPackages(
    modelDefinition: ModelDefinition,
    slices: ThematicSlice[],
    profiles: ModelProfile[],
    name: string,
    kmId: string,
    version: string,
    organizationId: string
  ): Package[] {
    const createdAt = this.getDateStr();
    const parentUuid = "00000000-0000-0000-0000-000000000000";
    const kmUuid = this.getStableUUID(kmId);

    const sliceTags = slices.reduce<
      Record<string, { event: Event; elements: Set<string> }>
    >((acc, slice) => {
      acc[slice.id] = {
        event: this.tagFromSlice(slice, kmUuid),
        elements: new Set(slice.nodes.map((n) => n.nodeId)),
      };
      return acc;
    }, {});

    const nodes = getModelNodes(modelDefinition);
    const events = this.eventsFromNodes(
      nodes,
      sliceTags,
      parentUuid,
    )

    const mainPackageId = `${organizationId}:${kmId}:${version}`;
    const profileKmId = [kmId, ...profiles.map(i => i.id)].join("-wp-")
    const profileName = profiles.map(profile => profile.label).join(" and ")
    return [
      {
        createdAt: createdAt,
        forkOfPackageId: null as unknown as undefined,
        id: mainPackageId,
        kmId: kmId,
        license: "Apache 2.0",
        mergeCheckpointPackageId: null as unknown as undefined,
        metamodelVersion: 17,
        name: name,
        nonEditable: false,
        organizationId: organizationId,
        phase: "ReleasedPackagePhase",
        previousPackageId: null as unknown as undefined,
        description: `The base model from repository ${name}`,
        readme: `The base model from repository ${name}`,
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
          ...events,
        ],
      },
      {
        createdAt: createdAt,
        forkOfPackageId: mainPackageId,
        id: `${organizationId}:${profileKmId}:${version}`,
        kmId: profileKmId,
        license: "Apache 2.0",
        mergeCheckpointPackageId: mainPackageId,
        metamodelVersion: 17,
        name: `${name} with profile ${profileName}`,
        nonEditable: false,
        organizationId: organizationId,
        phase: "ReleasedPackagePhase",
        previousPackageId: mainPackageId,
        description: `${name} with applied profiles ${profileName}`,
        readme: `${name} with applied profiles ${profileName}`,
        version: version,
        events: profiles.flatMap(profile => this.eventsFromProfile(
          profile,
          sliceTags,
          kmUuid
        )),
      }
    ];
  }

  protected eventsFromNodes(
    nodes: ModelNode[],
    sliceTags: Record<string, { event: Event; elements: Set<string> }>,
    parentUuid: string
  ): Event[] {
    const mainChapterEvents = nodes
      .filter((node): node is GORCNode => node.type !== "question")
      .filter((node) => !("parentId" in node))
      .reduce<Record<string, Event>>((acc, n) => {
        acc[n.id] = this.eventFromRootNode(n, parentUuid);
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

      return [
        ...Object.values(mainChapterEvents),
        ...Object.values(categoryQuestions).flatMap((d) => d.events),
        ...Object.values(subcategoryQuestions).flatMap((d) => d.events),
        ...Object.values(attributeQuestions).flatMap((d) => d.events),
        ...Object.values(featureQuestions).flatMap((d) => d.events),
      ]
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

  protected eventsFromProfile(
    profile: ModelLayerDefinition,
    sliceTags: Record<string, { event: Event; elements: Set<string> }>,
    parentUuid: string
  ): Event[] {
    const removals = profile.nodes
      .filter((node): node is Nothing => node.type === "nothing")
      .map(node => this.eventFromNothingNode(node, parentUuid));

    const updatedNodes = profile.nodes
      .filter((node): node is GORCNode => node.type !== "question" && node.type !== "nothing")
    
    const baseEvents = this.eventsFromNodes(
      updatedNodes,
      sliceTags,
      parentUuid,
    )

    const updates = baseEvents.filter((event): event is AddChapterEvent | AddListQuestionEvent | AddItemSelectQuestionEvent | AddAnswerEvent => {
      return event.eventType === "AddChapterEvent" || event.eventType === "AddAnswerEvent" || event.eventType === "AddQuestionEvent";
    });

    console.log(removals, updates)

    return [
      ...removals,
      ...updates
    ]
  }

  protected eventFromNothingNode(node: Nothing, parentUuid: string): Event {
    return {
      eventType: "DeleteChapterEvent",
      uuid: this.getEventUUID(node.id),
      entityUuid: this.getStableUUID(node.id),
      parentUuid: parentUuid,
      createdAt: this.getDateStr()
    };
  }

  protected editEventFromAddEvent(
    event: AddChapterEvent | AddListQuestionEvent | AddItemSelectQuestionEvent | AddAnswerEvent
  ): Event {
    switch(event.eventType) {
      case "AddAnswerEvent": {
        return {
          eventType: "EditAnswerEvent",
          uuid: event.uuid,
          parentUuid: event.parentUuid,
          entityUuid: event.entityUuid,
          createdAt: event.createdAt,
          label: {
            changed: true,
            value: event.label, 
          },
          advice: {
            changed: true,
            value: event.advice,
          },
          followUpUuids: {
            changed: false,
          },
          metricMeasures: {
            changed: false,
          },
          annotations: {
            changed: true,
            value: event.annotations,
          }
        }
      }
      case "AddChapterEvent": {
        return {
          annotations: {
            value: event.annotations,
            changed: true,
          },
          createdAt: event.createdAt,
          entityUuid: event.entityUuid,
          eventType: "EditChapterEvent",
          parentUuid: event.parentUuid,
          text: {
            changed: true,
            value: event.text,
          },
          title: {
            changed: true,
            value: event.title
          },
          questionUuids: {
            changed: false,
          },
          uuid: event.uuid,
        }
      }
      case "AddQuestionEvent": {
        return {
          eventType: "EditQuestionEvent",
          uuid: event.uuid,
          parentUuid: event.parentUuid,
          entityUuid: event.entityUuid,
          createdAt: event.createdAt,
          questionType: "OptionsQuestion",
          title: {
            changed: true,
            value: event.title,
          },
          text: {
            changed: true,
            value: event.text,
          },
          requiredPhaseUuid: {
            changed: true,
            value: event.requiredPhaseUuid,
          },
          tagUuids: {
            changed: false,
          },
          expertUuids: {
            changed: false,
          },
          referenceUuids: {
            changed: false,
          },
          answerUuids: {
            changed: false,
          },
          annotations: {
            changed: true,
            value: event.annotations,
          },
        }
      }
    }
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
      entityUuid: this.getStableUUID(node.id),
      eventType: "AddChapterEvent",
      parentUuid: parentUuid,
      text: node.description,
      title: node.name,
      uuid: this.getEventUUID(node.id),
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
      //throw new Error(`Duplicate UUID detected: '${uuid}'`)
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
