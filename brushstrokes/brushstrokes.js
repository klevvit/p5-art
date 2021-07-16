
const IMG_WIDTH = 576;
const IMG_HEIGHT = 864;

const LINE_WEIGHT_MIN = 5;
const LINE_WEIGHT_MAX = 50;

const shift = LINE_WEIGHT_MAX / 2;  // shift for both axes to fit lines into canvas

const IMG_SOURCE = '../media/posvyat.jpg';

let img;

let lineWeight = 20;

let backLayer;  // with previously drawn lines
let lineLayer;  // with line being currently drawn
let tintImageLayer;  // never changed once initialized
let backAndImageLayer;  // back already drawn on image

let prevX;
let prevY;
let prevColor;

let drawMode;  // 3 modes: 'paint' processes and prints line updates, 'back' clears canvas and prints only back layer and image,
// 'paint-update-back' both processes line and updates canvas once, then switches to 'paint'
let showImageFlag = true;

let htmlBrushSize;
let htmlImageShown;


function preload() {
    img = loadImage(IMG_SOURCE);
}


function setup() {

    initImgUpdate();

    htmlBrushSize = select('.brush-size').elt;
    htmlImageShown = select('.imageshown').elt;

    htmlBrushSize.innerHTML = lineWeight;
    htmlImageShown.innerHTML = showImageFlag;

    img.resize(IMG_WIDTH, IMG_HEIGHT);
    img.loadPixels();

    let canvas = createCanvas(IMG_WIDTH + 2 * shift, IMG_HEIGHT + 2 * shift);
    canvas.parent('sketch-holder');

    initLayers();

    drawMode = 'back';
    displayLayers();

    noLoop();
}

function initImgUpdate() {
    const fileInput = document.getElementById('img_load');
    fileInput.onchange = () => {
        const imgFile = fileInput.files[0];
        let imgURL = URL.createObjectURL(imgFile);
        
        loadImage(imgURL, newImg => {
            newImg.resize(IMG_WIDTH, IMG_HEIGHT);
            newImg.loadPixels();
            img = newImg;
            
            initLayers();
            drawMode = 'back';
            displayLayers();
        });
    }
}

/** create layers and set their initial parameters */
function initLayers() {
    backLayer = createGraphics(IMG_WIDTH + 2 * shift, IMG_HEIGHT + 2 * shift);
    lineLayer = createGraphics(IMG_WIDTH + 2 * shift, IMG_HEIGHT + 2 * shift);
    lineLayer.strokeWeight(lineWeight);

    tintImageLayer = createGraphics(IMG_WIDTH, IMG_HEIGHT);
    tintImageLayer.tint(255, 128);
    tintImageLayer.image(img, 0, 0);

    backAndImageLayer = createGraphics(IMG_WIDTH + 2 * shift, IMG_HEIGHT + 2 * shift);
    if (showImageFlag)
        backAndImageLayer.image(tintImageLayer, shift, shift);
}


function mousePressed() {

    if (!cursorInBounds())
        return;

    prevX = null;
    prevY = null;
    prevColor = null;

    drawMode = 'paint';

    loop();
}


function mouseReleased() {

    noLoop();


    moveLineToBack();

    drawMode = 'back';
    redraw();
}


function draw() {

    // console.log("Draw, mode = " + drawMode + ", showImage = " + showImageFlag);

    switch (drawMode) {
        case 'paint':
        case 'paint-update-back':

            if (!cursorInBounds() || (mouseX == prevX && mouseY == prevY)) {

                if (drawMode == 'paint-update-back')
                    displayLayers();

                break;
            }

            currentColor = getImageColor(mouseX, mouseY);

            if (prevColor === null) {

                lineLayer.stroke(currentColor);
                lineLayer.point(mouseX, mouseY);

            } else {

                gradiantLine(prevColor, currentColor, prevX, prevY, mouseX, mouseY, lineLayer);
            }

            displayLayers();

            prevX = mouseX;
            prevY = mouseY;
            prevColor = currentColor;

            break;

        case 'back':
            displayLayers();
            break;
    }

    if (drawMode == 'paint-update-back')
        drawMode = 'paint';
}


function displayLayers() {

    if (drawMode == 'back' || drawMode == 'paint-update-back') {
        clear();
        image(backAndImageLayer, 0, 0);
    }

    if (drawMode == 'paint' || drawMode == 'paint-update-back')
        image(lineLayer, 0, 0);
}


/** clear line layer, moving its contents to back layer, and update backAndImage layer */
function moveLineToBack() {

    backLayer.image(lineLayer, 0, 0);
    lineLayer.clear();

    makeBackAndImageLayer();

}


function makeBackAndImageLayer() {

    backAndImageLayer.clear();

    if (showImageFlag)
        backAndImageLayer.image(tintImageLayer, shift, shift);

    backAndImageLayer.image(backLayer, 0, 0);
}


function keyTyped() {
    switch (key) {
        case 'F':
        case 'f':
        case 'А':  // Russian letter
        case 'а':
            showImageFlag = !showImageFlag;
            htmlImageShown.innerHTML = showImageFlag;
            makeBackAndImageLayer();

            if (drawMode == 'paint')
                drawMode = 'paint-update-back';
            else
                redraw();

            break;

        case '-':
        case '_':
            lineWeight = max(LINE_WEIGHT_MIN, lineWeight - 5);
            lineLayer.strokeWeight(lineWeight);
            htmlBrushSize.innerHTML = lineWeight;
            break;

        case '=':
        case '+':
            lineWeight = min(LINE_WEIGHT_MAX, lineWeight + 5);
            lineLayer.strokeWeight(lineWeight);
            htmlBrushSize.innerHTML = lineWeight;
            break;

        default:
            break;
    }
}


/** Returns color of image point under coordinates (x, y) taking shift into account */
function getImageColor(x, y) {
    return color(img.get(x - shift, y - shift));
}


/** Returns true if cursor is at least at shift distance from all canvas sides, false otherwise. */
function cursorInBounds() {
    return mouseX >= shift && mouseY >= shift &&
        mouseX <= IMG_WIDTH + shift && mouseY <= IMG_HEIGHT + shift;
}


function gradiantLine(color1, color2, x1, y1, x2, y2, layer) {

    const QUALITY = 100;

    for (let i = 0; i < QUALITY; i++) {

        layer.stroke(lerpColor(color1, color2, i / QUALITY));
        layer.line(
            ((QUALITY - i) * x1 + i * x2) / QUALITY,
            ((QUALITY - i) * y1 + i * y2) / QUALITY,
            ((QUALITY - i - 1) * x1 + (i + 1) * x2) / QUALITY,
            ((QUALITY - i - 1) * y1 + (i + 1) * y2) / QUALITY
        );
    }
}