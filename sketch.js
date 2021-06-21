
const IMG_WIDTH = 720;
const IMG_HEIGHT = 1080;
const POINTS_DIST = 15;

const POINTS_X = IMG_WIDTH / POINTS_DIST;
const POINTS_Y = IMG_HEIGHT / POINTS_DIST;

let img;
let points;

function preload() {
    img = loadImage('media/posvyat.jpg');
}

const pointSize = POINTS_DIST * 7 / 5;

function setup() {


    createCanvas(IMG_WIDTH + pointSize / 2, IMG_HEIGHT + pointSize / 2);
    background(img);

    img.loadPixels();
    
    points = new Array(POINTS_X);

    for (let i = 0; i < POINTS_X; i++) {
        points[i] = new Array(POINTS_Y);
        
        for (let j = 0; j < POINTS_Y; j++) {
            points[i][j] = { 
                x: i * POINTS_DIST,
                y: j * POINTS_DIST,
                color: img.get(i * POINTS_DIST, j * POINTS_DIST)
                };
        }

    }

    strokeWeight(pointSize);
    
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points[0].length; j++) {
            let p = points[i][j];
            console.log(p);
            stroke(p.color);
            // point(p.x + pointSize / 2, p.y + pointSize / 2);
        }
    }

}

function draw() {

}

ЗАГИТПУШ МЕНЯ