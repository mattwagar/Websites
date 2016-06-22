
var requestAnimFrame: (callback: () => void) => void = (function () {
    return window.requestAnimationFrame ||
        (<any>window).webkitRequestAnimationFrame ||
        (<any>window).mozRequestAnimationFrame ||
        (<any>window).oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback: any) {
            window.setTimeout(callback, 1000 / 60, new Date().getTime());
        };
})();


var canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;

init();
animate();

function init(): any {

    canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;

    ctx = canvas.getContext('2d');

    document.body.appendChild(canvas);

}

function Circle(color: string, width: number, radius: number, start: number, end: number) {
    ctx.beginPath();
    ctx.arc(256, 256, radius, start, end)
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.fill();

}

function animate() {
    requestAnimFrame(animate);
    draw();

}

var colors1: Array<string>, colors2: Array<string>;


function colorArr1() {
    colors1 = new Array;

    for (let i = 0; i < 6; i++) {
        colors1.push(rngColor());
    }
}

function colorArr2() {
    colors2 = new Array;

    for (let i = 0; i < 6; i++) {
        colors2.push(rngColor());
    }
}

colorArr1();
colorArr2();


function draw() {


    ctx.clearRect(0, 0, 512, 512);
    ctx.translate(256, 256);
    ctx.rotate(2 * Math.PI / 180);
    ctx.translate(-256, -256);


    let i = 1;
    for (let color in colors1) {
        Circle(colors1[color], 25, 30 * i, 0, 0.5 * Math.PI);
        Circle(colors1[color], 25, 30 * i, 1 * Math.PI, 1.5 * Math.PI);
        i++;
    }

    i = 1;
    for (let color in colors2) {
        Circle(colors2[color], 25, 30 * i, 0.5 * Math.PI, 1 * Math.PI);
        Circle(colors2[color], 25, 30 * i, 1.5 * Math.PI, 2 * Math.PI);
        i++;
    }

}


function rngColor() {

    let r = Math.round(Math.random() * 255);
    let b = Math.round(Math.random() * 255);
    let g = Math.round(Math.random() * 255);

    return ('rgb(' + r + ',' + g + ',' + b + ')');

}



