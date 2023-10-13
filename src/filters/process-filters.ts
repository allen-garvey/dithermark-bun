import {
    createSmoothDrawFunc,
    createBrightnessDrawFunc,
    createContrastDrawFunc,
    createSaturationDrawFunc,
} from '../webgl/filters';

interface ProcessFiltersOptions {
    brightness?: number;
    saturation?: number;
    contrast?: number;
    smooth?: number;
}

export const processImageWithFilters = (
    gl: WebGLRenderingContext,
    texture: WebGLTexture,
    imageWidth: number,
    imageHeight: number,
    options: ProcessFiltersOptions
): void => {
    if (typeof options.saturation === 'number' && options.saturation !== 100) {
        const saturationFilter = createSaturationDrawFunc(gl);
        saturationFilter(
            gl,
            texture,
            imageWidth,
            imageHeight,
            (gl, customUniformLocations) => {
                gl.uniform1f(
                    customUniformLocations['u_saturation'],
                    options.saturation / 100
                );
            }
        );
    }
    if (typeof options.brightness === 'number' && options.brightness !== 100) {
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
    if (typeof options.contrast === 'number' && options.contrast !== 100) {
        //contrast value of 1.5 correlates to 200% of native canvas filters
        let contrastAmount = options.contrast / 100 - 1;
        if(contrastAmount > 0){
            contrastAmount /= 2;
        }
        const contrastFilter = createContrastDrawFunc(gl);
        contrastFilter(
            gl,
            texture,
            imageWidth,
            imageHeight,
            (gl, customUniformLocations) => {
                gl.uniform1f(
                    customUniformLocations['u_contrast'],
                    contrastAmount
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
                    customUniformLocations['u_image_dimensions'],
                    imageWidth,
                    imageHeight
                );
            }
        );
    }
};
