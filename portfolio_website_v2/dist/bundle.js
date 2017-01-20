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
        demo_title.appendChild(document.createTextNode('Live Demo'));
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
    { title: 'Breathless', title_image: './portfolio/breathless.jpg', desc: "The Space Pirate, Aria, is on a mission to loot a mineral cargo ship. However, upon landing on the cargo ship, Aria's helmet cracks causing her to slowly lose oxygen. It's now a race against time to collect all the gems before her oxygen runs out!", stack: breathless_stack, media: m[0], type: 'HTML5 Game', url: '' },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvanVtcC5qcy9kaXN0L2p1bXAuanMiLCJzcmMvaW1hZ2VfY2FudmFzLnRzIiwic3JjL21haW4udHMiLCJzcmMvbWVkaWEudHMiLCJzcmMvc2tpbGxfYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QVksR0FBRyxFQUFFLENBQUM7UUFDckIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN4QyxDQUFDO0lBQ0gsQ0FBQztJQUVNLHlCQUFJLEdBQVg7UUFDRSxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDekQsT0FBTyxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDNUIsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUNELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMxQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3hCLENBQUM7SUFDSCxDQUFDO0lBUUgsaUJBQUM7QUFBRCxDQXJEQSxBQXFEQyxJQUFBO0FBckRZLGdDQUFVIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGdsb2JhbC5KdW1wID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4vLyBSb2JlcnQgUGVubmVyJ3MgZWFzZUluT3V0UXVhZFxuXG4vLyBmaW5kIHRoZSByZXN0IG9mIGhpcyBlYXNpbmcgZnVuY3Rpb25zIGhlcmU6IGh0dHA6Ly9yb2JlcnRwZW5uZXIuY29tL2Vhc2luZy9cbi8vIGZpbmQgdGhlbSBleHBvcnRlZCBmb3IgRVM2IGNvbnN1bXB0aW9uIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qYXhnZWxsZXIvZXouanNcblxudmFyIGVhc2VJbk91dFF1YWQgPSBmdW5jdGlvbiBlYXNlSW5PdXRRdWFkKHQsIGIsIGMsIGQpIHtcbiAgdCAvPSBkIC8gMjtcbiAgaWYgKHQgPCAxKSByZXR1cm4gYyAvIDIgKiB0ICogdCArIGI7XG4gIHQtLTtcbiAgcmV0dXJuIC1jIC8gMiAqICh0ICogKHQgLSAyKSAtIDEpICsgYjtcbn07XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqO1xufSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG59O1xuXG52YXIganVtcGVyID0gZnVuY3Rpb24ganVtcGVyKCkge1xuICAvLyBwcml2YXRlIHZhcmlhYmxlIGNhY2hlXG4gIC8vIG5vIHZhcmlhYmxlcyBhcmUgY3JlYXRlZCBkdXJpbmcgYSBqdW1wLCBwcmV2ZW50aW5nIG1lbW9yeSBsZWFrc1xuXG4gIHZhciBlbGVtZW50ID0gdm9pZCAwOyAvLyBlbGVtZW50IHRvIHNjcm9sbCB0byAgICAgICAgICAgICAgICAgICAobm9kZSlcblxuICB2YXIgc3RhcnQgPSB2b2lkIDA7IC8vIHdoZXJlIHNjcm9sbCBzdGFydHMgICAgICAgICAgICAgICAgICAgIChweClcbiAgdmFyIHN0b3AgPSB2b2lkIDA7IC8vIHdoZXJlIHNjcm9sbCBzdG9wcyAgICAgICAgICAgICAgICAgICAgIChweClcblxuICB2YXIgb2Zmc2V0ID0gdm9pZCAwOyAvLyBhZGp1c3RtZW50IGZyb20gdGhlIHN0b3AgcG9zaXRpb24gICAgICAocHgpXG4gIHZhciBlYXNpbmcgPSB2b2lkIDA7IC8vIGVhc2luZyBmdW5jdGlvbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbilcbiAgdmFyIGExMXkgPSB2b2lkIDA7IC8vIGFjY2Vzc2liaWxpdHkgc3VwcG9ydCBmbGFnICAgICAgICAgICAgIChib29sZWFuKVxuXG4gIHZhciBkaXN0YW5jZSA9IHZvaWQgMDsgLy8gZGlzdGFuY2Ugb2Ygc2Nyb2xsICAgICAgICAgICAgICAgICAgICAgKHB4KVxuICB2YXIgZHVyYXRpb24gPSB2b2lkIDA7IC8vIHNjcm9sbCBkdXJhdGlvbiAgICAgICAgICAgICAgICAgICAgICAgIChtcylcblxuICB2YXIgdGltZVN0YXJ0ID0gdm9pZCAwOyAvLyB0aW1lIHNjcm9sbCBzdGFydGVkICAgICAgICAgICAgICAgICAgICAobXMpXG4gIHZhciB0aW1lRWxhcHNlZCA9IHZvaWQgMDsgLy8gdGltZSBzcGVudCBzY3JvbGxpbmcgdGh1cyBmYXIgICAgICAgICAgKG1zKVxuXG4gIHZhciBuZXh0ID0gdm9pZCAwOyAvLyBuZXh0IHNjcm9sbCBwb3NpdGlvbiAgICAgICAgICAgICAgICAgICAocHgpXG5cbiAgdmFyIGNhbGxiYWNrID0gdm9pZCAwOyAvLyB0byBjYWxsIHdoZW4gZG9uZSBzY3JvbGxpbmcgICAgICAgICAgICAoZnVuY3Rpb24pXG5cbiAgLy8gc2Nyb2xsIHBvc2l0aW9uIGhlbHBlclxuXG4gIGZ1bmN0aW9uIGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB3aW5kb3cuc2Nyb2xsWSB8fCB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gIH1cblxuICAvLyBlbGVtZW50IG9mZnNldCBoZWxwZXJcblxuICBmdW5jdGlvbiB0b3AoZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHN0YXJ0O1xuICB9XG5cbiAgLy8gckFGIGxvb3AgaGVscGVyXG5cbiAgZnVuY3Rpb24gbG9vcCh0aW1lQ3VycmVudCkge1xuICAgIC8vIHN0b3JlIHRpbWUgc2Nyb2xsIHN0YXJ0ZWQsIGlmIG5vdCBzdGFydGVkIGFscmVhZHlcbiAgICBpZiAoIXRpbWVTdGFydCkge1xuICAgICAgdGltZVN0YXJ0ID0gdGltZUN1cnJlbnQ7XG4gICAgfVxuXG4gICAgLy8gZGV0ZXJtaW5lIHRpbWUgc3BlbnQgc2Nyb2xsaW5nIHNvIGZhclxuICAgIHRpbWVFbGFwc2VkID0gdGltZUN1cnJlbnQgLSB0aW1lU3RhcnQ7XG5cbiAgICAvLyBjYWxjdWxhdGUgbmV4dCBzY3JvbGwgcG9zaXRpb25cbiAgICBuZXh0ID0gZWFzaW5nKHRpbWVFbGFwc2VkLCBzdGFydCwgZGlzdGFuY2UsIGR1cmF0aW9uKTtcblxuICAgIC8vIHNjcm9sbCB0byBpdFxuICAgIHdpbmRvdy5zY3JvbGxUbygwLCBuZXh0KTtcblxuICAgIC8vIGNoZWNrIHByb2dyZXNzXG4gICAgdGltZUVsYXBzZWQgPCBkdXJhdGlvbiA/IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCkgLy8gY29udGludWUgc2Nyb2xsIGxvb3BcbiAgICA6IGRvbmUoKTsgLy8gc2Nyb2xsaW5nIGlzIGRvbmVcbiAgfVxuXG4gIC8vIHNjcm9sbCBmaW5pc2hlZCBoZWxwZXJcblxuICBmdW5jdGlvbiBkb25lKCkge1xuICAgIC8vIGFjY291bnQgZm9yIHJBRiB0aW1lIHJvdW5kaW5nIGluYWNjdXJhY2llc1xuICAgIHdpbmRvdy5zY3JvbGxUbygwLCBzdGFydCArIGRpc3RhbmNlKTtcblxuICAgIC8vIGlmIHNjcm9sbGluZyB0byBhbiBlbGVtZW50LCBhbmQgYWNjZXNzaWJpbGl0eSBpcyBlbmFibGVkXG4gICAgaWYgKGVsZW1lbnQgJiYgYTExeSkge1xuICAgICAgLy8gYWRkIHRhYmluZGV4IGluZGljYXRpbmcgcHJvZ3JhbW1hdGljIGZvY3VzXG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcblxuICAgICAgLy8gZm9jdXMgdGhlIGVsZW1lbnRcbiAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICAvLyBpZiBpdCBleGlzdHMsIGZpcmUgdGhlIGNhbGxiYWNrXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG5cbiAgICAvLyByZXNldCB0aW1lIGZvciBuZXh0IGp1bXBcbiAgICB0aW1lU3RhcnQgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIEFQSVxuXG4gIGZ1bmN0aW9uIGp1bXAodGFyZ2V0KSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgLy8gcmVzb2x2ZSBvcHRpb25zLCBvciB1c2UgZGVmYXVsdHNcbiAgICBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb24gfHwgMTAwMDtcbiAgICBvZmZzZXQgPSBvcHRpb25zLm9mZnNldCB8fCAwO1xuICAgIGNhbGxiYWNrID0gb3B0aW9ucy5jYWxsYmFjazsgLy8gXCJ1bmRlZmluZWRcIiBpcyBhIHN1aXRhYmxlIGRlZmF1bHQsIGFuZCB3b24ndCBiZSBjYWxsZWRcbiAgICBlYXNpbmcgPSBvcHRpb25zLmVhc2luZyB8fCBlYXNlSW5PdXRRdWFkO1xuICAgIGExMXkgPSBvcHRpb25zLmExMXkgfHwgZmFsc2U7XG5cbiAgICAvLyBjYWNoZSBzdGFydGluZyBwb3NpdGlvblxuICAgIHN0YXJ0ID0gbG9jYXRpb24oKTtcblxuICAgIC8vIHJlc29sdmUgdGFyZ2V0XG4gICAgc3dpdGNoICh0eXBlb2YgdGFyZ2V0ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZih0YXJnZXQpKSB7XG4gICAgICAvLyBzY3JvbGwgZnJvbSBjdXJyZW50IHBvc2l0aW9uXG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBlbGVtZW50ID0gdW5kZWZpbmVkOyAvLyBubyBlbGVtZW50IHRvIHNjcm9sbCB0b1xuICAgICAgICBhMTF5ID0gZmFsc2U7IC8vIG1ha2Ugc3VyZSBhY2Nlc3NpYmlsaXR5IGlzIG9mZlxuICAgICAgICBzdG9wID0gc3RhcnQgKyB0YXJnZXQ7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBzY3JvbGwgdG8gZWxlbWVudCAobm9kZSlcbiAgICAgIC8vIGJvdW5kaW5nIHJlY3QgaXMgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBlbGVtZW50ID0gdGFyZ2V0O1xuICAgICAgICBzdG9wID0gdG9wKGVsZW1lbnQpO1xuICAgICAgICBicmVhaztcblxuICAgICAgLy8gc2Nyb2xsIHRvIGVsZW1lbnQgKHNlbGVjdG9yKVxuICAgICAgLy8gYm91bmRpbmcgcmVjdCBpcyByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnRcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG4gICAgICAgIHN0b3AgPSB0b3AoZWxlbWVudCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIHJlc29sdmUgc2Nyb2xsIGRpc3RhbmNlLCBhY2NvdW50aW5nIGZvciBvZmZzZXRcbiAgICBkaXN0YW5jZSA9IHN0b3AgLSBzdGFydCArIG9mZnNldDtcblxuICAgIC8vIHJlc29sdmUgZHVyYXRpb25cbiAgICBzd2l0Y2ggKF90eXBlb2Yob3B0aW9ucy5kdXJhdGlvbikpIHtcbiAgICAgIC8vIG51bWJlciBpbiBtc1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uO1xuICAgICAgICBicmVhaztcblxuICAgICAgLy8gZnVuY3Rpb24gcGFzc2VkIHRoZSBkaXN0YW5jZSBvZiB0aGUgc2Nyb2xsXG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbihkaXN0YW5jZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIHN0YXJ0IHRoZSBsb29wXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgfVxuXG4gIC8vIGV4cG9zZSBvbmx5IHRoZSBqdW1wIG1ldGhvZFxuICByZXR1cm4ganVtcDtcbn07XG5cbi8vIGV4cG9ydCBzaW5nbGV0b25cblxudmFyIHNpbmdsZXRvbiA9IGp1bXBlcigpO1xuXG5yZXR1cm4gc2luZ2xldG9uO1xuXG59KSkpO1xuIiwiZXhwb3J0ICogZnJvbSBcIi4vaW1hZ2VfY2FudmFzXCI7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxlcnAoZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyLCBwZXJjZW50OiBudW1iZXIpIHtcclxuICB2YXIgZGlmZmVyYW5jZSA9IHRvIC0gZnJvbTtcclxuICByZXR1cm4gZnJvbSArIChkaWZmZXJhbmNlICogcGVyY2VudCk7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSW1nIHtcclxuICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gIGltYWdlOiBIVE1MSW1hZ2VFbGVtZW50XHJcbiAgdzogbnVtYmVyO1xyXG4gIGg6IG51bWJlcjtcclxuICB4X29mZnNldF9kZXN0OiBudW1iZXI7XHJcbiAgeV9vZmZzZXRfZGVzdDogbnVtYmVyO1xyXG4gIHhfb2Zmc2V0OiBudW1iZXI7XHJcbiAgeV9vZmZzZXQ6IG51bWJlcjtcclxuICBhbmNob3JYOiBudW1iZXI7XHJcbiAgYW5jaG9yWTogbnVtYmVyO1xyXG5cclxuICBpbWdXaWR0aDogbnVtYmVyO1xyXG4gIHNjcmVlbldpZHRoOiBudW1iZXI7XHJcbiAgc2NhbGVYOiBudW1iZXI7XHJcbiAgc2NhbGVZOiBudW1iZXI7XHJcbiAgc2NhbGU6IG51bWJlcjtcclxuICBpbWdIZWlnaHQ6IG51bWJlcjtcclxuICBzY3JlZW5IZWlnaHQ6IG51bWJlcjtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2bS5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIHZtLmN0eCA9IHZtLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgdm0udyA9IHZtLmNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgdm0uaCA9IHZtLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB2bS5pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgdm0uaW1hZ2Uuc3JjID0gJ2NpdHkuanBnJztcclxuXHJcbiAgICB2bS5pbWFnZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAvKmdldHMgc2NhbGVYIGJhc2VkIG9uIHNjcmVlbiBhbmQgaW1hZ2Ugd2lkdGggKi9cclxuICAgICAgdm0uaW1nV2lkdGggPSB2bS5pbWFnZS5uYXR1cmFsV2lkdGg7XHJcbiAgICAgIHZtLnNjcmVlbldpZHRoID0gdm0uY2FudmFzLndpZHRoO1xyXG4gICAgICB2bS5zY2FsZVggPSAxO1xyXG4gICAgICB2bS5zY2FsZVggPSB2bS5zY3JlZW5XaWR0aCAvIHZtLmltZ1dpZHRoO1xyXG5cclxuICAgICAgLypnZXRzIHNjYWxlWSBiYXNlZCBvbiBzY3JlZW4gYW5kIGltYWdlIHdpZHRoICovXHJcbiAgICAgIHZtLmltZ0hlaWdodCA9IHZtLmltYWdlLm5hdHVyYWxIZWlnaHQ7XHJcbiAgICAgIHZtLnNjcmVlbkhlaWdodCA9IHZtLmNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgIHZtLnNjYWxlWSA9IDE7XHJcbiAgICAgIHZtLnNjYWxlWSA9IHZtLnNjcmVlbkhlaWdodCAvIHZtLmltZ0hlaWdodDtcclxuXHJcblxyXG4gICAgICAvKnNldHMgYmFzaWMgc2NhbGUgdG8gWCAqL1xyXG5cclxuICAgICAgdm0uc2NhbGUgPSB2bS5zY2FsZVhcclxuICAgICAgaWYgKHZtLnNjYWxlWCA8IHZtLnNjYWxlWSkge1xyXG4gICAgICAgIHZtLnNjYWxlID0gdm0uc2NhbGVZO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2bS5pbWdXaWR0aCAqPSB2bS5zY2FsZSAqIDEuMDU7XHJcbiAgICAgIHZtLmltZ0hlaWdodCAqPSB2bS5zY2FsZSAqIDEuMDU7XHJcblxyXG4gICAgICB2bS5hbmNob3JYID0gKHZtLmltZ1dpZHRoIC0gdm0uc2NyZWVuV2lkdGgpO1xyXG4gICAgICB2bS5hbmNob3JZID0gKHZtLmltZ0hlaWdodCAtIHZtLnNjcmVlbkhlaWdodCk7XHJcblxyXG4gICAgICB2bS54X29mZnNldF9kZXN0ID0gdm0ueF9vZmZzZXQgPSB2bS5hbmNob3JYO1xyXG4gICAgICB2bS55X29mZnNldF9kZXN0ID0gdm0ueV9vZmZzZXQgPSB2bS5hbmNob3JZO1xyXG5cclxuXHJcblxyXG4gICAgICB2bS5kcmF3KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhdygpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIC8vIHZtLmN0eC5jbGVhclJlY3QoMCwwLHZtLncsIHZtLmgpO1xyXG5cclxuICAgIHZtLmN0eC5kcmF3SW1hZ2Uodm0uaW1hZ2UsIHZtLnhfb2Zmc2V0LCB2bS55X29mZnNldCwgdm0uaW1hZ2UubmF0dXJhbFdpZHRoLCB2bS5pbWFnZS5uYXR1cmFsSGVpZ2h0LCAwLCAwLCB2bS5pbWdXaWR0aCwgdm0uaW1nSGVpZ2h0KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBcHAge1xyXG4gIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgdzogbnVtYmVyO1xyXG4gIGg6IG51bWJlcjtcclxuICAvLyByZWN0OiBSZWN0YW5nbGVcclxuICBpbWc6IEltZztcclxuXHJcbiAgbW91c2VJbjogYm9vbGVhbjtcclxuICBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICB2bS5jYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xyXG4gICAgdm0uY3R4ID0gdm0uY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgdm0uc2l6ZUNhbnZhcygpO1xyXG4gICAgdm0uaW5pdEV2ZW50cygpO1xyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodCkgPT4geyB2bS5kcmF3KHQpOyB9KTtcclxuXHJcbiAgICB2bS5pbWcgPSBuZXcgSW1nKHZtLncsIHZtLmgpO1xyXG5cclxuICAgIHZtLm1vdXNlSW4gPSBmYWxzZTtcclxuXHJcbiAgICB2bS5jb250YWluZXIgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcy1jb250YWluZXInKTtcclxuXHJcbiAgICB2bS5jb250YWluZXIub25tb3VzZW1vdmUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2bS5kcmF3SW1nSW4oMCwgZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdm0uY29udGFpbmVyLm9ubW91c2VlbnRlciA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZtLm1vdXNlSW4gPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHZtLmNvbnRhaW5lci5vbm1vdXNlb3V0ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdm0ubW91c2VJbiA9IGZhbHNlO1xyXG4gICAgICB2bS5kcmF3SW1nT3V0KDAsIGUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2l6ZUNhbnZhcygpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZtLmNhbnZhcy5zdHlsZS53aWR0aCA9ICcxMDAlJztcclxuICAgIHZtLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XHJcbiAgICB0aGlzLncgPSB0aGlzLmNhbnZhcy53aWR0aCA9IHZtLmNhbnZhcy5vZmZzZXRXaWR0aDtcclxuICAgIHRoaXMuaCA9IHRoaXMuY2FudmFzLmhlaWdodCA9IHZtLmNhbnZhcy5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gIH1cclxuICBwdWJsaWMgZHJhdyh0OiBhbnkpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHQpID0+IHsgdGhpcy5kcmF3KHQpOyB9KTtcclxuICAgIHZtLmN0eC5jbGVhclJlY3QoMCwgMCwgdm0udywgdm0uaCk7XHJcblxyXG4gICAgdm0uY3R4LmRyYXdJbWFnZSh2bS5pbWcuY2FudmFzLCAwLCAwKTtcclxuICAgIHZtLmltZy5kcmF3KCk7XHJcblxyXG5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3SW1nSW4odDogYW55LCBlOiBhbnkpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcblxyXG4gICAgLypyYXRpbyA9IChpbWdXaWR0aCAvIHNjcmVlbldpZHRoKSAgKi9cclxuXHJcbiAgICB2YXIgbW92ZVJhdGlvWCA9IChlLmNsaWVudFggLyB2bS5pbWcuc2NyZWVuV2lkdGgpOyAvL3JhbmdlIGZyb20gWzAsIDFdOiAwIGJlaW5nIGxlZnQsIDEgYmVpbmcgcmlnaHRcclxuICAgIHZhciBtb3ZlT2Zmc2V0WCA9IC12bS5pbWcuYW5jaG9yWCArIChtb3ZlUmF0aW9YICogdm0uaW1nLmFuY2hvclggKiAyKTtcclxuXHJcbiAgICB2YXIgbW92ZVJhdGlvWSA9IChlLmNsaWVudFkgLyB2bS5pbWcuc2NyZWVuSGVpZ2h0KSAqIDI7IC8vcmFuZ2UgZnJvbSBbMCwgMV06IDAgYmVpbmcgbGVmdCwgMSBiZWluZyByaWdodFxyXG4gICAgdmFyIG1vdmVPZmZzZXRZID0gLXZtLmltZy5hbmNob3JZICsgKG1vdmVSYXRpb1kgKiB2bS5pbWcuYW5jaG9yWSk7XHJcblxyXG5cclxuICAgIC8qb2Zmc2V0ID0gbWlkZGxlX2FuY2hvciArIGRyYWdnZWRfb2Zmc2V0Ki9cclxuICAgIHZtLmltZy54X29mZnNldF9kZXN0ID0gdm0uaW1nLmFuY2hvclggKyBtb3ZlT2Zmc2V0WDtcclxuICAgIHZtLmltZy55X29mZnNldF9kZXN0ID0gdm0uaW1nLmFuY2hvclkgKyBtb3ZlT2Zmc2V0WTtcclxuXHJcbiAgICBpZiAodm0ubW91c2VJbiA9PT0gdHJ1ZSAmJiBNYXRoLnJvdW5kKHZtLmltZy55X29mZnNldCkgIT09IE1hdGgucm91bmQodm0uaW1nLnlfb2Zmc2V0X2Rlc3QpICYmIE1hdGgucm91bmQodm0uaW1nLnhfb2Zmc2V0KSAhPT0gTWF0aC5yb3VuZCh2bS5pbWcueF9vZmZzZXRfZGVzdCkpIHtcclxuXHJcblxyXG4gICAgICB2bS5pbWcueF9vZmZzZXQgPSBNYXRoLnJvdW5kKGxlcnAodm0uaW1nLnhfb2Zmc2V0LCB2bS5pbWcueF9vZmZzZXRfZGVzdCwgMC4xKSk7XHJcbiAgICAgIHZtLmltZy55X29mZnNldCA9IE1hdGgucm91bmQobGVycCh2bS5pbWcueV9vZmZzZXQsIHZtLmltZy55X29mZnNldF9kZXN0LCAwLjEpKTtcclxuXHJcbiAgICAgIC8vIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHQpID0+IHsgdm0uZHJhd0ltZ0luKHQsIGUpIH0pO1xyXG5cclxuXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd0ltZ091dCh0OiBhbnksIGU6IGFueSkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgIC8qcmF0aW8gPSAoaW1nV2lkdGggLyBzY3JlZW5XaWR0aCkgICovXHJcblxyXG4gICAgLy8gdmFyIG1vdmVSYXRpb1ggPSAoZS5jbGllbnRYIC8gdm0uaW1nLnNjcmVlbldpZHRoKTsgLy9yYW5nZSBmcm9tIFswLCAxXTogMCBiZWluZyBsZWZ0LCAxIGJlaW5nIHJpZ2h0XHJcbiAgICAvLyB2YXIgbW92ZU9mZnNldFggPSAtdm0uaW1nLmFuY2hvclggKyAobW92ZVJhdGlvWCAqIHZtLmltZy5hbmNob3JYICogMik7XHJcblxyXG4gICAgLy8gdmFyIG1vdmVSYXRpb1kgPSAoZS5jbGllbnRZIC8gdm0uaW1nLnNjcmVlbkhlaWdodCkgKiAyOyAvL3JhbmdlIGZyb20gWzAsIDFdOiAwIGJlaW5nIGxlZnQsIDEgYmVpbmcgcmlnaHRcclxuICAgIC8vIHZhciBtb3ZlT2Zmc2V0WSA9IC12bS5pbWcuYW5jaG9yWSArIChtb3ZlUmF0aW9ZICogdm0uaW1nLmFuY2hvclkpO1xyXG5cclxuXHJcbiAgICAvKm9mZnNldCA9IG1pZGRsZV9hbmNob3IgKyBkcmFnZ2VkX29mZnNldCovXHJcbiAgICB2bS5pbWcueF9vZmZzZXRfZGVzdCA9IHZtLmltZy5hbmNob3JYO1xyXG4gICAgdm0uaW1nLnlfb2Zmc2V0X2Rlc3QgPSB2bS5pbWcuYW5jaG9yWTtcclxuXHJcbiAgICBpZiAodm0ubW91c2VJbiA9PT0gZmFsc2UgJiYgTWF0aC5yb3VuZCh2bS5pbWcueV9vZmZzZXQpICE9PSBNYXRoLnJvdW5kKHZtLmltZy55X29mZnNldF9kZXN0KSAmJiBNYXRoLnJvdW5kKHZtLmltZy54X29mZnNldCkgIT09IE1hdGgucm91bmQodm0uaW1nLnhfb2Zmc2V0X2Rlc3QpKSB7XHJcblxyXG5cclxuICAgICAgdm0uaW1nLnhfb2Zmc2V0ID0gbGVycCh2bS5pbWcueF9vZmZzZXQsIHZtLmltZy54X29mZnNldF9kZXN0LCAwLjEpO1xyXG4gICAgICB2bS5pbWcueV9vZmZzZXQgPSBsZXJwKHZtLmltZy55X29mZnNldCwgdm0uaW1nLnlfb2Zmc2V0X2Rlc3QsIDAuMSk7XHJcblxyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0KSA9PiB7IHZtLmRyYXdJbWdPdXQodCwgZSkgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGluaXRFdmVudHMoKSB7XHJcbiAgICB3aW5kb3cub25yZXNpemUgPSAoZSkgPT4ge1xyXG4gICAgICB0aGlzLnNpemVDYW52YXMoKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxufSIsImltcG9ydCAqIGFzIGp1bXAgZnJvbSBcImp1bXAuanNcIjtcclxuXHJcbmltcG9ydCAqIGFzIGltYWdlX2NhbnZhcyBmcm9tIFwiLi9pbWFnZV9jYW52YXNcIjtcclxuXHJcbmltcG9ydCAqIGFzIHNraWxsX2JhZGdlIGZyb20gXCIuL3NraWxsX2JhZGdlXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBtZWRpYSBmcm9tIFwiLi9tZWRpYVwiO1xyXG5cclxuLy95b29cclxuY29uc3QgdGltZW91dDpudW1iZXIgPSAxMDAwO1xyXG5cclxudmFyIGZyb250ZW5kID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICdmbGV4LWdyaWQxJywgWyAge1wibmFtZVwiOiAnSFRNTDUnLCAgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMTAwJywgXCJpbWFnZVwiOidodG1sNS5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnSmF2YSBTY3JpcHQnLCAgICAgXCJjbGFzc1wiOidjaXJjbGUtMTAwJywgXCJpbWFnZVwiOidqYXZhc2NyaXB0LTIuc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0Jvb3RzdHJhcCcsICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjonYm9vdHN0cmFwLTQuc3ZnJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnQW5ndWxhciBKUycsICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNzUnLCBcImltYWdlXCI6J2FuZ3VsYXItaWNvbi5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnVHlwZSBTY3JpcHQnLCAgICAgXCJjbGFzc1wiOidjaXJjbGUtNzUnLCBcImltYWdlXCI6J3R5cGVzY3JpcHQuc3ZnJ30sICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdHdWxwJywgICAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS03NScsIFwiaW1hZ2VcIjonZ3VscC5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnQ1NTMycsICAgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J2Nzcy0zLnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdqUXVlcnknLCAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS01MCcsIFwiaW1hZ2VcIjonanF1ZXJ5LTEuc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ1NDU1MnLCAgICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTUwJywgXCJpbWFnZVwiOidzYXNzLTEuc3ZnJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnRDMuanMnLCAgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMjUnLCBcImltYWdlXCI6J2QzLTIuc3ZnJ31dLCAnZnJvbnRlbmQnKTtcclxudmFyIHNvZnRlbmcgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJ2ZsZXgtZ3JpZDInLCAgICBbe1wibmFtZVwiOiAnSmF2YScsICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS03NScsIFwiaW1hZ2VcIjonamF2YS0xNC5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdQeXRob24nLCAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTUwJywgXCJpbWFnZVwiOidweXRob24tNS5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdDKysnLCAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0yNScsIFwiaW1hZ2VcIjonYy1zZWVrbG9nby5jb20uc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnTm9kZSBKUycsICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTI1JywgXCJpbWFnZVwiOidub2RlanMtaWNvbi5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdDIycsICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTI1JywgXCJpbWFnZVwiOidjc2hhcnAuc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnVW5pdHknLCAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0yNScsIFwiaW1hZ2VcIjondW5pdHkuc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnQW5kcm9pZCBTdHVkaW8nLCAgXCJjbGFzc1wiOidjaXJjbGUtMjUnLCBcImltYWdlXCI6J0FuZHJvaWRfc3R1ZGlvLnN2Zyd9XSwgJ3NvZnRlbmcnKTtcclxudmFyIGRlc2lnbiA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnZmxleC1ncmlkMycsICAgICAgIFt7XCJuYW1lXCI6ICdQaG90b3Nob3AnLCAgICAgICBcImNsYXNzXCI6J2NpcmNsZS01MCcsIFwiaW1hZ2VcIjoncGhvdG9zaG9wLWNjLnN2Zyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnSWxsdXN0cmF0b3InLCAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J2Fkb2JlLWlsbHVzdHJhdG9yLWNjLnN2Zyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnTWF5YScsICAgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J21heWEucG5nJ30sICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0FmdGVyIEVmZmVjdHMnLCAgIFwiY2xhc3NcIjonY2lyY2xlLTI1JywgXCJpbWFnZVwiOidhZnRlci1lZmZlY3RzLWNjLnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ011ZGJveCcsICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTI1JywgXCJpbWFnZVwiOidtdWRib3gucG5nJ31dLCAnZGVzaWduJyk7XHJcbmZyb250ZW5kLmxvYWQoKTtcclxuc29mdGVuZy5sb2FkKCk7XHJcbmRlc2lnbi5sb2FkKCk7XHJcblxyXG5cclxudmFyIGFwcCA9IG5ldyBpbWFnZV9jYW52YXMuQXBwKCk7XHJcblxyXG5cclxuLy8gd2luZG93Lm9uc2Nyb2xsID0gZnVuY3Rpb24oKXtcclxuLy8gICAgIGNvbnNvbGUubG9nKHdpbmRvdy5zY3JvbGxZKTtcclxuLy8gfVxyXG5cclxuXHJcbi8vIHZhciB3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3cmFwcGVyLTBcIik7XHJcbi8vIHZhciBiID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3AxJyk7XHJcblxyXG5cclxuLy8gYi5vbmNsaWNrID0gZnVuY3Rpb24oKXtcclxuLy8gICAgIGlmKHcuY2xhc3NMaXN0WzFdID09PSBcIm9wZW5cIil7XHJcbi8vICAgICAgICAgdy5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XHJcbi8vICAgICB9IGVsc2Uge1xyXG4vLyAgICAgICAgIHcuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xyXG4vLyAgICAgfVxyXG4vLyB9XHJcblxyXG5leHBvcnQgY2xhc3MgUG9ydGZvbGlvSXRlbSB7XHJcbiAgICB0aXRsZTogc3RyaW5nOyBcclxuICAgIHRpdGxlX2ltYWdlOiBzdHJpbmc7IFxyXG4gICAgZGVzYzogc3RyaW5nO1xyXG4gICAgc3RhY2s6IHNraWxsX2JhZGdlLkNvbGxlY3Rpb247IFxyXG4gICAgcG9ydF9pbWFnZTogc3RyaW5nO1xyXG4gICAgdXJsOiBzdHJpbmc7XHJcbiAgICBcclxuICAgIGl0ZW1fbnVtOiBudW1iZXI7XHJcblxyXG4gICAgY29sX3NpemU6IHN0cmluZztcclxuICAgIGNvbDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICB0ZXh0OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHN1Yl90ZXh0OiBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBvcGVuOiBib29sZWFuO1xyXG4gICAgbWVkaWE6bWVkaWEuTWVkaWE7XHJcbiAgICB0YXJnZXRfd3JhcHBlcjogV3JhcHBlcjtcclxuICAgIHBvcnRmb2xpbzogUG9ydGZvbGlvO1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKHBvcnRmb2xpbzogUG9ydGZvbGlvLCBpdGVtX251bTogbnVtYmVyLCAgdGl0bGU6IHN0cmluZywgdGl0bGVfaW1hZ2U6IHN0cmluZywgZGVzYzogc3RyaW5nLCBzdGFjazogc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbiwgbWVkaWE6bWVkaWEuTWVkaWEsIHR5cGU6IHN0cmluZywgdXJsOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICB2bS5wb3J0Zm9saW8gPSBwb3J0Zm9saW87XHJcbiAgICB2bS5pdGVtX251bSA9IGl0ZW1fbnVtO1xyXG4gICAgdm0udGl0bGUgPSB0aXRsZTtcclxuICAgIHZtLnRpdGxlX2ltYWdlID0gdGl0bGVfaW1hZ2U7XHJcbiAgICB2bS5kZXNjID0gZGVzYztcclxuICAgIHZtLnN0YWNrID0gc3RhY2s7XHJcbiAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgdm0udXJsID0gdXJsO1xyXG4gICAgdm0uY29sX3NpemUgPSBcImNvbC1tZC0zXCI7XHJcbiAgICBcclxuXHJcbiAgICB2bS5jb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHZtLmNvbC5jbGFzc0xpc3QuYWRkKHZtLmNvbF9zaXplKTtcclxuXHJcbiAgICB2YXIgY2FyZF9zaGFkb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGNhcmRfc2hhZG93LmNsYXNzTGlzdC5hZGQoJ2NhcmQtZHJvcHNoYWRvdycsICdyb3cnKTtcclxuXHJcbiAgICB2YXIgbm9wYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIG5vcGFkLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsJ25vcGFkJyk7XHJcblxyXG4gICAgdm0uaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICB2bS5pbWcuc3JjID0gdm0udGl0bGVfaW1hZ2U7XHJcblxyXG4gICAgdmFyIGNvbDEyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBjb2wxMi5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInKTtcclxuXHJcbiAgICB2bS50ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB2bS50ZXh0LmNsYXNzTGlzdC5hZGQoJ3RleHQnLCAncGFkZGluZy10b3AnKTtcclxuICAgIHZtLnRleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGl0bGUpKTtcclxuXHJcbiAgICB2YXIgY29sMTJfMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgY29sMTJfMi5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInKTtcclxuXHJcbiAgICB2bS5zdWJfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdm0uc3ViX3RleHQuY2xhc3NMaXN0LmFkZCgndGV4dF9saWdodCcpO1xyXG4gICAgdm0uc3ViX3RleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodHlwZSkpO1xyXG5cclxuICAgIC8vIC5jb2wtbWQtM1xyXG4gICAgLy8gICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpI3AxXHJcbiAgICAvLyAgICAgICAudGV4dCBCcmVhdGhsZXNzOiBIVE1MNSBHYW1lXHJcblxyXG4gICAgLy8gLmNvbC1tZC0zXHJcbiAgICAvLyAgICAgICAuY2FyZC1kcm9wc2hhZG93LnJvd1xyXG4gICAgLy8gICAgICAgICAuY29sLW1kLTEyLm5vcGFkXHJcbiAgICAvLyAgICAgICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpI3AxLmRyb3BzaGFkb3dcclxuICAgIC8vICAgICAgICAgLmNvbC1tZC0xMlxyXG4gICAgLy8gICAgICAgICAgIC50ZXh0IEJyZWF0aGxlc3NcclxuICAgIC8vICAgICAgICAgLmNvbC1tZC0xMlxyXG4gICAgLy8gICAgICAgICAgIC50ZXh0X2xpZ2h0IEhUTUw1IEdhbWVcclxuXHJcbiAgICB2bS5jb2wuYXBwZW5kQ2hpbGQoY2FyZF9zaGFkb3cpO1xyXG4gICAgY2FyZF9zaGFkb3cuYXBwZW5kQ2hpbGQobm9wYWQpO1xyXG4gICAgbm9wYWQuYXBwZW5kQ2hpbGQodm0uaW1nKTtcclxuICAgIGNhcmRfc2hhZG93LmFwcGVuZENoaWxkKGNvbDEyKTtcclxuICAgIGNvbDEyLmFwcGVuZENoaWxkKHZtLnRleHQpO1xyXG4gICAgY2FyZF9zaGFkb3cuYXBwZW5kQ2hpbGQoY29sMTJfMik7XHJcbiAgICBjb2wxMl8yLmFwcGVuZENoaWxkKHZtLnN1Yl90ZXh0KTtcclxuXHJcbiAgICB2bS5vcGVuID0gZmFsc2U7XHJcbiAgICBcclxuICAgIHZtLmNvbC5vbmNsaWNrID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAvLyAgIGNvbnNvbGUuKHZtLml0ZW1zWzBdKTtcclxuICAgICAgICB2YXIgZGlmZmVyZW50X3dyYXBwZXIgPSBmYWxzZTtcclxuICAgICAgICBjb25zb2xlLmxvZyh2bS5tZWRpYSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZGlmZmVyZW50X3dyYXBwZXIgPSB2bS5wb3J0Zm9saW8uY2xvc2Uodm0uaXRlbV9udW0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZtLm9wZW4gPSB2bS50YXJnZXRfd3JhcHBlci50cmFuc2l0aW9uV3JhcHBlcihkaWZmZXJlbnRfd3JhcHBlciwgdm0ub3Blbiwgdm0udGl0bGUsIHZtLmRlc2MsIHZtLnN0YWNrLCB2bS5tZWRpYSwgdm0udXJsKVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vICAgdm0uc2V0RGF0YSgpOyAgXHJcbiAgICAgIH1cclxuICAgIFxyXG4gIH1cclxuICBhcHBlbmQocm93OiBudW1iZXIsIHdyYXBwZXI6IFdyYXBwZXIpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZhciByb3dfZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb3dfJytyb3cpO1xyXG4gICAgXHJcbiAgICByb3dfZWxlbWVudC5hcHBlbmRDaGlsZCh2bS5jb2wpO1xyXG4gICAgdm0udGFyZ2V0X3dyYXBwZXIgPSB3cmFwcGVyO1xyXG4gICAgdm0uc3RhY2suZmxleF9ncmlkX2lkID0gd3JhcHBlci5mbGV4X2dyaWQuaWQ7XHJcbiAgICB2bS5tZWRpYS5pZCA9ICdtZWRpYS0nK3JvdztcclxuICAgIGNvbnNvbGUubG9nKHZtLm1lZGlhKTtcclxuICB9XHJcbiAgc2V0Q29sKGNsYXNzTmFtZTogc3RyaW5nKXtcclxuICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICB2bS5jb2wuY2xhc3NMaXN0LnJlbW92ZSh2bS5jb2xfc2l6ZSk7XHJcbiAgICAgIHZtLmNvbF9zaXplID0gY2xhc3NOYW1lO1xyXG4gICAgICB2bS5jb2wuY2xhc3NMaXN0LmFkZCh2bS5jb2xfc2l6ZSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBQb3J0Zm9saW8ge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAganNvbl9vYmpzOiBJUG9ydGZvbGlvSXRlbVtdO1xyXG4gIHBhdGg6IHN0cmluZztcclxuICBpdGVtczogUG9ydGZvbGlvSXRlbVtdO1xyXG4gIHdyYXBwZXJzOiBXcmFwcGVyW107XHJcbiAgZmxleF9ncmlkX2lkOiBzdHJpbmc7XHJcbiAgcGVyX3JvdzpudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGpzb25fb2JqczogSVBvcnRmb2xpb0l0ZW1bXSkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdm0uaWQgPSBpZDtcclxuICAgIHZtLmpzb25fb2JqcyA9IGpzb25fb2JqcztcclxuICAgICBcclxuXHJcbiAgICB2bS5pdGVtcyA9IFtdO1xyXG4gICAgdm0ud3JhcHBlcnMgPSBbXTtcclxuXHJcbiAgICAvL2FkZCB3cmFwcGVycyBiYXNlZCBvbiBhbGwgcG9zc2libGUgYnJlYWtwb2ludCB3aWR0aHMgKGpzb25fb2Jqcy8yKVxyXG4gICAgZm9yKHZhciBqID0gMDsgaiA8IE1hdGguY2VpbChqc29uX29ianMubGVuZ3RoLzIpOyBqKyspe1xyXG4gICAgICAgIHZtLndyYXBwZXJzLnB1c2gobmV3IFdyYXBwZXIoaikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vYWRkIGFsbCBpdGVtc1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5qc29uX29ianMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdm0uaXRlbXMucHVzaChuZXcgUG9ydGZvbGlvSXRlbSh2bSwgaSwganNvbl9vYmpzW2ldLnRpdGxlLCBqc29uX29ianNbaV0udGl0bGVfaW1hZ2UsIGpzb25fb2Jqc1tpXS5kZXNjLCBqc29uX29ianNbaV0uc3RhY2ssIGpzb25fb2Jqc1tpXS5tZWRpYSwganNvbl9vYmpzW2ldLnR5cGUsIGpzb25fb2Jqc1tpXS51cmwpKTtcclxuICAgIH1cclxuXHJcbiAgICB2bS5hcHBlbmRBbGwoKTtcclxuXHJcbiAgICBcclxuICB9XHJcblxyXG4gICAgcHVibGljIGFwcGVuZEFsbCgpeyAvL2FwcGVuZHMgUG9ydGZvbGlvSXRlbXMgYmFzZWQgb24gc2NyZWVuIHNpemU7IGdldHMgZGlnZXN0ZWRcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHNjcmVlbldpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICAgICAgY29uc29sZS5sb2coc2NyZWVuV2lkdGgpO1xyXG5cclxuICAgICAgICAvL3JlYXNzaWducyBjb2xzIGJhc2VkIG9uIGJyZWFrcG9pbnRzXHJcbiAgICAgICAgdmFyIGJyZWFrcG9pbnRzID0gW3ttaW46IDAsIG1heDo3NjgsIGNvbF9zaXplOiAnY29sLXhzLTYnLCBwZXJfcm93OiAyfSx7bWluOiA3NjksIG1heDo5OTIsIGNvbF9zaXplOiAnY29sLXhzLTQnLCBwZXJfcm93OiAzfSwge21pbjogOTkzLCBtYXg6MTIwMCwgY29sX3NpemU6ICdjb2wteHMtMycsIHBlcl9yb3c6IDR9LCB7bWluOiAxMjAwLCBtYXg6OTk5OSwgY29sX3NpemU6ICdjb2wteHMtMycsIHBlcl9yb3c6IDR9XTtcclxuICAgICAgICBmb3IodmFyIGk9MDsgaTxicmVha3BvaW50cy5sZW5ndGg7IGkrKyl7XHJcblxyXG4gICAgICAgICAgICAvL2lmIGluIGJyZWFrcG9pbnQgcmFuZ2UsIGFuZCBub3Qgc2FtZSBhcyBiZWZvcmVcclxuICAgICAgICAgICAgaWYoLyp2bS5pdGVtc1swXS5jb2xfc2l6ZSAhPT0gYnJlYWtwb2ludHNbaV0uY29sX3NpemUgJiYgKi9zY3JlZW5XaWR0aCA+IGJyZWFrcG9pbnRzW2ldLm1pbiAmJiBzY3JlZW5XaWR0aCA8IGJyZWFrcG9pbnRzW2ldLm1heCl7XHJcbiAgICAgICAgICAgICAgICAvL2NsZWFyIGFsbCByb3dzXHJcbiAgICAgICAgICAgICAgICB2bS5wZXJfcm93ID0gYnJlYWtwb2ludHNbaV0ucGVyX3JvdztcclxuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9ydGZvbGlvJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBwYXJlbnQuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBhID0gMTsgYSA8IGl0ZXJhdG9yOyBhKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYXJlbnQuY2hpbGRyZW5bMV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vYWRkIG5ldyByb3dzIGFuZCB3cmFwcGVyc1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciByID0gMDsgciA8IE1hdGguY2VpbCh2bS5pdGVtcy5sZW5ndGggLyBicmVha3BvaW50c1tpXS5wZXJfcm93KTsgcisrKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93LmlkID0gJ3Jvd18nK3I7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93LmNsYXNzTGlzdC5hZGQoJ3JvdycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgd3JhcHBlciA9IHZtLndyYXBwZXJzW3JdLmh0bWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChyb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vYWRkIGNvbHMgdG8gbmV3IHJvd3NcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaj0wOyBqPHZtLml0ZW1zLmxlbmd0aDsgaisrKXtcclxuICAgICAgICAgICAgICAgICAgICB2bS5pdGVtc1tqXS5zZXRDb2woYnJlYWtwb2ludHNbaV0uY29sX3NpemUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3dfbnVtID0gTWF0aC5mbG9vcihqL2JyZWFrcG9pbnRzW2ldLnBlcl9yb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLml0ZW1zW2pdLmFwcGVuZChyb3dfbnVtLCB2bS53cmFwcGVyc1tyb3dfbnVtXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gIHB1YmxpYyBjbG9zZShpdGVtX251bTogbnVtYmVyKSB7IC8vY2xvc2VzIGFsbCB3cmFwcGVyc1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgLy9jbG9zZXMgYWxsIGl0ZW1zIGluIHRoZSByb3cgb2YgdGhlIGdpdmVuIGl0ZW0uXHJcbiAgICB2YXIgcm93ID0gTWF0aC5mbG9vcihpdGVtX251bS92bS5wZXJfcm93KTtcclxuXHJcbiAgICAvLyBmb3IodmFyIGogPSAocm93KnZtLnBlcl9yb3cpOyBqIDwgKChyb3cqdm0ucGVyX3Jvdykrdm0ucGVyX3Jvdyk7IGorKyl7XHJcbiAgICAvLyAgICAgaWYoaXRlbV9udW0gIT09IGogJiYgdm0uaXRlbXNbal0pe1xyXG4gICAgLy8gICAgICAgICB2bS5pdGVtc1tqXS5vcGVuID0gZmFsc2U7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG4gICAgdmFyIHJldHVybl92YWx1ZSA9IGZhbHNlO1xyXG5cclxuICAgIGZvcih2YXIgaiA9IDA7IGogPCB2bS5pdGVtcy5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgaWYoaXRlbV9udW0gIT09IGogJiYgdm0uaXRlbXNbal0pe1xyXG4gICAgICAgICAgICB2bS5pdGVtc1tqXS5vcGVuID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yKHZhciByID0gMDsgciA8IHZtLndyYXBwZXJzLmxlbmd0aDsgcisrKXtcclxuICAgICAgICBpZihyICE9PSByb3cgJiYgdm0ud3JhcHBlcnNbcl0uaHRtbC5jbGFzc0xpc3RbMV0gPT09ICdvcGVuJyl7XHJcbiAgICAgICAgICAgIHZtLndyYXBwZXJzW3JdLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldHVybl92YWx1ZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXcmFwcGVyIHtcclxuICAgIHRpdGxlOiBzdHJpbmc7IFxyXG4gICAgZGVzYzogc3RyaW5nO1xyXG4gICAgY29sbGVjdGlvbjogc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbjtcclxuICAgIHBvcnRfaW1hZ2U6IHN0cmluZzsgXHJcbiAgICBtZWRpYTogbWVkaWEuTWVkaWE7XHJcbiAgICB1cmw6IHN0cmluZztcclxuICAgIFxyXG5cclxuICAgIGh0bWw6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICB0aXRsZV9lbGVtZW50OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgZGVzY3JpcHRpb246SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBzdGFjazpIVE1MRGl2RWxlbWVudDtcclxuICAgIGZsZXhfZ3JpZDpIVE1MRGl2RWxlbWVudDtcclxuICAgIGRlbW86SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb2w1OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgZGVzY3JpcHRpb25fdGV4dDogVGV4dDtcclxuICAgIHRpdGxlX2VsZW1lbnRfdGV4dDogVGV4dDtcclxuICAgIGxpbms6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBsaW5rX3RleHQ6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb2w2OkhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIGNoYW5nZTpib29sZWFuO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihyb3dfbnVtKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZtLmNoYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgIC8vIHZtLnRpdGxlID0gcEl0ZW0udGl0bGU7XHJcbiAgICAgICAgLy8gdm0uZGVzYyA9IHBJdGVtLmRlc2M7XHJcbiAgICAgICAgLy8gdm0uc3RhY2sgPSBwSXRlbS5zdGFjaztcclxuICAgICAgICAvLyB2bS5wb3J0X2ltYWdlID0gcEl0ZW0ucG9ydF9pbWFnZTtcclxuICAgICAgICB2bS5odG1sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uaHRtbC5pZCA9ICd3cmFwcGVyLScrcm93X251bTtcclxuICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5hZGQoJ3dyYXBwZXInKTtcclxuXHJcbiAgICAgICAgdmFyIHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHJvdy5pZCA9ICdjb250ZW50JztcclxuICAgICAgICByb3cuY2xhc3NMaXN0LmFkZCgncm93JywgJ25vbWFyJyk7XHJcblxyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS50aXRsZV9lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdkZXNjLXRleHQnLCAncGFkLXNwYWNpbmcnKTtcclxuICAgICAgICB2bS50aXRsZV9lbGVtZW50X3RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XHJcbiAgICAgICAgdm0udGl0bGVfZWxlbWVudC5hcHBlbmRDaGlsZCh2bS50aXRsZV9lbGVtZW50X3RleHQpO1xyXG5cclxuICAgICAgICB2YXIgY29sNiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbDYuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2NvbC1tZC02JywgJ2NvbC1sZy03JywgJ3JvdycsICdub21hcicsICdub3BhZCcpO1xyXG5cclxuICAgICAgICB2YXIgcm93X2ZpbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICByb3dfZmlsbC5jbGFzc0xpc3QuYWRkKCdyb3cnLCdqdXN0aWZ5LWNlbnRlcicsICdub21hcicpO1xyXG5cclxuICAgICAgICB2YXIgY29sMTIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb2wxMi5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInKTtcclxuXHJcbiAgICAgICAgdm0uY29sNiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmNvbDYuaWQgPSAnbWVkaWEtJytyb3dfbnVtO1xyXG4gICAgICAgIHZtLmNvbDYuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2NvbC1tZC02JywgJ2NvbC1sZy01Jyk7XHJcblxyXG4gICAgICAgIHZhciBjb2wzXzIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb2wzXzIuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2NvbC1tZC0zJywgJ25vcGFkLWxlZnQnKTtcclxuXHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5kZXNjcmlwdGlvbi5jbGFzc0xpc3QuYWRkKCdoZWFkZXItdGV4dCcsICdwYWQtc3BhY2luZycpO1xyXG4gICAgICAgIHZtLmRlc2NyaXB0aW9uLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdEZXNjcmlwdGlvbicpKTtcclxuXHJcbiAgICAgICAgdmFyIGRlc2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkZXNjLmNsYXNzTGlzdC5hZGQoJ2Rlc2NyaXB0aW9uLXRleHQnLCAncGFkLXNwYWNpbmcnKTtcclxuICAgICAgICB2bS5kZXNjcmlwdGlvbl90ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xyXG4gICAgICAgIGRlc2MuYXBwZW5kQ2hpbGQodm0uZGVzY3JpcHRpb25fdGV4dCk7XHJcblxyXG4gICAgICAgIHZtLnN0YWNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uc3RhY2suY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2NvbC1tZC0xMicsICdjb2wtbGctNycpO1xyXG4gICAgICAgIC8vIHZtLnN0YWNrLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdTdGFjaycpKTtcclxuXHJcbiAgICAgICAgdmFyIHN0YWNrX3RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgc3RhY2tfdGl0bGUuY2xhc3NMaXN0LmFkZCgnaGVhZGVyLXRleHQnLCAncGFkLXNwYWNpbmcnKVxyXG4gICAgICAgIHN0YWNrX3RpdGxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdTdGFjaycpKTtcclxuXHJcbiAgICAgICAgdm0uZmxleF9ncmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uZmxleF9ncmlkLmlkID0gJ3BmbGV4LWdyaWQtJytyb3dfbnVtO1xyXG4gICAgICAgIHZtLmZsZXhfZ3JpZC5jbGFzc0xpc3QuYWRkKCdyb3cnLCdwb3J0Zm9saW8tZmxleCcsICdjb2wteHMtMTInKTtcclxuXHJcbiAgICAgICAgdm0uZGVtbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmRlbW8uY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2NvbC1tZC0xMicsICdjb2wtbGctNScpO1xyXG4gICAgICAgIC8vIHZtLmRlbW8uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0xpdmUgRGVtbycpKTtcclxuXHJcbiAgICAgICAgdmFyIGRlbW9fdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkZW1vX3RpdGxlLmNsYXNzTGlzdC5hZGQoJ2hlYWRlci10ZXh0JywgJ3BhZC1zcGFjaW5nJylcclxuICAgICAgICBkZW1vX3RpdGxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdMaXZlIERlbW8nKSk7XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICB2bS5saW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0ubGluay5jbGFzc0xpc3QuYWRkKCdnaXRodWItYnV0dG9uJywncm93JywgJ25vbWFyJyk7XHJcblxyXG4gICAgICAgIHZtLmxpbmtfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmxpbmtfdGV4dC5jbGFzc0xpc3QuYWRkKCd0ZXh0Jyk7XHJcbiAgICAgICAgdm0ubGlua190ZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdMaXZlIExpbmsnKSk7ICAgICAgICBcclxuXHJcbiAgICAgICAgdm0uY29sNSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmNvbDUuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2NvbC1tZC01Jyk7XHJcblxyXG4gICAgICAgIC8qIEdPTk5BIEhBVkUgVE8gQUREIE1FRElBIERZTkFNSUNBTExZICovXHJcblxyXG4gICAgICAgIHZtLmh0bWwuYXBwZW5kQ2hpbGQocm93KTtcclxuICAgICAgICByb3cuYXBwZW5kQ2hpbGQodm0udGl0bGVfZWxlbWVudCk7XHJcbiAgICAgICAgcm93LmFwcGVuZENoaWxkKHZtLmNvbDYpO1xyXG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZChjb2w2KTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBjb2w2LmFwcGVuZENoaWxkKGNvbDEyKTtcclxuICAgICAgICBjb2wxMi5hcHBlbmRDaGlsZCh2bS5kZXNjcmlwdGlvbik7XHJcbiAgICAgICAgY29sMTIuYXBwZW5kQ2hpbGQoZGVzYyk7XHJcbiAgICAgICAgY29sNi5hcHBlbmRDaGlsZCh2bS5zdGFjaylcclxuICAgICAgICB2bS5zdGFjay5hcHBlbmRDaGlsZChzdGFja190aXRsZSk7XHJcbiAgICAgICAgdm0uc3RhY2suYXBwZW5kQ2hpbGQodm0uZmxleF9ncmlkKTtcclxuICAgICAgICBjb2w2LmFwcGVuZENoaWxkKHZtLmRlbW8pXHJcbiAgICAgICAgdm0uZGVtby5hcHBlbmRDaGlsZChkZW1vX3RpdGxlKTtcclxuICAgICAgICB2bS5kZW1vLmFwcGVuZENoaWxkKHZtLmxpbmspO1xyXG4gICAgICAgIHZtLmxpbmsuYXBwZW5kQ2hpbGQodm0ubGlua190ZXh0KTtcclxuICAgICAgICBcclxuICAgICAgICB2bS5saW5rLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2bS51cmwpO1xyXG4gICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gdm0udXJsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8jd3JhcHBlci0wLndyYXBwZXIub3BlblxyXG4gICAgICAgIC8vIC5yb3cjY29udGVudFxyXG4gICAgICAgIC8vICAgLmNvbC1tZC0xMi5kZXNjLXRleHQgQnJlYXRobGVzc1xyXG4gICAgICAgIC8vICAgLmNvbC1tZC02I21lZGlhLTBcclxuICAgICAgICAvLyAgIC5jb2wtbWQtNi5yb3dcclxuICAgICAgICAvLyAgICAgICAuY29sLW1kLTEyXHJcbiAgICAgICAgLy8gICAgICAgICAuaGVhZGVyLXRleHQucGFkZGluZy1sZWZ0IERlc2NyaXB0aW9uOlxyXG4gICAgICAgIC8vICAgICAgICAgLmRlc2NyaXB0aW9uLXRleHQucGFkZGluZy1sZWZ0IGFzZGZhc2RmXHJcbiAgICAgICAgLy8gICAgICAgLmNvbC1tZC02LmhlYWRlci10ZXh0IFN0YWNrOlxyXG4gICAgICAgIC8vICAgICAgIC5jb2wtbWQtNi5oZWFkZXItdGV4dCBMaXZlIERlbW86XHJcblxyXG4gICAgICAgIHZtLmh0bWwuYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgaWYodm0uY2hhbmdlKXtcclxuICAgICAgICAgICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgdm0uc2V0RGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgdm0uY2hhbmdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgfVxyXG4gICAgLy8gY2xvc2VEYXRhKCl7XHJcbiAgICAvLyAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgLy8gICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgIC8vICAgICAgICAgdm0uY29sbGVjdGlvbi5jbG9zZSgpO1xyXG4gICAgLy8gICAgIH0sdGltZW91dCk7XHJcbiAgICAgICAgXHJcbiAgICAvLyB9XHJcblxyXG4gICAgc2V0RGF0YSgpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5zZXRUaXRsZSgpO1xyXG4gICAgICAgIHZtLnNldERlc2MoKTtcclxuICAgICAgICB2bS5zZXRTdGFjaygpO1xyXG4gICAgICAgIHZtLnNldE1lZGlhKCk7XHJcbiAgICAgICAgLy8gdm0uc2V0U3RhY2soc3RhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFRpdGxlKCl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnRfdGV4dC50ZXh0Q29udGVudCA9IHZtLnRpdGxlO1xyXG4gICAgfVxyXG4gICAgc2V0RGVzYygpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5kZXNjcmlwdGlvbl90ZXh0LnRleHRDb250ZW50ID0gdm0uZGVzYztcclxuICAgIH1cclxuXHJcbiAgICBzZXRTdGFjaygpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5jb2xsZWN0aW9uLnJlc2V0SWRzKHZtLmZsZXhfZ3JpZC5pZCk7XHJcbiAgICAgICAgdm0uY29sbGVjdGlvbi5sb2FkKCk7XHJcbiAgICB9XHJcbiAgICBzZXRNZWRpYSgpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5tZWRpYS5zZXRJZCh2bS5tZWRpYS5pZCk7XHJcbiAgICAgICAgdm0ubWVkaWEubG9hZE1lZGlhKDApO1xyXG4gICAgfVxyXG4gICAgY2xvc2UoKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XHJcbiAgICB9XHJcbiAgICBjaGFuZ2VXcmFwcGVyKG9wZW46IGJvb2xlYW4sIHRpdGxlLCBkZXNjLCBzdGFjaywgbWVkaWEsIHVybCl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIC8vY2xvc2Ugd3JhcHBlcjpcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodm0udGl0bGUgPT09IHRpdGxlKXsgLyoqaWYgbm8gY2hhbmdlICovXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcxJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG9wZW4pO1xyXG4gICAgICAgICAgICB2bS5jaGFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKG9wZW4pe1xyXG4gICAgICAgICAgICAgICAgLy8gdm0uY2xvc2VEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZtLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgICAgICAgICB2bS5kZXNjID0gZGVzYztcclxuICAgICAgICAgICAgICAgIHZtLmNvbGxlY3Rpb24gPSBzdGFjaztcclxuICAgICAgICAgICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgICAgICAgICB2bS51cmwgPSB1cmw7XHJcbiAgICAgICAgICAgICAgICB2bS5zZXREYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmKHZtLmh0bWwuY2xhc3NMaXN0WzFdICE9PSAnb3BlbicpeyAvKippZiBhbGwgc2VsZWN0aW9ucyBhcmUgY2xvc2VkIGluaXRpYWxseS9jaGFuZ2Ugd2hlbiBjbG9zZWQqL1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnMicpO1xyXG4gICAgICAgICAgICB2bS5jaGFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgdm0udGl0bGUgPSB0aXRsZTtcclxuICAgICAgICAgICAgdm0uZGVzYyA9IGRlc2M7XHJcbiAgICAgICAgICAgIHZtLmNvbGxlY3Rpb24gPSBzdGFjaztcclxuICAgICAgICAgICAgdm0ubWVkaWEgPSBtZWRpYTtcclxuICAgICAgICAgICAgdm0udXJsID0gdXJsO1xyXG4gICAgICAgICAgICB2bS5zZXREYXRhKCk7XHJcbiAgICAgICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnMycpO1xyXG4gICAgICAgICAgICB2bS5jaGFuZ2UgPSB0cnVlO1xyXG4gICAgICAgICAgICB2bS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgICAgICB2bS5kZXNjID0gZGVzYztcclxuICAgICAgICAgICAgdm0uY29sbGVjdGlvbiA9IHN0YWNrO1xyXG4gICAgICAgICAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgICAgICAgICB2bS51cmwgPSB1cmw7XHJcbiAgICAgICAgICAgIC8vIHZtLmNsb3NlRGF0YSgpO1xyXG4gICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2l0aW9uV3JhcHBlcihkaWZmZXJlbnRfd3JhcHBlcjpib29sZWFuLCBvcGVuOiBib29sZWFuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHJldHVybl92YWx1ZTtcclxuXHJcbiAgICAgICAgaWYoZGlmZmVyZW50X3dyYXBwZXIpe1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5fdmFsdWUgPSB2bS5jaGFuZ2VXcmFwcGVyKG9wZW4sIHRpdGxlLCBkZXNjLCBzdGFjaywgbWVkaWEsIHVybCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGltZW91dDogJysgcmV0dXJuX3ZhbHVlKTsgXHJcbiAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xyXG4gICAgICAgIH0gZWxzZSBpZihvcGVuID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICBvcGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuX3ZhbHVlID0gdm0uY2hhbmdlV3JhcHBlcihvcGVuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHZtLmNoYW5nZVdyYXBwZXIob3BlbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSwgdXJsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3JldHVybl92YWx1ZTogJytyZXR1cm5fdmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByZXR1cm5fdmFsdWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBvcnRmb2xpb0l0ZW0ge1xyXG4gIHRpdGxlOiBzdHJpbmc7XHJcbiAgdGl0bGVfaW1hZ2U6IHN0cmluZzsgXHJcbiAgZGVzYzogc3RyaW5nO1xyXG4gIHN0YWNrOiBza2lsbF9iYWRnZS5Db2xsZWN0aW9uO1xyXG4gIG1lZGlhOiBtZWRpYS5NZWRpYTsgXHJcbiAgdHlwZTogc3RyaW5nO1xyXG4gIHVybDogc3RyaW5nO1xyXG59XHJcblxyXG4vLyB7XCJuYW1lXCI6ICdQeXRob24nLCAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTUwJywgXCJpbWFnZVwiOidweXRob24tNS5zdmcnfVxyXG52YXIgYnJlYXRobGVzc19zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgWyAgIHtcIm5hbWVcIjogJ1BoYXNlci5qcycsICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjoncGhhc2VyLnN2Zyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdQaG90b3Nob3AnLCAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0xMDAnLCBcImltYWdlXCI6J3Bob3Rvc2hvcC1jYy5zdmcnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnalF1ZXJ5JywgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J2pxdWVyeS0xLnN2Zyd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG52YXIgcWJlcnRfc3RhY2sgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJycsIFsgICB7XCJuYW1lXCI6ICdNYXlhJywgICAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0xMDAnLCBcImltYWdlXCI6J21heWEucG5nJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ1Bob3Rvc2hvcCcsICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTI1JywgXCJpbWFnZVwiOidwaG90b3Nob3AtY2Muc3ZnJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiB2YXIgd2VhdGhlcl9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgWyAgIHtcIm5hbWVcIjogJ0FuZ3VsYXIgSlMnLCAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjonYW5ndWxhci1pY29uLnN2Zyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIHZhciBicmVhdGhsZXNzX21lZGlhID0gbmV3IG1lZGlhLk1lZGlhKCdtZWRpYS0wJywgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9jYXQuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzE5ODE0OTc5NVwiIHdpZHRoPVwiNDcxXCIgaGVpZ2h0PVwiMzM1XCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+Jyk7XHJcbiAgIFxyXG52YXIgbSA9IFtdXHJcblxyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX3BsYXkuanBnXCIsIFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheV8yLmpwZ1wiLFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheS5qcGdcIixcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfY29udHJvbHMuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX3BsYXkuanBnXCIsIFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheV8yLmpwZ1wiLFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheS5qcGdcIixcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfY29udHJvbHMuanBnXCJdKSk7XHJcblxyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbXCIuL3BvcnRmb2xpby9xYmVydF9wbGF5LmpwZ1wiLFwiLi9wb3J0Zm9saW8vcWJlcnRfcGxheWVyLmpwZ1wiLFwiLi9wb3J0Zm9saW8vcWJlcnRfc25ha2UuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9xYmVydF9wbGF5ZXIuanBnXCIsXCIuL3BvcnRmb2xpby9xYmVydF9zbmFrZS5qcGdcIl0sICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8xOTgxNDk3OTVcIiB3aWR0aD1cIjQ3MVwiIGhlaWdodD1cIjMzNVwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicpKTtcclxuXHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFtcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8xLnBuZ1wiLFwiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzMucG5nXCIsXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMi5wbmdcIl0sIFtcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8xLnBuZ1wiLFwiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzMucG5nXCIsXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMi5wbmdcIl0pKTtcclxuXHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vbWVhbl9mb3JlY2FzdF8xLmpwZycsICcuL3BvcnRmb2xpby9tZWFuX2ZvcmVjYXN0XzIuanBnJ10sIFsnLi9wb3J0Zm9saW8vbWVhbl9mb3JlY2FzdF8xLmpwZycsICcuL3BvcnRmb2xpby9tZWFuX2ZvcmVjYXN0XzIuanBnJ10pKVxyXG5cclxudmFyIHBvcnRmb2xpbyA9IG5ldyBQb3J0Zm9saW8oJ3BvcnRmb2xpbycsIFtcclxuICAgIHt0aXRsZTogJ0JyZWF0aGxlc3MnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnJywgZGVzYzpcIlRoZSBTcGFjZSBQaXJhdGUsIEFyaWEsIGlzIG9uIGEgbWlzc2lvbiB0byBsb290IGEgbWluZXJhbCBjYXJnbyBzaGlwLiBIb3dldmVyLCB1cG9uIGxhbmRpbmcgb24gdGhlIGNhcmdvIHNoaXAsIEFyaWEncyBoZWxtZXQgY3JhY2tzIGNhdXNpbmcgaGVyIHRvIHNsb3dseSBsb3NlIG94eWdlbi4gSXQncyBub3cgYSByYWNlIGFnYWluc3QgdGltZSB0byBjb2xsZWN0IGFsbCB0aGUgZ2VtcyBiZWZvcmUgaGVyIG94eWdlbiBydW5zIG91dCFcIiwgc3RhY2s6YnJlYXRobGVzc19zdGFjaywgbWVkaWE6IG1bMF0sIHR5cGU6ICdIVE1MNSBHYW1lJywgdXJsIDogJyd9LFxyXG4gICAge3RpdGxlOiAnTWVhbiBGb3JlY2FzdCcsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vbWVhbl9mb3JlY2FzdF8xLmpwZycsIGRlc2M6J0Egc21hbGwgd2ViIGFwcCB0aGF0IGNhbGN1bGF0ZXMgdGhlIGF2ZXJhZ2Ugb2YgMyB3ZWF0aGVyIEFQSVxcJ3M6IFd1bmRlcmdyb3VuZCwgRm9yZWNhc3QuaW8sIGFuZCBXb3JsZCBXZWF0aGVyIE9ubGluZS4gVGhlIHdlYmFwcCBpdHNlbGYgaGFzIG1hbnkgc3VidGxldGllcyB0aGF0IGFyZSBhZmZlY3RlZCBieSB3ZWF0aGVyIGRhdGEuIEZvciBleGFtcGxlLCB0aGUgdmlkZW8gIHJlc2VtYmxlcyB0aGUgY3VycmVudCB3ZWF0aGVyLiBBbHNvIGVhY2ggZ3JhcGggaXMgY29sb3IgY29hdGVkIGJ5IGEgZ3JhZGllbnQgYmFzZWQgb24gdGhlIHdlYXRoZXIgZGF0YS4nLCBzdGFjazp3ZWF0aGVyX3N0YWNrLCBtZWRpYTogbVszXSwgdHlwZTogJ1dlYnNpdGUnLCB1cmwgOiAnL21lYW5mb3JlY2FzdCd9LFxyXG4gICAge3RpdGxlOiAnUSpCZXJ0JywgdGl0bGVfaW1hZ2U6IFwiLi9wb3J0Zm9saW8vcWJlcnRfcGxheS5qcGdcIiwgZGVzYzonVGhpcyBpcyBteSBCb3VuY2luZyBCYWxsIEFzc2lnbm1lbnQgZm9yIEFuaW1hdGlvbiAxIGF0IERyZXhlbCBVbml2ZXJzaXR5LiBXaGVuIHBpY2tpbmcgYSBnYW1lIHRoYXQgbWl4ZXMgbXkgbG92ZSBvZiByZXRybyB2aWRlbyBnYW1lcyBhbmQgYm91bmNpbmcgYmFsbHMsIFEqQmVydCB3YXMgYSBuby1icmFpbmVyLiBFdmVyeXRoaW5nIGlzIGluZGl2aWR1YWxseSBtb2RlbGxlZCwgdGV4dHVyZWQsIGFuZCBhbmltYXRlZCBieSBtZS4gTWFkZSBpbiBNYXlhLCBhbmQgcmVuZGVyZWQgaW4gVi1SYXkuJywgc3RhY2s6cWJlcnRfc3RhY2ssIG1lZGlhOiBtWzFdLCB0eXBlOiAnQW5pbWF0aW9uJywgdXJsIDogJ2h0dHBzOi8vdmltZW8uY29tLzE5ODE0OTc5NSd9LFxyXG4gICAge3RpdGxlOiAnQmVkcm9vbScsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzEucG5nJywgZGVzYzonVGhpcyBpcyBteSBmaW5hbCBmb3IgQ0dJIDIgYXQgRHJleGVsIFVuaXZlcnNpdHkuIFRoZSBhc3NpZ25tZW50IHdhcyB0byByZWNyZWF0ZSBhbnkgdHlwZSBvZiByb29tLCBzbyBJIGNob3NlIGEgbGl0dGxlIGJveVxcJ3Mgcm9vbS4gV2Ugd2VyZSB0YXNrZWQgd2l0aCBjcmVhdGluZyBhdCBsZWFzdCBvbmUgY29tcGxleCBvYmplY3QsIHNvIEkgZGVjaWRlZCB0byBnbyB3aXRoIGEgdHJhaW4gc2V0LicsIHN0YWNrOnFiZXJ0X3N0YWNrLCBtZWRpYTogbVsyXSwgdHlwZTogJzNEIFJlbmRlcicsIHVybDonJ31dKTtcclxuXHJcblxyXG52YXIgd2VsY29tZV9iID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlbGNvbWUtYnV0dG9uJyk7XHJcbndlbGNvbWVfYi5vbmNsaWNrID0gZnVuY3Rpb24oKXtcclxuICAgIGp1bXAoJyNwb3J0Zm9saW8nLHtcclxuICAgICAgICBkdXJhdGlvbjoxMDAwLFxyXG4gICAgICAgIG9mZnNldDowLFxyXG4gICAgICAgIGNhbGxiYWNrOiB1bmRlZmluZWQsXHJcbiAgICAgICAgZWFzaW5nOiBqdW1wLmVhc2VJbk91dFF1YWQsXHJcbiAgICAgICAgYWxseTogZmFsc2VcclxuICAgIH0pXHJcbn1cclxuXHJcblxyXG4vKiogXHJcbiAqIHBvcnRmb2xpbyB3ZWJzaXRlXHJcbiAqIGJyZWF0aGxlc3NcclxuICogd2VhdGhlciB3ZWJzaXRlXHJcbiAqIHFiZXJ0IGFuaW1hdGlvblxyXG4gKiBjZ2kgMiBmaW5hbD8/IFxyXG4gKiBcclxuKi9cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLy8gdmFyIG1lZGlhID0gbmV3IE1lZGlhKCdtZWRpYS0wJywgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9jYXQuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiLCBcIi4vcG9ydGZvbGlvL2NhdC5qcGdcIl0pO1xyXG5cclxuIiwiZXhwb3J0ICogZnJvbSBcIi4vbWVkaWFcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNZWRpYUl0ZW17XHJcbiAgICBtZWRpYTogTWVkaWE7XHJcbiAgICBodG1sOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIG9yZGVyOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihtZWRpYTogTWVkaWEsIGh0bWw6SFRNTERpdkVsZW1lbnQsIG9yZGVyOiBudW1iZXIpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgICAgIHZtLmh0bWwgPSBodG1sO1xyXG4gICAgICAgIHZtLm9yZGVyID0gb3JkZXI7XHJcbiAgICAgICAgdm0uaHRtbC5vbmNsaWNrID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdm0ubWVkaWEubG9hZE1lZGlhKHZtLm9yZGVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNZWRpYSB7XHJcbiAgICBpZDpzdHJpbmdcclxuICAgIGVsZW1lbnRzOiBhbnlbXTtcclxuICAgIHRodW1ibmFpbHM6IEhUTUxJbWFnZUVsZW1lbnRbXTtcclxuICAgIG1lZGlhX2l0ZW1zOiBNZWRpYUl0ZW1bXTtcclxuICAgIHNlbGVjdGVkOiBudW1iZXI7XHJcbiAgICB2aW1lbzpzdHJpbmc7XHJcblxyXG4gICAgcm93OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgb3ZlcmxheTpIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbG1kOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgXHJcbiAgICBtZWRpYV9zZWxlY3RlZDpIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIHRodW1ibmFpbHM6IHN0cmluZ1tdLCBmaWxlcz86IHN0cmluZ1tdLCB2aW1lbz86IHN0cmluZyl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmlkID0gaWQ7XHJcbiAgICAgICAgdm0uc2VsZWN0ZWQgPSAwO1xyXG4gICAgICAgIHZtLmVsZW1lbnRzID0gW107XHJcbiAgICAgICAgdm0ubWVkaWFfaXRlbXMgPSBbXTtcclxuICAgICAgICB2bS50aHVtYm5haWxzID0gW107XHJcblxyXG4gICAgICAgIHZtLnZpbWVvID0gdmltZW87XHJcbiAgICAgICAgaWYodmltZW8pe1xyXG4gICAgICAgICAgICAgICAgdmFyIGZyYWcgPSB2bS5jcmVhdGVGcmFnbWVudCh2aW1lbyk7XHJcbiAgICAgICAgICAgICAgICB2bS5lbGVtZW50cy5wdXNoKGZyYWcpO1xyXG4gICAgICAgICAgICAgICAgLy8gdm0uZWxlbWVudHNbaV0uY2xhc3NMaXN0LmFkZCgnZHJvcHNoYWRvdycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHZtLmVsZW1lbnRzLmxlbmd0aDtcclxuICAgICAgICBpZihmaWxlcyl7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxyXG4gICAgICAgICAgICAgICAgaW1hZ2Uuc3JjID0gZmlsZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpbWFnZS5jbGFzc0xpc3QuYWRkKCdkcm9wc2hhZG93Jyk7XHJcbiAgICAgICAgICAgICAgICB2bS5lbGVtZW50cy5wdXNoKGltYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5tZWRpYV9zZWxlY3RlZC5pZCA9ICdtZWRpYS1zZWxlY3RlZCc7XHJcblxyXG4gICAgICAgIHZtLm92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5vdmVybGF5LmNsYXNzTGlzdC5hZGQoJ292ZXJsYXktbWVkaWEnKTtcclxuXHJcbiAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQuYXBwZW5kQ2hpbGQodm0ub3ZlcmxheSk7XHJcblxyXG4gICAgICAgIHZtLnJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnJvdy5jbGFzc0xpc3QuYWRkKCdyb3cnLCdqdXN0aWZ5LWNlbnRlcicsJ21lZGlhLWNvbnRhaW5lcicpO1xyXG5cclxuICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgdm0uZWxlbWVudHMubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgICAgICB2bS5jb2xtZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICB2bS5jb2xtZC5jbGFzc0xpc3QuYWRkKCdjb2wteHMnKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBodG1sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICAgICAgaHRtbC5jbGFzc0xpc3QuYWRkKCdtZWRpYS1pdGVtJyk7XHJcbiAgICAgICAgICAgIHZhciBtZWRpYV9pdGVtID0gbmV3IE1lZGlhSXRlbSh2bSxodG1sLGopO1xyXG4gICAgICAgICAgICB2bS5tZWRpYV9pdGVtcy5wdXNoKG1lZGlhX2l0ZW0pO1xyXG5cclxuICAgICAgICAgICAgdm0udGh1bWJuYWlscy5wdXNoKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpKTtcclxuICAgICAgICAgICAgdm0udGh1bWJuYWlsc1tqXS5jbGFzc0xpc3QuYWRkKCdkcm9wc2hhZG93Jyk7XHJcbiAgICAgICAgICAgIHZtLnRodW1ibmFpbHNbal0uc3JjID0gdGh1bWJuYWlsc1tqXTtcclxuXHJcbiAgICAgICAgICAgIHZtLmNvbG1kLmFwcGVuZENoaWxkKHZtLm1lZGlhX2l0ZW1zW2pdLmh0bWwpO1xyXG4gICAgICAgICAgICB2bS5jb2xtZC5hcHBlbmRDaGlsZCh2bS50aHVtYm5haWxzW2pdKTtcclxuICAgICAgICAgICAgdm0ucm93LmFwcGVuZENoaWxkKHZtLmNvbG1kKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICAgICAgICNtZWRpYS1zZWxlY3RlZFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAub3ZlcmxheVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICBpbWcoc3JjPVwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIikuZHJvcHNoYWRvd1xyXG4gICAgICAgIC8vICAgICAgICAgIC5yb3cuanVzdGlmeS1jZW50ZXIubWVkaWEtY29udGFpbmVyXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIC5jb2wtbWRcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIC5tZWRpYS1pdGVtXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICBpbWcoc3JjPVwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIikuZHJvcHNoYWRvd1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAuY29sLW1kXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAubWVkaWEtaXRlbVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpLmRyb3BzaGFkb3dcclxuXHJcblxyXG4gICAgICAgIHZtLm1lZGlhX2l0ZW1zW3ZtLnNlbGVjdGVkXS5odG1sLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgLy8gdm0uZWxlbWVudHMucHVzaCh2bS5lbGVtZW50c1swXSk7XHJcbiAgICAgICAgLy8gdm0uZWxlbWVudHMuc2hpZnQoKTtcclxuICAgICAgICAvLyB2bS5zZXRJZChpZCk7XHJcbiAgICAgICAgLy8gdm0ubG9hZE1lZGlhKDApO1xyXG5cclxuICAgIH1cclxuICAgIGNyZWF0ZUZyYWdtZW50KHN0cjogc3RyaW5nLCB3aWR0aD86IG51bWJlciwgaGVpZ2h0PzogbnVtYmVyICkge1xyXG4gICAgICAgIHZhciBuZXdzdHIgPSBzdHI7XHJcbiAgICAgICAgaWYod2lkdGgpe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbmV3c3RyID0gc3RyLnJlcGxhY2UoJ3dpZHRoPVwiXFxkK1wiIGhlaWdodD1cIlxcZCtcIicsICd3aWR0aD1cIicrd2lkdGgrJ1wiIGhlaWdodD1cIicraGVpZ2h0KydcIicpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG5cclxuICAgICAgICB2YXIgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGVsZW0uaW5uZXJIVE1MID0gc3RyO1xyXG5cclxuICAgICAgICB3aGlsZSAoZWxlbS5jaGlsZE5vZGVzWzBdKSB7XHJcbiAgICAgICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoZWxlbS5jaGlsZE5vZGVzWzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZyYWc7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SWQoaWQ6IHN0cmluZyl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZhciBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgd2hpbGUocGFyZW50LmZpcnN0Q2hpbGQpe1xyXG4gICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQocGFyZW50LmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodm0ubWVkaWFfc2VsZWN0ZWQpO1xyXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh2bS5yb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRNZWRpYSh0aHVtYl9udW06bnVtYmVyKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5tZWRpYV9zZWxlY3RlZC5yZW1vdmVDaGlsZCh2bS5tZWRpYV9zZWxlY3RlZC5maXJzdENoaWxkKTtcclxuICAgICAgICB2bS5vdmVybGF5LmNsYXNzTGlzdC5hZGQoJ2Nsb3NlLW1lZGlhJyk7XHJcblxyXG4gICAgICAgIHZtLm92ZXJsYXkuc3R5bGUud2lkdGggPSAodm0ubWVkaWFfc2VsZWN0ZWQuY2xpZW50V2lkdGgrMTIpKydweCc7XHJcbiAgICAgICAgdm0ub3ZlcmxheS5zdHlsZS5oZWlnaHQgPSAodm0ubWVkaWFfc2VsZWN0ZWQuY2xpZW50SGVpZ2h0KzgpKydweCc7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB2bS5tZWRpYV9pdGVtcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhX2l0ZW1zW2ldLmh0bWwuc3R5bGUud2lkdGggPSB2bS5jb2xtZC5jbGllbnRXaWR0aCsncHgnO1xyXG4gICAgICAgICAgICB2bS5tZWRpYV9pdGVtc1tpXS5odG1sLnN0eWxlLmhlaWdodCA9IHZtLmNvbG1kLmNsaWVudEhlaWdodCsncHgnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodm0udmltZW8gJiYgdGh1bWJfbnVtID09PSAwKXtcclxuICAgICAgICAgICAgICAgIHZtLmVsZW1lbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZnJhZyA9IHZtLmNyZWF0ZUZyYWdtZW50KHZtLnZpbWVvLCB2bS5tZWRpYV9zZWxlY3RlZC5jbGllbnRXaWR0aCwgdm0ubWVkaWFfc2VsZWN0ZWQuY2xpZW50SGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIHZtLmVsZW1lbnRzLnVuc2hpZnQoZnJhZyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdm0ub3ZlcmxheS5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5lbGVtZW50c1tpXS5jbGFzc0xpc3QuYWRkKCdkcm9wc2hhZG93Jyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdm0ub3ZlcmxheS5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8qYnV0dG9uIHRyYW5zaXRpb24qL1xyXG4gICAgICAgIHZtLm1lZGlhX2l0ZW1zW3ZtLnNlbGVjdGVkXS5odG1sLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgdm0uc2VsZWN0ZWQgPSB0aHVtYl9udW07XHJcbiAgICAgICAgdm0ubWVkaWFfaXRlbXNbdm0uc2VsZWN0ZWRdLmh0bWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgICAgLypwaWN0dXJlIHRyYW5zaXRpb24qL1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgIC8vIGlmKHZtLnZpbWVvICYmIHZtLnNlbGVjdGVkID09PSAwKXtcclxuXHJcbiAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh2bS5tZWRpYV9zZWxlY3RlZC5jaGlsZHJlbi5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1lZGlhX3NlbGVjdGVkLnJlbW92ZUNoaWxkKHZtLm1lZGlhX3NlbGVjdGVkLmxhc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZtLm1lZGlhX3NlbGVjdGVkLmFwcGVuZENoaWxkKHZtLmVsZW1lbnRzW3ZtLnNlbGVjdGVkXSk7XHJcbiAgICAgICAgICAgIHZtLm92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZSgnY2xvc2UtbWVkaWEnKTtcclxuICAgICAgICAgICAgdm0ubWVkaWFfaXRlbXNbdm0uc2VsZWN0ZWRdLmh0bWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcclxuICAgICAgICB9LCA2MDApOyAgIFxyXG4gICAgfVxyXG59IiwiZXhwb3J0ICogZnJvbSBcIi4vc2tpbGxfYmFkZ2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTa2lsbCB7XHJcbiAgZmxleF9pdGVtOiBIVE1MRGl2RWxlbWVudDtcclxuICBzdmc6IFNWR1NWR0VsZW1lbnQ7XHJcbiAgc3ZnX2NpcmNsZTogU1ZHQ2lyY2xlRWxlbWVudDtcclxuICBzY2FsZV9ib3g6IEhUTUxEaXZFbGVtZW50O1xyXG4gIGltYWdlOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gIHRleHQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gIGZsZXhfZ3JpZF9pZDogc3RyaW5nO1xyXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgY2xhc3NwZXJjZW50OiBzdHJpbmcsIGltYWdlOiBzdHJpbmcsIGZsZXhfZ3JpZF9pZDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgdm0uZmxleF9ncmlkX2lkID0gZmxleF9ncmlkX2lkO1xyXG5cclxuICAgIHZtLmZsZXhfaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdm0uZmxleF9pdGVtLmNsYXNzTmFtZSArPSAnZmxleC1pdGVtJztcclxuXHJcbiAgICB2bS5zdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInN2Z1wiKVxyXG4gICAgdm0uc3ZnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbGFzc3BlcmNlbnQpXHJcbiAgICB2bS5zdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsICc4NCcpO1xyXG4gICAgdm0uc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzg0Jyk7XHJcblxyXG4gICAgdm0uc3ZnX2NpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdjaXJjbGUnKTtcclxuICAgIHZtLnN2Z19jaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2NsYXNzJywgJ291dGVyJyk7XHJcbiAgICB2bS5zdmdfY2lyY2xlLnNldEF0dHJpYnV0ZU5TKG51bGwsIFwiY3hcIiwgJy00MicpO1xyXG4gICAgdm0uc3ZnX2NpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCBcImN5XCIsICc0MicpO1xyXG4gICAgdm0uc3ZnX2NpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCBcInJcIiwgJzM3Jyk7XHJcbiAgICB2bS5zdmdfY2lyY2xlLnNldEF0dHJpYnV0ZU5TKG51bGwsIFwidHJhbnNmb3JtXCIsIFwicm90YXRlKC05MCwgMCwgMClcIik7XHJcblxyXG4gICAgdm0uc2NhbGVfYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBpZiAobmFtZSA9PT0gXCJUeXBlIFNjcmlwdFwiIHx8IG5hbWUgPT09IFwiQm9vdHN0cmFwXCIgfHwgbmFtZSA9PT0gXCJEMy5qc1wiIHx8IG5hbWUgPT09IFwiUGhvdG9zaG9wXCIgfHwgbmFtZSA9PT0gXCJJbGx1c3RyYXRvclwiIHx8IG5hbWUgPT09IFwiQWZ0ZXIgRWZmZWN0c1wiIHx8IG5hbWUgPT09IFwiTWF5YVwiIHx8IG5hbWUgPT09IFwiTXVkYm94XCIpIHtcclxuICAgICAgdm0uc2NhbGVfYm94LmNsYXNzTmFtZSArPSAnc2NhbGUtYm94LXNxdWFyZSc7XHJcbiAgICB9IGVsc2UgaWYgKG5hbWUgPT09IFwiVW5pdHlcIiB8fCBuYW1lID09PSBcIlBoYXNlci5qc1wiIHx8IG5hbWUgPT09IFwiRDMuanNcIiB8fCBuYW1lID09PSBcIlNDU1NcIiB8fCBuYW1lID09PSBcIkphdmFcIiB8fCBuYW1lID09PSBcIlB5dGhvblwiKSB7XHJcbiAgICAgIHZtLnNjYWxlX2JveC5jbGFzc05hbWUgKz0gJ3NjYWxlLWJveC1taWQnO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHZtLnNjYWxlX2JveC5jbGFzc05hbWUgKz0gJ3NjYWxlLWJveCc7XHJcbiAgICB9XHJcblxyXG4gICAgdm0uaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgIHZtLmltYWdlLnNyYyA9IGltYWdlO1xyXG5cclxuICAgIHZtLnRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHZtLnRleHQuY2xhc3NOYW1lICs9ICd0ZXh0JztcclxuICAgIHZtLnRleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmFtZSkpO1xyXG5cclxuICAgIC8vIC5mbGV4LWl0ZW1cclxuICAgIC8vICAgICAgIHN2Zy5jaXJjbGUtNzUod2lkdGg9Jzg0JywgaGVpZ2h0PSc4NCcpXHJcbiAgICAvLyAgICAgICAgIGNpcmNsZS5vdXRlcihjeD0nLTQyJywgY3k9JzQyJywgcj0nMzcnIHRyYW5zZm9ybT1cInJvdGF0ZSgtOTAsIDAsIDApXCIpIFxyXG4gICAgLy8gICAgICAgLnNjYWxlLWJveFxyXG4gICAgLy8gICAgICAgICBpbWcoaWQ9XCJmb3VyXCIpXHJcbiAgICAvLyAgICAgICAgIC50ZXh0IGFiY1xyXG4gICAgdm0uZmxleF9pdGVtLmFwcGVuZENoaWxkKHZtLnN2Zyk7XHJcbiAgICB2bS5zdmcuYXBwZW5kQ2hpbGQodm0uc3ZnX2NpcmNsZSk7XHJcbiAgICB2bS5mbGV4X2l0ZW0uYXBwZW5kQ2hpbGQodm0uc2NhbGVfYm94KTtcclxuICAgIHZtLnNjYWxlX2JveC5hcHBlbmRDaGlsZCh2bS5pbWFnZSk7XHJcbiAgICB2bS5mbGV4X2l0ZW0uYXBwZW5kQ2hpbGQodm0udGV4dCk7XHJcbiAgfVxyXG4gIHJlc2V0SWQoaWQ6IHN0cmluZyl7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2bS5mbGV4X2dyaWRfaWQgPSBpZDtcclxuICB9XHJcblxyXG4gIGFwcGVuZCgpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZhciBmbGV4X2dyaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh2bS5mbGV4X2dyaWRfaWQpO1xyXG4gICAgZmxleF9ncmlkLmFwcGVuZENoaWxkKHZtLmZsZXhfaXRlbSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTa2lsbEluZm8ge1xyXG4gIG5hbWU6IHN0cmluZztcclxuICBjbGFzczogc3RyaW5nO1xyXG4gIGltYWdlOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xsZWN0aW9uIHtcclxuICBpZDogc3RyaW5nO1xyXG4gIGltYWdlczogSVNraWxsSW5mb1tdO1xyXG4gIHBhdGg6IHN0cmluZztcclxuICBza2lsbHM6IFNraWxsW107XHJcbiAgZmxleF9ncmlkX2lkOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZywgZmxleF9ncmlkX2lkOiBzdHJpbmcsIGltYWdlczogSVNraWxsSW5mb1tdLCBpZD86IHN0cmluZykge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgXHJcbiAgICB2bS5pbWFnZXMgPSBpbWFnZXM7XHJcbiAgICB2bS5wYXRoID0gcGF0aDtcclxuICAgIHZtLmZsZXhfZ3JpZF9pZCA9IGZsZXhfZ3JpZF9pZDtcclxuXHJcbiAgICB2bS5za2lsbHMgPSBbXTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGltYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2bS5za2lsbHMucHVzaChuZXcgU2tpbGwoaW1hZ2VzW2ldLm5hbWUsIGltYWdlc1tpXS5jbGFzcywgdm0ucGF0aCArIGltYWdlc1tpXS5pbWFnZSwgdm0uZmxleF9ncmlkX2lkKSk7XHJcbiAgICB9XHJcbiAgICBpZihpZCl7XHJcbiAgICAgIHZtLmlkID0gaWQ7XHJcbiAgICAgIHZhciBlbGVtZW50ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHZtLmlkKTtcclxuICAgICAgZWxlbWVudC5vbm1vdXNldXAgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZtLmxvYWQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlc2V0SWRzKGlkOiBzdHJpbmcpe1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdm0uZmxleF9ncmlkX2lkID0gaWQ7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLnNraWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2bS5za2lsbHNbaV0ucmVzZXRJZCh2bS5mbGV4X2dyaWRfaWQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGxvYWQoKSB7IC8vc2V0cyBzcmMncyB0byB0aGUgZG9tLiB0aGVuIG9uY2UgZXZlcnl0aGluZyBpcyBsb2FkZWQsIGl0IGFkZHMgY2xhc3MgYWN0aXZlIHRvIG1ha2UgdGhlbSBhcHBlYXIgdmlhIGNzc1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdmFyIGZsZXhfZ3JpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHZtLmZsZXhfZ3JpZF9pZCk7XHJcbiAgICB3aGlsZSAoZmxleF9ncmlkLmZpcnN0Q2hpbGQpIHtcclxuICAgICAgZmxleF9ncmlkLnJlbW92ZUNoaWxkKGZsZXhfZ3JpZC5maXJzdENoaWxkKTtcclxuICAgIH1cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uc2tpbGxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZtLnNraWxsc1tpXS5hcHBlbmQoKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gcHVibGljIGNsb3NlKCl7XHJcbiAgLy8gICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgLy8gICB2YXIgZmxleF9ncmlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodm0uZmxleF9ncmlkX2lkKTtcclxuICAvLyAgIHdoaWxlIChmbGV4X2dyaWQuZmlyc3RDaGlsZCkge1xyXG4gIC8vICAgICBmbGV4X2dyaWQucmVtb3ZlQ2hpbGQoZmxleF9ncmlkLmZpcnN0Q2hpbGQpO1xyXG4gIC8vICAgfVxyXG4gIC8vIH1cclxufVxyXG4iXX0=
