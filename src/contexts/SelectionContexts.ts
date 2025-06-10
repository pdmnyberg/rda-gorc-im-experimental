import React from "react";
import { RepositorySource } from "../modules/RepositorySource";
import {
  BaseModel,
  ModelProfile,
  ThematicSlice,
} from "../modules/LayeredModel";
import { RepositoryManager } from "./RepositoryContext";

type SelectionManager<T, S = T, D = null> = [
  S | D,
  T[],
  (selection: S) => void,
];
type MultiSelectionManager<T> = SelectionManager<T, T[], T[]>;

export const RepositorySelectionContext = React.createContext<
  SelectionManager<RepositorySource>
>([null, [], () => {}]);

export const ModelSelectionContext = React.createContext<
  SelectionManager<BaseModel>
>([null, [], () => {}]);

export const ProfileSelectionContext = React.createContext<
  MultiSelectionManager<ModelProfile>
>([[], [], () => {}]);

export const SliceSelectionContext = React.createContext<
  MultiSelectionManager<ThematicSlice>
>([[], [], () => {}]);

function resetArray<T>(prev: T[]) {
  return prev.length === 0 ? prev : [];
}

export function useSelected<T, S, D>(
  context: React.Context<SelectionManager<T, S, D>>
) {
  const [selected, ..._rest] = React.useContext(context);
  return selected;
}

export function useModelSelectionManagers(
  repositoryManager: RepositoryManager
): [
  SelectionManager<RepositorySource>,
  SelectionManager<BaseModel>,
  MultiSelectionManager<ModelProfile>,
  MultiSelectionManager<ThematicSlice>,
] {
  const repositories = repositoryManager.getRepositories();
  const [repository, setRepository] = React.useState<RepositorySource | null>(
    repositories[0] || null
  );
  const [model, setModel] = React.useState<BaseModel | null>(null);
  const [models, setModels] = React.useState<BaseModel[]>([]);
  const [selectedProfiles, setSelectedProfiles] = React.useState<
    ModelProfile[]
  >([]);
  const [profiles, setProfiles] = React.useState<ModelProfile[]>([]);
  const [selectedSlices, setSelectedSlices] = React.useState<ThematicSlice[]>(
    []
  );
  const [slices, setSlices] = React.useState<ThematicSlice[]>([]);
  const removeRepository = repositoryManager.removeRepository;

  React.useEffect(() => {
    if (repository !== null) {
      const _repo = repository;
      async function fetchData() {
        try {
          const [_models] = await Promise.all([_repo.getBaseModels()]);
          setModels(_models);
          setModel(_models[0] || null);
          setProfiles(resetArray);
          setSlices(resetArray);
          setSelectedProfiles(resetArray);
          setSelectedSlices(resetArray);
        } catch (e) {
          setRepository(null);
          setModels(resetArray);
          setModel(null);
          setProfiles(resetArray);
          setSlices(resetArray);
          removeRepository(_repo);
          console.log(e);
        }
      }
      fetchData();
    }
  }, [
    repository,
    removeRepository,
    setRepository,
    setModel,
    setModels,
    setProfiles,
    setSlices,
    setSelectedProfiles,
    setSelectedSlices,
  ]);

  React.useEffect(() => {
    if (repository && model) {
      const _repo = repository;
      const _model = model;
      async function fetchData() {
        try {
          const [_profiles, _slices] = await Promise.all([
            _repo.getProfiles(_model),
            _repo.getThematicSlices(_model),
          ]);
          setProfiles(_profiles);
          setSlices(_slices);
          setSelectedProfiles(resetArray);
          setSelectedSlices(resetArray);
        } catch (e) {
          setRepository(null);
          setModels(resetArray);
          setModel(null);
          setProfiles(resetArray);
          setSlices(resetArray);
          removeRepository(_repo);
          console.log(e);
        }
      }
      fetchData();
    }
  }, [
    repository,
    model,
    removeRepository,
    setRepository,
    setProfiles,
    setSlices,
    setSelectedProfiles,
    setSelectedSlices,
  ]);

  return [
    [repository, repositories, setRepository],
    [model, models, setModel],
    [selectedProfiles, profiles, setSelectedProfiles],
    [selectedSlices, slices, setSelectedSlices],
  ];
}
