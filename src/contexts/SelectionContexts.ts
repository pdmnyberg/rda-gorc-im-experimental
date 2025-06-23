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
    null
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
  const actionRef = React.useRef<unknown>(null);

  const setModelCallback = React.useCallback(
    async (
      m: BaseModel,
      repo: RepositorySource | null = repository,
      scope: unknown = undefined
    ) => {
      if (!actionRef.current || actionRef.current === scope) {
        actionRef.current = setModelCallback;
        try {
          if (!m || !repo) throw "Missing model or repo";
          setModel(m);
          const [_profiles, _slices] = await Promise.all([
            repo.getProfiles(m),
            repo.getThematicSlices(m),
          ]);
          setProfiles(_profiles);
          setSlices(_slices);
          setSelectedProfiles(resetArray);
          setSelectedSlices(resetArray);
        } catch (e) {
          console.warn(String(e));
          setRepository(repo);
          setProfiles(resetArray);
          setSlices(resetArray);
          setSelectedProfiles(resetArray);
          setSelectedSlices(resetArray);
        }
        actionRef.current = null;
      }
    },
    [repository, model]
  );

  const setRepositoryCallback = React.useCallback(
    async (repo: RepositorySource) => {
      if (repo !== repository && !actionRef.current) {
        actionRef.current = setRepositoryCallback;
        try {
          const [_models] = await Promise.all([repo.getBaseModels()]);
          const _model = _models[0] || null;
          setRepository(repo);
          setModels(_models);
          await setModelCallback(_model, repo, setRepositoryCallback);
        } catch (e) {
          console.warn(String(e));
          setRepository(repo);
          setModel(null);
          setModels(resetArray);
          setProfiles(resetArray);
          setSlices(resetArray);
          setSelectedProfiles(resetArray);
          setSelectedSlices(resetArray);
        }
        actionRef.current = null;
      }
    },
    [repository, model]
  );

  React.useEffect(() => {
    setRepositoryCallback(repositories[0]);
  }, [repositories]);

  return [
    [repository, repositories, setRepositoryCallback],
    [model, models, setModelCallback],
    [selectedProfiles, profiles, setSelectedProfiles],
    [selectedSlices, slices, setSelectedSlices],
  ];
}
