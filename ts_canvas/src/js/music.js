var Music = (function () {
    function Music(sepValue) {
        var vm = this;
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
    Music.prototype.getFrequencyData = function () {
        this.analyser.getByteFrequencyData(this.frequencyData);
        console.log(this.frequencyData);
        return this.frequencyData;
    };
    ;
    Music.prototype.getAudioData = function () {
        this.analyser.getByteFrequencyData(this.frequencyData);
        // Split array into 3
        var frequencyArray = this.splitFrenquencyArray(this.frequencyData, this.sepValue);
        // Make average of frenquency array entries
        for (var i = 0; i < frequencyArray.length; i++) {
            var average = 0;
            for (var j = 0; j < frequencyArray[i].length; j++) {
                average += frequencyArray[i][j];
            }
            this.audioData[i] = (average / frequencyArray[i].length) / 255;
        }
        console.log(this.audioData);
        return this.audioData;
    };
    Music.prototype.splitFrenquencyArray = function (arr, n) {
        var tab = Object.keys(arr).map(function (key) {
            return arr[key];
        });
        var len = tab.length, result = [], i = 0;
        while (i < len) {
            var size = Math.ceil((len - i) / n--);
            result.push(tab.slice(i, i + size));
            i += size;
        }
        return result;
    };
    return Music;
}());
var Circle = (function () {
    function Circle(app, x, y, fillcolor, strokecolor, width, radius, start, end) {
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
    Circle.prototype.draw = function () {
        var ctx = this.app.ctx;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.start, this.end);
        ctx.strokeStyle = this.strokecolor;
        ctx.lineWidth = this.width;
        ctx.stroke();
        ctx.fillStyle = this.fillcolor;
        ctx.fill();
    };
    return Circle;
}());
var bezCircle = (function () {
    function bezCircle(app, cx, cy, r) {
        this.app = app;
        this.ctx = app.ctx;
        this.c = 0.5522847498307933984022516322796;
        this.cx = cx; // center x
        this.cy = cy; // center y
        this.r = r; // radius
    }
    bezCircle.prototype.draw = function () {
        var vm = this;
        this.ctx.lineWidth = 5;
        this.ctx.translate(300, 300); // translate to centerpoint
        this.ctx.beginPath();
        this.ctx.moveTo(vm.cx, vm.cy - vm.r);
        this.ctx.bezierCurveTo(this.c * (vm.cx + vm.r), vm.cy - vm.r, (vm.cx + vm.r), -this.c * (vm.cy + vm.r), (vm.cx + vm.r), vm.cy);
        this.ctx.strokeStyle = 'red';
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(vm.cx + vm.r, vm.cx);
        this.ctx.bezierCurveTo((vm.cx + vm.r), this.c * (vm.cy + vm.r), this.c * (vm.cx + vm.r), (vm.cy + vm.r), vm.cx, (vm.cy + vm.r));
        this.ctx.strokeStyle = 'green';
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(vm.cx, vm.cy + vm.r);
        this.ctx.bezierCurveTo(-this.c * (vm.cx + vm.r), (vm.cy + vm.r), (vm.cx - vm.r), this.c * (vm.cy + vm.r), (vm.cx - vm.r), vm.cy);
        this.ctx.strokeStyle = 'blue';
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(vm.cx + vm.r, vm.cy);
        this.ctx.bezierCurveTo((vm.cx - vm.r), -this.c * (vm.cy + vm.r), -this.c * (vm.cx + vm.r), (vm.cy - vm.r), vm.cx, (vm.cy - vm.r));
        this.ctx.strokeStyle = 'gold';
        this.ctx.stroke();
    };
    return bezCircle;
}());
var App = (function () {
    function App() {
        var _this = this;
        //Codepen doesn't like casting :'(
        // this.canvas = document.getElementById('canvas');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.font = "30px Arial";
        this.sizeCanvas();
        this.initEvents();
        window.requestAnimationFrame(function (t) { _this.draw(t); });
        console.log(this);
        this.music = new Music(3);
        this.circle = new Circle(this, 400, 200, 'rgba(0,0,0,0)', 'purple', 5, 25, 0, 2 * Math.PI);
        this.circle2 = new Circle(this, 400, 200, 'rgba(0,0,0,0)', 'blue', 5, 50, 0, 2 * Math.PI);
        this.circle3 = new Circle(this, 400, 200, 'rgba(0,0,0,0)', 'red', 5, 100, 0, 2 * Math.PI);
        this.arr = new Array;
        this.bCircle = new bezCircle(this, 150, 150, 100);
        this.bCircle.draw();
    }
    App.prototype.initEvents = function () {
        var _this = this;
        window.onresize = function (e) { _this.sizeCanvas(); };
    };
    App.prototype.sizeCanvas = function () {
        this.w = this.ctx.canvas.width = window.innerWidth;
        this.h = this.ctx.canvas.height = window.innerHeight - 50;
    };
    App.prototype.draw = function (t) {
        var _this = this;
        window.requestAnimationFrame(function (t) { _this.draw(t); });
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
    };
    return App;
}());
var app = new App();

//# sourceMappingURL=music.js.map
