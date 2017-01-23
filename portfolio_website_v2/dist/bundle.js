(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Jump = factory());
}(this, (function () { 'use strict';

// Robert Penner's easeInOutQuad

// find the rest of his easing functions here: http://robertpenner.com/easing/
// find them exported for ES6 consumption here: https://github.com/jaxgeller/ez.js

var easeInOutQuad = function easeInOutQuad(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var jumper = function jumper() {
  // private variable cache
  // no variables are created during a jump, preventing memory leaks

  var element = void 0; // element to scroll to                   (node)

  var start = void 0; // where scroll starts                    (px)
  var stop = void 0; // where scroll stops                     (px)

  var offset = void 0; // adjustment from the stop position      (px)
  var easing = void 0; // easing function                        (function)
  var a11y = void 0; // accessibility support flag             (boolean)

  var distance = void 0; // distance of scroll                     (px)
  var duration = void 0; // scroll duration                        (ms)

  var timeStart = void 0; // time scroll started                    (ms)
  var timeElapsed = void 0; // time spent scrolling thus far          (ms)

  var next = void 0; // next scroll position                   (px)

  var callback = void 0; // to call when done scrolling            (function)

  // scroll position helper

  function location() {
    return window.scrollY || window.pageYOffset;
  }

  // element offset helper

  function top(element) {
    return element.getBoundingClientRect().top + start;
  }

  // rAF loop helper

  function loop(timeCurrent) {
    // store time scroll started, if not started already
    if (!timeStart) {
      timeStart = timeCurrent;
    }

    // determine time spent scrolling so far
    timeElapsed = timeCurrent - timeStart;

    // calculate next scroll position
    next = easing(timeElapsed, start, distance, duration);

    // scroll to it
    window.scrollTo(0, next);

    // check progress
    timeElapsed < duration ? window.requestAnimationFrame(loop) // continue scroll loop
    : done(); // scrolling is done
  }

  // scroll finished helper

  function done() {
    // account for rAF time rounding inaccuracies
    window.scrollTo(0, start + distance);

    // if scrolling to an element, and accessibility is enabled
    if (element && a11y) {
      // add tabindex indicating programmatic focus
      element.setAttribute('tabindex', '-1');

      // focus the element
      element.focus();
    }

    // if it exists, fire the callback
    if (typeof callback === 'function') {
      callback();
    }

    // reset time for next jump
    timeStart = false;
  }

  // API

  function jump(target) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // resolve options, or use defaults
    duration = options.duration || 1000;
    offset = options.offset || 0;
    callback = options.callback; // "undefined" is a suitable default, and won't be called
    easing = options.easing || easeInOutQuad;
    a11y = options.a11y || false;

    // cache starting position
    start = location();

    // resolve target
    switch (typeof target === 'undefined' ? 'undefined' : _typeof(target)) {
      // scroll from current position
      case 'number':
        element = undefined; // no element to scroll to
        a11y = false; // make sure accessibility is off
        stop = start + target;
        break;

      // scroll to element (node)
      // bounding rect is relative to the viewport
      case 'object':
        element = target;
        stop = top(element);
        break;

      // scroll to element (selector)
      // bounding rect is relative to the viewport
      case 'string':
        element = document.querySelector(target);
        stop = top(element);
        break;
    }

    // resolve scroll distance, accounting for offset
    distance = stop - start + offset;

    // resolve duration
    switch (_typeof(options.duration)) {
      // number in ms
      case 'number':
        duration = options.duration;
        break;

      // function passed the distance of the scroll
      case 'function':
        duration = options.duration(distance);
        break;
    }

    // start the loop
    window.requestAnimationFrame(loop);
  }

  // expose only the jump method
  return jump;
};

// export singleton

var singleton = jumper();

return singleton;

})));

},{}],2:[function(require,module,exports){
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
        vm.loaded = false;
        vm.image.onload = function () {
            vm.loaded = true;
            vm.size(vm.w, vm.h);
            vm.draw();
        };
    }
    Img.prototype.size = function (w, h) {
        var vm = this;
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
        console.log(Math.round(vm.screenWidth) + ' ' + Math.round(vm.screenHeight));
    };
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
        // vm.initEvents();
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
        if (vm.img) {
            vm.img.size(vm.w, vm.h);
            vm.img.draw();
        }
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
        var moveOffsetX = -vm.img.anchorX + (moveRatioX * vm.img.anchorX);
        var moveRatioY = (e.clientY / vm.img.screenHeight); //range from [0, 1]: 0 being left, 1 being right
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
    return App;
}());
exports.App = App;
},{"./image_canvas":2}],3:[function(require,module,exports){
"use strict";
var jump = require("jump.js");
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
    function PortfolioItem(portfolio, item_num, title, title_image, desc, stack, media, type, url) {
        var vm = this;
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
            console.log(vm.media);
            different_wrapper = vm.portfolio.close(vm.item_num);
            vm.open = vm.target_wrapper.transitionWrapper(different_wrapper, vm.open, vm.title, vm.desc, vm.stack, vm.media, vm.url);
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
            vm.items.push(new PortfolioItem(vm, i, json_objs[i].title, json_objs[i].title_image, json_objs[i].desc, json_objs[i].stack, json_objs[i].media, json_objs[i].type, json_objs[i].url));
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
        row.classList.add('row', 'nomar');
        vm.title_element = document.createElement('div');
        vm.title_element.classList.add('col-xs-12', 'desc-text', 'pad-spacing');
        vm.title_element_text = document.createTextNode('');
        vm.title_element.appendChild(vm.title_element_text);
        var col6 = document.createElement('div');
        col6.classList.add('col-xs-12', 'col-md-6', 'col-lg-7', 'row', 'nomar', 'nopad');
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
        stack_title.classList.add('header-text', 'pad-spacing');
        stack_title.appendChild(document.createTextNode('Stack'));
        vm.flex_grid = document.createElement('div');
        vm.flex_grid.id = 'pflex-grid-' + row_num;
        vm.flex_grid.classList.add('row', 'portfolio-flex', 'col-xs-12');
        vm.demo = document.createElement('div');
        vm.demo.classList.add('col-xs-12', 'col-md-12', 'col-lg-5');
        // vm.demo.appendChild(document.createTextNode('Live Demo'));
        var demo_title = document.createElement('div');
        demo_title.classList.add('header-text', 'pad-spacing');
        demo_title.appendChild(document.createTextNode('Relevant Links'));
        vm.link = document.createElement('div');
        vm.link.classList.add('github-button', 'row', 'nomar');
        vm.link_text = document.createElement('div');
        vm.link_text.classList.add('text');
        vm.link_text.appendChild(document.createTextNode('Live Link'));
        vm.col5 = document.createElement('div');
        vm.col5.classList.add('col-xs-12', 'col-md-5');
        /* GONNA HAVE TO ADD MEDIA DYNAMICALLY */
        vm.html.appendChild(row);
        row.appendChild(vm.title_element);
        row.appendChild(vm.col6);
        row.appendChild(col6);
        col6.appendChild(col12);
        col12.appendChild(vm.description);
        col12.appendChild(desc);
        col6.appendChild(vm.stack);
        vm.stack.appendChild(stack_title);
        vm.stack.appendChild(vm.flex_grid);
        col6.appendChild(vm.demo);
        vm.demo.appendChild(demo_title);
        vm.demo.appendChild(vm.link);
        vm.link.appendChild(vm.link_text);
        vm.link.onclick = function () {
            console.log(vm.url);
            location.href = vm.url;
        };
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
    Wrapper.prototype.changeWrapper = function (open, title, desc, stack, media, url) {
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
                vm.url = url;
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
            vm.url = url;
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
            vm.url = url;
            // vm.closeData();
            vm.html.classList.remove('open');
            return true;
        }
    };
    Wrapper.prototype.transitionWrapper = function (different_wrapper, open, title, desc, stack, media, url) {
        var vm = this;
        var return_value;
        if (different_wrapper) {
            setTimeout(function () {
                return_value = vm.changeWrapper(open, title, desc, stack, media, url);
                console.log('timeout: ' + return_value);
            }, timeout);
        }
        else if (open === undefined) {
            open = true;
            return_value = vm.changeWrapper(open, title, desc, stack, media, url);
        }
        else {
            return_value = vm.changeWrapper(open, title, desc, stack, media, url);
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
var weather_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Angular JS', "class": 'circle-100', "image": 'angular-icon.svg' },
]);
// var breathless_media = new media.Media('media-0', ["./portfolio/breathless.jpg","./portfolio/breathless.jpg","./portfolio/cat.jpg"], ["./portfolio/breathless.jpg","./portfolio/cat.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
var m = [];
m.push(new media.Media('', ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"], ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"]));
m.push(new media.Media('', ["./portfolio/qbert_play.jpg", "./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], ["./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"], ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"]));
m.push(new media.Media('', ['./portfolio/mean_forecast_1.jpg', './portfolio/mean_forecast_2.jpg'], ['./portfolio/mean_forecast_1.jpg', './portfolio/mean_forecast_2.jpg']));
var portfolio = new Portfolio('portfolio', [
    { title: 'Breathless', title_image: './portfolio/breathless.jpg', desc: "The Space Pirate, Aria, is on a mission to loot a mineral cargo ship. However, upon landing on the cargo ship, Aria's helmet cracks causing her to slowly lose oxygen. It's now a race against time to collect all the gems before her oxygen runs out!", stack: breathless_stack, media: m[0], type: 'HTML5 Game', url: '/breathless' },
    { title: 'Mean Forecast', title_image: './portfolio/mean_forecast_1.jpg', desc: 'A small web app that calculates the average of 3 weather API\'s: Wunderground, Forecast.io, and World Weather Online. The webapp itself has many subtleties that are affected by weather data. For example, the video  resembles the current weather. Also each graph is color coated by a gradient based on the weather data.', stack: weather_stack, media: m[3], type: 'Website', url: '/meanforecast' },
    { title: 'Q*Bert', title_image: "./portfolio/qbert_play.jpg", desc: 'This is my Bouncing Ball Assignment for Animation 1 at Drexel University. When picking a game that mixes my love of retro video games and bouncing balls, Q*Bert was a no-brainer. Everything is individually modelled, textured, and animated by me. Made in Maya, and rendered in V-Ray.', stack: qbert_stack, media: m[1], type: 'Animation', url: 'https://vimeo.com/198149795' },
    { title: 'Bedroom', title_image: './portfolio/cgi_final_1.png', desc: 'This is my final for CGI 2 at Drexel University. The assignment was to recreate any type of room, so I chose a little boy\'s room. We were tasked with creating at least one complex object, so I decided to go with a train set.', stack: qbert_stack, media: m[2], type: '3D Render', url: '' }
]);
var welcome_b = document.getElementById('welcome-button');
welcome_b.onclick = function () {
    jump('#portfolio', {
        duration: 1000,
        offset: 0,
        callback: undefined,
        easing: jump.easeInOutQuad,
        ally: false
    });
};
/**
 * portfolio website
 * breathless
 * weather website
 * qbert animation
 * cgi 2 final??
 *
*/
window.onresize = function (e) {
    app.sizeCanvas();
    portfolio.appendAll();
};
// var media = new Media('media-0', ["./portfolio/breathless.jpg","./portfolio/breathless.jpg","./portfolio/cat.jpg"], ["./portfolio/breathless.jpg","./portfolio/cat.jpg", "./portfolio/cat.jpg"]);
},{"./image_canvas":2,"./media":4,"./skill_badge":5,"jump.js":1}],4:[function(require,module,exports){
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
            vm.colmd.classList.add('col-xs');
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
    Media.prototype.size = function () {
        var vm = this;
        vm.overlay.style.width = (vm.media_selected.clientWidth + 12) + 'px';
        vm.overlay.style.height = (vm.media_selected.clientHeight + 8) + 'px';
    };
    Media.prototype.loadMedia = function (thumb_num) {
        var vm = this;
        // vm.media_selected.removeChild(vm.media_selected.firstChild);
        vm.overlay.classList.add('close-media');
        vm.size();
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
},{"./media":4}],5:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvanVtcC5qcy9kaXN0L2p1bXAuanMiLCJzcmMvaW1hZ2VfY2FudmFzLnRzIiwic3JjL21haW4udHMiLCJzcmMvbWVkaWEudHMiLCJzcmMvc2tpbGxfYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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LENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3pELE9BQU8sU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzVCLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFDRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDMUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN4QixDQUFDO0lBQ0gsQ0FBQztJQVFILGlCQUFDO0FBQUQsQ0FyREEsQUFxREMsSUFBQTtBQXJEWSxnQ0FBVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwuSnVtcCA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuLy8gUm9iZXJ0IFBlbm5lcidzIGVhc2VJbk91dFF1YWRcblxuLy8gZmluZCB0aGUgcmVzdCBvZiBoaXMgZWFzaW5nIGZ1bmN0aW9ucyBoZXJlOiBodHRwOi8vcm9iZXJ0cGVubmVyLmNvbS9lYXNpbmcvXG4vLyBmaW5kIHRoZW0gZXhwb3J0ZWQgZm9yIEVTNiBjb25zdW1wdGlvbiBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vamF4Z2VsbGVyL2V6LmpzXG5cbnZhciBlYXNlSW5PdXRRdWFkID0gZnVuY3Rpb24gZWFzZUluT3V0UXVhZCh0LCBiLCBjLCBkKSB7XG4gIHQgLz0gZCAvIDI7XG4gIGlmICh0IDwgMSkgcmV0dXJuIGMgLyAyICogdCAqIHQgKyBiO1xuICB0LS07XG4gIHJldHVybiAtYyAvIDIgKiAodCAqICh0IC0gMikgLSAxKSArIGI7XG59O1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iajtcbn0gOiBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xufTtcblxudmFyIGp1bXBlciA9IGZ1bmN0aW9uIGp1bXBlcigpIHtcbiAgLy8gcHJpdmF0ZSB2YXJpYWJsZSBjYWNoZVxuICAvLyBubyB2YXJpYWJsZXMgYXJlIGNyZWF0ZWQgZHVyaW5nIGEganVtcCwgcHJldmVudGluZyBtZW1vcnkgbGVha3NcblxuICB2YXIgZWxlbWVudCA9IHZvaWQgMDsgLy8gZWxlbWVudCB0byBzY3JvbGwgdG8gICAgICAgICAgICAgICAgICAgKG5vZGUpXG5cbiAgdmFyIHN0YXJ0ID0gdm9pZCAwOyAvLyB3aGVyZSBzY3JvbGwgc3RhcnRzICAgICAgICAgICAgICAgICAgICAocHgpXG4gIHZhciBzdG9wID0gdm9pZCAwOyAvLyB3aGVyZSBzY3JvbGwgc3RvcHMgICAgICAgICAgICAgICAgICAgICAocHgpXG5cbiAgdmFyIG9mZnNldCA9IHZvaWQgMDsgLy8gYWRqdXN0bWVudCBmcm9tIHRoZSBzdG9wIHBvc2l0aW9uICAgICAgKHB4KVxuICB2YXIgZWFzaW5nID0gdm9pZCAwOyAvLyBlYXNpbmcgZnVuY3Rpb24gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24pXG4gIHZhciBhMTF5ID0gdm9pZCAwOyAvLyBhY2Nlc3NpYmlsaXR5IHN1cHBvcnQgZmxhZyAgICAgICAgICAgICAoYm9vbGVhbilcblxuICB2YXIgZGlzdGFuY2UgPSB2b2lkIDA7IC8vIGRpc3RhbmNlIG9mIHNjcm9sbCAgICAgICAgICAgICAgICAgICAgIChweClcbiAgdmFyIGR1cmF0aW9uID0gdm9pZCAwOyAvLyBzY3JvbGwgZHVyYXRpb24gICAgICAgICAgICAgICAgICAgICAgICAobXMpXG5cbiAgdmFyIHRpbWVTdGFydCA9IHZvaWQgMDsgLy8gdGltZSBzY3JvbGwgc3RhcnRlZCAgICAgICAgICAgICAgICAgICAgKG1zKVxuICB2YXIgdGltZUVsYXBzZWQgPSB2b2lkIDA7IC8vIHRpbWUgc3BlbnQgc2Nyb2xsaW5nIHRodXMgZmFyICAgICAgICAgIChtcylcblxuICB2YXIgbmV4dCA9IHZvaWQgMDsgLy8gbmV4dCBzY3JvbGwgcG9zaXRpb24gICAgICAgICAgICAgICAgICAgKHB4KVxuXG4gIHZhciBjYWxsYmFjayA9IHZvaWQgMDsgLy8gdG8gY2FsbCB3aGVuIGRvbmUgc2Nyb2xsaW5nICAgICAgICAgICAgKGZ1bmN0aW9uKVxuXG4gIC8vIHNjcm9sbCBwb3NpdGlvbiBoZWxwZXJcblxuICBmdW5jdGlvbiBsb2NhdGlvbigpIHtcbiAgICByZXR1cm4gd2luZG93LnNjcm9sbFkgfHwgd2luZG93LnBhZ2VZT2Zmc2V0O1xuICB9XG5cbiAgLy8gZWxlbWVudCBvZmZzZXQgaGVscGVyXG5cbiAgZnVuY3Rpb24gdG9wKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBzdGFydDtcbiAgfVxuXG4gIC8vIHJBRiBsb29wIGhlbHBlclxuXG4gIGZ1bmN0aW9uIGxvb3AodGltZUN1cnJlbnQpIHtcbiAgICAvLyBzdG9yZSB0aW1lIHNjcm9sbCBzdGFydGVkLCBpZiBub3Qgc3RhcnRlZCBhbHJlYWR5XG4gICAgaWYgKCF0aW1lU3RhcnQpIHtcbiAgICAgIHRpbWVTdGFydCA9IHRpbWVDdXJyZW50O1xuICAgIH1cblxuICAgIC8vIGRldGVybWluZSB0aW1lIHNwZW50IHNjcm9sbGluZyBzbyBmYXJcbiAgICB0aW1lRWxhcHNlZCA9IHRpbWVDdXJyZW50IC0gdGltZVN0YXJ0O1xuXG4gICAgLy8gY2FsY3VsYXRlIG5leHQgc2Nyb2xsIHBvc2l0aW9uXG4gICAgbmV4dCA9IGVhc2luZyh0aW1lRWxhcHNlZCwgc3RhcnQsIGRpc3RhbmNlLCBkdXJhdGlvbik7XG5cbiAgICAvLyBzY3JvbGwgdG8gaXRcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgbmV4dCk7XG5cbiAgICAvLyBjaGVjayBwcm9ncmVzc1xuICAgIHRpbWVFbGFwc2VkIDwgZHVyYXRpb24gPyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApIC8vIGNvbnRpbnVlIHNjcm9sbCBsb29wXG4gICAgOiBkb25lKCk7IC8vIHNjcm9sbGluZyBpcyBkb25lXG4gIH1cblxuICAvLyBzY3JvbGwgZmluaXNoZWQgaGVscGVyXG5cbiAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAvLyBhY2NvdW50IGZvciByQUYgdGltZSByb3VuZGluZyBpbmFjY3VyYWNpZXNcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc3RhcnQgKyBkaXN0YW5jZSk7XG5cbiAgICAvLyBpZiBzY3JvbGxpbmcgdG8gYW4gZWxlbWVudCwgYW5kIGFjY2Vzc2liaWxpdHkgaXMgZW5hYmxlZFxuICAgIGlmIChlbGVtZW50ICYmIGExMXkpIHtcbiAgICAgIC8vIGFkZCB0YWJpbmRleCBpbmRpY2F0aW5nIHByb2dyYW1tYXRpYyBmb2N1c1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG5cbiAgICAgIC8vIGZvY3VzIHRoZSBlbGVtZW50XG4gICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgLy8gaWYgaXQgZXhpc3RzLCBmaXJlIHRoZSBjYWxsYmFja1xuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuXG4gICAgLy8gcmVzZXQgdGltZSBmb3IgbmV4dCBqdW1wXG4gICAgdGltZVN0YXJ0ID0gZmFsc2U7XG4gIH1cblxuICAvLyBBUElcblxuICBmdW5jdGlvbiBqdW1wKHRhcmdldCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIC8vIHJlc29sdmUgb3B0aW9ucywgb3IgdXNlIGRlZmF1bHRzXG4gICAgZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uIHx8IDEwMDA7XG4gICAgb2Zmc2V0ID0gb3B0aW9ucy5vZmZzZXQgfHwgMDtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2s7IC8vIFwidW5kZWZpbmVkXCIgaXMgYSBzdWl0YWJsZSBkZWZhdWx0LCBhbmQgd29uJ3QgYmUgY2FsbGVkXG4gICAgZWFzaW5nID0gb3B0aW9ucy5lYXNpbmcgfHwgZWFzZUluT3V0UXVhZDtcbiAgICBhMTF5ID0gb3B0aW9ucy5hMTF5IHx8IGZhbHNlO1xuXG4gICAgLy8gY2FjaGUgc3RhcnRpbmcgcG9zaXRpb25cbiAgICBzdGFydCA9IGxvY2F0aW9uKCk7XG5cbiAgICAvLyByZXNvbHZlIHRhcmdldFxuICAgIHN3aXRjaCAodHlwZW9mIHRhcmdldCA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YodGFyZ2V0KSkge1xuICAgICAgLy8gc2Nyb2xsIGZyb20gY3VycmVudCBwb3NpdGlvblxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgZWxlbWVudCA9IHVuZGVmaW5lZDsgLy8gbm8gZWxlbWVudCB0byBzY3JvbGwgdG9cbiAgICAgICAgYTExeSA9IGZhbHNlOyAvLyBtYWtlIHN1cmUgYWNjZXNzaWJpbGl0eSBpcyBvZmZcbiAgICAgICAgc3RvcCA9IHN0YXJ0ICsgdGFyZ2V0O1xuICAgICAgICBicmVhaztcblxuICAgICAgLy8gc2Nyb2xsIHRvIGVsZW1lbnQgKG5vZGUpXG4gICAgICAvLyBib3VuZGluZyByZWN0IGlzIHJlbGF0aXZlIHRvIHRoZSB2aWV3cG9ydFxuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgZWxlbWVudCA9IHRhcmdldDtcbiAgICAgICAgc3RvcCA9IHRvcChlbGVtZW50KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIHNjcm9sbCB0byBlbGVtZW50IChzZWxlY3RvcilcbiAgICAgIC8vIGJvdW5kaW5nIHJlY3QgaXMgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuICAgICAgICBzdG9wID0gdG9wKGVsZW1lbnQpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyByZXNvbHZlIHNjcm9sbCBkaXN0YW5jZSwgYWNjb3VudGluZyBmb3Igb2Zmc2V0XG4gICAgZGlzdGFuY2UgPSBzdG9wIC0gc3RhcnQgKyBvZmZzZXQ7XG5cbiAgICAvLyByZXNvbHZlIGR1cmF0aW9uXG4gICAgc3dpdGNoIChfdHlwZW9mKG9wdGlvbnMuZHVyYXRpb24pKSB7XG4gICAgICAvLyBudW1iZXIgaW4gbXNcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbjtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIGZ1bmN0aW9uIHBhc3NlZCB0aGUgZGlzdGFuY2Ugb2YgdGhlIHNjcm9sbFxuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb24oZGlzdGFuY2UpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBzdGFydCB0aGUgbG9vcFxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gIH1cblxuICAvLyBleHBvc2Ugb25seSB0aGUganVtcCBtZXRob2RcbiAgcmV0dXJuIGp1bXA7XG59O1xuXG4vLyBleHBvcnQgc2luZ2xldG9uXG5cbnZhciBzaW5nbGV0b24gPSBqdW1wZXIoKTtcblxucmV0dXJuIHNpbmdsZXRvbjtcblxufSkpKTtcbiIsImV4cG9ydCAqIGZyb20gXCIuL2ltYWdlX2NhbnZhc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsZXJwKGZyb206IG51bWJlciwgdG86IG51bWJlciwgcGVyY2VudDogbnVtYmVyKSB7XHJcbiAgdmFyIGRpZmZlcmFuY2UgPSB0byAtIGZyb207XHJcbiAgcmV0dXJuIGZyb20gKyAoZGlmZmVyYW5jZSAqIHBlcmNlbnQpO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEltZyB7XHJcbiAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICBpbWFnZTogSFRNTEltYWdlRWxlbWVudFxyXG4gIHc6IG51bWJlcjtcclxuICBoOiBudW1iZXI7XHJcbiAgeF9vZmZzZXRfZGVzdDogbnVtYmVyO1xyXG4gIHlfb2Zmc2V0X2Rlc3Q6IG51bWJlcjtcclxuICB4X29mZnNldDogbnVtYmVyO1xyXG4gIHlfb2Zmc2V0OiBudW1iZXI7XHJcbiAgYW5jaG9yWDogbnVtYmVyO1xyXG4gIGFuY2hvclk6IG51bWJlcjtcclxuXHJcbiAgaW1nV2lkdGg6IG51bWJlcjtcclxuICBzY3JlZW5XaWR0aDogbnVtYmVyO1xyXG4gIHNjYWxlWDogbnVtYmVyO1xyXG4gIHNjYWxlWTogbnVtYmVyO1xyXG4gIHNjYWxlOiBudW1iZXI7XHJcbiAgaW1nSGVpZ2h0OiBudW1iZXI7XHJcbiAgc2NyZWVuSGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gIGxvYWRlZDogYm9vbGVhbjtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2bS5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIHZtLmN0eCA9IHZtLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgdm0udyA9IHZtLmNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgdm0uaCA9IHZtLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB2bS5pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgdm0uaW1hZ2Uuc3JjID0gJ2NpdHkuanBnJztcclxuICAgIHZtLmxvYWRlZCA9IGZhbHNlO1xyXG5cclxuICAgIHZtLmltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdm0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgdm0uc2l6ZSh2bS53LCB2bS5oKTtcclxuICAgICAgdm0uZHJhdygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHNpemUodywgaCkge1xyXG4gICAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgICB2bS53ID0gdm0uY2FudmFzLndpZHRoID0gdztcclxuICAgICAgdm0uaCA9IHZtLmNhbnZhcy5oZWlnaHQgPSBoO1xyXG5cclxuICAgIC8qZ2V0cyBzY2FsZVggYmFzZWQgb24gc2NyZWVuIGFuZCBpbWFnZSB3aWR0aCAqL1xyXG4gICAgICB2bS5pbWdXaWR0aCA9IHZtLmltYWdlLm5hdHVyYWxXaWR0aDtcclxuICAgICAgdm0uc2NyZWVuV2lkdGggPSB3O1xyXG4gICAgICB2bS5zY2FsZVggPSB2bS5zY3JlZW5XaWR0aCAvIHZtLmltZ1dpZHRoO1xyXG5cclxuICAgICAgLypnZXRzIHNjYWxlWSBiYXNlZCBvbiBzY3JlZW4gYW5kIGltYWdlIHdpZHRoICovXHJcbiAgICAgIHZtLmltZ0hlaWdodCA9IHZtLmltYWdlLm5hdHVyYWxIZWlnaHQ7XHJcbiAgICAgIHZtLnNjcmVlbkhlaWdodCA9IGg7XHJcbiAgICAgIHZtLnNjYWxlWSA9IHZtLnNjcmVlbkhlaWdodCAvIHZtLmltZ0hlaWdodDtcclxuXHJcblxyXG4gICAgICAvKnNldHMgYmFzaWMgc2NhbGUgdG8gWCAqL1xyXG5cclxuICAgICAgdm0uc2NhbGUgPSB2bS5zY2FsZVhcclxuICAgICAgaWYgKHZtLnNjYWxlWCA8IHZtLnNjYWxlWSkge1xyXG4gICAgICAgIHZtLnNjYWxlID0gdm0uc2NhbGVZO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2bS5pbWdXaWR0aCAqPSB2bS5zY2FsZSAqIDEuMDU7XHJcbiAgICAgIHZtLmltZ0hlaWdodCAqPSB2bS5zY2FsZSAqIDEuMDU7XHJcblxyXG4gICAgICB2bS5hbmNob3JYID0gKHZtLmltZ1dpZHRoIC0gdm0uc2NyZWVuV2lkdGgpO1xyXG4gICAgICB2bS5hbmNob3JZID0gKHZtLmltZ0hlaWdodCAtIHZtLnNjcmVlbkhlaWdodCk7XHJcblxyXG4gICAgICB2bS54X29mZnNldF9kZXN0ID0gdm0ueF9vZmZzZXQgPSB2bS5hbmNob3JYO1xyXG4gICAgICB2bS55X29mZnNldF9kZXN0ID0gdm0ueV9vZmZzZXQgPSB2bS5hbmNob3JZO1xyXG5cclxuICAgICAgY29uc29sZS5sb2coTWF0aC5yb3VuZCh2bS5zY3JlZW5XaWR0aCkgKycgJysgTWF0aC5yb3VuZCh2bS5zY3JlZW5IZWlnaHQpKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3KCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgLy8gdm0uY3R4LmNsZWFyUmVjdCgwLDAsdm0udywgdm0uaCk7XHJcblxyXG4gICAgdm0uY3R4LmRyYXdJbWFnZSh2bS5pbWFnZSwgdm0ueF9vZmZzZXQsIHZtLnlfb2Zmc2V0LCB2bS5pbWFnZS5uYXR1cmFsV2lkdGgsIHZtLmltYWdlLm5hdHVyYWxIZWlnaHQsIDAsIDAsIHZtLmltZ1dpZHRoLCB2bS5pbWdIZWlnaHQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFwcCB7XHJcbiAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICB3OiBudW1iZXI7XHJcbiAgaDogbnVtYmVyO1xyXG4gIC8vIHJlY3Q6IFJlY3RhbmdsZVxyXG4gIGltZzogSW1nO1xyXG5cclxuICBtb3VzZUluOiBib29sZWFuO1xyXG4gIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgIHZtLmNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XHJcbiAgICB2bS5jdHggPSB2bS5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICBcclxuXHJcbiAgICB2bS5zaXplQ2FudmFzKCk7XHJcbiAgICAvLyB2bS5pbml0RXZlbnRzKCk7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0KSA9PiB7IHZtLmRyYXcodCk7IH0pO1xyXG5cclxuICAgIHZtLmltZyA9IG5ldyBJbWcodm0udywgdm0uaCk7XHJcblxyXG4gICAgdm0ubW91c2VJbiA9IGZhbHNlO1xyXG5cclxuICAgIHZtLmNvbnRhaW5lciA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzLWNvbnRhaW5lcicpO1xyXG5cclxuICAgIHZtLmNvbnRhaW5lci5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZtLmRyYXdJbWdJbigwLCBlKTtcclxuICAgIH1cclxuXHJcbiAgICB2bS5jb250YWluZXIub25tb3VzZWVudGVyID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdm0ubW91c2VJbiA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdm0uY29udGFpbmVyLm9ubW91c2VvdXQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2bS5tb3VzZUluID0gZmFsc2U7XHJcbiAgICAgIHZtLmRyYXdJbWdPdXQoMCwgZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2l6ZUNhbnZhcygpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZtLmNhbnZhcy5zdHlsZS53aWR0aCA9ICcxMDAlJztcclxuICAgIHZtLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XHJcbiAgICB0aGlzLncgPSB0aGlzLmNhbnZhcy53aWR0aCA9IHZtLmNhbnZhcy5vZmZzZXRXaWR0aDtcclxuICAgIHRoaXMuaCA9IHRoaXMuY2FudmFzLmhlaWdodCA9IHZtLmNhbnZhcy5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgaWYodm0uaW1nKXtcclxuICAgICAgdm0uaW1nLnNpemUodm0udywgdm0uaCk7XHJcbiAgICAgIHZtLmltZy5kcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuICBwdWJsaWMgZHJhdyh0OiBhbnkpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHQpID0+IHsgdGhpcy5kcmF3KHQpOyB9KTtcclxuICAgIHZtLmN0eC5jbGVhclJlY3QoMCwgMCwgdm0udywgdm0uaCk7XHJcblxyXG4gICAgdm0uY3R4LmRyYXdJbWFnZSh2bS5pbWcuY2FudmFzLCAwLCAwKTtcclxuICAgIHZtLmltZy5kcmF3KCk7XHJcblxyXG5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3SW1nSW4odDogYW55LCBlOiBhbnkpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcblxyXG4gICAgLypyYXRpbyA9IChpbWdXaWR0aCAvIHNjcmVlbldpZHRoKSAgKi9cclxuXHJcbiAgICB2YXIgbW92ZVJhdGlvWCA9IChlLmNsaWVudFggLyB2bS5pbWcuc2NyZWVuV2lkdGgpOyAvL3JhbmdlIGZyb20gWzAsIDFdOiAwIGJlaW5nIGxlZnQsIDEgYmVpbmcgcmlnaHRcclxuICAgIHZhciBtb3ZlT2Zmc2V0WCA9IC12bS5pbWcuYW5jaG9yWCArIChtb3ZlUmF0aW9YICogdm0uaW1nLmFuY2hvclgpO1xyXG5cclxuICAgIHZhciBtb3ZlUmF0aW9ZID0gKGUuY2xpZW50WSAvIHZtLmltZy5zY3JlZW5IZWlnaHQpOyAvL3JhbmdlIGZyb20gWzAsIDFdOiAwIGJlaW5nIGxlZnQsIDEgYmVpbmcgcmlnaHRcclxuICAgIHZhciBtb3ZlT2Zmc2V0WSA9IC12bS5pbWcuYW5jaG9yWSArIChtb3ZlUmF0aW9ZICogdm0uaW1nLmFuY2hvclkpO1xyXG5cclxuXHJcbiAgICAvKm9mZnNldCA9IG1pZGRsZV9hbmNob3IgKyBkcmFnZ2VkX29mZnNldCovXHJcbiAgICB2bS5pbWcueF9vZmZzZXRfZGVzdCA9IHZtLmltZy5hbmNob3JYICsgbW92ZU9mZnNldFg7XHJcbiAgICB2bS5pbWcueV9vZmZzZXRfZGVzdCA9IHZtLmltZy5hbmNob3JZICsgbW92ZU9mZnNldFk7XHJcblxyXG4gICAgaWYgKHZtLm1vdXNlSW4gPT09IHRydWUgJiYgTWF0aC5yb3VuZCh2bS5pbWcueV9vZmZzZXQpICE9PSBNYXRoLnJvdW5kKHZtLmltZy55X29mZnNldF9kZXN0KSAmJiBNYXRoLnJvdW5kKHZtLmltZy54X29mZnNldCkgIT09IE1hdGgucm91bmQodm0uaW1nLnhfb2Zmc2V0X2Rlc3QpKSB7XHJcblxyXG5cclxuICAgICAgdm0uaW1nLnhfb2Zmc2V0ID0gTWF0aC5yb3VuZChsZXJwKHZtLmltZy54X29mZnNldCwgdm0uaW1nLnhfb2Zmc2V0X2Rlc3QsIDAuMSkpO1xyXG4gICAgICB2bS5pbWcueV9vZmZzZXQgPSBNYXRoLnJvdW5kKGxlcnAodm0uaW1nLnlfb2Zmc2V0LCB2bS5pbWcueV9vZmZzZXRfZGVzdCwgMC4xKSk7XHJcblxyXG4gICAgICAvLyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0KSA9PiB7IHZtLmRyYXdJbWdJbih0LCBlKSB9KTtcclxuXHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdJbWdPdXQodDogYW55LCBlOiBhbnkpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICAvKnJhdGlvID0gKGltZ1dpZHRoIC8gc2NyZWVuV2lkdGgpICAqL1xyXG5cclxuICAgIC8vIHZhciBtb3ZlUmF0aW9YID0gKGUuY2xpZW50WCAvIHZtLmltZy5zY3JlZW5XaWR0aCk7IC8vcmFuZ2UgZnJvbSBbMCwgMV06IDAgYmVpbmcgbGVmdCwgMSBiZWluZyByaWdodFxyXG4gICAgLy8gdmFyIG1vdmVPZmZzZXRYID0gLXZtLmltZy5hbmNob3JYICsgKG1vdmVSYXRpb1ggKiB2bS5pbWcuYW5jaG9yWCAqIDIpO1xyXG5cclxuICAgIC8vIHZhciBtb3ZlUmF0aW9ZID0gKGUuY2xpZW50WSAvIHZtLmltZy5zY3JlZW5IZWlnaHQpICogMjsgLy9yYW5nZSBmcm9tIFswLCAxXTogMCBiZWluZyBsZWZ0LCAxIGJlaW5nIHJpZ2h0XHJcbiAgICAvLyB2YXIgbW92ZU9mZnNldFkgPSAtdm0uaW1nLmFuY2hvclkgKyAobW92ZVJhdGlvWSAqIHZtLmltZy5hbmNob3JZKTtcclxuXHJcblxyXG4gICAgLypvZmZzZXQgPSBtaWRkbGVfYW5jaG9yICsgZHJhZ2dlZF9vZmZzZXQqL1xyXG4gICAgdm0uaW1nLnhfb2Zmc2V0X2Rlc3QgPSB2bS5pbWcuYW5jaG9yWDtcclxuICAgIHZtLmltZy55X29mZnNldF9kZXN0ID0gdm0uaW1nLmFuY2hvclk7XHJcblxyXG4gICAgaWYgKHZtLm1vdXNlSW4gPT09IGZhbHNlICYmIE1hdGgucm91bmQodm0uaW1nLnlfb2Zmc2V0KSAhPT0gTWF0aC5yb3VuZCh2bS5pbWcueV9vZmZzZXRfZGVzdCkgJiYgTWF0aC5yb3VuZCh2bS5pbWcueF9vZmZzZXQpICE9PSBNYXRoLnJvdW5kKHZtLmltZy54X29mZnNldF9kZXN0KSkge1xyXG5cclxuXHJcbiAgICAgIHZtLmltZy54X29mZnNldCA9IGxlcnAodm0uaW1nLnhfb2Zmc2V0LCB2bS5pbWcueF9vZmZzZXRfZGVzdCwgMC4xKTtcclxuICAgICAgdm0uaW1nLnlfb2Zmc2V0ID0gbGVycCh2bS5pbWcueV9vZmZzZXQsIHZtLmltZy55X29mZnNldF9kZXN0LCAwLjEpO1xyXG5cclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodCkgPT4geyB2bS5kcmF3SW1nT3V0KHQsIGUpIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICAvLyBpbml0RXZlbnRzKCkge1xyXG4gIC8vICAgd2luZG93Lm9ucmVzaXplID0gKGUpID0+IHtcclxuICAvLyAgICAgdGhpcy5zaXplQ2FudmFzKCk7XHJcbiAgLy8gICB9O1xyXG4gIC8vIH1cclxuXHJcbn0iLCJpbXBvcnQgKiBhcyBqdW1wIGZyb20gXCJqdW1wLmpzXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBpbWFnZV9jYW52YXMgZnJvbSBcIi4vaW1hZ2VfY2FudmFzXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBza2lsbF9iYWRnZSBmcm9tIFwiLi9za2lsbF9iYWRnZVwiO1xyXG5cclxuaW1wb3J0ICogYXMgbWVkaWEgZnJvbSBcIi4vbWVkaWFcIjtcclxuXHJcbi8veW9vXHJcbmNvbnN0IHRpbWVvdXQ6bnVtYmVyID0gMTAwMDtcclxuXHJcbnZhciBmcm9udGVuZCA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnZmxleC1ncmlkMScsIFsgIHtcIm5hbWVcIjogJ0hUTUw1JywgICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjonaHRtbDUuc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0phdmEgU2NyaXB0JywgICAgIFwiY2xhc3NcIjonY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjonamF2YXNjcmlwdC0yLnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdCb290c3RyYXAnLCAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0xMDAnLCBcImltYWdlXCI6J2Jvb3RzdHJhcC00LnN2Zyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0FuZ3VsYXIgSlMnLCAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTc1JywgXCJpbWFnZVwiOidhbmd1bGFyLWljb24uc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ1R5cGUgU2NyaXB0JywgICAgIFwiY2xhc3NcIjonY2lyY2xlLTc1JywgXCJpbWFnZVwiOid0eXBlc2NyaXB0LnN2Zyd9LCAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnR3VscCcsICAgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNzUnLCBcImltYWdlXCI6J2d1bHAuc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0NTUzMnLCAgICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTUwJywgXCJpbWFnZVwiOidjc3MtMy5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnalF1ZXJ5JywgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J2pxdWVyeS0xLnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdTQ1NTJywgICAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS01MCcsIFwiaW1hZ2VcIjonc2Fzcy0xLnN2Zyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0QzLmpzJywgICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTI1JywgXCJpbWFnZVwiOidkMy0yLnN2Zyd9XSwgJ2Zyb250ZW5kJyk7XHJcbnZhciBzb2Z0ZW5nID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICdmbGV4LWdyaWQyJywgICAgW3tcIm5hbWVcIjogJ0phdmEnLCAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNzUnLCBcImltYWdlXCI6J2phdmEtMTQuc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnUHl0aG9uJywgICAgICBcImNsYXNzXCI6J2NpcmNsZS01MCcsIFwiaW1hZ2VcIjoncHl0aG9uLTUuc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnQysrJywgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMjUnLCBcImltYWdlXCI6J2Mtc2Vla2xvZ28uY29tLnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ05vZGUgSlMnLCAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0yNScsIFwiaW1hZ2VcIjonbm9kZWpzLWljb24uc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnQyMnLCAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0yNScsIFwiaW1hZ2VcIjonY3NoYXJwLnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ1VuaXR5JywgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMjUnLCBcImltYWdlXCI6J3VuaXR5LnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0FuZHJvaWQgU3R1ZGlvJywgIFwiY2xhc3NcIjonY2lyY2xlLTI1JywgXCJpbWFnZVwiOidBbmRyb2lkX3N0dWRpby5zdmcnfV0sICdzb2Z0ZW5nJyk7XHJcbnZhciBkZXNpZ24gPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJ2ZsZXgtZ3JpZDMnLCAgICAgICBbe1wibmFtZVwiOiAnUGhvdG9zaG9wJywgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J3Bob3Rvc2hvcC1jYy5zdmcnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0lsbHVzdHJhdG9yJywgICAgIFwiY2xhc3NcIjonY2lyY2xlLTUwJywgXCJpbWFnZVwiOidhZG9iZS1pbGx1c3RyYXRvci1jYy5zdmcnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ01heWEnLCAgICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTUwJywgXCJpbWFnZVwiOidtYXlhLnBuZyd9LCAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdBZnRlciBFZmZlY3RzJywgICBcImNsYXNzXCI6J2NpcmNsZS0yNScsIFwiaW1hZ2VcIjonYWZ0ZXItZWZmZWN0cy1jYy5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdNdWRib3gnLCAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0yNScsIFwiaW1hZ2VcIjonbXVkYm94LnBuZyd9XSwgJ2Rlc2lnbicpO1xyXG5mcm9udGVuZC5sb2FkKCk7XHJcbnNvZnRlbmcubG9hZCgpO1xyXG5kZXNpZ24ubG9hZCgpO1xyXG5cclxuXHJcbnZhciBhcHAgPSBuZXcgaW1hZ2VfY2FudmFzLkFwcCgpO1xyXG5cclxuXHJcbi8vIHdpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uKCl7XHJcbi8vICAgICBjb25zb2xlLmxvZyh3aW5kb3cuc2Nyb2xsWSk7XHJcbi8vIH1cclxuXHJcblxyXG4vLyB2YXIgdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid3JhcHBlci0wXCIpO1xyXG4vLyB2YXIgYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwMScpO1xyXG5cclxuXHJcbi8vIGIub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcbi8vICAgICBpZih3LmNsYXNzTGlzdFsxXSA9PT0gXCJvcGVuXCIpe1xyXG4vLyAgICAgICAgIHcuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4vLyAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICB3LmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuLy8gICAgIH1cclxuLy8gfVxyXG5cclxuZXhwb3J0IGNsYXNzIFBvcnRmb2xpb0l0ZW0ge1xyXG4gICAgdGl0bGU6IHN0cmluZzsgXHJcbiAgICB0aXRsZV9pbWFnZTogc3RyaW5nOyBcclxuICAgIGRlc2M6IHN0cmluZztcclxuICAgIHN0YWNrOiBza2lsbF9iYWRnZS5Db2xsZWN0aW9uOyBcclxuICAgIHBvcnRfaW1hZ2U6IHN0cmluZztcclxuICAgIHVybDogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBpdGVtX251bTogbnVtYmVyO1xyXG5cclxuICAgIGNvbF9zaXplOiBzdHJpbmc7XHJcbiAgICBjb2w6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gICAgdGV4dDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBzdWJfdGV4dDogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgb3BlbjogYm9vbGVhbjtcclxuICAgIG1lZGlhOm1lZGlhLk1lZGlhO1xyXG4gICAgdGFyZ2V0X3dyYXBwZXI6IFdyYXBwZXI7XHJcbiAgICBwb3J0Zm9saW86IFBvcnRmb2xpbztcclxuICBcclxuICBjb25zdHJ1Y3Rvcihwb3J0Zm9saW86IFBvcnRmb2xpbywgaXRlbV9udW06IG51bWJlciwgIHRpdGxlOiBzdHJpbmcsIHRpdGxlX2ltYWdlOiBzdHJpbmcsIGRlc2M6IHN0cmluZywgc3RhY2s6IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24sIG1lZGlhOm1lZGlhLk1lZGlhLCB0eXBlOiBzdHJpbmcsIHVybDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgdm0ucG9ydGZvbGlvID0gcG9ydGZvbGlvO1xyXG4gICAgdm0uaXRlbV9udW0gPSBpdGVtX251bTtcclxuICAgIHZtLnRpdGxlID0gdGl0bGU7XHJcbiAgICB2bS50aXRsZV9pbWFnZSA9IHRpdGxlX2ltYWdlO1xyXG4gICAgdm0uZGVzYyA9IGRlc2M7XHJcbiAgICB2bS5zdGFjayA9IHN0YWNrO1xyXG4gICAgdm0ubWVkaWEgPSBtZWRpYTtcclxuICAgIHZtLnVybCA9IHVybDtcclxuICAgIHZtLmNvbF9zaXplID0gXCJjb2wtbWQtM1wiO1xyXG4gICAgXHJcblxyXG4gICAgdm0uY29sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB2bS5jb2wuY2xhc3NMaXN0LmFkZCh2bS5jb2xfc2l6ZSk7XHJcblxyXG4gICAgdmFyIGNhcmRfc2hhZG93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBjYXJkX3NoYWRvdy5jbGFzc0xpc3QuYWRkKCdjYXJkLWRyb3BzaGFkb3cnLCAncm93Jyk7XHJcblxyXG4gICAgdmFyIG5vcGFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBub3BhZC5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInLCdub3BhZCcpO1xyXG5cclxuICAgIHZtLmltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgdm0uaW1nLnNyYyA9IHZtLnRpdGxlX2ltYWdlO1xyXG5cclxuICAgIHZhciBjb2wxMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgY29sMTIuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJyk7XHJcblxyXG4gICAgdm0udGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdm0udGV4dC5jbGFzc0xpc3QuYWRkKCd0ZXh0JywgJ3BhZGRpbmctdG9wJyk7XHJcbiAgICB2bS50ZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRpdGxlKSk7XHJcblxyXG4gICAgdmFyIGNvbDEyXzIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGNvbDEyXzIuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJyk7XHJcblxyXG4gICAgdm0uc3ViX3RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHZtLnN1Yl90ZXh0LmNsYXNzTGlzdC5hZGQoJ3RleHRfbGlnaHQnKTtcclxuICAgIHZtLnN1Yl90ZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHR5cGUpKTtcclxuXHJcbiAgICAvLyAuY29sLW1kLTNcclxuICAgIC8vICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKSNwMVxyXG4gICAgLy8gICAgICAgLnRleHQgQnJlYXRobGVzczogSFRNTDUgR2FtZVxyXG5cclxuICAgIC8vIC5jb2wtbWQtM1xyXG4gICAgLy8gICAgICAgLmNhcmQtZHJvcHNoYWRvdy5yb3dcclxuICAgIC8vICAgICAgICAgLmNvbC1tZC0xMi5ub3BhZFxyXG4gICAgLy8gICAgICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKSNwMS5kcm9wc2hhZG93XHJcbiAgICAvLyAgICAgICAgIC5jb2wtbWQtMTJcclxuICAgIC8vICAgICAgICAgICAudGV4dCBCcmVhdGhsZXNzXHJcbiAgICAvLyAgICAgICAgIC5jb2wtbWQtMTJcclxuICAgIC8vICAgICAgICAgICAudGV4dF9saWdodCBIVE1MNSBHYW1lXHJcblxyXG4gICAgdm0uY29sLmFwcGVuZENoaWxkKGNhcmRfc2hhZG93KTtcclxuICAgIGNhcmRfc2hhZG93LmFwcGVuZENoaWxkKG5vcGFkKTtcclxuICAgIG5vcGFkLmFwcGVuZENoaWxkKHZtLmltZyk7XHJcbiAgICBjYXJkX3NoYWRvdy5hcHBlbmRDaGlsZChjb2wxMik7XHJcbiAgICBjb2wxMi5hcHBlbmRDaGlsZCh2bS50ZXh0KTtcclxuICAgIGNhcmRfc2hhZG93LmFwcGVuZENoaWxkKGNvbDEyXzIpO1xyXG4gICAgY29sMTJfMi5hcHBlbmRDaGlsZCh2bS5zdWJfdGV4dCk7XHJcblxyXG4gICAgdm0ub3BlbiA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICB2bS5jb2wub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy8gICBjb25zb2xlLih2bS5pdGVtc1swXSk7XHJcbiAgICAgICAgdmFyIGRpZmZlcmVudF93cmFwcGVyID0gZmFsc2U7XHJcbiAgICAgICAgY29uc29sZS5sb2codm0ubWVkaWEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRpZmZlcmVudF93cmFwcGVyID0gdm0ucG9ydGZvbGlvLmNsb3NlKHZtLml0ZW1fbnVtKTtcclxuICAgICAgICBcclxuICAgICAgICB2bS5vcGVuID0gdm0udGFyZ2V0X3dyYXBwZXIudHJhbnNpdGlvbldyYXBwZXIoZGlmZmVyZW50X3dyYXBwZXIsIHZtLm9wZW4sIHZtLnRpdGxlLCB2bS5kZXNjLCB2bS5zdGFjaywgdm0ubWVkaWEsIHZtLnVybClcclxuICAgICAgICBcclxuICAgICAgICAvLyAgIHZtLnNldERhdGEoKTsgIFxyXG4gICAgICB9XHJcbiAgICBcclxuICB9XHJcbiAgYXBwZW5kKHJvdzogbnVtYmVyLCB3cmFwcGVyOiBXcmFwcGVyKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2YXIgcm93X2VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm93Xycrcm93KTtcclxuICAgIFxyXG4gICAgcm93X2VsZW1lbnQuYXBwZW5kQ2hpbGQodm0uY29sKTtcclxuICAgIHZtLnRhcmdldF93cmFwcGVyID0gd3JhcHBlcjtcclxuICAgIHZtLnN0YWNrLmZsZXhfZ3JpZF9pZCA9IHdyYXBwZXIuZmxleF9ncmlkLmlkO1xyXG4gICAgdm0ubWVkaWEuaWQgPSAnbWVkaWEtJytyb3c7XHJcbiAgICBjb25zb2xlLmxvZyh2bS5tZWRpYSk7XHJcbiAgfVxyXG4gIHNldENvbChjbGFzc05hbWU6IHN0cmluZyl7XHJcbiAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgdm0uY29sLmNsYXNzTGlzdC5yZW1vdmUodm0uY29sX3NpemUpO1xyXG4gICAgICB2bS5jb2xfc2l6ZSA9IGNsYXNzTmFtZTtcclxuICAgICAgdm0uY29sLmNsYXNzTGlzdC5hZGQodm0uY29sX3NpemUpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUG9ydGZvbGlvIHtcclxuICBpZDogc3RyaW5nO1xyXG4gIGpzb25fb2JqczogSVBvcnRmb2xpb0l0ZW1bXTtcclxuICBwYXRoOiBzdHJpbmc7XHJcbiAgaXRlbXM6IFBvcnRmb2xpb0l0ZW1bXTtcclxuICB3cmFwcGVyczogV3JhcHBlcltdO1xyXG4gIGZsZXhfZ3JpZF9pZDogc3RyaW5nO1xyXG4gIHBlcl9yb3c6bnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBqc29uX29ianM6IElQb3J0Zm9saW9JdGVtW10pIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZtLmlkID0gaWQ7XHJcbiAgICB2bS5qc29uX29ianMgPSBqc29uX29ianM7XHJcbiAgICAgXHJcblxyXG4gICAgdm0uaXRlbXMgPSBbXTtcclxuICAgIHZtLndyYXBwZXJzID0gW107XHJcblxyXG4gICAgLy9hZGQgd3JhcHBlcnMgYmFzZWQgb24gYWxsIHBvc3NpYmxlIGJyZWFrcG9pbnQgd2lkdGhzIChqc29uX29ianMvMilcclxuICAgIGZvcih2YXIgaiA9IDA7IGogPCBNYXRoLmNlaWwoanNvbl9vYmpzLmxlbmd0aC8yKTsgaisrKXtcclxuICAgICAgICB2bS53cmFwcGVycy5wdXNoKG5ldyBXcmFwcGVyKGopKTtcclxuICAgIH1cclxuXHJcbiAgICAvL2FkZCBhbGwgaXRlbXNcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uanNvbl9vYmpzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZtLml0ZW1zLnB1c2gobmV3IFBvcnRmb2xpb0l0ZW0odm0sIGksIGpzb25fb2Jqc1tpXS50aXRsZSwganNvbl9vYmpzW2ldLnRpdGxlX2ltYWdlLCBqc29uX29ianNbaV0uZGVzYywganNvbl9vYmpzW2ldLnN0YWNrLCBqc29uX29ianNbaV0ubWVkaWEsIGpzb25fb2Jqc1tpXS50eXBlLCBqc29uX29ianNbaV0udXJsKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdm0uYXBwZW5kQWxsKCk7XHJcblxyXG4gICAgXHJcbiAgfVxyXG5cclxuICAgIHB1YmxpYyBhcHBlbmRBbGwoKXsgLy9hcHBlbmRzIFBvcnRmb2xpb0l0ZW1zIGJhc2VkIG9uIHNjcmVlbiBzaXplOyBnZXRzIGRpZ2VzdGVkXHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZhciBzY3JlZW5XaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHNjcmVlbldpZHRoKTtcclxuXHJcbiAgICAgICAgLy9yZWFzc2lnbnMgY29scyBiYXNlZCBvbiBicmVha3BvaW50c1xyXG4gICAgICAgIHZhciBicmVha3BvaW50cyA9IFt7bWluOiAwLCBtYXg6NzY4LCBjb2xfc2l6ZTogJ2NvbC14cy02JywgcGVyX3JvdzogMn0se21pbjogNzY5LCBtYXg6OTkyLCBjb2xfc2l6ZTogJ2NvbC14cy00JywgcGVyX3JvdzogM30sIHttaW46IDk5MywgbWF4OjEyMDAsIGNvbF9zaXplOiAnY29sLXhzLTMnLCBwZXJfcm93OiA0fSwge21pbjogMTIwMCwgbWF4Ojk5OTksIGNvbF9zaXplOiAnY29sLXhzLTMnLCBwZXJfcm93OiA0fV07XHJcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8YnJlYWtwb2ludHMubGVuZ3RoOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgLy9pZiBpbiBicmVha3BvaW50IHJhbmdlLCBhbmQgbm90IHNhbWUgYXMgYmVmb3JlXHJcbiAgICAgICAgICAgIGlmKC8qdm0uaXRlbXNbMF0uY29sX3NpemUgIT09IGJyZWFrcG9pbnRzW2ldLmNvbF9zaXplICYmICovc2NyZWVuV2lkdGggPiBicmVha3BvaW50c1tpXS5taW4gJiYgc2NyZWVuV2lkdGggPCBicmVha3BvaW50c1tpXS5tYXgpe1xyXG4gICAgICAgICAgICAgICAgLy9jbGVhciBhbGwgcm93c1xyXG4gICAgICAgICAgICAgICAgdm0ucGVyX3JvdyA9IGJyZWFrcG9pbnRzW2ldLnBlcl9yb3c7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcnRmb2xpbycpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZXJhdG9yID0gcGFyZW50LmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgYSA9IDE7IGEgPCBpdGVyYXRvcjsgYSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQocGFyZW50LmNoaWxkcmVuWzFdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL2FkZCBuZXcgcm93cyBhbmQgd3JhcHBlcnNcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgciA9IDA7IHIgPCBNYXRoLmNlaWwodm0uaXRlbXMubGVuZ3RoIC8gYnJlYWtwb2ludHNbaV0ucGVyX3Jvdyk7IHIrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdy5pZCA9ICdyb3dfJytyO1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdy5jbGFzc0xpc3QuYWRkKCdyb3cnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSB2bS53cmFwcGVyc1tyXS5odG1sO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQocm93KTtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQod3JhcHBlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL2FkZCBjb2xzIHRvIG5ldyByb3dzXHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGo9MDsgajx2bS5pdGVtcy5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uaXRlbXNbal0uc2V0Q29sKGJyZWFrcG9pbnRzW2ldLmNvbF9zaXplKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcm93X251bSA9IE1hdGguZmxvb3Ioai9icmVha3BvaW50c1tpXS5wZXJfcm93KTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5pdGVtc1tqXS5hcHBlbmQocm93X251bSwgdm0ud3JhcHBlcnNbcm93X251bV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICBwdWJsaWMgY2xvc2UoaXRlbV9udW06IG51bWJlcikgeyAvL2Nsb3NlcyBhbGwgd3JhcHBlcnNcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIC8vY2xvc2VzIGFsbCBpdGVtcyBpbiB0aGUgcm93IG9mIHRoZSBnaXZlbiBpdGVtLlxyXG4gICAgdmFyIHJvdyA9IE1hdGguZmxvb3IoaXRlbV9udW0vdm0ucGVyX3Jvdyk7XHJcblxyXG4gICAgLy8gZm9yKHZhciBqID0gKHJvdyp2bS5wZXJfcm93KTsgaiA8ICgocm93KnZtLnBlcl9yb3cpK3ZtLnBlcl9yb3cpOyBqKyspe1xyXG4gICAgLy8gICAgIGlmKGl0ZW1fbnVtICE9PSBqICYmIHZtLml0ZW1zW2pdKXtcclxuICAgIC8vICAgICAgICAgdm0uaXRlbXNbal0ub3BlbiA9IGZhbHNlO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuICAgIHZhciByZXR1cm5fdmFsdWUgPSBmYWxzZTtcclxuXHJcbiAgICBmb3IodmFyIGogPSAwOyBqIDwgdm0uaXRlbXMubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgIGlmKGl0ZW1fbnVtICE9PSBqICYmIHZtLml0ZW1zW2pdKXtcclxuICAgICAgICAgICAgdm0uaXRlbXNbal0ub3BlbiA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvcih2YXIgciA9IDA7IHIgPCB2bS53cmFwcGVycy5sZW5ndGg7IHIrKyl7XHJcbiAgICAgICAgaWYociAhPT0gcm93ICYmIHZtLndyYXBwZXJzW3JdLmh0bWwuY2xhc3NMaXN0WzFdID09PSAnb3Blbicpe1xyXG4gICAgICAgICAgICB2bS53cmFwcGVyc1tyXS5jbG9zZSgpO1xyXG4gICAgICAgICAgICByZXR1cm5fdmFsdWUgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXR1cm5fdmFsdWU7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV3JhcHBlciB7XHJcbiAgICB0aXRsZTogc3RyaW5nOyBcclxuICAgIGRlc2M6IHN0cmluZztcclxuICAgIGNvbGxlY3Rpb246IHNraWxsX2JhZGdlLkNvbGxlY3Rpb247XHJcbiAgICBwb3J0X2ltYWdlOiBzdHJpbmc7IFxyXG4gICAgbWVkaWE6IG1lZGlhLk1lZGlhO1xyXG4gICAgdXJsOiBzdHJpbmc7XHJcbiAgICBcclxuXHJcbiAgICBodG1sOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgdGl0bGVfZWxlbWVudDpIVE1MRGl2RWxlbWVudDtcclxuICAgIGRlc2NyaXB0aW9uOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgc3RhY2s6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBmbGV4X2dyaWQ6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBkZW1vOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29sNTpIVE1MRGl2RWxlbWVudDtcclxuICAgIGRlc2NyaXB0aW9uX3RleHQ6IFRleHQ7XHJcbiAgICB0aXRsZV9lbGVtZW50X3RleHQ6IFRleHQ7XHJcbiAgICBsaW5rOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgbGlua190ZXh0OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29sNjpIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBjaGFuZ2U6Ym9vbGVhbjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Iocm93X251bSl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB2bS5jaGFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAvLyB2bS50aXRsZSA9IHBJdGVtLnRpdGxlO1xyXG4gICAgICAgIC8vIHZtLmRlc2MgPSBwSXRlbS5kZXNjO1xyXG4gICAgICAgIC8vIHZtLnN0YWNrID0gcEl0ZW0uc3RhY2s7XHJcbiAgICAgICAgLy8gdm0ucG9ydF9pbWFnZSA9IHBJdGVtLnBvcnRfaW1hZ2U7XHJcbiAgICAgICAgdm0uaHRtbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmh0bWwuaWQgPSAnd3JhcHBlci0nK3Jvd19udW07XHJcbiAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QuYWRkKCd3cmFwcGVyJyk7XHJcblxyXG4gICAgICAgIHZhciByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICByb3cuaWQgPSAnY29udGVudCc7XHJcbiAgICAgICAgcm93LmNsYXNzTGlzdC5hZGQoJ3JvdycsICdub21hcicpO1xyXG5cclxuICAgICAgICB2bS50aXRsZV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0udGl0bGVfZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInLCAnZGVzYy10ZXh0JywgJ3BhZC1zcGFjaW5nJyk7XHJcbiAgICAgICAgdm0udGl0bGVfZWxlbWVudF90ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnQuYXBwZW5kQ2hpbGQodm0udGl0bGVfZWxlbWVudF90ZXh0KTtcclxuXHJcbiAgICAgICAgdmFyIGNvbDYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb2w2LmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtNicsICdjb2wtbGctNycsICdyb3cnLCAnbm9tYXInLCAnbm9wYWQnKTtcclxuXHJcbiAgICAgICAgdmFyIHJvd19maWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgcm93X2ZpbGwuY2xhc3NMaXN0LmFkZCgncm93JywnanVzdGlmeS1jZW50ZXInLCAnbm9tYXInKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbDEyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29sMTIuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJyk7XHJcblxyXG4gICAgICAgIHZtLmNvbDYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5jb2w2LmlkID0gJ21lZGlhLScrcm93X251bTtcclxuICAgICAgICB2bS5jb2w2LmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtNicsICdjb2wtbGctNScpO1xyXG5cclxuICAgICAgICB2YXIgY29sM18yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29sM18yLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtMycsICdub3BhZC1sZWZ0Jyk7XHJcblxyXG4gICAgICAgIHZtLmRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb24uY2xhc3NMaXN0LmFkZCgnaGVhZGVyLXRleHQnLCAncGFkLXNwYWNpbmcnKTtcclxuICAgICAgICB2bS5kZXNjcmlwdGlvbi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnRGVzY3JpcHRpb24nKSk7XHJcblxyXG4gICAgICAgIHZhciBkZXNjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGVzYy5jbGFzc0xpc3QuYWRkKCdkZXNjcmlwdGlvbi10ZXh0JywgJ3BhZC1zcGFjaW5nJyk7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb25fdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcclxuICAgICAgICBkZXNjLmFwcGVuZENoaWxkKHZtLmRlc2NyaXB0aW9uX3RleHQpO1xyXG5cclxuICAgICAgICB2bS5zdGFjayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnN0YWNrLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtMTInLCAnY29sLWxnLTcnKTtcclxuICAgICAgICAvLyB2bS5zdGFjay5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnU3RhY2snKSk7XHJcblxyXG4gICAgICAgIHZhciBzdGFja190aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHN0YWNrX3RpdGxlLmNsYXNzTGlzdC5hZGQoJ2hlYWRlci10ZXh0JywgJ3BhZC1zcGFjaW5nJylcclxuICAgICAgICBzdGFja190aXRsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnU3RhY2snKSk7XHJcblxyXG4gICAgICAgIHZtLmZsZXhfZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmZsZXhfZ3JpZC5pZCA9ICdwZmxleC1ncmlkLScrcm93X251bTtcclxuICAgICAgICB2bS5mbGV4X2dyaWQuY2xhc3NMaXN0LmFkZCgncm93JywncG9ydGZvbGlvLWZsZXgnLCAnY29sLXhzLTEyJyk7XHJcblxyXG4gICAgICAgIHZtLmRlbW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5kZW1vLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtMTInLCAnY29sLWxnLTUnKTtcclxuICAgICAgICAvLyB2bS5kZW1vLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdMaXZlIERlbW8nKSk7XHJcblxyXG4gICAgICAgIHZhciBkZW1vX3RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGVtb190aXRsZS5jbGFzc0xpc3QuYWRkKCdoZWFkZXItdGV4dCcsICdwYWQtc3BhY2luZycpXHJcbiAgICAgICAgZGVtb190aXRsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnUmVsZXZhbnQgTGlua3MnKSk7XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICB2bS5saW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0ubGluay5jbGFzc0xpc3QuYWRkKCdnaXRodWItYnV0dG9uJywncm93JywgJ25vbWFyJyk7XHJcblxyXG4gICAgICAgIHZtLmxpbmtfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmxpbmtfdGV4dC5jbGFzc0xpc3QuYWRkKCd0ZXh0Jyk7XHJcbiAgICAgICAgdm0ubGlua190ZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdMaXZlIExpbmsnKSk7ICAgICAgICBcclxuXHJcbiAgICAgICAgdm0uY29sNSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmNvbDUuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2NvbC1tZC01Jyk7XHJcblxyXG4gICAgICAgIC8qIEdPTk5BIEhBVkUgVE8gQUREIE1FRElBIERZTkFNSUNBTExZICovXHJcblxyXG4gICAgICAgIHZtLmh0bWwuYXBwZW5kQ2hpbGQocm93KTtcclxuICAgICAgICByb3cuYXBwZW5kQ2hpbGQodm0udGl0bGVfZWxlbWVudCk7XHJcbiAgICAgICAgcm93LmFwcGVuZENoaWxkKHZtLmNvbDYpO1xyXG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZChjb2w2KTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBjb2w2LmFwcGVuZENoaWxkKGNvbDEyKTtcclxuICAgICAgICBjb2wxMi5hcHBlbmRDaGlsZCh2bS5kZXNjcmlwdGlvbik7XHJcbiAgICAgICAgY29sMTIuYXBwZW5kQ2hpbGQoZGVzYyk7XHJcbiAgICAgICAgY29sNi5hcHBlbmRDaGlsZCh2bS5zdGFjaylcclxuICAgICAgICB2bS5zdGFjay5hcHBlbmRDaGlsZChzdGFja190aXRsZSk7XHJcbiAgICAgICAgdm0uc3RhY2suYXBwZW5kQ2hpbGQodm0uZmxleF9ncmlkKTtcclxuICAgICAgICBjb2w2LmFwcGVuZENoaWxkKHZtLmRlbW8pXHJcbiAgICAgICAgdm0uZGVtby5hcHBlbmRDaGlsZChkZW1vX3RpdGxlKTtcclxuICAgICAgICB2bS5kZW1vLmFwcGVuZENoaWxkKHZtLmxpbmspO1xyXG4gICAgICAgIHZtLmxpbmsuYXBwZW5kQ2hpbGQodm0ubGlua190ZXh0KTtcclxuICAgICAgICBcclxuICAgICAgICB2bS5saW5rLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2bS51cmwpO1xyXG4gICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gdm0udXJsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8jd3JhcHBlci0wLndyYXBwZXIub3BlblxyXG4gICAgICAgIC8vIC5yb3cjY29udGVudFxyXG4gICAgICAgIC8vICAgLmNvbC1tZC0xMi5kZXNjLXRleHQgQnJlYXRobGVzc1xyXG4gICAgICAgIC8vICAgLmNvbC1tZC02I21lZGlhLTBcclxuICAgICAgICAvLyAgIC5jb2wtbWQtNi5yb3dcclxuICAgICAgICAvLyAgICAgICAuY29sLW1kLTEyXHJcbiAgICAgICAgLy8gICAgICAgICAuaGVhZGVyLXRleHQucGFkZGluZy1sZWZ0IERlc2NyaXB0aW9uOlxyXG4gICAgICAgIC8vICAgICAgICAgLmRlc2NyaXB0aW9uLXRleHQucGFkZGluZy1sZWZ0IGFzZGZhc2RmXHJcbiAgICAgICAgLy8gICAgICAgLmNvbC1tZC02LmhlYWRlci10ZXh0IFN0YWNrOlxyXG4gICAgICAgIC8vICAgICAgIC5jb2wtbWQtNi5oZWFkZXItdGV4dCBMaXZlIERlbW86XHJcblxyXG4gICAgICAgIHZtLmh0bWwuYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgaWYodm0uY2hhbmdlKXtcclxuICAgICAgICAgICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgdm0uc2V0RGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgdm0uY2hhbmdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgfVxyXG4gICAgLy8gY2xvc2VEYXRhKCl7XHJcbiAgICAvLyAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgLy8gICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgIC8vICAgICAgICAgdm0uY29sbGVjdGlvbi5jbG9zZSgpO1xyXG4gICAgLy8gICAgIH0sdGltZW91dCk7XHJcbiAgICAgICAgXHJcbiAgICAvLyB9XHJcblxyXG4gICAgc2V0RGF0YSgpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5zZXRUaXRsZSgpO1xyXG4gICAgICAgIHZtLnNldERlc2MoKTtcclxuICAgICAgICB2bS5zZXRTdGFjaygpO1xyXG4gICAgICAgIHZtLnNldE1lZGlhKCk7XHJcbiAgICAgICAgLy8gdm0uc2V0U3RhY2soc3RhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFRpdGxlKCl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnRfdGV4dC50ZXh0Q29udGVudCA9IHZtLnRpdGxlO1xyXG4gICAgfVxyXG4gICAgc2V0RGVzYygpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5kZXNjcmlwdGlvbl90ZXh0LnRleHRDb250ZW50ID0gdm0uZGVzYztcclxuICAgIH1cclxuXHJcbiAgICBzZXRTdGFjaygpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5jb2xsZWN0aW9uLnJlc2V0SWRzKHZtLmZsZXhfZ3JpZC5pZCk7XHJcbiAgICAgICAgdm0uY29sbGVjdGlvbi5sb2FkKCk7XHJcbiAgICB9XHJcbiAgICBzZXRNZWRpYSgpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5tZWRpYS5zZXRJZCh2bS5tZWRpYS5pZCk7XHJcbiAgICAgICAgdm0ubWVkaWEubG9hZE1lZGlhKDApO1xyXG4gICAgfVxyXG4gICAgY2xvc2UoKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XHJcbiAgICB9XHJcbiAgICBjaGFuZ2VXcmFwcGVyKG9wZW46IGJvb2xlYW4sIHRpdGxlLCBkZXNjLCBzdGFjaywgbWVkaWEsIHVybCl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIC8vY2xvc2Ugd3JhcHBlcjpcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodm0udGl0bGUgPT09IHRpdGxlKXsgLyoqaWYgbm8gY2hhbmdlICovXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcxJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG9wZW4pO1xyXG4gICAgICAgICAgICB2bS5jaGFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKG9wZW4pe1xyXG4gICAgICAgICAgICAgICAgLy8gdm0uY2xvc2VEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZtLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgICAgICAgICB2bS5kZXNjID0gZGVzYztcclxuICAgICAgICAgICAgICAgIHZtLmNvbGxlY3Rpb24gPSBzdGFjaztcclxuICAgICAgICAgICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgICAgICAgICB2bS51cmwgPSB1cmw7XHJcbiAgICAgICAgICAgICAgICB2bS5zZXREYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmKHZtLmh0bWwuY2xhc3NMaXN0WzFdICE9PSAnb3BlbicpeyAvKippZiBhbGwgc2VsZWN0aW9ucyBhcmUgY2xvc2VkIGluaXRpYWxseS9jaGFuZ2Ugd2hlbiBjbG9zZWQqL1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnMicpO1xyXG4gICAgICAgICAgICB2bS5jaGFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgdm0udGl0bGUgPSB0aXRsZTtcclxuICAgICAgICAgICAgdm0uZGVzYyA9IGRlc2M7XHJcbiAgICAgICAgICAgIHZtLmNvbGxlY3Rpb24gPSBzdGFjaztcclxuICAgICAgICAgICAgdm0ubWVkaWEgPSBtZWRpYTtcclxuICAgICAgICAgICAgdm0udXJsID0gdXJsO1xyXG4gICAgICAgICAgICB2bS5zZXREYXRhKCk7XHJcbiAgICAgICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnMycpO1xyXG4gICAgICAgICAgICB2bS5jaGFuZ2UgPSB0cnVlO1xyXG4gICAgICAgICAgICB2bS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgICAgICB2bS5kZXNjID0gZGVzYztcclxuICAgICAgICAgICAgdm0uY29sbGVjdGlvbiA9IHN0YWNrO1xyXG4gICAgICAgICAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgICAgICAgICB2bS51cmwgPSB1cmw7XHJcbiAgICAgICAgICAgIC8vIHZtLmNsb3NlRGF0YSgpO1xyXG4gICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2l0aW9uV3JhcHBlcihkaWZmZXJlbnRfd3JhcHBlcjpib29sZWFuLCBvcGVuOiBib29sZWFuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHJldHVybl92YWx1ZTtcclxuXHJcbiAgICAgICAgaWYoZGlmZmVyZW50X3dyYXBwZXIpe1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5fdmFsdWUgPSB2bS5jaGFuZ2VXcmFwcGVyKG9wZW4sIHRpdGxlLCBkZXNjLCBzdGFjaywgbWVkaWEsIHVybCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGltZW91dDogJysgcmV0dXJuX3ZhbHVlKTsgXHJcbiAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xyXG4gICAgICAgIH0gZWxzZSBpZihvcGVuID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICBvcGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuX3ZhbHVlID0gdm0uY2hhbmdlV3JhcHBlcihvcGVuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHZtLmNoYW5nZVdyYXBwZXIob3BlbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSwgdXJsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3JldHVybl92YWx1ZTogJytyZXR1cm5fdmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByZXR1cm5fdmFsdWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBvcnRmb2xpb0l0ZW0ge1xyXG4gIHRpdGxlOiBzdHJpbmc7XHJcbiAgdGl0bGVfaW1hZ2U6IHN0cmluZzsgXHJcbiAgZGVzYzogc3RyaW5nO1xyXG4gIHN0YWNrOiBza2lsbF9iYWRnZS5Db2xsZWN0aW9uO1xyXG4gIG1lZGlhOiBtZWRpYS5NZWRpYTsgXHJcbiAgdHlwZTogc3RyaW5nO1xyXG4gIHVybDogc3RyaW5nO1xyXG59XHJcblxyXG4vLyB7XCJuYW1lXCI6ICdQeXRob24nLCAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTUwJywgXCJpbWFnZVwiOidweXRob24tNS5zdmcnfVxyXG52YXIgYnJlYXRobGVzc19zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgWyAgIHtcIm5hbWVcIjogJ1BoYXNlci5qcycsICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjoncGhhc2VyLnN2Zyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdQaG90b3Nob3AnLCAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0xMDAnLCBcImltYWdlXCI6J3Bob3Rvc2hvcC1jYy5zdmcnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnalF1ZXJ5JywgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J2pxdWVyeS0xLnN2Zyd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG52YXIgcWJlcnRfc3RhY2sgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJycsIFsgICB7XCJuYW1lXCI6ICdNYXlhJywgICAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0xMDAnLCBcImltYWdlXCI6J21heWEucG5nJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ1Bob3Rvc2hvcCcsICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTI1JywgXCJpbWFnZVwiOidwaG90b3Nob3AtY2Muc3ZnJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiB2YXIgd2VhdGhlcl9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgWyAgIHtcIm5hbWVcIjogJ0FuZ3VsYXIgSlMnLCAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjonYW5ndWxhci1pY29uLnN2Zyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIHZhciBicmVhdGhsZXNzX21lZGlhID0gbmV3IG1lZGlhLk1lZGlhKCdtZWRpYS0wJywgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9jYXQuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzE5ODE0OTc5NVwiIHdpZHRoPVwiNDcxXCIgaGVpZ2h0PVwiMzM1XCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+Jyk7XHJcbiAgIFxyXG52YXIgbSA9IFtdXHJcblxyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX3BsYXkuanBnXCIsIFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheV8yLmpwZ1wiLFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheS5qcGdcIixcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfY29udHJvbHMuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX3BsYXkuanBnXCIsIFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheV8yLmpwZ1wiLFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheS5qcGdcIixcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfY29udHJvbHMuanBnXCJdKSk7XHJcblxyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbXCIuL3BvcnRmb2xpby9xYmVydF9wbGF5LmpwZ1wiLFwiLi9wb3J0Zm9saW8vcWJlcnRfcGxheWVyLmpwZ1wiLFwiLi9wb3J0Zm9saW8vcWJlcnRfc25ha2UuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9xYmVydF9wbGF5ZXIuanBnXCIsXCIuL3BvcnRmb2xpby9xYmVydF9zbmFrZS5qcGdcIl0sICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8xOTgxNDk3OTVcIiB3aWR0aD1cIjQ3MVwiIGhlaWdodD1cIjMzNVwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicpKTtcclxuXHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFtcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8xLnBuZ1wiLFwiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzMucG5nXCIsXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMi5wbmdcIl0sIFtcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8xLnBuZ1wiLFwiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzMucG5nXCIsXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMi5wbmdcIl0pKTtcclxuXHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vbWVhbl9mb3JlY2FzdF8xLmpwZycsICcuL3BvcnRmb2xpby9tZWFuX2ZvcmVjYXN0XzIuanBnJ10sIFsnLi9wb3J0Zm9saW8vbWVhbl9mb3JlY2FzdF8xLmpwZycsICcuL3BvcnRmb2xpby9tZWFuX2ZvcmVjYXN0XzIuanBnJ10pKVxyXG5cclxudmFyIHBvcnRmb2xpbyA9IG5ldyBQb3J0Zm9saW8oJ3BvcnRmb2xpbycsIFtcclxuICAgIHt0aXRsZTogJ0JyZWF0aGxlc3MnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnJywgZGVzYzpcIlRoZSBTcGFjZSBQaXJhdGUsIEFyaWEsIGlzIG9uIGEgbWlzc2lvbiB0byBsb290IGEgbWluZXJhbCBjYXJnbyBzaGlwLiBIb3dldmVyLCB1cG9uIGxhbmRpbmcgb24gdGhlIGNhcmdvIHNoaXAsIEFyaWEncyBoZWxtZXQgY3JhY2tzIGNhdXNpbmcgaGVyIHRvIHNsb3dseSBsb3NlIG94eWdlbi4gSXQncyBub3cgYSByYWNlIGFnYWluc3QgdGltZSB0byBjb2xsZWN0IGFsbCB0aGUgZ2VtcyBiZWZvcmUgaGVyIG94eWdlbiBydW5zIG91dCFcIiwgc3RhY2s6YnJlYXRobGVzc19zdGFjaywgbWVkaWE6IG1bMF0sIHR5cGU6ICdIVE1MNSBHYW1lJywgdXJsIDogJy9icmVhdGhsZXNzJ30sXHJcbiAgICB7dGl0bGU6ICdNZWFuIEZvcmVjYXN0JywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9tZWFuX2ZvcmVjYXN0XzEuanBnJywgZGVzYzonQSBzbWFsbCB3ZWIgYXBwIHRoYXQgY2FsY3VsYXRlcyB0aGUgYXZlcmFnZSBvZiAzIHdlYXRoZXIgQVBJXFwnczogV3VuZGVyZ3JvdW5kLCBGb3JlY2FzdC5pbywgYW5kIFdvcmxkIFdlYXRoZXIgT25saW5lLiBUaGUgd2ViYXBwIGl0c2VsZiBoYXMgbWFueSBzdWJ0bGV0aWVzIHRoYXQgYXJlIGFmZmVjdGVkIGJ5IHdlYXRoZXIgZGF0YS4gRm9yIGV4YW1wbGUsIHRoZSB2aWRlbyAgcmVzZW1ibGVzIHRoZSBjdXJyZW50IHdlYXRoZXIuIEFsc28gZWFjaCBncmFwaCBpcyBjb2xvciBjb2F0ZWQgYnkgYSBncmFkaWVudCBiYXNlZCBvbiB0aGUgd2VhdGhlciBkYXRhLicsIHN0YWNrOndlYXRoZXJfc3RhY2ssIG1lZGlhOiBtWzNdLCB0eXBlOiAnV2Vic2l0ZScsIHVybCA6ICcvbWVhbmZvcmVjYXN0J30sXHJcbiAgICB7dGl0bGU6ICdRKkJlcnQnLCB0aXRsZV9pbWFnZTogXCIuL3BvcnRmb2xpby9xYmVydF9wbGF5LmpwZ1wiLCBkZXNjOidUaGlzIGlzIG15IEJvdW5jaW5nIEJhbGwgQXNzaWdubWVudCBmb3IgQW5pbWF0aW9uIDEgYXQgRHJleGVsIFVuaXZlcnNpdHkuIFdoZW4gcGlja2luZyBhIGdhbWUgdGhhdCBtaXhlcyBteSBsb3ZlIG9mIHJldHJvIHZpZGVvIGdhbWVzIGFuZCBib3VuY2luZyBiYWxscywgUSpCZXJ0IHdhcyBhIG5vLWJyYWluZXIuIEV2ZXJ5dGhpbmcgaXMgaW5kaXZpZHVhbGx5IG1vZGVsbGVkLCB0ZXh0dXJlZCwgYW5kIGFuaW1hdGVkIGJ5IG1lLiBNYWRlIGluIE1heWEsIGFuZCByZW5kZXJlZCBpbiBWLVJheS4nLCBzdGFjazpxYmVydF9zdGFjaywgbWVkaWE6IG1bMV0sIHR5cGU6ICdBbmltYXRpb24nLCB1cmwgOiAnaHR0cHM6Ly92aW1lby5jb20vMTk4MTQ5Nzk1J30sXHJcbiAgICB7dGl0bGU6ICdCZWRyb29tJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9jZ2lfZmluYWxfMS5wbmcnLCBkZXNjOidUaGlzIGlzIG15IGZpbmFsIGZvciBDR0kgMiBhdCBEcmV4ZWwgVW5pdmVyc2l0eS4gVGhlIGFzc2lnbm1lbnQgd2FzIHRvIHJlY3JlYXRlIGFueSB0eXBlIG9mIHJvb20sIHNvIEkgY2hvc2UgYSBsaXR0bGUgYm95XFwncyByb29tLiBXZSB3ZXJlIHRhc2tlZCB3aXRoIGNyZWF0aW5nIGF0IGxlYXN0IG9uZSBjb21wbGV4IG9iamVjdCwgc28gSSBkZWNpZGVkIHRvIGdvIHdpdGggYSB0cmFpbiBzZXQuJywgc3RhY2s6cWJlcnRfc3RhY2ssIG1lZGlhOiBtWzJdLCB0eXBlOiAnM0QgUmVuZGVyJywgdXJsOicnfV0pO1xyXG5cclxuXHJcbnZhciB3ZWxjb21lX2IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2VsY29tZS1idXR0b24nKTtcclxud2VsY29tZV9iLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4gICAganVtcCgnI3BvcnRmb2xpbycse1xyXG4gICAgICAgIGR1cmF0aW9uOjEwMDAsXHJcbiAgICAgICAgb2Zmc2V0OjAsXHJcbiAgICAgICAgY2FsbGJhY2s6IHVuZGVmaW5lZCxcclxuICAgICAgICBlYXNpbmc6IGp1bXAuZWFzZUluT3V0UXVhZCxcclxuICAgICAgICBhbGx5OiBmYWxzZVxyXG4gICAgfSlcclxufVxyXG5cclxuXHJcbi8qKiBcclxuICogcG9ydGZvbGlvIHdlYnNpdGVcclxuICogYnJlYXRobGVzc1xyXG4gKiB3ZWF0aGVyIHdlYnNpdGVcclxuICogcWJlcnQgYW5pbWF0aW9uXHJcbiAqIGNnaSAyIGZpbmFsPz8gXHJcbiAqIFxyXG4qL1xyXG5cclxuXHJcblxyXG53aW5kb3cub25yZXNpemUgPSAoZSkgPT4ge1xyXG4gICAgICBhcHAuc2l6ZUNhbnZhcygpO1xyXG4gICAgICBwb3J0Zm9saW8uYXBwZW5kQWxsKCk7XHJcblxyXG4gICAgfTtcclxuXHJcblxyXG4vLyB2YXIgbWVkaWEgPSBuZXcgTWVkaWEoJ21lZGlhLTAnLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2NhdC5qcGdcIl0sIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9jYXQuanBnXCIsIFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiXSk7XHJcblxyXG4iLCJleHBvcnQgKiBmcm9tIFwiLi9tZWRpYVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lZGlhSXRlbXtcclxuICAgIG1lZGlhOiBNZWRpYTtcclxuICAgIGh0bWw6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgb3JkZXI6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKG1lZGlhOiBNZWRpYSwgaHRtbDpIVE1MRGl2RWxlbWVudCwgb3JkZXI6IG51bWJlcil7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgdm0uaHRtbCA9IGh0bWw7XHJcbiAgICAgICAgdm0ub3JkZXIgPSBvcmRlcjtcclxuICAgICAgICB2bS5odG1sLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2bS5tZWRpYS5sb2FkTWVkaWEodm0ub3JkZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1lZGlhIHtcclxuICAgIGlkOnN0cmluZ1xyXG4gICAgZWxlbWVudHM6IGFueVtdO1xyXG4gICAgdGh1bWJuYWlsczogSFRNTEltYWdlRWxlbWVudFtdO1xyXG4gICAgbWVkaWFfaXRlbXM6IE1lZGlhSXRlbVtdO1xyXG4gICAgc2VsZWN0ZWQ6IG51bWJlcjtcclxuICAgIHZpbWVvOnN0cmluZztcclxuXHJcbiAgICByb3c6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBvdmVybGF5OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29sbWQ6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBcclxuICAgIG1lZGlhX3NlbGVjdGVkOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgdGh1bWJuYWlsczogc3RyaW5nW10sIGZpbGVzPzogc3RyaW5nW10sIHZpbWVvPzogc3RyaW5nKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaWQgPSBpZDtcclxuICAgICAgICB2bS5zZWxlY3RlZCA9IDA7XHJcbiAgICAgICAgdm0uZWxlbWVudHMgPSBbXTtcclxuICAgICAgICB2bS5tZWRpYV9pdGVtcyA9IFtdO1xyXG4gICAgICAgIHZtLnRodW1ibmFpbHMgPSBbXTtcclxuXHJcbiAgICAgICAgdm0udmltZW8gPSB2aW1lbztcclxuICAgICAgICBpZih2aW1lbyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgZnJhZyA9IHZtLmNyZWF0ZUZyYWdtZW50KHZpbWVvKTtcclxuICAgICAgICAgICAgICAgIHZtLmVsZW1lbnRzLnB1c2goZnJhZyk7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5lbGVtZW50c1tpXS5jbGFzc0xpc3QuYWRkKCdkcm9wc2hhZG93Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbGVuZ3RoID0gdm0uZWxlbWVudHMubGVuZ3RoO1xyXG4gICAgICAgIGlmKGZpbGVzKXtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5zcmMgPSBmaWxlc1tpXTtcclxuICAgICAgICAgICAgICAgIGltYWdlLmNsYXNzTGlzdC5hZGQoJ2Ryb3BzaGFkb3cnKTtcclxuICAgICAgICAgICAgICAgIHZtLmVsZW1lbnRzLnB1c2goaW1hZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2bS5tZWRpYV9zZWxlY3RlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLm1lZGlhX3NlbGVjdGVkLmlkID0gJ21lZGlhLXNlbGVjdGVkJztcclxuXHJcbiAgICAgICAgdm0ub3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnb3ZlcmxheS1tZWRpYScpO1xyXG5cclxuICAgICAgICB2bS5tZWRpYV9zZWxlY3RlZC5hcHBlbmRDaGlsZCh2bS5vdmVybGF5KTtcclxuXHJcbiAgICAgICAgdm0ucm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0ucm93LmNsYXNzTGlzdC5hZGQoJ3JvdycsJ2p1c3RpZnktY2VudGVyJywnbWVkaWEtY29udGFpbmVyJyk7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaiA9IDA7IGogPCB2bS5lbGVtZW50cy5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgICAgIHZtLmNvbG1kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIHZtLmNvbG1kLmNsYXNzTGlzdC5hZGQoJ2NvbC14cycpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGh0bWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgICAgICBodG1sLmNsYXNzTGlzdC5hZGQoJ21lZGlhLWl0ZW0nKTtcclxuICAgICAgICAgICAgdmFyIG1lZGlhX2l0ZW0gPSBuZXcgTWVkaWFJdGVtKHZtLGh0bWwsaik7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhX2l0ZW1zLnB1c2gobWVkaWFfaXRlbSk7XHJcblxyXG4gICAgICAgICAgICB2bS50aHVtYm5haWxzLnB1c2goZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJykpO1xyXG4gICAgICAgICAgICB2bS50aHVtYm5haWxzW2pdLmNsYXNzTGlzdC5hZGQoJ2Ryb3BzaGFkb3cnKTtcclxuICAgICAgICAgICAgdm0udGh1bWJuYWlsc1tqXS5zcmMgPSB0aHVtYm5haWxzW2pdO1xyXG5cclxuICAgICAgICAgICAgdm0uY29sbWQuYXBwZW5kQ2hpbGQodm0ubWVkaWFfaXRlbXNbal0uaHRtbCk7XHJcbiAgICAgICAgICAgIHZtLmNvbG1kLmFwcGVuZENoaWxkKHZtLnRodW1ibmFpbHNbal0pO1xyXG4gICAgICAgICAgICB2bS5yb3cuYXBwZW5kQ2hpbGQodm0uY29sbWQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICAgI21lZGlhLXNlbGVjdGVkXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIC5vdmVybGF5XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKS5kcm9wc2hhZG93XHJcbiAgICAgICAgLy8gICAgICAgICAgLnJvdy5qdXN0aWZ5LWNlbnRlci5tZWRpYS1jb250YWluZXJcclxuICAgICAgICAvLyAgICAgICAgICAgICAgLmNvbC1tZFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgLm1lZGlhLWl0ZW1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKS5kcm9wc2hhZG93XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIC5jb2wtbWRcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIC5tZWRpYS1pdGVtXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICBpbWcoc3JjPVwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIikuZHJvcHNoYWRvd1xyXG5cclxuXHJcbiAgICAgICAgdm0ubWVkaWFfaXRlbXNbdm0uc2VsZWN0ZWRdLmh0bWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcclxuICAgICAgICAvLyB2bS5lbGVtZW50cy5wdXNoKHZtLmVsZW1lbnRzWzBdKTtcclxuICAgICAgICAvLyB2bS5lbGVtZW50cy5zaGlmdCgpO1xyXG4gICAgICAgIC8vIHZtLnNldElkKGlkKTtcclxuICAgICAgICAvLyB2bS5sb2FkTWVkaWEoMCk7XHJcblxyXG4gICAgfVxyXG4gICAgY3JlYXRlRnJhZ21lbnQoc3RyOiBzdHJpbmcsIHdpZHRoPzogbnVtYmVyLCBoZWlnaHQ/OiBudW1iZXIgKSB7XHJcbiAgICAgICAgdmFyIG5ld3N0ciA9IHN0cjtcclxuICAgICAgICBpZih3aWR0aCl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBuZXdzdHIgPSBzdHIucmVwbGFjZSgnd2lkdGg9XCJcXGQrXCIgaGVpZ2h0PVwiXFxkK1wiJywgJ3dpZHRoPVwiJyt3aWR0aCsnXCIgaGVpZ2h0PVwiJytoZWlnaHQrJ1wiJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcblxyXG4gICAgICAgIHZhciBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgPSBzdHI7XHJcblxyXG4gICAgICAgIHdoaWxlIChlbGVtLmNoaWxkTm9kZXNbMF0pIHtcclxuICAgICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChlbGVtLmNoaWxkTm9kZXNbMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZnJhZztcclxuICAgIH1cclxuXHJcbiAgICBzZXRJZChpZDogc3RyaW5nKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICB3aGlsZShwYXJlbnQuZmlyc3RDaGlsZCl7XHJcbiAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYXJlbnQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh2bS5tZWRpYV9zZWxlY3RlZCk7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHZtLnJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2l6ZSgpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5vdmVybGF5LnN0eWxlLndpZHRoID0gKHZtLm1lZGlhX3NlbGVjdGVkLmNsaWVudFdpZHRoKzEyKSsncHgnO1xyXG4gICAgICAgIHZtLm92ZXJsYXkuc3R5bGUuaGVpZ2h0ID0gKHZtLm1lZGlhX3NlbGVjdGVkLmNsaWVudEhlaWdodCs4KSsncHgnO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRNZWRpYSh0aHVtYl9udW06bnVtYmVyKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5tZWRpYV9zZWxlY3RlZC5yZW1vdmVDaGlsZCh2bS5tZWRpYV9zZWxlY3RlZC5maXJzdENoaWxkKTtcclxuICAgICAgICB2bS5vdmVybGF5LmNsYXNzTGlzdC5hZGQoJ2Nsb3NlLW1lZGlhJyk7XHJcblxyXG4gICAgICAgIHZtLnNpemUoKTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHZtLm1lZGlhX2l0ZW1zLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgdm0ubWVkaWFfaXRlbXNbaV0uaHRtbC5zdHlsZS53aWR0aCA9IHZtLmNvbG1kLmNsaWVudFdpZHRoKydweCc7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhX2l0ZW1zW2ldLmh0bWwuc3R5bGUuaGVpZ2h0ID0gdm0uY29sbWQuY2xpZW50SGVpZ2h0KydweCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih2bS52aW1lbyAmJiB0aHVtYl9udW0gPT09IDApe1xyXG4gICAgICAgICAgICAgICAgdm0uZWxlbWVudHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIHZhciBmcmFnID0gdm0uY3JlYXRlRnJhZ21lbnQodm0udmltZW8sIHZtLm1lZGlhX3NlbGVjdGVkLmNsaWVudFdpZHRoLCB2bS5tZWRpYV9zZWxlY3RlZC5jbGllbnRIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgdm0uZWxlbWVudHMudW5zaGlmdChmcmFnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2bS5vdmVybGF5LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuICAgICAgICAgICAgICAgIC8vIHZtLmVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQoJ2Ryb3BzaGFkb3cnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2bS5vdmVybGF5LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLypidXR0b24gdHJhbnNpdGlvbiovXHJcbiAgICAgICAgdm0ubWVkaWFfaXRlbXNbdm0uc2VsZWN0ZWRdLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcclxuICAgICAgICB2bS5zZWxlY3RlZCA9IHRodW1iX251bTtcclxuICAgICAgICB2bS5tZWRpYV9pdGVtc1t2bS5zZWxlY3RlZF0uaHRtbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG5cclxuICAgICAgICAvKnBpY3R1cmUgdHJhbnNpdGlvbiovXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgLy8gaWYodm0udmltZW8gJiYgdm0uc2VsZWN0ZWQgPT09IDApe1xyXG5cclxuICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgaWYgKHZtLm1lZGlhX3NlbGVjdGVkLmNoaWxkcmVuLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQucmVtb3ZlQ2hpbGQodm0ubWVkaWFfc2VsZWN0ZWQubGFzdENoaWxkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQuYXBwZW5kQ2hpbGQodm0uZWxlbWVudHNbdm0uc2VsZWN0ZWRdKTtcclxuICAgICAgICAgICAgdm0ub3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdjbG9zZS1tZWRpYScpO1xyXG4gICAgICAgICAgICB2bS5tZWRpYV9pdGVtc1t2bS5zZWxlY3RlZF0uaHRtbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgIH0sIDYwMCk7ICAgXHJcbiAgICB9XHJcbn0iLCJleHBvcnQgKiBmcm9tIFwiLi9za2lsbF9iYWRnZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNraWxsIHtcclxuICBmbGV4X2l0ZW06IEhUTUxEaXZFbGVtZW50O1xyXG4gIHN2ZzogU1ZHU1ZHRWxlbWVudDtcclxuICBzdmdfY2lyY2xlOiBTVkdDaXJjbGVFbGVtZW50O1xyXG4gIHNjYWxlX2JveDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgaW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgdGV4dDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgZmxleF9ncmlkX2lkOiBzdHJpbmc7XHJcbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjbGFzc3BlcmNlbnQ6IHN0cmluZywgaW1hZ2U6IHN0cmluZywgZmxleF9ncmlkX2lkOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICB2bS5mbGV4X2dyaWRfaWQgPSBmbGV4X2dyaWRfaWQ7XHJcblxyXG4gICAgdm0uZmxleF9pdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB2bS5mbGV4X2l0ZW0uY2xhc3NOYW1lICs9ICdmbGV4LWl0ZW0nO1xyXG5cclxuICAgIHZtLnN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwic3ZnXCIpXHJcbiAgICB2bS5zdmcuc2V0QXR0cmlidXRlKCdjbGFzcycsIGNsYXNzcGVyY2VudClcclxuICAgIHZtLnN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzg0Jyk7XHJcbiAgICB2bS5zdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnODQnKTtcclxuXHJcbiAgICB2bS5zdmdfY2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ2NpcmNsZScpO1xyXG4gICAgdm0uc3ZnX2NpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnY2xhc3MnLCAnb3V0ZXInKTtcclxuICAgIHZtLnN2Z19jaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgXCJjeFwiLCAnLTQyJyk7XHJcbiAgICB2bS5zdmdfY2lyY2xlLnNldEF0dHJpYnV0ZU5TKG51bGwsIFwiY3lcIiwgJzQyJyk7XHJcbiAgICB2bS5zdmdfY2lyY2xlLnNldEF0dHJpYnV0ZU5TKG51bGwsIFwiclwiLCAnMzcnKTtcclxuICAgIHZtLnN2Z19jaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgXCJ0cmFuc2Zvcm1cIiwgXCJyb3RhdGUoLTkwLCAwLCAwKVwiKTtcclxuXHJcbiAgICB2bS5zY2FsZV9ib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGlmIChuYW1lID09PSBcIlR5cGUgU2NyaXB0XCIgfHwgbmFtZSA9PT0gXCJCb290c3RyYXBcIiB8fCBuYW1lID09PSBcIkQzLmpzXCIgfHwgbmFtZSA9PT0gXCJQaG90b3Nob3BcIiB8fCBuYW1lID09PSBcIklsbHVzdHJhdG9yXCIgfHwgbmFtZSA9PT0gXCJBZnRlciBFZmZlY3RzXCIgfHwgbmFtZSA9PT0gXCJNYXlhXCIgfHwgbmFtZSA9PT0gXCJNdWRib3hcIikge1xyXG4gICAgICB2bS5zY2FsZV9ib3guY2xhc3NOYW1lICs9ICdzY2FsZS1ib3gtc3F1YXJlJztcclxuICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gXCJVbml0eVwiIHx8IG5hbWUgPT09IFwiUGhhc2VyLmpzXCIgfHwgbmFtZSA9PT0gXCJEMy5qc1wiIHx8IG5hbWUgPT09IFwiU0NTU1wiIHx8IG5hbWUgPT09IFwiSmF2YVwiIHx8IG5hbWUgPT09IFwiUHl0aG9uXCIpIHtcclxuICAgICAgdm0uc2NhbGVfYm94LmNsYXNzTmFtZSArPSAnc2NhbGUtYm94LW1pZCc7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdm0uc2NhbGVfYm94LmNsYXNzTmFtZSArPSAnc2NhbGUtYm94JztcclxuICAgIH1cclxuXHJcbiAgICB2bS5pbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgdm0uaW1hZ2Uuc3JjID0gaW1hZ2U7XHJcblxyXG4gICAgdm0udGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdm0udGV4dC5jbGFzc05hbWUgKz0gJ3RleHQnO1xyXG4gICAgdm0udGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShuYW1lKSk7XHJcblxyXG4gICAgLy8gLmZsZXgtaXRlbVxyXG4gICAgLy8gICAgICAgc3ZnLmNpcmNsZS03NSh3aWR0aD0nODQnLCBoZWlnaHQ9Jzg0JylcclxuICAgIC8vICAgICAgICAgY2lyY2xlLm91dGVyKGN4PSctNDInLCBjeT0nNDInLCByPSczNycgdHJhbnNmb3JtPVwicm90YXRlKC05MCwgMCwgMClcIikgXHJcbiAgICAvLyAgICAgICAuc2NhbGUtYm94XHJcbiAgICAvLyAgICAgICAgIGltZyhpZD1cImZvdXJcIilcclxuICAgIC8vICAgICAgICAgLnRleHQgYWJjXHJcbiAgICB2bS5mbGV4X2l0ZW0uYXBwZW5kQ2hpbGQodm0uc3ZnKTtcclxuICAgIHZtLnN2Zy5hcHBlbmRDaGlsZCh2bS5zdmdfY2lyY2xlKTtcclxuICAgIHZtLmZsZXhfaXRlbS5hcHBlbmRDaGlsZCh2bS5zY2FsZV9ib3gpO1xyXG4gICAgdm0uc2NhbGVfYm94LmFwcGVuZENoaWxkKHZtLmltYWdlKTtcclxuICAgIHZtLmZsZXhfaXRlbS5hcHBlbmRDaGlsZCh2bS50ZXh0KTtcclxuICB9XHJcbiAgcmVzZXRJZChpZDogc3RyaW5nKXtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZtLmZsZXhfZ3JpZF9pZCA9IGlkO1xyXG4gIH1cclxuXHJcbiAgYXBwZW5kKCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdmFyIGZsZXhfZ3JpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHZtLmZsZXhfZ3JpZF9pZCk7XHJcbiAgICBmbGV4X2dyaWQuYXBwZW5kQ2hpbGQodm0uZmxleF9pdGVtKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNraWxsSW5mbyB7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIGNsYXNzOiBzdHJpbmc7XHJcbiAgaW1hZ2U6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbGxlY3Rpb24ge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgaW1hZ2VzOiBJU2tpbGxJbmZvW107XHJcbiAgcGF0aDogc3RyaW5nO1xyXG4gIHNraWxsczogU2tpbGxbXTtcclxuICBmbGV4X2dyaWRfaWQ6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nLCBmbGV4X2dyaWRfaWQ6IHN0cmluZywgaW1hZ2VzOiBJU2tpbGxJbmZvW10sIGlkPzogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICBcclxuICAgIHZtLmltYWdlcyA9IGltYWdlcztcclxuICAgIHZtLnBhdGggPSBwYXRoO1xyXG4gICAgdm0uZmxleF9ncmlkX2lkID0gZmxleF9ncmlkX2lkO1xyXG5cclxuICAgIHZtLnNraWxscyA9IFtdO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW1hZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZtLnNraWxscy5wdXNoKG5ldyBTa2lsbChpbWFnZXNbaV0ubmFtZSwgaW1hZ2VzW2ldLmNsYXNzLCB2bS5wYXRoICsgaW1hZ2VzW2ldLmltYWdlLCB2bS5mbGV4X2dyaWRfaWQpKTtcclxuICAgIH1cclxuICAgIGlmKGlkKXtcclxuICAgICAgdm0uaWQgPSBpZDtcclxuICAgICAgdmFyIGVsZW1lbnQgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodm0uaWQpO1xyXG4gICAgICBlbGVtZW50Lm9ubW91c2V1cCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdm0ubG9hZCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVzZXRJZHMoaWQ6IHN0cmluZyl7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2bS5mbGV4X2dyaWRfaWQgPSBpZDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uc2tpbGxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZtLnNraWxsc1tpXS5yZXNldElkKHZtLmZsZXhfZ3JpZF9pZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbG9hZCgpIHsgLy9zZXRzIHNyYydzIHRvIHRoZSBkb20uIHRoZW4gb25jZSBldmVyeXRoaW5nIGlzIGxvYWRlZCwgaXQgYWRkcyBjbGFzcyBhY3RpdmUgdG8gbWFrZSB0aGVtIGFwcGVhciB2aWEgY3NzXHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2YXIgZmxleF9ncmlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodm0uZmxleF9ncmlkX2lkKTtcclxuICAgIHdoaWxlIChmbGV4X2dyaWQuZmlyc3RDaGlsZCkge1xyXG4gICAgICBmbGV4X2dyaWQucmVtb3ZlQ2hpbGQoZmxleF9ncmlkLmZpcnN0Q2hpbGQpO1xyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5za2lsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdm0uc2tpbGxzW2ldLmFwcGVuZCgpO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyBwdWJsaWMgY2xvc2UoKXtcclxuICAvLyAgIGNvbnN0IHZtID0gdGhpcztcclxuICAvLyAgIHZhciBmbGV4X2dyaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh2bS5mbGV4X2dyaWRfaWQpO1xyXG4gIC8vICAgd2hpbGUgKGZsZXhfZ3JpZC5maXJzdENoaWxkKSB7XHJcbiAgLy8gICAgIGZsZXhfZ3JpZC5yZW1vdmVDaGlsZChmbGV4X2dyaWQuZmlyc3RDaGlsZCk7XHJcbiAgLy8gICB9XHJcbiAgLy8gfVxyXG59XHJcbiJdfQ==
