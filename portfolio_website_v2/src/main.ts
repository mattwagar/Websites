

import * as image_canvas from "./image_canvas";

import * as skill_badge from "./skill_badge";

import * as media from "./media";

//yoo
const timeout:number = 1000;

var frontend = new skill_badge.Collection('./skills/', 'flex-grid1', [  {"name": 'HTML5',           "class":'circle-100', "image":'html5.svg'}, 
                                                                                            {"name": 'Java Script',     "class":'circle-100', "image":'javascript-2.svg'}, 
                                                                                            {"name": 'Bootstrap',       "class":'circle-100', "image":'bootstrap-4.svg'},
                                                                                            {"name": 'Angular JS',      "class":'circle-75', "image":'angular-icon.svg'}, 
                                                                                            {"name": 'Type Script',     "class":'circle-75', "image":'typescript.svg'},  
                                                                                            {"name": 'Gulp',            "class":'circle-75', "image":'gulp.svg'}, 
                                                                                            {"name": 'CSS3',            "class":'circle-50', "image":'css-3.svg'}, 
                                                                                            {"name": 'jQuery',          "class":'circle-50', "image":'jquery-1.svg'}, 
                                                                                            {"name": 'SCSS',            "class":'circle-50', "image":'sass-1.svg'},
                                                                                            {"name": 'D3.js',           "class":'circle-25', "image":'d3-2.svg'}], 'frontend');
var softeng = new skill_badge.Collection('./skills/', 'flex-grid2',    [{"name": 'Java',        "class":'circle-75', "image":'java-14.svg'}, 
                                                                {"name": 'Python',      "class":'circle-50', "image":'python-5.svg'}, 
                                                                {"name": 'C++',          "class":'circle-25', "image":'c-seeklogo.com.svg'}, 
                                                                {"name": 'Android Studio',  "class":'circle-25', "image":'Android_studio.svg'}], 'softeng');
var design = new skill_badge.Collection('./skills/', 'flex-grid3',       [{"name": 'Photoshop',       "class":'circle-50', "image":'photoshop-cc.svg'},
                                                                {"name": 'Illustrator',     "class":'circle-50', "image":'adobe-illustrator-cc.svg'},
                                                                {"name": 'Maya',            "class":'circle-50', "image":'maya.png'},  
                                                                {"name": 'After Effects',   "class":'circle-25', "image":'after-effects-cc.svg'}, 
                                                                {"name": 'Mudbox',          "class":'circle-25', "image":'mudbox.png'}], 'design');
frontend.load();
softeng.load();
design.load();


var app = new image_canvas.App();


// window.onscroll = function(){
//     console.log(window.scrollY);
// }


// var w = document.getElementById("wrapper-0");
// var b = document.getElementById('p1');


// b.onclick = function(){
//     if(w.classList[1] === "open"){
//         w.classList.remove('open');
//     } else {
//         w.classList.add('open');
//     }
// }

export class PortfolioItem {
    title: string; 
    title_image: string; 
    desc: string;
    stack: skill_badge.Collection; 
    port_image: string;
    
    item_num: number;

    col_size: string;
    col: HTMLDivElement;
    img: HTMLImageElement;
    text: HTMLDivElement;
    sub_text: HTMLDivElement;

    open: boolean;
    media:media.Media;
    target_wrapper: Wrapper;
    portfolio: Portfolio;
  
  constructor(portfolio: Portfolio, item_num: number,  title: string, title_image: string, desc: string, stack: skill_badge.Collection, media:media.Media, type: string) {
    const vm = this;

    vm.portfolio = portfolio;
    vm.item_num = item_num;
    vm.title = title;
    vm.title_image = title_image;
    vm.desc = desc;
    vm.stack = stack;
    vm.media = media;
    vm.col_size = "col-md-3";
    

    vm.col = document.createElement('div');
    vm.col.classList.add(vm.col_size);

    var card_shadow = document.createElement('div');
    card_shadow.classList.add('card-dropshadow', 'row');

    var nopad = document.createElement('div');
    nopad.classList.add('col-md-12','nopad');

    vm.img = document.createElement('img');
    vm.img.src = vm.title_image;

    var col12 = document.createElement('div');
    col12.classList.add('col-md-12');

    vm.text = document.createElement('div');
    vm.text.classList.add('text');
    vm.text.appendChild(document.createTextNode(title));

    var col12_2 = document.createElement('div');
    col12_2.classList.add('col-md-12');

    vm.sub_text = document.createElement('div');
    vm.sub_text.classList.add('text_light');
    vm.sub_text.appendChild(document.createTextNode(type));

    // .col-md-3
    //       img(src="./portfolio/breathless.jpg")#p1
    //       .text Breathless: HTML5 Game

    // .col-md-3
    //       .card-dropshadow.row
    //         .col-md-12.nopad
    //           img(src="./portfolio/breathless.jpg")#p1.dropshadow
    //         .col-md-12
    //           .text Breathless
    //         .col-md-12
    //           .text_light HTML5 Game

    vm.col.appendChild(card_shadow);
    card_shadow.appendChild(nopad);
    nopad.appendChild(vm.img);
    card_shadow.appendChild(col12);
    col12.appendChild(vm.text);
    card_shadow.appendChild(col12_2);
    col12_2.appendChild(vm.sub_text);

    vm.open = false;
    
    vm.col.onclick = function(){
        //   console.(vm.items[0]);
        var different_wrapper = false;
        console.log(vm.media);
        
        different_wrapper = vm.portfolio.close(vm.item_num);
        
        vm.open = vm.target_wrapper.transitionWrapper(different_wrapper, vm.open, vm.title, vm.desc, vm.stack, vm.media)
        
        //   vm.setData();  
      }
    
  }
  append(row: number, wrapper: Wrapper) {
    const vm = this;
    var row_element = document.getElementById('row_'+row);
    
    row_element.appendChild(vm.col);
    vm.target_wrapper = wrapper;
    vm.stack.flex_grid_id = wrapper.flex_grid.id;
    vm.media.id = 'media-'+row;
    console.log(vm.media);
  }
  setCol(className: string){
      const vm = this;
      vm.col.classList.remove(vm.col_size);
      vm.col_size = className;
      vm.col.classList.add(vm.col_size);
  }
}



export class Portfolio {
  id: string;
  json_objs: IPortfolioItem[];
  path: string;
  items: PortfolioItem[];
  wrappers: Wrapper[];
  flex_grid_id: string;
  per_row:number;

  constructor(id: string, json_objs: IPortfolioItem[]) {
    const vm = this;
    vm.id = id;
    vm.json_objs = json_objs;
     

    vm.items = [];
    vm.wrappers = [];

    //add wrappers based on all possible breakpoint widths (json_objs/2)
    for(var j = 0; j < Math.ceil(json_objs.length/2); j++){
        vm.wrappers.push(new Wrapper(j));
    }

    //add all items
    for (var i = 0; i < vm.json_objs.length; i++) {
      vm.items.push(new PortfolioItem(vm, i, json_objs[i].title, json_objs[i].title_image, json_objs[i].desc, json_objs[i].stack, json_objs[i].media, json_objs[i].type));
    }

    vm.appendAll();

    
  }

    public appendAll(){ //appends PortfolioItems based on screen size; gets digested
        const vm = this;
        var screenWidth = window.innerWidth;
        console.log(screenWidth);

        //reassigns cols based on breakpoints
        var breakpoints = [{min: 0, max:768, col_size: 'col-xs-6', per_row: 2},{min: 769, max:992, col_size: 'col-xs-4', per_row: 3}, {min: 993, max:1200, col_size: 'col-xs-3', per_row: 4}, {min: 1200, max:9999, col_size: 'col-xs-3', per_row: 4}];
        for(var i=0; i<breakpoints.length; i++){

            //if in breakpoint range, and not same as before
            if(/*vm.items[0].col_size !== breakpoints[i].col_size && */screenWidth > breakpoints[i].min && screenWidth < breakpoints[i].max){
                //clear all rows
                vm.per_row = breakpoints[i].per_row;
                var parent = document.getElementById('portfolio');
                var iterator = parent.children.length;
                for(var a = 1; a < iterator; a++){
                    parent.removeChild(parent.children[1]);
                }

                //add new rows and wrappers
                for(var r = 0; r < Math.ceil(vm.items.length / breakpoints[i].per_row); r++){
                    var row = document.createElement('div');
                    row.id = 'row_'+r;
                    row.classList.add('row');

                    var wrapper = vm.wrappers[r].html;

                    parent.appendChild(row);
                    parent.appendChild(wrapper);
                }
                //add cols to new rows
                for(var j=0; j<vm.items.length; j++){
                    vm.items[j].setCol(breakpoints[i].col_size);
                    var row_num = Math.floor(j/breakpoints[i].per_row);
                    vm.items[j].append(row_num, vm.wrappers[row_num]);
                }
            }
        }
    }

  public close(item_num: number) { //closes all wrappers
    const vm = this;
    //closes all items in the row of the given item.
    var row = Math.floor(item_num/vm.per_row);

    // for(var j = (row*vm.per_row); j < ((row*vm.per_row)+vm.per_row); j++){
    //     if(item_num !== j && vm.items[j]){
    //         vm.items[j].open = false;
    //     }
    // }
    var return_value = false;

    for(var j = 0; j < vm.items.length; j++){
        if(item_num !== j && vm.items[j]){
            vm.items[j].open = false;
        }
    }
    for(var r = 0; r < vm.wrappers.length; r++){
        if(r !== row && vm.wrappers[r].html.classList[1] === 'open'){
            vm.wrappers[r].close();
            return_value = true;
        }
    }
    return return_value;
  }
}

export class Wrapper {
    title: string; 
    desc: string;
    collection: skill_badge.Collection;
    port_image: string; 
    media: media.Media;
    

    html:HTMLDivElement;
    title_element:HTMLDivElement;
    description:HTMLDivElement;
    stack:HTMLDivElement;
    flex_grid:HTMLDivElement;
    demo:HTMLDivElement;
    col5:HTMLDivElement;
    description_text: Text;
    title_element_text: Text;
    link:HTMLDivElement;
    link_text:HTMLDivElement;
    col6:HTMLDivElement;

    change:boolean;
    
    constructor(row_num){
        const vm = this;

        vm.change = false;
        // vm.title = pItem.title;
        // vm.desc = pItem.desc;
        // vm.stack = pItem.stack;
        // vm.port_image = pItem.port_image;
        vm.html = document.createElement('div');
        vm.html.id = 'wrapper-'+row_num;
        vm.html.classList.add('wrapper');

        var row = document.createElement('div');
        row.id = 'content';
        row.classList.add('row');

        vm.title_element = document.createElement('div');
        vm.title_element.classList.add('col-md-12', 'desc-text');
        vm.title_element_text = document.createTextNode('');
        vm.title_element.appendChild(vm.title_element_text);

        var col3 = document.createElement('div');
        col3.classList.add('col-md-3');

        var row_fill = document.createElement('div');
        row_fill.classList.add('row','justify-center', 'nomar');

        var col12 = document.createElement('div');
        col12.classList.add('col-md-12');

        vm.col6 = document.createElement('div');
        vm.col6.id = 'media-'+row_num;
        vm.col6.classList.add('col-md-6', 'nopad');

        var col3_2 = document.createElement('div');
        col3_2.classList.add('col-md-3', 'nopad-left');

        vm.description = document.createElement('div');
        vm.description.classList.add('header-text', 'padding-left');
        vm.description.appendChild(document.createTextNode('Description'));

        var desc = document.createElement('div');
        desc.classList.add('description-text', 'padding-left');
        vm.description_text = document.createTextNode('');
        desc.appendChild(vm.description_text);

        vm.stack = document.createElement('div');
        vm.stack.classList.add('col-md-12', 'header-text');
        vm.stack.appendChild(document.createTextNode('Stack'));


        vm.flex_grid = document.createElement('div');
        vm.flex_grid.id = 'pflex-grid-'+row_num;
        vm.flex_grid.classList.add('row','portfolio-flex', 'col-md-12');

        vm.demo = document.createElement('div');
        vm.demo.classList.add('col-md-12', 'header-text');
        vm.demo.appendChild(document.createTextNode('Live Demo'));

        vm.link = document.createElement('div');
        vm.link.classList.add('github-button','row');

        vm.link_text = document.createElement('div');
        vm.link_text.classList.add('text');
        vm.link_text.appendChild(document.createTextNode('Live Link'));        

        vm.col5 = document.createElement('div');
        vm.col5.classList.add('col-md-5');

        /* GONNA HAVE TO ADD MEDIA DYNAMICALLY */

        vm.html.appendChild(row);
        row.appendChild(vm.title_element);
        row.appendChild(col3);
        col3.appendChild(vm.description);
        col3.appendChild(desc);
        row.appendChild(vm.col6);
        row.appendChild(col3_2);
        col3_2.appendChild(row_fill);
        row_fill.appendChild(vm.demo)
        row_fill.appendChild(vm.link);
        vm.link.appendChild(vm.link_text);
        row_fill.appendChild(vm.stack)
        row_fill.appendChild(vm.flex_grid);

        //#wrapper-0.wrapper.open
        // .row#content
        //   .col-md-12.desc-text Breathless
        //   .col-md-3
        //         .header-text.padding-left Description:
        //         .description-text.padding-left asdfasdf
        //   .col-md-6#media-0
        //   .col-md-3
        //     .row.row-fill
        //       .col-md-12.header-text Live Demo:
        //       .col-md-12.header-text Stack:

        vm.html.addEventListener("transitionend", function(event) {
            if(vm.change){
                vm.html.classList.add('open');
                vm.setData();
                vm.change = false;
            }
        }, false);

    }
    // closeData(){
    //     const vm = this;
    //     setTimeout(function(){
    //         vm.collection.close();
    //     },timeout);
        
    // }

    setData(){
        const vm = this;
        vm.setTitle();
        vm.setDesc();
        vm.setStack();
        vm.setMedia();
        // vm.setStack(stack);
    }

    setTitle(){
        const vm = this;
        vm.title_element_text.textContent = vm.title;
    }
    setDesc(){
        const vm = this;
        vm.description_text.textContent = vm.desc;
    }

    setStack(){
        const vm = this;
        vm.collection.resetIds(vm.flex_grid.id);
        vm.collection.load();
    }
    setMedia(){
        const vm = this;
        vm.media.setId(vm.media.id);
        vm.media.loadMedia(0);
    }
    close(){
        const vm = this;
        vm.html.classList.remove('open');
    }
    changeWrapper(open: boolean, title, desc, stack, media){
        const vm = this;
        //close wrapper:

        
        if(vm.title === title){ /**if no change */
            console.log('1');
            console.log(open);
            vm.change = false;
            
            if(open){
                // vm.closeData();
                vm.html.classList.remove('open');
                return false;
            } else {
                vm.title = title;
                vm.desc = desc;
                vm.collection = stack;
                vm.media = media;
                vm.setData();
                vm.html.classList.add('open');
                return true;
            }
        } else if(vm.html.classList[1] !== 'open'){ /**if all selections are closed initially/change when closed*/
            console.log('2');
            vm.change = false;
            vm.title = title;
            vm.desc = desc;
            vm.collection = stack;
            vm.media = media;
            vm.setData();
            vm.html.classList.add('open');
            return true;
        } else {
            console.log('3');
            vm.change = true;
            vm.title = title;
            vm.desc = desc;
            vm.collection = stack;
            vm.media = media;
            // vm.closeData();
            vm.html.classList.remove('open');
            return true;
        }

    }

    transitionWrapper(different_wrapper:boolean, open: boolean, title, desc, stack, media){
        const vm = this;

        var return_value;

        if(different_wrapper){
            setTimeout(function(){
                return_value = vm.changeWrapper(open, title, desc, stack, media);
                console.log('timeout: '+ return_value); 
            }, timeout);
        } else if(open === undefined){
            open = true;
            return_value = vm.changeWrapper(open, title, desc, stack, media);
        }
         else {
            return_value = vm.changeWrapper(open, title, desc, stack, media);
        }
        console.log('return_value: '+return_value);
        return return_value;
    }
}

export interface IPortfolioItem {
  title: string;
  title_image: string; 
  desc: string;
  stack: skill_badge.Collection;
  media: media.Media; 
  type: string;
}

// {"name": 'Python',      "class":'circle-50', "image":'python-5.svg'}
var breathless_stack = new skill_badge.Collection('./skills/', '', [   {"name": 'Phaser.js',       "class":'circle-100', "image":'phaser.svg'},
                                                                                    {"name": 'Photoshop',       "class":'circle-100', "image":'photoshop-cc.svg'},
                                                                                    {"name": 'jQuery',          "class":'circle-50', "image":'jquery-1.svg'}
                                                                                    ]);
var qbert_stack = new skill_badge.Collection('./skills/', '', [   {"name": 'Maya',            "class":'circle-100', "image":'maya.png'},
                                                                                    {"name": 'Photoshop',       "class":'circle-25', "image":'photoshop-cc.svg'}
                                                                                    ]);
                                                                        
// var breathless_media = new media.Media('media-0', ["./portfolio/breathless.jpg","./portfolio/breathless.jpg","./portfolio/cat.jpg"], ["./portfolio/breathless.jpg","./portfolio/cat.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
   
var m = []

m.push(new media.Media('', ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg","./portfolio/breathless_gameplay.jpg","./portfolio/breathless_controls.jpg"], ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg","./portfolio/breathless_gameplay.jpg","./portfolio/breathless_controls.jpg"]));

m.push(new media.Media('', ["./portfolio/qbert_play.jpg","./portfolio/qbert_player.jpg","./portfolio/qbert_snake.jpg"], ["./portfolio/qbert_player.jpg","./portfolio/qbert_snake.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));

m.push(new media.Media('', ["./portfolio/cgi_final_1.png","./portfolio/cgi_final_3.png","./portfolio/cgi_final_2.png"], ["./portfolio/cgi_final_1.png","./portfolio/cgi_final_3.png","./portfolio/cgi_final_2.png"]));


var portfolio = new Portfolio('portfolio', [
    {title: 'Breathless', title_image: './portfolio/breathless.jpg', desc:"The Space Pirate, Aria, is on a mission to loot a mineral cargo ship. However, upon landing on the cargo ship, Aria's helmet cracks causing her to slowly lose oxygen. It's now a race against time to collect all the gems before her oxygen runs out!", stack:breathless_stack, media: m[0], type: 'HTML5 Game'},
    {title: 'Q*Bert', title_image: "./portfolio/qbert_play.jpg", desc:'This is my Bouncing Ball Assignment for Animation 1 at Drexel University. When picking a game that mixes my love of retro video games and bouncing balls, Q*Bert was a no-brainer. Everything is individually modelled, textured, and animated by me. Made in Maya, and rendered in V-Ray.', stack:qbert_stack, media: m[1], type: 'Animation'},
    {title: 'Bedroom', title_image: './portfolio/cgi_final_1.png', desc:'asdf', stack:qbert_stack, media: m[2], type: '3D Render'}]);



/** 
 * portfolio website
 * breathless
 * weather website
 * qbert animation
 * cgi 2 final?? 
 * 
*/






// var media = new Media('media-0', ["./portfolio/breathless.jpg","./portfolio/breathless.jpg","./portfolio/cat.jpg"], ["./portfolio/breathless.jpg","./portfolio/cat.jpg", "./portfolio/cat.jpg"]);

