let htmlBrushSize;
let htmlImageShown;


function initHTMLControls() {

    initLoadImgButton();

    htmlBrushSize = select('.brush-size').elt;
    htmlImageShown = select('.imageshown').elt;

    htmlBrushSize.innerHTML = lineWeight;
    htmlImageShown.innerHTML = showImageFlag;
}


function initLoadImgButton() {
    const fileInput = document.getElementById('load_img');
    fileInput.onchange = () => {
        const imgFile = fileInput.files[0];
        let imgURL = URL.createObjectURL(imgFile);
        
        loadImage(imgURL, onImageChange);
    }
}