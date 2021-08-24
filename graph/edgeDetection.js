/**
 *
 * @param img p5.Image with loaded pixels
 */

function edgeDetection(img) {
    let res = createImage(img.width - 2, img.height - 2);
    res.loadPixels();

    let greyPixelArray = makeGreyPixelArray();
    let gradArray = [];

    let gxMask = [
        [-1, -2, -1],
        [ 0,  0,  0],
        [ 1,  2,  1]
    ];
    let gyMask = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ];

    let gradMax = 0;

    for (let i = 1; i < img.width - 1; i++) {
        for (let j = 1; j < img.height - 1; j++) {

            let gx = calcMask(i, j, gxMask);
            let gy = calcMask(i, j, gyMask);

            let grad = Math.hypot(gx, gy) / Math.sqrt(2);
            gradMax = Math.max(gradMax, grad);
            writeToGradArray(i - 1, j - 1, grad);
        }
    }

    writeCorrectedGrad();

    res.updatePixels();
    return res;


    function makeGreyPixelArray() {
        let pixels = img.pixels;
        let res = new Array(pixels.length / 4);

        for (let i = 0; i < pixels.length; i++) {
            res[i] = pixels[4 * i];
            res[i] += pixels[4 * i + 1];
            res[i] += pixels[4 * i + 2];
            res[i] /= 3;
        }

        return res;
    }

    function pixelVal(w, h) {
        return greyPixelArray[w + img.width * h];
    }

    function writeToGradArray(w, h, grad) {
        gradArray[w + res.width * h] = grad;
    }

    function getFromGradArray(w, h) {
        return gradArray[w + res.width * h];
    }

    function writeCorrectedGrad() {
        for (let i = 0; i < res.width; i++) {
            for (let j = 0; j < res.height; j++) {
                writeToRes(i, j, getFromGradArray(i, j) / gradMax * 255);
            }
        }
    }

    function writeToRes(w, h, grey) {
        grey = Math.round(grey);
        let index = (w + res.width * h) * 4;

        res.pixels[index] = grey;
        res.pixels[index + 1] = grey;
        res.pixels[index + 2] = grey;

        res.pixels[index + 3] = 255;
    }

    function calcMask(w, h, mask) {
        let ans = 0;

        ans += mask[0][0] * pixelVal(w - 1, h - 1);
        ans += mask[0][1] * pixelVal(w, h - 1);
        ans += mask[0][2] * pixelVal(w + 1, h - 1);

        ans += mask[1][0] * pixelVal(w - 1, h);
        ans += mask[1][1] * pixelVal(w, h);
        ans += mask[1][2] * pixelVal(w + 1, h);

        ans += mask[2][0] * pixelVal(w - 1, h + 1);
        ans += mask[2][1] * pixelVal(w, h + 1);
        ans += mask[2][2] * pixelVal(w + 1, h + 1);

        return ans / maskWeight(mask);
    }

    function maskWeight(mask) {
        let ans = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                ans += Math.abs(mask[i][j]);
            }
        }
        return ans;
    }
}


