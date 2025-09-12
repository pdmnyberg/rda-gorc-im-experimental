export type GORCNode =
  | EssentialElement
  | Category
  | Subcategory
  | Attribute
  | Feature
  | KPI;

export type EssentialElement = Omit<IdentifiableEntity, "parentId"> & {
  type: "essential-element";
};

export type Category = IdentifiableEntity & { type: "category" };

export type Subcategory = IdentifiableEntity & { type: "subcategory" };

export type Attribute = IdentifiableEntity & { type: "attribute" };

export type Feature = IdentifiableEntity & { type: "feature" };

export type KPI = IdentifiableEntity & { type: "kpi" };

export type QuestionNode = {
  type: "question";
  id: NodeId;
  parentId: NodeId;
  text: string;
  description: string;
};

type IdentifiableEntity = {
  id: NodeId;
  parentId: NodeId;
  icon?: string;
  name: string;
  shortName?: string;
  description: string;
  shortDescription?: string;
  examples?: string[];
  sources?: Source[];
  considerationLevel: ConsiderationLevel;
  implementation?: Implementation;
};

type Source = {
  name: string;
  url: string;
};

type ConsiderationLevel = "core" | "desirable" | "optional";

type Implementation = unknown;

export type NodeId = string;

export type QuestionId = string;
