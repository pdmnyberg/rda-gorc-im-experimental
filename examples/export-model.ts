import {models, profiles, slices} from "./example-models";
import {Package} from "../src/modules/LayeredModel";
import {RepositoryRoot} from "../src/modules/RepositorySource";
import fs from "node:fs";

function main() {
    const repoId = "example-repo";
    const rootPath = `public/${repoId}`;
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
