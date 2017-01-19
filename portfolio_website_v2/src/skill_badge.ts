export * from "./skill_badge";

export class Skill {
  flex_item: HTMLDivElement;
  svg: SVGSVGElement;
  svg_circle: SVGCircleElement;
  scale_box: HTMLDivElement;
  image: HTMLImageElement;
  text: HTMLDivElement;
  flex_grid_id: string;
  constructor(name: string, classpercent: string, image: string, flex_grid_id: string) {
    const vm = this;

    vm.flex_grid_id = flex_grid_id;

    vm.flex_item = document.createElement('div');
    vm.flex_item.className += 'flex-item';

    vm.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    vm.svg.setAttribute('class', classpercent)
    vm.svg.setAttribute('width', '84');
    vm.svg.setAttribute('height', '84');

    vm.svg_circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    vm.svg_circle.setAttributeNS(null, 'class', 'outer');
    vm.svg_circle.setAttributeNS(null, "cx", '-42');
    vm.svg_circle.setAttributeNS(null, "cy", '42');
    vm.svg_circle.setAttributeNS(null, "r", '37');
    vm.svg_circle.setAttributeNS(null, "transform", "rotate(-90, 0, 0)");

    vm.scale_box = document.createElement('div');
    if (name === "Type Script" || name === "Bootstrap" || name === "D3.js" || name === "Photoshop" || name === "Illustrator" || name === "After Effects" || name === "Maya" || name === "Mudbox") {
      vm.scale_box.className += 'scale-box-square';
    } else if (name === "Unity" || name === "Phaser.js" || name === "D3.js" || name === "SCSS" || name === "Java" || name === "Python") {
      vm.scale_box.className += 'scale-box-mid';
    }
    else {
      vm.scale_box.className += 'scale-box';
    }

    vm.image = document.createElement('img');
    vm.image.src = image;

    vm.text = document.createElement('div');
    vm.text.className += 'text';
    vm.text.appendChild(document.createTextNode(name));

    // .flex-item
    //       svg.circle-75(width='84', height='84')
    //         circle.outer(cx='-42', cy='42', r='37' transform="rotate(-90, 0, 0)") 
    //       .scale-box
    //         img(id="four")
    //         .text abc
    vm.flex_item.appendChild(vm.svg);
    vm.svg.appendChild(vm.svg_circle);
    vm.flex_item.appendChild(vm.scale_box);
    vm.scale_box.appendChild(vm.image);
    vm.flex_item.appendChild(vm.text);
  }
  resetId(id: string){
    const vm = this;
    vm.flex_grid_id = id;
  }

  append() {
    const vm = this;
    var flex_grid = document.getElementById(vm.flex_grid_id);
    flex_grid.appendChild(vm.flex_item);
  }
}

export interface ISkillInfo {
  name: string;
  class: string;
  image: string;
}

export class Collection {
  id: string;
  images: ISkillInfo[];
  path: string;
  skills: Skill[];
  flex_grid_id: string;

  constructor(path: string, flex_grid_id: string, images: ISkillInfo[], id?: string) {
    const vm = this;
    
    vm.images = images;
    vm.path = path;
    vm.flex_grid_id = flex_grid_id;

    vm.skills = [];

    for (var i = 0; i < images.length; i++) {
      vm.skills.push(new Skill(images[i].name, images[i].class, vm.path + images[i].image, vm.flex_grid_id));
    }
    if(id){
      vm.id = id;
      var element = <HTMLDivElement>document.getElementById(vm.id);
      element.onmouseup = function (e) {
        vm.load();
      }
    }
  }

  public resetIds(id: string){
    const vm = this;
    vm.flex_grid_id = id;
    for (var i = 0; i < vm.skills.length; i++) {
      vm.skills[i].resetId(vm.flex_grid_id);
    }
  }

  public load() { //sets src's to the dom. then once everything is loaded, it adds class active to make them appear via css
    const vm = this;
    var flex_grid = document.getElementById(vm.flex_grid_id);
    while (flex_grid.firstChild) {
      flex_grid.removeChild(flex_grid.firstChild);
    }
    for (var i = 0; i < vm.skills.length; i++) {
      vm.skills[i].append();
    }
  }
  // public close(){
  //   const vm = this;
  //   var flex_grid = document.getElementById(vm.flex_grid_id);
  //   while (flex_grid.firstChild) {
  //     flex_grid.removeChild(flex_grid.firstChild);
  //   }
  // }
}
