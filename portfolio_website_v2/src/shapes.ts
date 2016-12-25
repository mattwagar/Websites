function rand(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Rectangle {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    w: number;
    h: number;
    // x3: number;
    // y3: number;
    // x4: number;
    // y4: number;
    constructor(x1: number, y1: number, x2: number, y2: number) {
        const vm = this;
        vm.canvas = document.createElement("canvas");

        vm.ctx = vm.canvas.getContext('2d');
        vm.x1 = x1;
        vm.y1 = y1;
        vm.x2 = x2;
        vm.y2 = y2;
        console.log(Math.sqrt((vm.x2*vm.x2)+(vm.y2*vm.y2)));
        vm.w = vm.canvas.width = Math.sqrt((vm.x2*vm.x2)+(vm.y2*vm.y2));
        vm.h = vm.canvas.height = Math.sqrt((vm.x2*vm.x2)+(vm.y2*vm.y2));
    }
    draw() {
        const vm = this;

        vm.ctx.clearRect(0, 0, vm.w, vm.h);

        vm.ctx.beginPath();
        vm.ctx.rect((vm.w-vm.x2)/2, (vm.h-vm.y2)/2, vm.x2, vm.y2);
        vm.ctx.closePath();

        vm.ctx.strokeStyle = 'black';
        vm.ctx.lineWidth = 1;
        vm.ctx.stroke();
    }
    rotate() {
        const vm = this;
        vm.ctx.translate(vm.w / 2, vm.h / 2);
        vm.ctx.rotate(Math.PI / 180);
        vm.ctx.translate(-vm.w / 2, -vm.h / 2);
    }
}

class Triangle {
    ctx: CanvasRenderingContext2D;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x3: number;
    y3: number;
    constructor(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        const vm = this;
        vm.ctx = ctx;
        vm.x1 = x1;
        vm.y1 = y1;
        vm.x2 = x2;
        vm.y2 = y2;
        vm.x3 = x3;
        vm.y3 = y3;
    }
    draw() {
        const vm = this;
        vm.ctx.beginPath();
        vm.ctx.moveTo(vm.x1, vm.y1);
        vm.ctx.lineTo(vm.x2, vm.y2);
        vm.ctx.lineTo(vm.x3, vm.y3);
        vm.ctx.closePath();
    }
}