
const LINE_WEIGHT_MIN = 5;
const LINE_WEIGHT_MAX = 50;

const SHIFT = LINE_WEIGHT_MAX / 2;  // shift for both axes to fit lines into canvas

const DEFAULT_IMG_SOURCE = '../media/posvyat.jpg';

let img;  // p5.Image used for current drawing

let lineWeight = 20;

let prevX;
let prevY;
let prevColor;

let drawMode;  // 3 modes: 'paint' processes and prints line updates, 'back' clears canvas and prints only back layer and image,
// 'paint-update-back' both processes line and updates canvas once, then switches to 'paint'
let showImageFlag = true;


/** p5.js function */
function preload() {
    img = loadImage(DEFAULT_IMG_SOURCE);
}


/** p5.js function */
function setup() {

    initHTMLControls();

    // img.resize(IMG_WIDTH, IMG_HEIGHT);   TODO make resize depending on screen size
    img.loadPixels();

    let canvas = createCanvas(img.width + 2 * SHIFT, img.height + 2 * SHIFT);
    canvas.parent('sketch-holder');

    initLayers();

    drawMode = 'back';
    displayLayers();

    noLoop();
}


/** Actions when user loads a new image.
 * @param {p5.Image} newImg 
 */
function onImageChange(newImg) {

    newImg.loadPixels();
    img = newImg;
    
    resizeCanvas(img.width + 2 * SHIFT, img.height + 2 * SHIFT);
    
    initLayers();
    drawMode = 'back';
    displayLayers();
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


/** p5.js function; different behavior depending on drawMode variable */
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


/** draw current state of canvas. */
function displayLayers() {

    if (drawMode == 'back' || drawMode == 'paint-update-back') {
        clear();
        image(backAndImageLayer, 0, 0);
    }

    if (drawMode == 'paint' || drawMode == 'paint-update-back')
        image(lineLayer, 0, 0);
}


/** clear line layer, moving its contents to back layer and backAndImage layer */
function moveLineToBack() {

    backLayer.image(lineLayer, 0, 0);
    backAndImageLayer.image(lineLayer, 0, 0);
    lineLayer.clear();
}


function makeBackAndImageLayer() {

    backAndImageLayer.clear();

    if (showImageFlag)
        backAndImageLayer.image(tintImageLayer, SHIFT, SHIFT);

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
    return color(img.get(x - SHIFT, y - SHIFT));
}


/** Returns true if cursor is at least at shift distance from all canvas sides, false otherwise. */
function cursorInBounds() {
    return mouseX >= SHIFT && mouseY >= SHIFT &&
        mouseX <= img.width + SHIFT && mouseY <= img.height + SHIFT;
}


// TODO make better
/** Draw gradient line to layer. */
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