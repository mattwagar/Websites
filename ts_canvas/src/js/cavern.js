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
    function Chasm(app, linewidth, fillcolor, strokecolor, pos_x, pos_y, size_x, size_y, middle_x, middle_y) {
        this.app = app;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.size_x = size_x;
        this.size_y = size_y;
        this.middle_x = middle_x;
        this.middle_y = middle_y;
        this.fillcolor = fillcolor;
        this.strokecolor = strokecolor;
        this.linewidth = linewidth;
        this.ratio = this.size_x / this.size_y;
        this.grd = this.app.ctx.createLinearGradient(0, 0, 170, 0);
        this.grd.addColorStop(0, "black");
        this.grd.addColorStop(1, "white");
    }
    Chasm.prototype.draw = function () {
        this.wall_left = new Quad(this.app, this.fillcolor, this.strokecolor, this.linewidth, (this.pos_x - this.middle_x), (this.pos_y - this.middle_y), (this.pos_x - this.size_x), (this.pos_y - this.size_y), (this.pos_x - this.size_x), (this.pos_y + this.size_y), (this.pos_x - this.middle_x), (this.pos_y + this.middle_y));
        this.wall_top = new Quad(this.app, this.fillcolor, this.strokecolor, this.linewidth, (this.pos_x - this.middle_x), (this.pos_y - this.middle_y), (this.pos_x - this.size_x), (this.pos_y - this.size_y), (this.pos_x + this.size_x), (this.pos_y - this.size_y), (this.pos_x + this.middle_x), (this.pos_y - this.middle_y));
        this.wall_right = new Quad(this.app, this.fillcolor, this.strokecolor, this.linewidth, (this.pos_x + this.middle_x), (this.pos_y + this.middle_y), (this.pos_x + this.size_x), (this.pos_y + this.size_y), (this.pos_x + this.size_x), (this.pos_y - this.size_y), (this.pos_x + this.middle_x), (this.pos_y - this.middle_y));
        this.wall_bot = new Quad(this.app, this.fillcolor, this.strokecolor, this.linewidth, (this.pos_x + this.middle_x), (this.pos_y + this.middle_y), (this.pos_x + this.size_x), (this.pos_y + this.size_y), (this.pos_x - this.size_x), (this.pos_y + this.size_y), (this.pos_x - this.middle_x), (this.pos_y + this.middle_y));
        this.wall_middle = new Quad(this.app, 'black', this.strokecolor, this.linewidth, (this.pos_x + this.middle_x), (this.pos_y + this.middle_y), (this.pos_x + this.middle_x), (this.pos_y - this.middle_y), (this.pos_x - this.middle_x), (this.pos_y - this.middle_y), (this.pos_x - this.middle_x), (this.pos_y + this.middle_y));
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
        this.chasm = new Chasm(this, 1, 'black', 'black', 500, 400, 300, 250, 10, 10);
        this.arr = new Array;
        var colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink'];
        for (var i in colors) {
            this.arr.push(new Chasm(this, 1, 'black', colors[i], 500, 400, 10, 10, 30 * this.chasm.ratio, 30));
        }
        this.iter = 0;
        this.start = false;
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
        if (this.start) {
            if (this.iter === 0) {
                this.arr[this.arr.length - 2].draw();
            }
            else if (this.iter === 1) {
                this.arr[this.arr.length - 1].draw();
            }
            else {
                this.arr[this.iter - 2].draw();
            }
        }
        if (this.start) {
            if (this.iter === 0) {
                this.arr[this.arr.length - 1].size_y += 8;
                this.arr[this.arr.length - 1].size_x += 8 * this.chasm.ratio;
                this.arr[this.arr.length - 1].draw();
            }
            else {
                this.arr[this.iter - 1].size_y += 8;
                this.arr[this.iter - 1].size_x += 8 * this.chasm.ratio;
                this.arr[this.iter - 1].draw();
            }
        }
        console.log(this.iter);
        this.arr[this.iter].draw();
        this.arr[this.iter].size_y += 8;
        this.arr[this.iter].size_x += 8 * this.chasm.ratio;
        if (this.arr[this.iter].size_y >= this.chasm.size_y / 2) {
            this.iter += 1;
            this.start = true;
        }
        if (this.iter > this.arr.length - 1) {
            this.iter = 0;
        }
        if (this.arr[this.iter].size_y >= this.chasm.size_y / 2) {
            this.arr[this.iter].size_y = 10;
            this.arr[this.iter].size_x = 10;
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

//# sourceMappingURL=cavern.js.map