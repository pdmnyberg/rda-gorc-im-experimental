import React from "react";
import { MultiSelect, SingleSelect, SelectItem } from "./MultiSelect/MultiSelect";
import { Package } from "../modules/LayeredModel.ts"
import {
  RepositorySelectionContext,
  ModelSelectionContext,
  ProfileSelectionContext,
  SliceSelectionContext,
} from "../contexts/SelectionContexts.ts"

function packageToSelectItem(p: Package): SelectItem {
  return {
    id: p.id,
    label: p.label,
    info: p.version
  }
}

export const SettingsPanel = () => {
  const [repository, repositories, setRepository] = React.useContext(RepositorySelectionContext);
  const [model, models, setModel] = React.useContext(ModelSelectionContext);
  const [selectedProfiles, profiles, setSelectedProfiles] = React.useContext(ProfileSelectionContext);
  const [selectedSlices, slices, setSelectedSlices] = React.useContext(SliceSelectionContext);

  const setProfileIds = React.useCallback((profileIds: string[]) => {
    setSelectedProfiles(profiles.filter(p => profileIds.includes(p.id)))
  }, [profiles, setSelectedProfiles]);
  const setSliceIds = React.useCallback((sliceIds: string[]) => {
    setSelectedSlices(slices.filter(s => sliceIds.includes(s.id)))
  }, [slices, setSelectedSlices]);
  const setModelId = React.useCallback((modelId: string) => {
    const selectedModel = models.filter(m => m.id === modelId)[0];
    if (selectedModel) {
      setModel(selectedModel);
    }
  }, [models, setModel]);
  const setRepositoryId = React.useCallback((repoId: string) => {
    const nextRepo = repositories.filter(r => r.id === repoId)[0];
    if (nextRepo) {
      setRepository(nextRepo);
    }
  }, [repositories, setRepository]);

  const modelItems = models.map(packageToSelectItem);
  const repositoryItems = repositories.map(repo => ({
    id: repo.id,
    label: repo.info.name,
    info: repo.info.url || "Local source"
  }));
  const profileItems = profiles.map(packageToSelectItem);
  const sliceItems = slices.map(packageToSelectItem);
  const profileIds = selectedProfiles.map(p => p.id)
  const sliceIds = selectedSlices.map(s => s.id);

  return (
    <>
      <h2>Select repository</h2>
      <SingleSelect items={repositoryItems} selection={repository ? repository.id : undefined} onChange={setRepositoryId} />
      <h2>Select model</h2>
      <SingleSelect items={modelItems} selection={model ? model.id : undefined} onChange={setModelId} />
      <h2>Select profiles</h2>
      <MultiSelect items={profileItems} selection={profileIds} onChange={setProfileIds} />
      <h2>Select slices</h2>
      <MultiSelect items={sliceItems} selection={sliceIds} onChange={setSliceIds} />
    </>
  )
}
