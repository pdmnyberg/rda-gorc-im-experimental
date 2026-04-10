import React from "react";
import { ModelDefinition } from "../modules/LayeredModel";

export const ModelContext = React.createContext<ModelDefinition | null>(null)

export function useModel(): ModelDefinition {
    const modelDefinition = React.useContext(ModelContext);
    if (modelDefinition === null) {
        throw new Error("No model available");
    }
    return modelDefinition;
}