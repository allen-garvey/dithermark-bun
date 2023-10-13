const path = require('path');
const fs = require('fs');

import { createDrawImageFunc, DrawFunction } from './webgl';
const FILTER_SHADERS_DIR = path.resolve(__dirname, '../../shaders/filters/');

type RenderFunction = (gl: WebGLRenderingContext) => DrawFunction;

const buildDrawFunc = (shaderPath: string, uniformNames: string[]): RenderFunction => (gl: WebGLRenderingContext): DrawFunction => createDrawImageFunc(gl, fs.readFileSync(path.resolve(FILTER_SHADERS_DIR, shaderPath)), uniformNames);

export const createSmoothDrawFunc = buildDrawFunc('smooth.glsl', ['u_radius', 'u_image_dimensions']);

export const createBrightnessDrawFunc = buildDrawFunc('brightness.glsl', ['u_brightness']);;

export const createContrastDrawFunc = buildDrawFunc('contrast.glsl', ['u_contrast']);

export const createSaturationDrawFunc = buildDrawFunc('saturation.glsl', ['u_saturation']);