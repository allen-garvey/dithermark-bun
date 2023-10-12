const path = require('path');
const fs = require('fs');

import { createDrawImageFunc, DrawFunction } from './webgl';

const FILTER_SHADERS_DIR = path.resolve(__dirname, '../../shaders/filters/');

const smoothShaderText = fs.readFileSync(path.resolve(FILTER_SHADERS_DIR, 'smoothing.glsl'));

export const createSmoothDrawFunc = (gl): DrawFunction => createDrawImageFunc(gl, smoothShaderText, ['u_radius', 'u_image_dimensions']);

const brightnessShaderText = fs.readFileSync(path.resolve(FILTER_SHADERS_DIR, 'brightness.glsl'));

export const createBrightnessDrawFunc = (gl): DrawFunction => createDrawImageFunc(gl, brightnessShaderText, ['u_brightness']);