const path = require('path');
const fs = require('fs');
import { processImage } from './process-image';
import type { DithermarkNodeOptions } from './options';
const Ajv = require('ajv');
const ajv = new Ajv();

const optionsSchema = JSON.parse(
    fs.readFileSync(
        path.resolve(__dirname, '../schemas/options-schema.json'),
        'utf-8'
    )
);
const jsonSchemaValidator = ajv.compile(optionsSchema);

const getOptions = (
    rawOptionsFileContent: string
): DithermarkNodeOptions | null => {
    let options;
    try {
        options = JSON.parse(rawOptionsFileContent);
    } catch {
        return null;
    }
    if (jsonSchemaValidator(options)) {
        return options;
    }
    console.error(jsonSchemaValidator.errors);

    return null;
};

const inputImagePath = path.resolve(__dirname, '..', 'example/example.jpg');
const outputImagePath = path.resolve(__dirname, '..', 'example/dithered.png');
const optionsPath = path.resolve(__dirname, '..', 'example/options.json');
const options = getOptions(fs.readFileSync(optionsPath));

if (options) {
    processImage(inputImagePath, outputImagePath, options);
} else {
    console.error('Dithemark options file is invalid');
}
