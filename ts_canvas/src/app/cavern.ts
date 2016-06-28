
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
    speed: number;

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

        this.speed = 0.3;

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
        this.grd.addColorStop(0, 'black');
        this.grd.addColorStop(1, 'white');


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
    player1: Quad;
    player2: Quad;
    player3: Quad;
    player4: Tri;
    arr: any[];
    iter: number;
    start: boolean;
    frequency: number;
    speed: number;

    up_pressed: boolean;
    down_pressed: boolean;
    left_pressed: boolean;
    right_pressed: boolean;
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

        this.chasm = new Chasm(this, 1, 'black', 'black', 300, 300, 300, 250, 10, 10);

        this.player = new Tri(this, 'black', 'white', 1, this.chasm.pos_x - 20, this.chasm.pos_y, this.chasm.pos_x, this.chasm.pos_y, this.chasm.pos_x + 20, this.chasm.pos_y);
        this.player1 = new Quad(this, 'black', 'white', 1, this.player.x1, this.player.y1, this.player.x3, this.player.y3, this.player.x3, this.player.y3 + 20, this.player.x1, this.player.y1 + 20);
        this.player2 = new Quad(this, 'black', 'white', 1, this.player.x1, this.player.y1, this.player.x2, this.player.y2, this.player.x2, this.player.y2 + 20, this.player.x1, this.player.y1 + 20);
        this.player3 = new Quad(this, 'black', 'white', 1, this.player.x3, this.player.y3, this.player.x2, this.player.y2, this.player.x2, this.player.y2 + 20, this.player.x3, this.player.y3 + 20);
        this.player4 = new Tri(this, 'black', 'white', 1, this.player.x1, this.player.y1 + 20, this.player.x2, this.player.y2 + 20, this.player.x3, this.player.x3 + 20);
        this.arr = new Array;
        let colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink'];
        for (let i in colors) {
            this.arr.push(new Chasm(this, 1, 'black', colors[i], 300, 300, 10, 10, 30 * this.chasm.ratio, 30));
        }

        this.iter = 0;
        this.start = false;
        this.frequency = 3;
        this.speed = 6;

        this.up_pressed = false;
        this.down_pressed = false;
        this.left_pressed = false;
        this.right_pressed = false;

        this.last_frame = null;

    }
    sizeCanvas() {
        this.w = this.ctx.canvas.width = 700;
        this.h = this.ctx.canvas.height = 600;
    }
    draw(t: any) {
        window.requestAnimationFrame((t) => { this.draw(t); });


        this.ctx.clearRect(0, 0, this.w, this.h);
        // this.chasm.draw();
        this.background();
        this.draw_player(t);

        this.last_frame = t;
    }

    keyDown(e: any) {
        var code = e.keyCode;
        switch (code) {
            case 37: this.left_pressed = true; break; //Left key
            case 38: this.up_pressed = true; break; //Up key
            case 39: this.right_pressed = true; break; //Right key
            case 40: this.down_pressed = true; break; //Down key
        }
    }
    keyUp(e: any) {
        var code = e.keyCode;
        switch (code) {
            case 37: this.left_pressed = false; break; //Left key
            case 38: this.up_pressed = false; break; //Up key
            case 39: this.right_pressed = false; break; //Right key
            case 40: this.down_pressed = false; break; //Down key
        }
    }


    initEvents() {
        window.onresize = (e) => { this.sizeCanvas(); };
        window.addEventListener('keydown', event => this.keyDown(event));
        window.addEventListener('keyup', event => this.keyUp(event));
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

    draw_player(t: any) {

        let delta = t - (this.last_frame || t);

        if (this.left_pressed) {
            console.log(this.player.x2);
            this.player.x1 -= this.player.speed * delta;
            this.player.x2 -= this.player.speed * delta / 1.3;
            this.player.x3 -= this.player.speed * delta;

            this.player1.x1 = this.player.x1;
            this.player1.x2 = this.player.x3;
            this.player1.x3 = this.player.x3;
            this.player1.x4 = this.player.x1;

            this.player2.x1 = this.player.x1;
            this.player2.x2 = this.player.x2;
            this.player2.x3 = this.player.x2;
            this.player2.x4 = this.player.x1;

            this.player3.x1 = this.player.x3;
            this.player3.x2 = this.player.x2;
            this.player3.x3 = this.player.x2;
            this.player3.x4 = this.player.x3;

            this.player4.x1 = this.player.x1;
            this.player4.x2 = this.player.x2;
            this.player4.x3 = this.player.x3;
        }
        if (this.up_pressed) {
            console.log(this.player.y2);
            this.player.y1 -= this.player.speed * delta;
            this.player.y2 -= this.player.speed * delta / 1.3;
            this.player.y3 -= this.player.speed * delta;

            this.player1.y1 = this.player.y1;
            this.player1.y2 = this.player.y3;
            this.player1.y3 = this.player.y3 + 20;
            this.player1.y4 = this.player.y1 + 20;

            this.player2.y1 = this.player.y1;
            this.player2.y2 = this.player.y2;
            this.player2.y3 = this.player.y2 + 20;
            this.player2.y4 = this.player.y1 + 20;

            this.player3.y1 = this.player.y3;
            this.player3.y2 = this.player.y2;
            this.player3.y3 = this.player.y2 + 20;
            this.player3.y4 = this.player.y3 + 20;

            this.player4.y1 = this.player.y1 + 20;
            this.player4.y2 = this.player.y2 + 20;
            this.player4.y3 = this.player.y3 + 20;
        }
        if (this.right_pressed) {
            console.log(this.player.x2);
            this.player.x1 += this.player.speed * delta;
            this.player.x2 += this.player.speed * delta / 1.3;
            this.player.x3 += this.player.speed * delta;

            this.player1.x1 = this.player.x1;
            this.player1.x2 = this.player.x3;
            this.player1.x3 = this.player.x3;
            this.player1.x4 = this.player.x1;

            this.player2.x1 = this.player.x1;
            this.player2.x2 = this.player.x2;
            this.player2.x3 = this.player.x2;
            this.player2.x4 = this.player.x1;

            this.player3.x1 = this.player.x3;
            this.player3.x2 = this.player.x2;
            this.player3.x3 = this.player.x2;
            this.player3.x4 = this.player.x3;

            this.player4.x1 = this.player.x1;
            this.player4.x2 = this.player.x2;
            this.player4.x3 = this.player.x3;
        }
        if (this.down_pressed) {
            console.log(this.player.y2);
            this.player.y1 += this.player.speed * delta;
            this.player.y2 += this.player.speed * delta / 1.3;
            this.player.y3 += this.player.speed * delta;

            this.player1.y1 = this.player.y1;
            this.player1.y2 = this.player.y3;
            this.player1.y3 = this.player.y3 + 20;
            this.player1.y4 = this.player.y1 + 20;

            this.player2.y1 = this.player.y1;
            this.player2.y2 = this.player.y2;
            this.player2.y3 = this.player.y2 + 20;
            this.player2.y4 = this.player.y1 + 20;

            this.player3.y1 = this.player.y3;
            this.player3.y2 = this.player.y2;
            this.player3.y3 = this.player.y2 + 20;
            this.player3.y4 = this.player.y3 + 20;

            this.player4.y1 = this.player.y1 + 20;
            this.player4.y2 = this.player.y2 + 20;
            this.player4.y3 = this.player.y3 + 20;
        }




        if (this.player.x2 < this.arr[0].pos_x) {
            this.player3.draw();
        } else {
            this.player2.draw();
        }

        if (this.player.y2 < this.arr[0].pos_y) {
            this.player4.draw();
        } else {
            this.player.draw();
        }


        this.player1.draw();
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