import { BaseModel, ModelProfile, ThematicSlice } from "./LayeredModel";
import {
  parseModel,
  parseModelLayer,
  parseModelSlice,
  parsePackage,
  parseRepository,
  GroupedError,
  ErrorGroup,
  chain,
  validateModelHierarchy,
  validateProfile,
  validateThematicSlice,
  validateUniqueIds,
} from "./Validation";

export type RepositoryInfo = {
  id: string;
  name: string;
  description?: string;
  url?: string;
};

type DataOrRef<T> = T | { ref: string };

export type RepositoryRoot = RepositoryInfo & {
  baseModels: DataOrRef<BaseModel>[];
  profiles: (DataOrRef<ModelProfile> & Pick<ModelProfile, "modelId">)[];
  thematicSlices: (DataOrRef<ThematicSlice> & Pick<ThematicSlice, "modelId">)[];
};

type RepositoryStatus = { status: "ok" } | { status: "error"; message: string };

export interface RepositorySource {
  id: string;
  info: RepositoryInfo;
  status: RepositoryStatus;
  isActive: boolean;
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
  private _status: RepositoryStatus;

  constructor(
    info: RepositoryInfo,
    models: BaseModel[],
    profiles: ModelProfile[],
    slices: ThematicSlice[],
    status: RepositoryStatus = { status: "ok" }
  ) {
    this._info = info;
    this._models = models;
    this._profiles = profiles;
    this._slices = slices;
    this._status = status;
  }

  get id() {
    return this._info.id;
  }
  get info() {
    return this._info;
  }
  get status() {
    return this._status;
  }
  get isActive() {
    return this._status.status === "ok";
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
  private _status: RepositoryStatus = { status: "ok" };

  constructor(info: Pick<RepositoryRoot, "id" | "name"> & { url: string }) {
    this._root = info;
  }

  get id() {
    return (this._getData<RepositoryRoot>(this._root.url) || this._root).id;
  }
  get info() {
    return this._getData<RepositoryRoot>(this._root.url) || this._root;
  }
  get status(): RepositoryStatus {
    return this._status;
  }
  get isActive() {
    return this._status.status === "ok";
  }
  async getBaseModels() {
    try {
      const info = await this._fetchData<RepositoryRoot>(
        this._root.url,
        parseRepository
      );
      const models = await Promise.all<BaseModel>(
        info.baseModels.map((m) =>
          "ref" in m
            ? this._fetchData<BaseModel>(m.ref, parsePackage(parseModel))
            : Promise.resolve(m)
        )
      );
      for (const model of models) {
        const error = ErrorGroup.from(
          chain<GroupedError>([
            validateUniqueIds(model.nodes),
            validateModelHierarchy(model),
          ]),
          `validateModel: ${model.id}`
        );

        if (error) {
          throw error;
        }
      }
      return models;
    } catch (e) {
      this._setError(String(e));
      throw e;
    }
  }
  async getProfiles(modelRef?: Pick<BaseModel, "id">) {
    try {
      const info = await this._fetchData<RepositoryRoot>(
        this._root.url,
        parseRepository
      );
      const selectedProfiles = modelRef
        ? info.profiles.filter((p) => p.modelId == modelRef.id)
        : info.profiles;

      const profiles = await Promise.all<ModelProfile>(
        selectedProfiles.map((m) =>
          "ref" in m
            ? this._fetchData<ModelProfile>(
                m.ref,
                parsePackage(parseModelLayer)
              )
            : Promise.resolve(m)
        )
      );
      const modelMap = await this._getModelMap();
      for (const profile of profiles) {
        const model = modelMap[profile.modelId];

        const error = ErrorGroup.from(
          chain<GroupedError>([
            validateUniqueIds(profile.nodes),
            validateProfile(model, profile),
          ]),
          `validateProfile: ${profile.id}`
        );

        if (error) {
          throw error;
        }
      }
      return profiles;
    } catch (e) {
      this._setError(String(e));
      throw e;
    }
  }
  async getThematicSlices(baseModel?: Pick<BaseModel, "id">) {
    try {
      const info = await this._fetchData<RepositoryRoot>(
        this._root.url,
        parseRepository
      );
      const selectedSlices = baseModel
        ? info.thematicSlices.filter((p) => p.modelId == baseModel.id)
        : info.thematicSlices;
      const modelMap = await this._getModelMap();
      const slices = await Promise.all<ThematicSlice>(
        selectedSlices.map((m) =>
          "ref" in m
            ? this._fetchData<ThematicSlice>(
                m.ref,
                parsePackage(parseModelSlice)
              )
            : Promise.resolve(m)
        )
      );
      for (const slice of slices) {
        const model = modelMap[slice.modelId];

        const error = ErrorGroup.from(
          chain<GroupedError>([validateThematicSlice(model, slice)]),
          `validateThematicSlice: ${slice.id}`
        );

        if (error) {
          throw error;
        }
      }
      return slices;
    } catch (e) {
      this._setError(String(e));
      throw e;
    }
  }

  async _getModelMap() {
    const baseModels = await this.getBaseModels();
    return baseModels.reduce<Record<string, BaseModel>>((acc, m) => {
      acc[m.id] = m;
      return acc;
    }, {});
  }

  _setError(message: string) {
    this._status = {
      status: "error",
      message: message,
    };
  }

  _getData<T>(url: string): T | undefined {
    return url in this._cache ? (this._cache[url] as T) : undefined;
  }

  async _fetchData<T>(url: string, parser: (data: unknown) => T): Promise<T> {
    const result = this._getData<T>(url);
    if (result === undefined) {
      const data = await fetchData<T>(url);
      this._cache[url] = parser(data);
      return data;
    } else {
      return result;
    }
  }
}
