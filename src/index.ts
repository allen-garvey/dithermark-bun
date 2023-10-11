const path = require('path');
import { processImage } from './process-image';

const inputImagePath = path.resolve(__dirname, '..', 'example/example.jpg');
const outputImagePath = path.resolve(__dirname, '..', 'example/dithered.png');

processImage(inputImagePath, outputImagePath);
