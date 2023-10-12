//imageDimensions = height * width
//percentage is 0-100
//returns percentage 0-100
const calculatePixelationZoom = (imageDimensions: number, percentage: number): number => {
    if(percentage >= 100){
        return 100;
    }
    //based on 720 x 960 image, since large images won't be pixelized enough
    const baseDimensions = Math.min(691200, imageDimensions) * percentage;
    return Math.ceil(baseDimensions / imageDimensions);
}

export const pixelationRatio = (imageDimensions: number, percentageIndex: number): number => {
    const pixelationPercentages = [100, 70, 60, 50, 45, 40, 37, 35, 32, 30, 27, 25, 22, 20, 17, 15, 12, 10, 7, 5, 4, 3];
    return calculatePixelationZoom(imageDimensions, pixelationPercentages[percentageIndex]) / 100;
}