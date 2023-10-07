const path = require('path');
const fs = require('fs');

import { createDrawImageFunc, DrawFunction } from './webgl';

const smoothShaderText = fs.readFileSync(path.resolve(__dirname, '../../shaders/filters/smoothing.glsl'));

export const createSmoothDrawFunc = (gl): DrawFunction => createDrawImageFunc(gl, smoothShaderText, ['u_radius', 'u_image_dimensions']);