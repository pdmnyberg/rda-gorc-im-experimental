import React, { useContext } from "react";
import { RepositorySource } from "../modules/RepositorySource";
import {
  BaseModel,
  ModelProfile,
  ThematicSlice,
} from "../modules/LayeredModel";
import { RepositoryManager } from "./RepositoryContext";
import { useSettings, SettingsData } from "../contexts/SettingsContext";
import { GORCNode } from "../modules/GORCNodes";

type SelectionManager<T, S = T, D = null> = [
  S | D,
  T[],
  (selection: S) => void,
];
type MultiSelectionManager<T> = SelectionManager<T, T[], T[]>;

export const NodeSelectionManager = React.createContext<
  SelectionManager<GORCNode, GORCNode | null>
>([null, [], () => {console.log("Bad manager")}]);

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

export function useSelected<T, S, D>(
  context: React.Context<SelectionManager<T, S, D>>
) {
  const allItems = React.useContext(context);
  return allItems[0];
}

type SelectionState = {
  repositories: RepositorySource[];
  models: BaseModel[];
  profiles: ModelProfile[];
  slices: ThematicSlice[];
  repository: RepositorySource | null;
  model: BaseModel | null;
  selectedProfiles: ModelProfile[];
  selectedSlices: ThematicSlice[];
};

async function fetchSelectionState(
  repositories: RepositorySource[],
  { repositoryId, modelId, profileIds, sliceIds }: SettingsData
): Promise<SelectionState> {
  const nextRepository =
    repositories.filter((r) => r.id === repositoryId)[0] || null;
  try {
    if (nextRepository) {
      const [nextModels, nextProfiles, nextSlices] = await Promise.all([
        nextRepository.getBaseModels(),
        modelId
          ? nextRepository.getProfiles({ id: modelId })
          : Promise.resolve([]),
        modelId
          ? nextRepository.getThematicSlices({ id: modelId })
          : Promise.resolve([]),
      ]);
      const nextModel = nextModels.filter((m) => m.id === modelId)[0];
      const nextSelectedProfiles = nextProfiles.filter((p) =>
        profileIds.has(p.id)
      );
      const nextSelectedSlices = nextSlices.filter((p) => sliceIds.has(p.id));
      return {
        repositories: repositories,
        models: nextModels,
        profiles: nextProfiles,
        slices: nextSlices,
        repository: nextRepository || null,
        model: nextModel || null,
        selectedProfiles: nextSelectedProfiles,
        selectedSlices: nextSelectedSlices,
      };
    }
  } catch (e) {
    console.warn("Failed to get next selection state.");
    console.warn(e);
  }

  return {
    repositories: repositories,
    models: [],
    profiles: [],
    slices: [],
    repository: nextRepository || null,
    model: null,
    selectedProfiles: [],
    selectedSlices: [],
  };
}

export function useModelSelectionManagers(
  repositoryManager: RepositoryManager
): [
  SelectionManager<RepositorySource>,
  SelectionManager<BaseModel>,
  MultiSelectionManager<ModelProfile>,
  MultiSelectionManager<ThematicSlice>,
] {
  const { repositoryId, modelId, profileIds, sliceIds, update } = useSettings();
  const actionRef = React.useRef<unknown>(null);

  const [state, setState] = React.useState<SelectionState>({
    repositories: [],
    models: [],
    profiles: [],
    slices: [],
    repository: null,
    model: null,
    selectedProfiles: [],
    selectedSlices: [],
  });

  React.useEffect(() => {
    const updateState = async () => {
      const repositories = repositoryManager.getRepositories();
      const nextState = await fetchSelectionState(repositories, {
        repositoryId,
        modelId,
        profileIds,
        sliceIds,
      });
      if (actionRef.current === updateState) {
        setState(nextState);
      }
    };
    actionRef.current = updateState;
    updateState();
  }, [
    repositoryManager,
    repositoryId,
    modelId,
    profileIds,
    sliceIds,
    setState,
  ]);

  return [
    [
      state.repository,
      state.repositories,
      (r) => {
        update({
          repositoryId: r.id,
          modelId: undefined,
          profileIds: new Set(),
          sliceIds: new Set(),
        })
        console.log(r.id)
      },
    ],
    [
      state.model,
      state.models,
      (m) =>
        update({ modelId: m.id, profileIds: new Set(), sliceIds: new Set() }),
    ],
    [
      state.selectedProfiles,
      state.profiles,
      (ps) => update({ profileIds: new Set(ps.map((p) => p.id)) }),
    ],
    [
      state.selectedSlices,
      state.slices,
      (ss) => update({ sliceIds: new Set(ss.map((s) => s.id)) }),
    ],
  ];
}

export function useNodeSelectionManager() {
  const [selectedNode, setSelectedNode] = React.useState<GORCNode | null>(null);
  const selectionManager = React.useMemo<SelectionManager<GORCNode, GORCNode | null>>(() => {
    return [
      selectedNode,
      [],
      setSelectedNode
    ]
  }, [selectedNode, setSelectedNode]);
  return selectionManager;
}


export function useNodeSelection(): [GORCNode | null, (selection: GORCNode | null) => void] {
  const manager = useContext(NodeSelectionManager);
  return [manager[0], manager[2]]
}