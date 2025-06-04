import React from "react";
import { RepositorySource } from "../modules/RepositorySource";
import { BaseModel, ModelProfile, ThematicSlice } from "../modules/LayeredModel";
import { RepositoryManager } from "./RepositoryContext";

type SingleSelectionManager<T> = [T | null, T[], (selection: T) => void]
type MultiSelectionManager<T> = [T[], T[], (selection: T[]) => void]

export const RepositorySelectionContext = React.createContext<SingleSelectionManager<RepositorySource>>([null, [], () => {}]);

export const ModelSelectionContext = React.createContext<SingleSelectionManager<BaseModel>>([null, [], () => {}]);

export const ProfileSelectionContext = React.createContext<MultiSelectionManager<ModelProfile>>([[], [], () => {}]);

export const SliceSelectionContext = React.createContext<MultiSelectionManager<ThematicSlice>>([[], [], () => {}]);

function resetArray<T>(prev: T[]) {
  return prev.length === 0 ? prev : [];
}

export function useSingleSelected<C>(context: React.Context<SingleSelectionManager<C>>) {
  const [selected, ..._rest] = React.useContext(context);
  return selected;
}

export function useMultiSelected<C>(context: React.Context<MultiSelectionManager<C>>) {
  const [selected, ..._rest] = React.useContext(context);
  return selected;
}

export function useRepositories(repositoryManager: RepositoryManager): [
  SingleSelectionManager<RepositorySource>,
  SingleSelectionManager<BaseModel>,
  MultiSelectionManager<ModelProfile>,
  MultiSelectionManager<ThematicSlice>,
] {
  const repositories = repositoryManager.getRepositories();
  const [repository, setRepository] = React.useState<RepositorySource | null>(repositories[0] || null);
  const [model, setModel] = React.useState<BaseModel | null>(null);
  const [models, setModels] = React.useState<BaseModel[]>([]);
  const [selectedProfiles, setSelectedProfiles] = React.useState<ModelProfile[]>([]);
  const [profiles, setProfiles] = React.useState<ModelProfile[]>([]);
  const [selectedSlices, setSelectedSlices] = React.useState<ThematicSlice[]>([]);
  const [slices, setSlices] = React.useState<ThematicSlice[]>([]);

  React.useEffect(() => {
    if (repository !== null) {
      const _repo = repository;
      async function fetchData(){
        const [
          _models,
        ] = await Promise.all([
          _repo.getBaseModels(),
        ])
        setModels(_models);
        setModel(null);
        setProfiles(resetArray);
        setSlices(resetArray);
        setSelectedProfiles(resetArray);
        setSelectedSlices(resetArray)
      };
      fetchData();
    }
  }, [repository, setModel, setModels, setProfiles, setSlices, setSelectedProfiles, setSelectedSlices]);

  React.useEffect(() => {
    if (repository && model) {
      const _repo = repository;
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
        setSelectedProfiles(resetArray);
        setSelectedSlices(resetArray);
      };
      fetchData();
    }
  }, [repository, model, setProfiles, setSlices, setSelectedProfiles, setSelectedSlices]);

  React.useEffect(() => {
    if (model === null && models.length > 0) {
      setModel(models[0]);
    }
  }, [model, models, setModel]);

  return [
    [repository, repositories, setRepository],
    [model, models, setModel],
    [selectedProfiles, profiles, setSelectedProfiles],
    [selectedSlices, slices, setSelectedSlices]
  ]
}
