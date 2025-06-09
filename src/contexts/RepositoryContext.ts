import React from "react";
import { RepositorySource } from "../modules/RepositorySource";

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
        ...repos.filter(r => r.id !== repo.id),
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
    () => {
      return {
        getRepositories,
        addRepository,
        removeRepository
      }
    },
    [getRepositories, addRepository, removeRepository]
  );
}
