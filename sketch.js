
let img;
const IMG_WIDTH = 576;
const IMG_HEIGHT = 864;

let lineWeight = 30;
let shift = lineWeight / 2;  // shift for both axes to fit lines into canvas

let backLayer;
let lineLayer;

let startX;
let startY;
let startColor;

let drawMode = 'off';
let showImageFlag = true;


function preload() {
    img = loadImage('media/posvyat.jpg');
}


function setup() {
    
    img.resize(IMG_WIDTH, IMG_HEIGHT);
    img.loadPixels();

    createCanvas(IMG_WIDTH + 2 * shift, IMG_HEIGHT + 2 * shift);
    background(255);

    backLayer = createGraphics(IMG_WIDTH + 2 * shift, IMG_HEIGHT + 2 * shift);
    lineLayer = createGraphics(IMG_WIDTH + 2 * shift, IMG_HEIGHT + 2 * shift);
    lineLayer.strokeWeight(lineWeight);
}

function mousePressed() {

    if (!cursorInBounds())
        return;

    startX = mouseX;
    startY = mouseY;
    startColor = getImageColor(startX, startY);

    drawMode = 'paint';

    loop();
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
    
            if (mouseX == startX && mouseY == startY) {
    
                lineLayer.stroke(startColor);
                lineLayer.point(startX, startY);
    
            } else {
    
                gradiantLine(startColor, currentColor, startX, startY, mouseX, mouseY, lineLayer);
            }
        
            startX = mouseX;
            startY = mouseY;
            startColor = currentColor;
    
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
            lineWeight = max(5, lineWeight - 5);
            lineLayer.strokeWeight(lineWeight);
            break;

        case '=':
        case '+':
            lineWeight += 5;
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