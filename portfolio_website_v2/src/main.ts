import * as jump from "jump.js";

import * as image_canvas from "./image_canvas";

import * as skill_badge from "./skill_badge";

import * as media from "./media";

import Viewer from 'viewerjs';

//yoo
const timeout: number = 1000;

var frontend = new skill_badge.Collection('./skills/', 'flex-grid1', [
    { "name": 'Python', "class": 'circle-100', "image": 'python-5.svg' },
    { "name": 'C#', "class": 'circle-100', "image": 'csharp.svg' },
    { "name": 'Java Script', "class": 'circle-100', "image": 'javascript-2.svg' },
    { "name": 'C++', "class": 'circle-75', "image": 'c-seeklogo.com.svg' },
    { "name": 'Java', "class": 'circle-50', "image": 'java-14.svg' },
    { "name": 'Node JS', "class": 'circle-25', "image": 'nodejs-icon.svg' },

// { "name": 'jQuery', "class": 'circle-100', "image": 'jquery-1.svg' },
// { "name": 'Ember JS', "class": 'circle-100', "image": 'ember.svg' },
// { "name": 'Angular JS', "class": 'circle-75', "image": 'angular-icon.svg' },
// { "name": 'Type Script', "class": 'circle-75', "image": 'typescript.svg' },
// { "name": 'D3.js', "class": 'circle-75', "image": 'd3-2.svg' },
// { "name": 'SCSS', "class": 'circle-50', "image": 'sass-1.svg' },
// { "name": 'React JS', "class": 'circle-25', "image": 'react.svg' }
], false, 'frontend');
var softeng = new skill_badge.Collection('./skills/', 'flex-grid2', [
    { "name": 'Unreal Engine 5', "class": 'circle-100', "image": 'unreal.svg' },
    { "name": 'Unity', "class": 'circle-100', "image": 'unity.svg' },
    { "name": 'Maya', "class": 'circle-100', "image": 'maya.png' },
    { "name": 'Houdini', "class": 'circle-100', "image": 'houdini.png'},
    { "name": 'Blender', "class": 'circle-50', "image": 'blender.svg'},
    
], false, 'softeng');
var design = new skill_badge.Collection('./skills/', 'flex-grid3', [
{ "name": 'HTML5', "class": 'circle-100', "image": 'html5.svg' },
{ "name": 'CSS', "class": 'circle-100', "image": 'css-3.svg' },
{ "name": 'Illustrator', "class": 'circle-100', "image": 'adobe-illustrator-cc.svg' },
{ "name": 'After Effects', "class": 'circle-50', "image": 'after-effects-cc.svg' },
{ "name": 'Motion Builder', "class": 'circle-25', "image": 'mobu.png' },
{ "name": 'Vicon Blade', "class": 'circle-25', "image": 'vicon.png' },
{ "name": 'Photoshop', "class": 'circle-25', "image": 'photoshop-cc.svg' },
// { "name": 'Mudbox', "class": 'circle-25', "image": 'mudbox.png' }
], false, 'design');
frontend.load();
softeng.load();
design.load();


var app;
document.addEventListener('DOMContentLoaded', function (event) {
    app = new image_canvas.App();
});


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
    url: string;

    item_num: number;

    col_size: string;
    col: HTMLDivElement;
    img: HTMLImageElement;
    text: HTMLDivElement;
    sub_text: HTMLDivElement;

    open: boolean;
    media: media.Media;
    target_wrapper: Wrapper;
    portfolio: Portfolio;
    row: number;

    constructor(portfolio: Portfolio, item_num: number, title: string, title_image: string, desc: string, stack: skill_badge.Collection, media: media.Media, type: string, url: string) {
        const vm = this;

        vm.portfolio = portfolio;
        vm.item_num = item_num;
        vm.title = title;
        vm.title_image = title_image;
        vm.desc = desc;
        vm.stack = stack;
        vm.media = media;
        vm.url = url;
        vm.col_size = "col-md-3";


        vm.col = document.createElement('div');
        vm.col.classList.add(vm.col_size);

        var card_shadow = document.createElement('div');
        card_shadow.classList.add('card-dropshadow', 'row');

        var nopad = document.createElement('div');
        nopad.classList.add('col-xs-12', 'nopad');

        vm.img = document.createElement('img');
        vm.img.src = vm.title_image;

        var col12 = document.createElement('div');
        col12.classList.add('col-xs-12');

        vm.text = document.createElement('div');
        vm.text.classList.add('text', 'padding-top');
        vm.text.appendChild(document.createTextNode(title));

        var col12_2 = document.createElement('div');
        col12_2.classList.add('col-xs-12');

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

        vm.col.onclick = function () {
            //   console.(vm.items[0]);
            var different_wrapper = false;

            different_wrapper = vm.portfolio.close(vm.item_num);

            vm.open = vm.target_wrapper.transitionWrapper(different_wrapper, vm.open, vm.title, vm.desc, vm.stack, vm.media, vm.url)

            setTimeout(function () {
                jump('#wrapper-' + vm.row, {
                    duration: 1000,
                    offset: -vm.col.clientHeight - 35
                })
            }, timeout);


            //   vm.setData();  
        }

    }
    append(row: number, wrapper: Wrapper) {
        const vm = this;
        var row_element = document.getElementById('row_' + row);
        row_element.appendChild(vm.col);
        vm.target_wrapper = wrapper;
        vm.stack.flex_grid_id = wrapper.flex_grid.id;
        vm.media.id = 'media-' + row;
        vm.row = row;
    }
    setCol(className: string) {
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
    per_row: number;

    constructor(id: string, json_objs: IPortfolioItem[]) {
        const vm = this;
        vm.id = id;
        vm.json_objs = json_objs;


        vm.items = [];
        vm.wrappers = [];

        //add wrappers based on all possible breakpoint widths (json_objs/2)
        for (var j = 0; j < Math.ceil(json_objs.length / 2); j++) {
            vm.wrappers.push(new Wrapper(j));
        }

        //add all items
        for (var i = 0; i < vm.json_objs.length; i++) {
            vm.items.push(new PortfolioItem(vm, i, json_objs[i].title, json_objs[i].title_image, json_objs[i].desc, json_objs[i].stack, json_objs[i].media, json_objs[i].type, json_objs[i].url));
        }

        vm.appendAll();


    }

    public appendAll() { //appends PortfolioItems based on screen size; gets digested
        const vm = this;
        var screenWidth = window.innerWidth;

        //reassigns cols based on breakpoints
        var breakpoints = [{ min: 0, max: 768, col_size: 'col-xs-6', per_row: 2 }, { min: 769, max: 992, col_size: 'col-xs-4', per_row: 3 }, { min: 993, max: 1200, col_size: 'col-xs-3', per_row: 4 }, { min: 1200, max: 9999, col_size: 'col-xs-3', per_row: 4 }];
        for (var i = 0; i < breakpoints.length; i++) {

            //if in breakpoint range, and not same as before
            if (/*vm.items[0].col_size !== breakpoints[i].col_size && */screenWidth > breakpoints[i].min && screenWidth < breakpoints[i].max) {
                //clear all rows
                vm.per_row = breakpoints[i].per_row;
                var parent = document.getElementById('portfolio');
                var iterator = parent.children.length;
                for (var a = 1; a < iterator; a++) {
                    parent.removeChild(parent.children[1]);
                }

                //add new rows and wrappers
                for (var r = 0; r < Math.ceil(vm.items.length / breakpoints[i].per_row); r++) {
                    var row = document.createElement('div');
                    row.id = 'row_' + r;
                    row.classList.add('row', 'nomar');

                    var wrapper = vm.wrappers[r].html;

                    parent.appendChild(row);
                    parent.appendChild(wrapper);
                }
                //add cols to new rows
                for (var j = 0; j < vm.items.length; j++) {
                    vm.items[j].setCol(breakpoints[i].col_size);
                    var row_num = Math.floor(j / breakpoints[i].per_row);
                    vm.items[j].append(row_num, vm.wrappers[row_num]);
                }
            }
        }
    }

    public close(item_num: number) { //closes all wrappers
        const vm = this;
        //closes all items in the row of the given item.
        var row = Math.floor(item_num / vm.per_row);

        // for(var j = (row*vm.per_row); j < ((row*vm.per_row)+vm.per_row); j++){
        //     if(item_num !== j && vm.items[j]){
        //         vm.items[j].open = false;
        //     }
        // }
        var return_value = false;

        for (var j = 0; j < vm.items.length; j++) {
            if (item_num !== j && vm.items[j]) {
                vm.items[j].open = false;
            }
        }
        for (var r = 0; r < vm.wrappers.length; r++) {
            if (r !== row && vm.wrappers[r].html.classList[1] === 'open') {
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
    url: string;


    html: HTMLDivElement;
    title_element: HTMLDivElement;
    description: HTMLDivElement;
    stack: HTMLDivElement;
    flex_grid: HTMLDivElement;
    demo: HTMLDivElement;
    col5: HTMLDivElement;
    description_text: Text;
    title_element_text: Text;
    link: HTMLDivElement;
    link_text: HTMLDivElement;
    col6: HTMLDivElement;
    col6Holder: HTMLDivElement;

    change: boolean;

    constructor(row_num) {
        const vm = this;

        vm.change = false;
        // vm.title = pItem.title;
        // vm.desc = pItem.desc;
        // vm.stack = pItem.stack;
        // vm.port_image = pItem.port_image;
        vm.html = document.createElement('div');
        vm.html.id = 'wrapper-' + row_num;
        vm.html.classList.add('wrapper');

        var row = document.createElement('div');
        row.id = 'content';
        row.classList.add('row', 'nomar');

        vm.title_element = document.createElement('div');
        vm.title_element.classList.add('col-xs-12', 'desc-text2', 'pad-spacing');
        vm.title_element_text = document.createTextNode('');
        vm.title_element.appendChild(vm.title_element_text);

        vm.col6Holder = document.createElement('div');
        vm.col6Holder.classList.add('col-xs-12', 'col-md-6', 'col-lg-7', 'row', 'nomar', 'nopad');

        var row_fill = document.createElement('div');
        row_fill.classList.add('row', 'justify-center', 'nomar');

        var col12 = document.createElement('div');
        col12.classList.add('col-xs-12');

        vm.col6 = document.createElement('div');
        vm.col6.id = 'media-' + row_num;
        vm.col6.classList.add('col-xs-12', 'col-md-6', 'col-lg-5');

        var col3_2 = document.createElement('div');
        col3_2.classList.add('col-xs-12', 'col-md-3', 'nopad-left');

        vm.description = document.createElement('div');
        vm.description.classList.add('header-text', 'pad-spacing');
        vm.description.appendChild(document.createTextNode('Description'));

        var desc = document.createElement('div');
        desc.classList.add('description-text', 'pad-spacing');
        vm.description_text = document.createTextNode('');
        desc.appendChild(vm.description_text);

        vm.stack = document.createElement('div');
        vm.stack.classList.add('col-xs-12', 'col-md-12', 'col-lg-7');
        // vm.stack.appendChild(document.createTextNode('Stack'));

        var stack_title = document.createElement('div');
        stack_title.classList.add('header-text', 'pad-spacing')
        stack_title.appendChild(document.createTextNode('Skills Used'));

        vm.flex_grid = document.createElement('div');
        vm.flex_grid.id = 'pflex-grid-' + row_num;
        vm.flex_grid.classList.add('row', 'portfolio-flex', 'col-xs-12');

        vm.demo = document.createElement('div');
        vm.demo.classList.add('col-xs-12', 'col-md-12', 'col-lg-5');
        // vm.demo.appendChild(document.createTextNode('Live Demo'));

        var demo_title = document.createElement('div');
        demo_title.classList.add('header-text', 'pad-spacing')
        demo_title.appendChild(document.createTextNode('Relevant Links'));



        vm.link = document.createElement('div');
        vm.link.classList.add('github-button', 'row', 'nomar');

        vm.link_text = document.createElement('div');
        vm.link_text.classList.add('black-text');
        vm.link_text.appendChild(document.createTextNode('Live Link'));

        vm.col5 = document.createElement('div');
        vm.col5.classList.add('col-xs-12', 'col-md-5');

        /* GONNA HAVE TO ADD MEDIA DYNAMICALLY */

        vm.html.appendChild(row);
        row.appendChild(vm.title_element);
        row.appendChild(vm.col6);
        row.appendChild(vm.col6Holder);


        vm.col6Holder.appendChild(col12);
        col12.appendChild(vm.description);
        col12.appendChild(desc);
        vm.col6Holder.appendChild(vm.stack)
        vm.stack.appendChild(stack_title);
        vm.stack.appendChild(vm.flex_grid);
        
        vm.col6Holder.appendChild(vm.demo)
        vm.demo.appendChild(demo_title);
        vm.demo.appendChild(vm.link);
        vm.link.appendChild(vm.link_text);
        vm.link.onclick = function () {
            location.href = vm.url;
        }

        

        //#wrapper-0.wrapper.open
        // .row#content
        //   .col-md-12.desc-text Breathless
        //   .col-md-6#media-0
        //   .col-md-6.row
        //       .col-md-12
        //         .header-text.padding-left Description:
        //         .description-text.padding-left asdfasdf
        //       .col-md-6.header-text Stack:
        //       .col-md-6.header-text Live Demo:

        vm.html.addEventListener("transitionend", function (event) {
            if (vm.change) {
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

    setData() {
        const vm = this;
        vm.setTitle();
        vm.setDesc();
        vm.setStack();
        vm.setMedia();

        if(vm.url === ""){
            vm.col6Holder.removeChild(vm.demo);
        } else if(vm.col6Holder.lastChild !== vm.demo){
            vm.col6Holder.appendChild(vm.demo);            
        }
        // vm.setStack(stack);
    }

    setTitle() {
        const vm = this;
        vm.title_element_text.textContent = vm.title;
    }
    setDesc() {
        const vm = this;
        vm.description_text.textContent = vm.desc;
    }

    setStack() {
        const vm = this;
        vm.collection.resetIds(vm.flex_grid.id);
        vm.collection.load();
    }
    setMedia() {
        const vm = this;
        vm.media.setId(vm.media.id);
        vm.media.loadMedia(0);
    }
    close() {
        const vm = this;
        vm.html.classList.remove('open');
    }
    changeWrapper(open: boolean, title, desc, stack, media, url) {
        const vm = this;
        //close wrapper:


        if (vm.title === title) { /**if no change */
            vm.change = false;

            if (open) {
                // vm.closeData();
                vm.html.classList.remove('open');
                return false;
            } else {
                vm.title = title;
                vm.desc = desc;
                vm.collection = stack;
                vm.media = media;
                vm.url = url;
                vm.setData();
                vm.html.classList.add('open');
                return true;
            }
        } else if (vm.html.classList[1] !== 'open') { /**if all selections are closed initially/change when closed*/
            vm.change = false;
            vm.title = title;
            vm.desc = desc;
            vm.collection = stack;
            vm.media = media;
            vm.url = url;
            vm.setData();
            vm.html.classList.add('open');
            return true;
        } else {
            vm.change = true;
            vm.title = title;
            vm.desc = desc;
            vm.collection = stack;
            vm.media = media;
            vm.url = url;
            // vm.closeData();
            vm.html.classList.remove('open');
            return true;
        }

    }

    transitionWrapper(different_wrapper: boolean, open: boolean, title, desc, stack, media, url) {
        const vm = this;

        var return_value;

        if (different_wrapper) {
            setTimeout(function () {
                return_value = vm.changeWrapper(open, title, desc, stack, media, url);
            }, timeout);
        } else if (open === undefined) {
            open = true;
            return_value = vm.changeWrapper(open, title, desc, stack, media, url);
        }
        else {
            return_value = vm.changeWrapper(open, title, desc, stack, media, url);
        }
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
    url: string;
}

// {"name": 'Python',      "class":'circle-50', "image":'python-5.svg'}
var breathless_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Phaser.js', "class": 'circle-100', "image": 'phaser.svg' },
{ "name": 'Photoshop', "class": 'circle-100', "image": 'photoshop-cc.svg' },
{ "name": 'jQuery', "class": 'circle-50', "image": 'jquery-1.svg' }],
true
);
var rem_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Unity', "class": 'circle-100', "image": 'unity.svg' },
{ "name": 'Maya', "class": 'circle-25', "image": 'maya.png' },
{ "name": 'Photoshop', "class": 'circle-25', "image": 'photoshop-cc.svg'},
{ "name": 'Illustrator', "class": 'circle-25', "image": 'adobe-illustrator-cc.svg'}],
true
);

var jedi_3_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Maya', "class": 'circle-100', "image": 'maya.png' },
{ "name": 'Unreal', "class": 'circle-75', "image": 'unreal.svg' },
{ "name": 'Blender', "class": 'circle-25', "image": 'blender.svg'}],
true
);

var survivor_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Unreal', "class": 'circle-100', "image": 'unreal.svg' },
{ "name": 'Houdini', "class": 'circle-75', "image": 'houdini.png'},
{ "name": 'Maya', "class": 'circle-75', "image": 'maya.png' }],
true
);

var mouse_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Unity', "class": 'circle-100', "image": 'unity.svg' },
{ "name": 'Motion Builder', "class": 'circle-75', "image": 'mobu.png' },
{ "name": 'Maya', "class": 'circle-50', "image": 'maya.png' },
{ "name": 'Vicon Blade', "class": 'circle-50', "image": 'vicon.png' },
],
true
);

var nk_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Unity', "class": 'circle-100', "image": 'unity.svg' },
{ "name": 'Illustrator', "class": 'circle-100', "image": 'adobe-illustrator-cc.svg'}],
true
);

var bee_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Unity', "class": 'circle-100', "image": 'unity.svg' },
],
true
);

var cave_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Houdini', "class": 'circle-100', "image": 'houdini.png'},
{ "name": 'Unity', "class": 'circle-100', "image": 'unity.svg' }],
true
);

var storygraph_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Unity', "class": 'circle-100', "image": 'unity.svg' },
{ "name": 'After Effects', "class": 'circle-25', "image": 'after-effects-cc.svg' }],
true
);
var qbert_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Maya', "class": 'circle-100', "image": 'maya.png' },
{ "name": 'Photoshop', "class": 'circle-25', "image": 'photoshop-cc.svg' }],
true
);
var weather_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Angular JS', "class": 'circle-100', "image": 'angular-icon.svg' },
{ "name": 'D3.js', "class": 'circle-50', "image": 'd3-2.svg' }],
true
);

var roast_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Ember JS', "class": 'circle-100', "image": 'ember.svg' },
{ "name": 'D3.js', "class": 'circle-75', "image": 'd3-2.svg' }],
true
);

var contrast_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Java', "class": 'circle-100', "image": 'java-14.svg' }],
true
);

var port_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Type Script', "class": 'circle-100', "image": 'typescript.svg' }, 
{ "name": 'HTML5', "class": 'circle-100', "image": 'html5.svg' },
{ "name": 'SCSS', "class": 'circle-100', "image": 'sass-1.svg' }],
true
);

// var breathless_media = new media.Media('media-0', ["./portfolio/breathless.jpg","./portfolio/breathless.jpg","./portfolio/cat.jpg"], ["./portfolio/breathless.jpg","./portfolio/cat.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');

var m = []

m.push(new media.Media('', [ "./portfolio/rem_5.png", "./portfolio/rem_3.png", "./portfolio/rem_2.png", "./portfolio/rem_4.png"], [ "./portfolio/rem_3.png", "./portfolio/rem_2.png", "./portfolio/rem_4.png"], '<iframe src="https://player.vimeo.com/video/252436989" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/tutorial_04.png','./portfolio/tutorial_01.png', './portfolio/tutorial_02.png', './portfolio/tutorial_03.png'], ['./portfolio/tutorial_01.png', './portfolio/tutorial_02.png', './portfolio/tutorial_03.png'], '<iframe width="560" height="315" src="https://www.youtube.com/embed/MsZjUHhCjJ8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'));
m.push(new media.Media('', ["./portfolio/island_03.png", "./portfolio/island_01.png", "./portfolio/island_02.png"], ["./portfolio/island_01.png", "./portfolio/island_02.png"], '<iframe src="https://player.vimeo.com/video/456677243" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>'));
// m.push(new media.Media('', ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"], ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"]));
// m.push(new media.Media('', ["./portfolio/qbert_play.jpg", "./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], ["./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
// m.push(new media.Media('', ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"], ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"]));
// m.push(new media.Media('', ['./portfolio/mean_forecast_1.jpg', './portfolio/mean_forecast_2.jpg'], ['./portfolio/mean_forecast_1.jpg', './portfolio/mean_forecast_2.jpg']));
// m.push(new media.Media('', ['./portfolio/roast_6.png', './portfolio/roast_2.png', './portfolio/roast_3.png', './portfolio/roast_4.png'], ['./portfolio/roast_6.png', './portfolio/roast_2.png','./portfolio/roast_3.png', './portfolio/roast_4.png']));
m.push(new media.Media('', ['./portfolio/StoryGraph_Card.png','./portfolio/storygraph_1.jpg', './portfolio/storygraph_2.jpg'], ['./portfolio/storygraph_1.jpg', './portfolio/storygraph_2.jpg'], '<iframe src="https://player.vimeo.com/video/369747471" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/crowd_1.png','./portfolio/crowd_2.png', './portfolio/crowd_3.png'], ['./portfolio/crowd_1.png','./portfolio/crowd_2.png', './portfolio/crowd_3.png']));
m.push(new media.Media('', ['./portfolio/bioshroom_1.png','./portfolio/bioshroom_2.png', './portfolio/bioshroom_3.png', './portfolio/bioshroom_4.png'], ['./portfolio/bioshroom_1.png','./portfolio/bioshroom_2.png','./portfolio/bioshroom_3.png'], '<iframe src="https://player.vimeo.com/video/369752631" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/axonrush_1.png','./portfolio/axonrush_2.png', './portfolio/axonrush_3.gif'], ['./portfolio/axonrush_2.png', './portfolio/axonrush_3.gif'], '<iframe src="https://player.vimeo.com/video/438301388" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/robot_1.png','./portfolio/robot_2.png', './portfolio/robot_3.png'], ['./portfolio/robot_2.png','./portfolio/robot_3.png'], '<iframe src="https://player.vimeo.com/video/369784543" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/cave_3.png','./portfolio/cave_2.png', './portfolio/cave_1.png', './portfolio/cave_4.png'], ['./portfolio/cave_2.png','./portfolio/cave_1.png','./portfolio/cave_4.png'], '<iframe src="https://player.vimeo.com/video/369789127" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/tube_3.png', './portfolio/tube_2.png', './portfolio/tube_4.png'], ['./portfolio/tube_2.png','./portfolio/tube_4.png'], '<iframe src="https://player.vimeo.com/video/369955460" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/hyperhop_01.gif', './portfolio/hyperhop_02.gif', './portfolio/hyperhop_03.gif'], ['./portfolio/hyperhop_01.gif', './portfolio/hyperhop_02.gif', './portfolio/hyperhop_03.gif']));
m.push(new media.Media('', ['./portfolio/bee_1.png', './portfolio/bee_2.png', './portfolio/bee_3.png'], ['./portfolio/bee_2.png', './portfolio/bee_3.png'], '<iframe src="https://player.vimeo.com/video/370220935" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/survivor_3.png', './portfolio/survivor_1.jpg','./portfolio/survivor_2.jpg'], ['./portfolio/survivor_3.png', './portfolio/survivor_1.jpg','./portfolio/survivor_2.jpg']));
m.push(new media.Media('', ['./portfolio/jedi_1.png'], ['./portfolio/jedi_1.png']));
// m.push(new media.Media('', ['./portfolio/port_1.png', './portfolio/port_2.png', './portfolio/port_3.png',  './portfolio/port_4.png'], ['./portfolio/port_1.png', './portfolio/port_2.png', './portfolio/port_3.png', './portfolio/port_4.png']));

var portfolio = new Portfolio('portfolio', [
    { title: 'Star Wars Jedi: Survivor', title_image: './portfolio/star_wars_card.jpg', desc: "During development on Star Wars Jedi: Survivor, I worked closely with both the Environment and Lighting teams to build tools and systems that streamlined content creation and improved in-game performance. For the Environment team, I created procedural modeling tools in Houdini, including a Cable Tool and a Pipe Tool, which allowed artists to quickly generate flexible, physics-enabled assets with full collision support for use throughout the game’s expansive levels. For the Lighting team, I helped design and implement a customizable fog card material shader, giving artists greater control over atmospheric effects while maintaining visual consistency and performance.\n\n In Unreal Engine, I developed DCC tools for level designers and environment artists using both C++ and Unreal Python, enabling more efficient workflows and tighter integration between the editor and external content creation tools. I also contributed to broader optimization efforts by building Blueprint performance debugging tools and improving level performance through HLOD setup, material and poly complexity reduction, and faster level streaming. These efforts were critical in helping the game hit its performance targets, particularly on console platforms like the PlayStation 5.", stack: survivor_stack, media: m[12], type: 'Unreal Engine Game', url: 'https://www.ea.com/games/starwars/jedi-survivor' },
    { title: 'Star Wars Jedi: 3', title_image: './portfolio/star_wars_3_card.png', desc: "On Star Wars Jedi: 3, I played a key role in architecting and modernizing our Maya Python codebase to improve efficiency and scalability. One of my larger projects was a Cinematics Exporter tool, I added the feature to read and update data from a backend cinematics database, allowing for more efficient asset tracking and management. I then implemented a multithreaded process that reduced export times from 2 hours to just 10 minutes, significantly improving the cinematics pipeline and enabling quicker turnaround times for cinematic content. \n\nAdditionally, I developed a Character Manager tool using MVC (Model-View-Controller) architecture, leveraging PyQt for the UI and OpenMaya and Maya cmds for seamless integration with Maya’s core. The tool utilized a structured dataset to load characters and their attachments, offering more flexibility and modularity for artists and animators working with complex rigs. These tools not only modernized our workflows but also laid the foundation for more efficient and scalable content creation as the project evolved.", stack: jedi_3_stack, media: m[13], type: 'Unreal Engine Game', url: '' },
    { title: 'The Story Graph', title_image: './portfolio/StoryGraph_Card.png', desc: "The Story Graph is a node based visual scripting tool. Similar to Blueprints in Unreal Engine 4, The Story Graph makes scripting easy for designers and developers who want to prototype rapidly. This is a Unity Custom Editor Tool that can be bought on the Unity Asset Store.", stack: storygraph_stack, media: m[3], type: 'Unity Custom Editor Tool', url: 'https://assetstore.unity.com/packages/tools/visual-scripting/story-graph-136713' },
    { title: 'Island Designer', title_image: './portfolio/island.png', desc: "During my SideFX Internship I created an Island Designer game as an experimental prototype for Houdini generation of content during runtime. I developed this project entirely from the ground up, including all the Houdini procedural assets, user interface, and interactions. This island designer explores interactions such as painting grass, placing curved assets such as bridges and waterfalls, and placing randomly generated objects such as palm trees and houses. Along the way I learned a lot about Houdini procedural modeling, as well as pipeline integration with Unity. Please note that this was experimental only, and should not be seen as any indication for plans SideFX has for runtime generation of content.", stack: cave_stack, media: m[2], type: 'Houdini Internship Game Demo', url: '' },
    { title: 'Procedural Modeling Tutorial', title_image: './portfolio/lahug.jpeg', desc: "A tutorial presented at the LA Houdini User Group on procedural modeling for games using Houdini. Showcases the basics of VEX, and how I went about creating a procedural bridge during my Houdini Internship.", stack: cave_stack, media: m[1], type: 'Houdini Tutorial', url: 'https://www.youtube.com/watch?v=MsZjUHhCjJ8' },
    { title: 'Hyperhop: Galactic Lancer', title_image: './portfolio/hyperhop.png', desc: "Hyperhop is my Ludum Dare 46 Game Jam submission. On a team of four, in just 72 hours I modeled, animated, and scripted behavior the of the planets, as well as rigged the main character. I learned a lot about blendshapes and creating facial rigs in Houdini as well as animation states in Unity.", stack: cave_stack, media: m[10], type: 'Unity Game Demo', url: 'https://swanijam.itch.io/hyperhop' },
    { title: 'Axon Rush', title_image: './portfolio/axonrush.png', desc: "Axon Rush is my Global Game Jam 2020 submission. On a team of six, we wanted to make a game about mental health... literally! Our game Axon Rush is a 3D Platformer where it is your job to repair the the brain by shooting electric impulses to broken axons. I worked on VFX and the player character shooting behavior.", stack: cave_stack, media: m[6], type: 'Unity Game Demo', url: 'https://globalgamejam.org/2020/games/axon-rush-2' },
    { title: 'Bioshroom', title_image: './portfolio/bioshroom_card.png', desc: "Bioshroom is a first person exploration and gardening game. You are a Biologist exploring a foreign planet infested with mushrooms. It is your goal to explore the planet, gather new mushrooms, and breed them to send back to your home planet. On this project I worked as a technical artist and developer. I developed a procedural mushroom using blendshapes, as well as a mushroom spawner that uses vertex colors on the ground.", stack: rem_stack, media: m[5], type: 'Unity Game Demo', url: '' },
    /// { title: 'And the Crowd Goes Wild!', title_image: './portfolio/crowd_card.png', desc: "And the Crowd Goes Wild is a virtual reality interactive experience where you put on a magic show for an audience of ghosts. This experience uses Oculus VR as well as the Leapmotion to truly simulate magic coming out of your fingertips via Leap Motion gestures. I developed this game entirely using The Story Graph, the Unity Custom Editor Tool I created. Made in only 1 month for my Introduction to Virtual Reality class, this experience explores Virtual Reality User Experience design with gesture based controls.", stack: storygraph_stack, media: m[4], type: 'Unity VR Experience', url: '' },
    // { title: 'Hive Jive', title_image: './portfolio/bee_card.png', desc: "Hive Jive is a virtual reality game where you fly around as a bee. The goal of the game is to repollinate the island and clear it of all its trash. I worked in a group as a Technical Artist, where I created the bee fur shader, the grass shader, rigging the bee, and setting up GPU painting on the player controller. This game was shown at Siggraph at Drexel University's booth using a Motorbike Controller.", stack: bee_stack, media: m[11], type: 'Virtual Reality Game', url: '' },
    // { title: 'Procedural Cave', title_image: './portfolio/cave_card.png', desc: "This Procedural Cave has controls number of rooms, stalagmites, number of hallways between rooms, as well as using a proceudral material. The procedural material is exported from Houdini's texture baker, and brought into Unity. Perfect asset for any dungeon crawler.", stack: cave_stack, media: m[8], type: 'Houdini Model', url: '' },
    // { title: 'Tube Dome Experience', title_image: './portfolio/tube_card.png', desc: "For a Dome exhibit I created an abstract tube animation using distance field volumes, and a GPU proceudral mesh compute shader in Unity. To export for the dome, I developed a Fisheye Lens Render Pipeline. For this project I leveraged open source from Keijiro.", stack: storygraph_stack, media: m[9], type: 'Immersive Experience', url: '' },
    // { title: 'Rem', title_image: './portfolio/rememberence_logo.jpg', desc: "Rem is a video game about a young girl trapped in a comatose dreamscape. You play as a young girl who must overcome her fears to remember her past. In this fun, over-the-shoulder stealth game you must avoid screen headed enemies, and find mementos of your past. For this project I worked in many areas including Level Design, Visual Effects, Web Development, Modeling, and Documentation.", stack: rem_stack, media: m[0], type: 'Unity Game', url: 'https://offbrandhellui.herokuapp.com/#/home' },
    // { title: 'Rem', title_image: './portfolio/rememberence_logo.jpg', desc: "Rem is a video game about a young girl trapped in a comatose dreamscape. You play as a young girl who must overcome her fears to remember her past. In this fun, over-the-shoulder stealth game you must avoid screen headed enemies, and find mementos of your past. For this project I worked in many areas including Level Design, Visual Effects, Web Development, Modeling, and Documentation.", stack: rem_stack, media: m[0], type: 'Unity Game', url: 'https://offbrandhellui.herokuapp.com/#/home' },
    // { title: 'Door to Door', title_image: './portfolio/robot_card.png', desc: "As part of my Animation class, I created a short film about a robot who goes through many strange worlds. I modeled, textured, rigged, and animated everything and rendered out in Unity. I also created a toon shader with a highlight and outline as well as did some VFX in Unity. It was a huge learning experience to go through every part of the animation pipeline!", stack: rem_stack, media: m[7], type: 'Robot Animation', url: '' }]);
    // { title: 'Roast', title_image: './portfolio/roast_7.jpg', desc: "Roast is a webapp that surveys comfort in an indoor space. It asks questions that gauge temperature, noise, smell, and humidity, and maps it to where you are on your building's floorplan. Through this crowd sourced data collected, building managers, architects and the people taking the survey can understand how people feel in a space. I worked on this project for 6 months while I was working at the architecture firm, Kieran Timberlake.", stack: roast_stack, media: m[5], type: 'Web App', url: '' },
    // { title: 'Portfolio', title_image: './portfolio/port_1.png', desc: "From concept to design to development I put a lot of love into this. As a personal challenge I created this website entirely in Typescript with no jQuery. All in all I can conclude that jQuery is overrated! Java Script is powerful enough on its own.", stack: port_stack, media: m[7], type: 'Website', url: 'https://github.com/mattwagar/Websites/tree/master/portfolio_website_v2' },
    // { title: 'Breathless', title_image: './portfolio/breathless.jpg', desc: "The Space Pirate, Aria, is on a mission to loot a mineral cargo ship. However, upon landing on the cargo ship, Aria's helmet cracks causing her to slowly lose oxygen. It's now a race against time to collect all the gems before her oxygen runs out!", stack: breathless_stack, media: m[2], type: 'HTML5 Game', url: '/breathless' }]);
    // { title: 'Breathless', title_image: './portfolio/breathless.jpg', desc: "The Space Pirate, Aria, is on a mission to loot a mineral cargo ship. However, upon landing on the cargo ship, Aria's helmet cracks causing her to slowly lose oxygen. It's now a race against time to collect all the gems before her oxygen runs out!", stack: breathless_stack, media: m[2], type: 'HTML5 Game', url: '/breathless' }]);
    // { title: 'Mean Forecast', title_image: './portfolio/mean_forecast_1.jpg', desc: 'A small web app that calculates the average of 3 weather API\'s: Wunderground, Forecast.io, and World Weather Online. This data is then served onto a D3.js Line Chart for temperature, humidty, and windspeed. Also the webapp itself has many subtleties that are affected by weather data. For example, the video  resembles the current weather. Also each graph is color coated by a gradient based on the weather data.', stack: weather_stack, media: m[4], type: 'Website', url: '/meanforecast' },
    // { title: 'Q*Bert', title_image: "./portfolio/qbert_play.jpg", desc: 'This is my Bouncing Ball Assignment for Animation 1 at Drexel University. When picking a game that mixes my love of retro video games and bouncing balls, Q*Bert was a no-brainer. Everything is originally modelled, textured, and animated. Made in Maya, and rendered in V-Ray.', stack: qbert_stack, media: m[2], type: 'Animation', url: 'https://vimeo.com/198149795' },
    // { title: 'Bedroom', title_image: './portfolio/cgi_final_1.png', desc: 'This is my final for CGI 2 at Drexel University. The assignment was to recreate any type of room, so I chose a little boy\'s room. We were tasked with creating at least one complex object, so I decided to go with a train set.', stack: qbert_stack, media: m[3], type: '3D Render', url: '' }]);
    ]);


// var welcome_b = document.getElementById('welcome-button');
// welcome_b.onclick = function () {
//     jump('#portfolio', {
//         duration: 1000,
//         offset: 0,
//         callback: undefined,
//         easing: jump.easeInOutQuad,
//         ally: false
//     })
// }


/** 
 * portfolio website
 * breathless
 * weather website
 * qbert animation
 * cgi 2 final?? 
 * 
*/



window.onresize = (e) => {
    if (app.canvas) {
        app.sizeCanvas();
    }

    portfolio.appendAll();

};

const modal = document.getElementById("imageModal");
window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  
const closeBtn = document.querySelector(".close");
closeBtn.onclick = function () {
    modal.style.display = "none";
};


// var docWidth = document.documentElement.offsetWidth;

// [].forEach.call(
//   document.querySelectorAll('*'),
//   function(el) {
//     if (el.offsetWidth > docWidth) {
//       console.log(el);
//     }
//   }
// );

// var media = new Media('media-0', ["./portfolio/breathless.jpg","./portfolio/breathless.jpg","./portfolio/cat.jpg"], ["./portfolio/breathless.jpg","./portfolio/cat.jpg", "./portfolio/cat.jpg"]);

