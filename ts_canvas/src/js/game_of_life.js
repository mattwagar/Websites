var Quad = (function () {
    function Quad(app, fillcolor, strokecolor, linewidth, x1, y1, x2, y2, x3, y3, x4, y4, alive) {
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
        this.alive = alive;
        this.n = 0;
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
var Grid = (function () {
    function Grid(app, width, height, size) {
        this.app = app;
        this.width = width;
        this.height = height;
        this.size = size;
        this.matrix = new Array;
        var x = 0;
        var y = 0;
        for (var i = 0; i < this.height; i++) {
            this.matrix.push(new Array);
            for (var j = 0; j < this.width; j++) {
                var rng = Math.round(Math.random() / 1.87);
                if (rng) {
                    this.matrix[i].push(new Quad(this.app, 'white', 'black', 1, x, y, x + this.size, y, x + this.size, y + this.size, x, y + this.size, true));
                }
                else {
                    this.matrix[i].push(new Quad(this.app, 'black', 'black', 1, x, y, x + this.size, y, x + this.size, y + this.size, x, y + this.size, false));
                }
                this.matrix[i][j].draw();
                x += this.size;
            }
            x = 0;
            y += this.size;
        }
    }
    Grid.prototype.draw = function () {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.matrix[i][j].draw();
            }
        }
    };
    return Grid;
}());
var Conway = (function () {
    function Conway(grid) {
        this.grid = grid;
    }
    Conway.prototype.check = function () {
        for (var i = 0; i < this.grid.height; i++) {
            for (var j = 0; j < this.grid.width; j++) {
                this.grid.matrix[i][j].n = 0;
                //counts all neighbors (8 surrounding spots) (also checks if a border piece)
                if (i > 0 && j > 0 && this.grid.matrix[i - 1][j - 1].alive) {
                    this.grid.matrix[i][j].n++;
                }
                if (j > 0 && this.grid.matrix[i][j - 1].alive) {
                    this.grid.matrix[i][j].n++;
                }
                if (i < this.grid.matrix.length - 1 && j > 0 && this.grid.matrix[i + 1][j - 1].alive) {
                    this.grid.matrix[i][j].n++;
                }
                if (i > 0 && this.grid.matrix[i - 1][j].alive) {
                    this.grid.matrix[i][j].n++;
                }
                if (i < this.grid.matrix.length - 1 && this.grid.matrix[i + 1][j].alive) {
                    this.grid.matrix[i][j].n++;
                }
                if (i > 0 && j < this.grid.matrix[0].length - 1 && this.grid.matrix[i - 1][j + 1].alive) {
                    this.grid.matrix[i][j].n++;
                }
                if (j < this.grid.matrix[0].length - 1 && this.grid.matrix[i][j + 1].alive) {
                    this.grid.matrix[i][j].n++;
                }
                if (i < this.grid.matrix.length - 1 && j < this.grid.matrix[0].length - 1 && this.grid.matrix[i + 1][j + 1].alive) {
                    this.grid.matrix[i][j].n++;
                }
                //Any live cell with fewer than two live neighbours dies, as if caused by under-population.
                if (this.grid.matrix[i][j].alive && this.grid.matrix[i][j].n < 2) {
                    this.grid.matrix[i][j].alive = false;
                    this.grid.matrix[i][j].fillcolor = 'black';
                }
                else if (this.grid.matrix[i][j].alive && this.grid.matrix[i][j].n === 2 || this.grid.matrix[i][j].n === 3) {
                    this.grid.matrix[i][j].alive = true;
                    this.grid.matrix[i][j].fillcolor = 'white';
                }
                else if (this.grid.matrix[i][j].alive && this.grid.matrix[i][j].n > 3) {
                    this.grid.matrix[i][j].alive = false;
                    this.grid.matrix[i][j].fillcolor = 'black';
                }
                else if (this.grid.matrix[i][j].n === 3) {
                    this.grid.matrix[i][j].alive = true;
                    this.grid.matrix[i][j].fillcolor = 'white';
                }
            }
        }
    };
    return Conway;
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
        var grid = new Grid(this, 100, 100, 2);
        this.conway = new Conway(grid);
        console.log(this.conway.grid);
        this.timer = 0;
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
        this.timer += 1;
        this.conway.check();
        this.conway.grid.draw();
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

//# sourceMappingURL=game_of_life.js.map
