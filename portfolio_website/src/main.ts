function rand(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Bezier {
    cp1x: number;
    cp1y: number;
    cp2x: number;
    cp2y: number;
    x: number;
    y: number;

    constructor(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
        const vm = this;
        vm.cp1x = cp1x;
        vm.cp1y = cp1y;
        vm.cp2x = cp2x;
        vm.cp2y = cp2y;
        vm.x = x;
        vm.y = y;
    }
}



class Mountain {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    left: number;
    right: number;
    curves: Bezier[];
    height: number;

    w: number;
    h: number;

    constructor(w: number, h: number) {
        const vm = this;
        vm.canvas = document.createElement('canvas');
        vm.canvas.width = w;
        vm.canvas.height = h;
        vm.ctx = vm.canvas.getContext('2d');

        vm.w = w;
        vm.h = h;



        console.dir(vm.canvas);


        vm.left = 0;
        vm.right = w;

        vm.curves = [];
        vm.height = Math.round(h / 2);

        var new_x = 0;
        var new_y = rand(vm.height - 3, vm.height + 3);;


        var slope_y;
        var slope_x;

        var new_slope_x;
        var new_slope_y;

        var tension = 400;

        new_slope_x = new_x + rand(-tension, 0);
        new_slope_y = new_y + rand(-tension, 0);

        vm.curves.push(new Bezier(slope_x, slope_y, new_slope_x, new_slope_y, new_x, new_y));


        while (new_x < 5000) {

            slope_x = 2 * new_x - new_slope_x;
            slope_y = 2 * new_y - new_slope_y;

            new_x += 400;
            new_y += rand(-150, 150);

            new_slope_x = new_x + rand(-tension * 3 / 4, -tension / 8);
            new_slope_y = new_y + rand(-tension, -tension / 2);

            vm.curves.push(new Bezier(slope_x, slope_y, new_slope_x, new_slope_y, new_x, new_y));



        }

        console.log(vm.curves);


    }


    draw() {
        const vm = this;
        vm.ctx.beginPath();
        vm.ctx.moveTo(0, vm.height);
        for (var i = 0; i < vm.curves.length; i++) {
            vm.ctx.bezierCurveTo(vm.curves[i].cp1x, vm.curves[i].cp1y, vm.curves[i].cp2x, vm.curves[i].cp2y, vm.curves[i].x, vm.curves[i].y);
            // vm.ctx.lineTo(vm.curves[i].x, vm.curves[i].y);
        }

        vm.ctx.lineTo(vm.curves[vm.curves.length - 1].x, vm.h);
        vm.ctx.lineTo(-50, vm.h);
        vm.ctx.closePath();
        // vm.ctx.closePath();
        vm.ctx.strokeStyle = "rgba(0,0,0,1)";
        vm.ctx.lineWidth = 1;
        vm.ctx.stroke();

        vm.ctx.fillStyle = "rgba(0,0,0,1)";
        vm.ctx.fill();
    }

}

class App {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    mountain: Mountain;
    offset: number;


    constructor() {
        //Codepen doesn't like generics :'(
        // this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        const vm = this;

        vm.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        vm.ctx = vm.canvas.getContext('2d');

        vm.sizeCanvas();
        vm.initEvents();
        window.requestAnimationFrame((t) => { vm.draw(t); });
        console.log(vm);

        vm.mountain = new Mountain(vm.w, vm.h);

        vm.mountain.draw();

        vm.offset = 0;

        vm.ctx.drawImage(vm.mountain.canvas, 0, 0, this.w, this.h);


    }

    sizeCanvas() {
        const vm = this;
        this.w = this.canvas.width = window.innerWidth;
        this.h = this.canvas.height = window.innerHeight;

    }
    draw(t: any) {
        const vm = this;
        window.requestAnimationFrame((t) => { this.draw(t); });

        vm.ctx.clearRect(0,0,vm.w, vm.h);

        
        vm.offset+=1;
        vm.mountain.ctx.clearRect(0,0,50000, vm.h);
        vm.mountain.draw();
        vm.mountain.ctx.translate(-5, 0);
        vm.ctx.drawImage(vm.mountain.canvas, 0, 0, this.w, this.h);
        
        

        


    }



    initEvents() {
        window.onresize = (e) => {
            this.sizeCanvas();
            this.ctx.drawImage(this.mountain.canvas, 0, 0, this.w, this.h);
        };
    }

}

var app = new App();