
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


class App {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    circle: Circle;
    circle2: Circle;
    arr: any[];

  constructor() {
    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.sizeCanvas();
    this.initEvents();
    window.requestAnimationFrame((t) => {this.draw(t); });
    console.log(this);

    this.arr = new Array;


    for (let i = 0; i < 50; i++) {
        this.arr.push(new Circle(this, this.ctx.canvas.width/2, this.ctx.canvas.height/2, this.rngColor(), this.rngColor(), 10, this.randomSize(), 0, 2 * Math.PI));
    }

  }
  sizeCanvas() {
    this.w = this.ctx.canvas.width = window.innerWidth;
    this.h = this.ctx.canvas.height = window.innerHeight;
  }
  draw(t) {
    window.requestAnimationFrame((t) => {this.draw(t); });

    
    for (let i in this.arr) {
        this.arr[i].draw();
        this.arr[i].x += this.randomPath() * 15;
        this.arr[i].y += this.randomPath() * 15;

        if (this.arr[i].x > this.ctx.canvas.width - 15) {
            this.arr[i].x = this.ctx.canvas.width - 15;
        }
        else if (this.arr[i].x < 15) {
            this.arr[i].x = 15;
        }
        if (this.arr[i].y > this.ctx.canvas.height - 15) {
            this.arr[i].y = this.ctx.canvas.height - 15;
        }
        else if (this.arr[i].y < 15) {
            this.arr[i].y = 15;
        } 
    }

    

  }
  initEvents() {
    window.onresize = (e)=>{this.sizeCanvas()};
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