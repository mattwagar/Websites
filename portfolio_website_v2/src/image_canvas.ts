
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

  loaded: boolean;


  constructor(width: number, height: number) {
    const vm = this;
    vm.canvas = document.createElement('canvas');
    vm.ctx = vm.canvas.getContext('2d');
    vm.w = vm.canvas.width = width;
    vm.h = vm.canvas.height = height;
    vm.image = new Image();
    vm.image.src = 'perlin_background.png';
    vm.loaded = false;

    vm.image.onload = function () {
      vm.loaded = true;
      vm.size(vm.w, vm.h);
      vm.draw();
    }
  }

  public size(w, h) {
    const vm = this;

    vm.w = vm.canvas.width = w;
    vm.h = vm.canvas.height = h;

    /*gets scaleX based on screen and image width */
    vm.imgWidth = vm.image.naturalWidth;
    vm.screenWidth = w;
    vm.scaleX = vm.screenWidth / vm.imgWidth;

    /*gets scaleY based on screen and image width */
    vm.imgHeight = vm.image.naturalHeight;
    vm.screenHeight = h;
    vm.scaleY = vm.screenHeight / vm.imgHeight;


    /*sets basic scale to X */

    vm.scale = vm.scaleX
    if (vm.scaleX < vm.scaleY) {
      vm.scale = vm.scaleY;
    }

    vm.imgWidth *= vm.scale * 1.1;
    vm.imgHeight *= vm.scale * 1.01;

    vm.anchorX = (vm.imgWidth - vm.screenWidth);
    vm.anchorY = (vm.imgHeight - vm.screenHeight);

    vm.x_offset_dest = vm.x_offset = vm.anchorX;
    vm.y_offset_dest = vm.y_offset = vm.anchorY;

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

    var element = document.getElementById('canvas');

    var isMobile = false; //initiate as false
    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;

    if (isMobile) {
      var image = document.createElement('img');
      image.src = 'perlin_background.png';
      document.getElementById('canvas').style.display = 'none';
      document.getElementById('canvas-container').style.display = 'none';
      image.onload = function(){
        document.getElementById('welcome-page').insertBefore(image, document.getElementById('canvas-text-overlay'));
      }
      
    } else {



      vm.canvas = <HTMLCanvasElement>document.getElementById('canvas');
      vm.ctx = vm.canvas.getContext('2d');



      vm.sizeCanvas();
      // vm.initEvents();
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
  }

  public sizeCanvas() {
    const vm = this;
    vm.canvas.style.width = '100%';
    vm.canvas.style.height = '100%';
    this.w = this.canvas.width = vm.canvas.offsetWidth;
    this.h = this.canvas.height = vm.canvas.offsetHeight;

    if (vm.img) {
      vm.img.size(vm.w, vm.h);
      vm.img.draw();
    }

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
    var moveOffsetX = -vm.img.anchorX + (moveRatioX * vm.img.anchorX);

    var moveRatioY = (e.clientY / vm.img.screenHeight); //range from [0, 1]: 0 being left, 1 being right
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

  // initEvents() {
  //   window.onresize = (e) => {
  //     this.sizeCanvas();
  //   };
  // }

}