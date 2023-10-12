 const sharp = require('sharp');
import { createAndLoadTextureFromArray } from './webgl/webgl';
import { createSmoothDrawFunc, createBrightnessDrawFunc } from './webgl/filters';
import type { DithermarkNodeOptions } from './options';
import { pixelationRatio } from './filters/filter-options';

export const processImage = (
    inputImagePath: string,
    outputImagePath: string,
    options: DithermarkNodeOptions
): Promise<void> => {
    const image = sharp(inputImagePath);

    return image
        .ensureAlpha()
        .metadata()
        .then((metadata) => {
            const width = metadata.width;
            const height = metadata.height;
            const resizePercentage = 3;
            console.log(`width: ${width} height: ${height}`);

            if (options.image?.preDither?.pixelate) {
                image.resize({
                    width: Math.ceil(
                        width *
                            pixelationRatio(
                                width * height,
                                options.image.preDither.pixelate
                            )
                    ),
                    kernel: 'nearest',
                    fastShrinkOnLoad: false,
                });
            }
            image.flip(); // required or webgl will flip image
            return new Promise<void>((resolve, reject) => {
                image.raw().toBuffer((err, pixels: Uint8Array, info) => {
                    if (err) {
                        return reject();
                    }
                    const resizedHeight = info.height;
                    const resizedWidth = info.width;
                    console.log(
                        `resized width: ${resizedWidth} resized height: ${resizedHeight}`
                    );

                    // won't work until node_module_register is implemented
                    // https://github.com/oven-sh/bun/issues/4290
                    const gl = require('gl')(resizedWidth, resizedHeight, {
                        preserveDrawingBuffer: true,
                    });
                    const texture = createAndLoadTextureFromArray(
                        gl,
                        pixels,
                        resizedWidth,
                        resizedHeight
                    );
                    const brightnessAmount = options.image?.preDither?.brightness;
                    if(typeof brightnessAmount === 'number' && brightnessAmount !== 100){
                        const brightnessFilter = createBrightnessDrawFunc(gl);
                        brightnessFilter(gl, texture, resizedWidth, resizedHeight, (gl, customUniformLocations) => {
                            gl.uniform1f(
                                customUniformLocations['u_brightness'],
                                brightnessAmount / 100
                            );
                        });
                    }
                    if (options.image?.preDither?.smooth) {
                        const smoothFilter = createSmoothDrawFunc(gl);
                        smoothFilter(
                            gl,
                            texture,
                            resizedWidth,
                            resizedHeight,
                            (gl, customUniformLocations) => {
                                gl.uniform1i(
                                    customUniformLocations['u_radius'],
                                    options.image?.preDither?.smooth
                                );
                                gl.uniform2f(
                                    customUniformLocations[
                                        'u_image_dimensions'
                                    ],
                                    resizedWidth,
                                    resizedHeight
                                );
                            }
                        );
                    }

                    gl.readPixels(
                        0,
                        0,
                        resizedWidth,
                        resizedHeight,
                        gl.RGBA,
                        gl.UNSIGNED_BYTE,
                        pixels
                    );

                    return sharp(pixels, {
                        raw: {
                            height: resizedHeight,
                            width: resizedWidth,
                            channels: info.channels,
                        },
                    })
                        .resize({
                            width,
                            kernel: 'nearest',
                            fastShrinkOnLoad: false,
                        })
                        .png()
                        .toFile(outputImagePath)
                        .then(() => resolve());
                });
            });
        });
};
