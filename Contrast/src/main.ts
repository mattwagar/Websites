/*
app: main cavans
layers) (top to bottom)
menu
circles(position)
*/
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return "rgb("+Math.round(r * 255)+","+ Math.round(g * 255)+","+ Math.round(b * 255)+")";
}

class Circle {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  x: number;
  y: number;
  r: number;
  hsl: number[];
  color: string;

  xmin:number;
  xmax:number;
  ymin:number;
  ymax:number;

  constructor(ctx:CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, color: number[]) {
    const vm = this;
    vm.w = w;
    vm.h = h;
    vm.x = x;
    vm.y = y;
    vm.r = r;
    vm.hsl = color;
    vm.color = hslToRgb(vm.hsl[0], vm.hsl[1], vm.hsl[2]);

    // vm.canvas = document.createElement('canvas');
    // vm.ctx = vm.canvas.getContext('2d');
    vm.ctx = ctx;
    vm.sizeCanvas();

    vm.xmin = vm.x - vm.r;
    vm.xmax = vm.x + vm.r;
    vm.ymin = vm.y - vm.r;
    vm.ymax = vm.y + vm.r;

  }

  sizeCanvas() {
    const vm = this;
    vm.w = vm.ctx.canvas.width = window.innerWidth;
    vm.h = vm.ctx.canvas.height = window.innerHeight;

  }

  drawCircle() {
    const vm = this;
    // vm.ctx.clearRect(0,0,vm.w,vm.h);

    
    vm.ctx.beginPath();    
    vm.ctx.arc(vm.x, vm.y, vm.r, 0, Math.PI * 2);
    vm.ctx.fillStyle = vm.color;
    vm.ctx.fill();
    vm.ctx.closePath();
  }

  
}



class App {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  circles: Circle[];
  backgroundC: string;
  backCircle: Circle;
  changing: boolean;

  constructor() {
    const vm = this;
    //Codepen doesn't like casting :'(
    // this.canvas = document.getElementById('canvas');
    vm.canvas = <HTMLCanvasElement>document.getElementById('canvas');
    vm.ctx = vm.canvas.getContext('2d');

    vm.sizeCanvas();
    // vm.initEvents();
    window.requestAnimationFrame((t) => { vm.draw(t); });

    var temp = vm.rnghsl(0.8);

    vm.backgroundC = hslToRgb(temp[0], temp[1], temp[2]);
    vm.circles = [];

    vm.circles[0] = new Circle(vm.ctx, 3*vm.w/12, 5*vm.h/11, vm.w, vm.h, vm.w/5, vm.rnghsl(0.5));
    vm.circles[1] = new Circle(vm.ctx, 9*vm.w/12, 5*vm.h/11, vm.w, vm.h, vm.w/5, vm.rnghsl(0.5));
    vm.circles[2] = new Circle(vm.ctx, 3*vm.w/12, 8*vm.h/11, vm.w, vm.h, vm.w/5, vm.rnghsl(0.5));
    vm.circles[3] = new Circle(vm.ctx, 9*vm.w/12, 8*vm.h/11, vm.w, vm.h, vm.w/5, vm.rnghsl(0.5));

    vm.backCircle = new Circle(vm.ctx, 0,0,0,0,0,"white");
    vm.changing = false;

    
    // vm.circle.drawCircle();
    // vm.ctx.drawImage(vm.circle.canvas, 0, 0);

    vm.canvas.addEventListener('click', function(event){
      for(var i =0; i < vm.circles.length; i++){
        if((event.clientX > vm.circles[i].xmin && event.clientX < vm.circles[i].xmax) && (event.clientY > vm.circles[i].ymin && event.clientY < vm.circles[i].ymax)){
          //1. widen circle (duplicate it) to screen size, and increase lightness lerp?
          //2. set backgroundC to new color
          //3. reset colors 
          //4. transition colors in (small to big)\

          vm.backCircle.x = vm.circles[i].x;
          vm.backCircle.y = vm.circles[i].y;
          vm.backCircle.w = vm.circles[i].w; 
          vm.backCircle.h = vm.circles[i].h; 
          vm.backCircle.r = vm.circles[i].r; 
          vm.backCircle.color = vm.circles[i].color;
          vm.changing = true;
          // vm.backCircle = vm.circles[i];
        }
      }
    })

  }
  initEvents() {
    window.onresize = (e) => { this.sizeCanvas() };
  }
  sizeCanvas() {
    const vm = this;
    vm.w = vm.ctx.canvas.width = window.innerWidth;
    vm.h = vm.ctx.canvas.height = window.innerHeight;
  }
  changeBackColor(color: string){
    const vm = this;
    vm.backgroundC = color;
  }

  rnghsl(l){
    const vm = this;
    var h = (Math.random()*360)/360;
    var s = 1.0;
    return [h,s,l];
  }

  resetColors(){
    const vm = this;
    for(var i =0; i < vm.circles.length; i++){
      vm.circles[i].r = 5;
      vm.circles[i].hsl = vm.rnghsl(0.5);
      vm.circles[i].color = hslToRgb(vm.circles[i].hsl[0], vm.circles[i].hsl[1], vm.circles[i].hsl[2])
    }
  }

  drawCircles(){
    const vm = this;
    for(var i =0; i < vm.circles.length; i++){
      if(vm.circles[i].r < (vm.w/5)){
        vm.circles[i].r = Math.ceil(vm.circles[i].r * 1.08);
      }
      vm.circles[i].drawCircle(); 
    }
  }
  
  draw(t) {
    const vm = this;
    window.requestAnimationFrame((t) => { this.draw(t); });

    if(vm.changing && vm.backCircle.r > vm.h){/*resets values for a split second */
      
      vm.changing = false;
    }
    else if(vm.changing && vm.backCircle.r > vm.h/4){ /*In the process of changing after it passes circles*/
      console.log("lmaowut");
      vm.backCircle.drawCircle();
      vm.backCircle.r = Math.ceil(vm.backCircle.r * 1.08);
      vm.resetColors();
      vm.drawCircles();
    } 
    else if(vm.changing){ /*In the process of changing*/
      vm.drawCircles();
      vm.backCircle.drawCircle();
      vm.backCircle.r = Math.ceil(vm.backCircle.r * 1.08);
    } else { /*Still*/
      vm.backCircle.drawCircle();
      vm.drawCircles();
    }
    
  }
}

var app = new App();