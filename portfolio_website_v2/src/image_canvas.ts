export * from "./image_canvas";


export function lerp(from: number, to: number, percent: number) {
  var differance = to - from;
  return from + (differance * percent);
}


export class Img {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  image: HTMLImageElement
  w: number;
  h: number;
  x_offset_dest: number;
  y_offset_dest: number;
  x_offset: number;
  y_offset: number;
  anchorX: number;
  anchorY: number;

  imgWidth: number;
  screenWidth: number;
  scaleX: number;
  scaleY: number;
  scale: number;
  imgHeight: number;
  screenHeight: number;


  constructor(width: number, height: number) {
    const vm = this;
    vm.canvas = document.createElement('canvas');
    vm.ctx = vm.canvas.getContext('2d');
    vm.w = vm.canvas.width = width;
    vm.h = vm.canvas.height = height;
    vm.image = new Image();
    vm.image.src = 'bw_philadelphia.jpg';

    vm.image.onload = function () {

      /*gets scaleX based on screen and image width */
      vm.imgWidth = vm.image.naturalWidth;
      vm.screenWidth = vm.canvas.width;
      vm.scaleX = 1;
      vm.scaleX = vm.screenWidth / vm.imgWidth;

      /*gets scaleY based on screen and image width */
      vm.imgHeight = vm.image.naturalHeight;
      vm.screenHeight = vm.canvas.height;
      vm.scaleY = 1;
      vm.scaleY = vm.screenHeight / vm.imgHeight;


      /*sets basic scale to X */

      vm.scale = vm.scaleX
      if (vm.scaleX < vm.scaleY) {
        vm.scale = vm.scaleY;
      }

      vm.imgWidth *= vm.scale * 1.05;
      vm.imgHeight *= vm.scale * 1.05;

      vm.anchorX = (vm.imgWidth - vm.screenWidth);
      vm.anchorY = (vm.imgHeight - vm.screenHeight);

      vm.x_offset_dest = vm.x_offset = vm.anchorX;
      vm.y_offset_dest = vm.y_offset = vm.anchorY;



      vm.draw();
    }
  }

  public draw() {
    const vm = this;
    // vm.ctx.clearRect(0,0,vm.w, vm.h);

    vm.ctx.drawImage(vm.image, vm.x_offset, vm.y_offset, vm.image.naturalWidth, vm.image.naturalHeight, 0, 0, vm.imgWidth, vm.imgHeight);
  }
}

export class App {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  // rect: Rectangle
  img: Img;

  mouseIn: boolean;
  container: HTMLDivElement;

  constructor() {
    const vm = this;

    vm.canvas = <HTMLCanvasElement>document.getElementById('canvas');
    vm.ctx = vm.canvas.getContext('2d');

    vm.sizeCanvas();
    vm.initEvents();
    window.requestAnimationFrame((t) => { vm.draw(t); });

    vm.img = new Img(vm.w, vm.h);

    vm.mouseIn = false;

    vm.container = <HTMLDivElement>document.getElementById('canvas-container');

    vm.container.onmousemove = function (e) {
      vm.drawImgIn(0, e);
    }

    vm.container.onmouseenter = function (e) {
      vm.mouseIn = true;
    }

    vm.container.onmouseout = function (e) {
      vm.mouseIn = false;
      vm.drawImgOut(0, e);
    }


  }

  public sizeCanvas() {
    const vm = this;
    vm.canvas.style.width = '100%';
    vm.canvas.style.height = '100%';
    this.w = this.canvas.width = vm.canvas.offsetWidth;
    this.h = this.canvas.height = vm.canvas.offsetHeight;

  }
  public draw(t: any) {
    const vm = this;
    window.requestAnimationFrame((t) => { this.draw(t); });
    vm.ctx.clearRect(0, 0, vm.w, vm.h);

    vm.ctx.drawImage(vm.img.canvas, 0, 0);
    vm.img.draw();


  }

  public drawImgIn(t: any, e: any) {
    const vm = this;


    /*ratio = (imgWidth / screenWidth)  */

    var moveRatioX = (e.clientX / vm.img.screenWidth); //range from [0, 1]: 0 being left, 1 being right
    var moveOffsetX = -vm.img.anchorX + (moveRatioX * vm.img.anchorX * 2);

    var moveRatioY = (e.clientY / vm.img.screenHeight) * 2; //range from [0, 1]: 0 being left, 1 being right
    var moveOffsetY = -vm.img.anchorY + (moveRatioY * vm.img.anchorY);


    /*offset = middle_anchor + dragged_offset*/
    vm.img.x_offset_dest = vm.img.anchorX + moveOffsetX;
    vm.img.y_offset_dest = vm.img.anchorY + moveOffsetY;

    if (vm.mouseIn === true && Math.round(vm.img.y_offset) !== Math.round(vm.img.y_offset_dest) && Math.round(vm.img.x_offset) !== Math.round(vm.img.x_offset_dest)) {


      vm.img.x_offset = Math.round(lerp(vm.img.x_offset, vm.img.x_offset_dest, 0.1));
      vm.img.y_offset = Math.round(lerp(vm.img.y_offset, vm.img.y_offset_dest, 0.1));

      // window.requestAnimationFrame((t) => { vm.drawImgIn(t, e) });


    }
  }

  public drawImgOut(t: any, e: any) {
    const vm = this;

    /*ratio = (imgWidth / screenWidth)  */

    // var moveRatioX = (e.clientX / vm.img.screenWidth); //range from [0, 1]: 0 being left, 1 being right
    // var moveOffsetX = -vm.img.anchorX + (moveRatioX * vm.img.anchorX * 2);

    // var moveRatioY = (e.clientY / vm.img.screenHeight) * 2; //range from [0, 1]: 0 being left, 1 being right
    // var moveOffsetY = -vm.img.anchorY + (moveRatioY * vm.img.anchorY);


    /*offset = middle_anchor + dragged_offset*/
    vm.img.x_offset_dest = vm.img.anchorX;
    vm.img.y_offset_dest = vm.img.anchorY;

    if (vm.mouseIn === false && Math.round(vm.img.y_offset) !== Math.round(vm.img.y_offset_dest) && Math.round(vm.img.x_offset) !== Math.round(vm.img.x_offset_dest)) {


      vm.img.x_offset = lerp(vm.img.x_offset, vm.img.x_offset_dest, 0.1);
      vm.img.y_offset = lerp(vm.img.y_offset, vm.img.y_offset_dest, 0.1);

      window.requestAnimationFrame((t) => { vm.drawImgOut(t, e) });

    }

  }

  initEvents() {
    window.onresize = (e) => {
      this.sizeCanvas();
    };
  }

}