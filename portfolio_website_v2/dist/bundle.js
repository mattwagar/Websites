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
        vm.text.classList.add('text', 'padding-top');
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
        row.classList.add('row', 'nomar');
        vm.title_element = document.createElement('div');
        vm.title_element.classList.add('col-md-12', 'desc-text', 'pad-spacing');
        vm.title_element_text = document.createTextNode('');
        vm.title_element.appendChild(vm.title_element_text);
        var col6 = document.createElement('div');
        col6.classList.add('col-md-6', 'row');
        var row_fill = document.createElement('div');
        row_fill.classList.add('row', 'justify-center', 'nomar');
        var col12 = document.createElement('div');
        col12.classList.add('col-md-12');
        vm.col6 = document.createElement('div');
        vm.col6.id = 'media-' + row_num;
        vm.col6.classList.add('col-md-6');
        var col3_2 = document.createElement('div');
        col3_2.classList.add('col-md-3', 'nopad-left');
        vm.description = document.createElement('div');
        vm.description.classList.add('header-text', 'pad-spacing');
        vm.description.appendChild(document.createTextNode('Description'));
        var desc = document.createElement('div');
        desc.classList.add('description-text', 'pad-spacing');
        vm.description_text = document.createTextNode('');
        desc.appendChild(vm.description_text);
        vm.stack = document.createElement('div');
        vm.stack.classList.add('col-md-8');
        // vm.stack.appendChild(document.createTextNode('Stack'));
        var stack_title = document.createElement('div');
        stack_title.classList.add('header-text', 'pad-spacing');
        stack_title.appendChild(document.createTextNode('Stack'));
        vm.flex_grid = document.createElement('div');
        vm.flex_grid.id = 'pflex-grid-' + row_num;
        vm.flex_grid.classList.add('row', 'portfolio-flex', 'col-md-12');
        vm.demo = document.createElement('div');
        vm.demo.classList.add('col-md-4');
        // vm.demo.appendChild(document.createTextNode('Live Demo'));
        var demo_title = document.createElement('div');
        demo_title.classList.add('header-text', 'pad-spacing');
        demo_title.appendChild(document.createTextNode('Live Demo'));
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
        row.appendChild(col6);
        row.appendChild(vm.col6);
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
var weather_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Angular JS', "class": 'circle-100', "image": 'angular-icon.svg' },
]);
// var breathless_media = new media.Media('media-0', ["./portfolio/breathless.jpg","./portfolio/breathless.jpg","./portfolio/cat.jpg"], ["./portfolio/breathless.jpg","./portfolio/cat.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
var m = [];
m.push(new media.Media('', ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"], ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"]));
m.push(new media.Media('', ["./portfolio/qbert_play.jpg", "./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], ["./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"], ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"]));
var portfolio = new Portfolio('portfolio', [
    { title: 'Breathless', title_image: './portfolio/breathless.jpg', desc: "The Space Pirate, Aria, is on a mission to loot a mineral cargo ship. However, upon landing on the cargo ship, Aria's helmet cracks causing her to slowly lose oxygen. It's now a race against time to collect all the gems before her oxygen runs out!", stack: breathless_stack, media: m[0], type: 'HTML5 Game' },
    { title: 'Mean Forecast', title_image: './portfolio/mean_forecast_1.jpg', desc: 'A small web app that calculates the average of 3 weather API\'s: Wunderground, Forecast.io, and World Weather Online. The webapp itself has many subtleties that are affected by weather data. For example, the video  resembles the current weather. Also each graph is color coated by a gradient based on the weather data.', stack: weather_stack, media: m[0], type: 'Website' },
    { title: 'Q*Bert', title_image: "./portfolio/qbert_play.jpg", desc: 'This is my Bouncing Ball Assignment for Animation 1 at Drexel University. When picking a game that mixes my love of retro video games and bouncing balls, Q*Bert was a no-brainer. Everything is individually modelled, textured, and animated by me. Made in Maya, and rendered in V-Ray.', stack: qbert_stack, media: m[1], type: 'Animation' },
    { title: 'Bedroom', title_image: './portfolio/cgi_final_1.png', desc: 'This is my final for CGI 2 at Drexel University. The assignment was to recreate any type of room, so I chose a little boy\'s room. We were tasked with creating at least one complex object, so I decided to go with a train set.', stack: qbert_stack, media: m[2], type: '3D Render' }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvanVtcC5qcy9kaXN0L2p1bXAuanMiLCJzcmMvaW1hZ2VfY2FudmFzLnRzIiwic3JjL21haW4udHMiLCJzcmMvbWVkaWEudHMiLCJzcmMvc2tpbGxfYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUM7Z0JBQzdCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNaLENBQUMsQ0FBQTtRQUNILENBQUM7SUFDSCxDQUFDO0lBRU0sNkJBQVEsR0FBZixVQUFnQixFQUFVO1FBQ3hCLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUNoQixFQUFFLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUNyQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDMUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7SUFDSCxDQUFDO0lBRU0seUJBQUksR0FBWDtRQUNFLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN6RCxPQUFPLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUM1QixTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQ0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDeEIsQ0FBQztJQUNILENBQUM7SUFRSCxpQkFBQztBQUFELENBckRBLEFBcURDLElBQUE7QUFyRFksZ0NBQVUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsLkp1bXAgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbi8vIFJvYmVydCBQZW5uZXIncyBlYXNlSW5PdXRRdWFkXG5cbi8vIGZpbmQgdGhlIHJlc3Qgb2YgaGlzIGVhc2luZyBmdW5jdGlvbnMgaGVyZTogaHR0cDovL3JvYmVydHBlbm5lci5jb20vZWFzaW5nL1xuLy8gZmluZCB0aGVtIGV4cG9ydGVkIGZvciBFUzYgY29uc3VtcHRpb24gaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL2pheGdlbGxlci9lei5qc1xuXG52YXIgZWFzZUluT3V0UXVhZCA9IGZ1bmN0aW9uIGVhc2VJbk91dFF1YWQodCwgYiwgYywgZCkge1xuICB0IC89IGQgLyAyO1xuICBpZiAodCA8IDEpIHJldHVybiBjIC8gMiAqIHQgKiB0ICsgYjtcbiAgdC0tO1xuICByZXR1cm4gLWMgLyAyICogKHQgKiAodCAtIDIpIC0gMSkgKyBiO1xufTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmo7XG59IDogZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbn07XG5cbnZhciBqdW1wZXIgPSBmdW5jdGlvbiBqdW1wZXIoKSB7XG4gIC8vIHByaXZhdGUgdmFyaWFibGUgY2FjaGVcbiAgLy8gbm8gdmFyaWFibGVzIGFyZSBjcmVhdGVkIGR1cmluZyBhIGp1bXAsIHByZXZlbnRpbmcgbWVtb3J5IGxlYWtzXG5cbiAgdmFyIGVsZW1lbnQgPSB2b2lkIDA7IC8vIGVsZW1lbnQgdG8gc2Nyb2xsIHRvICAgICAgICAgICAgICAgICAgIChub2RlKVxuXG4gIHZhciBzdGFydCA9IHZvaWQgMDsgLy8gd2hlcmUgc2Nyb2xsIHN0YXJ0cyAgICAgICAgICAgICAgICAgICAgKHB4KVxuICB2YXIgc3RvcCA9IHZvaWQgMDsgLy8gd2hlcmUgc2Nyb2xsIHN0b3BzICAgICAgICAgICAgICAgICAgICAgKHB4KVxuXG4gIHZhciBvZmZzZXQgPSB2b2lkIDA7IC8vIGFkanVzdG1lbnQgZnJvbSB0aGUgc3RvcCBwb3NpdGlvbiAgICAgIChweClcbiAgdmFyIGVhc2luZyA9IHZvaWQgMDsgLy8gZWFzaW5nIGZ1bmN0aW9uICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uKVxuICB2YXIgYTExeSA9IHZvaWQgMDsgLy8gYWNjZXNzaWJpbGl0eSBzdXBwb3J0IGZsYWcgICAgICAgICAgICAgKGJvb2xlYW4pXG5cbiAgdmFyIGRpc3RhbmNlID0gdm9pZCAwOyAvLyBkaXN0YW5jZSBvZiBzY3JvbGwgICAgICAgICAgICAgICAgICAgICAocHgpXG4gIHZhciBkdXJhdGlvbiA9IHZvaWQgMDsgLy8gc2Nyb2xsIGR1cmF0aW9uICAgICAgICAgICAgICAgICAgICAgICAgKG1zKVxuXG4gIHZhciB0aW1lU3RhcnQgPSB2b2lkIDA7IC8vIHRpbWUgc2Nyb2xsIHN0YXJ0ZWQgICAgICAgICAgICAgICAgICAgIChtcylcbiAgdmFyIHRpbWVFbGFwc2VkID0gdm9pZCAwOyAvLyB0aW1lIHNwZW50IHNjcm9sbGluZyB0aHVzIGZhciAgICAgICAgICAobXMpXG5cbiAgdmFyIG5leHQgPSB2b2lkIDA7IC8vIG5leHQgc2Nyb2xsIHBvc2l0aW9uICAgICAgICAgICAgICAgICAgIChweClcblxuICB2YXIgY2FsbGJhY2sgPSB2b2lkIDA7IC8vIHRvIGNhbGwgd2hlbiBkb25lIHNjcm9sbGluZyAgICAgICAgICAgIChmdW5jdGlvbilcblxuICAvLyBzY3JvbGwgcG9zaXRpb24gaGVscGVyXG5cbiAgZnVuY3Rpb24gbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5zY3JvbGxZIHx8IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgfVxuXG4gIC8vIGVsZW1lbnQgb2Zmc2V0IGhlbHBlclxuXG4gIGZ1bmN0aW9uIHRvcChlbGVtZW50KSB7XG4gICAgcmV0dXJuIGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgc3RhcnQ7XG4gIH1cblxuICAvLyByQUYgbG9vcCBoZWxwZXJcblxuICBmdW5jdGlvbiBsb29wKHRpbWVDdXJyZW50KSB7XG4gICAgLy8gc3RvcmUgdGltZSBzY3JvbGwgc3RhcnRlZCwgaWYgbm90IHN0YXJ0ZWQgYWxyZWFkeVxuICAgIGlmICghdGltZVN0YXJ0KSB7XG4gICAgICB0aW1lU3RhcnQgPSB0aW1lQ3VycmVudDtcbiAgICB9XG5cbiAgICAvLyBkZXRlcm1pbmUgdGltZSBzcGVudCBzY3JvbGxpbmcgc28gZmFyXG4gICAgdGltZUVsYXBzZWQgPSB0aW1lQ3VycmVudCAtIHRpbWVTdGFydDtcblxuICAgIC8vIGNhbGN1bGF0ZSBuZXh0IHNjcm9sbCBwb3NpdGlvblxuICAgIG5leHQgPSBlYXNpbmcodGltZUVsYXBzZWQsIHN0YXJ0LCBkaXN0YW5jZSwgZHVyYXRpb24pO1xuXG4gICAgLy8gc2Nyb2xsIHRvIGl0XG4gICAgd2luZG93LnNjcm9sbFRvKDAsIG5leHQpO1xuXG4gICAgLy8gY2hlY2sgcHJvZ3Jlc3NcbiAgICB0aW1lRWxhcHNlZCA8IGR1cmF0aW9uID8gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKSAvLyBjb250aW51ZSBzY3JvbGwgbG9vcFxuICAgIDogZG9uZSgpOyAvLyBzY3JvbGxpbmcgaXMgZG9uZVxuICB9XG5cbiAgLy8gc2Nyb2xsIGZpbmlzaGVkIGhlbHBlclxuXG4gIGZ1bmN0aW9uIGRvbmUoKSB7XG4gICAgLy8gYWNjb3VudCBmb3IgckFGIHRpbWUgcm91bmRpbmcgaW5hY2N1cmFjaWVzXG4gICAgd2luZG93LnNjcm9sbFRvKDAsIHN0YXJ0ICsgZGlzdGFuY2UpO1xuXG4gICAgLy8gaWYgc2Nyb2xsaW5nIHRvIGFuIGVsZW1lbnQsIGFuZCBhY2Nlc3NpYmlsaXR5IGlzIGVuYWJsZWRcbiAgICBpZiAoZWxlbWVudCAmJiBhMTF5KSB7XG4gICAgICAvLyBhZGQgdGFiaW5kZXggaW5kaWNhdGluZyBwcm9ncmFtbWF0aWMgZm9jdXNcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuXG4gICAgICAvLyBmb2N1cyB0aGUgZWxlbWVudFxuICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgIH1cblxuICAgIC8vIGlmIGl0IGV4aXN0cywgZmlyZSB0aGUgY2FsbGJhY2tcbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cblxuICAgIC8vIHJlc2V0IHRpbWUgZm9yIG5leHQganVtcFxuICAgIHRpbWVTdGFydCA9IGZhbHNlO1xuICB9XG5cbiAgLy8gQVBJXG5cbiAgZnVuY3Rpb24ganVtcCh0YXJnZXQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICAvLyByZXNvbHZlIG9wdGlvbnMsIG9yIHVzZSBkZWZhdWx0c1xuICAgIGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbiB8fCAxMDAwO1xuICAgIG9mZnNldCA9IG9wdGlvbnMub2Zmc2V0IHx8IDA7XG4gICAgY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrOyAvLyBcInVuZGVmaW5lZFwiIGlzIGEgc3VpdGFibGUgZGVmYXVsdCwgYW5kIHdvbid0IGJlIGNhbGxlZFxuICAgIGVhc2luZyA9IG9wdGlvbnMuZWFzaW5nIHx8IGVhc2VJbk91dFF1YWQ7XG4gICAgYTExeSA9IG9wdGlvbnMuYTExeSB8fCBmYWxzZTtcblxuICAgIC8vIGNhY2hlIHN0YXJ0aW5nIHBvc2l0aW9uXG4gICAgc3RhcnQgPSBsb2NhdGlvbigpO1xuXG4gICAgLy8gcmVzb2x2ZSB0YXJnZXRcbiAgICBzd2l0Y2ggKHR5cGVvZiB0YXJnZXQgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHRhcmdldCkpIHtcbiAgICAgIC8vIHNjcm9sbCBmcm9tIGN1cnJlbnQgcG9zaXRpb25cbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGVsZW1lbnQgPSB1bmRlZmluZWQ7IC8vIG5vIGVsZW1lbnQgdG8gc2Nyb2xsIHRvXG4gICAgICAgIGExMXkgPSBmYWxzZTsgLy8gbWFrZSBzdXJlIGFjY2Vzc2liaWxpdHkgaXMgb2ZmXG4gICAgICAgIHN0b3AgPSBzdGFydCArIHRhcmdldDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIHNjcm9sbCB0byBlbGVtZW50IChub2RlKVxuICAgICAgLy8gYm91bmRpbmcgcmVjdCBpcyByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnRcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGVsZW1lbnQgPSB0YXJnZXQ7XG4gICAgICAgIHN0b3AgPSB0b3AoZWxlbWVudCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBzY3JvbGwgdG8gZWxlbWVudCAoc2VsZWN0b3IpXG4gICAgICAvLyBib3VuZGluZyByZWN0IGlzIHJlbGF0aXZlIHRvIHRoZSB2aWV3cG9ydFxuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcbiAgICAgICAgc3RvcCA9IHRvcChlbGVtZW50KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gcmVzb2x2ZSBzY3JvbGwgZGlzdGFuY2UsIGFjY291bnRpbmcgZm9yIG9mZnNldFxuICAgIGRpc3RhbmNlID0gc3RvcCAtIHN0YXJ0ICsgb2Zmc2V0O1xuXG4gICAgLy8gcmVzb2x2ZSBkdXJhdGlvblxuICAgIHN3aXRjaCAoX3R5cGVvZihvcHRpb25zLmR1cmF0aW9uKSkge1xuICAgICAgLy8gbnVtYmVyIGluIG1zXG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb247XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBmdW5jdGlvbiBwYXNzZWQgdGhlIGRpc3RhbmNlIG9mIHRoZSBzY3JvbGxcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uKGRpc3RhbmNlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gc3RhcnQgdGhlIGxvb3BcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICB9XG5cbiAgLy8gZXhwb3NlIG9ubHkgdGhlIGp1bXAgbWV0aG9kXG4gIHJldHVybiBqdW1wO1xufTtcblxuLy8gZXhwb3J0IHNpbmdsZXRvblxuXG52YXIgc2luZ2xldG9uID0ganVtcGVyKCk7XG5cbnJldHVybiBzaW5nbGV0b247XG5cbn0pKSk7XG4iLCJleHBvcnQgKiBmcm9tIFwiLi9pbWFnZV9jYW52YXNcIjtcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbGVycChmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIsIHBlcmNlbnQ6IG51bWJlcikge1xyXG4gIHZhciBkaWZmZXJhbmNlID0gdG8gLSBmcm9tO1xyXG4gIHJldHVybiBmcm9tICsgKGRpZmZlcmFuY2UgKiBwZXJjZW50KTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBJbWcge1xyXG4gIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgaW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnRcclxuICB3OiBudW1iZXI7XHJcbiAgaDogbnVtYmVyO1xyXG4gIHhfb2Zmc2V0X2Rlc3Q6IG51bWJlcjtcclxuICB5X29mZnNldF9kZXN0OiBudW1iZXI7XHJcbiAgeF9vZmZzZXQ6IG51bWJlcjtcclxuICB5X29mZnNldDogbnVtYmVyO1xyXG4gIGFuY2hvclg6IG51bWJlcjtcclxuICBhbmNob3JZOiBudW1iZXI7XHJcblxyXG4gIGltZ1dpZHRoOiBudW1iZXI7XHJcbiAgc2NyZWVuV2lkdGg6IG51bWJlcjtcclxuICBzY2FsZVg6IG51bWJlcjtcclxuICBzY2FsZVk6IG51bWJlcjtcclxuICBzY2FsZTogbnVtYmVyO1xyXG4gIGltZ0hlaWdodDogbnVtYmVyO1xyXG4gIHNjcmVlbkhlaWdodDogbnVtYmVyO1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3Iod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZtLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgdm0uY3R4ID0gdm0uY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB2bS53ID0gdm0uY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICB2bS5oID0gdm0uY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIHZtLmltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICB2bS5pbWFnZS5zcmMgPSAnY2l0eS5qcGcnO1xyXG5cclxuICAgIHZtLmltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgIC8qZ2V0cyBzY2FsZVggYmFzZWQgb24gc2NyZWVuIGFuZCBpbWFnZSB3aWR0aCAqL1xyXG4gICAgICB2bS5pbWdXaWR0aCA9IHZtLmltYWdlLm5hdHVyYWxXaWR0aDtcclxuICAgICAgdm0uc2NyZWVuV2lkdGggPSB2bS5jYW52YXMud2lkdGg7XHJcbiAgICAgIHZtLnNjYWxlWCA9IDE7XHJcbiAgICAgIHZtLnNjYWxlWCA9IHZtLnNjcmVlbldpZHRoIC8gdm0uaW1nV2lkdGg7XHJcblxyXG4gICAgICAvKmdldHMgc2NhbGVZIGJhc2VkIG9uIHNjcmVlbiBhbmQgaW1hZ2Ugd2lkdGggKi9cclxuICAgICAgdm0uaW1nSGVpZ2h0ID0gdm0uaW1hZ2UubmF0dXJhbEhlaWdodDtcclxuICAgICAgdm0uc2NyZWVuSGVpZ2h0ID0gdm0uY2FudmFzLmhlaWdodDtcclxuICAgICAgdm0uc2NhbGVZID0gMTtcclxuICAgICAgdm0uc2NhbGVZID0gdm0uc2NyZWVuSGVpZ2h0IC8gdm0uaW1nSGVpZ2h0O1xyXG5cclxuXHJcbiAgICAgIC8qc2V0cyBiYXNpYyBzY2FsZSB0byBYICovXHJcblxyXG4gICAgICB2bS5zY2FsZSA9IHZtLnNjYWxlWFxyXG4gICAgICBpZiAodm0uc2NhbGVYIDwgdm0uc2NhbGVZKSB7XHJcbiAgICAgICAgdm0uc2NhbGUgPSB2bS5zY2FsZVk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZtLmltZ1dpZHRoICo9IHZtLnNjYWxlICogMS4wNTtcclxuICAgICAgdm0uaW1nSGVpZ2h0ICo9IHZtLnNjYWxlICogMS4wNTtcclxuXHJcbiAgICAgIHZtLmFuY2hvclggPSAodm0uaW1nV2lkdGggLSB2bS5zY3JlZW5XaWR0aCk7XHJcbiAgICAgIHZtLmFuY2hvclkgPSAodm0uaW1nSGVpZ2h0IC0gdm0uc2NyZWVuSGVpZ2h0KTtcclxuXHJcbiAgICAgIHZtLnhfb2Zmc2V0X2Rlc3QgPSB2bS54X29mZnNldCA9IHZtLmFuY2hvclg7XHJcbiAgICAgIHZtLnlfb2Zmc2V0X2Rlc3QgPSB2bS55X29mZnNldCA9IHZtLmFuY2hvclk7XHJcblxyXG5cclxuXHJcbiAgICAgIHZtLmRyYXcoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3KCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgLy8gdm0uY3R4LmNsZWFyUmVjdCgwLDAsdm0udywgdm0uaCk7XHJcblxyXG4gICAgdm0uY3R4LmRyYXdJbWFnZSh2bS5pbWFnZSwgdm0ueF9vZmZzZXQsIHZtLnlfb2Zmc2V0LCB2bS5pbWFnZS5uYXR1cmFsV2lkdGgsIHZtLmltYWdlLm5hdHVyYWxIZWlnaHQsIDAsIDAsIHZtLmltZ1dpZHRoLCB2bS5pbWdIZWlnaHQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFwcCB7XHJcbiAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICB3OiBudW1iZXI7XHJcbiAgaDogbnVtYmVyO1xyXG4gIC8vIHJlY3Q6IFJlY3RhbmdsZVxyXG4gIGltZzogSW1nO1xyXG5cclxuICBtb3VzZUluOiBib29sZWFuO1xyXG4gIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgIHZtLmNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XHJcbiAgICB2bS5jdHggPSB2bS5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICB2bS5zaXplQ2FudmFzKCk7XHJcbiAgICB2bS5pbml0RXZlbnRzKCk7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0KSA9PiB7IHZtLmRyYXcodCk7IH0pO1xyXG5cclxuICAgIHZtLmltZyA9IG5ldyBJbWcodm0udywgdm0uaCk7XHJcblxyXG4gICAgdm0ubW91c2VJbiA9IGZhbHNlO1xyXG5cclxuICAgIHZtLmNvbnRhaW5lciA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzLWNvbnRhaW5lcicpO1xyXG5cclxuICAgIHZtLmNvbnRhaW5lci5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZtLmRyYXdJbWdJbigwLCBlKTtcclxuICAgIH1cclxuXHJcbiAgICB2bS5jb250YWluZXIub25tb3VzZWVudGVyID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdm0ubW91c2VJbiA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdm0uY29udGFpbmVyLm9ubW91c2VvdXQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2bS5tb3VzZUluID0gZmFsc2U7XHJcbiAgICAgIHZtLmRyYXdJbWdPdXQoMCwgZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBzaXplQ2FudmFzKCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdm0uY2FudmFzLnN0eWxlLndpZHRoID0gJzEwMCUnO1xyXG4gICAgdm0uY2FudmFzLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcclxuICAgIHRoaXMudyA9IHRoaXMuY2FudmFzLndpZHRoID0gdm0uY2FudmFzLm9mZnNldFdpZHRoO1xyXG4gICAgdGhpcy5oID0gdGhpcy5jYW52YXMuaGVpZ2h0ID0gdm0uY2FudmFzLm9mZnNldEhlaWdodDtcclxuXHJcbiAgfVxyXG4gIHB1YmxpYyBkcmF3KHQ6IGFueSkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodCkgPT4geyB0aGlzLmRyYXcodCk7IH0pO1xyXG4gICAgdm0uY3R4LmNsZWFyUmVjdCgwLCAwLCB2bS53LCB2bS5oKTtcclxuXHJcbiAgICB2bS5jdHguZHJhd0ltYWdlKHZtLmltZy5jYW52YXMsIDAsIDApO1xyXG4gICAgdm0uaW1nLmRyYXcoKTtcclxuXHJcblxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdJbWdJbih0OiBhbnksIGU6IGFueSkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuXHJcbiAgICAvKnJhdGlvID0gKGltZ1dpZHRoIC8gc2NyZWVuV2lkdGgpICAqL1xyXG5cclxuICAgIHZhciBtb3ZlUmF0aW9YID0gKGUuY2xpZW50WCAvIHZtLmltZy5zY3JlZW5XaWR0aCk7IC8vcmFuZ2UgZnJvbSBbMCwgMV06IDAgYmVpbmcgbGVmdCwgMSBiZWluZyByaWdodFxyXG4gICAgdmFyIG1vdmVPZmZzZXRYID0gLXZtLmltZy5hbmNob3JYICsgKG1vdmVSYXRpb1ggKiB2bS5pbWcuYW5jaG9yWCAqIDIpO1xyXG5cclxuICAgIHZhciBtb3ZlUmF0aW9ZID0gKGUuY2xpZW50WSAvIHZtLmltZy5zY3JlZW5IZWlnaHQpICogMjsgLy9yYW5nZSBmcm9tIFswLCAxXTogMCBiZWluZyBsZWZ0LCAxIGJlaW5nIHJpZ2h0XHJcbiAgICB2YXIgbW92ZU9mZnNldFkgPSAtdm0uaW1nLmFuY2hvclkgKyAobW92ZVJhdGlvWSAqIHZtLmltZy5hbmNob3JZKTtcclxuXHJcblxyXG4gICAgLypvZmZzZXQgPSBtaWRkbGVfYW5jaG9yICsgZHJhZ2dlZF9vZmZzZXQqL1xyXG4gICAgdm0uaW1nLnhfb2Zmc2V0X2Rlc3QgPSB2bS5pbWcuYW5jaG9yWCArIG1vdmVPZmZzZXRYO1xyXG4gICAgdm0uaW1nLnlfb2Zmc2V0X2Rlc3QgPSB2bS5pbWcuYW5jaG9yWSArIG1vdmVPZmZzZXRZO1xyXG5cclxuICAgIGlmICh2bS5tb3VzZUluID09PSB0cnVlICYmIE1hdGgucm91bmQodm0uaW1nLnlfb2Zmc2V0KSAhPT0gTWF0aC5yb3VuZCh2bS5pbWcueV9vZmZzZXRfZGVzdCkgJiYgTWF0aC5yb3VuZCh2bS5pbWcueF9vZmZzZXQpICE9PSBNYXRoLnJvdW5kKHZtLmltZy54X29mZnNldF9kZXN0KSkge1xyXG5cclxuXHJcbiAgICAgIHZtLmltZy54X29mZnNldCA9IE1hdGgucm91bmQobGVycCh2bS5pbWcueF9vZmZzZXQsIHZtLmltZy54X29mZnNldF9kZXN0LCAwLjEpKTtcclxuICAgICAgdm0uaW1nLnlfb2Zmc2V0ID0gTWF0aC5yb3VuZChsZXJwKHZtLmltZy55X29mZnNldCwgdm0uaW1nLnlfb2Zmc2V0X2Rlc3QsIDAuMSkpO1xyXG5cclxuICAgICAgLy8gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodCkgPT4geyB2bS5kcmF3SW1nSW4odCwgZSkgfSk7XHJcblxyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3SW1nT3V0KHQ6IGFueSwgZTogYW55KSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgLypyYXRpbyA9IChpbWdXaWR0aCAvIHNjcmVlbldpZHRoKSAgKi9cclxuXHJcbiAgICAvLyB2YXIgbW92ZVJhdGlvWCA9IChlLmNsaWVudFggLyB2bS5pbWcuc2NyZWVuV2lkdGgpOyAvL3JhbmdlIGZyb20gWzAsIDFdOiAwIGJlaW5nIGxlZnQsIDEgYmVpbmcgcmlnaHRcclxuICAgIC8vIHZhciBtb3ZlT2Zmc2V0WCA9IC12bS5pbWcuYW5jaG9yWCArIChtb3ZlUmF0aW9YICogdm0uaW1nLmFuY2hvclggKiAyKTtcclxuXHJcbiAgICAvLyB2YXIgbW92ZVJhdGlvWSA9IChlLmNsaWVudFkgLyB2bS5pbWcuc2NyZWVuSGVpZ2h0KSAqIDI7IC8vcmFuZ2UgZnJvbSBbMCwgMV06IDAgYmVpbmcgbGVmdCwgMSBiZWluZyByaWdodFxyXG4gICAgLy8gdmFyIG1vdmVPZmZzZXRZID0gLXZtLmltZy5hbmNob3JZICsgKG1vdmVSYXRpb1kgKiB2bS5pbWcuYW5jaG9yWSk7XHJcblxyXG5cclxuICAgIC8qb2Zmc2V0ID0gbWlkZGxlX2FuY2hvciArIGRyYWdnZWRfb2Zmc2V0Ki9cclxuICAgIHZtLmltZy54X29mZnNldF9kZXN0ID0gdm0uaW1nLmFuY2hvclg7XHJcbiAgICB2bS5pbWcueV9vZmZzZXRfZGVzdCA9IHZtLmltZy5hbmNob3JZO1xyXG5cclxuICAgIGlmICh2bS5tb3VzZUluID09PSBmYWxzZSAmJiBNYXRoLnJvdW5kKHZtLmltZy55X29mZnNldCkgIT09IE1hdGgucm91bmQodm0uaW1nLnlfb2Zmc2V0X2Rlc3QpICYmIE1hdGgucm91bmQodm0uaW1nLnhfb2Zmc2V0KSAhPT0gTWF0aC5yb3VuZCh2bS5pbWcueF9vZmZzZXRfZGVzdCkpIHtcclxuXHJcblxyXG4gICAgICB2bS5pbWcueF9vZmZzZXQgPSBsZXJwKHZtLmltZy54X29mZnNldCwgdm0uaW1nLnhfb2Zmc2V0X2Rlc3QsIDAuMSk7XHJcbiAgICAgIHZtLmltZy55X29mZnNldCA9IGxlcnAodm0uaW1nLnlfb2Zmc2V0LCB2bS5pbWcueV9vZmZzZXRfZGVzdCwgMC4xKTtcclxuXHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHQpID0+IHsgdm0uZHJhd0ltZ091dCh0LCBlKSB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgaW5pdEV2ZW50cygpIHtcclxuICAgIHdpbmRvdy5vbnJlc2l6ZSA9IChlKSA9PiB7XHJcbiAgICAgIHRoaXMuc2l6ZUNhbnZhcygpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG59IiwiaW1wb3J0ICogYXMganVtcCBmcm9tIFwianVtcC5qc1wiO1xyXG5cclxuaW1wb3J0ICogYXMgaW1hZ2VfY2FudmFzIGZyb20gXCIuL2ltYWdlX2NhbnZhc1wiO1xyXG5cclxuaW1wb3J0ICogYXMgc2tpbGxfYmFkZ2UgZnJvbSBcIi4vc2tpbGxfYmFkZ2VcIjtcclxuXHJcbmltcG9ydCAqIGFzIG1lZGlhIGZyb20gXCIuL21lZGlhXCI7XHJcblxyXG4vL3lvb1xyXG5jb25zdCB0aW1lb3V0Om51bWJlciA9IDEwMDA7XHJcblxyXG52YXIgZnJvbnRlbmQgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJ2ZsZXgtZ3JpZDEnLCBbICB7XCJuYW1lXCI6ICdIVE1MNScsICAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0xMDAnLCBcImltYWdlXCI6J2h0bWw1LnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdKYXZhIFNjcmlwdCcsICAgICBcImNsYXNzXCI6J2NpcmNsZS0xMDAnLCBcImltYWdlXCI6J2phdmFzY3JpcHQtMi5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnQm9vdHN0cmFwJywgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMTAwJywgXCJpbWFnZVwiOidib290c3RyYXAtNC5zdmcnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdBbmd1bGFyIEpTJywgICAgICBcImNsYXNzXCI6J2NpcmNsZS03NScsIFwiaW1hZ2VcIjonYW5ndWxhci1pY29uLnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdUeXBlIFNjcmlwdCcsICAgICBcImNsYXNzXCI6J2NpcmNsZS03NScsIFwiaW1hZ2VcIjondHlwZXNjcmlwdC5zdmcnfSwgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0d1bHAnLCAgICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTc1JywgXCJpbWFnZVwiOidndWxwLnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdDU1MzJywgICAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS01MCcsIFwiaW1hZ2VcIjonY3NzLTMuc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ2pRdWVyeScsICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTUwJywgXCJpbWFnZVwiOidqcXVlcnktMS5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnU0NTUycsICAgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J3Nhc3MtMS5zdmcnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdEMy5qcycsICAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0yNScsIFwiaW1hZ2VcIjonZDMtMi5zdmcnfV0sICdmcm9udGVuZCcpO1xyXG52YXIgc29mdGVuZyA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnZmxleC1ncmlkMicsICAgIFt7XCJuYW1lXCI6ICdKYXZhJywgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTc1JywgXCJpbWFnZVwiOidqYXZhLTE0LnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ1B5dGhvbicsICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J3B5dGhvbi01LnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0MrKycsICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTI1JywgXCJpbWFnZVwiOidjLXNlZWtsb2dvLmNvbS5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdOb2RlIEpTJywgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMjUnLCBcImltYWdlXCI6J25vZGVqcy1pY29uLnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0MjJywgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMjUnLCBcImltYWdlXCI6J2NzaGFycC5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdVbml0eScsICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTI1JywgXCJpbWFnZVwiOid1bml0eS5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdBbmRyb2lkIFN0dWRpbycsICBcImNsYXNzXCI6J2NpcmNsZS0yNScsIFwiaW1hZ2VcIjonQW5kcm9pZF9zdHVkaW8uc3ZnJ31dLCAnc29mdGVuZycpO1xyXG52YXIgZGVzaWduID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICdmbGV4LWdyaWQzJywgICAgICAgW3tcIm5hbWVcIjogJ1Bob3Rvc2hvcCcsICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTUwJywgXCJpbWFnZVwiOidwaG90b3Nob3AtY2Muc3ZnJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdJbGx1c3RyYXRvcicsICAgICBcImNsYXNzXCI6J2NpcmNsZS01MCcsIFwiaW1hZ2VcIjonYWRvYmUtaWxsdXN0cmF0b3ItY2Muc3ZnJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdNYXlhJywgICAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS01MCcsIFwiaW1hZ2VcIjonbWF5YS5wbmcnfSwgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnQWZ0ZXIgRWZmZWN0cycsICAgXCJjbGFzc1wiOidjaXJjbGUtMjUnLCBcImltYWdlXCI6J2FmdGVyLWVmZmVjdHMtY2Muc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnTXVkYm94JywgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMjUnLCBcImltYWdlXCI6J211ZGJveC5wbmcnfV0sICdkZXNpZ24nKTtcclxuZnJvbnRlbmQubG9hZCgpO1xyXG5zb2Z0ZW5nLmxvYWQoKTtcclxuZGVzaWduLmxvYWQoKTtcclxuXHJcblxyXG52YXIgYXBwID0gbmV3IGltYWdlX2NhbnZhcy5BcHAoKTtcclxuXHJcblxyXG4vLyB3aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpe1xyXG4vLyAgICAgY29uc29sZS5sb2cod2luZG93LnNjcm9sbFkpO1xyXG4vLyB9XHJcblxyXG5cclxuLy8gdmFyIHcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndyYXBwZXItMFwiKTtcclxuLy8gdmFyIGIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncDEnKTtcclxuXHJcblxyXG4vLyBiLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4vLyAgICAgaWYody5jbGFzc0xpc3RbMV0gPT09IFwib3BlblwiKXtcclxuLy8gICAgICAgICB3LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuLy8gICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgdy5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcbi8vICAgICB9XHJcbi8vIH1cclxuXHJcbmV4cG9ydCBjbGFzcyBQb3J0Zm9saW9JdGVtIHtcclxuICAgIHRpdGxlOiBzdHJpbmc7IFxyXG4gICAgdGl0bGVfaW1hZ2U6IHN0cmluZzsgXHJcbiAgICBkZXNjOiBzdHJpbmc7XHJcbiAgICBzdGFjazogc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbjsgXHJcbiAgICBwb3J0X2ltYWdlOiBzdHJpbmc7XHJcbiAgICBcclxuICAgIGl0ZW1fbnVtOiBudW1iZXI7XHJcblxyXG4gICAgY29sX3NpemU6IHN0cmluZztcclxuICAgIGNvbDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICB0ZXh0OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHN1Yl90ZXh0OiBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBvcGVuOiBib29sZWFuO1xyXG4gICAgbWVkaWE6bWVkaWEuTWVkaWE7XHJcbiAgICB0YXJnZXRfd3JhcHBlcjogV3JhcHBlcjtcclxuICAgIHBvcnRmb2xpbzogUG9ydGZvbGlvO1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKHBvcnRmb2xpbzogUG9ydGZvbGlvLCBpdGVtX251bTogbnVtYmVyLCAgdGl0bGU6IHN0cmluZywgdGl0bGVfaW1hZ2U6IHN0cmluZywgZGVzYzogc3RyaW5nLCBzdGFjazogc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbiwgbWVkaWE6bWVkaWEuTWVkaWEsIHR5cGU6IHN0cmluZykge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgIHZtLnBvcnRmb2xpbyA9IHBvcnRmb2xpbztcclxuICAgIHZtLml0ZW1fbnVtID0gaXRlbV9udW07XHJcbiAgICB2bS50aXRsZSA9IHRpdGxlO1xyXG4gICAgdm0udGl0bGVfaW1hZ2UgPSB0aXRsZV9pbWFnZTtcclxuICAgIHZtLmRlc2MgPSBkZXNjO1xyXG4gICAgdm0uc3RhY2sgPSBzdGFjaztcclxuICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICB2bS5jb2xfc2l6ZSA9IFwiY29sLW1kLTNcIjtcclxuICAgIFxyXG5cclxuICAgIHZtLmNvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdm0uY29sLmNsYXNzTGlzdC5hZGQodm0uY29sX3NpemUpO1xyXG5cclxuICAgIHZhciBjYXJkX3NoYWRvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgY2FyZF9zaGFkb3cuY2xhc3NMaXN0LmFkZCgnY2FyZC1kcm9wc2hhZG93JywgJ3JvdycpO1xyXG5cclxuICAgIHZhciBub3BhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgbm9wYWQuY2xhc3NMaXN0LmFkZCgnY29sLW1kLTEyJywnbm9wYWQnKTtcclxuXHJcbiAgICB2bS5pbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgIHZtLmltZy5zcmMgPSB2bS50aXRsZV9pbWFnZTtcclxuXHJcbiAgICB2YXIgY29sMTIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGNvbDEyLmNsYXNzTGlzdC5hZGQoJ2NvbC1tZC0xMicpO1xyXG5cclxuICAgIHZtLnRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHZtLnRleHQuY2xhc3NMaXN0LmFkZCgndGV4dCcsICdwYWRkaW5nLXRvcCcpO1xyXG4gICAgdm0udGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aXRsZSkpO1xyXG5cclxuICAgIHZhciBjb2wxMl8yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBjb2wxMl8yLmNsYXNzTGlzdC5hZGQoJ2NvbC1tZC0xMicpO1xyXG5cclxuICAgIHZtLnN1Yl90ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB2bS5zdWJfdGV4dC5jbGFzc0xpc3QuYWRkKCd0ZXh0X2xpZ2h0Jyk7XHJcbiAgICB2bS5zdWJfdGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0eXBlKSk7XHJcblxyXG4gICAgLy8gLmNvbC1tZC0zXHJcbiAgICAvLyAgICAgICBpbWcoc3JjPVwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIikjcDFcclxuICAgIC8vICAgICAgIC50ZXh0IEJyZWF0aGxlc3M6IEhUTUw1IEdhbWVcclxuXHJcbiAgICAvLyAuY29sLW1kLTNcclxuICAgIC8vICAgICAgIC5jYXJkLWRyb3BzaGFkb3cucm93XHJcbiAgICAvLyAgICAgICAgIC5jb2wtbWQtMTIubm9wYWRcclxuICAgIC8vICAgICAgICAgICBpbWcoc3JjPVwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIikjcDEuZHJvcHNoYWRvd1xyXG4gICAgLy8gICAgICAgICAuY29sLW1kLTEyXHJcbiAgICAvLyAgICAgICAgICAgLnRleHQgQnJlYXRobGVzc1xyXG4gICAgLy8gICAgICAgICAuY29sLW1kLTEyXHJcbiAgICAvLyAgICAgICAgICAgLnRleHRfbGlnaHQgSFRNTDUgR2FtZVxyXG5cclxuICAgIHZtLmNvbC5hcHBlbmRDaGlsZChjYXJkX3NoYWRvdyk7XHJcbiAgICBjYXJkX3NoYWRvdy5hcHBlbmRDaGlsZChub3BhZCk7XHJcbiAgICBub3BhZC5hcHBlbmRDaGlsZCh2bS5pbWcpO1xyXG4gICAgY2FyZF9zaGFkb3cuYXBwZW5kQ2hpbGQoY29sMTIpO1xyXG4gICAgY29sMTIuYXBwZW5kQ2hpbGQodm0udGV4dCk7XHJcbiAgICBjYXJkX3NoYWRvdy5hcHBlbmRDaGlsZChjb2wxMl8yKTtcclxuICAgIGNvbDEyXzIuYXBwZW5kQ2hpbGQodm0uc3ViX3RleHQpO1xyXG5cclxuICAgIHZtLm9wZW4gPSBmYWxzZTtcclxuICAgIFxyXG4gICAgdm0uY29sLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIC8vICAgY29uc29sZS4odm0uaXRlbXNbMF0pO1xyXG4gICAgICAgIHZhciBkaWZmZXJlbnRfd3JhcHBlciA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHZtLm1lZGlhKTtcclxuICAgICAgICBcclxuICAgICAgICBkaWZmZXJlbnRfd3JhcHBlciA9IHZtLnBvcnRmb2xpby5jbG9zZSh2bS5pdGVtX251bSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdm0ub3BlbiA9IHZtLnRhcmdldF93cmFwcGVyLnRyYW5zaXRpb25XcmFwcGVyKGRpZmZlcmVudF93cmFwcGVyLCB2bS5vcGVuLCB2bS50aXRsZSwgdm0uZGVzYywgdm0uc3RhY2ssIHZtLm1lZGlhKVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vICAgdm0uc2V0RGF0YSgpOyAgXHJcbiAgICAgIH1cclxuICAgIFxyXG4gIH1cclxuICBhcHBlbmQocm93OiBudW1iZXIsIHdyYXBwZXI6IFdyYXBwZXIpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZhciByb3dfZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb3dfJytyb3cpO1xyXG4gICAgXHJcbiAgICByb3dfZWxlbWVudC5hcHBlbmRDaGlsZCh2bS5jb2wpO1xyXG4gICAgdm0udGFyZ2V0X3dyYXBwZXIgPSB3cmFwcGVyO1xyXG4gICAgdm0uc3RhY2suZmxleF9ncmlkX2lkID0gd3JhcHBlci5mbGV4X2dyaWQuaWQ7XHJcbiAgICB2bS5tZWRpYS5pZCA9ICdtZWRpYS0nK3JvdztcclxuICAgIGNvbnNvbGUubG9nKHZtLm1lZGlhKTtcclxuICB9XHJcbiAgc2V0Q29sKGNsYXNzTmFtZTogc3RyaW5nKXtcclxuICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICB2bS5jb2wuY2xhc3NMaXN0LnJlbW92ZSh2bS5jb2xfc2l6ZSk7XHJcbiAgICAgIHZtLmNvbF9zaXplID0gY2xhc3NOYW1lO1xyXG4gICAgICB2bS5jb2wuY2xhc3NMaXN0LmFkZCh2bS5jb2xfc2l6ZSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBQb3J0Zm9saW8ge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAganNvbl9vYmpzOiBJUG9ydGZvbGlvSXRlbVtdO1xyXG4gIHBhdGg6IHN0cmluZztcclxuICBpdGVtczogUG9ydGZvbGlvSXRlbVtdO1xyXG4gIHdyYXBwZXJzOiBXcmFwcGVyW107XHJcbiAgZmxleF9ncmlkX2lkOiBzdHJpbmc7XHJcbiAgcGVyX3JvdzpudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGpzb25fb2JqczogSVBvcnRmb2xpb0l0ZW1bXSkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdm0uaWQgPSBpZDtcclxuICAgIHZtLmpzb25fb2JqcyA9IGpzb25fb2JqcztcclxuICAgICBcclxuXHJcbiAgICB2bS5pdGVtcyA9IFtdO1xyXG4gICAgdm0ud3JhcHBlcnMgPSBbXTtcclxuXHJcbiAgICAvL2FkZCB3cmFwcGVycyBiYXNlZCBvbiBhbGwgcG9zc2libGUgYnJlYWtwb2ludCB3aWR0aHMgKGpzb25fb2Jqcy8yKVxyXG4gICAgZm9yKHZhciBqID0gMDsgaiA8IE1hdGguY2VpbChqc29uX29ianMubGVuZ3RoLzIpOyBqKyspe1xyXG4gICAgICAgIHZtLndyYXBwZXJzLnB1c2gobmV3IFdyYXBwZXIoaikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vYWRkIGFsbCBpdGVtc1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5qc29uX29ianMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdm0uaXRlbXMucHVzaChuZXcgUG9ydGZvbGlvSXRlbSh2bSwgaSwganNvbl9vYmpzW2ldLnRpdGxlLCBqc29uX29ianNbaV0udGl0bGVfaW1hZ2UsIGpzb25fb2Jqc1tpXS5kZXNjLCBqc29uX29ianNbaV0uc3RhY2ssIGpzb25fb2Jqc1tpXS5tZWRpYSwganNvbl9vYmpzW2ldLnR5cGUpKTtcclxuICAgIH1cclxuXHJcbiAgICB2bS5hcHBlbmRBbGwoKTtcclxuXHJcbiAgICBcclxuICB9XHJcblxyXG4gICAgcHVibGljIGFwcGVuZEFsbCgpeyAvL2FwcGVuZHMgUG9ydGZvbGlvSXRlbXMgYmFzZWQgb24gc2NyZWVuIHNpemU7IGdldHMgZGlnZXN0ZWRcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHNjcmVlbldpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICAgICAgY29uc29sZS5sb2coc2NyZWVuV2lkdGgpO1xyXG5cclxuICAgICAgICAvL3JlYXNzaWducyBjb2xzIGJhc2VkIG9uIGJyZWFrcG9pbnRzXHJcbiAgICAgICAgdmFyIGJyZWFrcG9pbnRzID0gW3ttaW46IDAsIG1heDo3NjgsIGNvbF9zaXplOiAnY29sLXhzLTYnLCBwZXJfcm93OiAyfSx7bWluOiA3NjksIG1heDo5OTIsIGNvbF9zaXplOiAnY29sLXhzLTQnLCBwZXJfcm93OiAzfSwge21pbjogOTkzLCBtYXg6MTIwMCwgY29sX3NpemU6ICdjb2wteHMtMycsIHBlcl9yb3c6IDR9LCB7bWluOiAxMjAwLCBtYXg6OTk5OSwgY29sX3NpemU6ICdjb2wteHMtMycsIHBlcl9yb3c6IDR9XTtcclxuICAgICAgICBmb3IodmFyIGk9MDsgaTxicmVha3BvaW50cy5sZW5ndGg7IGkrKyl7XHJcblxyXG4gICAgICAgICAgICAvL2lmIGluIGJyZWFrcG9pbnQgcmFuZ2UsIGFuZCBub3Qgc2FtZSBhcyBiZWZvcmVcclxuICAgICAgICAgICAgaWYoLyp2bS5pdGVtc1swXS5jb2xfc2l6ZSAhPT0gYnJlYWtwb2ludHNbaV0uY29sX3NpemUgJiYgKi9zY3JlZW5XaWR0aCA+IGJyZWFrcG9pbnRzW2ldLm1pbiAmJiBzY3JlZW5XaWR0aCA8IGJyZWFrcG9pbnRzW2ldLm1heCl7XHJcbiAgICAgICAgICAgICAgICAvL2NsZWFyIGFsbCByb3dzXHJcbiAgICAgICAgICAgICAgICB2bS5wZXJfcm93ID0gYnJlYWtwb2ludHNbaV0ucGVyX3JvdztcclxuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9ydGZvbGlvJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBwYXJlbnQuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBhID0gMTsgYSA8IGl0ZXJhdG9yOyBhKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYXJlbnQuY2hpbGRyZW5bMV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vYWRkIG5ldyByb3dzIGFuZCB3cmFwcGVyc1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciByID0gMDsgciA8IE1hdGguY2VpbCh2bS5pdGVtcy5sZW5ndGggLyBicmVha3BvaW50c1tpXS5wZXJfcm93KTsgcisrKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93LmlkID0gJ3Jvd18nK3I7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93LmNsYXNzTGlzdC5hZGQoJ3JvdycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgd3JhcHBlciA9IHZtLndyYXBwZXJzW3JdLmh0bWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChyb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vYWRkIGNvbHMgdG8gbmV3IHJvd3NcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaj0wOyBqPHZtLml0ZW1zLmxlbmd0aDsgaisrKXtcclxuICAgICAgICAgICAgICAgICAgICB2bS5pdGVtc1tqXS5zZXRDb2woYnJlYWtwb2ludHNbaV0uY29sX3NpemUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3dfbnVtID0gTWF0aC5mbG9vcihqL2JyZWFrcG9pbnRzW2ldLnBlcl9yb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLml0ZW1zW2pdLmFwcGVuZChyb3dfbnVtLCB2bS53cmFwcGVyc1tyb3dfbnVtXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gIHB1YmxpYyBjbG9zZShpdGVtX251bTogbnVtYmVyKSB7IC8vY2xvc2VzIGFsbCB3cmFwcGVyc1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgLy9jbG9zZXMgYWxsIGl0ZW1zIGluIHRoZSByb3cgb2YgdGhlIGdpdmVuIGl0ZW0uXHJcbiAgICB2YXIgcm93ID0gTWF0aC5mbG9vcihpdGVtX251bS92bS5wZXJfcm93KTtcclxuXHJcbiAgICAvLyBmb3IodmFyIGogPSAocm93KnZtLnBlcl9yb3cpOyBqIDwgKChyb3cqdm0ucGVyX3Jvdykrdm0ucGVyX3Jvdyk7IGorKyl7XHJcbiAgICAvLyAgICAgaWYoaXRlbV9udW0gIT09IGogJiYgdm0uaXRlbXNbal0pe1xyXG4gICAgLy8gICAgICAgICB2bS5pdGVtc1tqXS5vcGVuID0gZmFsc2U7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG4gICAgdmFyIHJldHVybl92YWx1ZSA9IGZhbHNlO1xyXG5cclxuICAgIGZvcih2YXIgaiA9IDA7IGogPCB2bS5pdGVtcy5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgaWYoaXRlbV9udW0gIT09IGogJiYgdm0uaXRlbXNbal0pe1xyXG4gICAgICAgICAgICB2bS5pdGVtc1tqXS5vcGVuID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yKHZhciByID0gMDsgciA8IHZtLndyYXBwZXJzLmxlbmd0aDsgcisrKXtcclxuICAgICAgICBpZihyICE9PSByb3cgJiYgdm0ud3JhcHBlcnNbcl0uaHRtbC5jbGFzc0xpc3RbMV0gPT09ICdvcGVuJyl7XHJcbiAgICAgICAgICAgIHZtLndyYXBwZXJzW3JdLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldHVybl92YWx1ZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXcmFwcGVyIHtcclxuICAgIHRpdGxlOiBzdHJpbmc7IFxyXG4gICAgZGVzYzogc3RyaW5nO1xyXG4gICAgY29sbGVjdGlvbjogc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbjtcclxuICAgIHBvcnRfaW1hZ2U6IHN0cmluZzsgXHJcbiAgICBtZWRpYTogbWVkaWEuTWVkaWE7XHJcbiAgICBcclxuXHJcbiAgICBodG1sOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgdGl0bGVfZWxlbWVudDpIVE1MRGl2RWxlbWVudDtcclxuICAgIGRlc2NyaXB0aW9uOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgc3RhY2s6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBmbGV4X2dyaWQ6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBkZW1vOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29sNTpIVE1MRGl2RWxlbWVudDtcclxuICAgIGRlc2NyaXB0aW9uX3RleHQ6IFRleHQ7XHJcbiAgICB0aXRsZV9lbGVtZW50X3RleHQ6IFRleHQ7XHJcbiAgICBsaW5rOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgbGlua190ZXh0OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29sNjpIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBjaGFuZ2U6Ym9vbGVhbjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Iocm93X251bSl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB2bS5jaGFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAvLyB2bS50aXRsZSA9IHBJdGVtLnRpdGxlO1xyXG4gICAgICAgIC8vIHZtLmRlc2MgPSBwSXRlbS5kZXNjO1xyXG4gICAgICAgIC8vIHZtLnN0YWNrID0gcEl0ZW0uc3RhY2s7XHJcbiAgICAgICAgLy8gdm0ucG9ydF9pbWFnZSA9IHBJdGVtLnBvcnRfaW1hZ2U7XHJcbiAgICAgICAgdm0uaHRtbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmh0bWwuaWQgPSAnd3JhcHBlci0nK3Jvd19udW07XHJcbiAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QuYWRkKCd3cmFwcGVyJyk7XHJcblxyXG4gICAgICAgIHZhciByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICByb3cuaWQgPSAnY29udGVudCc7XHJcbiAgICAgICAgcm93LmNsYXNzTGlzdC5hZGQoJ3JvdycsICdub21hcicpO1xyXG5cclxuICAgICAgICB2bS50aXRsZV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0udGl0bGVfZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjb2wtbWQtMTInLCAnZGVzYy10ZXh0JywgJ3BhZC1zcGFjaW5nJyk7XHJcbiAgICAgICAgdm0udGl0bGVfZWxlbWVudF90ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnQuYXBwZW5kQ2hpbGQodm0udGl0bGVfZWxlbWVudF90ZXh0KTtcclxuXHJcbiAgICAgICAgdmFyIGNvbDYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb2w2LmNsYXNzTGlzdC5hZGQoJ2NvbC1tZC02JywgJ3JvdycpO1xyXG5cclxuICAgICAgICB2YXIgcm93X2ZpbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICByb3dfZmlsbC5jbGFzc0xpc3QuYWRkKCdyb3cnLCdqdXN0aWZ5LWNlbnRlcicsICdub21hcicpO1xyXG5cclxuICAgICAgICB2YXIgY29sMTIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb2wxMi5jbGFzc0xpc3QuYWRkKCdjb2wtbWQtMTInKTtcclxuXHJcbiAgICAgICAgdm0uY29sNiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmNvbDYuaWQgPSAnbWVkaWEtJytyb3dfbnVtO1xyXG4gICAgICAgIHZtLmNvbDYuY2xhc3NMaXN0LmFkZCgnY29sLW1kLTYnKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbDNfMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbDNfMi5jbGFzc0xpc3QuYWRkKCdjb2wtbWQtMycsICdub3BhZC1sZWZ0Jyk7XHJcblxyXG4gICAgICAgIHZtLmRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb24uY2xhc3NMaXN0LmFkZCgnaGVhZGVyLXRleHQnLCAncGFkLXNwYWNpbmcnKTtcclxuICAgICAgICB2bS5kZXNjcmlwdGlvbi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnRGVzY3JpcHRpb24nKSk7XHJcblxyXG4gICAgICAgIHZhciBkZXNjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGVzYy5jbGFzc0xpc3QuYWRkKCdkZXNjcmlwdGlvbi10ZXh0JywgJ3BhZC1zcGFjaW5nJyk7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb25fdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcclxuICAgICAgICBkZXNjLmFwcGVuZENoaWxkKHZtLmRlc2NyaXB0aW9uX3RleHQpO1xyXG5cclxuICAgICAgICB2bS5zdGFjayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnN0YWNrLmNsYXNzTGlzdC5hZGQoJ2NvbC1tZC04Jyk7XHJcbiAgICAgICAgLy8gdm0uc3RhY2suYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1N0YWNrJykpO1xyXG5cclxuICAgICAgICB2YXIgc3RhY2tfdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBzdGFja190aXRsZS5jbGFzc0xpc3QuYWRkKCdoZWFkZXItdGV4dCcsICdwYWQtc3BhY2luZycpXHJcbiAgICAgICAgc3RhY2tfdGl0bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1N0YWNrJykpO1xyXG5cclxuICAgICAgICB2bS5mbGV4X2dyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5mbGV4X2dyaWQuaWQgPSAncGZsZXgtZ3JpZC0nK3Jvd19udW07XHJcbiAgICAgICAgdm0uZmxleF9ncmlkLmNsYXNzTGlzdC5hZGQoJ3JvdycsJ3BvcnRmb2xpby1mbGV4JywgJ2NvbC1tZC0xMicpO1xyXG5cclxuICAgICAgICB2bS5kZW1vID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uZGVtby5jbGFzc0xpc3QuYWRkKCdjb2wtbWQtNCcpO1xyXG4gICAgICAgIC8vIHZtLmRlbW8uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0xpdmUgRGVtbycpKTtcclxuXHJcbiAgICAgICAgdmFyIGRlbW9fdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkZW1vX3RpdGxlLmNsYXNzTGlzdC5hZGQoJ2hlYWRlci10ZXh0JywgJ3BhZC1zcGFjaW5nJylcclxuICAgICAgICBkZW1vX3RpdGxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdMaXZlIERlbW8nKSk7XHJcblxyXG4gICAgICAgIHZtLmxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5saW5rLmNsYXNzTGlzdC5hZGQoJ2dpdGh1Yi1idXR0b24nLCdyb3cnKTtcclxuXHJcbiAgICAgICAgdm0ubGlua190ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0ubGlua190ZXh0LmNsYXNzTGlzdC5hZGQoJ3RleHQnKTtcclxuICAgICAgICB2bS5saW5rX3RleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0xpdmUgTGluaycpKTsgICAgICAgIFxyXG5cclxuICAgICAgICB2bS5jb2w1ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uY29sNS5jbGFzc0xpc3QuYWRkKCdjb2wtbWQtNScpO1xyXG5cclxuICAgICAgICAvKiBHT05OQSBIQVZFIFRPIEFERCBNRURJQSBEWU5BTUlDQUxMWSAqL1xyXG5cclxuICAgICAgICB2bS5odG1sLmFwcGVuZENoaWxkKHJvdyk7XHJcbiAgICAgICAgcm93LmFwcGVuZENoaWxkKHZtLnRpdGxlX2VsZW1lbnQpO1xyXG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZChjb2w2KTtcclxuICAgICAgICByb3cuYXBwZW5kQ2hpbGQodm0uY29sNik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29sNi5hcHBlbmRDaGlsZChjb2wxMik7XHJcbiAgICAgICAgY29sMTIuYXBwZW5kQ2hpbGQodm0uZGVzY3JpcHRpb24pO1xyXG4gICAgICAgIGNvbDEyLmFwcGVuZENoaWxkKGRlc2MpO1xyXG4gICAgICAgIGNvbDYuYXBwZW5kQ2hpbGQodm0uc3RhY2spXHJcbiAgICAgICAgdm0uc3RhY2suYXBwZW5kQ2hpbGQoc3RhY2tfdGl0bGUpO1xyXG4gICAgICAgIHZtLnN0YWNrLmFwcGVuZENoaWxkKHZtLmZsZXhfZ3JpZCk7XHJcbiAgICAgICAgY29sNi5hcHBlbmRDaGlsZCh2bS5kZW1vKVxyXG4gICAgICAgIHZtLmRlbW8uYXBwZW5kQ2hpbGQoZGVtb190aXRsZSk7XHJcbiAgICAgICAgdm0uZGVtby5hcHBlbmRDaGlsZCh2bS5saW5rKTtcclxuICAgICAgICB2bS5saW5rLmFwcGVuZENoaWxkKHZtLmxpbmtfdGV4dCk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIC8vI3dyYXBwZXItMC53cmFwcGVyLm9wZW5cclxuICAgICAgICAvLyAucm93I2NvbnRlbnRcclxuICAgICAgICAvLyAgIC5jb2wtbWQtMTIuZGVzYy10ZXh0IEJyZWF0aGxlc3NcclxuICAgICAgICAvLyAgIC5jb2wtbWQtNiNtZWRpYS0wXHJcbiAgICAgICAgLy8gICAuY29sLW1kLTYucm93XHJcbiAgICAgICAgLy8gICAgICAgLmNvbC1tZC0xMlxyXG4gICAgICAgIC8vICAgICAgICAgLmhlYWRlci10ZXh0LnBhZGRpbmctbGVmdCBEZXNjcmlwdGlvbjpcclxuICAgICAgICAvLyAgICAgICAgIC5kZXNjcmlwdGlvbi10ZXh0LnBhZGRpbmctbGVmdCBhc2RmYXNkZlxyXG4gICAgICAgIC8vICAgICAgIC5jb2wtbWQtNi5oZWFkZXItdGV4dCBTdGFjazpcclxuICAgICAgICAvLyAgICAgICAuY29sLW1kLTYuaGVhZGVyLXRleHQgTGl2ZSBEZW1vOlxyXG5cclxuICAgICAgICB2bS5odG1sLmFkZEV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmKHZtLmNoYW5nZSl7XHJcbiAgICAgICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHZtLnNldERhdGEoKTtcclxuICAgICAgICAgICAgICAgIHZtLmNoYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgIH1cclxuICAgIC8vIGNsb3NlRGF0YSgpe1xyXG4gICAgLy8gICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIC8vICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAvLyAgICAgICAgIHZtLmNvbGxlY3Rpb24uY2xvc2UoKTtcclxuICAgIC8vICAgICB9LHRpbWVvdXQpO1xyXG4gICAgICAgIFxyXG4gICAgLy8gfVxyXG5cclxuICAgIHNldERhdGEoKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uc2V0VGl0bGUoKTtcclxuICAgICAgICB2bS5zZXREZXNjKCk7XHJcbiAgICAgICAgdm0uc2V0U3RhY2soKTtcclxuICAgICAgICB2bS5zZXRNZWRpYSgpO1xyXG4gICAgICAgIC8vIHZtLnNldFN0YWNrKHN0YWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRUaXRsZSgpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS50aXRsZV9lbGVtZW50X3RleHQudGV4dENvbnRlbnQgPSB2bS50aXRsZTtcclxuICAgIH1cclxuICAgIHNldERlc2MoKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb25fdGV4dC50ZXh0Q29udGVudCA9IHZtLmRlc2M7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U3RhY2soKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uY29sbGVjdGlvbi5yZXNldElkcyh2bS5mbGV4X2dyaWQuaWQpO1xyXG4gICAgICAgIHZtLmNvbGxlY3Rpb24ubG9hZCgpO1xyXG4gICAgfVxyXG4gICAgc2V0TWVkaWEoKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ubWVkaWEuc2V0SWQodm0ubWVkaWEuaWQpO1xyXG4gICAgICAgIHZtLm1lZGlhLmxvYWRNZWRpYSgwKTtcclxuICAgIH1cclxuICAgIGNsb3NlKCl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4gICAgfVxyXG4gICAgY2hhbmdlV3JhcHBlcihvcGVuOiBib29sZWFuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgLy9jbG9zZSB3cmFwcGVyOlxyXG5cclxuICAgICAgICBcclxuICAgICAgICBpZih2bS50aXRsZSA9PT0gdGl0bGUpeyAvKippZiBubyBjaGFuZ2UgKi9cclxuICAgICAgICAgICAgY29uc29sZS5sb2coJzEnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cob3Blbik7XHJcbiAgICAgICAgICAgIHZtLmNoYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYob3Blbil7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5jbG9zZURhdGEoKTtcclxuICAgICAgICAgICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdm0udGl0bGUgPSB0aXRsZTtcclxuICAgICAgICAgICAgICAgIHZtLmRlc2MgPSBkZXNjO1xyXG4gICAgICAgICAgICAgICAgdm0uY29sbGVjdGlvbiA9IHN0YWNrO1xyXG4gICAgICAgICAgICAgICAgdm0ubWVkaWEgPSBtZWRpYTtcclxuICAgICAgICAgICAgICAgIHZtLnNldERhdGEoKTtcclxuICAgICAgICAgICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYodm0uaHRtbC5jbGFzc0xpc3RbMV0gIT09ICdvcGVuJyl7IC8qKmlmIGFsbCBzZWxlY3Rpb25zIGFyZSBjbG9zZWQgaW5pdGlhbGx5L2NoYW5nZSB3aGVuIGNsb3NlZCovXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcyJyk7XHJcbiAgICAgICAgICAgIHZtLmNoYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2bS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgICAgICB2bS5kZXNjID0gZGVzYztcclxuICAgICAgICAgICAgdm0uY29sbGVjdGlvbiA9IHN0YWNrO1xyXG4gICAgICAgICAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgICAgICAgICB2bS5zZXREYXRhKCk7XHJcbiAgICAgICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnMycpO1xyXG4gICAgICAgICAgICB2bS5jaGFuZ2UgPSB0cnVlO1xyXG4gICAgICAgICAgICB2bS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgICAgICB2bS5kZXNjID0gZGVzYztcclxuICAgICAgICAgICAgdm0uY29sbGVjdGlvbiA9IHN0YWNrO1xyXG4gICAgICAgICAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgICAgICAgICAvLyB2bS5jbG9zZURhdGEoKTtcclxuICAgICAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNpdGlvbldyYXBwZXIoZGlmZmVyZW50X3dyYXBwZXI6Ym9vbGVhbiwgb3BlbjogYm9vbGVhbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgcmV0dXJuX3ZhbHVlO1xyXG5cclxuICAgICAgICBpZihkaWZmZXJlbnRfd3JhcHBlcil7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHZtLmNoYW5nZVdyYXBwZXIob3BlbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGltZW91dDogJysgcmV0dXJuX3ZhbHVlKTsgXHJcbiAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xyXG4gICAgICAgIH0gZWxzZSBpZihvcGVuID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICBvcGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuX3ZhbHVlID0gdm0uY2hhbmdlV3JhcHBlcihvcGVuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm5fdmFsdWUgPSB2bS5jaGFuZ2VXcmFwcGVyKG9wZW4sIHRpdGxlLCBkZXNjLCBzdGFjaywgbWVkaWEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZygncmV0dXJuX3ZhbHVlOiAnK3JldHVybl92YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHJldHVybl92YWx1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUG9ydGZvbGlvSXRlbSB7XHJcbiAgdGl0bGU6IHN0cmluZztcclxuICB0aXRsZV9pbWFnZTogc3RyaW5nOyBcclxuICBkZXNjOiBzdHJpbmc7XHJcbiAgc3RhY2s6IHNraWxsX2JhZGdlLkNvbGxlY3Rpb247XHJcbiAgbWVkaWE6IG1lZGlhLk1lZGlhOyBcclxuICB0eXBlOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8vIHtcIm5hbWVcIjogJ1B5dGhvbicsICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J3B5dGhvbi01LnN2Zyd9XHJcbnZhciBicmVhdGhsZXNzX3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbICAge1wibmFtZVwiOiAnUGhhc2VyLmpzJywgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMTAwJywgXCJpbWFnZVwiOidwaGFzZXIuc3ZnJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ1Bob3Rvc2hvcCcsICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjoncGhvdG9zaG9wLWNjLnN2Zyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdqUXVlcnknLCAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS01MCcsIFwiaW1hZ2VcIjonanF1ZXJ5LTEuc3ZnJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSk7XHJcbnZhciBxYmVydF9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgWyAgIHtcIm5hbWVcIjogJ01heWEnLCAgICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjonbWF5YS5wbmcnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnUGhvdG9zaG9wJywgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMjUnLCBcImltYWdlXCI6J3Bob3Rvc2hvcC1jYy5zdmcnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuIHZhciB3ZWF0aGVyX3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbICAge1wibmFtZVwiOiAnQW5ndWxhciBKUycsICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMTAwJywgXCJpbWFnZVwiOidhbmd1bGFyLWljb24uc3ZnJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gdmFyIGJyZWF0aGxlc3NfbWVkaWEgPSBuZXcgbWVkaWEuTWVkaWEoJ21lZGlhLTAnLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2NhdC5qcGdcIl0sIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9jYXQuanBnXCJdLCAnPGlmcmFtZSBzcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vMTk4MTQ5Nzk1XCIgd2lkdGg9XCI0NzFcIiBoZWlnaHQ9XCIzMzVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKTtcclxuICAgXHJcbnZhciBtID0gW11cclxuXHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfcGxheS5qcGdcIiwgXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX2dhbWVwbGF5XzIuanBnXCIsXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX2dhbWVwbGF5LmpwZ1wiLFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19jb250cm9scy5qcGdcIl0sIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfcGxheS5qcGdcIiwgXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX2dhbWVwbGF5XzIuanBnXCIsXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX2dhbWVwbGF5LmpwZ1wiLFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19jb250cm9scy5qcGdcIl0pKTtcclxuXHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFtcIi4vcG9ydGZvbGlvL3FiZXJ0X3BsYXkuanBnXCIsXCIuL3BvcnRmb2xpby9xYmVydF9wbGF5ZXIuanBnXCIsXCIuL3BvcnRmb2xpby9xYmVydF9zbmFrZS5qcGdcIl0sIFtcIi4vcG9ydGZvbGlvL3FiZXJ0X3BsYXllci5qcGdcIixcIi4vcG9ydGZvbGlvL3FiZXJ0X3NuYWtlLmpwZ1wiXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzE5ODE0OTc5NVwiIHdpZHRoPVwiNDcxXCIgaGVpZ2h0PVwiMzM1XCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+JykpO1xyXG5cclxubS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgW1wiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzEucG5nXCIsXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMy5wbmdcIixcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8yLnBuZ1wiXSwgW1wiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzEucG5nXCIsXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMy5wbmdcIixcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8yLnBuZ1wiXSkpO1xyXG5cclxuXHJcbnZhciBwb3J0Zm9saW8gPSBuZXcgUG9ydGZvbGlvKCdwb3J0Zm9saW8nLCBbXHJcbiAgICB7dGl0bGU6ICdCcmVhdGhsZXNzJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZycsIGRlc2M6XCJUaGUgU3BhY2UgUGlyYXRlLCBBcmlhLCBpcyBvbiBhIG1pc3Npb24gdG8gbG9vdCBhIG1pbmVyYWwgY2FyZ28gc2hpcC4gSG93ZXZlciwgdXBvbiBsYW5kaW5nIG9uIHRoZSBjYXJnbyBzaGlwLCBBcmlhJ3MgaGVsbWV0IGNyYWNrcyBjYXVzaW5nIGhlciB0byBzbG93bHkgbG9zZSBveHlnZW4uIEl0J3Mgbm93IGEgcmFjZSBhZ2FpbnN0IHRpbWUgdG8gY29sbGVjdCBhbGwgdGhlIGdlbXMgYmVmb3JlIGhlciBveHlnZW4gcnVucyBvdXQhXCIsIHN0YWNrOmJyZWF0aGxlc3Nfc3RhY2ssIG1lZGlhOiBtWzBdLCB0eXBlOiAnSFRNTDUgR2FtZSd9LFxyXG4gICAge3RpdGxlOiAnTWVhbiBGb3JlY2FzdCcsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vbWVhbl9mb3JlY2FzdF8xLmpwZycsIGRlc2M6J0Egc21hbGwgd2ViIGFwcCB0aGF0IGNhbGN1bGF0ZXMgdGhlIGF2ZXJhZ2Ugb2YgMyB3ZWF0aGVyIEFQSVxcJ3M6IFd1bmRlcmdyb3VuZCwgRm9yZWNhc3QuaW8sIGFuZCBXb3JsZCBXZWF0aGVyIE9ubGluZS4gVGhlIHdlYmFwcCBpdHNlbGYgaGFzIG1hbnkgc3VidGxldGllcyB0aGF0IGFyZSBhZmZlY3RlZCBieSB3ZWF0aGVyIGRhdGEuIEZvciBleGFtcGxlLCB0aGUgdmlkZW8gIHJlc2VtYmxlcyB0aGUgY3VycmVudCB3ZWF0aGVyLiBBbHNvIGVhY2ggZ3JhcGggaXMgY29sb3IgY29hdGVkIGJ5IGEgZ3JhZGllbnQgYmFzZWQgb24gdGhlIHdlYXRoZXIgZGF0YS4nLCBzdGFjazp3ZWF0aGVyX3N0YWNrLCBtZWRpYTogbVswXSwgdHlwZTogJ1dlYnNpdGUnfSxcclxuICAgIHt0aXRsZTogJ1EqQmVydCcsIHRpdGxlX2ltYWdlOiBcIi4vcG9ydGZvbGlvL3FiZXJ0X3BsYXkuanBnXCIsIGRlc2M6J1RoaXMgaXMgbXkgQm91bmNpbmcgQmFsbCBBc3NpZ25tZW50IGZvciBBbmltYXRpb24gMSBhdCBEcmV4ZWwgVW5pdmVyc2l0eS4gV2hlbiBwaWNraW5nIGEgZ2FtZSB0aGF0IG1peGVzIG15IGxvdmUgb2YgcmV0cm8gdmlkZW8gZ2FtZXMgYW5kIGJvdW5jaW5nIGJhbGxzLCBRKkJlcnQgd2FzIGEgbm8tYnJhaW5lci4gRXZlcnl0aGluZyBpcyBpbmRpdmlkdWFsbHkgbW9kZWxsZWQsIHRleHR1cmVkLCBhbmQgYW5pbWF0ZWQgYnkgbWUuIE1hZGUgaW4gTWF5YSwgYW5kIHJlbmRlcmVkIGluIFYtUmF5LicsIHN0YWNrOnFiZXJ0X3N0YWNrLCBtZWRpYTogbVsxXSwgdHlwZTogJ0FuaW1hdGlvbid9LFxyXG4gICAge3RpdGxlOiAnQmVkcm9vbScsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzEucG5nJywgZGVzYzonVGhpcyBpcyBteSBmaW5hbCBmb3IgQ0dJIDIgYXQgRHJleGVsIFVuaXZlcnNpdHkuIFRoZSBhc3NpZ25tZW50IHdhcyB0byByZWNyZWF0ZSBhbnkgdHlwZSBvZiByb29tLCBzbyBJIGNob3NlIGEgbGl0dGxlIGJveVxcJ3Mgcm9vbS4gV2Ugd2VyZSB0YXNrZWQgd2l0aCBjcmVhdGluZyBhdCBsZWFzdCBvbmUgY29tcGxleCBvYmplY3QsIHNvIEkgZGVjaWRlZCB0byBnbyB3aXRoIGEgdHJhaW4gc2V0LicsIHN0YWNrOnFiZXJ0X3N0YWNrLCBtZWRpYTogbVsyXSwgdHlwZTogJzNEIFJlbmRlcid9XSk7XHJcblxyXG5cclxudmFyIHdlbGNvbWVfYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWxjb21lLWJ1dHRvbicpO1xyXG53ZWxjb21lX2Iub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcbiAgICBqdW1wKCcjcG9ydGZvbGlvJyx7XHJcbiAgICAgICAgZHVyYXRpb246MTAwMCxcclxuICAgICAgICBvZmZzZXQ6MCxcclxuICAgICAgICBjYWxsYmFjazogdW5kZWZpbmVkLFxyXG4gICAgICAgIGVhc2luZzoganVtcC5lYXNlSW5PdXRRdWFkLFxyXG4gICAgICAgIGFsbHk6IGZhbHNlXHJcbiAgICB9KVxyXG59XHJcblxyXG5cclxuLyoqIFxyXG4gKiBwb3J0Zm9saW8gd2Vic2l0ZVxyXG4gKiBicmVhdGhsZXNzXHJcbiAqIHdlYXRoZXIgd2Vic2l0ZVxyXG4gKiBxYmVydCBhbmltYXRpb25cclxuICogY2dpIDIgZmluYWw/PyBcclxuICogXHJcbiovXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vIHZhciBtZWRpYSA9IG5ldyBNZWRpYSgnbWVkaWEtMCcsIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiXSwgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2NhdC5qcGdcIiwgXCIuL3BvcnRmb2xpby9jYXQuanBnXCJdKTtcclxuXHJcbiIsImV4cG9ydCAqIGZyb20gXCIuL21lZGlhXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWVkaWFJdGVte1xyXG4gICAgbWVkaWE6IE1lZGlhO1xyXG4gICAgaHRtbDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBvcmRlcjogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IobWVkaWE6IE1lZGlhLCBodG1sOkhUTUxEaXZFbGVtZW50LCBvcmRlcjogbnVtYmVyKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ubWVkaWEgPSBtZWRpYTtcclxuICAgICAgICB2bS5odG1sID0gaHRtbDtcclxuICAgICAgICB2bS5vcmRlciA9IG9yZGVyO1xyXG4gICAgICAgIHZtLmh0bWwub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhLmxvYWRNZWRpYSh2bS5vcmRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTWVkaWEge1xyXG4gICAgaWQ6c3RyaW5nXHJcbiAgICBlbGVtZW50czogYW55W107XHJcbiAgICB0aHVtYm5haWxzOiBIVE1MSW1hZ2VFbGVtZW50W107XHJcbiAgICBtZWRpYV9pdGVtczogTWVkaWFJdGVtW107XHJcbiAgICBzZWxlY3RlZDogbnVtYmVyO1xyXG4gICAgdmltZW86c3RyaW5nO1xyXG5cclxuICAgIHJvdzpIVE1MRGl2RWxlbWVudDtcclxuICAgIG92ZXJsYXk6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb2xtZDpIVE1MRGl2RWxlbWVudDtcclxuICAgIFxyXG4gICAgbWVkaWFfc2VsZWN0ZWQ6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCB0aHVtYm5haWxzOiBzdHJpbmdbXSwgZmlsZXM/OiBzdHJpbmdbXSwgdmltZW8/OiBzdHJpbmcpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5pZCA9IGlkO1xyXG4gICAgICAgIHZtLnNlbGVjdGVkID0gMDtcclxuICAgICAgICB2bS5lbGVtZW50cyA9IFtdO1xyXG4gICAgICAgIHZtLm1lZGlhX2l0ZW1zID0gW107XHJcbiAgICAgICAgdm0udGh1bWJuYWlscyA9IFtdO1xyXG5cclxuICAgICAgICB2bS52aW1lbyA9IHZpbWVvO1xyXG4gICAgICAgIGlmKHZpbWVvKXtcclxuICAgICAgICAgICAgICAgIHZhciBmcmFnID0gdm0uY3JlYXRlRnJhZ21lbnQodmltZW8pO1xyXG4gICAgICAgICAgICAgICAgdm0uZWxlbWVudHMucHVzaChmcmFnKTtcclxuICAgICAgICAgICAgICAgIC8vIHZtLmVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQoJ2Ryb3BzaGFkb3cnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBsZW5ndGggPSB2bS5lbGVtZW50cy5sZW5ndGg7XHJcbiAgICAgICAgaWYoZmlsZXMpe1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJylcclxuICAgICAgICAgICAgICAgIGltYWdlLnNyYyA9IGZpbGVzW2ldO1xyXG4gICAgICAgICAgICAgICAgaW1hZ2UuY2xhc3NMaXN0LmFkZCgnZHJvcHNoYWRvdycpO1xyXG4gICAgICAgICAgICAgICAgdm0uZWxlbWVudHMucHVzaChpbWFnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZtLm1lZGlhX3NlbGVjdGVkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQuaWQgPSAnbWVkaWEtc2VsZWN0ZWQnO1xyXG5cclxuICAgICAgICB2bS5vdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdvdmVybGF5LW1lZGlhJyk7XHJcblxyXG4gICAgICAgIHZtLm1lZGlhX3NlbGVjdGVkLmFwcGVuZENoaWxkKHZtLm92ZXJsYXkpO1xyXG5cclxuICAgICAgICB2bS5yb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5yb3cuY2xhc3NMaXN0LmFkZCgncm93JywnanVzdGlmeS1jZW50ZXInLCdtZWRpYS1jb250YWluZXInKTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8IHZtLmVsZW1lbnRzLmxlbmd0aDsgaisrKXtcclxuICAgICAgICAgICAgdm0uY29sbWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgdm0uY29sbWQuY2xhc3NMaXN0LmFkZCgnY29sLW1kJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaHRtbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgICAgIGh0bWwuY2xhc3NMaXN0LmFkZCgnbWVkaWEtaXRlbScpO1xyXG4gICAgICAgICAgICB2YXIgbWVkaWFfaXRlbSA9IG5ldyBNZWRpYUl0ZW0odm0saHRtbCxqKTtcclxuICAgICAgICAgICAgdm0ubWVkaWFfaXRlbXMucHVzaChtZWRpYV9pdGVtKTtcclxuXHJcbiAgICAgICAgICAgIHZtLnRodW1ibmFpbHMucHVzaChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKSk7XHJcbiAgICAgICAgICAgIHZtLnRodW1ibmFpbHNbal0uY2xhc3NMaXN0LmFkZCgnZHJvcHNoYWRvdycpO1xyXG4gICAgICAgICAgICB2bS50aHVtYm5haWxzW2pdLnNyYyA9IHRodW1ibmFpbHNbal07XHJcblxyXG4gICAgICAgICAgICB2bS5jb2xtZC5hcHBlbmRDaGlsZCh2bS5tZWRpYV9pdGVtc1tqXS5odG1sKTtcclxuICAgICAgICAgICAgdm0uY29sbWQuYXBwZW5kQ2hpbGQodm0udGh1bWJuYWlsc1tqXSk7XHJcbiAgICAgICAgICAgIHZtLnJvdy5hcHBlbmRDaGlsZCh2bS5jb2xtZCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAjbWVkaWEtc2VsZWN0ZWRcclxuICAgICAgICAvLyAgICAgICAgICAgICAgLm92ZXJsYXlcclxuICAgICAgICAvLyAgICAgICAgICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpLmRyb3BzaGFkb3dcclxuICAgICAgICAvLyAgICAgICAgICAucm93Lmp1c3RpZnktY2VudGVyLm1lZGlhLWNvbnRhaW5lclxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAuY29sLW1kXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAubWVkaWEtaXRlbVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpLmRyb3BzaGFkb3dcclxuICAgICAgICAvLyAgICAgICAgICAgICAgLmNvbC1tZFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgLm1lZGlhLWl0ZW1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKS5kcm9wc2hhZG93XHJcblxyXG5cclxuICAgICAgICB2bS5tZWRpYV9pdGVtc1t2bS5zZWxlY3RlZF0uaHRtbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgIC8vIHZtLmVsZW1lbnRzLnB1c2godm0uZWxlbWVudHNbMF0pO1xyXG4gICAgICAgIC8vIHZtLmVsZW1lbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgLy8gdm0uc2V0SWQoaWQpO1xyXG4gICAgICAgIC8vIHZtLmxvYWRNZWRpYSgwKTtcclxuXHJcbiAgICB9XHJcbiAgICBjcmVhdGVGcmFnbWVudChzdHI6IHN0cmluZywgd2lkdGg/OiBudW1iZXIsIGhlaWdodD86IG51bWJlciApIHtcclxuICAgICAgICB2YXIgbmV3c3RyID0gc3RyO1xyXG4gICAgICAgIGlmKHdpZHRoKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIG5ld3N0ciA9IHN0ci5yZXBsYWNlKCd3aWR0aD1cIlxcZCtcIiBoZWlnaHQ9XCJcXGQrXCInLCAnd2lkdGg9XCInK3dpZHRoKydcIiBoZWlnaHQ9XCInK2hlaWdodCsnXCInKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuXHJcbiAgICAgICAgdmFyIGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBlbGVtLmlubmVySFRNTCA9IHN0cjtcclxuXHJcbiAgICAgICAgd2hpbGUgKGVsZW0uY2hpbGROb2Rlc1swXSkge1xyXG4gICAgICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGVsZW0uY2hpbGROb2Rlc1swXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmcmFnO1xyXG4gICAgfVxyXG5cclxuICAgIHNldElkKGlkOiBzdHJpbmcpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2YXIgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIHdoaWxlKHBhcmVudC5maXJzdENoaWxkKXtcclxuICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHBhcmVudC5maXJzdENoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHZtLm1lZGlhX3NlbGVjdGVkKTtcclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodm0ucm93KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkTWVkaWEodGh1bWJfbnVtOm51bWJlcil7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgLy8gdm0ubWVkaWFfc2VsZWN0ZWQucmVtb3ZlQ2hpbGQodm0ubWVkaWFfc2VsZWN0ZWQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgdm0ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdjbG9zZS1tZWRpYScpO1xyXG5cclxuICAgICAgICB2bS5vdmVybGF5LnN0eWxlLndpZHRoID0gKHZtLm1lZGlhX3NlbGVjdGVkLmNsaWVudFdpZHRoKzEyKSsncHgnO1xyXG4gICAgICAgIHZtLm92ZXJsYXkuc3R5bGUuaGVpZ2h0ID0gKHZtLm1lZGlhX3NlbGVjdGVkLmNsaWVudEhlaWdodCs4KSsncHgnO1xyXG5cclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdm0ubWVkaWFfaXRlbXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICB2bS5tZWRpYV9pdGVtc1tpXS5odG1sLnN0eWxlLndpZHRoID0gdm0uY29sbWQuY2xpZW50V2lkdGgrJ3B4JztcclxuICAgICAgICAgICAgdm0ubWVkaWFfaXRlbXNbaV0uaHRtbC5zdHlsZS5oZWlnaHQgPSB2bS5jb2xtZC5jbGllbnRIZWlnaHQrJ3B4JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHZtLnZpbWVvICYmIHRodW1iX251bSA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgICB2bS5lbGVtZW50cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZyYWcgPSB2bS5jcmVhdGVGcmFnbWVudCh2bS52aW1lbywgdm0ubWVkaWFfc2VsZWN0ZWQuY2xpZW50V2lkdGgsIHZtLm1lZGlhX3NlbGVjdGVkLmNsaWVudEhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB2bS5lbGVtZW50cy51bnNoaWZ0KGZyYWcpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZtLm92ZXJsYXkuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgICAgICAgICAgICAgLy8gdm0uZWxlbWVudHNbaV0uY2xhc3NMaXN0LmFkZCgnZHJvcHNoYWRvdycpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZtLm92ZXJsYXkuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvKmJ1dHRvbiB0cmFuc2l0aW9uKi9cclxuICAgICAgICB2bS5tZWRpYV9pdGVtc1t2bS5zZWxlY3RlZF0uaHRtbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgIHZtLnNlbGVjdGVkID0gdGh1bWJfbnVtO1xyXG4gICAgICAgIHZtLm1lZGlhX2l0ZW1zW3ZtLnNlbGVjdGVkXS5odG1sLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XHJcblxyXG4gICAgICAgIC8qcGljdHVyZSB0cmFuc2l0aW9uKi9cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgICAgICAvLyBpZih2bS52aW1lbyAmJiB2bS5zZWxlY3RlZCA9PT0gMCl7XHJcblxyXG4gICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICBpZiAodm0ubWVkaWFfc2VsZWN0ZWQuY2hpbGRyZW4ubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tZWRpYV9zZWxlY3RlZC5yZW1vdmVDaGlsZCh2bS5tZWRpYV9zZWxlY3RlZC5sYXN0Q2hpbGQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2bS5tZWRpYV9zZWxlY3RlZC5hcHBlbmRDaGlsZCh2bS5lbGVtZW50c1t2bS5zZWxlY3RlZF0pO1xyXG4gICAgICAgICAgICB2bS5vdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2Nsb3NlLW1lZGlhJyk7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhX2l0ZW1zW3ZtLnNlbGVjdGVkXS5odG1sLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgfSwgNjAwKTsgICBcclxuICAgIH1cclxufSIsImV4cG9ydCAqIGZyb20gXCIuL3NraWxsX2JhZGdlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2tpbGwge1xyXG4gIGZsZXhfaXRlbTogSFRNTERpdkVsZW1lbnQ7XHJcbiAgc3ZnOiBTVkdTVkdFbGVtZW50O1xyXG4gIHN2Z19jaXJjbGU6IFNWR0NpcmNsZUVsZW1lbnQ7XHJcbiAgc2NhbGVfYm94OiBIVE1MRGl2RWxlbWVudDtcclxuICBpbWFnZTogSFRNTEltYWdlRWxlbWVudDtcclxuICB0ZXh0OiBIVE1MRGl2RWxlbWVudDtcclxuICBmbGV4X2dyaWRfaWQ6IHN0cmluZztcclxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGNsYXNzcGVyY2VudDogc3RyaW5nLCBpbWFnZTogc3RyaW5nLCBmbGV4X2dyaWRfaWQ6IHN0cmluZykge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgIHZtLmZsZXhfZ3JpZF9pZCA9IGZsZXhfZ3JpZF9pZDtcclxuXHJcbiAgICB2bS5mbGV4X2l0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHZtLmZsZXhfaXRlbS5jbGFzc05hbWUgKz0gJ2ZsZXgtaXRlbSc7XHJcblxyXG4gICAgdm0uc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJzdmdcIilcclxuICAgIHZtLnN2Zy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NwZXJjZW50KVxyXG4gICAgdm0uc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnODQnKTtcclxuICAgIHZtLnN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICc4NCcpO1xyXG5cclxuICAgIHZtLnN2Z19jaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAnY2lyY2xlJyk7XHJcbiAgICB2bS5zdmdfY2lyY2xlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdjbGFzcycsICdvdXRlcicpO1xyXG4gICAgdm0uc3ZnX2NpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCBcImN4XCIsICctNDInKTtcclxuICAgIHZtLnN2Z19jaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgXCJjeVwiLCAnNDInKTtcclxuICAgIHZtLnN2Z19jaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgXCJyXCIsICczNycpO1xyXG4gICAgdm0uc3ZnX2NpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCBcInRyYW5zZm9ybVwiLCBcInJvdGF0ZSgtOTAsIDAsIDApXCIpO1xyXG5cclxuICAgIHZtLnNjYWxlX2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgaWYgKG5hbWUgPT09IFwiVHlwZSBTY3JpcHRcIiB8fCBuYW1lID09PSBcIkJvb3RzdHJhcFwiIHx8IG5hbWUgPT09IFwiRDMuanNcIiB8fCBuYW1lID09PSBcIlBob3Rvc2hvcFwiIHx8IG5hbWUgPT09IFwiSWxsdXN0cmF0b3JcIiB8fCBuYW1lID09PSBcIkFmdGVyIEVmZmVjdHNcIiB8fCBuYW1lID09PSBcIk1heWFcIiB8fCBuYW1lID09PSBcIk11ZGJveFwiKSB7XHJcbiAgICAgIHZtLnNjYWxlX2JveC5jbGFzc05hbWUgKz0gJ3NjYWxlLWJveC1zcXVhcmUnO1xyXG4gICAgfSBlbHNlIGlmIChuYW1lID09PSBcIlVuaXR5XCIgfHwgbmFtZSA9PT0gXCJQaGFzZXIuanNcIiB8fCBuYW1lID09PSBcIkQzLmpzXCIgfHwgbmFtZSA9PT0gXCJTQ1NTXCIgfHwgbmFtZSA9PT0gXCJKYXZhXCIgfHwgbmFtZSA9PT0gXCJQeXRob25cIikge1xyXG4gICAgICB2bS5zY2FsZV9ib3guY2xhc3NOYW1lICs9ICdzY2FsZS1ib3gtbWlkJztcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2bS5zY2FsZV9ib3guY2xhc3NOYW1lICs9ICdzY2FsZS1ib3gnO1xyXG4gICAgfVxyXG5cclxuICAgIHZtLmltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICB2bS5pbWFnZS5zcmMgPSBpbWFnZTtcclxuXHJcbiAgICB2bS50ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB2bS50ZXh0LmNsYXNzTmFtZSArPSAndGV4dCc7XHJcbiAgICB2bS50ZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5hbWUpKTtcclxuXHJcbiAgICAvLyAuZmxleC1pdGVtXHJcbiAgICAvLyAgICAgICBzdmcuY2lyY2xlLTc1KHdpZHRoPSc4NCcsIGhlaWdodD0nODQnKVxyXG4gICAgLy8gICAgICAgICBjaXJjbGUub3V0ZXIoY3g9Jy00MicsIGN5PSc0MicsIHI9JzM3JyB0cmFuc2Zvcm09XCJyb3RhdGUoLTkwLCAwLCAwKVwiKSBcclxuICAgIC8vICAgICAgIC5zY2FsZS1ib3hcclxuICAgIC8vICAgICAgICAgaW1nKGlkPVwiZm91clwiKVxyXG4gICAgLy8gICAgICAgICAudGV4dCBhYmNcclxuICAgIHZtLmZsZXhfaXRlbS5hcHBlbmRDaGlsZCh2bS5zdmcpO1xyXG4gICAgdm0uc3ZnLmFwcGVuZENoaWxkKHZtLnN2Z19jaXJjbGUpO1xyXG4gICAgdm0uZmxleF9pdGVtLmFwcGVuZENoaWxkKHZtLnNjYWxlX2JveCk7XHJcbiAgICB2bS5zY2FsZV9ib3guYXBwZW5kQ2hpbGQodm0uaW1hZ2UpO1xyXG4gICAgdm0uZmxleF9pdGVtLmFwcGVuZENoaWxkKHZtLnRleHQpO1xyXG4gIH1cclxuICByZXNldElkKGlkOiBzdHJpbmcpe1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdm0uZmxleF9ncmlkX2lkID0gaWQ7XHJcbiAgfVxyXG5cclxuICBhcHBlbmQoKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2YXIgZmxleF9ncmlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodm0uZmxleF9ncmlkX2lkKTtcclxuICAgIGZsZXhfZ3JpZC5hcHBlbmRDaGlsZCh2bS5mbGV4X2l0ZW0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU2tpbGxJbmZvIHtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgY2xhc3M6IHN0cmluZztcclxuICBpbWFnZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sbGVjdGlvbiB7XHJcbiAgaWQ6IHN0cmluZztcclxuICBpbWFnZXM6IElTa2lsbEluZm9bXTtcclxuICBwYXRoOiBzdHJpbmc7XHJcbiAgc2tpbGxzOiBTa2lsbFtdO1xyXG4gIGZsZXhfZ3JpZF9pZDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcsIGZsZXhfZ3JpZF9pZDogc3RyaW5nLCBpbWFnZXM6IElTa2lsbEluZm9bXSwgaWQ/OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIFxyXG4gICAgdm0uaW1hZ2VzID0gaW1hZ2VzO1xyXG4gICAgdm0ucGF0aCA9IHBhdGg7XHJcbiAgICB2bS5mbGV4X2dyaWRfaWQgPSBmbGV4X2dyaWRfaWQ7XHJcblxyXG4gICAgdm0uc2tpbGxzID0gW107XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbWFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdm0uc2tpbGxzLnB1c2gobmV3IFNraWxsKGltYWdlc1tpXS5uYW1lLCBpbWFnZXNbaV0uY2xhc3MsIHZtLnBhdGggKyBpbWFnZXNbaV0uaW1hZ2UsIHZtLmZsZXhfZ3JpZF9pZCkpO1xyXG4gICAgfVxyXG4gICAgaWYoaWQpe1xyXG4gICAgICB2bS5pZCA9IGlkO1xyXG4gICAgICB2YXIgZWxlbWVudCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh2bS5pZCk7XHJcbiAgICAgIGVsZW1lbnQub25tb3VzZXVwID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2bS5sb2FkKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyByZXNldElkcyhpZDogc3RyaW5nKXtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZtLmZsZXhfZ3JpZF9pZCA9IGlkO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5za2lsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdm0uc2tpbGxzW2ldLnJlc2V0SWQodm0uZmxleF9ncmlkX2lkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBsb2FkKCkgeyAvL3NldHMgc3JjJ3MgdG8gdGhlIGRvbS4gdGhlbiBvbmNlIGV2ZXJ5dGhpbmcgaXMgbG9hZGVkLCBpdCBhZGRzIGNsYXNzIGFjdGl2ZSB0byBtYWtlIHRoZW0gYXBwZWFyIHZpYSBjc3NcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZhciBmbGV4X2dyaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh2bS5mbGV4X2dyaWRfaWQpO1xyXG4gICAgd2hpbGUgKGZsZXhfZ3JpZC5maXJzdENoaWxkKSB7XHJcbiAgICAgIGZsZXhfZ3JpZC5yZW1vdmVDaGlsZChmbGV4X2dyaWQuZmlyc3RDaGlsZCk7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLnNraWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2bS5za2lsbHNbaV0uYXBwZW5kKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIHB1YmxpYyBjbG9zZSgpe1xyXG4gIC8vICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gIC8vICAgdmFyIGZsZXhfZ3JpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHZtLmZsZXhfZ3JpZF9pZCk7XHJcbiAgLy8gICB3aGlsZSAoZmxleF9ncmlkLmZpcnN0Q2hpbGQpIHtcclxuICAvLyAgICAgZmxleF9ncmlkLnJlbW92ZUNoaWxkKGZsZXhfZ3JpZC5maXJzdENoaWxkKTtcclxuICAvLyAgIH1cclxuICAvLyB9XHJcbn1cclxuIl19
