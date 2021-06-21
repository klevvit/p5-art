
const IMG_WIDTH = 720;
const IMG_HEIGHT = 1080;

let pointsDist = 72;
let pointsDistDouble = pointsDist;
let pointsX;
let pointsY;

let img;
let points;
let pointSize = Math.floor(pointsDist * 2**(1/2));

function setPointsCntAndSize() {
    pointsX = Math.floor(IMG_WIDTH / pointsDist);
    pointsY = Math.floor(IMG_HEIGHT / pointsDist);
    pointSize = Math.floor(pointsDist * 2**(1/2));
}

function preload() {
    img = loadImage('media/posvyat.jpg');
}


function setup() {

    setPointsCntAndSize();

    createCanvas(IMG_WIDTH + Math.floor(pointSize / 2), IMG_HEIGHT + Math.floor(pointSize / 2));
    
    img.loadPixels();
    frameRate(20);
}


function draw() {
    
    if (pointsDist > 7) {
        makePoints();
    } else {
        background(255);
        image(img, Math.floor(pointSize / 2), Math.floor(pointSize / 2));
    }
    
}

function makePoints() {

    background(255);
    
    points = new Array(pointsX);
    
    for (let i = 0; i < pointsX; i++) {
        points[i] = new Array(pointsY);
        
        for (let j = 0; j < pointsY; j++) {
            points[i][j] = { 
                x: i * pointsDist,
                y: j * pointsDist,
                color: img.get(i * pointsDist, j * pointsDist)
                };
        }
    
    }
    
    strokeWeight(pointSize);
    
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points[0].length; j++) {
            let p = points[i][j];
            stroke(p.color);
            point(p.x + Math.floor(pointSize / 2), p.y + Math.floor(pointSize / 2));
        }
    }
    
    pointsDistDouble = max(7, pointsDistDouble / 1.05);
    pointsDist = Math.floor(pointsDistDouble);
    setPointsCntAndSize();
}