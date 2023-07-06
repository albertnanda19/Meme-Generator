(function (window, document) {
    /**
    * CAN\VAS Plugin - Adding line breaks to canvas
    * @arg {string} [str=Hello World] - text to be drawn
    * @arg {number} [x=0]             - top left x coordinate of the text
    * @arg {number} [y=textSize]      - top left y coordinate of the text
    * @arg {number} [w=canvasWidth]   - maximum width of drawn text
    * @arg {number} [lh=1]            - line height
    * @arg {number} [method=fill]     - text drawing method, if 'none', text will not be rendered
    */

    CanvasRenderingContext2D.prototype.drawBreakingText = function (str, x, y, w, lh, method) {
        
        let textSize = parseInt(this.font.replace(/\D/gi, ''));
        let textParts = [];
        let textPartsNo = 0;
        let words = [];
        let currLine = '';
        let testLine = '';
        str = str || '';
        x = x || 0;
        y = y || 0;
        w = w || this.canvas.width;
        lh = lh || 1;
        method = method || 'fill';

        textParts = str.split('\n');
        textPartsNo = textParts.length;

        
        for (let i = 0; i < textParts.length; i++) {
            words[i] = textParts[i].split(' ');
        }
        
        textParts = [];
        
        for (let i = 0; i < textPartsNo; i++) {            
            currLine = '';
            for (let j = 0; j < words[i].length; j++) {
                testLine = currLine + words[i][j] + ' ';                
                if (this.measureText(testLine).width > w && j > 0) {
                    textParts.push(currLine);
                    currLine = words[i][j] + ' ';
                } else {
                    currLine = testLine;
                }
            }            
            textParts.push(currLine);
        }
        
        for (let i = 0; i < textParts.length; i++) {
            if (method === 'fill') {
                this.fillText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x, y + (textSize * lh * i));
            } else if (method === 'stroke') {
                this.strokeText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x, y + (textSize * lh * i));
            } else if (method === 'none') {
                return { 'textParts': textParts, 'textHeight': textSize * lh * textParts.length };
            } else {
                console.warn('drawBreakingText: ' + method + 'Text() does not exist');
                return false;
            }
        }
        return { 'textParts': textParts, 'textHeight': textSize * lh * textParts.length };
    };
})(window, document);

let canvas = document.createElement('canvas');
let canvasWrapper = document.getElementById('canvasWrapper');
canvasWrapper.appendChild(canvas);
canvas.width = 500;
canvas.height = 500;
let ctx = canvas.getContext('2d');
let padding = 15;
let textTop = 'I use coding torque to learn';
let textBottom = 'web development by creating projects';
let textSizeTop = 10;
let textSizeBottom = 10;
let image = document.createElement('img');

image.onload = function (ev) {   
    canvas.outerHTML = '';
    canvas = document.createElement('canvas');
    canvasWrapper.appendChild(canvas);
    ctx = canvas.getContext('2d');
    document.getElementById('trueSize').click();
    document.getElementById('trueSize').click();

    draw();
};

document.getElementById('imgURL').oninput = function (ev) {
    image.src = this.value;
};

document.getElementById('imgFile').onchange = function (ev) {
    let reader = new FileReader();
    reader.onload = function (ev) {
        image.src = reader.result;
    };
    reader.readAsDataURL(this.files[0]);
};

document.getElementById('textTop').oninput = function (ev) {
    textTop = this.value;
    draw();
};

document.getElementById('textBottom').oninput = function (ev) {
    textBottom = this.value;
    draw();
};

document.getElementById('textSizeTop').oninput = function (ev) {
    textSizeTop = parseInt(this.value);
    draw();
    document.getElementById('textSizeTopOut').innerHTML = this.value;
};
document.getElementById('textSizeBottom').oninput = function (ev) {
    textSizeBottom = parseInt(this.value);
    draw();
    document.getElementById('textSizeBottomOut').innerHTML = this.value;
};

document.getElementById('trueSize').onchange = function (ev) {
    if (document.getElementById('trueSize').checked) {
        canvas.classList.remove('fullwidth');
    } else {
        canvas.classList.add('fullwidth');
    }
};

document.getElementById('export').onclick = function () {
    let img = canvas.toDataURL('image/png');
    let link = document.createElement("a");
    link.download = 'My Meme';
    link.href = img;
    link.click();

    let win = window.open(' ', '_blank');
    win.document.write('<img style="box-shadow: 0 0 1em 0 dimgrey;" src="' + img + '"/>');
    win.document.write('<h1 style="font-family: Helvetica; font-weight: 300">Right Click > Save As<h1>');
    win.document.body.style.padding = '1em';
};

function style(font, size, align, base) {
    ctx.font = size + 'px ' + font;
    ctx.textAlign = align;
    ctx.textBaseline = base;
}

function draw() {
    let top = textTop.toUpperCase();
    let bottom = textBottom.toUpperCase();
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = canvas.width * 0.004;

    let _textSizeTop = textSizeTop / 100 * canvas.width;
    let _textSizeBottom = textSizeBottom / 100 * canvas.width;

    style('Impact', _textSizeTop, 'center', 'bottom');
    ctx.drawBreakingText(top, canvas.width / 2, _textSizeTop + padding, null, 1, 'fill');
    ctx.drawBreakingText(top, canvas.width / 2, _textSizeTop + padding, null, 1, 'stroke');

    style('Impact', _textSizeBottom, 'center', 'top');
    let height = ctx.drawBreakingText(bottom, 0, 0, null, 1, 'none').textHeight;
    console.log(ctx.drawBreakingText(bottom, 0, 0, null, 1, 'none'));
    ctx.drawBreakingText(bottom, canvas.width / 2, canvas.height - padding - height, null, 1, 'fill');
    ctx.drawBreakingText(bottom, canvas.width / 2, canvas.height - padding - height, null, 1, 'stroke');
}

image.src = 'https://imgflip.com/s/meme/The-Most-Interesting-Man-In-The-World.jpg';
document.getElementById('textSizeTop').value = textSizeTop;
document.getElementById('textSizeBottom').value = textSizeBottom;
document.getElementById('textSizeTopOut').innerHTML = textSizeTop;
document.getElementById('textSizeBottomOut').innerHTML = textSizeBottom;