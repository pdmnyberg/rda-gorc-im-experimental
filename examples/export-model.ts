import {models, profiles, slices} from "./example-models";
import {Package, ModelDefinition, ModelLayerDefinition} from "../src/modules/LayeredModel";
import {RepositoryRoot} from "../src/modules/RepositorySource";
import {ErrorGroup, chain, validateRelations, validateModelHierarchy, validateProfile, validateThematicSlice, validateUniqueIds} from "../src/modules/Validation";
import fs from "node:fs";

function main() {
    const repoId = "example-repo";
    const urlRootPath = `repos/${repoId}`;
    const rootPath = `public/${urlRootPath}`;
    const relativeCssPath = process.env.APP_RELATIVE_CSS_PATH || "";

    const errors = [
        ErrorGroup.from(validateRelations(Object.values(models), Object.values(profiles), Object.values(slices)), "validateModel"),
        ErrorGroup.from(chain(Object.values(models).map(m => validateUniqueIds(m.nodes))), "validateNodeIds"),
        ErrorGroup.from(chain(Object.values(models).map(m => validateModelHierarchy(m))), "validateModels"),
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

    exportPackages(`${rootPath}/models`, mapObject(models, (m) => updateIcons(m, relativeCssPath)));
    exportPackages(`${rootPath}/profiles`, mapObject(profiles, (p) => updateIcons(p, relativeCssPath)));
    exportPackages(`${rootPath}/slices`, slices);
    const repoRoot: RepositoryRoot = {
        id: repoId,
        name: "Example Repo",
        description: "This is an example repo",
        url: `${urlRootPath}/root.json`,
        baseModels: Object.values(models).map(m => ({ref: `${urlRootPath}/models/${m.id}.json`})),
        profiles: Object.values(profiles).map(p => ({ref: `${urlRootPath}/profiles/${p.id}.json`, modelId: p.modelId})),
        thematicSlices: Object.values(slices).map(s => ({ref: `${urlRootPath}/slices/${s.id}.json`, modelId: s.modelId})),
    }
    fs.mkdirSync(rootPath, {recursive: true});
    fs.writeFileSync(`${rootPath}/root.json`, JSON.stringify(repoRoot));
}

function updateIcons<T extends ModelDefinition | ModelLayerDefinition>(model: T, relativeCssPath: string = ""): T {
    return {
        ...model,
        nodes: model.nodes.map(node => {
            if (node.icon) {
                return {
                    ...node,
                    icon: `${relativeCssPath}${node.icon}`
                }
            } else {
                return node
            }
        })
    }
}

function mapObject<T, OT>(item: Record<string, T>, func: (v: T) => OT): Record<string, OT> {
    return Object.keys(item).reduce<Record<string, OT>>((acc, key) => {
        const value = item[key]
        acc[key] = func(value);
        return acc;
    }, {})
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
