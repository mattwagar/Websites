var Circle = (function () {
    function Circle(app, x, y, fillcolor, strokecolor, width, radius, start, end) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.fillcolor = fillcolor;
        this.strokecolor = strokecolor;
        this.width = width;
        this.radius = radius;
        this.start = start;
        this.end = end;
    }
    Circle.prototype.draw = function () {
        var ctx = this.app.ctx;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.start, this.end);
        ctx.strokeStyle = this.strokecolor;
        ctx.lineWidth = this.width;
        ctx.stroke();
        ctx.fillStyle = this.fillcolor;
        ctx.fill();
    };
    return Circle;
}());
var App = (function () {
    function App() {
        var _this = this;
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.sizeCanvas();
        this.initEvents();
        window.requestAnimationFrame(function (t) { _this.draw(t); });
        console.log(this);
        this.arr = new Array;
        for (var i = 0; i < 50; i++) {
            this.arr.push(new Circle(this, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2, this.rngColor(), this.rngColor(), 10, this.randomSize(), 0, 2 * Math.PI));
        }
    }
    App.prototype.sizeCanvas = function () {
        this.w = this.ctx.canvas.width = window.innerWidth;
        this.h = this.ctx.canvas.height = window.innerHeight;
    };
    App.prototype.draw = function (t) {
        var _this = this;
        window.requestAnimationFrame(function (t) { _this.draw(t); });
        for (var i in this.arr) {
            this.arr[i].draw();
            this.arr[i].x += this.randomPath() * 15;
            this.arr[i].y += this.randomPath() * 15;
            if (this.arr[i].x > this.ctx.canvas.width - 15) {
                this.arr[i].x = this.ctx.canvas.width - 15;
            }
            else if (this.arr[i].x < 15) {
                this.arr[i].x = 15;
            }
            if (this.arr[i].y > this.ctx.canvas.height - 15) {
                this.arr[i].y = this.ctx.canvas.height - 15;
            }
            else if (this.arr[i].y < 15) {
                this.arr[i].y = 15;
            }
        }
    };
    App.prototype.initEvents = function () {
        var _this = this;
        window.onresize = function (e) { _this.sizeCanvas(); };
    };
    App.prototype.randomPath = function () {
        return (Math.random() * 2 - 1);
    };
    App.prototype.randomSize = function () {
        return (Math.random() * 60);
    };
    App.prototype.rngColor = function () {
        var r = Math.round(Math.random() * 255);
        var b = Math.round(Math.random() * 255);
        var g = Math.round(Math.random() * 255);
        return ('rgb(' + r + ',' + g + ',' + b + ')');
    };
    return App;
}());
var app = new App();

//# sourceMappingURL=falling.js.map
