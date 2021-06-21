
const IMG_WIDTH = 720;
const IMG_HEIGHT = 1080;

let pointsDist = 20;
let pointsX;
let pointsY;
let pointSize;
let lineWeight;

let img;
let points;


/* Matrices are usually arrays of rows, but in p5.js X coordinate is horizontal and Y is vertical. 
 * So it'll be a little tricky, because point[1][2] means Y = 1 and X = 2.
 */
function setPointsCntAndSize() {
    pointsX = Math.floor(IMG_WIDTH / pointsDist);
    pointsY = Math.floor(IMG_HEIGHT / pointsDist);
    pointSize = pointsDist / 3;
    lineWeight = pointsDist / 6;
}

function preload() {
    img = loadImage('media/posvyat.jpg');
}


function setup() {

    setPointsCntAndSize();
    img.loadPixels();

    let shift = max(pointSize / 2, lineWeight / 2);  // shift for both axes to fit points and lines into canvas

    createCanvas(IMG_WIDTH , IMG_HEIGHT); // TODO deal with it
    background(255);
    
    makeArray();
    
    
   
    // ----- draw lines -----
    strokeWeight(lineWeight);

    // down-right
    for (let i = 0; i < points.length - 1; i++) {
        for (let j = 0; j < points[i].length; j++) {
            if (j == pointsX - 1) 
                continue;
            let p1 = points[i][j];
            let p2 = points[i + 1][j + i % 2];
            gradiantLine(p1.color, p2.color, p1.x + shift, p1.y + shift, p2.x + shift, p2.y + shift);
        }
    }

    // down-left
    for (let i = 0; i < points.length - 1; i++) {
        for (let j = 0; j < points[i].length; j++) {
            if (j == 0 && i % 2 == 0) 
                continue;
            let p1 = points[i][j];
            let p2 = points[i + 1][j - (i + 1) % 2];
            gradiantLine(p1.color, p2.color, p1.x + shift, p1.y + shift, p2.x + shift, p2.y + shift);
        }
    }

    // horizontal
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points[i].length - 1; j++) {
            let p1 = points[i][j];
            let p2 = points[i][j + 1];
            gradiantLine(p1.color, p2.color, p1.x + shift, p1.y + shift, p2.x + shift, p2.y + shift);
        }
    }

    // // edges left & right
    // for (let i = 0; i < Math.ceil(points.length / 2) - 1; i++) {
    //     let p1 = points[2*i][0];
    //     let p2 = points[2*i + 2][0];
    //     gradiantLine(p1.color, p2.color, p1.x + shift, p1.y + shift, p2.x + shift, p2.y + shift);
        
    //     let p3 = points[2*i][pointsX - 1];
    //     let p4 = points[2*i + 2][pointsX - 1];
    //     gradiantLine(p3.color, p4.color, p3.x + shift, p3.y + shift, p4.x + shift, p4.y + shift);
    // }

    // // edge ceil
    // for (let j = 0; j < points[0].length; j++) {
    //     let p1 = points[0][j];
    //     let p2 = points[0][0];
    //     gradiantLine(p1.color, p2.color, p1.x + shift, p1.y + shift, p2.x + shift, p2.y + shift);
    // }   
    //     // edge floor
    // for (let j = 0; j < points[pointsY - 1].length; j++) {
    //     let p1 = points[pointsY - 1][j];
    //     let p2 = points[pointsY - 1][0];
    //     gradiantLine(p1.color, p2.color, p1.x + shift, p1.y + shift, p2.x + shift, p2.y + shift);
    // }

    // ----! draw lines -----
    
    // ----- draw points -----
    strokeWeight(pointSize);

    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points[i].length; j++) {
            let p = points[i][j];
            stroke(p.color);
            point(p.x + shift, p.y + shift);
        }
    }
    // ----! draw points -----

    // stroke(0);
    // strokeWeight(lineWeight);
    // line(0, 0, IMG_WIDTH, IMG_HEIGHT);

}


function makeArray() {
    points = new Array(pointsY);
    
    for (let i = 0; i < pointsY; i++) {
        points[i] = new Array(pointsX - i % 2);
        
        for (let j = 0; j < pointsX - i % 2; j++) {
            points[i][j] = { 
                x: (j + 1/2 * (i % 2)) * pointsDist,
                y: i * pointsDist,
                color: color(img.get(j * pointsDist, i * pointsDist))
                };
        }
    
    }
}

function gradiantLine(color1, color2, x1, y1, x2, y2) {
    for (let i = 0; i < 100; i ++) {
      stroke(lerpColor(color1, color2, i/100.0));
      line(
        ((100 - i) * x1 + i * x2) / 100.0,
        ((100 - i) * y1 + i * y2) / 100.0, 
        ((100 - i - 1) * x1 + (i + 1) * x2) / 100.0, 
        ((100 - i - 1) * y1 + (i + 1) * y2) / 100.0
      );
    }
  }