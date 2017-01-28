/*
app: main cavans
layers) (top to bottom)
menu
circles(position)
*/

class Circle {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  x: number;
  y: number;
  r: number;
  color: string;

  constructor(x: number, y: number, w: number,h: number, r:number, color:string){
    const vm = this;
    vm.w = w;
    vm.h = h;
    vm.x = x;
    vm.y = y;
    vm.r = r;
    vm.color = color;

    vm.canvas = document.createElement('canvas');
    vm.ctx = vm.canvas.getContext('2d');

    vm.sizeCanvas();
  }

  sizeCanvas(){
    const vm = this;
    vm.w = vm.ctx.canvas.width = window.innerWidth;
    vm.h = vm.ctx.canvas.height = window.innerHeight;
  }

  drawCircle(){
    const vm = this;
    // console.log('why');
    // vm.ctx.clearRect(0, 0, vm.w, vm.h);
    vm.ctx.fillStyle = vm.color;
    vm.ctx.fill();
    vm.ctx.arc(vm.x,vm.y, vm.r, 0, Math.PI*2);
  }
}



class App {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;

    circle: Circle;

    constructor() {
        const vm = this;
        //Codepen doesn't like casting :'(
        // this.canvas = document.getElementById('canvas');
        vm.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        vm.ctx = vm.canvas.getContext('2d');

        vm.sizeCanvas();
        vm.initEvents();
        window.requestAnimationFrame((t) => { vm.draw(t); });
        console.log(vm);

        vm.circle = new Circle(50, 50, vm.w, vm.h, 25, '#ff0000');        
        vm.circle.drawCircle();
        
        
        
        
    }
    initEvents() {
      window.onresize = (e) => { this.sizeCanvas() };
    }
    sizeCanvas() {
      const vm = this;
      vm.w = vm.ctx.canvas.width = window.innerWidth;
      vm.h = vm.ctx.canvas.height = window.innerHeight;
      
    }
    draw(t) {
      const vm = this;
      window.requestAnimationFrame((t) => { this.draw(t); });
      vm.ctx.clearRect(0, 0, vm.w, vm.h);

      vm.ctx.drawImage(vm.circle.canvas, 0, 0);
      
      

      // vm.ctx.fillStyle = '#ff0000';
      // vm.ctx.arc(30,30, 10, 0, Math.PI*2);
    }
}

var app = new App();