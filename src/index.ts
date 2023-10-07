const path = require('path');
const sharp = require('sharp');
import { createAndLoadTextureFromArray } from './webgl/webgl';
import { createSmoothDrawFunc } from './webgl/filters';

const image = sharp(path.resolve(__dirname, '..', 'example.jpg'));

image
.ensureAlpha()
.metadata()
.then((metadata) => {
    const width = metadata.width;
    const height = metadata.height;
    const resizePercentage = 3;
    console.log(`width: ${width} height: ${height}`);

    let resizedWidth;
    let resizedHeight;

    image.resize({
        width: Math.ceil(width * resizePercentage / 100),
        kernel: 'nearest',
        fastShrinkOnLoad: false,
    })
    return new Promise<void>((resolve, reject) => {
        image.raw()
        .toBuffer((err, buffer: Uint8Array, info) => {
            if(err){
                return reject();
            }
            resizedHeight = info.height;
            resizedWidth = info.width;
            console.log(`resized width: ${resizedWidth} resized height: ${resizedHeight}`);

            // won't work until node_module_register is implemented
            // https://github.com/oven-sh/bun/issues/4290
            // const gl = require('gl')(width, height, { preserveDrawingBuffer: true });
            // createAndLoadTextureFromArray(gl, buffer, width, height);
            
            return sharp(buffer, {
                raw: {
                    height: resizedHeight,
                    width: resizedWidth,
                    channels: info.channels,
                }
            }).resize({
                width,
                kernel: 'nearest',
                fastShrinkOnLoad: false,
            })
            .png()
            .toFile(path.resolve(__dirname, '..', 'dithered.png'))
            .then(() => resolve());
        });
    });
});
