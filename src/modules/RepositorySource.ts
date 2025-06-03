import { BaseModel, ModelProfile, ThematicSlice } from "../modules/LayeredModel";

export type RepositoryInfo = {
  id: string;
  name: string;
  description?: string;
  url?: string;
}

export interface RepositorySource {
  id: string;
  info: RepositoryInfo;
  getBaseModels(): Promise<BaseModel[]>;
  getProfiles(baseModel?: Pick<BaseModel, "id">): Promise<ModelProfile[]>;
  getThematicSlices(baseModel?: Pick<BaseModel, "id">): Promise<ThematicSlice[]>
}

export class StaticRepositorySource implements RepositorySource {
  private _info: RepositoryInfo;
  private _models: BaseModel[];
  private _profiles: ModelProfile[];
  private _slices: ThematicSlice[];

  constructor(info: RepositoryInfo, models: BaseModel[], profiles: ModelProfile[], slices: ThematicSlice[]) {
    this._info = info;
    this._models = models;
    this._profiles = profiles;
    this._slices = slices;
  }

  get id() {
    return this._info.id;
  }

  get info() {
    return this._info;
  }
  async getBaseModels() {
    return [...this._models];
  }
  async getProfiles(baseModel?: Pick<BaseModel, "id">) {
    return baseModel ? this._profiles.filter(p => p.modelId == baseModel.id) : [...this._profiles];
  }
  async getThematicSlices(baseModel?: Pick<BaseModel, "id">) {
    return baseModel ? this._slices.filter(p => p.modelId == baseModel.id) : [...this._slices];
  }
}
