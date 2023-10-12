import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import { compileFromFile } from 'json-schema-to-typescript'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

compileFromFile(path.resolve(__dirname, 'options-schema.json'))
  .then(ts => fs.promises.writeFile(path.resolve(__dirname, '../src/options.d.ts'), ts));