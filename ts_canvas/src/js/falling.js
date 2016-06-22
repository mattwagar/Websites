var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60, new Date().getTime());
        };
})();
var canvas, ctx;
init();
animate();
function init() {
    canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
}
function animate() {
    requestAnimFrame(animate);
    draw();
}
var Circle = (function () {
    function Circle(x, y, color, width, radius, start, end) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = width;
        this.radius = radius;
        this.start = start;
        this.end = end;
    }
    Circle.prototype.d = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.start, this.end);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
    };
    Circle.prototype.drop = function () {
        this.x -= 1;
    };
    return Circle;
}());
var c1 = new Circle(256, 90, 'blue', 20, 60, 0, 2 * Math.PI);
var c2 = new Circle(110, 256, 'pink', 20, 90, 0, 2 * Math.PI);
c1.d();
c2.d();
console.log(c1.y);
c1.y = 30;
c1.d();
function draw() {
    ctx.beginPath();
    ctx.arc(256, 256, 30, 0, Math.PI * 2);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 20;
    ctx.stroke();
}
// class Gravity {
//     speed: number;
//     constructor(speed: number) {
//         this.speed = speed;
//     }
//     fall() {
//     }
// }
// class Shape extends Gravity {
//     constructor(speed: number) {
//         super(speed);
//     }
//     Circle(color: string, width: number, radius: number, start: number, end: number):void {
//         ctx.beginPath();
//         ctx.arc(256, 256, radius, start, end)
//         ctx.strokeStyle = color;
//         ctx.lineWidth = width;
//         ctx.stroke();
//         ctx.fill();
//     }
// }

//# sourceMappingURL=falling.js.map
