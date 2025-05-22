import {models} from "./example-models";
import fs from "node:fs";


function main() {
    const outputRoot = "dist-examples";
    fs.mkdirSync(outputRoot, {recursive: true});

    for (const modelKey of Object.keys(models)) {
        const model = models[modelKey];
        const data = JSON.stringify(model, undefined, "  ");
        const outputFile = `${outputRoot}/${model.id}.json`
        console.log(model.id, outputFile);
        fs.writeFileSync(outputFile, data);
    }
}

main()
