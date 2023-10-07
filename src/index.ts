const path = require('path');
const sharp = require('sharp');
import { createAndLoadTextureFromArray } from './webgl/webgl';
import { createSmoothDrawFunc } from './webgl/filters';


const imageFile = Bun.file(path.resolve(__dirname, '..', 'example.jpg'));

imageFile.arrayBuffer()
.then(buffer => {
    const image = sharp(buffer);
    return image.metadata().then(metadata => [image, metadata])
})
.then(([image, metadata]) => {
    const width = metadata.width;
    const height = metadata.height;
    const resizePercentage = 3;

    return image.resize({
        width: Math.ceil(width * resizePercentage / 100),
        kernel: 'nearest',
        fastShrinkOnLoad: false,
    })
    .raw()
    .toBuffer()
    .then((buffer: Uint8Array) => {
        // won't work until node_module_register is implemented
        // https://github.com/oven-sh/bun/issues/4290
        // const gl = require('gl')(width, height, { preserveDrawingBuffer: true });
        // createAndLoadTextureFromArray(gl, buffer, width, height);
        
        return sharp(buffer).resize({
            width,
            kernel: 'nearest',
            fastShrinkOnLoad: false,
        });
    })
    // .png()
    // .withMetadata()
    // .toFile(path.resolve(__dirname, '..', 'dithered.png'));
});
