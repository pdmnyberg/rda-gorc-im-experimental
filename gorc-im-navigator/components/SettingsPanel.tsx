import React from "react";
import {
  MultiSelect,
  SingleSelect,
  SelectItem,
} from "./MultiSelect";
import { Package } from "../modules/LayeredModel";
import {
  RepositorySelectionContext,
  ModelSelectionContext,
  ProfileSelectionContext,
  SliceSelectionContext,
} from "../contexts/SelectionContexts";
import { RepositorySource } from "../modules/RepositorySource";
import { KMPackager } from "../modules/DSWExport/export";
import { Button } from "./Button";

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
    model
      ? () => {
          const updatedAt = model.updatedAt ? new Date(model.updatedAt) : new Date();
          const packager = new KMPackager(updatedAt)
          const knowledgeModel = packager.createBundle(
            model,
            selectedSlices,
            selectedProfiles,
            "rda"
          )
          const createdAt = updatedAt.toISOString();
          downloadData(
            JSON.stringify(knowledgeModel, undefined, "  "),
            "application/json",
            `${knowledgeModel.id.replace(/:/g, "-")}-${createdAt}.json`
          );
        }
      : null;

  return (
    <>
      <h6>Select repository</h6>
      <form className="mb-3">
        <SingleSelect
          items={repositoryItems}
          selection={repository ? repository.id : undefined}
          onChange={setRepositoryId}
          variant="wide-info"
          noItemsText="No repositories available"
          disabled={repository?.isActive}
        />
      </form>
      <h6>Select model</h6>
      <form className="mb-3">
        <SingleSelect
          items={modelItems}
          selection={model ? model.id : undefined}
          onChange={setModelId}
          noItemsText="No models available in this repository"
        />
      </form>
      <h6>Select profiles</h6>
      <form className="mb-3">
        <MultiSelect
          items={profileItems}
          selection={profileIds}
          onChange={setProfileIds}
          noItemsText="No profiles available for this model"
        />
      </form>
      <h6>Select slices</h6>
      <form className="mb-3">
        <MultiSelect
          items={sliceItems}
          selection={sliceIds}
          onChange={setSliceIds}
          noItemsText="No slices available for this model"
        />
      </form>
      <hr />
      <h6>Exports</h6>
      <form>
        {doExport ? (
          <Button onClick={doExport} label={`Export ${model?.label}`} />
        ) : (
          <></>
        )}
      </form>
    </>
  );
};
