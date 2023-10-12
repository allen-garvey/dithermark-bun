const path = require('path');
const fs = require('fs');
import { processImage } from './process-image';
import type { DithermarkNodeOptions } from './options';
const jsonSchemaValidator = require('jsonschema').validate;

const optionsSchema = fs.readFileSync(path.resolve(__dirname, '../schemas/options-schema.json'));

const getOptions = (rawOptionsFileContent: string): DithermarkNodeOptions|null => {
    let options;
    try {
        options = JSON.parse(rawOptionsFileContent);
    } catch {
        return null;
    }

    if (jsonSchemaValidator(options, optionsSchema)){
        return options;
    }

    return null;
};

const inputImagePath = path.resolve(__dirname, '..', 'example/example.jpg');
const outputImagePath = path.resolve(__dirname, '..', 'example/dithered.png');
const optionsPath = path.resolve(__dirname, '..', 'example/options.json');
const options = getOptions(fs.readFileSync(optionsPath));

if(options){
    processImage(inputImagePath, outputImagePath, options);
}
else {
    console.error('Dithemark options file is invalid');
}

