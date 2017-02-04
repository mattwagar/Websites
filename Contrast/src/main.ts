/*
app: main cavans
layers) (top to bottom)
menu
circles(position)
*/
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return "rgb(" + Math.round(r * 255) + "," + Math.round(g * 255) + "," + Math.round(b * 255) + ")";
}

class Score {
    score: number;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    constructor(ctx: CanvasRenderingContext2D, w: number, h: number) {
        const vm = this;
        vm.ctx = ctx;
        vm.score = 0;
        vm.w = w;
        vm.h = h;
    }
    draw() {
        const vm = this;
        vm.ctx.fillStyle = 'black';
        vm.ctx.font = '200px Verdana';
        vm.ctx.textAlign = "center";
        vm.ctx.fillText(vm.score.toString(), vm.w / 2, vm.h / 5);
    }
    add(x: number) {
        const vm = this;
        vm.score += x;
    }
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

    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, hsl: number[]) {
        const vm = this;
        vm.w = w;
        vm.h = h;
        vm.x = x;
        vm.y = y;
        vm.r = r;
        vm.hsl = hsl;
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
    color_change: boolean;
    score: Score;
    order: any[];

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

        vm.circles[0] = new Circle(vm.ctx, 3 * vm.w / 12, 5 * vm.h / 11, vm.w, vm.h, vm.w / 5, vm.rnghsl(0.5));
        vm.circles[1] = new Circle(vm.ctx, 9 * vm.w / 12, 5 * vm.h / 11, vm.w, vm.h, vm.w / 5, vm.rnghsl(0.5));
        vm.circles[2] = new Circle(vm.ctx, 3 * vm.w / 12, 8 * vm.h / 11, vm.w, vm.h, vm.w / 5, vm.rnghsl(0.5));
        vm.circles[3] = new Circle(vm.ctx, 9 * vm.w / 12, 8 * vm.h / 11, vm.w, vm.h, vm.w / 5, vm.rnghsl(0.5));

        vm.backCircle = new Circle(vm.ctx, 0, 0, 0, 0, 0, [1, 1, 1]);
        vm.changing = false;
        vm.color_change = false;

        vm.score = new Score(vm.ctx, vm.w, vm.h);
        vm.order = [];

        vm.calculateContrastOrder();
        console.log(vm.order);

        // vm.circle.drawCircle();
        // vm.ctx.drawImage(vm.circle.canvas, 0, 0);

        vm.canvas.addEventListener('click', function(event) {
            for (var i = 0; i < vm.circles.length; i++) {
                if (vm.changing === false && (event.clientX > vm.circles[i].xmin && event.clientX < vm.circles[i].xmax) && (event.clientY > vm.circles[i].ymin && event.clientY < vm.circles[i].ymax)) {
                    //1. widen circle (duplicate it) to screen size, and increase lightness lerp?
                    //2. set backgroundC to new color
                    //3. reset colors 
                    //4. transition colors in (small to big)\

                    // // converts hue to [0,360]
                    // var x = Math.ceil(vm.backCircle.hsl[0] * 360);
                    // var y = Math.ceil(vm.circles[i].hsl[0] * 360);
                    // // calculates clicked color and background color's difference in hue. returns a number [0, 180]
                    // if (Math.abs(x - y) < Math.abs((360 + y) - x) && Math.abs(x - y) < Math.abs(y - (360 + x))) {
                    //     vm.score.add(Math.abs(x - y))
                    // } else if (Math.abs((360 + y) - x) < Math.abs(y - (360 + x))) {
                    //     vm.score.add(Math.abs((360 + y) - x));
                    // } else {
                    //     vm.score.add(Math.abs(y - (360 + x)));
                    // }

                    for(var j = 0; j < vm.order.length; j++){
                      if(i === vm.order[j].id){
                        vm.score.add((j+1) * 100);
                      }  
                    }
                    




                    vm.backCircle.drawCircle();
                    vm.drawCircles();


                    // if x-y is smaller use it// else if y-x is smaller use it

                    // vm.score.add();

                    /* 0-360 - 0-360 */

                    vm.backCircle.x = vm.circles[i].x;
                    vm.backCircle.y = vm.circles[i].y;
                    vm.backCircle.w = vm.circles[i].w;
                    vm.backCircle.h = vm.circles[i].h;
                    vm.backCircle.r = vm.circles[i].r;
                    vm.backCircle.hsl = vm.circles[i].hsl;
                    vm.backCircle.color = vm.circles[i].color;
                    vm.changing = true;
                    vm.color_change = true;
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
    calculateOneScore(circle) {
        // converts hue to [0,360]
        const vm = this;
        var x = Math.ceil(vm.backCircle.hsl[0] * 360);
        var y = Math.ceil(circle.hsl[0] * 360);
        // calculates clicked color and background color's difference in hue. returns a number [0, 180]
        if (Math.abs(x - y) < Math.abs((360 + y) - x) && Math.abs(x - y) < Math.abs(y - (360 + x))) {
            return (Math.abs(x - y))
        } else if (Math.abs((360 + y) - x) < Math.abs(y - (360 + x))) {
            return (Math.abs((360 + y) - x));
        } else {
            return (Math.abs(y - (360 + x)));
        }
    }

    calculateContrastOrder() {
        const vm = this;
        //loop through circles
        ///calcscores
        ///put in object with score and id greatest to least
        vm.order = [];
        for (var i = 0; i < vm.circles.length; i++) {
            var x = vm.calculateOneScore(vm.circles[i]);
            var l = vm.order.length;
            if (l === 0) {
                vm.order.push({ "id": i, "score": x });
            } else if (l > 0) {
                for (var j = 0; j < l; j++) {
                    if (vm.order[j].score > x) {
                        vm.order.splice(j, 0, ({ "id": i, "score": x }))
                        break;
                    } else if (vm.order[j].score <= x && j === (l - 1)) { //if last iteration of vm.order
                        vm.order.push({ "id": i, "score": x });
                        break;
                    }
                }
            }
        }

    }

    changeBackColor(color: string) {
        const vm = this;
        vm.backgroundC = color;
    }

    rnghsl(l) {
        const vm = this;
        var h = (Math.random() * 360) / 360;
        var s = 1.0;
        return [h, s, l];
    }

    resetColors() {
        const vm = this;
        for (var i = 0; i < vm.circles.length; i++) {
            vm.circles[i].r = 5;
            vm.circles[i].hsl = vm.rnghsl(0.5);
            vm.circles[i].color = hslToRgb(vm.circles[i].hsl[0], vm.circles[i].hsl[1], vm.circles[i].hsl[2])
        }

        vm.calculateContrastOrder();
        console.log(vm.order);
    }

    drawCircles() {
        const vm = this;
        for (var i = 0; i < vm.circles.length; i++) {
            if (vm.color_change) {
                vm.resetColors();
                vm.color_change = false;
            }
            if (vm.circles[i].r < (vm.w / 5)) {
                var t = (vm.circles[i].r / (vm.w / 5)) * 0.45; /*ratio of radius to size [0-1]*/
                vm.circles[i].r = Math.ceil(vm.circles[i].r * (1.45 - t));
            }
            vm.circles[i].drawCircle();
        }
    }

    draw(t) {
        const vm = this;
        window.requestAnimationFrame((t) => { this.draw(t); });

        if (vm.changing && vm.backCircle.r > vm.h) {/*resets values for a split second to end*/
            vm.changing = false;
        }
        else if (vm.changing && vm.backCircle.r > vm.h / 2) { /*In the process of changing after it passes circles*/
            vm.backCircle.drawCircle();
            vm.backCircle.r = Math.ceil(vm.backCircle.r * 1.1);
            // vm.resetColors();
            vm.drawCircles();
        }
        else if (vm.changing) { /*In the process of changing*/
            // vm.drawCircles();
            vm.backCircle.drawCircle();
            vm.backCircle.r = Math.ceil(vm.backCircle.r * 1.1);
        } else { /*Still*/
            vm.backCircle.drawCircle();
            vm.drawCircles();
        }

        vm.score.draw();

    }
}

var app = new App();