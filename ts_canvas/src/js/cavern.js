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
var Quad = (function () {
    function Quad(app, fillcolor, strokecolor, linewidth, x1, y1, x2, y2, x3, y3, x4, y4) {
        this.app = app;
        this.fillcolor = fillcolor;
        this.strokecolor = strokecolor;
        this.linewidth = linewidth;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
        this.x4 = x4;
        this.y4 = y4;
    }
    Quad.prototype.draw = function () {
        var ctx = this.app.ctx;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.lineTo(this.x3, this.y3);
        ctx.lineTo(this.x4, this.y4);
        ctx.closePath();
        if (this.linewidth !== 0) {
            ctx.strokeStyle = this.strokecolor;
            ctx.lineWidth = this.linewidth;
            ctx.stroke();
        }
        ctx.fillStyle = this.fillcolor;
        ctx.fill();
    };
    return Quad;
}());
var Chasm = (function () {
    function Chasm(app, center_x, center_y, size_x, size_y, middle_x, middle_y) {
        this.app = app;
        this.center_x = center_x;
        this.center_y = center_y;
        this.size_x = size_x;
        this.size_y = size_y;
        this.middle_x = middle_x;
        this.middle_y = middle_y;
        this.grd = this.app.ctx.createLinearGradient(0, 0, 170, 0);
        this.grd.addColorStop(0, "black");
        this.grd.addColorStop(1, "white");
    }
    Chasm.prototype.draw = function () {
        this.wall_left = new Quad(this.app, 'hsl(30, 50%, 25%)', 'red', 0, (this.center_x - this.middle_x), (this.center_y - this.middle_y), (this.center_x - this.size_x), (this.center_y - this.size_y), (this.center_x - this.size_x), (this.center_y + this.size_y), (this.center_x - this.middle_x), (this.center_y + this.middle_y));
        this.wall_top = new Quad(this.app, 'hsl(30, 50%, 35%)', 'red', 0, (this.center_x - this.middle_x), (this.center_y - this.middle_y), (this.center_x - this.size_x), (this.center_y - this.size_y), (this.center_x + this.size_x), (this.center_y - this.size_y), (this.center_x + this.middle_x), (this.center_y - this.middle_y));
        this.wall_right = new Quad(this.app, 'hsl(30, 50%, 25%)', 'red', 0, (this.center_x + this.middle_x), (this.center_y + this.middle_y), (this.center_x + this.size_x), (this.center_y + this.size_y), (this.center_x + this.size_x), (this.center_y - this.size_y), (this.center_x + this.middle_x), (this.center_y - this.middle_y));
        this.wall_bot = new Quad(this.app, 'hsl(30, 50%, 15%)', 'red', 0, (this.center_x + this.middle_x), (this.center_y + this.middle_y), (this.center_x + this.size_x), (this.center_y + this.size_y), (this.center_x - this.size_x), (this.center_y + this.size_y), (this.center_x - this.middle_x), (this.center_y + this.middle_y));
        this.wall_middle = new Quad(this.app, 'black', 'red', 0, (this.center_x + this.middle_x), (this.center_y + this.middle_y), (this.center_x + this.middle_x), (this.center_y - this.middle_y), (this.center_x - this.middle_x), (this.center_y - this.middle_y), (this.center_x - this.middle_x), (this.center_y + this.middle_y));
        this.wall_left.draw();
        this.wall_right.draw();
        this.wall_top.draw();
        this.wall_bot.draw();
        this.wall_middle.draw();
    };
    return Chasm;
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
        this.chasm = new Chasm(this, 500, 400, 300, 250, 10, 10);
    }
    App.prototype.sizeCanvas = function () {
        this.w = this.ctx.canvas.width = window.innerWidth;
        this.h = this.ctx.canvas.height = window.innerHeight;
    };
    App.prototype.draw = function (t) {
        var _this = this;
        window.requestAnimationFrame(function (t) { _this.draw(t); });
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.chasm.draw();
        this.chasm.size_x += 1;
        this.chasm.size_y += 1;
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

//# sourceMappingURL=cavern.js.map
