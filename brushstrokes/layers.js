let backLayer;  // with previously drawn lines
let lineLayer;  // with line being currently drawn
let tintImageLayer;  // contains transparent image; never changed once initialized with image
let backAndImageLayer;  // merged image and back layers


/** create layers and set their initial parameters */
function initLayers() {
    backLayer = createGraphics(img.width + 2 * SHIFT, img.height + 2 * SHIFT);
    lineLayer = createGraphics(img.width + 2 * SHIFT, img.height + 2 * SHIFT);
    lineLayer.strokeWeight(lineWeight);

    tintImageLayer = createGraphics(img.width, img.height);
    tintImageLayer.tint(255, 128);
    tintImageLayer.image(img, 0, 0);

    backAndImageLayer = createGraphics(img.width + 2 * SHIFT, img.height + 2 * SHIFT);
    if (showImageFlag)
        backAndImageLayer.image(tintImageLayer, SHIFT, SHIFT);
}


