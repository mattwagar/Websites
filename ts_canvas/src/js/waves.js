var Point = (function () {
    function Point(app, x, y, color) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.c = color;
    }
    Point.prototype.draw = function () {
        var ctx = this.app.ctx;
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, 1, 1);
    };
    return Point;
}());
var Wave = (function () {
    function Wave(app, trig, amp, period, x_shift, y_shift, length, pos_x, pos_y, strokeColor) {
        this.app = app;
        this.trig = trig;
        this.amp = amp;
        this.period = period;
        this.x_shift = x_shift;
        this.y_shift = y_shift;
        this.lineWidth = 1;
        this.length = length;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.strokeColor = strokeColor;
    }
    Wave.prototype.Sin = function (start, amp, period, x_shift, y_shift) {
        //Af(Bt - C) + D
        return amp * Math.sin(start * (Math.PI / period) - x_shift) + y_shift;
    };
    Wave.prototype.Cos = function (start, amp, period, x_shift, y_shift) {
        //Af(Bt - C) + D
        return amp * Math.sin(start * (Math.PI / period) - x_shift) + y_shift;
    };
    Wave.prototype.Tan = function (start, amp, period, x_shift, y_shift) {
        //Af(Bt - C) + D
        return amp * Math.tan(start * (Math.PI / period) - x_shift) + y_shift;
    };
    Wave.prototype.draw = function () {
        var ctx = this.app.ctx;
        ctx.moveTo(this.pos_x, this.pos_y);
        ctx.beginPath();
        for (var start = 0; start <= this.length; start++) {
            switch (this.trig) {
                case 'Sin': {
                    ctx.lineTo(this.pos_x + start, this.pos_y + this.Sin(start, this.amp, this.period, this.x_shift, this.y_shift));
                    break;
                }
                case 'Cos': {
                    ctx.lineTo(this.pos_x + start, this.pos_y + this.Cos(start, this.amp, this.period, this.x_shift, this.y_shift));
                    break;
                }
                case 'Tan': {
                    ctx.lineTo(this.pos_x + start, this.pos_y + this.Tan(start, this.amp, this.period, this.x_shift, this.y_shift));
                    break;
                }
            }
        }
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.strokeColor;
        ctx.stroke();
    };
    return Wave;
}());
var App = (function () {
    function App() {
        //Codepen doesn't like casting :'(
        // this.canvas = document.getElementById('canvas');
        var vm = this;
        vm.canvas = document.getElementById('canvas');
        vm.ctx = this.canvas.getContext('2d');
        vm.sizeCanvas();
        vm.initEvents();
        window.requestAnimationFrame(function (t) { vm.draw(t); });
        console.log(vm);
        vm.timer = 0;
        vm.point = new Point(vm, 0, vm.h / 2, 'black');
        vm.arr = new Array;
        console.log(vm.arr);
        vm.colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink'];
        for (var i = 0; i < 20; i++) {
            vm.arr.push(new Wave(vm, 'Sin', 100, 500, i * Math.PI / 40, 0, vm.w, 0, vm.h / 2, vm.colors[(i % vm.colors.length)]));
        }
        for (var i = 0; i < 20; i++) {
            vm.arr.push(new Wave(vm, 'Sin', 100, 500, -i * Math.PI / 40 + Math.PI - 3 * Math.PI / 40, 0, vm.w, 0, vm.h / 2, vm.colors[(i % vm.colors.length)]));
        }
        // setTimeout(function () {
        //     setInterval(function () {
        //         vm.arr.push(new Wave(vm, 'Sin', 100, 500, 0, 0, vm.w, 0, vm.h / 2, vm.colors[(vm.iter % vm.colors.length)]));
        //         vm.iter++;
        //     }, 100);
        // }, 300);
        // setTimeout(function () {
        //     setInterval(function () {
        //         vm.arr.pop();
        //     }, 100);
        // }, 5000);
        this.last_frame = null;
    }
    App.prototype.sizeCanvas = function () {
        this.w = this.ctx.canvas.width = window.innerWidth;
        this.h = this.ctx.canvas.height = window.innerHeight;
    };
    App.prototype.draw = function (t) {
        var _this = this;
        window.requestAnimationFrame(function (t) { _this.draw(t); });
        this.ctx.clearRect(0, 0, this.w, this.h);
        for (var i = 0; i < this.arr.length / 2; i++) {
            this.arr[i].pos_x = this.w / 2;
            this.arr[i].draw();
            this.arr[i].x_shift += .1;
        }
        for (var i = this.arr.length / 2; i < this.arr.length; i++) {
            // this.arr[i].pos_x = this.w / 2;
            this.arr[i].length = this.w / 2;
            this.arr[i].draw();
            this.arr[i].x_shift -= .1;
        }
        // for (let i in this.arr) {
        //     this.arr[i].draw();
        //     this.arr[i].x_shift += .1;
        //     this.arr[i].amp += .1;
        // }
        this.last_frame = t;
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

//# sourceMappingURL=waves.js.map
