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


class Title {
    ctx: CanvasRenderingContext2D;
    text: string;
    w: number;
    h: number;

    constructor(ctx: CanvasRenderingContext2D, w:number, h:number){
        const vm = this;
        vm.ctx = ctx;
        vm.w = w;
        vm.h = h;
        vm.text = "Contrast"
    }

    draw(){
        const vm = this;
        vm.ctx.fillStyle = 'black';
        vm.ctx.font = 'bold 150px Courier';
        vm.ctx.textAlign = "center";
        vm.ctx.fillText(vm.text, vm.w / 2, vm.h / 5);
    }

    


}
class Score {
    score: number;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    t: number;
    scoreX: number;
    scoreY: number;
    timerX: number;
    timerY: number;
    seconds: number;
    offsetTime: number;
    constructor(ctx: CanvasRenderingContext2D, w: number, h: number) {
        const vm = this;
        vm.ctx = ctx;
        vm.score = 0;
        vm.seconds = 0;
        vm.w = w;
        vm.h = h;
        vm.scoreX = w / 2;
        vm.scoreY = h / 5;
        vm.timerX = w * (4/5);
        vm.timerY = h / 14;
        vm.t = 0;
        vm.offsetTime = 60;
    }
    drawScore() {
        const vm = this;
        vm.ctx.fillStyle = 'black';
        vm.ctx.font = 'bold 200px Courier';
        vm.ctx.textAlign = "center";
        vm.ctx.fillText(vm.score.toString(), vm.scoreX, vm.scoreY);
    }

    drawTimer(t){
        const vm = this;

        var timer = vm.convertTime(t);

        vm.ctx.fillStyle = 'black';
        vm.ctx.font = 'bold 75px Courier';
        vm.ctx.textAlign = "center";
        vm.ctx.fillText(timer, vm.timerX, vm.timerY);
    }

    convertTime(t){
        const vm = this;
        vm.seconds = Math.ceil(60 - (t - vm.t)/1000); 
        
        var timer;
        var min = Math.floor(vm.seconds / 60);
        vm.seconds -= min * 60;

        

        if(vm.seconds > 9){
            timer = min+":"+ vm.seconds;
        } else if (vm.seconds >= 0 ){
            timer = min+":0"+vm.seconds;
        }
        return timer;
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

    innerText: string;

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, hsl: number[], innerText?: string) {
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

        if(innerText){
            vm.innerText = innerText;
        } else {
            vm.innerText = "";
        }
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

    drawText(){
        const vm = this;
        vm.ctx.fillStyle = 'black';
        vm.ctx.font = 'bold 100px Courier';
        vm.ctx.textAlign = "center";
        vm.ctx.fillText(vm.innerText, vm.x, vm.y+25);
    }


}



class App {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    t: number;
    circles: Circle[];
    backgroundC: string;
    backCircle: Circle;
    changing: boolean;
    color_change: boolean;
    title: Title;
    score: Score;
    order: any[];
    mode: string;

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

        vm.t = 0;

        vm.backgroundC = hslToRgb(temp[0], temp[1], temp[2]);
        vm.circles = [];

        vm.circles[0] = new Circle(vm.ctx, 3 * vm.w / 12, 5 * vm.h / 11, vm.w, vm.h, vm.w / 5, vm.rnghsl(0.5), "Play");
        vm.circles[1] = new Circle(vm.ctx, 9 * vm.w / 12, 5 * vm.h / 11, vm.w, vm.h, vm.w / 5, vm.rnghsl(0.5));
        vm.circles[2] = new Circle(vm.ctx, 3 * vm.w / 12, 8 * vm.h / 11, vm.w, vm.h, vm.w / 5, vm.rnghsl(0.5));
        vm.circles[3] = new Circle(vm.ctx, 9 * vm.w / 12, 8 * vm.h / 11, vm.w, vm.h, vm.w / 5, vm.rnghsl(0.5));

        vm.backCircle = new Circle(vm.ctx, 0, 0, 0, 0, 0, [1, 1, 1]);
        vm.changing = false;
        vm.color_change = false;

        vm.title = new Title(vm.ctx, vm.w, vm.h)
        vm.score = new Score(vm.ctx, vm.w, vm.h);
        vm.order = [];
        vm.mode = "titlescreen";

        vm.calculateContrastOrder();
        console.log(vm.order);

        // vm.circle.drawCircle();
        // vm.ctx.drawImage(vm.circle.canvas, 0, 0);

        vm.canvas.addEventListener('click', function (event) {
            console.log(vm.changing);
            for (var i = 0; i < vm.circles.length; i++) {
                if (vm.changing === false && (event.clientX > vm.circles[i].xmin && event.clientX < vm.circles[i].xmax) && (event.clientY > vm.circles[i].ymin && event.clientY < vm.circles[i].ymax)) {

                    
                    if (vm.mode === "maingame") {
                        for (var j = 0; j < vm.order.length; j++) {
                            if (i === vm.order[j].id) {
                                vm.score.add((j + 1) * 100);
                            }
                        }
                        
                    }
                    if (vm.mode === "titlescreen") {
                        
                        switch (i) {
                            case 0:
                            setTimeout(function() {
                                vm.mode = "maingame";
                                vm.score.t = vm.t;
                            }, 200);
                                break;
                            case 1:
                                console.log("1");
                                break;
                            case 2:
                                console.log("2");
                                break;
                            case 3:
                                console.log("3");
                                break;
                            default: 
                                console.log("other");
                        }
                    }

                    vm.setBackgroundCircle(i);
                    
                }
            }
        });

    }
    initEvents() {
        window.onresize = (e) => { this.sizeCanvas() };
    }
    sizeCanvas() {
        const vm = this;
        vm.w = vm.ctx.canvas.width = window.innerWidth;
        vm.h = vm.ctx.canvas.height = window.innerHeight;
    }
    setBackgroundCircle(i) {
        const vm = this;
        vm.backgroundC = vm.backCircle.color;
        vm.backCircle.drawCircle();
        vm.drawCircles();
        vm.backCircle.x = vm.circles[i].x;
        vm.backCircle.y = vm.circles[i].y;
        vm.backCircle.w = vm.circles[i].w;
        vm.backCircle.h = vm.circles[i].h;
        vm.backCircle.r = vm.circles[i].r;
        vm.backCircle.hsl = vm.circles[i].hsl;
        vm.backCircle.color = vm.circles[i].color;
        vm.changing = true;
        vm.color_change = true;

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
    }

    drawCircles() {
        const vm = this;
        for (var i = 0; i < vm.circles.length; i++) {
            if (vm.color_change) {
                vm.resetColors();
                vm.color_change = false;
            }
            if (vm.circles[i].r < (vm.w / 5)) {
                var t = (vm.circles[i].r / (vm.w / 5)) * 0.40; /*ratio of radius to size [0-1]*/
                vm.circles[i].r = Math.ceil(vm.circles[i].r * (1.40 - t));
            }
            
            vm.circles[i].drawCircle();
            if(vm.circles[i].innerText !== "" && vm.mode==="titlescreen"){
                vm.circles[i].drawText();
            }
        }
    }

    change() {
        const vm = this;
        if (vm.changing && vm.backCircle.r > vm.h) {/*resets values for a split second to end*/
            vm.backCircle.drawCircle();
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

        

        
    }

    draw(t) {
        const vm = this;
        window.requestAnimationFrame((t) => { this.draw(t); });
        vm.t = t;
        if(vm.changing === true){
            vm.ctx.fillStyle = vm.backgroundC;
            vm.ctx.fillRect(0,0,vm.w, vm.score.scoreY+50);
        }

        vm.change();

        

        if(vm.mode === "titlescreen"){
            vm.title.draw();
        } else if (vm.mode === "maingame"){
            vm.score.drawScore();
            vm.score.drawTimer(t);
            
        }
        
        



    }
}

var app = new App();