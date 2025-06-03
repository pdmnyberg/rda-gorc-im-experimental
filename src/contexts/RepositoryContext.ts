import React from "react";
import { RepositorySource, RepositoryInfo } from "../modules/RepositorySource";
import { BaseModel, ModelProfile, ThematicSlice } from "../modules/LayeredModel";

type OptionalIndicator = {
  isOptional?: boolean;
}

export interface RepositoryManager {
  getRepositories(): (RepositorySource & OptionalIndicator)[];
  addRepository(repo: RepositorySource & OptionalIndicator): void;
  removeRepository(repo: Pick<RepositorySource, "id">): void;
}

export const RepositoryContext = React.createContext<RepositoryManager>({
  getRepositories: () => [],
  addRepository: () => { },
  removeRepository: () => { },
});

export function createRepositoryManager(initialRepos: (RepositorySource & OptionalIndicator)[]): RepositoryManager {
  const [repositories, setRepositories] = React.useState(initialRepos);

  const getRepositories = React.useCallback(() => repositories, [repositories]);
  const addRepository = React.useCallback((repo: RepositorySource & OptionalIndicator) => {
    setRepositories((repos) => {
      return [
        ...repos,
        repo
      ]
    });
  }, [setRepositories]);
  const removeRepository = React.useCallback((repo: Pick<RepositorySource, "id">) => {
    setRepositories((repos) => {
      return repos.filter(r => r.id !== repo.id)
    })
  }, [setRepositories]);
  return React.useMemo(
    () => ({
      getRepositories,
      addRepository,
      removeRepository
    }),
    [getRepositories, addRepository, removeRepository]
  );
}

export function useRepositoryContext() {
  const context = React.useContext(RepositoryContext);
  return context;
}

export function useRepositoryModel(repo: RepositorySource | null): [
  BaseModel | null,
  RepositoryInfo | null,
  BaseModel[],
  ModelProfile[],
  ThematicSlice[],
  React.Dispatch<React.SetStateAction<BaseModel | null>>
] {
  const [model, setModel] = React.useState<BaseModel | null>(null);
  const [models, setModels] = React.useState<BaseModel[]>([]);
  const [profiles, setProfiles] = React.useState<ModelProfile[]>([]);
  const [slices, setSlices] = React.useState<ThematicSlice[]>([]);
  const info = repo ? repo.getInfo() : null;

  React.useEffect(() => {
    if (repo !== null) {
      const _repo = repo;
      async function fetchData(){
        const [
          _models,
        ] = await Promise.all([
          _repo.getBaseModels(),
        ])
        setModels(_models);
      };
      fetchData();
    }
  }, [repo, setModel]);

  React.useEffect(() => {
    if (repo && model) {
      const _repo = repo;
      const _model = model;
      async function fetchData(){
        const [
          _profiles,
          _slices,
        ] = await Promise.all([
          _repo.getProfiles(_model),
          _repo.getThematicSlices(_model),
        ])
        setProfiles(_profiles);
        setSlices(_slices);
      };
      fetchData();
    }
  }, [repo, model, setProfiles, setSlices])

  return [
    model,
    info,
    models,
    profiles,
    slices,
    setModel,
  ]
}
