const sharp = require('sharp');
import {
    createAndLoadTextureFromArray,
    createFramebuffer,
    bindTextureToFramebuffer,
    createEmptyTexture,
    ImageProcessingResult,
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
                    let sourceTexture = createAndLoadTextureFromArray(
                        gl,
                        pixels,
                        resizedWidth,
                        resizedHeight
                    );
                    let targetTexture = createEmptyTexture(
                        gl,
                        resizedWidth,
                        resizedHeight
                    );
                    createFramebuffer(gl, resizedWidth, resizedHeight);
                    bindTextureToFramebuffer(gl, targetTexture);

                    const imageProcessingStartTime = performance.now();

                    let imageProcessingResult: ImageProcessingResult;
                    // pre-dither filters
                    imageProcessingResult = processImageWithFilters(
                        gl,
                        sourceTexture,
                        targetTexture,
                        resizedWidth,
                        resizedHeight,
                        {
                            saturation: options.image?.preDither?.saturation,
                            brightness: options.image?.preDither?.brightness,
                            contrast: options.image?.preDither?.contrast,
                            smooth: options.image?.preDither?.smooth,
                        }
                    );
                    sourceTexture = imageProcessingResult.sourceTexture;
                    targetTexture = imageProcessingResult.targetTexture;

                    const imageProcessingEndTime = performance.now();
                    const imageProcessingTimeInSeconds =
                        (imageProcessingEndTime - imageProcessingStartTime) /
                        1000;
                    console.log(
                        `Total image processing time: ${imageProcessingTimeInSeconds.toFixed(
                            3
                        )} seconds. ${(
                            (resizedHeight * resizedWidth) /
                            1_000_000 /
                            imageProcessingTimeInSeconds
                        ).toFixed(3)} Megapixels per second`
                    );

                    // before reading pixels need to bind the source texture
                    // since framebuffer texture will be read
                    // and the last image processing function will have made the target texture the source texture
                    bindTextureToFramebuffer(gl, sourceTexture);
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
