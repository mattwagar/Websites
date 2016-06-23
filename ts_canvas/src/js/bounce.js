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
        this.x_speed = 0;
        this.y_speed = 0;
        this.x_acc = 0;
        this.y_acc = 0;
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
        this.x_speed += this.x_acc;
        this.x += this.x_speed;
        this.y_speed += this.y_acc;
        this.y += this.y_speed;
    };
    Circle.prototype.gravity = function (y) {
        y ? this.y_acc = y : this.y_acc = 2;
    };
    Circle.prototype.wind = function (x) {
        x ? this.x_acc = x : this.x_acc = 1;
    };
    Circle.prototype.initial_speed_x = function (x) {
        this.x_speed = x;
    };
    Circle.prototype.initial_speed_y = function (y) {
        this.y_speed = y;
    };
    return Circle;
}());
var App = (function () {
    function App() {
        var _this = this;
        //Codepen doesn't like casting :'(
        // this.canvas = document.getElementById('canvas');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.sizeCanvas();
        this.initEvents();
        window.requestAnimationFrame(function (t) { _this.draw(t); });
        console.log(this);
        this.arr = new Array;
        this.createObjs();
    }
    App.prototype.sizeCanvas = function () {
        this.w = this.ctx.canvas.width = window.innerWidth;
        this.h = this.ctx.canvas.height = window.innerHeight - 50;
    };
    App.prototype.draw = function (t) {
        var _this = this;
        window.requestAnimationFrame(function (t) { _this.draw(t); });
        this.ctx.clearRect(0, 0, this.w, this.h);
        for (var i = 0; i < this.arr.length; i++) {
            this.arr[i].draw();
            this.physics(this.arr[i]);
        }
    };
    App.prototype.initEvents = function () {
        var _this = this;
        window.onresize = function (e) { _this.sizeCanvas(); };
    };
    App.prototype.rngPath = function () {
        return (Math.random() * 2 - 1);
    };
    App.prototype.rngPosition_x = function () {
        return (Math.random() * this.w);
    };
    App.prototype.rngPosition_y = function () {
        return (Math.random() * this.h);
    };
    App.prototype.rngSize = function () {
        return (Math.random() * 60);
    };
    App.prototype.rngColor = function () {
        var r = Math.round(Math.random() * 255);
        var b = Math.round(Math.random() * 255);
        var g = Math.round(Math.random() * 255);
        return ('rgb(' + r + ',' + g + ',' + b + ')');
    };
    App.prototype.createObjs = function () {
        for (var i = 0; i < 250; i++) {
            this.arr.push();
            this.arr[i] = new Circle(this, this.rngPosition_x(), this.ctx.canvas.height / 6, this.rngColor(), this.rngColor(), 10, this.rngSize(), 0, 2 * Math.PI);
            this.arr[i].gravity();
            this.arr[i].initial_speed_x(this.rngPath() * 500);
            this.arr[i].initial_speed_y(this.rngPath() * 500);
        }
    };
    //implements wall, floor, and ceiling collisions based on object location... Optimized for Circle class for now...
    App.prototype.physics = function (object) {
        var friction = 0.99;
        var collision = -0.8;
        if (object.x > this.w - object.radius - object.width) {
            object.x = this.w - object.radius - object.width;
            if (Math.abs(object.x_speed) < 0.1) {
                object.x_speed *= 0;
                object.x_acc *= 0;
                object.x = this.ctx.canvas.width - object.radius - object.width;
            }
            else {
                object.x_speed *= collision;
            }
        }
        else if (object.x < object.radius + object.width) {
            object.x = object.radius + object.width;
            if (Math.abs(object.x_speed) < 1) {
                object.x_speed *= 0;
                object.x_acc *= 0;
                object.x = object.radius + object.width;
            }
            else {
                object.x_speed *= collision;
            }
        }
        if (object.y > this.ctx.canvas.height - object.radius - object.width || object.y_acc === 0) {
            object.y = this.ctx.canvas.height - object.radius - object.width;
            console.log(object.y_speed);
            if (Math.abs(object.y_speed) < 5) {
                object.y_speed *= 0;
                object.y_acc *= 0;
                object.y = this.ctx.canvas.height - object.radius - object.width;
            }
            else {
                object.y_speed *= collision;
            }
            object.x_speed *= friction;
        }
        else if (object.y < object.radius + object.width) {
            object.y = object.radius + object.width;
            if (Math.abs(object.y_speed) < 1) {
                object.y_speed *= 0;
                object.y_acc *= 0;
                object.y = object.radius + object.width;
            }
            else {
                object.y_speed *= collision;
            }
        }
    };
    return App;
}());
var app = new App();

//# sourceMappingURL=bounce.js.map
