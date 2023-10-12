const path = require('path');
const fs = require('fs');

import { createDrawImageFunc, DrawFunction } from './webgl';

const FILTER_SHADERS_DIR = path.resolve(__dirname, '../../shaders/filters/');

const smoothShaderText = fs.readFileSync(path.resolve(FILTER_SHADERS_DIR, 'smoothing.glsl'));

export const createSmoothDrawFunc = (gl: WebGLRenderingContext): DrawFunction => createDrawImageFunc(gl, smoothShaderText, ['u_radius', 'u_image_dimensions']);

const brightnessShaderText = fs.readFileSync(path.resolve(FILTER_SHADERS_DIR, 'brightness.glsl'));

export const createBrightnessDrawFunc = (gl: WebGLRenderingContext): DrawFunction => createDrawImageFunc(gl, brightnessShaderText, ['u_brightness']);

const contrastShaderText = fs.readFileSync(path.resolve(FILTER_SHADERS_DIR, 'contrast.glsl'));

export const createContrastDrawFunc = (gl: WebGLRenderingContext): DrawFunction => createDrawImageFunc(gl, contrastShaderText, ['u_contrast']);