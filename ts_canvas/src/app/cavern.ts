
class Circle {

    app: App;
    x: number;
    y: number;
    fillcolor: string;
    strokecolor: string;
    width: number;
    radius: number;
    start: number;
    end: number;

    constructor(app: App, x: number, y: number, fillcolor: string, strokecolor: string, width: number, radius: number, start: number, end: number) {
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
    draw() {
        const ctx = this.app.ctx;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.start, this.end);
        ctx.strokeStyle = this.strokecolor;
        ctx.lineWidth = this.width;
        ctx.stroke();
        ctx.fillStyle = this.fillcolor;
        ctx.fill();
    }
}

class Tri {

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

    constructor(app: App, fillcolor: string, strokecolor: string, linewidth: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
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

    }
    draw() {
        const ctx = this.app.ctx;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.lineTo(this.x3, this.y3);
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

    constructor(app: App, fillcolor: string, strokecolor: string, linewidth: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
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

class Chasm {
    app: App;

    linewidth: number;
    fillcolor: string;
    strokecolor: string;

    ratio: number;

    wall_left: Quad;
    wall_right: Quad;
    wall_top: Quad;
    wall_bot: Quad;
    wall_middle: Quad;
    pos_x: number;
    pos_y: number;
    size_x: number;
    size_y: number;
    middle_x: number;
    middle_y: number;
    grd: CanvasGradient;
    constructor(app: App, linewidth: number, fillcolor: string, strokecolor: string, pos_x: number, pos_y: number, size_x: number, size_y: number, middle_x: number, middle_y: number) {
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
    draw() {
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
    }
}


class App {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    chasm: Chasm;
    player: Tri;
    arr: any[];
    iter: number;
    start: boolean;
    frequency: number;
    speed: number;

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.sizeCanvas();
        this.initEvents();
        window.requestAnimationFrame((t) => { this.draw(t); });
        console.log(this);

        this.chasm = new Chasm(this, 1, 'black', 'black', 500, 400, 300, 250, 10, 10);

        this.player = new Tri(this, 'black', 'white', 2, 480, 600, 500, 550, 520, 600);


        this.arr = new Array;
        let colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink'];
        for (let i in colors) {
            this.arr.push(new Chasm(this, 1, 'black', colors[i], 500, 400, 10, 10, 30 * this.chasm.ratio, 30));
        }

        this.iter = 0;

        this.start = false;

        this.frequency = 3;
        this.speed = 6;

    }
    sizeCanvas() {
        this.w = this.ctx.canvas.width = window.innerWidth;
        this.h = this.ctx.canvas.height = window.innerHeight;
    }
    draw(t) {
        window.addEventListener('keydown', this.keyPress, false);

        window.requestAnimationFrame((t) => { this.draw(t); });
        this.ctx.clearRect(0, 0, this.w, this.h);
        // this.chasm.draw();
        this.background();

        this.player.draw();
    }

    keyPress(e) {
        var code = e.keyCode;
        console.log(this.player);
    switch (code) {
        case 37: left(this.player); break; //Left key
        case 38: up(this.player); break; //Up key
        case 39: right(this.player); break; //Right key
        case 40: down(this.player); break; //Down key
        default: alert(code); //Everything else
    }

    function left(tri) {

        console.log(tri);

        tri.x1 -= 1;
        tri.x2 -= 1;
        tri.x3 -= 1;
    }
    function right(tri) {
        tri.x1 += 1;
        tri.x2 += 1;
        tri.x3 += 1;
    }
    function down(tri) {
        tri.y1 -= 1;
        tri.y2 -= 1;
        tri.y3 -= 1;
    }
    function up(tri) {
        tri.y1 -= 1;
        tri.y2 -= 1;
        tri.y3 -= 1;
    }



    }


    initEvents() {
        window.onresize = (e) => { this.sizeCanvas() };
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

    background() {
        if (this.start) {

            //iter - 3/3 -- background one
            for (let i = 0; i < this.frequency; i++) {
                if (this.iter >= this.frequency) {
                    // console.log(this.iter);
                    this.arr[this.iter - this.frequency].draw();
                } else {
                    this.arr[this.arr.length - this.frequency + i].draw();
                    // console.log(this.iter);
                }
            }

            //     //the middle parts
            //     for (let j = 1; j <= (this.frequency - 1); j++) {

            //         for (let k = 0; k < j; k++) {
            //             if (this.iter === k) {
            //                 this.arr[this.arr.length - 1 - k].size_y += this.speed;
            //                 this.arr[this.arr.length - 1 - k].size_x += this.speed * this.chasm.ratio;
            //                 this.arr[this.arr.length - 1 - k].draw();
            //             }
            //         }
            //     } else {
            //         this.arr[this.iter - j].size_y += this.speed;
            //         this.arr[this.iter - j].size_x += this.speed * this.chasm.ratio;
            //         this.arr[this.iter - j].draw();
            //     }
            // }


            //iter - 2/3
            if (this.iter === 0) {
                this.arr[this.arr.length - 2].size_y += this.speed;
                this.arr[this.arr.length - 2].size_x += this.speed * this.chasm.ratio;
                this.arr[this.arr.length - 2].draw();
            } else if (this.iter === 1) {
                this.arr[this.arr.length - 1].size_y += this.speed;
                this.arr[this.arr.length - 1].size_x += this.speed * this.chasm.ratio;
                this.arr[this.arr.length - 1].draw();
            } else {
                this.arr[this.iter - 2].size_y += this.speed;
                this.arr[this.iter - 2].size_x += this.speed * this.chasm.ratio;
                this.arr[this.iter - 2].draw();
            }

            //iter - 1/3
            if (this.iter === 0) {
                this.arr[this.arr.length - 1].size_y += this.speed;
                this.arr[this.arr.length - 1].size_x += this.speed * this.chasm.ratio;
                this.arr[this.arr.length - 1].draw();
            } else {
                this.arr[this.iter - 1].size_y += this.speed;
                this.arr[this.iter - 1].size_x += this.speed * this.chasm.ratio;
                this.arr[this.iter - 1].draw();
            }

        }

        //current iter -- 0/3
        this.arr[this.iter].draw();
        this.arr[this.iter].size_y += this.speed;
        this.arr[this.iter].size_x += this.speed * this.chasm.ratio;

        if (this.arr[this.iter].size_y >= this.chasm.size_y / this.frequency) {
            this.iter += 1;
            this.start = true;
        }

        if (this.iter > this.arr.length - 1) {
            this.iter = 0;
        }

        if (this.arr[this.iter].size_y >= this.chasm.size_y / this.frequency) {
            this.arr[this.iter].size_y = 10;
            this.arr[this.iter].size_x = 10;
        }
    }



}

var app = new App();