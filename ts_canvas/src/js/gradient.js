var Cloud = (function () {
    function Cloud(ctx, src, x, y) {
        this.ctx = ctx;
        this.src = src;
        this.x = x;
        this.y = y;
        this.img = new Image;
        console.dir(this.img);
        this.img.src = this.src;
    }
    Cloud.prototype.draw = function () {
        this.ctx.drawImage(this.img, this.x, this.y, Math.round(this.img.width / 3), Math.round(this.img.height / 3));
    };
    return Cloud;
}());
var Grad = (function () {
    function Grad(ctx, c1, c2, x, y, w, h) {
        this.ctx = ctx;
        this.c1 = c1;
        this.c2 = c2;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    Grad.prototype.draw = function () {
        this.grad = this.ctx.createLinearGradient(0, this.y, 0, this.y + this.h);
        this.grad.addColorStop(0, this.c1);
        // this.grad.addColorStop(0.7, this.c1);
        this.grad.addColorStop(1, this.c2);
        this.ctx.beginPath();
        this.ctx.fillStyle = this.grad;
        this.ctx.rect(this.x, this.y, this.w, this.h);
        this.ctx.fill();
    };
    return Grad;
}());
var Line = (function () {
    function Line(ctx, c, y, w) {
        this.ctx = ctx;
        this.c = c;
        this.y = y;
        this.w = w;
    }
    Line.prototype.draw = function () {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.c;
        this.ctx.moveTo(0, this.y);
        this.ctx.lineTo(this.w, this.y);
        this.ctx.stroke();
    };
    return Line;
}());
var App = (function () {
    function App() {
        var _this = this;
        // this.canvas = document.getElementById('canvas');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.sizeCanvas();
        this.initEvents();
        window.requestAnimationFrame(function (t) { _this.draw(t); });
        var h = this.h;
        this.rate = 5;
        this.lines = this.h / 5;
        this.waveRate = 100;
        this.waveSpeed = Math.PI / this.waveRate;
        this.wave;
        this.cloud = new Cloud(this.ctx, './content/cloud.png', -200, 300);
        this.cloud2 = new Cloud(this.ctx, './content/cloud2.png', -200, 10);
        this.cloud3 = new Cloud(this.ctx, './content/cloud4.png', 0, 0);
        this.line = [];
        for (var i = 0; i < this.lines; i++) {
            this.line.push(new Line(this.ctx, 'white', i * 5, this.w));
        }
        this.grad = [];
        this.grad.push(new Grad(this.ctx, 'rgb(0,206,209)', 'rgb(200, 70, 200)', 0, 0, this.w, this.h * 2));
        this.grad.push(new Grad(this.ctx, 'rgb(200, 70, 200)', 'rgb(0,206,209)', 0, -this.h * 2, this.w, this.h * 2));
        // this.grad.push(new Grad(this.ctx, 'rgb(0,206,209)', 'rgb(255, 100, 255)', 0, -this.h * 2, this.w, this.h));
    }
    App.prototype.sizeCanvas = function () {
        this.w = this.ctx.canvas.width = window.innerWidth;
        this.h = this.ctx.canvas.height = window.innerHeight;
    };
    App.prototype.initEvents = function () {
        var _this = this;
        window.onresize = function (e) { _this.sizeCanvas(); };
    };
    App.prototype.gradient = function () {
        // if (this.grad[0].y > this.h && this.grad[0].c1 === 'rgb(0,206,209)') {
        //     // console.log('1');
        //     this.grad.shift();
        //     this.grad.push(new Grad(this.ctx, 'rgb(255, 100, 255)', 'rgb(0,206,209)', 0, -this.h * 2 + this.rate, this.w, this.h + 30));
        // } else if (this.grad[0].y > this.h && this.grad[0].c1 === 'rgb(255, 100, 255)') {
        //     // console.log('2');
        // }
        for (var i in this.grad) {
            this.grad[i].draw();
            this.grad[i].y += this.rate;
            if (this.grad[i].y > this.h) {
                this.grad[i].y = -this.h * 3 + this.rate;
            }
        }
    };
    App.prototype.sinLines = function () {
        this.waveSpeed += Math.PI / this.waveRate;
        for (var i = 0; i < this.line.length; i++) {
            var increment = Math.PI / (this.waveRate / 5);
            switch (i % 5) {
                case 0:
                    this.line[i].c = 'rgb(' + Math.ceil((Math.sin(this.waveSpeed + increment) + 1) * 127.5) + ',' + Math.ceil((Math.sin(this.waveSpeed + increment) + 1) * 127.5) + ',' + Math.ceil((Math.sin(this.waveSpeed + increment) + 1) * 127.5) + ')';
                    break;
                case 1:
                    this.line[i].c = 'rgb(' + Math.ceil((Math.sin(this.waveSpeed + 2 * increment) + 1) * 127.5) + ',' + Math.ceil((Math.sin(this.waveSpeed + 2 * increment) + 1) * 127.5) + ',' + Math.ceil((Math.sin(this.waveSpeed + 2 * increment) + 1) * 127.5) + ')';
                    break;
                case 2:
                    this.line[i].c = 'rgb(' + Math.ceil((Math.sin(this.waveSpeed + 3 * increment) + 1) * 127.5) + ',' + Math.ceil((Math.sin(this.waveSpeed + 3 * increment) + 1) * 127.5) + ',' + Math.ceil((Math.sin(this.waveSpeed + 3 * increment) + 1) * 127.5) + ')';
                    break;
                case 3:
                    this.line[i].c = 'rgb(' + Math.ceil((Math.sin(this.waveSpeed + 4 * increment) + 1) * 127.5) + ',' + Math.ceil((Math.sin(this.waveSpeed + 4 * increment) + 1) * 127.5) + ',' + Math.ceil((Math.sin(this.waveSpeed + 4 * increment) + 1) * 127.5) + ')';
                    break;
                case 4:
                    this.line[i].c = 'rgb(' + Math.ceil((Math.sin(this.waveSpeed + 5 * increment) + 1) * 127.5) + ',' + Math.ceil((Math.sin(this.waveSpeed + 5 * increment) + 1) * 127.5) + ',' + Math.ceil((Math.sin(this.waveSpeed + 5 * increment) + 1) * 127.5) + ')';
                    break;
            }
            this.line[i].draw();
        }
    };
    App.prototype.cloudMove = function () {
        this.cloud.x += 1 / 2;
        this.cloud.draw();
        this.cloud2.x += 2 / 2;
        this.cloud2.draw();
        this.cloud3.x += 3 / 2;
        this.cloud3.draw();
        if (this.cloud.x > this.w + 50) {
            this.cloud.x = -this.cloud.img.width / 3 - 50;
            this.cloud.y = Math.random() * this.h - 200;
        }
        if (this.cloud2.x > this.w + 50) {
            this.cloud2.x = -this.cloud2.img.width / 3 - 50;
            this.cloud2.y = Math.random() * this.h - 200;
        }
        if (this.cloud3.x > this.w + 50) {
            this.cloud3.x = -this.cloud3.img.width / 3 - 50;
            this.cloud3.y = Math.random() * this.h - 200;
        }
    };
    App.prototype.draw = function (t) {
        var _this = this;
        window.requestAnimationFrame(function (t) { _this.draw(t); });
        // this.ctx.clearRect(0, 0, this.w, this.h);
        // this.ctx.fillStyle = 'rgba(255,255,255,0.05)';
        // this.ctx.fillRect(0, 0, this.w, this.h);
        this.gradient();
        this.sinLines();
        this.cloudMove();
    };
    return App;
}());
var app = new App();

//# sourceMappingURL=gradient.js.map
