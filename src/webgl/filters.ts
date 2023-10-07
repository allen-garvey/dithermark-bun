import smoothShaderText from '../../shaders/filters/smoothing.glsl';
import { createDrawImageFunc, DrawFunction } from './webgl';

export const createSmoothDrawFunc = (gl): DrawFunction => createDrawImageFunc(gl, smoothShaderText, ['u_radius', 'u_image_dimensions']);