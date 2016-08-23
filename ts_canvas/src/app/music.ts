

// class Line {


//     constructor() {

//     }
//     draw() {

//     }
// }


class App {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    lines: number;
    arr: any[];
    iter: number;
    red: number;
    blue: number;
    toggle: boolean;
    num: number;

    constructor() {
        //Codepen doesn't like casting :'(
        // this.canvas = document.getElementById('canvas');
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');


        this.sizeCanvas();
        this.initEvents();
        window.requestAnimationFrame((t) => { this.draw(t); });
        console.log(this);

        this.lines = this.h;

        this.iter = 0;
        this.num = 0;

        this.toggle = true;
        this.red = 255;
        this.blue = 0;

        this.background();

    }
    initEvents() {
        window.onresize = (e) => { this.sizeCanvas() };
    }
    sizeCanvas() {
        this.w = this.ctx.canvas.width = window.innerWidth;
        this.h = this.ctx.canvas.height = window.innerHeight - 50;
    }
    background() {

        var red = 255;
        var blue = 0;

        for (var i = this.iter; i < this.lines; i += 3) {

            if (this.toggle) {
                red -= 3;
                blue = 255 - red;
                if (red <= 0) {
                    this.toggle = false;
                }
            } else {
                blue -= 3;
                red = 255 - blue;
                if (blue <= 0) {
                    this.toggle = true;
                }
            }
            this.ctx.strokeStyle = 'rgb(' + red + ', 0, ' + blue + ')';
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * 2);
            this.ctx.lineTo(this.w, i * 2);
            this.ctx.stroke();
        }
    }
    draw(t) {
        window.requestAnimationFrame((t) => { this.draw(t); });

        // this.ctx.clearRect(-100, -100, this.w+100, this.h+100);

        // this.iter += 1;
        

        this.num += 1;

        this.ctx.translate(0, this.num);
        
        // if (this.num > 3) {
        //     this.ctx.translate(0, -3)
        // }
    }
}

var app = new App();