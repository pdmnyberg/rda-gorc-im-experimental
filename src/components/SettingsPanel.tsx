import React from "react";
import {
  MultiSelect,
  SingleSelect,
  SelectItem,
} from "./MultiSelect/MultiSelect";
import { Package } from "../modules/LayeredModel";
import {
  RepositorySelectionContext,
  ModelSelectionContext,
  ProfileSelectionContext,
  SliceSelectionContext,
} from "../contexts/SelectionContexts";
import { RepositorySource } from "../modules/RepositorySource";
import { KMPackager } from "../modules/DSWExport/export";
import { Button } from "../components/Button/Button";

function packageToSelectItem(p: Package): SelectItem {
  return {
    id: p.id,
    label: p.label,
    info: p.version,
  };
}

function repositoryToSelection(repo: RepositorySource): SelectItem {
  return {
    id: repo.id,
    label: repo.info.name,
    info: repo.info.url || "Local source",
  };
}

function downloadData(data: string, mimeType: string, fileName: string) {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = fileName;
  link.href = url;
  link.click();
  window.URL.revokeObjectURL(url);
}

export const SettingsPanel = () => {
  const [repository, repositories, setRepository] = React.useContext(
    RepositorySelectionContext
  );
  const [model, models, setModel] = React.useContext(ModelSelectionContext);
  const [selectedProfiles, profiles, setSelectedProfiles] = React.useContext(
    ProfileSelectionContext
  );
  const [selectedSlices, slices, setSelectedSlices] = React.useContext(
    SliceSelectionContext
  );

  const setProfileIds = React.useCallback(
    (profileIds: string[]) => {
      setSelectedProfiles(profiles.filter((p) => profileIds.includes(p.id)));
    },
    [profiles, setSelectedProfiles]
  );
  const setSliceIds = React.useCallback(
    (sliceIds: string[]) => {
      setSelectedSlices(slices.filter((s) => sliceIds.includes(s.id)));
    },
    [slices, setSelectedSlices]
  );
  const setModelId = React.useCallback(
    (modelId: string) => {
      const selectedModel = models.filter((m) => m.id === modelId)[0];
      if (selectedModel) {
        setModel(selectedModel);
      }
    },
    [models, setModel]
  );
  const setRepositoryId = React.useCallback(
    (repoId: string) => {
      const nextRepo = repositories.filter((r) => r.id === repoId)[0];
      if (nextRepo) {
        setRepository(nextRepo);
      }
    },
    [repositories, setRepository]
  );

  const modelItems = models.map(packageToSelectItem);
  const repositoryItems = repositories.map(repositoryToSelection);
  const profileItems = profiles.map(packageToSelectItem);
  const sliceItems = slices.map(packageToSelectItem);
  const profileIds = selectedProfiles.map((p) => p.id);
  const sliceIds = selectedSlices.map((s) => s.id);

  const doExport =
    model && repository
      ? () => {
          const packager = new KMPackager()
          const kmId: string = "gorc-im";
          const version: string = "1.0.0";
          const organizationId: string = "rda";
          const knowledgeModel = packager.createPackageBundleObject(
            `Export from GORC RDA: ${repository.info.name}`,
            packager.createKMPackages(
              model,
              slices,
              selectedProfiles,
              repository.info.name,
              kmId,
              version,
              organizationId
            ),
            kmId,
            version,
            organizationId
          );
          const createdAt = new Date().toISOString();
          downloadData(
            JSON.stringify(knowledgeModel, undefined, "  "),
            "application/json",
            `rda-gorc-im-${createdAt}.json`
          );
        }
      : null;

  return (
    <>
      <h2>Select repository</h2>
      <SingleSelect
        items={repositoryItems}
        selection={repository ? repository.id : undefined}
        onChange={setRepositoryId}
        variant="wide-info"
        noItemsText="No repositories available"
        disabled={repository?.isActive}
      />
      <h2>Select model</h2>
      <SingleSelect
        items={modelItems}
        selection={model ? model.id : undefined}
        onChange={setModelId}
        noItemsText="No models available in this repository"
      />
      <h2>Select profiles</h2>
      <MultiSelect
        items={profileItems}
        selection={profileIds}
        onChange={setProfileIds}
        noItemsText="No profiles available for this model"
      />
      <h2>Select slices</h2>
      <MultiSelect
        items={sliceItems}
        selection={sliceIds}
        onChange={setSliceIds}
        noItemsText="No slices available for this model"
      />
      <h2>Exports</h2>
      {doExport ? (
        <Button onClick={doExport} label="Export Base DSW Knowledge Model" />
      ) : (
        <></>
      )}
    </>
  );
};
