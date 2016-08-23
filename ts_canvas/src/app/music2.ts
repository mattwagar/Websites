class Music {
    audio: any;
    ctx: AudioContext;
    audioSrc: MediaElementAudioSourceNode;
    analyser: AnalyserNode;
    audioData: any[];
    sepValue: any;
    frequencyData: Uint8Array;


    constructor(sepValue) {
        const vm = this;
        vm.audio = new Audio();
        vm.audio.src = 'content/time.mp3';
        vm.audio.controls = false;
        vm.audio.loop = true;
        vm.audio.autoplay = true;

        vm.ctx = new AudioContext();
        vm.audioSrc = vm.ctx.createMediaElementSource(vm.audio);
        vm.analyser = vm.ctx.createAnalyser();
        vm.audioData = [];
        vm.sepValue = sepValue;

        // Connect the MediaElementSource with the analyser
        vm.audioSrc.connect(vm.analyser);
        vm.audioSrc.connect(vm.ctx.destination);

        // FrequencyBinCount tells how many values are receive from the analyser
        vm.frequencyData = new Uint8Array(vm.analyser.frequencyBinCount);

        console.dir(vm.audio);

        vm.audio.play();
    }

    getFrequencyData() {
        this.analyser.getByteFrequencyData(this.frequencyData);
        console.log(this.frequencyData);
        return this.frequencyData;
    };

    getAudioData() {
        this.analyser.getByteFrequencyData(this.frequencyData);

        // Split array into 3
        let frequencyArray = this.splitFrenquencyArray(this.frequencyData,
            this.sepValue);

        // Make average of frenquency array entries
        for (let i = 0; i < frequencyArray.length; i++) {
            let average = 0;

            for (let j = 0; j < frequencyArray[i].length; j++) {
                average += frequencyArray[i][j];
            }
            this.audioData[i] = (average / frequencyArray[i].length) / 255;
        }
        console.log(this.audioData);
        return this.audioData;
    }

    splitFrenquencyArray(arr, n) {
        let tab = Object.keys(arr).map(function (key) {
            return arr[key]
        });
        let len = tab.length,
            result = [],
            i = 0;

        while (i < len) {
            let size = Math.ceil((len - i) / n--);
            result.push(tab.slice(i, i + size));
            i += size;
        }
        return result;
    }
}

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

class bezCircle {

    app: App;
    ctx: CanvasRenderingContext2D;
    c: number;
    cx: number;
    cy: number;
    r: number;
    rx: number;
    ry: number;

    constructor(app, cx, cy, r) {

        this.app = app;
        this.ctx = app.ctx;

        this.c = 0.5522847498307933984022516322796;
        this.cx = cx; // center x
        this.cy = cy; // center y
        this.r = r;  // radius

    }

draw() {
        const vm = this;


    }
}


class App {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    music: Music;
    circle: Circle;
    circle2: Circle;
    circle3: Circle;
    arr: any[];

    bCircle: bezCircle;

    constructor() {
        //Codepen doesn't like casting :'(
        // this.canvas = document.getElementById('canvas');
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.ctx.font = "30px Arial";

        this.sizeCanvas();
        this.initEvents();
        window.requestAnimationFrame((t) => { this.draw(t); });
        console.log(this);
        this.music = new Music(3);
        this.circle = new Circle(this, 400, 200, 'rgba(0,0,0,0)', 'purple', 5, 25, 0, 2 * Math.PI);
        this.circle2 = new Circle(this, 400, 200, 'rgba(0,0,0,0)', 'blue', 5, 50, 0, 2 * Math.PI);
        this.circle3 = new Circle(this, 400, 200, 'rgba(0,0,0,0)', 'red', 5, 100, 0, 2 * Math.PI);
        this.arr = new Array;

        this.bCircle = new bezCircle(this, 150, 150, 100);
        this.bCircle.draw();

    }
    initEvents() {
        window.onresize = (e) => { this.sizeCanvas() };
    }
    sizeCanvas() {
        this.w = this.ctx.canvas.width = window.innerWidth;
        this.h = this.ctx.canvas.height = window.innerHeight - 50;
    }
    draw(t) {
        window.requestAnimationFrame((t) => { this.draw(t); });


        // this.ctx.clearRect(0, 0, 190, this.h);

        this.ctx.fillStyle = 'white';

        // this.ctx.fillText('treble: ' + this.music.getAudioData()[0], 10, 100);
        // this.ctx.fillText('bass: ' + this.music.getAudioData()[1], 10, 150);
        // this.ctx.fillText('percussion: ' + this.music.getAudioData()[2], 10, 200);



        // this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        // this.ctx.fillRect(190, 0, this.w, this.h);


        this.circle.radius = 100 * this.music.getAudioData()[2] + 25;
        this.circle2.radius = 100 * this.music.getAudioData()[1] + 50;
        this.circle3.radius = 100 * this.music.getAudioData()[0] + 100;

        // this.circle3.draw();
        // this.circle2.draw();
        // this.circle.draw();

        this.music.getAudioData();


    }
}

var app = new App();
