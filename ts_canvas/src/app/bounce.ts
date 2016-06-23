interface Vector {
    x_speed: number;
    y_speed: number;
    x_acc: number;
    y_acc: number;
}

class Circle implements Vector {

    //Connecting canvas to object
    app: App;
    
    //Arc properties
    x: number;
    y: number;
    fillcolor: string;
    strokecolor: string;
    width: number;
    radius: number;
    start: number;
    end: number;

    //Vector interface
    x_speed: number;
    y_speed: number;
    x_acc: number;
    y_acc: number;

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

    this.x_speed = 0;
    this.y_speed = 0;
    this.x_acc = 0;
    this.y_acc = 0;
  }
  draw(): void {
    const ctx = this.app.ctx;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, this.start, this.end);
    ctx.strokeStyle = this.strokecolor;
    ctx.lineWidth = this.width;
    ctx.stroke();
    ctx.fillStyle = this.fillcolor;
    ctx.fill();

    this.x_speed += this.x_acc;
    this.x += this.x_speed;

    this.y_speed += this.y_acc;
    this.y += this.y_speed;
  }
  gravity(y?:number): void {
    y ? this.y_acc = y : this.y_acc = 2;
  }

  wind(x?:number): void {
    x ? this.x_acc = x : this.x_acc = 1;
  }

  initial_speed_x(x): void {
      this.x_speed = x;
  }

  initial_speed_y(y): void {
      this.y_speed = y;
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
    //Codepen doesn't like casting :'(
    // this.canvas = document.getElementById('canvas');
    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.sizeCanvas();
    this.initEvents();
    window.requestAnimationFrame((t) => {this.draw(t); });
    console.log(this);

    this.arr = new Array;

    this.createObjs();

  }
  sizeCanvas() {
    this.w = this.ctx.canvas.width = window.innerWidth;
    this.h = this.ctx.canvas.height = window.innerHeight - 50;
  }
  draw(t) {
    window.requestAnimationFrame((t) => {this.draw(t); });

    this.ctx.clearRect(0, 0, this.w, this.h);
    
    for (let i = 0; i < this.arr.length; i++) {
        this.arr[i].draw();

        this.physics(this.arr[i]);
    }



  }
    initEvents() {
        window.onresize = (e) => {this.sizeCanvas()};
    }

    rngPath() {
        return (Math.random() * 2 - 1);
    }

    rngPosition_x() {
        return (Math.random() * this.w);
    }

    rngPosition_y() {
        return (Math.random() * this.h);
    }

    rngSize() {
        return (Math.random() * 60);
    }

    rngColor() {
        let r = Math.round(Math.random() * 255);
        let b = Math.round(Math.random() * 255);
        let g = Math.round(Math.random() * 255);

        return ('rgb(' + r + ',' + g + ',' + b + ')');
    }

    createObjs() {
        for (let i = 0; i < 250; i++) {
        this.arr.push();
        this.arr[i] = new Circle(this, this.rngPosition_x(), this.ctx.canvas.height / 6, this.rngColor(), this.rngColor(), 10, this.rngSize(), 0, 2 * Math.PI);
        this.arr[i].gravity();
        this.arr[i].initial_speed_x(this.rngPath() * 500);
        this.arr[i].initial_speed_y(this.rngPath() * 500);
        }
    }

    //implements wall, floor, and ceiling collisions based on object location... Optimized for Circle class for now...
    physics(object: any){
        let friction:number = 0.99;
        let collision:number = -0.8;

        if (object.x > this.w - object.radius - object.width) {
            object.x = this.w - object.radius - object.width;
            if (Math.abs(object.x_speed) < 0.1) {
                object.x_speed *= 0;
                object.x_acc *= 0;
                object.x = this.ctx.canvas.width - object.radius - object.width;
            }
            else {
                object.x_speed *= collision;
            }
        } else if (object.x < object.radius + object.width) {
            object.x = object.radius + object.width;
            if (Math.abs(object.x_speed) < 1) {
                object.x_speed *= 0;
                object.x_acc *= 0;
                object.x = object.radius + object.width;
            }
            else {
                object.x_speed *= collision;
            }
        }


        if (object.y > this.ctx.canvas.height - object.radius - object.width || object.y_acc === 0) {
            object.y = this.ctx.canvas.height - object.radius - object.width;
            console.log(object.y_speed);
            if (Math.abs(object.y_speed) < 5) {
                object.y_speed *= 0;
                object.y_acc *= 0;
                object.y = this.ctx.canvas.height - object.radius - object.width;
            }
            else {
                object.y_speed *= collision;
            }
            object.x_speed *= friction;
        } else if (object.y < object.radius + object.width) {
            object.y = object.radius + object.width;
            if (Math.abs(object.y_speed) < 1) {
                object.y_speed *= 0;
                object.y_acc *= 0;
                object.y = object.radius + object.width;
            }
            else {
                object.y_speed *= collision;
            }
        }
    }
}

var app = new App();