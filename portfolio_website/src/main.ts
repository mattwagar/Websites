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

    translate: number;
    n_translated: number;
    generate_bound:number;

    w: number;
    h: number;
    range_min: number;
    range_max: number;

    y_pos: number;
    x_pos: number;

    constructor(w: number, h: number, range_min: number, range_max: number) {
        const vm = this;
        vm.canvas = document.createElement('canvas');
        vm.canvas.width = w;
        vm.canvas.height = h;
        vm.ctx = vm.canvas.getContext('2d');

        vm.w = w;
        vm.h = h;
        vm.range_min = range_min;
        vm.range_max = range_max;

        vm.left = 0;
        vm.right = w;

        vm.curves = [];
        vm.height = Math.round(h / 2);

        vm.y_pos = rand(0, 4) * 32 * Math.PI / 256;
        vm.x_pos = 0;

        vm.translate = 0;
        vm.n_translated = 1;
        vm.generate_bound = 5000;

        var new_x = 0;
        var new_y = rand(vm.range_min, vm.range_max);


        var slope_y;
        var slope_x;

        var new_slope_x;
        var new_slope_y;

        var tension = 250;

        new_slope_x = new_x + rand(-tension, 0);
        new_slope_y = new_y + rand(-tension, 0);

        vm.curves.push(new Bezier(slope_x, slope_y, new_slope_x, new_slope_y, new_x, new_y));
        
        vm.generate();

        

        console.log(vm.curves);


    }

    generate() {
        const vm = this;

        var new_x = vm.curves[vm.curves.length - 1].x;
        var new_y = vm.curves[vm.curves.length - 1].y;


        var slope_y;
        var slope_x;

        var new_slope_x = vm.curves[vm.curves.length - 1].cp2x;
        var new_slope_y = vm.curves[vm.curves.length - 1].cp2y;;

        var tension = 250;
        

        while (new_x < vm.generate_bound * vm.n_translated) {
            slope_x = 2 * new_x - new_slope_x;
            slope_y = 2 * new_y - new_slope_y;
            new_x += rand(35, 40) * 10;
            // new_y += rand(-150, 150);
            // while (new_y > vm.range_min && new_y > vm.range_max) {
            //     new_y += rand(-150, 150);
            // }
            new_slope_x = new_x + rand(-tension * 3 / 4, -tension / 8);
            new_slope_y = new_y + rand(-tension, -tension / 2);
            vm.curves.push(new Bezier(slope_x, slope_y, new_slope_x, new_slope_y, new_x, new_y));
        }
    }

    increment(increment){
        this.translate += increment;
    }

    animate() {
        const vm = this;
        for (var i = 0; i < vm.curves.length; i++) {
            vm.curves[i].cp2y += Math.sin(vm.y_pos) * vm.h/500;
            vm.curves[i].cp1y -= Math.sin(vm.y_pos) * vm.h/500;
        }
        vm.y_pos += Math.PI / 256;
    }

    conditional() {
        const vm = this;
        if(vm.translate > vm.generate_bound - vm.w){
            
            vm.translate = 0;
            vm.n_translated++;

            console.log(vm.n_translated*vm.generate_bound);
            vm.generate();
            console.log(vm.curves.length);
        }
    }


    draw(color: string) {
        const vm = this;

        vm.conditional();
        vm.animate();
        

        vm.ctx.beginPath();
        vm.ctx.moveTo(0, vm.curves[0].y);
        for (var i = 0; i < vm.curves.length; i++) {
            vm.ctx.bezierCurveTo(vm.curves[i].cp1x, vm.curves[i].cp1y, vm.curves[i].cp2x, vm.curves[i].cp2y, vm.curves[i].x, vm.curves[i].y);
            // vm.ctx.lineTo(vm.curves[i].x, vm.curves[i].y);
        }

        vm.ctx.lineTo(vm.curves[vm.curves.length - 1].x, vm.h);
        vm.ctx.lineTo(-50, vm.h);
        vm.ctx.closePath();
        // vm.ctx.strokeStyle = "rgba(0,0,0,1)";
        // vm.ctx.lineWidth = 1;
        // vm.ctx.stroke();

        var grad = vm.ctx.createLinearGradient(0, vm.curves[0].y - 250, 0, vm.h);
        var opac_color = color.replace(', 1)', ', 0.001)');

        grad.addColorStop(0, opac_color);
        grad.addColorStop(1, color);

        vm.ctx.fillStyle = grad;
        vm.ctx.fill();
    }

}

class App {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    mountain: Mountain;
    mountain2: Mountain;
    mountain3: Mountain;
    mountain4: Mountain;
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

        vm.mountain = new Mountain(vm.w, vm.h, 2 * vm.h / 16, 2 * vm.h / 16 + 25);
        vm.ctx.drawImage(vm.mountain.canvas, 0, 0, this.w, this.h);
        console.log(vm.mountain.ctx)

        vm.mountain2 = new Mountain(vm.w, vm.h, 6 * vm.h / 16, 6 * vm.h / 16 + 25);
        vm.ctx.drawImage(vm.mountain2.canvas, 0, 0, this.w, this.h);

        vm.mountain3 = new Mountain(vm.w, vm.h, 10 * vm.h / 16, 10 * vm.h / 16 + 25);
        vm.ctx.drawImage(vm.mountain3.canvas, 0, 0, this.w, this.h);

        vm.mountain4 = new Mountain(vm.w, vm.h, 14 * vm.h / 16, 14 * vm.h / 16 + 25);
        vm.ctx.drawImage(vm.mountain3.canvas, 0, 0, this.w, this.h);


    }

    sizeCanvas() {
        const vm = this;
        this.w = this.canvas.width = window.innerWidth;
        this.h = this.canvas.height = window.innerHeight;

    }
    draw(t: any) {
        const vm = this;
        window.requestAnimationFrame((t) => { this.draw(t); });

        vm.ctx.clearRect(0, 0, vm.w, vm.h);

        vm.ctx.fillStyle ="rgba(29,98,255, 1)";
        vm.ctx.fill();
        vm.ctx.fillRect(0,0, vm.w, vm.h);

        
        vm.mountain.ctx.clearRect(0, 0, 50000, vm.h);
        vm.mountain.draw("rgba(10, 171, 232, 1)");
        vm.mountain.ctx.translate(-1, 0);
        vm.mountain.increment(1);
        vm.ctx.drawImage(vm.mountain.canvas, 0, 0, this.w, this.h);

        vm.mountain2.ctx.clearRect(0, 0, 50000, vm.h);
        vm.mountain2.draw("rgba(2, 255, 216, 1)");
        vm.mountain2.ctx.translate(-0.8, 0);
        vm.mountain2.increment(0.8);
        vm.ctx.drawImage(vm.mountain2.canvas, 0, 0, this.w, this.h);

        vm.mountain3.ctx.clearRect(0, 0, 50000, vm.h);
        vm.mountain3.draw("rgba(2, 255, 111, 1)");
        vm.mountain3.ctx.translate(-1.8, 0);
        vm.mountain3.increment(1.8);
        
        vm.ctx.drawImage(vm.mountain3.canvas, 0, 0, this.w, this.h);

        vm.mountain4.ctx.clearRect(0, 0, 50000, vm.h);
        vm.mountain4.draw("rgba(27, 255, 11, 1)");
        vm.mountain4.ctx.translate(-1.2, 0);
        vm.mountain4.increment(1.2);
        vm.ctx.drawImage(vm.mountain4.canvas, 0, 0, this.w, this.h);






    }



    initEvents() {
        window.onresize = (e) => {
            this.sizeCanvas();
            this.ctx.drawImage(this.mountain.canvas, 0, 0, this.w, this.h);
        };
    }

}

var app = new App();