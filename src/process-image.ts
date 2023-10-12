const sharp = require('sharp');
import {
    createAndLoadTextureFromArray,
    createFramebuffer,
} from './webgl/webgl';
import type { DithermarkNodeOptions } from './options';
import { pixelationRatio } from './filters/filter-options';
import { processImageWithFilters } from './filters/process-filters';

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

                    const gl = require('gl')(resizedWidth, resizedHeight);
                    const texture = createAndLoadTextureFromArray(
                        gl,
                        pixels,
                        resizedWidth,
                        resizedHeight
                    );
                    createFramebuffer(gl, texture, resizedWidth, resizedHeight);

                    // pre-dither filters
                    processImageWithFilters(gl, texture, resizedWidth, resizedHeight, {
                        brightness: options.image?.preDither?.brightness,
                        smooth: options.image?.preDither?.smooth,
                    });

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
