class Quad {

    app: App;
    fillcolor: string;
    strokecolor: string;
    linewidth: number;
    radius: number;
    start: number;
    end: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x3: number;
    y3: number;
    x4: number;
    y4: number;

    alive: boolean;
    n: number;

    constructor(app: App, fillcolor: string, strokecolor: string, linewidth: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, alive: boolean) {
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
    draw() {
        const ctx = this.app.ctx;
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
    }
}

class Grid {
    app: App;

    alive: boolean;

    width: number;
    height: number;
    size: number;
    matrix: any[][];

    constructor(app: App, width: number, height: number, size: number) {

        this.app = app;

        this.width = width;
        this.height = height;

        this.size = size;

        this.matrix = new Array;



        let x = 0;
        let y = 0;
        for (let i = 0; i < this.height; i++) {
            this.matrix.push(new Array);
            for (let j = 0; j < this.width; j++) {
                let rng = Math.round(Math.random() / 1.87);
                if (rng) {
                    this.matrix[i].push(new Quad(this.app, 'white', 'black', 1, x, y, x + this.size, y, x + this.size, y + this.size, x, y + this.size, true));
                } else {
                    this.matrix[i].push(new Quad(this.app, 'black', 'black', 1, x, y, x + this.size, y, x + this.size, y + this.size, x, y + this.size, false));
                }


                this.matrix[i][j].draw();
                x += this.size;
            }
            x = 0;
            y += this.size;
        }
    }
    draw() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.matrix[i][j].draw();
            }
        }
    }
}

class Conway {
    grid: Grid;
    alive: boolean;

    constructor(grid: Grid) {
        this.grid = grid;
    }

    check() {
        for (let i = 0; i < this.grid.height; i++) {
            for (let j = 0; j < this.grid.width; j++) {
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
                //Any live cell with more than three live neighbours dies, as if by over-population.
                else if (this.grid.matrix[i][j].alive && this.grid.matrix[i][j].n > 3) {
                    this.grid.matrix[i][j].alive = false;
                    this.grid.matrix[i][j].fillcolor = 'black';
                } else if (this.grid.matrix[i][j].n === 3) {
                    this.grid.matrix[i][j].alive = true;
                    this.grid.matrix[i][j].fillcolor = 'white';
                }
            }
        }
    }
}

class App {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;

    arr: any[];

    grid: Grid;
    conway: Conway;

    timer: number;


    last_frame: number;


    constructor() {
        //Codepen doesn't like casting :'(
        // this.canvas = document.getElementById('canvas');
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.sizeCanvas();
        this.initEvents();
        window.requestAnimationFrame((t) => { this.draw(t); });
        console.log(this);

        let grid = new Grid(this, 100, 100, 2);
        this.conway = new Conway(grid);

        console.log(this.conway.grid);

        this.timer = 0;


        this.last_frame = null;

    }
    sizeCanvas() {
        this.w = this.ctx.canvas.width = window.innerWidth;
        this.h = this.ctx.canvas.height = window.innerHeight;
    }
    draw(t: any) {
        window.requestAnimationFrame((t) => { this.draw(t); });

        this.ctx.clearRect(0, 0, this.w, this.h);
        this.timer += 1;

        this.conway.check();


        this.conway.grid.draw();

        this.last_frame = t;
    }


    initEvents() {
        window.onresize = (e) => { this.sizeCanvas(); };
    }

    randomPath() {
        return (Math.random() * 2 - 1);
    }

    randomSize() {
        return (Math.random() * 60);
    }

    rngColor() {

        let r = Math.round(Math.random() * 255);
        let b = Math.round(Math.random() * 255);
        let g = Math.round(Math.random() * 255);

        return ('rgb(' + r + ',' + g + ',' + b + ')');

    }
}

var app = new App();