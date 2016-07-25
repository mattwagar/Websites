class Point {
    app: App;
    x: number;
    y: number;
    c: string;
    constructor(app: App, x: number, y: number, color?: string) {
        this.app = app;
        this.x = x;
        this.y = y;
        this.c = color;
    }

    draw() {
        const ctx = this.app.ctx;
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, 1, 1);
    }
}

class Wave {


    app: App;
    trig: string;
    amp: number;
    period: number;
    x_shift: number;
    y_shift: number;
    length: number;
    pos_x: number;
    pos_y: number;

    strokeColor: string;

    lineWidth: number;

    constructor(app: App, trig: string, amp: number, period: number, x_shift: number, y_shift: number, length: number, pos_x: number, pos_y: number, strokeColor: string) {
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

    Sin(start: number, amp: number, period: number, x_shift: number, y_shift: number): number {
        //Af(Bt - C) + D
        return amp * Math.sin(start * (Math.PI / period) - x_shift) + y_shift;
    }

    Cos(start: number, amp: number, period: number, x_shift: number, y_shift: number): number {
        //Af(Bt - C) + D
        return amp * Math.sin(start * (Math.PI / period) - x_shift) + y_shift;
    }

    Tan(start: number, amp: number, period: number, x_shift: number, y_shift: number): number {
        //Af(Bt - C) + D
        return amp * Math.tan(start * (Math.PI / period) - x_shift) + y_shift;
    }


    draw() {
        const ctx = this.app.ctx;

        ctx.moveTo(this.pos_x, this.pos_y);
        ctx.beginPath();


        for (let start = 0; start <= this.length; start++) {

            switch (this.trig) {
                case 'Sin': { ctx.lineTo(this.pos_x + start, this.pos_y + this.Sin(start, this.amp, this.period, this.x_shift, this.y_shift)); break; }
                case 'Cos': { ctx.lineTo(this.pos_x + start, this.pos_y + this.Cos(start, this.amp, this.period, this.x_shift, this.y_shift)); break; }
                case 'Tan': { ctx.lineTo(this.pos_x + start, this.pos_y + this.Tan(start, this.amp, this.period, this.x_shift, this.y_shift)); break; }
            }

        }

        ctx.lineWidth = this.lineWidth;

        ctx.strokeStyle = this.strokeColor;

        ctx.fillStyle = this.strokeColor;

        ctx.stroke();




    }
}



class App {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;

    point: Point;
    wave: Wave;

    colors: any[];
    arr: any[];

    timer: number;


    last_frame: number;


    constructor() {
        //Codepen doesn't like casting :'(
        // this.canvas = document.getElementById('canvas');

        const vm = this;


        vm.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        vm.ctx = this.canvas.getContext('2d');
        vm.sizeCanvas();
        vm.initEvents();
        window.requestAnimationFrame((t) => { vm.draw(t); });
        console.log(vm);


        vm.timer = 0;

        vm.point = new Point(vm, 0, vm.h / 2, 'black');

        vm.arr = new Array;


        console.log(vm.arr);



        vm.colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink']

        for (let i = 0; i < 20; i++) {
            vm.arr.push(new Wave(vm, 'Sin', 100, 500, i*Math.PI/40, 0, vm.w, 0, vm.h / 2, vm.colors[(i % vm.colors.length)]));
        }

        for (let i = 0; i < 20; i++) {
            vm.arr.push(new Wave(vm, 'Sin', 100, 500, -i*Math.PI/40 + Math.PI - 3*Math.PI/40, 0, vm.w, 0, vm.h / 2, vm.colors[(i % vm.colors.length)]));
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
    sizeCanvas() {
        this.w = this.ctx.canvas.width = window.innerWidth;
        this.h = this.ctx.canvas.height = window.innerHeight;
    }
    draw(t: any) {
        window.requestAnimationFrame((t) => { this.draw(t); });

        this.ctx.clearRect(0, 0, this.w, this.h);

        for (let i = 0; i < this.arr.length/2; i++) {
            this.arr[i].pos_x = this.w / 2;
            this.arr[i].draw();
            this.arr[i].x_shift += .1;
        }
        for (let i = this.arr.length/2; i < this.arr.length; i++) {
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