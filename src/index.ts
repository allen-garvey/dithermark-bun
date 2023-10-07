const path = require('path');
const sharp = require("sharp");


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
    .png()
    .toBuffer()
    .then(buffer => sharp(buffer).resize({
        width,
        kernel: 'nearest',
        fastShrinkOnLoad: false,
    })
    .png()
    .withMetadata()
    .toFile(path.resolve(__dirname, '..', 'dithered.png')));
});
