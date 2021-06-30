
const IMG_WIDTH = 576;
const IMG_HEIGHT = 864;

const LINE_WEIGHT_MIN = 5;
const LINE_WEIGHT_MAX = 50;

const shift = LINE_WEIGHT_MAX / 2;  // shift for both axes to fit lines into canvas

let img;

let lineWeight = 20;

let backLayer;
let lineLayer;

let prevX;
let prevY;
let prevColor;

let drawMode = 'off';
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

    displayLayers(showImageFlag);

    // noLoop();
}

function mousePressed() {

    if (!cursorInBounds())
        return;

    prevX = mouseX;
    prevY = mouseY;
    prevColor = getImageColor(prevX, prevY);

    drawMode = 'paint';

    // loop();
}


function mouseReleased() {
    
    backLayer.image(lineLayer, 0, 0);
    lineLayer.clear();
    
    drawMode = 'off';
}


function draw() {

    switch (drawMode) {
        case 'paint':

            if (!cursorInBounds())
                break;
        
            currentColor = getImageColor(mouseX, mouseY);
    
            if (mouseX == prevX && mouseY == prevY) {
    
                lineLayer.stroke(prevColor);
                lineLayer.point(prevX, prevY);
    
            } else {
    
                gradiantLine(prevColor, currentColor, prevX, prevY, mouseX, mouseY, lineLayer);
            }
        
            prevX = mouseX;
            prevY = mouseY;
            prevColor = currentColor;
    
            break;
            
        default:
            break;
    }

    displayLayers(showImageFlag);
}


function displayLayers(showImage = true) {

    clear();
    background(255);
    
    if (showImage) {
        
        tint(255, 128);
        image(img, shift, shift);
        noTint();
    }

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
    for (let i = 0; i < 100; i ++) {
      layer.stroke(lerpColor(color1, color2, i/100.0));
      layer.line(
        ((100 - i) * x1 + i * x2) / 100.0,
        ((100 - i) * y1 + i * y2) / 100.0,
        ((100 - i - 1) * x1 + (i + 1) * x2) / 100.0,
        ((100 - i - 1) * y1 + (i + 1) * y2) / 100.0
      );
    }
}