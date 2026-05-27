import React from "react";
import { RepositorySource } from "../modules/RepositorySource";

type OptionalIndicator = {
  isOptional?: boolean;
};

export interface RepositoryManager {
  getRepositories(): (RepositorySource & OptionalIndicator)[];
  addRepository(repo: RepositorySource & OptionalIndicator): void;
  removeRepository(repo: Pick<RepositorySource, "id">): void;
}

export const RepositoryContext = React.createContext<RepositoryManager>({
  getRepositories: () => [],
  addRepository: () => {},
  removeRepository: () => {},
});

export function useRepositoryManager(
  repositories: (RepositorySource & OptionalIndicator)[]
): RepositoryManager {
  const getRepositories = React.useCallback(() => repositories, [repositories]);
  const addRepository = React.useCallback(
    () => {},
    []
  );
  const removeRepository = React.useCallback(
    () => {},
    []
  );
  return React.useMemo(() => {
    return {
      getRepositories,
      addRepository,
      removeRepository,
    };
  }, [getRepositories, addRepository, removeRepository]);
}
