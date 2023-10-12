import {
    createSmoothDrawFunc,
    createBrightnessDrawFunc,
} from '../webgl/filters';

interface ProcessFiltersOptions {
    brightness?: number,
    saturation?: number,
    contrast?: number,
    smooth?: number,
}

export const processImageWithFilters = (gl: WebGLRenderingContext, texture: WebGLTexture, imageWidth: number, imageHeight: number, options: ProcessFiltersOptions): void => {
    if (
        typeof options.brightness === 'number' &&
        options.brightness !== 100
    ) {
        const brightnessFilter = createBrightnessDrawFunc(gl);
        brightnessFilter(
            gl,
            texture,
            imageWidth,
            imageHeight,
            (gl, customUniformLocations) => {
                gl.uniform1f(
                    customUniformLocations['u_brightness'],
                    options.brightness / 100
                );
            }
        );
    }
    if (options.smooth) {
        const smoothFilter = createSmoothDrawFunc(gl);
        smoothFilter(
            gl,
            texture,
            imageWidth,
            imageHeight,
            (gl, customUniformLocations) => {
                gl.uniform1i(
                    customUniformLocations['u_radius'],
                    options.smooth
                );
                gl.uniform2f(
                    customUniformLocations[
                        'u_image_dimensions'
                    ],
                    imageWidth,
                    imageHeight
                );
            }
        );
    }
};