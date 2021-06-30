
const IMG_WIDTH = 576;
const IMG_HEIGHT = 864;

const LINE_WEIGHT_MIN = 5;
const LINE_WEIGHT_MAX = 50;

const shift = LINE_WEIGHT_MAX / 2;  // shift for both axes to fit lines into canvas

let img;

let lineWeight = 20;

let backLayer;
let lineLayer;
let tintImageLayer;

let prevX;
let prevY;
let prevColor;

let drawMode = 'off';  // 3 modes: 'paint' processes and prints line, 'back' prints only back layer and image, 'off' prints only image
let showImageFlag = true;


function preload() {
    img = loadImage('media/posvyat.jpg');
}


function setup() {
    
    img.resize(IMG_WIDTH, IMG_HEIGHT);
    img.loadPixels();

    createCanvas(IMG_WIDTH + 2 * shift, IMG_HEIGHT + 2 * shift);

    backLayer = createGraphics(IMG_WIDTH + 2 * shift, IMG_HEIGHT + 2 * shift);
    lineLayer = createGraphics(IMG_WIDTH + 2 * shift, IMG_HEIGHT + 2 * shift);
    lineLayer.strokeWeight(lineWeight);

    tintImageLayer = createGraphics(IMG_WIDTH, IMG_HEIGHT);
    tintImageLayer.tint(255, 128);
    tintImageLayer.image(img, 0, 0);

    displayLayers();

    noLoop();
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

    backLayer.image(lineLayer, 0, 0);
    lineLayer.clear();
    
    drawMode = 'back';
    redraw();
}


function draw() {

    switch (drawMode) {
        case 'paint':

            if (!cursorInBounds() || (mouseX == prevX && mouseY == prevY))
                break;
        
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
        
        default:
            break;
    }
        
}


function displayLayers() {

    clear();
    
    if (showImageFlag)
        image(tintImageLayer, shift, shift);

    image(backLayer, 0, 0);
    image(lineLayer, 0, 0);
}


function keyTyped() {
    switch (key) {
        case 'F':
        case 'f':
        case 'А':  // russian letter
        case 'а':
            showImageFlag = !showImageFlag;
            redraw();
            break;
    
        case '-':
        case '_':
            lineWeight = max(LINE_WEIGHT_MIN, lineWeight - 5);
            lineLayer.strokeWeight(lineWeight);
            break;

        case '=':
        case '+':
            lineWeight = min(LINE_WEIGHT_MAX, lineWeight + 5);
            lineLayer.strokeWeight(lineWeight);
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
    
    for (let i = 0; i < QUALITY; i ++) {
    
        layer.stroke(lerpColor(color1, color2, i/QUALITY));
        layer.line(
            ((QUALITY - i) * x1 + i * x2) / QUALITY,
            ((QUALITY - i) * y1 + i * y2) / QUALITY,
            ((QUALITY - i - 1) * x1 + (i + 1) * x2) / QUALITY,
            ((QUALITY - i - 1) * y1 + (i + 1) * y2) / QUALITY
      );
    }
}