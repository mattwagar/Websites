class CImage {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    context: CanvasRenderingContext2D;
    src: string;
    x: number;
    y: number;
    w: number;
    h: number;
    cw: number;
    ch: number;
    img: HTMLImageElement;
    imgData: ImageData;
    constructor(context, src) {

        const vm = this;

        // vm.canvas = <HTMLCanvasElement>document.createElement('c');
        // vm.ctx = vm.canvas.getContext('2d');
        vm.context = context;
        vm.src = src;

        vm.canvas = <HTMLCanvasElement>document.createElement('canvas');
        vm.ctx = vm.canvas.getContext('2d');

        vm.cw = 10;
        vm.ch = 10;


        vm.img = new Image;
        console.dir(vm.img);
        vm.img.src = vm.src;

        console.log(vm.ctx);
        vm.img.onload = function () {

            vm.w = vm.ctx.canvas.width = vm.img.width;
            vm.h = vm.ctx.canvas.height = vm.img.height;
            vm.ctx.drawImage(vm.img, 0, 0, vm.w, vm.h)
            vm.imgData = vm.context.getImageData(0, 0, vm.w, vm.h);
            console.log(vm.imgData.data.length / 4);
            console.log('width: ' + vm.imgData.data.length / 4 / vm.h);
            console.log('height: ' + vm.imgData.data.length / 4 / vm.w);

            // vm.context.drawImage(vm.canvas, 0, 0, vm.w, vm.h)
            vm.circle();





            // vm.context.putImageData(vm.imgData, 0, 0);
            // vm.draw();
        }

    }
    circle() {
        const vm = this;

        for (var i = 0; i < vm.imgData.data.length; i += 4) {
            vm.context.beginPath();
            vm.context.arc(i, 5, 5, 0, 2 * Math.PI);
            var color: String = 'rgb(' + vm.imgData.data[i] + ',' + vm.imgData.data[i + 1] + ',' + vm.imgData.data[i + 2] + ')';
            console.log(color); 
            vm.context.fillStyle = color;
            vm.context.fill();
        }

        // for(var i in vm.imgData.data){
        //     vm.imgData.data[i]
        // }

    }
    draw() {
        const vm = this;

        vm.context.putImageData(vm.imgData, 0, 0);

    }
}

class App {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    y: number;

    img: CImage;

    constructor() {
        // this.canvas = document.getElementById('canvas');
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.sizeCanvas();
        this.initEvents();
        window.requestAnimationFrame((t) => { this.draw(t); });

        this.img = new CImage(this.ctx, './content/datboi.jpg');

        this.ctx.beginPath();
        // this.ctx.fillStyle = 'green';
        // this.ctx.fillRect(0, 0, 20, 20);




    }
    sizeCanvas() {
        this.w = this.ctx.canvas.width = window.innerWidth;
        this.h = this.ctx.canvas.height = window.innerHeight;
    }
    initEvents() {
        window.onresize = (e) => { this.sizeCanvas(); };
    }
    draw(t) {
        window.requestAnimationFrame((t) => { this.draw(t); });
        // this.ctx.clearRect(0, 0, this.w, this.h);
        // this.ctx.fillStyle = 'rgba(255,255,255,0.05)';
        // this.ctx.fillRect(0, 0, this.w, this.h);
        // this.img.draw();

    }



}



var app = new App();