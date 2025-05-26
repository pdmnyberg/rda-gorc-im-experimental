import {models, profiles} from "./example-models";
import {Package} from "../src/modules/LayeredModel";
import fs from "node:fs";

function main() {
    const rootPath = "dist-examples";
    exportPackages(`${rootPath}/models`, models);
    exportPackages(`${rootPath}/profiles`, profiles);
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
