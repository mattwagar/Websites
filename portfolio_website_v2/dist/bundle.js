(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require("./image_canvas"));
function lerp(from, to, percent) {
    var differance = to - from;
    return from + (differance * percent);
}
exports.lerp = lerp;
var Img = (function () {
    function Img(width, height) {
        var vm = this;
        vm.canvas = document.createElement('canvas');
        vm.ctx = vm.canvas.getContext('2d');
        vm.w = vm.canvas.width = width;
        vm.h = vm.canvas.height = height;
        vm.image = new Image();
        vm.image.src = 'city.jpg';
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
            vm.scale = vm.scaleX;
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
        };
    }
    Img.prototype.draw = function () {
        var vm = this;
        // vm.ctx.clearRect(0,0,vm.w, vm.h);
        vm.ctx.drawImage(vm.image, vm.x_offset, vm.y_offset, vm.image.naturalWidth, vm.image.naturalHeight, 0, 0, vm.imgWidth, vm.imgHeight);
    };
    return Img;
}());
exports.Img = Img;
var App = (function () {
    function App() {
        var vm = this;
        vm.canvas = document.getElementById('canvas');
        vm.ctx = vm.canvas.getContext('2d');
        vm.sizeCanvas();
        vm.initEvents();
        window.requestAnimationFrame(function (t) { vm.draw(t); });
        vm.img = new Img(vm.w, vm.h);
        vm.mouseIn = false;
        vm.container = document.getElementById('canvas-container');
        vm.container.onmousemove = function (e) {
            vm.drawImgIn(0, e);
        };
        vm.container.onmouseenter = function (e) {
            vm.mouseIn = true;
        };
        vm.container.onmouseout = function (e) {
            vm.mouseIn = false;
            vm.drawImgOut(0, e);
        };
    }
    App.prototype.sizeCanvas = function () {
        var vm = this;
        vm.canvas.style.width = '100%';
        vm.canvas.style.height = '100%';
        this.w = this.canvas.width = vm.canvas.offsetWidth;
        this.h = this.canvas.height = vm.canvas.offsetHeight;
    };
    App.prototype.draw = function (t) {
        var _this = this;
        var vm = this;
        window.requestAnimationFrame(function (t) { _this.draw(t); });
        vm.ctx.clearRect(0, 0, vm.w, vm.h);
        vm.ctx.drawImage(vm.img.canvas, 0, 0);
        vm.img.draw();
    };
    App.prototype.drawImgIn = function (t, e) {
        var vm = this;
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
        }
    };
    App.prototype.drawImgOut = function (t, e) {
        var vm = this;
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
            window.requestAnimationFrame(function (t) { vm.drawImgOut(t, e); });
        }
    };
    App.prototype.initEvents = function () {
        var _this = this;
        window.onresize = function (e) {
            _this.sizeCanvas();
        };
    };
    return App;
}());
exports.App = App;
},{"./image_canvas":1}],2:[function(require,module,exports){
"use strict";
var image_canvas = require("./image_canvas");
var skill_badge = require("./skill_badge");
var media = require("./media");
//yoo
var timeout = 1000;
var frontend = new skill_badge.Collection('./skills/', 'flex-grid1', [{ "name": 'HTML5', "class": 'circle-100', "image": 'html5.svg' },
    { "name": 'Java Script', "class": 'circle-100', "image": 'javascript-2.svg' },
    { "name": 'Bootstrap', "class": 'circle-100', "image": 'bootstrap-4.svg' },
    { "name": 'Angular JS', "class": 'circle-75', "image": 'angular-icon.svg' },
    { "name": 'Type Script', "class": 'circle-75', "image": 'typescript.svg' },
    { "name": 'Gulp', "class": 'circle-75', "image": 'gulp.svg' },
    { "name": 'CSS3', "class": 'circle-50', "image": 'css-3.svg' },
    { "name": 'jQuery', "class": 'circle-50', "image": 'jquery-1.svg' },
    { "name": 'SCSS', "class": 'circle-50', "image": 'sass-1.svg' },
    { "name": 'D3.js', "class": 'circle-25', "image": 'd3-2.svg' }], 'frontend');
var softeng = new skill_badge.Collection('./skills/', 'flex-grid2', [{ "name": 'Java', "class": 'circle-75', "image": 'java-14.svg' },
    { "name": 'Python', "class": 'circle-50', "image": 'python-5.svg' },
    { "name": 'C++', "class": 'circle-25', "image": 'c-seeklogo.com.svg' },
    { "name": 'Node JS', "class": 'circle-25', "image": 'nodejs-icon.svg' },
    { "name": 'C#', "class": 'circle-25', "image": 'csharp.svg' },
    { "name": 'Unity', "class": 'circle-25', "image": 'unity.svg' },
    { "name": 'Android Studio', "class": 'circle-25', "image": 'Android_studio.svg' }], 'softeng');
var design = new skill_badge.Collection('./skills/', 'flex-grid3', [{ "name": 'Photoshop', "class": 'circle-50', "image": 'photoshop-cc.svg' },
    { "name": 'Illustrator', "class": 'circle-50', "image": 'adobe-illustrator-cc.svg' },
    { "name": 'Maya', "class": 'circle-50', "image": 'maya.png' },
    { "name": 'After Effects', "class": 'circle-25', "image": 'after-effects-cc.svg' },
    { "name": 'Mudbox', "class": 'circle-25', "image": 'mudbox.png' }], 'design');
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
var PortfolioItem = (function () {
    function PortfolioItem(portfolio, item_num, title, title_image, desc, stack, media, type) {
        var vm = this;
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
        nopad.classList.add('col-md-12', 'nopad');
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
        vm.col.onclick = function () {
            //   console.(vm.items[0]);
            var different_wrapper = false;
            console.log(vm.media);
            different_wrapper = vm.portfolio.close(vm.item_num);
            vm.open = vm.target_wrapper.transitionWrapper(different_wrapper, vm.open, vm.title, vm.desc, vm.stack, vm.media);
            //   vm.setData();  
        };
    }
    PortfolioItem.prototype.append = function (row, wrapper) {
        var vm = this;
        var row_element = document.getElementById('row_' + row);
        row_element.appendChild(vm.col);
        vm.target_wrapper = wrapper;
        vm.stack.flex_grid_id = wrapper.flex_grid.id;
        vm.media.id = 'media-' + row;
        console.log(vm.media);
    };
    PortfolioItem.prototype.setCol = function (className) {
        var vm = this;
        vm.col.classList.remove(vm.col_size);
        vm.col_size = className;
        vm.col.classList.add(vm.col_size);
    };
    return PortfolioItem;
}());
exports.PortfolioItem = PortfolioItem;
var Portfolio = (function () {
    function Portfolio(id, json_objs) {
        var vm = this;
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
            vm.items.push(new PortfolioItem(vm, i, json_objs[i].title, json_objs[i].title_image, json_objs[i].desc, json_objs[i].stack, json_objs[i].media, json_objs[i].type));
        }
        vm.appendAll();
    }
    Portfolio.prototype.appendAll = function () {
        var vm = this;
        var screenWidth = window.innerWidth;
        console.log(screenWidth);
        //reassigns cols based on breakpoints
        var breakpoints = [{ min: 0, max: 768, col_size: 'col-xs-6', per_row: 2 }, { min: 769, max: 992, col_size: 'col-xs-4', per_row: 3 }, { min: 993, max: 1200, col_size: 'col-xs-3', per_row: 4 }, { min: 1200, max: 9999, col_size: 'col-xs-3', per_row: 4 }];
        for (var i = 0; i < breakpoints.length; i++) {
            //if in breakpoint range, and not same as before
            if (screenWidth > breakpoints[i].min && screenWidth < breakpoints[i].max) {
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
                    row.classList.add('row');
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
    };
    Portfolio.prototype.close = function (item_num) {
        var vm = this;
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
    };
    return Portfolio;
}());
exports.Portfolio = Portfolio;
var Wrapper = (function () {
    function Wrapper(row_num) {
        var vm = this;
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
        row.classList.add('row');
        vm.title_element = document.createElement('div');
        vm.title_element.classList.add('col-md-12', 'desc-text');
        vm.title_element_text = document.createTextNode('');
        vm.title_element.appendChild(vm.title_element_text);
        var col3 = document.createElement('div');
        col3.classList.add('col-md-3');
        var row_fill = document.createElement('div');
        row_fill.classList.add('row', 'justify-center', 'nomar');
        var col12 = document.createElement('div');
        col12.classList.add('col-md-12');
        vm.col6 = document.createElement('div');
        vm.col6.id = 'media-' + row_num;
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
        vm.flex_grid.id = 'pflex-grid-' + row_num;
        vm.flex_grid.classList.add('row', 'portfolio-flex', 'col-md-12');
        vm.demo = document.createElement('div');
        vm.demo.classList.add('col-md-12', 'header-text');
        vm.demo.appendChild(document.createTextNode('Live Demo'));
        vm.link = document.createElement('div');
        vm.link.classList.add('github-button', 'row');
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
        row_fill.appendChild(vm.demo);
        row_fill.appendChild(vm.link);
        vm.link.appendChild(vm.link_text);
        row_fill.appendChild(vm.stack);
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
    Wrapper.prototype.setData = function () {
        var vm = this;
        vm.setTitle();
        vm.setDesc();
        vm.setStack();
        vm.setMedia();
        // vm.setStack(stack);
    };
    Wrapper.prototype.setTitle = function () {
        var vm = this;
        vm.title_element_text.textContent = vm.title;
    };
    Wrapper.prototype.setDesc = function () {
        var vm = this;
        vm.description_text.textContent = vm.desc;
    };
    Wrapper.prototype.setStack = function () {
        var vm = this;
        vm.collection.resetIds(vm.flex_grid.id);
        vm.collection.load();
    };
    Wrapper.prototype.setMedia = function () {
        var vm = this;
        vm.media.setId(vm.media.id);
        vm.media.loadMedia(0);
    };
    Wrapper.prototype.close = function () {
        var vm = this;
        vm.html.classList.remove('open');
    };
    Wrapper.prototype.changeWrapper = function (open, title, desc, stack, media) {
        var vm = this;
        //close wrapper:
        if (vm.title === title) {
            console.log('1');
            console.log(open);
            vm.change = false;
            if (open) {
                // vm.closeData();
                vm.html.classList.remove('open');
                return false;
            }
            else {
                vm.title = title;
                vm.desc = desc;
                vm.collection = stack;
                vm.media = media;
                vm.setData();
                vm.html.classList.add('open');
                return true;
            }
        }
        else if (vm.html.classList[1] !== 'open') {
            console.log('2');
            vm.change = false;
            vm.title = title;
            vm.desc = desc;
            vm.collection = stack;
            vm.media = media;
            vm.setData();
            vm.html.classList.add('open');
            return true;
        }
        else {
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
    };
    Wrapper.prototype.transitionWrapper = function (different_wrapper, open, title, desc, stack, media) {
        var vm = this;
        var return_value;
        if (different_wrapper) {
            setTimeout(function () {
                return_value = vm.changeWrapper(open, title, desc, stack, media);
                console.log('timeout: ' + return_value);
            }, timeout);
        }
        else if (open === undefined) {
            open = true;
            return_value = vm.changeWrapper(open, title, desc, stack, media);
        }
        else {
            return_value = vm.changeWrapper(open, title, desc, stack, media);
        }
        console.log('return_value: ' + return_value);
        return return_value;
    };
    return Wrapper;
}());
exports.Wrapper = Wrapper;
// {"name": 'Python',      "class":'circle-50', "image":'python-5.svg'}
var breathless_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Phaser.js', "class": 'circle-100', "image": 'phaser.svg' },
    { "name": 'Photoshop', "class": 'circle-100', "image": 'photoshop-cc.svg' },
    { "name": 'jQuery', "class": 'circle-50', "image": 'jquery-1.svg' }
]);
var qbert_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Maya', "class": 'circle-100', "image": 'maya.png' },
    { "name": 'Photoshop', "class": 'circle-25', "image": 'photoshop-cc.svg' }
]);
// var breathless_media = new media.Media('media-0', ["./portfolio/breathless.jpg","./portfolio/breathless.jpg","./portfolio/cat.jpg"], ["./portfolio/breathless.jpg","./portfolio/cat.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
var m = [];
m.push(new media.Media('', ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"], ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"]));
m.push(new media.Media('', ["./portfolio/qbert_play.jpg", "./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], ["./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"], ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"]));
var portfolio = new Portfolio('portfolio', [
    { title: 'Breathless', title_image: './portfolio/breathless.jpg', desc: "The Space Pirate, Aria, is on a mission to loot a mineral cargo ship. However, upon landing on the cargo ship, Aria's helmet cracks causing her to slowly lose oxygen. It's now a race against time to collect all the gems before her oxygen runs out!", stack: breathless_stack, media: m[0], type: 'HTML5 Game' },
    { title: 'Q*Bert', title_image: "./portfolio/qbert_play.jpg", desc: 'This is my Bouncing Ball Assignment for Animation 1 at Drexel University. When picking a game that mixes my love of retro video games and bouncing balls, Q*Bert was a no-brainer. Everything is individually modelled, textured, and animated by me. Made in Maya, and rendered in V-Ray.', stack: qbert_stack, media: m[1], type: 'Animation' },
    { title: 'Bedroom', title_image: './portfolio/cgi_final_1.png', desc: 'asdf', stack: qbert_stack, media: m[2], type: '3D Render' }
]);
/**
 * portfolio website
 * breathless
 * weather website
 * qbert animation
 * cgi 2 final??
 *
*/
// var media = new Media('media-0', ["./portfolio/breathless.jpg","./portfolio/breathless.jpg","./portfolio/cat.jpg"], ["./portfolio/breathless.jpg","./portfolio/cat.jpg", "./portfolio/cat.jpg"]);
},{"./image_canvas":1,"./media":3,"./skill_badge":4}],3:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require("./media"));
var MediaItem = (function () {
    function MediaItem(media, html, order) {
        var vm = this;
        vm.media = media;
        vm.html = html;
        vm.order = order;
        vm.html.onclick = function () {
            vm.media.loadMedia(vm.order);
        };
    }
    return MediaItem;
}());
exports.MediaItem = MediaItem;
var Media = (function () {
    function Media(id, thumbnails, files, vimeo) {
        var vm = this;
        vm.id = id;
        vm.selected = 0;
        vm.elements = [];
        vm.media_items = [];
        vm.thumbnails = [];
        vm.vimeo = vimeo;
        if (vimeo) {
            var frag = vm.createFragment(vimeo);
            vm.elements.push(frag);
        }
        var length = vm.elements.length;
        if (files) {
            for (var i = 0; i < files.length; i++) {
                var image = document.createElement('img');
                image.src = files[i];
                image.classList.add('dropshadow');
                vm.elements.push(image);
            }
        }
        vm.media_selected = document.createElement('div');
        vm.media_selected.id = 'media-selected';
        vm.overlay = document.createElement('div');
        vm.overlay.classList.add('overlay-media');
        vm.media_selected.appendChild(vm.overlay);
        vm.row = document.createElement('div');
        vm.row.classList.add('row', 'justify-center', 'media-container');
        for (var j = 0; j < vm.elements.length; j++) {
            vm.colmd = document.createElement('div');
            vm.colmd.classList.add('col-md');
            var html = document.createElement('div');
            html.classList.add('media-item');
            var media_item = new MediaItem(vm, html, j);
            vm.media_items.push(media_item);
            vm.thumbnails.push(document.createElement('img'));
            vm.thumbnails[j].classList.add('dropshadow');
            vm.thumbnails[j].src = thumbnails[j];
            vm.colmd.appendChild(vm.media_items[j].html);
            vm.colmd.appendChild(vm.thumbnails[j]);
            vm.row.appendChild(vm.colmd);
        }
        //          #media-selected
        //              .overlay
        //              img(src="./portfolio/breathless.jpg").dropshadow
        //          .row.justify-center.media-container
        //              .col-md
        //                  .media-item
        //                  img(src="./portfolio/breathless.jpg").dropshadow
        //              .col-md
        //                  .media-item
        //                  img(src="./portfolio/breathless.jpg").dropshadow
        vm.media_items[vm.selected].html.classList.add('selected');
        // vm.elements.push(vm.elements[0]);
        // vm.elements.shift();
        // vm.setId(id);
        // vm.loadMedia(0);
    }
    Media.prototype.createFragment = function (str, width, height) {
        var newstr = str;
        if (width) {
            newstr = str.replace('width="\d+" height="\d+"', 'width="' + width + '" height="' + height + '"');
        }
        var frag = document.createDocumentFragment();
        var elem = document.createElement('div');
        elem.innerHTML = str;
        while (elem.childNodes[0]) {
            frag.appendChild(elem.childNodes[0]);
        }
        return frag;
    };
    Media.prototype.setId = function (id) {
        var vm = this;
        var parent = document.getElementById(id);
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        parent.appendChild(vm.media_selected);
        parent.appendChild(vm.row);
    };
    Media.prototype.loadMedia = function (thumb_num) {
        var vm = this;
        // vm.media_selected.removeChild(vm.media_selected.firstChild);
        vm.overlay.classList.add('close-media');
        vm.overlay.style.width = (vm.media_selected.clientWidth + 12) + 'px';
        vm.overlay.style.height = (vm.media_selected.clientHeight + 8) + 'px';
        for (var i = 0; i < vm.media_items.length; i++) {
            vm.media_items[i].html.style.width = vm.colmd.clientWidth + 'px';
            vm.media_items[i].html.style.height = vm.colmd.clientHeight + 'px';
        }
        if (vm.vimeo && thumb_num === 0) {
            vm.elements.shift();
            var frag = vm.createFragment(vm.vimeo, vm.media_selected.clientWidth, vm.media_selected.clientHeight);
            vm.elements.unshift(frag);
            vm.overlay.style.visibility = 'hidden';
        }
        else {
            vm.overlay.style.visibility = 'visible';
        }
        /*button transition*/
        vm.media_items[vm.selected].html.classList.remove('selected');
        vm.selected = thumb_num;
        vm.media_items[vm.selected].html.classList.add('selected');
        /*picture transition*/
        setTimeout(function () {
            // if(vm.vimeo && vm.selected === 0){
            // }
            if (vm.media_selected.children.length === 2) {
                vm.media_selected.removeChild(vm.media_selected.lastChild);
            }
            vm.media_selected.appendChild(vm.elements[vm.selected]);
            vm.overlay.classList.remove('close-media');
            vm.media_items[vm.selected].html.classList.add('selected');
        }, 600);
    };
    return Media;
}());
exports.Media = Media;
},{"./media":3}],4:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require("./skill_badge"));
var Skill = (function () {
    function Skill(name, classpercent, image, flex_grid_id) {
        var vm = this;
        vm.flex_grid_id = flex_grid_id;
        vm.flex_item = document.createElement('div');
        vm.flex_item.className += 'flex-item';
        vm.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        vm.svg.setAttribute('class', classpercent);
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
        }
        else if (name === "Unity" || name === "Phaser.js" || name === "D3.js" || name === "SCSS" || name === "Java" || name === "Python") {
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
    Skill.prototype.resetId = function (id) {
        var vm = this;
        vm.flex_grid_id = id;
    };
    Skill.prototype.append = function () {
        var vm = this;
        var flex_grid = document.getElementById(vm.flex_grid_id);
        flex_grid.appendChild(vm.flex_item);
    };
    return Skill;
}());
exports.Skill = Skill;
var Collection = (function () {
    function Collection(path, flex_grid_id, images, id) {
        var vm = this;
        vm.images = images;
        vm.path = path;
        vm.flex_grid_id = flex_grid_id;
        vm.skills = [];
        for (var i = 0; i < images.length; i++) {
            vm.skills.push(new Skill(images[i].name, images[i]["class"], vm.path + images[i].image, vm.flex_grid_id));
        }
        if (id) {
            vm.id = id;
            var element = document.getElementById(vm.id);
            element.onmouseup = function (e) {
                vm.load();
            };
        }
    }
    Collection.prototype.resetIds = function (id) {
        var vm = this;
        vm.flex_grid_id = id;
        for (var i = 0; i < vm.skills.length; i++) {
            vm.skills[i].resetId(vm.flex_grid_id);
        }
    };
    Collection.prototype.load = function () {
        var vm = this;
        var flex_grid = document.getElementById(vm.flex_grid_id);
        while (flex_grid.firstChild) {
            flex_grid.removeChild(flex_grid.firstChild);
        }
        for (var i = 0; i < vm.skills.length; i++) {
            vm.skills[i].append();
        }
    };
    return Collection;
}());
exports.Collection = Collection;
},{"./skill_badge":5}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvanVtcC5qcy9kaXN0L2p1bXAuanMiLCJzcmMvaW1hZ2VfY2FudmFzLnRzIiwic3JjL21haW4udHMiLCJzcmMvbWVkaWEudHMiLCJzcmMvc2tpbGxfYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDeEMsQ0FBQztJQUNILENBQUM7SUFFTSx5QkFBSSxHQUFYO1FBQ0UsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3pELE9BQU8sU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzVCLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFDRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDMUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN4QixDQUFDO0lBQ0gsQ0FBQztJQVFILGlCQUFDO0FBQUQsQ0FyREEsQUFxREMsSUFBQTtBQXJEWSxnQ0FBVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwuSnVtcCA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuLy8gUm9iZXJ0IFBlbm5lcidzIGVhc2VJbk91dFF1YWRcblxuLy8gZmluZCB0aGUgcmVzdCBvZiBoaXMgZWFzaW5nIGZ1bmN0aW9ucyBoZXJlOiBodHRwOi8vcm9iZXJ0cGVubmVyLmNvbS9lYXNpbmcvXG4vLyBmaW5kIHRoZW0gZXhwb3J0ZWQgZm9yIEVTNiBjb25zdW1wdGlvbiBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vamF4Z2VsbGVyL2V6LmpzXG5cbnZhciBlYXNlSW5PdXRRdWFkID0gZnVuY3Rpb24gZWFzZUluT3V0UXVhZCh0LCBiLCBjLCBkKSB7XG4gIHQgLz0gZCAvIDI7XG4gIGlmICh0IDwgMSkgcmV0dXJuIGMgLyAyICogdCAqIHQgKyBiO1xuICB0LS07XG4gIHJldHVybiAtYyAvIDIgKiAodCAqICh0IC0gMikgLSAxKSArIGI7XG59O1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iajtcbn0gOiBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xufTtcblxudmFyIGp1bXBlciA9IGZ1bmN0aW9uIGp1bXBlcigpIHtcbiAgLy8gcHJpdmF0ZSB2YXJpYWJsZSBjYWNoZVxuICAvLyBubyB2YXJpYWJsZXMgYXJlIGNyZWF0ZWQgZHVyaW5nIGEganVtcCwgcHJldmVudGluZyBtZW1vcnkgbGVha3NcblxuICB2YXIgZWxlbWVudCA9IHZvaWQgMDsgLy8gZWxlbWVudCB0byBzY3JvbGwgdG8gICAgICAgICAgICAgICAgICAgKG5vZGUpXG5cbiAgdmFyIHN0YXJ0ID0gdm9pZCAwOyAvLyB3aGVyZSBzY3JvbGwgc3RhcnRzICAgICAgICAgICAgICAgICAgICAocHgpXG4gIHZhciBzdG9wID0gdm9pZCAwOyAvLyB3aGVyZSBzY3JvbGwgc3RvcHMgICAgICAgICAgICAgICAgICAgICAocHgpXG5cbiAgdmFyIG9mZnNldCA9IHZvaWQgMDsgLy8gYWRqdXN0bWVudCBmcm9tIHRoZSBzdG9wIHBvc2l0aW9uICAgICAgKHB4KVxuICB2YXIgZWFzaW5nID0gdm9pZCAwOyAvLyBlYXNpbmcgZnVuY3Rpb24gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24pXG4gIHZhciBhMTF5ID0gdm9pZCAwOyAvLyBhY2Nlc3NpYmlsaXR5IHN1cHBvcnQgZmxhZyAgICAgICAgICAgICAoYm9vbGVhbilcblxuICB2YXIgZGlzdGFuY2UgPSB2b2lkIDA7IC8vIGRpc3RhbmNlIG9mIHNjcm9sbCAgICAgICAgICAgICAgICAgICAgIChweClcbiAgdmFyIGR1cmF0aW9uID0gdm9pZCAwOyAvLyBzY3JvbGwgZHVyYXRpb24gICAgICAgICAgICAgICAgICAgICAgICAobXMpXG5cbiAgdmFyIHRpbWVTdGFydCA9IHZvaWQgMDsgLy8gdGltZSBzY3JvbGwgc3RhcnRlZCAgICAgICAgICAgICAgICAgICAgKG1zKVxuICB2YXIgdGltZUVsYXBzZWQgPSB2b2lkIDA7IC8vIHRpbWUgc3BlbnQgc2Nyb2xsaW5nIHRodXMgZmFyICAgICAgICAgIChtcylcblxuICB2YXIgbmV4dCA9IHZvaWQgMDsgLy8gbmV4dCBzY3JvbGwgcG9zaXRpb24gICAgICAgICAgICAgICAgICAgKHB4KVxuXG4gIHZhciBjYWxsYmFjayA9IHZvaWQgMDsgLy8gdG8gY2FsbCB3aGVuIGRvbmUgc2Nyb2xsaW5nICAgICAgICAgICAgKGZ1bmN0aW9uKVxuXG4gIC8vIHNjcm9sbCBwb3NpdGlvbiBoZWxwZXJcblxuICBmdW5jdGlvbiBsb2NhdGlvbigpIHtcbiAgICByZXR1cm4gd2luZG93LnNjcm9sbFkgfHwgd2luZG93LnBhZ2VZT2Zmc2V0O1xuICB9XG5cbiAgLy8gZWxlbWVudCBvZmZzZXQgaGVscGVyXG5cbiAgZnVuY3Rpb24gdG9wKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBzdGFydDtcbiAgfVxuXG4gIC8vIHJBRiBsb29wIGhlbHBlclxuXG4gIGZ1bmN0aW9uIGxvb3AodGltZUN1cnJlbnQpIHtcbiAgICAvLyBzdG9yZSB0aW1lIHNjcm9sbCBzdGFydGVkLCBpZiBub3Qgc3RhcnRlZCBhbHJlYWR5XG4gICAgaWYgKCF0aW1lU3RhcnQpIHtcbiAgICAgIHRpbWVTdGFydCA9IHRpbWVDdXJyZW50O1xuICAgIH1cblxuICAgIC8vIGRldGVybWluZSB0aW1lIHNwZW50IHNjcm9sbGluZyBzbyBmYXJcbiAgICB0aW1lRWxhcHNlZCA9IHRpbWVDdXJyZW50IC0gdGltZVN0YXJ0O1xuXG4gICAgLy8gY2FsY3VsYXRlIG5leHQgc2Nyb2xsIHBvc2l0aW9uXG4gICAgbmV4dCA9IGVhc2luZyh0aW1lRWxhcHNlZCwgc3RhcnQsIGRpc3RhbmNlLCBkdXJhdGlvbik7XG5cbiAgICAvLyBzY3JvbGwgdG8gaXRcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgbmV4dCk7XG5cbiAgICAvLyBjaGVjayBwcm9ncmVzc1xuICAgIHRpbWVFbGFwc2VkIDwgZHVyYXRpb24gPyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApIC8vIGNvbnRpbnVlIHNjcm9sbCBsb29wXG4gICAgOiBkb25lKCk7IC8vIHNjcm9sbGluZyBpcyBkb25lXG4gIH1cblxuICAvLyBzY3JvbGwgZmluaXNoZWQgaGVscGVyXG5cbiAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAvLyBhY2NvdW50IGZvciByQUYgdGltZSByb3VuZGluZyBpbmFjY3VyYWNpZXNcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc3RhcnQgKyBkaXN0YW5jZSk7XG5cbiAgICAvLyBpZiBzY3JvbGxpbmcgdG8gYW4gZWxlbWVudCwgYW5kIGFjY2Vzc2liaWxpdHkgaXMgZW5hYmxlZFxuICAgIGlmIChlbGVtZW50ICYmIGExMXkpIHtcbiAgICAgIC8vIGFkZCB0YWJpbmRleCBpbmRpY2F0aW5nIHByb2dyYW1tYXRpYyBmb2N1c1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG5cbiAgICAgIC8vIGZvY3VzIHRoZSBlbGVtZW50XG4gICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgLy8gaWYgaXQgZXhpc3RzLCBmaXJlIHRoZSBjYWxsYmFja1xuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuXG4gICAgLy8gcmVzZXQgdGltZSBmb3IgbmV4dCBqdW1wXG4gICAgdGltZVN0YXJ0ID0gZmFsc2U7XG4gIH1cblxuICAvLyBBUElcblxuICBmdW5jdGlvbiBqdW1wKHRhcmdldCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIC8vIHJlc29sdmUgb3B0aW9ucywgb3IgdXNlIGRlZmF1bHRzXG4gICAgZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uIHx8IDEwMDA7XG4gICAgb2Zmc2V0ID0gb3B0aW9ucy5vZmZzZXQgfHwgMDtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2s7IC8vIFwidW5kZWZpbmVkXCIgaXMgYSBzdWl0YWJsZSBkZWZhdWx0LCBhbmQgd29uJ3QgYmUgY2FsbGVkXG4gICAgZWFzaW5nID0gb3B0aW9ucy5lYXNpbmcgfHwgZWFzZUluT3V0UXVhZDtcbiAgICBhMTF5ID0gb3B0aW9ucy5hMTF5IHx8IGZhbHNlO1xuXG4gICAgLy8gY2FjaGUgc3RhcnRpbmcgcG9zaXRpb25cbiAgICBzdGFydCA9IGxvY2F0aW9uKCk7XG5cbiAgICAvLyByZXNvbHZlIHRhcmdldFxuICAgIHN3aXRjaCAodHlwZW9mIHRhcmdldCA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YodGFyZ2V0KSkge1xuICAgICAgLy8gc2Nyb2xsIGZyb20gY3VycmVudCBwb3NpdGlvblxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgZWxlbWVudCA9IHVuZGVmaW5lZDsgLy8gbm8gZWxlbWVudCB0byBzY3JvbGwgdG9cbiAgICAgICAgYTExeSA9IGZhbHNlOyAvLyBtYWtlIHN1cmUgYWNjZXNzaWJpbGl0eSBpcyBvZmZcbiAgICAgICAgc3RvcCA9IHN0YXJ0ICsgdGFyZ2V0O1xuICAgICAgICBicmVhaztcblxuICAgICAgLy8gc2Nyb2xsIHRvIGVsZW1lbnQgKG5vZGUpXG4gICAgICAvLyBib3VuZGluZyByZWN0IGlzIHJlbGF0aXZlIHRvIHRoZSB2aWV3cG9ydFxuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgZWxlbWVudCA9IHRhcmdldDtcbiAgICAgICAgc3RvcCA9IHRvcChlbGVtZW50KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIHNjcm9sbCB0byBlbGVtZW50IChzZWxlY3RvcilcbiAgICAgIC8vIGJvdW5kaW5nIHJlY3QgaXMgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuICAgICAgICBzdG9wID0gdG9wKGVsZW1lbnQpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyByZXNvbHZlIHNjcm9sbCBkaXN0YW5jZSwgYWNjb3VudGluZyBmb3Igb2Zmc2V0XG4gICAgZGlzdGFuY2UgPSBzdG9wIC0gc3RhcnQgKyBvZmZzZXQ7XG5cbiAgICAvLyByZXNvbHZlIGR1cmF0aW9uXG4gICAgc3dpdGNoIChfdHlwZW9mKG9wdGlvbnMuZHVyYXRpb24pKSB7XG4gICAgICAvLyBudW1iZXIgaW4gbXNcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbjtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIGZ1bmN0aW9uIHBhc3NlZCB0aGUgZGlzdGFuY2Ugb2YgdGhlIHNjcm9sbFxuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb24oZGlzdGFuY2UpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBzdGFydCB0aGUgbG9vcFxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gIH1cblxuICAvLyBleHBvc2Ugb25seSB0aGUganVtcCBtZXRob2RcbiAgcmV0dXJuIGp1bXA7XG59O1xuXG4vLyBleHBvcnQgc2luZ2xldG9uXG5cbnZhciBzaW5nbGV0b24gPSBqdW1wZXIoKTtcblxucmV0dXJuIHNpbmdsZXRvbjtcblxufSkpKTtcbiIsImV4cG9ydCAqIGZyb20gXCIuL2ltYWdlX2NhbnZhc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsZXJwKGZyb206IG51bWJlciwgdG86IG51bWJlciwgcGVyY2VudDogbnVtYmVyKSB7XHJcbiAgdmFyIGRpZmZlcmFuY2UgPSB0byAtIGZyb207XHJcbiAgcmV0dXJuIGZyb20gKyAoZGlmZmVyYW5jZSAqIHBlcmNlbnQpO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEltZyB7XHJcbiAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICBpbWFnZTogSFRNTEltYWdlRWxlbWVudFxyXG4gIHc6IG51bWJlcjtcclxuICBoOiBudW1iZXI7XHJcbiAgeF9vZmZzZXRfZGVzdDogbnVtYmVyO1xyXG4gIHlfb2Zmc2V0X2Rlc3Q6IG51bWJlcjtcclxuICB4X29mZnNldDogbnVtYmVyO1xyXG4gIHlfb2Zmc2V0OiBudW1iZXI7XHJcbiAgYW5jaG9yWDogbnVtYmVyO1xyXG4gIGFuY2hvclk6IG51bWJlcjtcclxuXHJcbiAgaW1nV2lkdGg6IG51bWJlcjtcclxuICBzY3JlZW5XaWR0aDogbnVtYmVyO1xyXG4gIHNjYWxlWDogbnVtYmVyO1xyXG4gIHNjYWxlWTogbnVtYmVyO1xyXG4gIHNjYWxlOiBudW1iZXI7XHJcbiAgaW1nSGVpZ2h0OiBudW1iZXI7XHJcbiAgc2NyZWVuSGVpZ2h0OiBudW1iZXI7XHJcblxyXG5cclxuICBjb25zdHJ1Y3Rvcih3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdm0uY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICB2bS5jdHggPSB2bS5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIHZtLncgPSB2bS5jYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgIHZtLmggPSB2bS5jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgdm0uaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIHZtLmltYWdlLnNyYyA9ICdjaXR5LmpwZyc7XHJcblxyXG4gICAgdm0uaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgLypnZXRzIHNjYWxlWCBiYXNlZCBvbiBzY3JlZW4gYW5kIGltYWdlIHdpZHRoICovXHJcbiAgICAgIHZtLmltZ1dpZHRoID0gdm0uaW1hZ2UubmF0dXJhbFdpZHRoO1xyXG4gICAgICB2bS5zY3JlZW5XaWR0aCA9IHZtLmNhbnZhcy53aWR0aDtcclxuICAgICAgdm0uc2NhbGVYID0gMTtcclxuICAgICAgdm0uc2NhbGVYID0gdm0uc2NyZWVuV2lkdGggLyB2bS5pbWdXaWR0aDtcclxuXHJcbiAgICAgIC8qZ2V0cyBzY2FsZVkgYmFzZWQgb24gc2NyZWVuIGFuZCBpbWFnZSB3aWR0aCAqL1xyXG4gICAgICB2bS5pbWdIZWlnaHQgPSB2bS5pbWFnZS5uYXR1cmFsSGVpZ2h0O1xyXG4gICAgICB2bS5zY3JlZW5IZWlnaHQgPSB2bS5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICB2bS5zY2FsZVkgPSAxO1xyXG4gICAgICB2bS5zY2FsZVkgPSB2bS5zY3JlZW5IZWlnaHQgLyB2bS5pbWdIZWlnaHQ7XHJcblxyXG5cclxuICAgICAgLypzZXRzIGJhc2ljIHNjYWxlIHRvIFggKi9cclxuXHJcbiAgICAgIHZtLnNjYWxlID0gdm0uc2NhbGVYXHJcbiAgICAgIGlmICh2bS5zY2FsZVggPCB2bS5zY2FsZVkpIHtcclxuICAgICAgICB2bS5zY2FsZSA9IHZtLnNjYWxlWTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdm0uaW1nV2lkdGggKj0gdm0uc2NhbGUgKiAxLjA1O1xyXG4gICAgICB2bS5pbWdIZWlnaHQgKj0gdm0uc2NhbGUgKiAxLjA1O1xyXG5cclxuICAgICAgdm0uYW5jaG9yWCA9ICh2bS5pbWdXaWR0aCAtIHZtLnNjcmVlbldpZHRoKTtcclxuICAgICAgdm0uYW5jaG9yWSA9ICh2bS5pbWdIZWlnaHQgLSB2bS5zY3JlZW5IZWlnaHQpO1xyXG5cclxuICAgICAgdm0ueF9vZmZzZXRfZGVzdCA9IHZtLnhfb2Zmc2V0ID0gdm0uYW5jaG9yWDtcclxuICAgICAgdm0ueV9vZmZzZXRfZGVzdCA9IHZtLnlfb2Zmc2V0ID0gdm0uYW5jaG9yWTtcclxuXHJcblxyXG5cclxuICAgICAgdm0uZHJhdygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXcoKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAvLyB2bS5jdHguY2xlYXJSZWN0KDAsMCx2bS53LCB2bS5oKTtcclxuXHJcbiAgICB2bS5jdHguZHJhd0ltYWdlKHZtLmltYWdlLCB2bS54X29mZnNldCwgdm0ueV9vZmZzZXQsIHZtLmltYWdlLm5hdHVyYWxXaWR0aCwgdm0uaW1hZ2UubmF0dXJhbEhlaWdodCwgMCwgMCwgdm0uaW1nV2lkdGgsIHZtLmltZ0hlaWdodCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXBwIHtcclxuICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gIHc6IG51bWJlcjtcclxuICBoOiBudW1iZXI7XHJcbiAgLy8gcmVjdDogUmVjdGFuZ2xlXHJcbiAgaW1nOiBJbWc7XHJcblxyXG4gIG1vdXNlSW46IGJvb2xlYW47XHJcbiAgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgdm0uY2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcclxuICAgIHZtLmN0eCA9IHZtLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuICAgIHZtLnNpemVDYW52YXMoKTtcclxuICAgIHZtLmluaXRFdmVudHMoKTtcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHQpID0+IHsgdm0uZHJhdyh0KTsgfSk7XHJcblxyXG4gICAgdm0uaW1nID0gbmV3IEltZyh2bS53LCB2bS5oKTtcclxuXHJcbiAgICB2bS5tb3VzZUluID0gZmFsc2U7XHJcblxyXG4gICAgdm0uY29udGFpbmVyID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMtY29udGFpbmVyJyk7XHJcblxyXG4gICAgdm0uY29udGFpbmVyLm9ubW91c2Vtb3ZlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdm0uZHJhd0ltZ0luKDAsIGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHZtLmNvbnRhaW5lci5vbm1vdXNlZW50ZXIgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2bS5tb3VzZUluID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB2bS5jb250YWluZXIub25tb3VzZW91dCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZtLm1vdXNlSW4gPSBmYWxzZTtcclxuICAgICAgdm0uZHJhd0ltZ091dCgwLCBlKTtcclxuICAgIH1cclxuXHJcblxyXG4gIH1cclxuXHJcbiAgcHVibGljIHNpemVDYW52YXMoKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2bS5jYW52YXMuc3R5bGUud2lkdGggPSAnMTAwJSc7XHJcbiAgICB2bS5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xyXG4gICAgdGhpcy53ID0gdGhpcy5jYW52YXMud2lkdGggPSB2bS5jYW52YXMub2Zmc2V0V2lkdGg7XHJcbiAgICB0aGlzLmggPSB0aGlzLmNhbnZhcy5oZWlnaHQgPSB2bS5jYW52YXMub2Zmc2V0SGVpZ2h0O1xyXG5cclxuICB9XHJcbiAgcHVibGljIGRyYXcodDogYW55KSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0KSA9PiB7IHRoaXMuZHJhdyh0KTsgfSk7XHJcbiAgICB2bS5jdHguY2xlYXJSZWN0KDAsIDAsIHZtLncsIHZtLmgpO1xyXG5cclxuICAgIHZtLmN0eC5kcmF3SW1hZ2Uodm0uaW1nLmNhbnZhcywgMCwgMCk7XHJcbiAgICB2bS5pbWcuZHJhdygpO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd0ltZ0luKHQ6IGFueSwgZTogYW55KSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG5cclxuICAgIC8qcmF0aW8gPSAoaW1nV2lkdGggLyBzY3JlZW5XaWR0aCkgICovXHJcblxyXG4gICAgdmFyIG1vdmVSYXRpb1ggPSAoZS5jbGllbnRYIC8gdm0uaW1nLnNjcmVlbldpZHRoKTsgLy9yYW5nZSBmcm9tIFswLCAxXTogMCBiZWluZyBsZWZ0LCAxIGJlaW5nIHJpZ2h0XHJcbiAgICB2YXIgbW92ZU9mZnNldFggPSAtdm0uaW1nLmFuY2hvclggKyAobW92ZVJhdGlvWCAqIHZtLmltZy5hbmNob3JYICogMik7XHJcblxyXG4gICAgdmFyIG1vdmVSYXRpb1kgPSAoZS5jbGllbnRZIC8gdm0uaW1nLnNjcmVlbkhlaWdodCkgKiAyOyAvL3JhbmdlIGZyb20gWzAsIDFdOiAwIGJlaW5nIGxlZnQsIDEgYmVpbmcgcmlnaHRcclxuICAgIHZhciBtb3ZlT2Zmc2V0WSA9IC12bS5pbWcuYW5jaG9yWSArIChtb3ZlUmF0aW9ZICogdm0uaW1nLmFuY2hvclkpO1xyXG5cclxuXHJcbiAgICAvKm9mZnNldCA9IG1pZGRsZV9hbmNob3IgKyBkcmFnZ2VkX29mZnNldCovXHJcbiAgICB2bS5pbWcueF9vZmZzZXRfZGVzdCA9IHZtLmltZy5hbmNob3JYICsgbW92ZU9mZnNldFg7XHJcbiAgICB2bS5pbWcueV9vZmZzZXRfZGVzdCA9IHZtLmltZy5hbmNob3JZICsgbW92ZU9mZnNldFk7XHJcblxyXG4gICAgaWYgKHZtLm1vdXNlSW4gPT09IHRydWUgJiYgTWF0aC5yb3VuZCh2bS5pbWcueV9vZmZzZXQpICE9PSBNYXRoLnJvdW5kKHZtLmltZy55X29mZnNldF9kZXN0KSAmJiBNYXRoLnJvdW5kKHZtLmltZy54X29mZnNldCkgIT09IE1hdGgucm91bmQodm0uaW1nLnhfb2Zmc2V0X2Rlc3QpKSB7XHJcblxyXG5cclxuICAgICAgdm0uaW1nLnhfb2Zmc2V0ID0gTWF0aC5yb3VuZChsZXJwKHZtLmltZy54X29mZnNldCwgdm0uaW1nLnhfb2Zmc2V0X2Rlc3QsIDAuMSkpO1xyXG4gICAgICB2bS5pbWcueV9vZmZzZXQgPSBNYXRoLnJvdW5kKGxlcnAodm0uaW1nLnlfb2Zmc2V0LCB2bS5pbWcueV9vZmZzZXRfZGVzdCwgMC4xKSk7XHJcblxyXG4gICAgICAvLyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0KSA9PiB7IHZtLmRyYXdJbWdJbih0LCBlKSB9KTtcclxuXHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdJbWdPdXQodDogYW55LCBlOiBhbnkpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICAvKnJhdGlvID0gKGltZ1dpZHRoIC8gc2NyZWVuV2lkdGgpICAqL1xyXG5cclxuICAgIC8vIHZhciBtb3ZlUmF0aW9YID0gKGUuY2xpZW50WCAvIHZtLmltZy5zY3JlZW5XaWR0aCk7IC8vcmFuZ2UgZnJvbSBbMCwgMV06IDAgYmVpbmcgbGVmdCwgMSBiZWluZyByaWdodFxyXG4gICAgLy8gdmFyIG1vdmVPZmZzZXRYID0gLXZtLmltZy5hbmNob3JYICsgKG1vdmVSYXRpb1ggKiB2bS5pbWcuYW5jaG9yWCAqIDIpO1xyXG5cclxuICAgIC8vIHZhciBtb3ZlUmF0aW9ZID0gKGUuY2xpZW50WSAvIHZtLmltZy5zY3JlZW5IZWlnaHQpICogMjsgLy9yYW5nZSBmcm9tIFswLCAxXTogMCBiZWluZyBsZWZ0LCAxIGJlaW5nIHJpZ2h0XHJcbiAgICAvLyB2YXIgbW92ZU9mZnNldFkgPSAtdm0uaW1nLmFuY2hvclkgKyAobW92ZVJhdGlvWSAqIHZtLmltZy5hbmNob3JZKTtcclxuXHJcblxyXG4gICAgLypvZmZzZXQgPSBtaWRkbGVfYW5jaG9yICsgZHJhZ2dlZF9vZmZzZXQqL1xyXG4gICAgdm0uaW1nLnhfb2Zmc2V0X2Rlc3QgPSB2bS5pbWcuYW5jaG9yWDtcclxuICAgIHZtLmltZy55X29mZnNldF9kZXN0ID0gdm0uaW1nLmFuY2hvclk7XHJcblxyXG4gICAgaWYgKHZtLm1vdXNlSW4gPT09IGZhbHNlICYmIE1hdGgucm91bmQodm0uaW1nLnlfb2Zmc2V0KSAhPT0gTWF0aC5yb3VuZCh2bS5pbWcueV9vZmZzZXRfZGVzdCkgJiYgTWF0aC5yb3VuZCh2bS5pbWcueF9vZmZzZXQpICE9PSBNYXRoLnJvdW5kKHZtLmltZy54X29mZnNldF9kZXN0KSkge1xyXG5cclxuXHJcbiAgICAgIHZtLmltZy54X29mZnNldCA9IGxlcnAodm0uaW1nLnhfb2Zmc2V0LCB2bS5pbWcueF9vZmZzZXRfZGVzdCwgMC4xKTtcclxuICAgICAgdm0uaW1nLnlfb2Zmc2V0ID0gbGVycCh2bS5pbWcueV9vZmZzZXQsIHZtLmltZy55X29mZnNldF9kZXN0LCAwLjEpO1xyXG5cclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodCkgPT4geyB2bS5kcmF3SW1nT3V0KHQsIGUpIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBpbml0RXZlbnRzKCkge1xyXG4gICAgd2luZG93Lm9ucmVzaXplID0gKGUpID0+IHtcclxuICAgICAgdGhpcy5zaXplQ2FudmFzKCk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbn0iLCJpbXBvcnQgKiBhcyBqdW1wIGZyb20gXCJqdW1wLmpzXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBpbWFnZV9jYW52YXMgZnJvbSBcIi4vaW1hZ2VfY2FudmFzXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBza2lsbF9iYWRnZSBmcm9tIFwiLi9za2lsbF9iYWRnZVwiO1xyXG5cclxuaW1wb3J0ICogYXMgbWVkaWEgZnJvbSBcIi4vbWVkaWFcIjtcclxuXHJcbi8veW9vXHJcbmNvbnN0IHRpbWVvdXQ6bnVtYmVyID0gMTAwMDtcclxuXHJcbnZhciBmcm9udGVuZCA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnZmxleC1ncmlkMScsIFsgIHtcIm5hbWVcIjogJ0hUTUw1JywgICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjonaHRtbDUuc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0phdmEgU2NyaXB0JywgICAgIFwiY2xhc3NcIjonY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjonamF2YXNjcmlwdC0yLnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdCb290c3RyYXAnLCAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0xMDAnLCBcImltYWdlXCI6J2Jvb3RzdHJhcC00LnN2Zyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0FuZ3VsYXIgSlMnLCAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTc1JywgXCJpbWFnZVwiOidhbmd1bGFyLWljb24uc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ1R5cGUgU2NyaXB0JywgICAgIFwiY2xhc3NcIjonY2lyY2xlLTc1JywgXCJpbWFnZVwiOid0eXBlc2NyaXB0LnN2Zyd9LCAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnR3VscCcsICAgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNzUnLCBcImltYWdlXCI6J2d1bHAuc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0NTUzMnLCAgICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTUwJywgXCJpbWFnZVwiOidjc3MtMy5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnalF1ZXJ5JywgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J2pxdWVyeS0xLnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdTQ1NTJywgICAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS01MCcsIFwiaW1hZ2VcIjonc2Fzcy0xLnN2Zyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0QzLmpzJywgICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTI1JywgXCJpbWFnZVwiOidkMy0yLnN2Zyd9XSwgJ2Zyb250ZW5kJyk7XHJcbnZhciBzb2Z0ZW5nID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICdmbGV4LWdyaWQyJywgICAgW3tcIm5hbWVcIjogJ0phdmEnLCAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNzUnLCBcImltYWdlXCI6J2phdmEtMTQuc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnUHl0aG9uJywgICAgICBcImNsYXNzXCI6J2NpcmNsZS01MCcsIFwiaW1hZ2VcIjoncHl0aG9uLTUuc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnQysrJywgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMjUnLCBcImltYWdlXCI6J2Mtc2Vla2xvZ28uY29tLnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ05vZGUgSlMnLCAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0yNScsIFwiaW1hZ2VcIjonbm9kZWpzLWljb24uc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnQyMnLCAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0yNScsIFwiaW1hZ2VcIjonY3NoYXJwLnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ1VuaXR5JywgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMjUnLCBcImltYWdlXCI6J3VuaXR5LnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0FuZHJvaWQgU3R1ZGlvJywgIFwiY2xhc3NcIjonY2lyY2xlLTI1JywgXCJpbWFnZVwiOidBbmRyb2lkX3N0dWRpby5zdmcnfV0sICdzb2Z0ZW5nJyk7XHJcbnZhciBkZXNpZ24gPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJ2ZsZXgtZ3JpZDMnLCAgICAgICBbe1wibmFtZVwiOiAnUGhvdG9zaG9wJywgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J3Bob3Rvc2hvcC1jYy5zdmcnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0lsbHVzdHJhdG9yJywgICAgIFwiY2xhc3NcIjonY2lyY2xlLTUwJywgXCJpbWFnZVwiOidhZG9iZS1pbGx1c3RyYXRvci1jYy5zdmcnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ01heWEnLCAgICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTUwJywgXCJpbWFnZVwiOidtYXlhLnBuZyd9LCAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdBZnRlciBFZmZlY3RzJywgICBcImNsYXNzXCI6J2NpcmNsZS0yNScsIFwiaW1hZ2VcIjonYWZ0ZXItZWZmZWN0cy1jYy5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdNdWRib3gnLCAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0yNScsIFwiaW1hZ2VcIjonbXVkYm94LnBuZyd9XSwgJ2Rlc2lnbicpO1xyXG5mcm9udGVuZC5sb2FkKCk7XHJcbnNvZnRlbmcubG9hZCgpO1xyXG5kZXNpZ24ubG9hZCgpO1xyXG5cclxuXHJcbnZhciBhcHAgPSBuZXcgaW1hZ2VfY2FudmFzLkFwcCgpO1xyXG5cclxuXHJcbi8vIHdpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uKCl7XHJcbi8vICAgICBjb25zb2xlLmxvZyh3aW5kb3cuc2Nyb2xsWSk7XHJcbi8vIH1cclxuXHJcblxyXG4vLyB2YXIgdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid3JhcHBlci0wXCIpO1xyXG4vLyB2YXIgYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwMScpO1xyXG5cclxuXHJcbi8vIGIub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcbi8vICAgICBpZih3LmNsYXNzTGlzdFsxXSA9PT0gXCJvcGVuXCIpe1xyXG4vLyAgICAgICAgIHcuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4vLyAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICB3LmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuLy8gICAgIH1cclxuLy8gfVxyXG5cclxuZXhwb3J0IGNsYXNzIFBvcnRmb2xpb0l0ZW0ge1xyXG4gICAgdGl0bGU6IHN0cmluZzsgXHJcbiAgICB0aXRsZV9pbWFnZTogc3RyaW5nOyBcclxuICAgIGRlc2M6IHN0cmluZztcclxuICAgIHN0YWNrOiBza2lsbF9iYWRnZS5Db2xsZWN0aW9uOyBcclxuICAgIHBvcnRfaW1hZ2U6IHN0cmluZztcclxuICAgIFxyXG4gICAgaXRlbV9udW06IG51bWJlcjtcclxuXHJcbiAgICBjb2xfc2l6ZTogc3RyaW5nO1xyXG4gICAgY29sOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGltZzogSFRNTEltYWdlRWxlbWVudDtcclxuICAgIHRleHQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgc3ViX3RleHQ6IEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIG9wZW46IGJvb2xlYW47XHJcbiAgICBtZWRpYTptZWRpYS5NZWRpYTtcclxuICAgIHRhcmdldF93cmFwcGVyOiBXcmFwcGVyO1xyXG4gICAgcG9ydGZvbGlvOiBQb3J0Zm9saW87XHJcbiAgXHJcbiAgY29uc3RydWN0b3IocG9ydGZvbGlvOiBQb3J0Zm9saW8sIGl0ZW1fbnVtOiBudW1iZXIsICB0aXRsZTogc3RyaW5nLCB0aXRsZV9pbWFnZTogc3RyaW5nLCBkZXNjOiBzdHJpbmcsIHN0YWNrOiBza2lsbF9iYWRnZS5Db2xsZWN0aW9uLCBtZWRpYTptZWRpYS5NZWRpYSwgdHlwZTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgdm0ucG9ydGZvbGlvID0gcG9ydGZvbGlvO1xyXG4gICAgdm0uaXRlbV9udW0gPSBpdGVtX251bTtcclxuICAgIHZtLnRpdGxlID0gdGl0bGU7XHJcbiAgICB2bS50aXRsZV9pbWFnZSA9IHRpdGxlX2ltYWdlO1xyXG4gICAgdm0uZGVzYyA9IGRlc2M7XHJcbiAgICB2bS5zdGFjayA9IHN0YWNrO1xyXG4gICAgdm0ubWVkaWEgPSBtZWRpYTtcclxuICAgIHZtLmNvbF9zaXplID0gXCJjb2wtbWQtM1wiO1xyXG4gICAgXHJcblxyXG4gICAgdm0uY29sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB2bS5jb2wuY2xhc3NMaXN0LmFkZCh2bS5jb2xfc2l6ZSk7XHJcblxyXG4gICAgdmFyIGNhcmRfc2hhZG93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBjYXJkX3NoYWRvdy5jbGFzc0xpc3QuYWRkKCdjYXJkLWRyb3BzaGFkb3cnLCAncm93Jyk7XHJcblxyXG4gICAgdmFyIG5vcGFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBub3BhZC5jbGFzc0xpc3QuYWRkKCdjb2wtbWQtMTInLCdub3BhZCcpO1xyXG5cclxuICAgIHZtLmltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgdm0uaW1nLnNyYyA9IHZtLnRpdGxlX2ltYWdlO1xyXG5cclxuICAgIHZhciBjb2wxMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgY29sMTIuY2xhc3NMaXN0LmFkZCgnY29sLW1kLTEyJyk7XHJcblxyXG4gICAgdm0udGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdm0udGV4dC5jbGFzc0xpc3QuYWRkKCd0ZXh0Jyk7XHJcbiAgICB2bS50ZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRpdGxlKSk7XHJcblxyXG4gICAgdmFyIGNvbDEyXzIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGNvbDEyXzIuY2xhc3NMaXN0LmFkZCgnY29sLW1kLTEyJyk7XHJcblxyXG4gICAgdm0uc3ViX3RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHZtLnN1Yl90ZXh0LmNsYXNzTGlzdC5hZGQoJ3RleHRfbGlnaHQnKTtcclxuICAgIHZtLnN1Yl90ZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHR5cGUpKTtcclxuXHJcbiAgICAvLyAuY29sLW1kLTNcclxuICAgIC8vICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKSNwMVxyXG4gICAgLy8gICAgICAgLnRleHQgQnJlYXRobGVzczogSFRNTDUgR2FtZVxyXG5cclxuICAgIC8vIC5jb2wtbWQtM1xyXG4gICAgLy8gICAgICAgLmNhcmQtZHJvcHNoYWRvdy5yb3dcclxuICAgIC8vICAgICAgICAgLmNvbC1tZC0xMi5ub3BhZFxyXG4gICAgLy8gICAgICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKSNwMS5kcm9wc2hhZG93XHJcbiAgICAvLyAgICAgICAgIC5jb2wtbWQtMTJcclxuICAgIC8vICAgICAgICAgICAudGV4dCBCcmVhdGhsZXNzXHJcbiAgICAvLyAgICAgICAgIC5jb2wtbWQtMTJcclxuICAgIC8vICAgICAgICAgICAudGV4dF9saWdodCBIVE1MNSBHYW1lXHJcblxyXG4gICAgdm0uY29sLmFwcGVuZENoaWxkKGNhcmRfc2hhZG93KTtcclxuICAgIGNhcmRfc2hhZG93LmFwcGVuZENoaWxkKG5vcGFkKTtcclxuICAgIG5vcGFkLmFwcGVuZENoaWxkKHZtLmltZyk7XHJcbiAgICBjYXJkX3NoYWRvdy5hcHBlbmRDaGlsZChjb2wxMik7XHJcbiAgICBjb2wxMi5hcHBlbmRDaGlsZCh2bS50ZXh0KTtcclxuICAgIGNhcmRfc2hhZG93LmFwcGVuZENoaWxkKGNvbDEyXzIpO1xyXG4gICAgY29sMTJfMi5hcHBlbmRDaGlsZCh2bS5zdWJfdGV4dCk7XHJcblxyXG4gICAgdm0ub3BlbiA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICB2bS5jb2wub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy8gICBjb25zb2xlLih2bS5pdGVtc1swXSk7XHJcbiAgICAgICAgdmFyIGRpZmZlcmVudF93cmFwcGVyID0gZmFsc2U7XHJcbiAgICAgICAgY29uc29sZS5sb2codm0ubWVkaWEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRpZmZlcmVudF93cmFwcGVyID0gdm0ucG9ydGZvbGlvLmNsb3NlKHZtLml0ZW1fbnVtKTtcclxuICAgICAgICBcclxuICAgICAgICB2bS5vcGVuID0gdm0udGFyZ2V0X3dyYXBwZXIudHJhbnNpdGlvbldyYXBwZXIoZGlmZmVyZW50X3dyYXBwZXIsIHZtLm9wZW4sIHZtLnRpdGxlLCB2bS5kZXNjLCB2bS5zdGFjaywgdm0ubWVkaWEpXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gICB2bS5zZXREYXRhKCk7ICBcclxuICAgICAgfVxyXG4gICAgXHJcbiAgfVxyXG4gIGFwcGVuZChyb3c6IG51bWJlciwgd3JhcHBlcjogV3JhcHBlcikge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdmFyIHJvd19lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvd18nK3Jvdyk7XHJcbiAgICBcclxuICAgIHJvd19lbGVtZW50LmFwcGVuZENoaWxkKHZtLmNvbCk7XHJcbiAgICB2bS50YXJnZXRfd3JhcHBlciA9IHdyYXBwZXI7XHJcbiAgICB2bS5zdGFjay5mbGV4X2dyaWRfaWQgPSB3cmFwcGVyLmZsZXhfZ3JpZC5pZDtcclxuICAgIHZtLm1lZGlhLmlkID0gJ21lZGlhLScrcm93O1xyXG4gICAgY29uc29sZS5sb2codm0ubWVkaWEpO1xyXG4gIH1cclxuICBzZXRDb2woY2xhc3NOYW1lOiBzdHJpbmcpe1xyXG4gICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgIHZtLmNvbC5jbGFzc0xpc3QucmVtb3ZlKHZtLmNvbF9zaXplKTtcclxuICAgICAgdm0uY29sX3NpemUgPSBjbGFzc05hbWU7XHJcbiAgICAgIHZtLmNvbC5jbGFzc0xpc3QuYWRkKHZtLmNvbF9zaXplKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFBvcnRmb2xpbyB7XHJcbiAgaWQ6IHN0cmluZztcclxuICBqc29uX29ianM6IElQb3J0Zm9saW9JdGVtW107XHJcbiAgcGF0aDogc3RyaW5nO1xyXG4gIGl0ZW1zOiBQb3J0Zm9saW9JdGVtW107XHJcbiAgd3JhcHBlcnM6IFdyYXBwZXJbXTtcclxuICBmbGV4X2dyaWRfaWQ6IHN0cmluZztcclxuICBwZXJfcm93Om51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywganNvbl9vYmpzOiBJUG9ydGZvbGlvSXRlbVtdKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2bS5pZCA9IGlkO1xyXG4gICAgdm0uanNvbl9vYmpzID0ganNvbl9vYmpzO1xyXG4gICAgIFxyXG5cclxuICAgIHZtLml0ZW1zID0gW107XHJcbiAgICB2bS53cmFwcGVycyA9IFtdO1xyXG5cclxuICAgIC8vYWRkIHdyYXBwZXJzIGJhc2VkIG9uIGFsbCBwb3NzaWJsZSBicmVha3BvaW50IHdpZHRocyAoanNvbl9vYmpzLzIpXHJcbiAgICBmb3IodmFyIGogPSAwOyBqIDwgTWF0aC5jZWlsKGpzb25fb2Jqcy5sZW5ndGgvMik7IGorKyl7XHJcbiAgICAgICAgdm0ud3JhcHBlcnMucHVzaChuZXcgV3JhcHBlcihqKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9hZGQgYWxsIGl0ZW1zXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmpzb25fb2Jqcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2bS5pdGVtcy5wdXNoKG5ldyBQb3J0Zm9saW9JdGVtKHZtLCBpLCBqc29uX29ianNbaV0udGl0bGUsIGpzb25fb2Jqc1tpXS50aXRsZV9pbWFnZSwganNvbl9vYmpzW2ldLmRlc2MsIGpzb25fb2Jqc1tpXS5zdGFjaywganNvbl9vYmpzW2ldLm1lZGlhLCBqc29uX29ianNbaV0udHlwZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHZtLmFwcGVuZEFsbCgpO1xyXG5cclxuICAgIFxyXG4gIH1cclxuXHJcbiAgICBwdWJsaWMgYXBwZW5kQWxsKCl7IC8vYXBwZW5kcyBQb3J0Zm9saW9JdGVtcyBiYXNlZCBvbiBzY3JlZW4gc2l6ZTsgZ2V0cyBkaWdlc3RlZFxyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2YXIgc2NyZWVuV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICBjb25zb2xlLmxvZyhzY3JlZW5XaWR0aCk7XHJcblxyXG4gICAgICAgIC8vcmVhc3NpZ25zIGNvbHMgYmFzZWQgb24gYnJlYWtwb2ludHNcclxuICAgICAgICB2YXIgYnJlYWtwb2ludHMgPSBbe21pbjogMCwgbWF4Ojc2OCwgY29sX3NpemU6ICdjb2wteHMtNicsIHBlcl9yb3c6IDJ9LHttaW46IDc2OSwgbWF4Ojk5MiwgY29sX3NpemU6ICdjb2wteHMtNCcsIHBlcl9yb3c6IDN9LCB7bWluOiA5OTMsIG1heDoxMjAwLCBjb2xfc2l6ZTogJ2NvbC14cy0zJywgcGVyX3JvdzogNH0sIHttaW46IDEyMDAsIG1heDo5OTk5LCBjb2xfc2l6ZTogJ2NvbC14cy0zJywgcGVyX3JvdzogNH1dO1xyXG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGJyZWFrcG9pbnRzLmxlbmd0aDsgaSsrKXtcclxuXHJcbiAgICAgICAgICAgIC8vaWYgaW4gYnJlYWtwb2ludCByYW5nZSwgYW5kIG5vdCBzYW1lIGFzIGJlZm9yZVxyXG4gICAgICAgICAgICBpZigvKnZtLml0ZW1zWzBdLmNvbF9zaXplICE9PSBicmVha3BvaW50c1tpXS5jb2xfc2l6ZSAmJiAqL3NjcmVlbldpZHRoID4gYnJlYWtwb2ludHNbaV0ubWluICYmIHNjcmVlbldpZHRoIDwgYnJlYWtwb2ludHNbaV0ubWF4KXtcclxuICAgICAgICAgICAgICAgIC8vY2xlYXIgYWxsIHJvd3NcclxuICAgICAgICAgICAgICAgIHZtLnBlcl9yb3cgPSBicmVha3BvaW50c1tpXS5wZXJfcm93O1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3J0Zm9saW8nKTtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IHBhcmVudC5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGEgPSAxOyBhIDwgaXRlcmF0b3I7IGErKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHBhcmVudC5jaGlsZHJlblsxXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy9hZGQgbmV3IHJvd3MgYW5kIHdyYXBwZXJzXHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIHIgPSAwOyByIDwgTWF0aC5jZWlsKHZtLml0ZW1zLmxlbmd0aCAvIGJyZWFrcG9pbnRzW2ldLnBlcl9yb3cpOyByKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgICAgICByb3cuaWQgPSAncm93XycrcjtcclxuICAgICAgICAgICAgICAgICAgICByb3cuY2xhc3NMaXN0LmFkZCgncm93Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB3cmFwcGVyID0gdm0ud3JhcHBlcnNbcl0uaHRtbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHJvdyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHdyYXBwZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9hZGQgY29scyB0byBuZXcgcm93c1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBqPTA7IGo8dm0uaXRlbXMubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLml0ZW1zW2pdLnNldENvbChicmVha3BvaW50c1tpXS5jb2xfc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvd19udW0gPSBNYXRoLmZsb29yKGovYnJlYWtwb2ludHNbaV0ucGVyX3Jvdyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uaXRlbXNbal0uYXBwZW5kKHJvd19udW0sIHZtLndyYXBwZXJzW3Jvd19udW1dKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgcHVibGljIGNsb3NlKGl0ZW1fbnVtOiBudW1iZXIpIHsgLy9jbG9zZXMgYWxsIHdyYXBwZXJzXHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAvL2Nsb3NlcyBhbGwgaXRlbXMgaW4gdGhlIHJvdyBvZiB0aGUgZ2l2ZW4gaXRlbS5cclxuICAgIHZhciByb3cgPSBNYXRoLmZsb29yKGl0ZW1fbnVtL3ZtLnBlcl9yb3cpO1xyXG5cclxuICAgIC8vIGZvcih2YXIgaiA9IChyb3cqdm0ucGVyX3Jvdyk7IGogPCAoKHJvdyp2bS5wZXJfcm93KSt2bS5wZXJfcm93KTsgaisrKXtcclxuICAgIC8vICAgICBpZihpdGVtX251bSAhPT0gaiAmJiB2bS5pdGVtc1tqXSl7XHJcbiAgICAvLyAgICAgICAgIHZtLml0ZW1zW2pdLm9wZW4gPSBmYWxzZTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcbiAgICB2YXIgcmV0dXJuX3ZhbHVlID0gZmFsc2U7XHJcblxyXG4gICAgZm9yKHZhciBqID0gMDsgaiA8IHZtLml0ZW1zLmxlbmd0aDsgaisrKXtcclxuICAgICAgICBpZihpdGVtX251bSAhPT0gaiAmJiB2bS5pdGVtc1tqXSl7XHJcbiAgICAgICAgICAgIHZtLml0ZW1zW2pdLm9wZW4gPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IodmFyIHIgPSAwOyByIDwgdm0ud3JhcHBlcnMubGVuZ3RoOyByKyspe1xyXG4gICAgICAgIGlmKHIgIT09IHJvdyAmJiB2bS53cmFwcGVyc1tyXS5odG1sLmNsYXNzTGlzdFsxXSA9PT0gJ29wZW4nKXtcclxuICAgICAgICAgICAgdm0ud3JhcHBlcnNbcl0uY2xvc2UoKTtcclxuICAgICAgICAgICAgcmV0dXJuX3ZhbHVlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0dXJuX3ZhbHVlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdyYXBwZXIge1xyXG4gICAgdGl0bGU6IHN0cmluZzsgXHJcbiAgICBkZXNjOiBzdHJpbmc7XHJcbiAgICBjb2xsZWN0aW9uOiBza2lsbF9iYWRnZS5Db2xsZWN0aW9uO1xyXG4gICAgcG9ydF9pbWFnZTogc3RyaW5nOyBcclxuICAgIG1lZGlhOiBtZWRpYS5NZWRpYTtcclxuICAgIFxyXG5cclxuICAgIGh0bWw6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICB0aXRsZV9lbGVtZW50OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgZGVzY3JpcHRpb246SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBzdGFjazpIVE1MRGl2RWxlbWVudDtcclxuICAgIGZsZXhfZ3JpZDpIVE1MRGl2RWxlbWVudDtcclxuICAgIGRlbW86SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb2w1OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgZGVzY3JpcHRpb25fdGV4dDogVGV4dDtcclxuICAgIHRpdGxlX2VsZW1lbnRfdGV4dDogVGV4dDtcclxuICAgIGxpbms6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBsaW5rX3RleHQ6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb2w2OkhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIGNoYW5nZTpib29sZWFuO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihyb3dfbnVtKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZtLmNoYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgIC8vIHZtLnRpdGxlID0gcEl0ZW0udGl0bGU7XHJcbiAgICAgICAgLy8gdm0uZGVzYyA9IHBJdGVtLmRlc2M7XHJcbiAgICAgICAgLy8gdm0uc3RhY2sgPSBwSXRlbS5zdGFjaztcclxuICAgICAgICAvLyB2bS5wb3J0X2ltYWdlID0gcEl0ZW0ucG9ydF9pbWFnZTtcclxuICAgICAgICB2bS5odG1sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uaHRtbC5pZCA9ICd3cmFwcGVyLScrcm93X251bTtcclxuICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5hZGQoJ3dyYXBwZXInKTtcclxuXHJcbiAgICAgICAgdmFyIHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHJvdy5pZCA9ICdjb250ZW50JztcclxuICAgICAgICByb3cuY2xhc3NMaXN0LmFkZCgncm93JywgJ25vbWFyJyk7XHJcblxyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS50aXRsZV9lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2NvbC1tZC0xMicsICdkZXNjLXRleHQnLCAncGFkLXNwYWNpbmcnKTtcclxuICAgICAgICB2bS50aXRsZV9lbGVtZW50X3RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XHJcbiAgICAgICAgdm0udGl0bGVfZWxlbWVudC5hcHBlbmRDaGlsZCh2bS50aXRsZV9lbGVtZW50X3RleHQpO1xyXG5cclxuICAgICAgICB2YXIgY29sNiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbDYuY2xhc3NMaXN0LmFkZCgnY29sLW1kLTYnLCAncm93Jyk7XHJcblxyXG4gICAgICAgIHZhciByb3dfZmlsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHJvd19maWxsLmNsYXNzTGlzdC5hZGQoJ3JvdycsJ2p1c3RpZnktY2VudGVyJywgJ25vbWFyJyk7XHJcblxyXG4gICAgICAgIHZhciBjb2wxMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbDEyLmNsYXNzTGlzdC5hZGQoJ2NvbC1tZC0xMicpO1xyXG5cclxuICAgICAgICB2bS5jb2w2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uY29sNi5pZCA9ICdtZWRpYS0nK3Jvd19udW07XHJcbiAgICAgICAgdm0uY29sNi5jbGFzc0xpc3QuYWRkKCdjb2wtbWQtNicpO1xyXG5cclxuICAgICAgICB2YXIgY29sM18yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29sM18yLmNsYXNzTGlzdC5hZGQoJ2NvbC1tZC0zJywgJ25vcGFkLWxlZnQnKTtcclxuXHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5kZXNjcmlwdGlvbi5jbGFzc0xpc3QuYWRkKCdoZWFkZXItdGV4dCcsICdwYWQtc3BhY2luZycpO1xyXG4gICAgICAgIHZtLmRlc2NyaXB0aW9uLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdEZXNjcmlwdGlvbicpKTtcclxuXHJcbiAgICAgICAgdmFyIGRlc2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkZXNjLmNsYXNzTGlzdC5hZGQoJ2Rlc2NyaXB0aW9uLXRleHQnLCAncGFkLXNwYWNpbmcnKTtcclxuICAgICAgICB2bS5kZXNjcmlwdGlvbl90ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xyXG4gICAgICAgIGRlc2MuYXBwZW5kQ2hpbGQodm0uZGVzY3JpcHRpb25fdGV4dCk7XHJcblxyXG4gICAgICAgIHZtLnN0YWNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uc3RhY2suY2xhc3NMaXN0LmFkZCgnY29sLW1kLTgnKTtcclxuICAgICAgICAvLyB2bS5zdGFjay5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnU3RhY2snKSk7XHJcblxyXG4gICAgICAgIHZhciBzdGFja190aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHN0YWNrX3RpdGxlLmNsYXNzTGlzdC5hZGQoJ2hlYWRlci10ZXh0JywgJ3BhZC1zcGFjaW5nJylcclxuICAgICAgICBzdGFja190aXRsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnU3RhY2snKSk7XHJcblxyXG4gICAgICAgIHZtLmZsZXhfZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmZsZXhfZ3JpZC5pZCA9ICdwZmxleC1ncmlkLScrcm93X251bTtcclxuICAgICAgICB2bS5mbGV4X2dyaWQuY2xhc3NMaXN0LmFkZCgncm93JywncG9ydGZvbGlvLWZsZXgnLCAnY29sLW1kLTEyJyk7XHJcblxyXG4gICAgICAgIHZtLmRlbW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5kZW1vLmNsYXNzTGlzdC5hZGQoJ2NvbC1tZC00Jyk7XHJcbiAgICAgICAgLy8gdm0uZGVtby5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTGl2ZSBEZW1vJykpO1xyXG5cclxuICAgICAgICB2YXIgZGVtb190aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRlbW9fdGl0bGUuY2xhc3NMaXN0LmFkZCgnaGVhZGVyLXRleHQnLCAncGFkLXNwYWNpbmcnKVxyXG4gICAgICAgIGRlbW9fdGl0bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0xpdmUgRGVtbycpKTtcclxuXHJcbiAgICAgICAgdm0ubGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmxpbmsuY2xhc3NMaXN0LmFkZCgnZ2l0aHViLWJ1dHRvbicsJ3JvdycpO1xyXG5cclxuICAgICAgICB2bS5saW5rX3RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5saW5rX3RleHQuY2xhc3NMaXN0LmFkZCgndGV4dCcpO1xyXG4gICAgICAgIHZtLmxpbmtfdGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTGl2ZSBMaW5rJykpOyAgICAgICAgXHJcblxyXG4gICAgICAgIHZtLmNvbDUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5jb2w1LmNsYXNzTGlzdC5hZGQoJ2NvbC1tZC01Jyk7XHJcblxyXG4gICAgICAgIC8qIEdPTk5BIEhBVkUgVE8gQUREIE1FRElBIERZTkFNSUNBTExZICovXHJcblxyXG4gICAgICAgIHZtLmh0bWwuYXBwZW5kQ2hpbGQocm93KTtcclxuICAgICAgICByb3cuYXBwZW5kQ2hpbGQodm0udGl0bGVfZWxlbWVudCk7XHJcbiAgICAgICAgcm93LmFwcGVuZENoaWxkKGNvbDYpO1xyXG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZCh2bS5jb2w2KTtcclxuICAgICAgICBcclxuICAgICAgICBjb2w2LmFwcGVuZENoaWxkKGNvbDEyKTtcclxuICAgICAgICBjb2wxMi5hcHBlbmRDaGlsZCh2bS5kZXNjcmlwdGlvbik7XHJcbiAgICAgICAgY29sMTIuYXBwZW5kQ2hpbGQoZGVzYyk7XHJcbiAgICAgICAgY29sNi5hcHBlbmRDaGlsZCh2bS5zdGFjaylcclxuICAgICAgICB2bS5zdGFjay5hcHBlbmRDaGlsZChzdGFja190aXRsZSk7XHJcbiAgICAgICAgdm0uc3RhY2suYXBwZW5kQ2hpbGQodm0uZmxleF9ncmlkKTtcclxuICAgICAgICBjb2w2LmFwcGVuZENoaWxkKHZtLmRlbW8pXHJcbiAgICAgICAgdm0uZGVtby5hcHBlbmRDaGlsZChkZW1vX3RpdGxlKTtcclxuICAgICAgICB2bS5kZW1vLmFwcGVuZENoaWxkKHZtLmxpbmspO1xyXG4gICAgICAgIHZtLmxpbmsuYXBwZW5kQ2hpbGQodm0ubGlua190ZXh0KTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgLy8jd3JhcHBlci0wLndyYXBwZXIub3BlblxyXG4gICAgICAgIC8vIC5yb3cjY29udGVudFxyXG4gICAgICAgIC8vICAgLmNvbC1tZC0xMi5kZXNjLXRleHQgQnJlYXRobGVzc1xyXG4gICAgICAgIC8vICAgLmNvbC1tZC02I21lZGlhLTBcclxuICAgICAgICAvLyAgIC5jb2wtbWQtNi5yb3dcclxuICAgICAgICAvLyAgICAgICAuY29sLW1kLTEyXHJcbiAgICAgICAgLy8gICAgICAgICAuaGVhZGVyLXRleHQucGFkZGluZy1sZWZ0IERlc2NyaXB0aW9uOlxyXG4gICAgICAgIC8vICAgICAgICAgLmRlc2NyaXB0aW9uLXRleHQucGFkZGluZy1sZWZ0IGFzZGZhc2RmXHJcbiAgICAgICAgLy8gICAgICAgLmNvbC1tZC02LmhlYWRlci10ZXh0IFN0YWNrOlxyXG4gICAgICAgIC8vICAgICAgIC5jb2wtbWQtNi5oZWFkZXItdGV4dCBMaXZlIERlbW86XHJcblxyXG4gICAgICAgIHZtLmh0bWwuYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgaWYodm0uY2hhbmdlKXtcclxuICAgICAgICAgICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgdm0uc2V0RGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgdm0uY2hhbmdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgfVxyXG4gICAgLy8gY2xvc2VEYXRhKCl7XHJcbiAgICAvLyAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgLy8gICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgIC8vICAgICAgICAgdm0uY29sbGVjdGlvbi5jbG9zZSgpO1xyXG4gICAgLy8gICAgIH0sdGltZW91dCk7XHJcbiAgICAgICAgXHJcbiAgICAvLyB9XHJcblxyXG4gICAgc2V0RGF0YSgpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5zZXRUaXRsZSgpO1xyXG4gICAgICAgIHZtLnNldERlc2MoKTtcclxuICAgICAgICB2bS5zZXRTdGFjaygpO1xyXG4gICAgICAgIHZtLnNldE1lZGlhKCk7XHJcbiAgICAgICAgLy8gdm0uc2V0U3RhY2soc3RhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFRpdGxlKCl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnRfdGV4dC50ZXh0Q29udGVudCA9IHZtLnRpdGxlO1xyXG4gICAgfVxyXG4gICAgc2V0RGVzYygpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5kZXNjcmlwdGlvbl90ZXh0LnRleHRDb250ZW50ID0gdm0uZGVzYztcclxuICAgIH1cclxuXHJcbiAgICBzZXRTdGFjaygpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5jb2xsZWN0aW9uLnJlc2V0SWRzKHZtLmZsZXhfZ3JpZC5pZCk7XHJcbiAgICAgICAgdm0uY29sbGVjdGlvbi5sb2FkKCk7XHJcbiAgICB9XHJcbiAgICBzZXRNZWRpYSgpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5tZWRpYS5zZXRJZCh2bS5tZWRpYS5pZCk7XHJcbiAgICAgICAgdm0ubWVkaWEubG9hZE1lZGlhKDApO1xyXG4gICAgfVxyXG4gICAgY2xvc2UoKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XHJcbiAgICB9XHJcbiAgICBjaGFuZ2VXcmFwcGVyKG9wZW46IGJvb2xlYW4sIHRpdGxlLCBkZXNjLCBzdGFjaywgbWVkaWEpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICAvL2Nsb3NlIHdyYXBwZXI6XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHZtLnRpdGxlID09PSB0aXRsZSl7IC8qKmlmIG5vIGNoYW5nZSAqL1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnMScpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhvcGVuKTtcclxuICAgICAgICAgICAgdm0uY2hhbmdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihvcGVuKXtcclxuICAgICAgICAgICAgICAgIC8vIHZtLmNsb3NlRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2bS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgICAgICAgICAgdm0uZGVzYyA9IGRlc2M7XHJcbiAgICAgICAgICAgICAgICB2bS5jb2xsZWN0aW9uID0gc3RhY2s7XHJcbiAgICAgICAgICAgICAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgICAgICAgICAgICAgdm0uc2V0RGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZih2bS5odG1sLmNsYXNzTGlzdFsxXSAhPT0gJ29wZW4nKXsgLyoqaWYgYWxsIHNlbGVjdGlvbnMgYXJlIGNsb3NlZCBpbml0aWFsbHkvY2hhbmdlIHdoZW4gY2xvc2VkKi9cclxuICAgICAgICAgICAgY29uc29sZS5sb2coJzInKTtcclxuICAgICAgICAgICAgdm0uY2hhbmdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZtLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgICAgIHZtLmRlc2MgPSBkZXNjO1xyXG4gICAgICAgICAgICB2bS5jb2xsZWN0aW9uID0gc3RhY2s7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgICAgIHZtLnNldERhdGEoKTtcclxuICAgICAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCczJyk7XHJcbiAgICAgICAgICAgIHZtLmNoYW5nZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHZtLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgICAgIHZtLmRlc2MgPSBkZXNjO1xyXG4gICAgICAgICAgICB2bS5jb2xsZWN0aW9uID0gc3RhY2s7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgICAgIC8vIHZtLmNsb3NlRGF0YSgpO1xyXG4gICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2l0aW9uV3JhcHBlcihkaWZmZXJlbnRfd3JhcHBlcjpib29sZWFuLCBvcGVuOiBib29sZWFuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciByZXR1cm5fdmFsdWU7XHJcblxyXG4gICAgICAgIGlmKGRpZmZlcmVudF93cmFwcGVyKXtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuX3ZhbHVlID0gdm0uY2hhbmdlV3JhcHBlcihvcGVuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aW1lb3V0OiAnKyByZXR1cm5fdmFsdWUpOyBcclxuICAgICAgICAgICAgfSwgdGltZW91dCk7XHJcbiAgICAgICAgfSBlbHNlIGlmKG9wZW4gPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIG9wZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm5fdmFsdWUgPSB2bS5jaGFuZ2VXcmFwcGVyKG9wZW4sIHRpdGxlLCBkZXNjLCBzdGFjaywgbWVkaWEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHZtLmNoYW5nZVdyYXBwZXIob3BlbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXR1cm5fdmFsdWU6ICcrcmV0dXJuX3ZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcmV0dXJuX3ZhbHVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQb3J0Zm9saW9JdGVtIHtcclxuICB0aXRsZTogc3RyaW5nO1xyXG4gIHRpdGxlX2ltYWdlOiBzdHJpbmc7IFxyXG4gIGRlc2M6IHN0cmluZztcclxuICBzdGFjazogc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbjtcclxuICBtZWRpYTogbWVkaWEuTWVkaWE7IFxyXG4gIHR5cGU6IHN0cmluZztcclxufVxyXG5cclxuLy8ge1wibmFtZVwiOiAnUHl0aG9uJywgICAgICBcImNsYXNzXCI6J2NpcmNsZS01MCcsIFwiaW1hZ2VcIjoncHl0aG9uLTUuc3ZnJ31cclxudmFyIGJyZWF0aGxlc3Nfc3RhY2sgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJycsIFsgICB7XCJuYW1lXCI6ICdQaGFzZXIuanMnLCAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0xMDAnLCBcImltYWdlXCI6J3BoYXNlci5zdmcnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnUGhvdG9zaG9wJywgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMTAwJywgXCJpbWFnZVwiOidwaG90b3Nob3AtY2Muc3ZnJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ2pRdWVyeScsICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTUwJywgXCJpbWFnZVwiOidqcXVlcnktMS5zdmcnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxudmFyIHFiZXJ0X3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbICAge1wibmFtZVwiOiAnTWF5YScsICAgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMTAwJywgXCJpbWFnZVwiOidtYXlhLnBuZyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdQaG90b3Nob3AnLCAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0yNScsIFwiaW1hZ2VcIjoncGhvdG9zaG9wLWNjLnN2Zyd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gdmFyIGJyZWF0aGxlc3NfbWVkaWEgPSBuZXcgbWVkaWEuTWVkaWEoJ21lZGlhLTAnLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2NhdC5qcGdcIl0sIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9jYXQuanBnXCJdLCAnPGlmcmFtZSBzcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vMTk4MTQ5Nzk1XCIgd2lkdGg9XCI0NzFcIiBoZWlnaHQ9XCIzMzVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKTtcclxuICAgXHJcbnZhciBtID0gW11cclxuXHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfcGxheS5qcGdcIiwgXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX2dhbWVwbGF5XzIuanBnXCIsXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX2dhbWVwbGF5LmpwZ1wiLFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19jb250cm9scy5qcGdcIl0sIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfcGxheS5qcGdcIiwgXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX2dhbWVwbGF5XzIuanBnXCIsXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX2dhbWVwbGF5LmpwZ1wiLFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19jb250cm9scy5qcGdcIl0pKTtcclxuXHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFtcIi4vcG9ydGZvbGlvL3FiZXJ0X3BsYXkuanBnXCIsXCIuL3BvcnRmb2xpby9xYmVydF9wbGF5ZXIuanBnXCIsXCIuL3BvcnRmb2xpby9xYmVydF9zbmFrZS5qcGdcIl0sIFtcIi4vcG9ydGZvbGlvL3FiZXJ0X3BsYXllci5qcGdcIixcIi4vcG9ydGZvbGlvL3FiZXJ0X3NuYWtlLmpwZ1wiXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzE5ODE0OTc5NVwiIHdpZHRoPVwiNDcxXCIgaGVpZ2h0PVwiMzM1XCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+JykpO1xyXG5cclxubS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgW1wiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzEucG5nXCIsXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMy5wbmdcIixcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8yLnBuZ1wiXSwgW1wiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzEucG5nXCIsXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMy5wbmdcIixcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8yLnBuZ1wiXSkpO1xyXG5cclxuXHJcbnZhciBwb3J0Zm9saW8gPSBuZXcgUG9ydGZvbGlvKCdwb3J0Zm9saW8nLCBbXHJcbiAgICB7dGl0bGU6ICdCcmVhdGhsZXNzJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZycsIGRlc2M6XCJUaGUgU3BhY2UgUGlyYXRlLCBBcmlhLCBpcyBvbiBhIG1pc3Npb24gdG8gbG9vdCBhIG1pbmVyYWwgY2FyZ28gc2hpcC4gSG93ZXZlciwgdXBvbiBsYW5kaW5nIG9uIHRoZSBjYXJnbyBzaGlwLCBBcmlhJ3MgaGVsbWV0IGNyYWNrcyBjYXVzaW5nIGhlciB0byBzbG93bHkgbG9zZSBveHlnZW4uIEl0J3Mgbm93IGEgcmFjZSBhZ2FpbnN0IHRpbWUgdG8gY29sbGVjdCBhbGwgdGhlIGdlbXMgYmVmb3JlIGhlciBveHlnZW4gcnVucyBvdXQhXCIsIHN0YWNrOmJyZWF0aGxlc3Nfc3RhY2ssIG1lZGlhOiBtWzBdLCB0eXBlOiAnSFRNTDUgR2FtZSd9LFxyXG4gICAge3RpdGxlOiAnUSpCZXJ0JywgdGl0bGVfaW1hZ2U6IFwiLi9wb3J0Zm9saW8vcWJlcnRfcGxheS5qcGdcIiwgZGVzYzonVGhpcyBpcyBteSBCb3VuY2luZyBCYWxsIEFzc2lnbm1lbnQgZm9yIEFuaW1hdGlvbiAxIGF0IERyZXhlbCBVbml2ZXJzaXR5LiBXaGVuIHBpY2tpbmcgYSBnYW1lIHRoYXQgbWl4ZXMgbXkgbG92ZSBvZiByZXRybyB2aWRlbyBnYW1lcyBhbmQgYm91bmNpbmcgYmFsbHMsIFEqQmVydCB3YXMgYSBuby1icmFpbmVyLiBFdmVyeXRoaW5nIGlzIGluZGl2aWR1YWxseSBtb2RlbGxlZCwgdGV4dHVyZWQsIGFuZCBhbmltYXRlZCBieSBtZS4gTWFkZSBpbiBNYXlhLCBhbmQgcmVuZGVyZWQgaW4gVi1SYXkuJywgc3RhY2s6cWJlcnRfc3RhY2ssIG1lZGlhOiBtWzFdLCB0eXBlOiAnQW5pbWF0aW9uJ30sXHJcbiAgICB7dGl0bGU6ICdCZWRyb29tJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9jZ2lfZmluYWxfMS5wbmcnLCBkZXNjOidhc2RmJywgc3RhY2s6cWJlcnRfc3RhY2ssIG1lZGlhOiBtWzJdLCB0eXBlOiAnM0QgUmVuZGVyJ31dKTtcclxuXHJcblxyXG5cclxudmFyIHdlbGNvbWVfYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWxjb21lLWJ1dHRvbicpO1xyXG53ZWxjb21lX2Iub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcbiAgICBqdW1wKCcjcG9ydGZvbGlvJyx7XHJcbiAgICAgICAgZHVyYXRpb246MTAwMCxcclxuICAgICAgICBvZmZzZXQ6MCxcclxuICAgICAgICBjYWxsYmFjazogdW5kZWZpbmVkLFxyXG4gICAgICAgIGVhc2luZzoganVtcC5lYXNlSW5PdXRRdWFkLFxyXG4gICAgICAgIGFsbHk6IGZhbHNlXHJcbiAgICB9KVxyXG59XHJcblxyXG5cclxuLyoqIFxyXG4gKiBwb3J0Zm9saW8gd2Vic2l0ZVxyXG4gKiBicmVhdGhsZXNzXHJcbiAqIHdlYXRoZXIgd2Vic2l0ZVxyXG4gKiBxYmVydCBhbmltYXRpb25cclxuICogY2dpIDIgZmluYWw/PyBcclxuICogXHJcbiovXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vIHZhciBtZWRpYSA9IG5ldyBNZWRpYSgnbWVkaWEtMCcsIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiXSwgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2NhdC5qcGdcIiwgXCIuL3BvcnRmb2xpby9jYXQuanBnXCJdKTtcclxuXHJcbiIsImV4cG9ydCAqIGZyb20gXCIuL21lZGlhXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWVkaWFJdGVte1xyXG4gICAgbWVkaWE6IE1lZGlhO1xyXG4gICAgaHRtbDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBvcmRlcjogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IobWVkaWE6IE1lZGlhLCBodG1sOkhUTUxEaXZFbGVtZW50LCBvcmRlcjogbnVtYmVyKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ubWVkaWEgPSBtZWRpYTtcclxuICAgICAgICB2bS5odG1sID0gaHRtbDtcclxuICAgICAgICB2bS5vcmRlciA9IG9yZGVyO1xyXG4gICAgICAgIHZtLmh0bWwub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhLmxvYWRNZWRpYSh2bS5vcmRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTWVkaWEge1xyXG4gICAgaWQ6c3RyaW5nXHJcbiAgICBlbGVtZW50czogYW55W107XHJcbiAgICB0aHVtYm5haWxzOiBIVE1MSW1hZ2VFbGVtZW50W107XHJcbiAgICBtZWRpYV9pdGVtczogTWVkaWFJdGVtW107XHJcbiAgICBzZWxlY3RlZDogbnVtYmVyO1xyXG4gICAgdmltZW86c3RyaW5nO1xyXG5cclxuICAgIHJvdzpIVE1MRGl2RWxlbWVudDtcclxuICAgIG92ZXJsYXk6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb2xtZDpIVE1MRGl2RWxlbWVudDtcclxuICAgIFxyXG4gICAgbWVkaWFfc2VsZWN0ZWQ6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCB0aHVtYm5haWxzOiBzdHJpbmdbXSwgZmlsZXM/OiBzdHJpbmdbXSwgdmltZW8/OiBzdHJpbmcpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5pZCA9IGlkO1xyXG4gICAgICAgIHZtLnNlbGVjdGVkID0gMDtcclxuICAgICAgICB2bS5lbGVtZW50cyA9IFtdO1xyXG4gICAgICAgIHZtLm1lZGlhX2l0ZW1zID0gW107XHJcbiAgICAgICAgdm0udGh1bWJuYWlscyA9IFtdO1xyXG5cclxuICAgICAgICB2bS52aW1lbyA9IHZpbWVvO1xyXG4gICAgICAgIGlmKHZpbWVvKXtcclxuICAgICAgICAgICAgICAgIHZhciBmcmFnID0gdm0uY3JlYXRlRnJhZ21lbnQodmltZW8pO1xyXG4gICAgICAgICAgICAgICAgdm0uZWxlbWVudHMucHVzaChmcmFnKTtcclxuICAgICAgICAgICAgICAgIC8vIHZtLmVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQoJ2Ryb3BzaGFkb3cnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBsZW5ndGggPSB2bS5lbGVtZW50cy5sZW5ndGg7XHJcbiAgICAgICAgaWYoZmlsZXMpe1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJylcclxuICAgICAgICAgICAgICAgIGltYWdlLnNyYyA9IGZpbGVzW2ldO1xyXG4gICAgICAgICAgICAgICAgaW1hZ2UuY2xhc3NMaXN0LmFkZCgnZHJvcHNoYWRvdycpO1xyXG4gICAgICAgICAgICAgICAgdm0uZWxlbWVudHMucHVzaChpbWFnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZtLm1lZGlhX3NlbGVjdGVkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQuaWQgPSAnbWVkaWEtc2VsZWN0ZWQnO1xyXG5cclxuICAgICAgICB2bS5vdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdvdmVybGF5LW1lZGlhJyk7XHJcblxyXG4gICAgICAgIHZtLm1lZGlhX3NlbGVjdGVkLmFwcGVuZENoaWxkKHZtLm92ZXJsYXkpO1xyXG5cclxuICAgICAgICB2bS5yb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5yb3cuY2xhc3NMaXN0LmFkZCgncm93JywnanVzdGlmeS1jZW50ZXInLCdtZWRpYS1jb250YWluZXInKTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8IHZtLmVsZW1lbnRzLmxlbmd0aDsgaisrKXtcclxuICAgICAgICAgICAgdm0uY29sbWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgdm0uY29sbWQuY2xhc3NMaXN0LmFkZCgnY29sLW1kJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaHRtbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgICAgIGh0bWwuY2xhc3NMaXN0LmFkZCgnbWVkaWEtaXRlbScpO1xyXG4gICAgICAgICAgICB2YXIgbWVkaWFfaXRlbSA9IG5ldyBNZWRpYUl0ZW0odm0saHRtbCxqKTtcclxuICAgICAgICAgICAgdm0ubWVkaWFfaXRlbXMucHVzaChtZWRpYV9pdGVtKTtcclxuXHJcbiAgICAgICAgICAgIHZtLnRodW1ibmFpbHMucHVzaChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKSk7XHJcbiAgICAgICAgICAgIHZtLnRodW1ibmFpbHNbal0uY2xhc3NMaXN0LmFkZCgnZHJvcHNoYWRvdycpO1xyXG4gICAgICAgICAgICB2bS50aHVtYm5haWxzW2pdLnNyYyA9IHRodW1ibmFpbHNbal07XHJcblxyXG4gICAgICAgICAgICB2bS5jb2xtZC5hcHBlbmRDaGlsZCh2bS5tZWRpYV9pdGVtc1tqXS5odG1sKTtcclxuICAgICAgICAgICAgdm0uY29sbWQuYXBwZW5kQ2hpbGQodm0udGh1bWJuYWlsc1tqXSk7XHJcbiAgICAgICAgICAgIHZtLnJvdy5hcHBlbmRDaGlsZCh2bS5jb2xtZCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAjbWVkaWEtc2VsZWN0ZWRcclxuICAgICAgICAvLyAgICAgICAgICAgICAgLm92ZXJsYXlcclxuICAgICAgICAvLyAgICAgICAgICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpLmRyb3BzaGFkb3dcclxuICAgICAgICAvLyAgICAgICAgICAucm93Lmp1c3RpZnktY2VudGVyLm1lZGlhLWNvbnRhaW5lclxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAuY29sLW1kXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAubWVkaWEtaXRlbVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpLmRyb3BzaGFkb3dcclxuICAgICAgICAvLyAgICAgICAgICAgICAgLmNvbC1tZFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgLm1lZGlhLWl0ZW1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKS5kcm9wc2hhZG93XHJcblxyXG5cclxuICAgICAgICB2bS5tZWRpYV9pdGVtc1t2bS5zZWxlY3RlZF0uaHRtbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgIC8vIHZtLmVsZW1lbnRzLnB1c2godm0uZWxlbWVudHNbMF0pO1xyXG4gICAgICAgIC8vIHZtLmVsZW1lbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgLy8gdm0uc2V0SWQoaWQpO1xyXG4gICAgICAgIC8vIHZtLmxvYWRNZWRpYSgwKTtcclxuXHJcbiAgICB9XHJcbiAgICBjcmVhdGVGcmFnbWVudChzdHI6IHN0cmluZywgd2lkdGg/OiBudW1iZXIsIGhlaWdodD86IG51bWJlciApIHtcclxuICAgICAgICB2YXIgbmV3c3RyID0gc3RyO1xyXG4gICAgICAgIGlmKHdpZHRoKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIG5ld3N0ciA9IHN0ci5yZXBsYWNlKCd3aWR0aD1cIlxcZCtcIiBoZWlnaHQ9XCJcXGQrXCInLCAnd2lkdGg9XCInK3dpZHRoKydcIiBoZWlnaHQ9XCInK2hlaWdodCsnXCInKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuXHJcbiAgICAgICAgdmFyIGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBlbGVtLmlubmVySFRNTCA9IHN0cjtcclxuXHJcbiAgICAgICAgd2hpbGUgKGVsZW0uY2hpbGROb2Rlc1swXSkge1xyXG4gICAgICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGVsZW0uY2hpbGROb2Rlc1swXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmcmFnO1xyXG4gICAgfVxyXG5cclxuICAgIHNldElkKGlkOiBzdHJpbmcpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2YXIgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIHdoaWxlKHBhcmVudC5maXJzdENoaWxkKXtcclxuICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHBhcmVudC5maXJzdENoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHZtLm1lZGlhX3NlbGVjdGVkKTtcclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodm0ucm93KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkTWVkaWEodGh1bWJfbnVtOm51bWJlcil7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgLy8gdm0ubWVkaWFfc2VsZWN0ZWQucmVtb3ZlQ2hpbGQodm0ubWVkaWFfc2VsZWN0ZWQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgdm0ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdjbG9zZS1tZWRpYScpO1xyXG5cclxuICAgICAgICB2bS5vdmVybGF5LnN0eWxlLndpZHRoID0gKHZtLm1lZGlhX3NlbGVjdGVkLmNsaWVudFdpZHRoKzEyKSsncHgnO1xyXG4gICAgICAgIHZtLm92ZXJsYXkuc3R5bGUuaGVpZ2h0ID0gKHZtLm1lZGlhX3NlbGVjdGVkLmNsaWVudEhlaWdodCs4KSsncHgnO1xyXG5cclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdm0ubWVkaWFfaXRlbXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICB2bS5tZWRpYV9pdGVtc1tpXS5odG1sLnN0eWxlLndpZHRoID0gdm0uY29sbWQuY2xpZW50V2lkdGgrJ3B4JztcclxuICAgICAgICAgICAgdm0ubWVkaWFfaXRlbXNbaV0uaHRtbC5zdHlsZS5oZWlnaHQgPSB2bS5jb2xtZC5jbGllbnRIZWlnaHQrJ3B4JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHZtLnZpbWVvICYmIHRodW1iX251bSA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgICB2bS5lbGVtZW50cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZyYWcgPSB2bS5jcmVhdGVGcmFnbWVudCh2bS52aW1lbywgdm0ubWVkaWFfc2VsZWN0ZWQuY2xpZW50V2lkdGgsIHZtLm1lZGlhX3NlbGVjdGVkLmNsaWVudEhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB2bS5lbGVtZW50cy51bnNoaWZ0KGZyYWcpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZtLm92ZXJsYXkuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgICAgICAgICAgICAgLy8gdm0uZWxlbWVudHNbaV0uY2xhc3NMaXN0LmFkZCgnZHJvcHNoYWRvdycpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZtLm92ZXJsYXkuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvKmJ1dHRvbiB0cmFuc2l0aW9uKi9cclxuICAgICAgICB2bS5tZWRpYV9pdGVtc1t2bS5zZWxlY3RlZF0uaHRtbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgIHZtLnNlbGVjdGVkID0gdGh1bWJfbnVtO1xyXG4gICAgICAgIHZtLm1lZGlhX2l0ZW1zW3ZtLnNlbGVjdGVkXS5odG1sLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XHJcblxyXG4gICAgICAgIC8qcGljdHVyZSB0cmFuc2l0aW9uKi9cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgICAgICAvLyBpZih2bS52aW1lbyAmJiB2bS5zZWxlY3RlZCA9PT0gMCl7XHJcblxyXG4gICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICBpZiAodm0ubWVkaWFfc2VsZWN0ZWQuY2hpbGRyZW4ubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tZWRpYV9zZWxlY3RlZC5yZW1vdmVDaGlsZCh2bS5tZWRpYV9zZWxlY3RlZC5sYXN0Q2hpbGQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2bS5tZWRpYV9zZWxlY3RlZC5hcHBlbmRDaGlsZCh2bS5lbGVtZW50c1t2bS5zZWxlY3RlZF0pO1xyXG4gICAgICAgICAgICB2bS5vdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2Nsb3NlLW1lZGlhJyk7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhX2l0ZW1zW3ZtLnNlbGVjdGVkXS5odG1sLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgfSwgNjAwKTsgICBcclxuICAgIH1cclxufSIsImV4cG9ydCAqIGZyb20gXCIuL3NraWxsX2JhZGdlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2tpbGwge1xyXG4gIGZsZXhfaXRlbTogSFRNTERpdkVsZW1lbnQ7XHJcbiAgc3ZnOiBTVkdTVkdFbGVtZW50O1xyXG4gIHN2Z19jaXJjbGU6IFNWR0NpcmNsZUVsZW1lbnQ7XHJcbiAgc2NhbGVfYm94OiBIVE1MRGl2RWxlbWVudDtcclxuICBpbWFnZTogSFRNTEltYWdlRWxlbWVudDtcclxuICB0ZXh0OiBIVE1MRGl2RWxlbWVudDtcclxuICBmbGV4X2dyaWRfaWQ6IHN0cmluZztcclxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGNsYXNzcGVyY2VudDogc3RyaW5nLCBpbWFnZTogc3RyaW5nLCBmbGV4X2dyaWRfaWQ6IHN0cmluZykge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgIHZtLmZsZXhfZ3JpZF9pZCA9IGZsZXhfZ3JpZF9pZDtcclxuXHJcbiAgICB2bS5mbGV4X2l0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHZtLmZsZXhfaXRlbS5jbGFzc05hbWUgKz0gJ2ZsZXgtaXRlbSc7XHJcblxyXG4gICAgdm0uc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJzdmdcIilcclxuICAgIHZtLnN2Zy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NwZXJjZW50KVxyXG4gICAgdm0uc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnODQnKTtcclxuICAgIHZtLnN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICc4NCcpO1xyXG5cclxuICAgIHZtLnN2Z19jaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAnY2lyY2xlJyk7XHJcbiAgICB2bS5zdmdfY2lyY2xlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdjbGFzcycsICdvdXRlcicpO1xyXG4gICAgdm0uc3ZnX2NpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCBcImN4XCIsICctNDInKTtcclxuICAgIHZtLnN2Z19jaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgXCJjeVwiLCAnNDInKTtcclxuICAgIHZtLnN2Z19jaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgXCJyXCIsICczNycpO1xyXG4gICAgdm0uc3ZnX2NpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCBcInRyYW5zZm9ybVwiLCBcInJvdGF0ZSgtOTAsIDAsIDApXCIpO1xyXG5cclxuICAgIHZtLnNjYWxlX2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgaWYgKG5hbWUgPT09IFwiVHlwZSBTY3JpcHRcIiB8fCBuYW1lID09PSBcIkJvb3RzdHJhcFwiIHx8IG5hbWUgPT09IFwiRDMuanNcIiB8fCBuYW1lID09PSBcIlBob3Rvc2hvcFwiIHx8IG5hbWUgPT09IFwiSWxsdXN0cmF0b3JcIiB8fCBuYW1lID09PSBcIkFmdGVyIEVmZmVjdHNcIiB8fCBuYW1lID09PSBcIk1heWFcIiB8fCBuYW1lID09PSBcIk11ZGJveFwiKSB7XHJcbiAgICAgIHZtLnNjYWxlX2JveC5jbGFzc05hbWUgKz0gJ3NjYWxlLWJveC1zcXVhcmUnO1xyXG4gICAgfSBlbHNlIGlmIChuYW1lID09PSBcIlVuaXR5XCIgfHwgbmFtZSA9PT0gXCJQaGFzZXIuanNcIiB8fCBuYW1lID09PSBcIkQzLmpzXCIgfHwgbmFtZSA9PT0gXCJTQ1NTXCIgfHwgbmFtZSA9PT0gXCJKYXZhXCIgfHwgbmFtZSA9PT0gXCJQeXRob25cIikge1xyXG4gICAgICB2bS5zY2FsZV9ib3guY2xhc3NOYW1lICs9ICdzY2FsZS1ib3gtbWlkJztcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2bS5zY2FsZV9ib3guY2xhc3NOYW1lICs9ICdzY2FsZS1ib3gnO1xyXG4gICAgfVxyXG5cclxuICAgIHZtLmltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICB2bS5pbWFnZS5zcmMgPSBpbWFnZTtcclxuXHJcbiAgICB2bS50ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB2bS50ZXh0LmNsYXNzTmFtZSArPSAndGV4dCc7XHJcbiAgICB2bS50ZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5hbWUpKTtcclxuXHJcbiAgICAvLyAuZmxleC1pdGVtXHJcbiAgICAvLyAgICAgICBzdmcuY2lyY2xlLTc1KHdpZHRoPSc4NCcsIGhlaWdodD0nODQnKVxyXG4gICAgLy8gICAgICAgICBjaXJjbGUub3V0ZXIoY3g9Jy00MicsIGN5PSc0MicsIHI9JzM3JyB0cmFuc2Zvcm09XCJyb3RhdGUoLTkwLCAwLCAwKVwiKSBcclxuICAgIC8vICAgICAgIC5zY2FsZS1ib3hcclxuICAgIC8vICAgICAgICAgaW1nKGlkPVwiZm91clwiKVxyXG4gICAgLy8gICAgICAgICAudGV4dCBhYmNcclxuICAgIHZtLmZsZXhfaXRlbS5hcHBlbmRDaGlsZCh2bS5zdmcpO1xyXG4gICAgdm0uc3ZnLmFwcGVuZENoaWxkKHZtLnN2Z19jaXJjbGUpO1xyXG4gICAgdm0uZmxleF9pdGVtLmFwcGVuZENoaWxkKHZtLnNjYWxlX2JveCk7XHJcbiAgICB2bS5zY2FsZV9ib3guYXBwZW5kQ2hpbGQodm0uaW1hZ2UpO1xyXG4gICAgdm0uZmxleF9pdGVtLmFwcGVuZENoaWxkKHZtLnRleHQpO1xyXG4gIH1cclxuICByZXNldElkKGlkOiBzdHJpbmcpe1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdm0uZmxleF9ncmlkX2lkID0gaWQ7XHJcbiAgfVxyXG5cclxuICBhcHBlbmQoKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2YXIgZmxleF9ncmlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodm0uZmxleF9ncmlkX2lkKTtcclxuICAgIGZsZXhfZ3JpZC5hcHBlbmRDaGlsZCh2bS5mbGV4X2l0ZW0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU2tpbGxJbmZvIHtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgY2xhc3M6IHN0cmluZztcclxuICBpbWFnZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sbGVjdGlvbiB7XHJcbiAgaWQ6IHN0cmluZztcclxuICBpbWFnZXM6IElTa2lsbEluZm9bXTtcclxuICBwYXRoOiBzdHJpbmc7XHJcbiAgc2tpbGxzOiBTa2lsbFtdO1xyXG4gIGZsZXhfZ3JpZF9pZDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcsIGZsZXhfZ3JpZF9pZDogc3RyaW5nLCBpbWFnZXM6IElTa2lsbEluZm9bXSwgaWQ/OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIFxyXG4gICAgdm0uaW1hZ2VzID0gaW1hZ2VzO1xyXG4gICAgdm0ucGF0aCA9IHBhdGg7XHJcbiAgICB2bS5mbGV4X2dyaWRfaWQgPSBmbGV4X2dyaWRfaWQ7XHJcblxyXG4gICAgdm0uc2tpbGxzID0gW107XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbWFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdm0uc2tpbGxzLnB1c2gobmV3IFNraWxsKGltYWdlc1tpXS5uYW1lLCBpbWFnZXNbaV0uY2xhc3MsIHZtLnBhdGggKyBpbWFnZXNbaV0uaW1hZ2UsIHZtLmZsZXhfZ3JpZF9pZCkpO1xyXG4gICAgfVxyXG4gICAgaWYoaWQpe1xyXG4gICAgICB2bS5pZCA9IGlkO1xyXG4gICAgICB2YXIgZWxlbWVudCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh2bS5pZCk7XHJcbiAgICAgIGVsZW1lbnQub25tb3VzZXVwID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2bS5sb2FkKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyByZXNldElkcyhpZDogc3RyaW5nKXtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZtLmZsZXhfZ3JpZF9pZCA9IGlkO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5za2lsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdm0uc2tpbGxzW2ldLnJlc2V0SWQodm0uZmxleF9ncmlkX2lkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBsb2FkKCkgeyAvL3NldHMgc3JjJ3MgdG8gdGhlIGRvbS4gdGhlbiBvbmNlIGV2ZXJ5dGhpbmcgaXMgbG9hZGVkLCBpdCBhZGRzIGNsYXNzIGFjdGl2ZSB0byBtYWtlIHRoZW0gYXBwZWFyIHZpYSBjc3NcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZhciBmbGV4X2dyaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh2bS5mbGV4X2dyaWRfaWQpO1xyXG4gICAgd2hpbGUgKGZsZXhfZ3JpZC5maXJzdENoaWxkKSB7XHJcbiAgICAgIGZsZXhfZ3JpZC5yZW1vdmVDaGlsZChmbGV4X2dyaWQuZmlyc3RDaGlsZCk7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLnNraWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2bS5za2lsbHNbaV0uYXBwZW5kKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIHB1YmxpYyBjbG9zZSgpe1xyXG4gIC8vICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gIC8vICAgdmFyIGZsZXhfZ3JpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHZtLmZsZXhfZ3JpZF9pZCk7XHJcbiAgLy8gICB3aGlsZSAoZmxleF9ncmlkLmZpcnN0Q2hpbGQpIHtcclxuICAvLyAgICAgZmxleF9ncmlkLnJlbW92ZUNoaWxkKGZsZXhfZ3JpZC5maXJzdENoaWxkKTtcclxuICAvLyAgIH1cclxuICAvLyB9XHJcbn1cclxuIl19