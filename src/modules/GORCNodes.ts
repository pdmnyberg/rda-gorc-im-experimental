export type GORCNode =
  | EssentialElement
  | Category
  | Subcategory
  | Attribute
  | Feature
  | KPI;

export type EssentialElement = IdentifiableEntity & {
  type: "essential-element";
};

export type Category = IdentifiableEntity & Child & { type: "category" };

export type Subcategory = IdentifiableEntity & Child & { type: "subcategory" };

export type Attribute = IdentifiableEntity & Child & { type: "attribute" };

export type Feature = IdentifiableEntity & Child & { type: "feature" };

export type KPI = IdentifiableEntity & {
  type: "kpi";
  measurementOf: NodeId[];
  indicatorOf: NodeId[];
};

type IdentifiableEntity = {
  id: NodeId;
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

type Child = {
  childOf: NodeId;
}

type Source = {
  name: string;
  url: string;
};

type ConsiderationLevel = "core" | "desirable" | "optional";

type Implementation = unknown;

export type NodeId = string;

export type QuestionId = string;
