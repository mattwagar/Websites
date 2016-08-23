var CImage = (function () {
    function CImage(context, src) {
        var vm = this;
        // vm.canvas = <HTMLCanvasElement>document.createElement('c');
        // vm.ctx = vm.canvas.getContext('2d');
        vm.context = context;
        vm.src = src;
        vm.canvas = document.createElement('canvas');
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
            vm.ctx.drawImage(vm.img, 0, 0, vm.w, vm.h);
            vm.imgData = vm.context.getImageData(0, 0, vm.w, vm.h);
            console.log(vm.imgData.data.length / 4);
            console.log('width: ' + vm.imgData.data.length / 4 / vm.h);
            console.log('height: ' + vm.imgData.data.length / 4 / vm.w);
            // vm.context.drawImage(vm.canvas, 0, 0, vm.w, vm.h)
            vm.circle();
            // vm.context.putImageData(vm.imgData, 0, 0);
            // vm.draw();
        };
    }
    CImage.prototype.circle = function () {
        var vm = this;
        for (var i = 0; i < vm.imgData.data.length; i += 4) {
            vm.context.beginPath();
            vm.context.arc(i, 5, 5, 0, 2 * Math.PI);
            var color = 'rgb(' + vm.imgData.data[i] + ',' + vm.imgData.data[i + 1] + ',' + vm.imgData.data[i + 2] + ')';
            console.log(color);
            vm.context.fillStyle = color;
            vm.context.fill();
        }
        // for(var i in vm.imgData.data){
        //     vm.imgData.data[i]
        // }
    };
    CImage.prototype.draw = function () {
        var vm = this;
        vm.context.putImageData(vm.imgData, 0, 0);
    };
    return CImage;
}());
var App = (function () {
    function App() {
        var _this = this;
        // this.canvas = document.getElementById('canvas');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.sizeCanvas();
        this.initEvents();
        window.requestAnimationFrame(function (t) { _this.draw(t); });
        this.img = new CImage(this.ctx, './content/datboi.jpg');
        this.ctx.beginPath();
        // this.ctx.fillStyle = 'green';
        // this.ctx.fillRect(0, 0, 20, 20);
    }
    App.prototype.sizeCanvas = function () {
        this.w = this.ctx.canvas.width = window.innerWidth;
        this.h = this.ctx.canvas.height = window.innerHeight;
    };
    App.prototype.initEvents = function () {
        var _this = this;
        window.onresize = function (e) { _this.sizeCanvas(); };
    };
    App.prototype.draw = function (t) {
        var _this = this;
        window.requestAnimationFrame(function (t) { _this.draw(t); });
        // this.ctx.clearRect(0, 0, this.w, this.h);
        // this.ctx.fillStyle = 'rgba(255,255,255,0.05)';
        // this.ctx.fillRect(0, 0, this.w, this.h);
        // this.img.draw();
    };
    return App;
}());
var app = new App();

//# sourceMappingURL=test.js.map
