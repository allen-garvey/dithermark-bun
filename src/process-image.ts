const sharp = require('sharp');
import { createAndLoadTextureFromArray } from './webgl/webgl';
import { createSmoothDrawFunc } from './webgl/filters';
import type { DithermarkNodeOptions } from './options';

export const processImage = (
    inputImagePath: string,
    outputImagePath: string,
    options: DithermarkNodeOptions
): Promise<void> => {
    const image = sharp(inputImagePath);

    const smoothingValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16];

    return image
        .ensureAlpha()
        .metadata()
        .then((metadata) => {
            const width = metadata.width;
            const height = metadata.height;
            const resizePercentage = 3;
            console.log(`width: ${width} height: ${height}`);

            image
                .resize({
                    width: Math.ceil((width * resizePercentage) / 100),
                    kernel: 'nearest',
                    fastShrinkOnLoad: false,
                })
                .flip(); // required or webgl will flip image
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
                    const smoothFilter = createSmoothDrawFunc(gl);
                    smoothFilter(
                        gl,
                        texture,
                        resizedWidth,
                        resizedHeight,
                        (gl, customUniformLocations) => {
                            gl.uniform1i(
                                customUniformLocations['u_radius'],
                                smoothingValues[1]
                            );
                            gl.uniform2f(
                                customUniformLocations['u_image_dimensions'],
                                resizedWidth,
                                resizedHeight
                            );
                        }
                    );

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
