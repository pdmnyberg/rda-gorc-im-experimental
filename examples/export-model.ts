import {models, profiles, slices} from "./example-models";
import {Package} from "../src/modules/LayeredModel";
import {RepositoryRoot} from "../src/modules/RepositorySource";
import {ErrorGroup, chain, validateRelations, validateModel, validateProfile, validateThematicSlice, validateUniqueIds} from "../src/modules/Validation";
import fs from "node:fs";

function main() {
    const repoId = "example-repo";
    const rootPath = `public/${repoId}`;

    const errors = [
        ErrorGroup.from(validateRelations(Object.values(models), Object.values(profiles), Object.values(slices)), "validateModel"),
        ErrorGroup.from(chain(Object.values(models).map(m => validateUniqueIds(m.nodes))), "validateNodeIds"),
        ErrorGroup.from(chain(Object.values(models).map(m => validateModel(m))), "validateModels"),
        ErrorGroup.from(chain(Object.values(models).map(m => chain(Object.values(profiles).filter(p => p.modelId === m.id).map(p => validateProfile(m, p))))), "validateProfiles"),
        ErrorGroup.from(chain(Object.values(models).map(m => chain(Object.values(slices).filter(p => p.modelId === m.id).map(p => validateThematicSlice(m, p))))), "validateSlices"),
        ErrorGroup.from(validateUniqueIds(Object.values(models)), "validateModelIds"),
        ErrorGroup.from(validateUniqueIds(Object.values(profiles)), "validateProfileIds"),
        ErrorGroup.from(validateUniqueIds(Object.values(slices)), "validateSliceIds"),
    ].filter(e => !!e);

    if (errors.length > 0) {
        for (const error of errors) {
            console.log(error.toString())
        }
        return;
    }

    exportPackages(`${rootPath}/models`, models);
    exportPackages(`${rootPath}/profiles`, profiles);
    exportPackages(`${rootPath}/slices`, slices);
    const repoRoot: RepositoryRoot = {
        id: repoId,
        name: "Example Repo",
        description: "This is an example repo",
        url: `${repoId}/root.json`,
        baseModels: Object.values(models).map(m => ({ref: `${repoId}/models/${m.id}.json`})),
        profiles: Object.values(profiles).map(p => ({ref: `${repoId}/profiles/${p.id}.json`, modelId: p.modelId})),
        thematicSlices: Object.values(slices).map(s => ({ref: `${repoId}/slices/${s.id}.json`, modelId: s.modelId})),
    }
    fs.mkdirSync(rootPath, {recursive: true});
    fs.writeFileSync(`${rootPath}/root.json`, JSON.stringify(repoRoot));
}

function exportPackages<T extends Package>(rootPath: string, packages: {[x: string]: T}) {
    fs.mkdirSync(rootPath, {recursive: true});
    for (const packageKey of Object.keys(packages)) {
        const pkg = packages[packageKey];
        const data = JSON.stringify(pkg, undefined, "  ");
        const outputFile = `${rootPath}/${pkg.id}.json`
        console.log(pkg.id, outputFile);
        fs.writeFileSync(outputFile, data);
    }
}

main()
