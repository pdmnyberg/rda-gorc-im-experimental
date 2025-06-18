import {
  BaseModel,
  ModelProfile,
  ThematicSlice,
} from "../modules/LayeredModel";

export type RepositoryInfo = {
  id: string;
  name: string;
  description?: string;
  url?: string;
};

type DataOrRef<T> = T | { ref: string };

export type RepositoryRoot = RepositoryInfo & {
  baseModels: DataOrRef<BaseModel>[];
  profiles: (DataOrRef<ModelProfile> & Pick<ThematicSlice, "modelId">)[];
  thematicSlices: (DataOrRef<ThematicSlice> & Pick<ThematicSlice, "modelId">)[];
};

export interface RepositorySource {
  id: string;
  info: RepositoryInfo;
  failed?: boolean;
  getBaseModels(): Promise<BaseModel[]>;
  getProfiles(baseModel?: Pick<BaseModel, "id">): Promise<ModelProfile[]>;
  getThematicSlices(
    baseModel?: Pick<BaseModel, "id">
  ): Promise<ThematicSlice[]>;
}

export class StaticRepositorySource implements RepositorySource {
  private _info: RepositoryInfo;
  private _models: BaseModel[];
  private _profiles: ModelProfile[];
  private _slices: ThematicSlice[];

  constructor(
    info: RepositoryInfo,
    models: BaseModel[],
    profiles: ModelProfile[],
    slices: ThematicSlice[]
  ) {
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
    return baseModel
      ? this._profiles.filter((p) => p.modelId == baseModel.id)
      : [...this._profiles];
  }
  async getThematicSlices(baseModel?: Pick<BaseModel, "id">) {
    return baseModel
      ? this._slices.filter((p) => p.modelId == baseModel.id)
      : [...this._slices];
  }
}

async function fetchData<T>(url: string): Promise<T> {
  return await (await fetch(url)).json();
}

export class HttpRepositorySource implements RepositorySource {
  private _root: Pick<RepositoryRoot, "id" | "name"> & { url: string };
  private _cache: Record<string, unknown> = {};

  constructor(info: Pick<RepositoryRoot, "id" | "name"> & { url: string }) {
    this._root = info;
  }

  get id() {
    return (this._getData<RepositoryRoot>(this._root.url) || this._root).id;
  }
  get info() {
    return this._getData<RepositoryRoot>(this._root.url) || this._root;
  }
  async getBaseModels() {
    const info = await this._fetchData<RepositoryRoot>(this._root.url);
    return await Promise.all<BaseModel>(
      info.baseModels.map((m) =>
        "ref" in m ? this._fetchData<BaseModel>(m.ref) : Promise.resolve(m)
      )
    );
  }
  async getProfiles(baseModel?: Pick<BaseModel, "id">) {
    const info = await this._fetchData<RepositoryRoot>(this._root.url);
    const selectedProfiles = baseModel
      ? info.profiles.filter((p) => p.modelId == baseModel.id)
      : info.profiles;
    return await Promise.all<ModelProfile>(
      selectedProfiles.map((m) =>
        "ref" in m ? this._fetchData<ModelProfile>(m.ref) : Promise.resolve(m)
      )
    );
  }
  async getThematicSlices(baseModel?: Pick<BaseModel, "id">) {
    const info = await this._fetchData<RepositoryRoot>(this._root.url);
    const selectedSlices = baseModel
      ? info.thematicSlices.filter((p) => p.modelId == baseModel.id)
      : info.thematicSlices;
    return await Promise.all<ThematicSlice>(
      selectedSlices.map((m) =>
        "ref" in m ? this._fetchData<ThematicSlice>(m.ref) : Promise.resolve(m)
      )
    );
  }

  _getData<T>(url: string): T | undefined {
    return url in this._cache ? (this._cache[url] as T) : undefined;
  }

  async _fetchData<T>(url: string): Promise<T> {
    const result = this._getData<T>(url);
    if (result === undefined) {
      const data = await fetchData<T>(url);
      this._cache[url] = data;
      return data;
    } else {
      return result;
    }
  }
}
