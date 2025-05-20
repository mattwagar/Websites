(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = exports.Img = void 0;
exports.lerp = lerp;
__exportStar(require("./image_canvas"), exports);
function lerp(from, to, percent) {
    var differance = to - from;
    return from + (differance * percent);
}
var Img = /** @class */ (function () {
    function Img(width, height) {
        var vm = this;
        vm.canvas = document.createElement('canvas');
        vm.ctx = vm.canvas.getContext('2d');
        vm.w = vm.canvas.width = width;
        vm.h = vm.canvas.height = height;
        vm.image = new Image();
        vm.image.src = 'portfolio/perlin_background.png';
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
        vm.imgWidth *= vm.scale * 1.1;
        vm.imgHeight *= vm.scale * 1.01;
        vm.anchorX = (vm.imgWidth - vm.screenWidth);
        vm.anchorY = (vm.imgHeight - vm.screenHeight);
        vm.x_offset_dest = vm.x_offset = vm.anchorX;
        vm.y_offset_dest = vm.y_offset = vm.anchorY;
    };
    Img.prototype.draw = function () {
        var vm = this;
        // vm.ctx.clearRect(0,0,vm.w, vm.h);
        vm.ctx.drawImage(vm.image, vm.x_offset, vm.y_offset, vm.image.naturalWidth, vm.image.naturalHeight, 0, 0, vm.imgWidth, vm.imgHeight);
    };
    return Img;
}());
exports.Img = Img;
var App = /** @class */ (function () {
    function App() {
        var vm = this;
        var element = document.getElementById('canvas');
        var isMobile = false; //initiate as false
        // device detection
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))
            isMobile = true;
        if (isMobile) {
            var image = document.createElement('img');
            image.src = 'portfolio/perlin_background.png';
            document.getElementById('canvas').style.display = 'none';
            document.getElementById('canvas-container').style.display = 'none';
            image.onload = function () {
                document.getElementById('welcome-page').insertBefore(image, document.getElementById('canvas-text-overlay'));
            };
        }
        else {
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
            // window.requestAnimationFrame((t) => { vm.drawImgIn(t, e) });
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wrapper = exports.Portfolio = exports.PortfolioItem = void 0;
var jump = require("jump.js");
var image_canvas = require("./image_canvas");
var skill_badge = require("./skill_badge");
var media = require("./media");
//yoo
var timeout = 1000;
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
    { "name": 'Houdini', "class": 'circle-100', "image": 'houdini.png' },
    { "name": 'Blender', "class": 'circle-50', "image": 'blender.svg' },
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
var PortfolioItem = /** @class */ (function () {
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
            different_wrapper = vm.portfolio.close(vm.item_num);
            vm.open = vm.target_wrapper.transitionWrapper(different_wrapper, vm.open, vm.title, vm.desc, vm.stack, vm.media, vm.url);
            setTimeout(function () {
                jump('#wrapper-' + vm.row, {
                    duration: 1000,
                    offset: -vm.col.clientHeight - 35
                });
            }, timeout);
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
        vm.row = row;
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
var Portfolio = /** @class */ (function () {
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
        //reassigns cols based on breakpoints
        var breakpoints = [{ min: 0, max: 768, col_size: 'col-xs-6', per_row: 2 }, { min: 769, max: 992, col_size: 'col-xs-4', per_row: 3 }, { min: 993, max: 1200, col_size: 'col-xs-3', per_row: 4 }, { min: 1200, max: 9999, col_size: 'col-xs-3', per_row: 4 }];
        for (var i = 0; i < breakpoints.length; i++) {
            //if in breakpoint range, and not same as before
            if ( /*vm.items[0].col_size !== breakpoints[i].col_size && */screenWidth > breakpoints[i].min && screenWidth < breakpoints[i].max) {
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
var Wrapper = /** @class */ (function () {
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
        stack_title.classList.add('header-text', 'pad-spacing');
        stack_title.appendChild(document.createTextNode('Skills Used'));
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
        vm.col6Holder.appendChild(vm.stack);
        vm.stack.appendChild(stack_title);
        vm.stack.appendChild(vm.flex_grid);
        vm.col6Holder.appendChild(vm.demo);
        vm.demo.appendChild(demo_title);
        vm.demo.appendChild(vm.link);
        vm.link.appendChild(vm.link_text);
        vm.link.onclick = function () {
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
        if (vm.url === "") {
            vm.col6Holder.removeChild(vm.demo);
        }
        else if (vm.col6Holder.lastChild !== vm.demo) {
            vm.col6Holder.appendChild(vm.demo);
        }
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
        if (vm.title === title) { /**if no change */
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
        else if (vm.html.classList[1] !== 'open') { /**if all selections are closed initially/change when closed*/
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
            }, timeout);
        }
        else if (open === undefined) {
            open = true;
            return_value = vm.changeWrapper(open, title, desc, stack, media, url);
        }
        else {
            return_value = vm.changeWrapper(open, title, desc, stack, media, url);
        }
        return return_value;
    };
    return Wrapper;
}());
exports.Wrapper = Wrapper;
// {"name": 'Python',      "class":'circle-50', "image":'python-5.svg'}
var breathless_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Phaser.js', "class": 'circle-100', "image": 'phaser.svg' },
    { "name": 'Photoshop', "class": 'circle-100', "image": 'photoshop-cc.svg' },
    { "name": 'jQuery', "class": 'circle-50', "image": 'jquery-1.svg' }], true);
var rem_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Unity', "class": 'circle-100', "image": 'unity.svg' },
    { "name": 'Maya', "class": 'circle-25', "image": 'maya.png' },
    { "name": 'Photoshop', "class": 'circle-25', "image": 'photoshop-cc.svg' },
    { "name": 'Illustrator', "class": 'circle-25', "image": 'adobe-illustrator-cc.svg' }], true);
var jedi_3_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Maya', "class": 'circle-100', "image": 'maya.png' },
    { "name": 'Unreal', "class": 'circle-75', "image": 'unreal.svg' },
    { "name": 'Blender', "class": 'circle-25', "image": 'blender.svg' }], true);
var survivor_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Unreal', "class": 'circle-100', "image": 'unreal.svg' },
    { "name": 'Houdini', "class": 'circle-75', "image": 'houdini.png' },
    { "name": 'Maya', "class": 'circle-75', "image": 'maya.png' }], true);
var mouse_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Unity', "class": 'circle-100', "image": 'unity.svg' },
    { "name": 'Motion Builder', "class": 'circle-75', "image": 'mobu.png' },
    { "name": 'Maya', "class": 'circle-50', "image": 'maya.png' },
    { "name": 'Vicon Blade', "class": 'circle-50', "image": 'vicon.png' },
], true);
var nk_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Unity', "class": 'circle-100', "image": 'unity.svg' },
    { "name": 'Illustrator', "class": 'circle-100', "image": 'adobe-illustrator-cc.svg' }], true);
var bee_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Unity', "class": 'circle-100', "image": 'unity.svg' },
], true);
var cave_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Houdini', "class": 'circle-100', "image": 'houdini.png' },
    { "name": 'Unity', "class": 'circle-100', "image": 'unity.svg' }], true);
var storygraph_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Unity', "class": 'circle-100', "image": 'unity.svg' },
    { "name": 'After Effects', "class": 'circle-25', "image": 'after-effects-cc.svg' }], true);
var qbert_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Maya', "class": 'circle-100', "image": 'maya.png' },
    { "name": 'Photoshop', "class": 'circle-25', "image": 'photoshop-cc.svg' }], true);
var weather_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Angular JS', "class": 'circle-100', "image": 'angular-icon.svg' },
    { "name": 'D3.js', "class": 'circle-50', "image": 'd3-2.svg' }], true);
var roast_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Ember JS', "class": 'circle-100', "image": 'ember.svg' },
    { "name": 'D3.js', "class": 'circle-75', "image": 'd3-2.svg' }], true);
var contrast_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Java', "class": 'circle-100', "image": 'java-14.svg' }], true);
var port_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Type Script', "class": 'circle-100', "image": 'typescript.svg' },
    { "name": 'HTML5', "class": 'circle-100', "image": 'html5.svg' },
    { "name": 'SCSS', "class": 'circle-100', "image": 'sass-1.svg' }], true);
// var breathless_media = new media.Media('media-0', ["./portfolio/breathless.jpg","./portfolio/breathless.jpg","./portfolio/cat.jpg"], ["./portfolio/breathless.jpg","./portfolio/cat.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
var m = [];
m.push(new media.Media('', ["./portfolio/rem_5.png", "./portfolio/rem_3.png", "./portfolio/rem_2.png", "./portfolio/rem_4.png"], ["./portfolio/rem_3.png", "./portfolio/rem_2.png", "./portfolio/rem_4.png"], '<iframe src="https://player.vimeo.com/video/252436989" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/tutorial_04.png', './portfolio/tutorial_01.png', './portfolio/tutorial_02.png', './portfolio/tutorial_03.png'], ['./portfolio/tutorial_01.png', './portfolio/tutorial_02.png', './portfolio/tutorial_03.png'], '<iframe width="560" height="315" src="https://www.youtube.com/embed/MsZjUHhCjJ8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'));
m.push(new media.Media('', ["./portfolio/island_03.png", "./portfolio/island_01.png", "./portfolio/island_02.png"], ["./portfolio/island_01.png", "./portfolio/island_02.png"], '<iframe src="https://player.vimeo.com/video/456677243" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>'));
// m.push(new media.Media('', ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"], ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"]));
// m.push(new media.Media('', ["./portfolio/qbert_play.jpg", "./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], ["./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
// m.push(new media.Media('', ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"], ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"]));
// m.push(new media.Media('', ['./portfolio/mean_forecast_1.jpg', './portfolio/mean_forecast_2.jpg'], ['./portfolio/mean_forecast_1.jpg', './portfolio/mean_forecast_2.jpg']));
// m.push(new media.Media('', ['./portfolio/roast_6.png', './portfolio/roast_2.png', './portfolio/roast_3.png', './portfolio/roast_4.png'], ['./portfolio/roast_6.png', './portfolio/roast_2.png','./portfolio/roast_3.png', './portfolio/roast_4.png']));
m.push(new media.Media('', ['./portfolio/StoryGraph_Card.png', './portfolio/storygraph_1.jpg', './portfolio/storygraph_2.jpg'], ['./portfolio/storygraph_1.jpg', './portfolio/storygraph_2.jpg'], '<iframe src="https://player.vimeo.com/video/369747471" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/crowd_1.png', './portfolio/crowd_2.png', './portfolio/crowd_3.png'], ['./portfolio/crowd_1.png', './portfolio/crowd_2.png', './portfolio/crowd_3.png']));
m.push(new media.Media('', ['./portfolio/bioshroom_1.png', './portfolio/bioshroom_2.png', './portfolio/bioshroom_3.png', './portfolio/bioshroom_4.png'], ['./portfolio/bioshroom_1.png', './portfolio/bioshroom_2.png', './portfolio/bioshroom_3.png'], '<iframe src="https://player.vimeo.com/video/369752631" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/axonrush_1.png', './portfolio/axonrush_2.png', './portfolio/axonrush_3.gif'], ['./portfolio/axonrush_2.png', './portfolio/axonrush_3.gif'], '<iframe src="https://player.vimeo.com/video/438301388" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/robot_1.png', './portfolio/robot_2.png', './portfolio/robot_3.png'], ['./portfolio/robot_2.png', './portfolio/robot_3.png'], '<iframe src="https://player.vimeo.com/video/369784543" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/cave_3.png', './portfolio/cave_2.png', './portfolio/cave_1.png', './portfolio/cave_4.png'], ['./portfolio/cave_2.png', './portfolio/cave_1.png', './portfolio/cave_4.png'], '<iframe src="https://player.vimeo.com/video/369789127" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/tube_3.png', './portfolio/tube_2.png', './portfolio/tube_4.png'], ['./portfolio/tube_2.png', './portfolio/tube_4.png'], '<iframe src="https://player.vimeo.com/video/369955460" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/hyperhop_01.gif', './portfolio/hyperhop_02.gif', './portfolio/hyperhop_03.gif'], ['./portfolio/hyperhop_01.gif', './portfolio/hyperhop_02.gif', './portfolio/hyperhop_03.gif']));
m.push(new media.Media('', ['./portfolio/bee_1.png', './portfolio/bee_2.png', './portfolio/bee_3.png'], ['./portfolio/bee_2.png', './portfolio/bee_3.png'], '<iframe src="https://player.vimeo.com/video/370220935" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/survivor_3.png', './portfolio/survivor_1.jpg', './portfolio/survivor_2.jpg'], ['./portfolio/survivor_3.png', './portfolio/survivor_1.jpg', './portfolio/survivor_2.jpg']));
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
window.onresize = function (e) {
    if (app.canvas) {
        app.sizeCanvas();
    }
    portfolio.appendAll();
};
var modal = document.getElementById("imageModal");
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
var closeBtn = document.querySelector(".close");
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

},{"./image_canvas":2,"./media":4,"./skill_badge":5,"jump.js":1}],4:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = exports.MediaItem = void 0;
__exportStar(require("./media"), exports);
var MediaItem = /** @class */ (function () {
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
var Media = /** @class */ (function () {
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
            // vm.elements[i].classList.add('dropshadow');
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
        vm.overlay.id = "image-overlay";
        vm.overlay.classList.add('overlay-media');
        vm.media_selected.appendChild(vm.overlay);
        vm.svg_overlay = document.createElement("img");
        vm.svg_overlay.src = "./portfolio/expand.svg";
        vm.svg_overlay.style.position = "absolute";
        vm.svg_overlay.style.bottom = "10px";
        vm.svg_overlay.style.right = "10px";
        vm.svg_overlay.style.width = "24px";
        vm.svg_overlay.style.height = "24px";
        vm.svg_overlay.style.cursor = "pointer";
        vm.svg_overlay.style.padding = "2px";
        vm.svg_overlay.style.fill = "white";
        vm.overlay.appendChild(vm.svg_overlay);
        vm.overlay.addEventListener("click", function (event) {
            var modal = document.getElementById("imageModal");
            var modalImg = document.getElementById("modalImage");
            var modalDesc = document.getElementById("modalDescription");
            var modalDesc = document.getElementById("modalTitle");
            console.log(vm.elements[vm.selected].src);
            modal.style.display = "block";
            modalImg.src = vm.elements[vm.selected].src;
            modalDesc.textContent = "Here’s a more detailed description of the image.";
            modalTitle.textContent = "The Best Title";
        });
        // vm.overlay = document.createElement('div');
        // vm.overlay.classList.add('overlay-media');
        // console.log(vm.overlay)
        // vm.media_selected.appendChild(vm.overlay);
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
            if (vm.elements.length !== 1) {
                vm.colmd.appendChild(vm.thumbnails[j]);
            }
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
        for (var i = 0; i < vm.media_items.length; i++) {
            vm.media_items[i].html.style.width = vm.colmd.clientWidth + 'px';
            vm.media_items[i].html.style.height = vm.colmd.clientHeight + 'px';
        }
        if (vm.vimeo && thumb_num === 0) {
            vm.elements.shift();
            var frag = vm.createFragment(vm.vimeo, vm.media_selected.clientWidth, vm.media_selected.clientHeight);
            vm.elements.unshift(frag);
            vm.overlay.style.visibility = 'hidden';
            // vm.elements[i].classList.add('dropshadow');
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
            vm.size();
            vm.overlay.classList.remove('close-media');
            vm.media_items[vm.selected].html.classList.add('selected');
            if (vm.vimeo && thumb_num === 0) {
                vm.svg_overlay.style.visibility = 'hidden';
            }
            else {
                vm.svg_overlay.style.visibility = 'visible';
            }
        }, 600);
    };
    return Media;
}());
exports.Media = Media;

},{"./media":4}],5:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = exports.Skill = void 0;
__exportStar(require("./skill_badge"), exports);
var Skill = /** @class */ (function () {
    function Skill(name, classpercent, image, flex_grid_id, blacktext) {
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
        if (blacktext) {
            vm.text.className += 'text black-text';
        }
        else {
            vm.text.className += 'text';
        }
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
var Collection = /** @class */ (function () {
    function Collection(path, flex_grid_id, images, blacktext, id) {
        var vm = this;
        vm.images = images;
        vm.path = path;
        vm.flex_grid_id = flex_grid_id;
        vm.skills = [];
        for (var i = 0; i < images.length; i++) {
            vm.skills.push(new Skill(images[i].name, images[i].class, vm.path + images[i].image, vm.flex_grid_id, blacktext));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvanVtcC5qcy9kaXN0L2p1bXAuanMiLCJzcmMvaW1hZ2VfY2FudmFzLnRzIiwic3JjL21haW4udHMiLCJzcmMvbWVkaWEudHMiLCJzcmMvc2tpbGxfYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDeEIsQ0FBQztJQUNILENBQUM7SUFRSCxpQkFBQztBQUFELENBckRBLEFBcURDLElBQUE7QUFyRFksZ0NBQVUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwuSnVtcCA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuLy8gUm9iZXJ0IFBlbm5lcidzIGVhc2VJbk91dFF1YWRcblxuLy8gZmluZCB0aGUgcmVzdCBvZiBoaXMgZWFzaW5nIGZ1bmN0aW9ucyBoZXJlOiBodHRwOi8vcm9iZXJ0cGVubmVyLmNvbS9lYXNpbmcvXG4vLyBmaW5kIHRoZW0gZXhwb3J0ZWQgZm9yIEVTNiBjb25zdW1wdGlvbiBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vamF4Z2VsbGVyL2V6LmpzXG5cbnZhciBlYXNlSW5PdXRRdWFkID0gZnVuY3Rpb24gZWFzZUluT3V0UXVhZCh0LCBiLCBjLCBkKSB7XG4gIHQgLz0gZCAvIDI7XG4gIGlmICh0IDwgMSkgcmV0dXJuIGMgLyAyICogdCAqIHQgKyBiO1xuICB0LS07XG4gIHJldHVybiAtYyAvIDIgKiAodCAqICh0IC0gMikgLSAxKSArIGI7XG59O1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iajtcbn0gOiBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xufTtcblxudmFyIGp1bXBlciA9IGZ1bmN0aW9uIGp1bXBlcigpIHtcbiAgLy8gcHJpdmF0ZSB2YXJpYWJsZSBjYWNoZVxuICAvLyBubyB2YXJpYWJsZXMgYXJlIGNyZWF0ZWQgZHVyaW5nIGEganVtcCwgcHJldmVudGluZyBtZW1vcnkgbGVha3NcblxuICB2YXIgZWxlbWVudCA9IHZvaWQgMDsgLy8gZWxlbWVudCB0byBzY3JvbGwgdG8gICAgICAgICAgICAgICAgICAgKG5vZGUpXG5cbiAgdmFyIHN0YXJ0ID0gdm9pZCAwOyAvLyB3aGVyZSBzY3JvbGwgc3RhcnRzICAgICAgICAgICAgICAgICAgICAocHgpXG4gIHZhciBzdG9wID0gdm9pZCAwOyAvLyB3aGVyZSBzY3JvbGwgc3RvcHMgICAgICAgICAgICAgICAgICAgICAocHgpXG5cbiAgdmFyIG9mZnNldCA9IHZvaWQgMDsgLy8gYWRqdXN0bWVudCBmcm9tIHRoZSBzdG9wIHBvc2l0aW9uICAgICAgKHB4KVxuICB2YXIgZWFzaW5nID0gdm9pZCAwOyAvLyBlYXNpbmcgZnVuY3Rpb24gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24pXG4gIHZhciBhMTF5ID0gdm9pZCAwOyAvLyBhY2Nlc3NpYmlsaXR5IHN1cHBvcnQgZmxhZyAgICAgICAgICAgICAoYm9vbGVhbilcblxuICB2YXIgZGlzdGFuY2UgPSB2b2lkIDA7IC8vIGRpc3RhbmNlIG9mIHNjcm9sbCAgICAgICAgICAgICAgICAgICAgIChweClcbiAgdmFyIGR1cmF0aW9uID0gdm9pZCAwOyAvLyBzY3JvbGwgZHVyYXRpb24gICAgICAgICAgICAgICAgICAgICAgICAobXMpXG5cbiAgdmFyIHRpbWVTdGFydCA9IHZvaWQgMDsgLy8gdGltZSBzY3JvbGwgc3RhcnRlZCAgICAgICAgICAgICAgICAgICAgKG1zKVxuICB2YXIgdGltZUVsYXBzZWQgPSB2b2lkIDA7IC8vIHRpbWUgc3BlbnQgc2Nyb2xsaW5nIHRodXMgZmFyICAgICAgICAgIChtcylcblxuICB2YXIgbmV4dCA9IHZvaWQgMDsgLy8gbmV4dCBzY3JvbGwgcG9zaXRpb24gICAgICAgICAgICAgICAgICAgKHB4KVxuXG4gIHZhciBjYWxsYmFjayA9IHZvaWQgMDsgLy8gdG8gY2FsbCB3aGVuIGRvbmUgc2Nyb2xsaW5nICAgICAgICAgICAgKGZ1bmN0aW9uKVxuXG4gIC8vIHNjcm9sbCBwb3NpdGlvbiBoZWxwZXJcblxuICBmdW5jdGlvbiBsb2NhdGlvbigpIHtcbiAgICByZXR1cm4gd2luZG93LnNjcm9sbFkgfHwgd2luZG93LnBhZ2VZT2Zmc2V0O1xuICB9XG5cbiAgLy8gZWxlbWVudCBvZmZzZXQgaGVscGVyXG5cbiAgZnVuY3Rpb24gdG9wKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBzdGFydDtcbiAgfVxuXG4gIC8vIHJBRiBsb29wIGhlbHBlclxuXG4gIGZ1bmN0aW9uIGxvb3AodGltZUN1cnJlbnQpIHtcbiAgICAvLyBzdG9yZSB0aW1lIHNjcm9sbCBzdGFydGVkLCBpZiBub3Qgc3RhcnRlZCBhbHJlYWR5XG4gICAgaWYgKCF0aW1lU3RhcnQpIHtcbiAgICAgIHRpbWVTdGFydCA9IHRpbWVDdXJyZW50O1xuICAgIH1cblxuICAgIC8vIGRldGVybWluZSB0aW1lIHNwZW50IHNjcm9sbGluZyBzbyBmYXJcbiAgICB0aW1lRWxhcHNlZCA9IHRpbWVDdXJyZW50IC0gdGltZVN0YXJ0O1xuXG4gICAgLy8gY2FsY3VsYXRlIG5leHQgc2Nyb2xsIHBvc2l0aW9uXG4gICAgbmV4dCA9IGVhc2luZyh0aW1lRWxhcHNlZCwgc3RhcnQsIGRpc3RhbmNlLCBkdXJhdGlvbik7XG5cbiAgICAvLyBzY3JvbGwgdG8gaXRcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgbmV4dCk7XG5cbiAgICAvLyBjaGVjayBwcm9ncmVzc1xuICAgIHRpbWVFbGFwc2VkIDwgZHVyYXRpb24gPyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApIC8vIGNvbnRpbnVlIHNjcm9sbCBsb29wXG4gICAgOiBkb25lKCk7IC8vIHNjcm9sbGluZyBpcyBkb25lXG4gIH1cblxuICAvLyBzY3JvbGwgZmluaXNoZWQgaGVscGVyXG5cbiAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAvLyBhY2NvdW50IGZvciByQUYgdGltZSByb3VuZGluZyBpbmFjY3VyYWNpZXNcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc3RhcnQgKyBkaXN0YW5jZSk7XG5cbiAgICAvLyBpZiBzY3JvbGxpbmcgdG8gYW4gZWxlbWVudCwgYW5kIGFjY2Vzc2liaWxpdHkgaXMgZW5hYmxlZFxuICAgIGlmIChlbGVtZW50ICYmIGExMXkpIHtcbiAgICAgIC8vIGFkZCB0YWJpbmRleCBpbmRpY2F0aW5nIHByb2dyYW1tYXRpYyBmb2N1c1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG5cbiAgICAgIC8vIGZvY3VzIHRoZSBlbGVtZW50XG4gICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgLy8gaWYgaXQgZXhpc3RzLCBmaXJlIHRoZSBjYWxsYmFja1xuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuXG4gICAgLy8gcmVzZXQgdGltZSBmb3IgbmV4dCBqdW1wXG4gICAgdGltZVN0YXJ0ID0gZmFsc2U7XG4gIH1cblxuICAvLyBBUElcblxuICBmdW5jdGlvbiBqdW1wKHRhcmdldCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIC8vIHJlc29sdmUgb3B0aW9ucywgb3IgdXNlIGRlZmF1bHRzXG4gICAgZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uIHx8IDEwMDA7XG4gICAgb2Zmc2V0ID0gb3B0aW9ucy5vZmZzZXQgfHwgMDtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2s7IC8vIFwidW5kZWZpbmVkXCIgaXMgYSBzdWl0YWJsZSBkZWZhdWx0LCBhbmQgd29uJ3QgYmUgY2FsbGVkXG4gICAgZWFzaW5nID0gb3B0aW9ucy5lYXNpbmcgfHwgZWFzZUluT3V0UXVhZDtcbiAgICBhMTF5ID0gb3B0aW9ucy5hMTF5IHx8IGZhbHNlO1xuXG4gICAgLy8gY2FjaGUgc3RhcnRpbmcgcG9zaXRpb25cbiAgICBzdGFydCA9IGxvY2F0aW9uKCk7XG5cbiAgICAvLyByZXNvbHZlIHRhcmdldFxuICAgIHN3aXRjaCAodHlwZW9mIHRhcmdldCA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YodGFyZ2V0KSkge1xuICAgICAgLy8gc2Nyb2xsIGZyb20gY3VycmVudCBwb3NpdGlvblxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgZWxlbWVudCA9IHVuZGVmaW5lZDsgLy8gbm8gZWxlbWVudCB0byBzY3JvbGwgdG9cbiAgICAgICAgYTExeSA9IGZhbHNlOyAvLyBtYWtlIHN1cmUgYWNjZXNzaWJpbGl0eSBpcyBvZmZcbiAgICAgICAgc3RvcCA9IHN0YXJ0ICsgdGFyZ2V0O1xuICAgICAgICBicmVhaztcblxuICAgICAgLy8gc2Nyb2xsIHRvIGVsZW1lbnQgKG5vZGUpXG4gICAgICAvLyBib3VuZGluZyByZWN0IGlzIHJlbGF0aXZlIHRvIHRoZSB2aWV3cG9ydFxuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgZWxlbWVudCA9IHRhcmdldDtcbiAgICAgICAgc3RvcCA9IHRvcChlbGVtZW50KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIHNjcm9sbCB0byBlbGVtZW50IChzZWxlY3RvcilcbiAgICAgIC8vIGJvdW5kaW5nIHJlY3QgaXMgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuICAgICAgICBzdG9wID0gdG9wKGVsZW1lbnQpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyByZXNvbHZlIHNjcm9sbCBkaXN0YW5jZSwgYWNjb3VudGluZyBmb3Igb2Zmc2V0XG4gICAgZGlzdGFuY2UgPSBzdG9wIC0gc3RhcnQgKyBvZmZzZXQ7XG5cbiAgICAvLyByZXNvbHZlIGR1cmF0aW9uXG4gICAgc3dpdGNoIChfdHlwZW9mKG9wdGlvbnMuZHVyYXRpb24pKSB7XG4gICAgICAvLyBudW1iZXIgaW4gbXNcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbjtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIGZ1bmN0aW9uIHBhc3NlZCB0aGUgZGlzdGFuY2Ugb2YgdGhlIHNjcm9sbFxuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb24oZGlzdGFuY2UpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBzdGFydCB0aGUgbG9vcFxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gIH1cblxuICAvLyBleHBvc2Ugb25seSB0aGUganVtcCBtZXRob2RcbiAgcmV0dXJuIGp1bXA7XG59O1xuXG4vLyBleHBvcnQgc2luZ2xldG9uXG5cbnZhciBzaW5nbGV0b24gPSBqdW1wZXIoKTtcblxucmV0dXJuIHNpbmdsZXRvbjtcblxufSkpKTtcbiIsIlxyXG5leHBvcnQgKiBmcm9tIFwiLi9pbWFnZV9jYW52YXNcIjtcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbGVycChmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIsIHBlcmNlbnQ6IG51bWJlcikge1xyXG4gIHZhciBkaWZmZXJhbmNlID0gdG8gLSBmcm9tO1xyXG4gIHJldHVybiBmcm9tICsgKGRpZmZlcmFuY2UgKiBwZXJjZW50KTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBJbWcge1xyXG4gIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgaW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnRcclxuICB3OiBudW1iZXI7XHJcbiAgaDogbnVtYmVyO1xyXG4gIHhfb2Zmc2V0X2Rlc3Q6IG51bWJlcjtcclxuICB5X29mZnNldF9kZXN0OiBudW1iZXI7XHJcbiAgeF9vZmZzZXQ6IG51bWJlcjtcclxuICB5X29mZnNldDogbnVtYmVyO1xyXG4gIGFuY2hvclg6IG51bWJlcjtcclxuICBhbmNob3JZOiBudW1iZXI7XHJcblxyXG4gIGltZ1dpZHRoOiBudW1iZXI7XHJcbiAgc2NyZWVuV2lkdGg6IG51bWJlcjtcclxuICBzY2FsZVg6IG51bWJlcjtcclxuICBzY2FsZVk6IG51bWJlcjtcclxuICBzY2FsZTogbnVtYmVyO1xyXG4gIGltZ0hlaWdodDogbnVtYmVyO1xyXG4gIHNjcmVlbkhlaWdodDogbnVtYmVyO1xyXG5cclxuICBsb2FkZWQ6IGJvb2xlYW47XHJcblxyXG5cclxuICBjb25zdHJ1Y3Rvcih3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdm0uY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICB2bS5jdHggPSB2bS5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIHZtLncgPSB2bS5jYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgIHZtLmggPSB2bS5jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgdm0uaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIHZtLmltYWdlLnNyYyA9ICdwb3J0Zm9saW8vcGVybGluX2JhY2tncm91bmQucG5nJztcclxuICAgIHZtLmxvYWRlZCA9IGZhbHNlO1xyXG5cclxuICAgIHZtLmltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdm0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgdm0uc2l6ZSh2bS53LCB2bS5oKTtcclxuICAgICAgdm0uZHJhdygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHNpemUodywgaCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgIHZtLncgPSB2bS5jYW52YXMud2lkdGggPSB3O1xyXG4gICAgdm0uaCA9IHZtLmNhbnZhcy5oZWlnaHQgPSBoO1xyXG5cclxuICAgIC8qZ2V0cyBzY2FsZVggYmFzZWQgb24gc2NyZWVuIGFuZCBpbWFnZSB3aWR0aCAqL1xyXG4gICAgdm0uaW1nV2lkdGggPSB2bS5pbWFnZS5uYXR1cmFsV2lkdGg7XHJcbiAgICB2bS5zY3JlZW5XaWR0aCA9IHc7XHJcbiAgICB2bS5zY2FsZVggPSB2bS5zY3JlZW5XaWR0aCAvIHZtLmltZ1dpZHRoO1xyXG5cclxuICAgIC8qZ2V0cyBzY2FsZVkgYmFzZWQgb24gc2NyZWVuIGFuZCBpbWFnZSB3aWR0aCAqL1xyXG4gICAgdm0uaW1nSGVpZ2h0ID0gdm0uaW1hZ2UubmF0dXJhbEhlaWdodDtcclxuICAgIHZtLnNjcmVlbkhlaWdodCA9IGg7XHJcbiAgICB2bS5zY2FsZVkgPSB2bS5zY3JlZW5IZWlnaHQgLyB2bS5pbWdIZWlnaHQ7XHJcblxyXG5cclxuICAgIC8qc2V0cyBiYXNpYyBzY2FsZSB0byBYICovXHJcblxyXG4gICAgdm0uc2NhbGUgPSB2bS5zY2FsZVhcclxuICAgIGlmICh2bS5zY2FsZVggPCB2bS5zY2FsZVkpIHtcclxuICAgICAgdm0uc2NhbGUgPSB2bS5zY2FsZVk7XHJcbiAgICB9XHJcblxyXG4gICAgdm0uaW1nV2lkdGggKj0gdm0uc2NhbGUgKiAxLjE7XHJcbiAgICB2bS5pbWdIZWlnaHQgKj0gdm0uc2NhbGUgKiAxLjAxO1xyXG5cclxuICAgIHZtLmFuY2hvclggPSAodm0uaW1nV2lkdGggLSB2bS5zY3JlZW5XaWR0aCk7XHJcbiAgICB2bS5hbmNob3JZID0gKHZtLmltZ0hlaWdodCAtIHZtLnNjcmVlbkhlaWdodCk7XHJcblxyXG4gICAgdm0ueF9vZmZzZXRfZGVzdCA9IHZtLnhfb2Zmc2V0ID0gdm0uYW5jaG9yWDtcclxuICAgIHZtLnlfb2Zmc2V0X2Rlc3QgPSB2bS55X29mZnNldCA9IHZtLmFuY2hvclk7XHJcblxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXcoKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAvLyB2bS5jdHguY2xlYXJSZWN0KDAsMCx2bS53LCB2bS5oKTtcclxuXHJcbiAgICB2bS5jdHguZHJhd0ltYWdlKHZtLmltYWdlLCB2bS54X29mZnNldCwgdm0ueV9vZmZzZXQsIHZtLmltYWdlLm5hdHVyYWxXaWR0aCwgdm0uaW1hZ2UubmF0dXJhbEhlaWdodCwgMCwgMCwgdm0uaW1nV2lkdGgsIHZtLmltZ0hlaWdodCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXBwIHtcclxuICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gIHc6IG51bWJlcjtcclxuICBoOiBudW1iZXI7XHJcbiAgLy8gcmVjdDogUmVjdGFuZ2xlXHJcbiAgaW1nOiBJbWc7XHJcblxyXG4gIG1vdXNlSW46IGJvb2xlYW47XHJcbiAgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XHJcblxyXG4gICAgdmFyIGlzTW9iaWxlID0gZmFsc2U7IC8vaW5pdGlhdGUgYXMgZmFsc2VcclxuICAgIC8vIGRldmljZSBkZXRlY3Rpb25cclxuICAgIGlmICgvKGFuZHJvaWR8YmJcXGQrfG1lZWdvKS4rbW9iaWxlfGF2YW50Z298YmFkYVxcL3xibGFja2JlcnJ5fGJsYXplcnxjb21wYWx8ZWxhaW5lfGZlbm5lY3xoaXB0b3B8aWVtb2JpbGV8aXAoaG9uZXxvZCl8aXBhZHxpcmlzfGtpbmRsZXxBbmRyb2lkfFNpbGt8bGdlIHxtYWVtb3xtaWRwfG1tcHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyAoY2V8cGhvbmUpfHhkYXx4aWluby9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgfHwgLzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50LnN1YnN0cigwLCA0KSkpIGlzTW9iaWxlID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoaXNNb2JpbGUpIHtcclxuICAgICAgdmFyIGltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgIGltYWdlLnNyYyA9ICdwb3J0Zm9saW8vcGVybGluX2JhY2tncm91bmQucG5nJztcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMtY29udGFpbmVyJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2VsY29tZS1wYWdlJykuaW5zZXJ0QmVmb3JlKGltYWdlLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzLXRleHQtb3ZlcmxheScpKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcblxyXG5cclxuXHJcbiAgICAgIHZtLmNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XHJcbiAgICAgIHZtLmN0eCA9IHZtLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuXHJcblxyXG4gICAgICB2bS5zaXplQ2FudmFzKCk7XHJcbiAgICAgIC8vIHZtLmluaXRFdmVudHMoKTtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodCkgPT4geyB2bS5kcmF3KHQpOyB9KTtcclxuXHJcbiAgICAgIHZtLmltZyA9IG5ldyBJbWcodm0udywgdm0uaCk7XHJcblxyXG4gICAgICB2bS5tb3VzZUluID0gZmFsc2U7XHJcblxyXG4gICAgICB2bS5jb250YWluZXIgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcy1jb250YWluZXInKTtcclxuXHJcbiAgICAgIHZtLmNvbnRhaW5lci5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdm0uZHJhd0ltZ0luKDAsIGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2bS5jb250YWluZXIub25tb3VzZWVudGVyID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2bS5tb3VzZUluID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdm0uY29udGFpbmVyLm9ubW91c2VvdXQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZtLm1vdXNlSW4gPSBmYWxzZTtcclxuICAgICAgICB2bS5kcmF3SW1nT3V0KDAsIGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2l6ZUNhbnZhcygpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZtLmNhbnZhcy5zdHlsZS53aWR0aCA9ICcxMDAlJztcclxuICAgIHZtLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XHJcbiAgICB0aGlzLncgPSB0aGlzLmNhbnZhcy53aWR0aCA9IHZtLmNhbnZhcy5vZmZzZXRXaWR0aDtcclxuICAgIHRoaXMuaCA9IHRoaXMuY2FudmFzLmhlaWdodCA9IHZtLmNhbnZhcy5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgaWYgKHZtLmltZykge1xyXG4gICAgICB2bS5pbWcuc2l6ZSh2bS53LCB2bS5oKTtcclxuICAgICAgdm0uaW1nLmRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG4gIHB1YmxpYyBkcmF3KHQ6IGFueSkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodCkgPT4geyB0aGlzLmRyYXcodCk7IH0pO1xyXG4gICAgdm0uY3R4LmNsZWFyUmVjdCgwLCAwLCB2bS53LCB2bS5oKTtcclxuXHJcbiAgICB2bS5jdHguZHJhd0ltYWdlKHZtLmltZy5jYW52YXMsIDAsIDApO1xyXG4gICAgdm0uaW1nLmRyYXcoKTtcclxuXHJcblxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdJbWdJbih0OiBhbnksIGU6IGFueSkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuXHJcbiAgICAvKnJhdGlvID0gKGltZ1dpZHRoIC8gc2NyZWVuV2lkdGgpICAqL1xyXG5cclxuICAgIHZhciBtb3ZlUmF0aW9YID0gKGUuY2xpZW50WCAvIHZtLmltZy5zY3JlZW5XaWR0aCk7IC8vcmFuZ2UgZnJvbSBbMCwgMV06IDAgYmVpbmcgbGVmdCwgMSBiZWluZyByaWdodFxyXG4gICAgdmFyIG1vdmVPZmZzZXRYID0gLXZtLmltZy5hbmNob3JYICsgKG1vdmVSYXRpb1ggKiB2bS5pbWcuYW5jaG9yWCk7XHJcblxyXG4gICAgdmFyIG1vdmVSYXRpb1kgPSAoZS5jbGllbnRZIC8gdm0uaW1nLnNjcmVlbkhlaWdodCk7IC8vcmFuZ2UgZnJvbSBbMCwgMV06IDAgYmVpbmcgbGVmdCwgMSBiZWluZyByaWdodFxyXG4gICAgdmFyIG1vdmVPZmZzZXRZID0gLXZtLmltZy5hbmNob3JZICsgKG1vdmVSYXRpb1kgKiB2bS5pbWcuYW5jaG9yWSk7XHJcblxyXG5cclxuICAgIC8qb2Zmc2V0ID0gbWlkZGxlX2FuY2hvciArIGRyYWdnZWRfb2Zmc2V0Ki9cclxuICAgIHZtLmltZy54X29mZnNldF9kZXN0ID0gdm0uaW1nLmFuY2hvclggKyBtb3ZlT2Zmc2V0WDtcclxuICAgIHZtLmltZy55X29mZnNldF9kZXN0ID0gdm0uaW1nLmFuY2hvclkgKyBtb3ZlT2Zmc2V0WTtcclxuXHJcbiAgICBpZiAodm0ubW91c2VJbiA9PT0gdHJ1ZSAmJiBNYXRoLnJvdW5kKHZtLmltZy55X29mZnNldCkgIT09IE1hdGgucm91bmQodm0uaW1nLnlfb2Zmc2V0X2Rlc3QpICYmIE1hdGgucm91bmQodm0uaW1nLnhfb2Zmc2V0KSAhPT0gTWF0aC5yb3VuZCh2bS5pbWcueF9vZmZzZXRfZGVzdCkpIHtcclxuXHJcblxyXG4gICAgICB2bS5pbWcueF9vZmZzZXQgPSBNYXRoLnJvdW5kKGxlcnAodm0uaW1nLnhfb2Zmc2V0LCB2bS5pbWcueF9vZmZzZXRfZGVzdCwgMC4xKSk7XHJcbiAgICAgIHZtLmltZy55X29mZnNldCA9IE1hdGgucm91bmQobGVycCh2bS5pbWcueV9vZmZzZXQsIHZtLmltZy55X29mZnNldF9kZXN0LCAwLjEpKTtcclxuXHJcbiAgICAgIC8vIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHQpID0+IHsgdm0uZHJhd0ltZ0luKHQsIGUpIH0pO1xyXG5cclxuXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd0ltZ091dCh0OiBhbnksIGU6IGFueSkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgIC8qcmF0aW8gPSAoaW1nV2lkdGggLyBzY3JlZW5XaWR0aCkgICovXHJcblxyXG4gICAgLy8gdmFyIG1vdmVSYXRpb1ggPSAoZS5jbGllbnRYIC8gdm0uaW1nLnNjcmVlbldpZHRoKTsgLy9yYW5nZSBmcm9tIFswLCAxXTogMCBiZWluZyBsZWZ0LCAxIGJlaW5nIHJpZ2h0XHJcbiAgICAvLyB2YXIgbW92ZU9mZnNldFggPSAtdm0uaW1nLmFuY2hvclggKyAobW92ZVJhdGlvWCAqIHZtLmltZy5hbmNob3JYICogMik7XHJcblxyXG4gICAgLy8gdmFyIG1vdmVSYXRpb1kgPSAoZS5jbGllbnRZIC8gdm0uaW1nLnNjcmVlbkhlaWdodCkgKiAyOyAvL3JhbmdlIGZyb20gWzAsIDFdOiAwIGJlaW5nIGxlZnQsIDEgYmVpbmcgcmlnaHRcclxuICAgIC8vIHZhciBtb3ZlT2Zmc2V0WSA9IC12bS5pbWcuYW5jaG9yWSArIChtb3ZlUmF0aW9ZICogdm0uaW1nLmFuY2hvclkpO1xyXG5cclxuXHJcbiAgICAvKm9mZnNldCA9IG1pZGRsZV9hbmNob3IgKyBkcmFnZ2VkX29mZnNldCovXHJcbiAgICB2bS5pbWcueF9vZmZzZXRfZGVzdCA9IHZtLmltZy5hbmNob3JYO1xyXG4gICAgdm0uaW1nLnlfb2Zmc2V0X2Rlc3QgPSB2bS5pbWcuYW5jaG9yWTtcclxuXHJcbiAgICBpZiAodm0ubW91c2VJbiA9PT0gZmFsc2UgJiYgTWF0aC5yb3VuZCh2bS5pbWcueV9vZmZzZXQpICE9PSBNYXRoLnJvdW5kKHZtLmltZy55X29mZnNldF9kZXN0KSAmJiBNYXRoLnJvdW5kKHZtLmltZy54X29mZnNldCkgIT09IE1hdGgucm91bmQodm0uaW1nLnhfb2Zmc2V0X2Rlc3QpKSB7XHJcblxyXG5cclxuICAgICAgdm0uaW1nLnhfb2Zmc2V0ID0gbGVycCh2bS5pbWcueF9vZmZzZXQsIHZtLmltZy54X29mZnNldF9kZXN0LCAwLjEpO1xyXG4gICAgICB2bS5pbWcueV9vZmZzZXQgPSBsZXJwKHZtLmltZy55X29mZnNldCwgdm0uaW1nLnlfb2Zmc2V0X2Rlc3QsIDAuMSk7XHJcblxyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0KSA9PiB7IHZtLmRyYXdJbWdPdXQodCwgZSkgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIC8vIGluaXRFdmVudHMoKSB7XHJcbiAgLy8gICB3aW5kb3cub25yZXNpemUgPSAoZSkgPT4ge1xyXG4gIC8vICAgICB0aGlzLnNpemVDYW52YXMoKTtcclxuICAvLyAgIH07XHJcbiAgLy8gfVxyXG5cclxufSIsImltcG9ydCAqIGFzIGp1bXAgZnJvbSBcImp1bXAuanNcIjtcclxuXHJcbmltcG9ydCAqIGFzIGltYWdlX2NhbnZhcyBmcm9tIFwiLi9pbWFnZV9jYW52YXNcIjtcclxuXHJcbmltcG9ydCAqIGFzIHNraWxsX2JhZGdlIGZyb20gXCIuL3NraWxsX2JhZGdlXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBtZWRpYSBmcm9tIFwiLi9tZWRpYVwiO1xyXG5cclxuaW1wb3J0IFZpZXdlciBmcm9tICd2aWV3ZXJqcyc7XHJcblxyXG4vL3lvb1xyXG5jb25zdCB0aW1lb3V0OiBudW1iZXIgPSAxMDAwO1xyXG5cclxudmFyIGZyb250ZW5kID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICdmbGV4LWdyaWQxJywgW1xyXG4gICAgeyBcIm5hbWVcIjogJ1B5dGhvbicsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdweXRob24tNS5zdmcnIH0sXHJcbiAgICB7IFwibmFtZVwiOiAnQyMnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnY3NoYXJwLnN2ZycgfSxcclxuICAgIHsgXCJuYW1lXCI6ICdKYXZhIFNjcmlwdCcsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdqYXZhc2NyaXB0LTIuc3ZnJyB9LFxyXG4gICAgeyBcIm5hbWVcIjogJ0MrKycsIFwiY2xhc3NcIjogJ2NpcmNsZS03NScsIFwiaW1hZ2VcIjogJ2Mtc2Vla2xvZ28uY29tLnN2ZycgfSxcclxuICAgIHsgXCJuYW1lXCI6ICdKYXZhJywgXCJjbGFzc1wiOiAnY2lyY2xlLTUwJywgXCJpbWFnZVwiOiAnamF2YS0xNC5zdmcnIH0sXHJcbiAgICB7IFwibmFtZVwiOiAnTm9kZSBKUycsIFwiY2xhc3NcIjogJ2NpcmNsZS0yNScsIFwiaW1hZ2VcIjogJ25vZGVqcy1pY29uLnN2ZycgfSxcclxuXHJcbi8vIHsgXCJuYW1lXCI6ICdqUXVlcnknLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnanF1ZXJ5LTEuc3ZnJyB9LFxyXG4vLyB7IFwibmFtZVwiOiAnRW1iZXIgSlMnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnZW1iZXIuc3ZnJyB9LFxyXG4vLyB7IFwibmFtZVwiOiAnQW5ndWxhciBKUycsIFwiY2xhc3NcIjogJ2NpcmNsZS03NScsIFwiaW1hZ2VcIjogJ2FuZ3VsYXItaWNvbi5zdmcnIH0sXHJcbi8vIHsgXCJuYW1lXCI6ICdUeXBlIFNjcmlwdCcsIFwiY2xhc3NcIjogJ2NpcmNsZS03NScsIFwiaW1hZ2VcIjogJ3R5cGVzY3JpcHQuc3ZnJyB9LFxyXG4vLyB7IFwibmFtZVwiOiAnRDMuanMnLCBcImNsYXNzXCI6ICdjaXJjbGUtNzUnLCBcImltYWdlXCI6ICdkMy0yLnN2ZycgfSxcclxuLy8geyBcIm5hbWVcIjogJ1NDU1MnLCBcImNsYXNzXCI6ICdjaXJjbGUtNTAnLCBcImltYWdlXCI6ICdzYXNzLTEuc3ZnJyB9LFxyXG4vLyB7IFwibmFtZVwiOiAnUmVhY3QgSlMnLCBcImNsYXNzXCI6ICdjaXJjbGUtMjUnLCBcImltYWdlXCI6ICdyZWFjdC5zdmcnIH1cclxuXSwgZmFsc2UsICdmcm9udGVuZCcpO1xyXG52YXIgc29mdGVuZyA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnZmxleC1ncmlkMicsIFtcclxuICAgIHsgXCJuYW1lXCI6ICdVbnJlYWwgRW5naW5lIDUnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAndW5yZWFsLnN2ZycgfSxcclxuICAgIHsgXCJuYW1lXCI6ICdVbml0eScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICd1bml0eS5zdmcnIH0sXHJcbiAgICB7IFwibmFtZVwiOiAnTWF5YScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdtYXlhLnBuZycgfSxcclxuICAgIHsgXCJuYW1lXCI6ICdIb3VkaW5pJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2hvdWRpbmkucG5nJ30sXHJcbiAgICB7IFwibmFtZVwiOiAnQmxlbmRlcicsIFwiY2xhc3NcIjogJ2NpcmNsZS01MCcsIFwiaW1hZ2VcIjogJ2JsZW5kZXIuc3ZnJ30sXHJcbiAgICBcclxuXSwgZmFsc2UsICdzb2Z0ZW5nJyk7XHJcbnZhciBkZXNpZ24gPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJ2ZsZXgtZ3JpZDMnLCBbXHJcbnsgXCJuYW1lXCI6ICdIVE1MNScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdodG1sNS5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdDU1MnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnY3NzLTMuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnSWxsdXN0cmF0b3InLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnYWRvYmUtaWxsdXN0cmF0b3ItY2Muc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnQWZ0ZXIgRWZmZWN0cycsIFwiY2xhc3NcIjogJ2NpcmNsZS01MCcsIFwiaW1hZ2VcIjogJ2FmdGVyLWVmZmVjdHMtY2Muc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnTW90aW9uIEJ1aWxkZXInLCBcImNsYXNzXCI6ICdjaXJjbGUtMjUnLCBcImltYWdlXCI6ICdtb2J1LnBuZycgfSxcclxueyBcIm5hbWVcIjogJ1ZpY29uIEJsYWRlJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAndmljb24ucG5nJyB9LFxyXG57IFwibmFtZVwiOiAnUGhvdG9zaG9wJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAncGhvdG9zaG9wLWNjLnN2ZycgfSxcclxuLy8geyBcIm5hbWVcIjogJ011ZGJveCcsIFwiY2xhc3NcIjogJ2NpcmNsZS0yNScsIFwiaW1hZ2VcIjogJ211ZGJveC5wbmcnIH1cclxuXSwgZmFsc2UsICdkZXNpZ24nKTtcclxuZnJvbnRlbmQubG9hZCgpO1xyXG5zb2Z0ZW5nLmxvYWQoKTtcclxuZGVzaWduLmxvYWQoKTtcclxuXHJcblxyXG52YXIgYXBwO1xyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBhcHAgPSBuZXcgaW1hZ2VfY2FudmFzLkFwcCgpO1xyXG59KTtcclxuXHJcblxyXG4vLyB3aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpe1xyXG4vLyAgICAgY29uc29sZS5sb2cod2luZG93LnNjcm9sbFkpO1xyXG4vLyB9XHJcblxyXG5cclxuLy8gdmFyIHcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndyYXBwZXItMFwiKTtcclxuLy8gdmFyIGIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncDEnKTtcclxuXHJcblxyXG4vLyBiLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4vLyAgICAgaWYody5jbGFzc0xpc3RbMV0gPT09IFwib3BlblwiKXtcclxuLy8gICAgICAgICB3LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuLy8gICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgdy5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcbi8vICAgICB9XHJcbi8vIH1cclxuXHJcbmV4cG9ydCBjbGFzcyBQb3J0Zm9saW9JdGVtIHtcclxuICAgIHRpdGxlOiBzdHJpbmc7XHJcbiAgICB0aXRsZV9pbWFnZTogc3RyaW5nO1xyXG4gICAgZGVzYzogc3RyaW5nO1xyXG4gICAgc3RhY2s6IHNraWxsX2JhZGdlLkNvbGxlY3Rpb247XHJcbiAgICBwb3J0X2ltYWdlOiBzdHJpbmc7XHJcbiAgICB1cmw6IHN0cmluZztcclxuXHJcbiAgICBpdGVtX251bTogbnVtYmVyO1xyXG5cclxuICAgIGNvbF9zaXplOiBzdHJpbmc7XHJcbiAgICBjb2w6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gICAgdGV4dDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBzdWJfdGV4dDogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgb3BlbjogYm9vbGVhbjtcclxuICAgIG1lZGlhOiBtZWRpYS5NZWRpYTtcclxuICAgIHRhcmdldF93cmFwcGVyOiBXcmFwcGVyO1xyXG4gICAgcG9ydGZvbGlvOiBQb3J0Zm9saW87XHJcbiAgICByb3c6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwb3J0Zm9saW86IFBvcnRmb2xpbywgaXRlbV9udW06IG51bWJlciwgdGl0bGU6IHN0cmluZywgdGl0bGVfaW1hZ2U6IHN0cmluZywgZGVzYzogc3RyaW5nLCBzdGFjazogc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbiwgbWVkaWE6IG1lZGlhLk1lZGlhLCB0eXBlOiBzdHJpbmcsIHVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB2bS5wb3J0Zm9saW8gPSBwb3J0Zm9saW87XHJcbiAgICAgICAgdm0uaXRlbV9udW0gPSBpdGVtX251bTtcclxuICAgICAgICB2bS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHZtLnRpdGxlX2ltYWdlID0gdGl0bGVfaW1hZ2U7XHJcbiAgICAgICAgdm0uZGVzYyA9IGRlc2M7XHJcbiAgICAgICAgdm0uc3RhY2sgPSBzdGFjaztcclxuICAgICAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgICAgIHZtLnVybCA9IHVybDtcclxuICAgICAgICB2bS5jb2xfc2l6ZSA9IFwiY29sLW1kLTNcIjtcclxuXHJcblxyXG4gICAgICAgIHZtLmNvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmNvbC5jbGFzc0xpc3QuYWRkKHZtLmNvbF9zaXplKTtcclxuXHJcbiAgICAgICAgdmFyIGNhcmRfc2hhZG93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY2FyZF9zaGFkb3cuY2xhc3NMaXN0LmFkZCgnY2FyZC1kcm9wc2hhZG93JywgJ3JvdycpO1xyXG5cclxuICAgICAgICB2YXIgbm9wYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBub3BhZC5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInLCAnbm9wYWQnKTtcclxuXHJcbiAgICAgICAgdm0uaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgICAgdm0uaW1nLnNyYyA9IHZtLnRpdGxlX2ltYWdlO1xyXG5cclxuICAgICAgICB2YXIgY29sMTIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb2wxMi5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInKTtcclxuXHJcbiAgICAgICAgdm0udGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnRleHQuY2xhc3NMaXN0LmFkZCgndGV4dCcsICdwYWRkaW5nLXRvcCcpO1xyXG4gICAgICAgIHZtLnRleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGl0bGUpKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbDEyXzIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb2wxMl8yLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicpO1xyXG5cclxuICAgICAgICB2bS5zdWJfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnN1Yl90ZXh0LmNsYXNzTGlzdC5hZGQoJ3RleHRfbGlnaHQnKTtcclxuICAgICAgICB2bS5zdWJfdGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0eXBlKSk7XHJcblxyXG4gICAgICAgIC8vIC5jb2wtbWQtM1xyXG4gICAgICAgIC8vICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKSNwMVxyXG4gICAgICAgIC8vICAgICAgIC50ZXh0IEJyZWF0aGxlc3M6IEhUTUw1IEdhbWVcclxuXHJcbiAgICAgICAgLy8gLmNvbC1tZC0zXHJcbiAgICAgICAgLy8gICAgICAgLmNhcmQtZHJvcHNoYWRvdy5yb3dcclxuICAgICAgICAvLyAgICAgICAgIC5jb2wtbWQtMTIubm9wYWRcclxuICAgICAgICAvLyAgICAgICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpI3AxLmRyb3BzaGFkb3dcclxuICAgICAgICAvLyAgICAgICAgIC5jb2wtbWQtMTJcclxuICAgICAgICAvLyAgICAgICAgICAgLnRleHQgQnJlYXRobGVzc1xyXG4gICAgICAgIC8vICAgICAgICAgLmNvbC1tZC0xMlxyXG4gICAgICAgIC8vICAgICAgICAgICAudGV4dF9saWdodCBIVE1MNSBHYW1lXHJcblxyXG4gICAgICAgIHZtLmNvbC5hcHBlbmRDaGlsZChjYXJkX3NoYWRvdyk7XHJcbiAgICAgICAgY2FyZF9zaGFkb3cuYXBwZW5kQ2hpbGQobm9wYWQpO1xyXG4gICAgICAgIG5vcGFkLmFwcGVuZENoaWxkKHZtLmltZyk7XHJcbiAgICAgICAgY2FyZF9zaGFkb3cuYXBwZW5kQ2hpbGQoY29sMTIpO1xyXG4gICAgICAgIGNvbDEyLmFwcGVuZENoaWxkKHZtLnRleHQpO1xyXG4gICAgICAgIGNhcmRfc2hhZG93LmFwcGVuZENoaWxkKGNvbDEyXzIpO1xyXG4gICAgICAgIGNvbDEyXzIuYXBwZW5kQ2hpbGQodm0uc3ViX3RleHQpO1xyXG5cclxuICAgICAgICB2bS5vcGVuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHZtLmNvbC5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyAgIGNvbnNvbGUuKHZtLml0ZW1zWzBdKTtcclxuICAgICAgICAgICAgdmFyIGRpZmZlcmVudF93cmFwcGVyID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBkaWZmZXJlbnRfd3JhcHBlciA9IHZtLnBvcnRmb2xpby5jbG9zZSh2bS5pdGVtX251bSk7XHJcblxyXG4gICAgICAgICAgICB2bS5vcGVuID0gdm0udGFyZ2V0X3dyYXBwZXIudHJhbnNpdGlvbldyYXBwZXIoZGlmZmVyZW50X3dyYXBwZXIsIHZtLm9wZW4sIHZtLnRpdGxlLCB2bS5kZXNjLCB2bS5zdGFjaywgdm0ubWVkaWEsIHZtLnVybClcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAganVtcCgnI3dyYXBwZXItJyArIHZtLnJvdywge1xyXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxyXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogLXZtLmNvbC5jbGllbnRIZWlnaHQgLSAzNVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSwgdGltZW91dCk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gICB2bS5zZXREYXRhKCk7ICBcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgYXBwZW5kKHJvdzogbnVtYmVyLCB3cmFwcGVyOiBXcmFwcGVyKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZhciByb3dfZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb3dfJyArIHJvdyk7XHJcbiAgICAgICAgcm93X2VsZW1lbnQuYXBwZW5kQ2hpbGQodm0uY29sKTtcclxuICAgICAgICB2bS50YXJnZXRfd3JhcHBlciA9IHdyYXBwZXI7XHJcbiAgICAgICAgdm0uc3RhY2suZmxleF9ncmlkX2lkID0gd3JhcHBlci5mbGV4X2dyaWQuaWQ7XHJcbiAgICAgICAgdm0ubWVkaWEuaWQgPSAnbWVkaWEtJyArIHJvdztcclxuICAgICAgICB2bS5yb3cgPSByb3c7XHJcbiAgICB9XHJcbiAgICBzZXRDb2woY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uY29sLmNsYXNzTGlzdC5yZW1vdmUodm0uY29sX3NpemUpO1xyXG4gICAgICAgIHZtLmNvbF9zaXplID0gY2xhc3NOYW1lO1xyXG4gICAgICAgIHZtLmNvbC5jbGFzc0xpc3QuYWRkKHZtLmNvbF9zaXplKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUG9ydGZvbGlvIHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBqc29uX29ianM6IElQb3J0Zm9saW9JdGVtW107XHJcbiAgICBwYXRoOiBzdHJpbmc7XHJcbiAgICBpdGVtczogUG9ydGZvbGlvSXRlbVtdO1xyXG4gICAgd3JhcHBlcnM6IFdyYXBwZXJbXTtcclxuICAgIGZsZXhfZ3JpZF9pZDogc3RyaW5nO1xyXG4gICAgcGVyX3JvdzogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGpzb25fb2JqczogSVBvcnRmb2xpb0l0ZW1bXSkge1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5pZCA9IGlkO1xyXG4gICAgICAgIHZtLmpzb25fb2JqcyA9IGpzb25fb2JqcztcclxuXHJcblxyXG4gICAgICAgIHZtLml0ZW1zID0gW107XHJcbiAgICAgICAgdm0ud3JhcHBlcnMgPSBbXTtcclxuXHJcbiAgICAgICAgLy9hZGQgd3JhcHBlcnMgYmFzZWQgb24gYWxsIHBvc3NpYmxlIGJyZWFrcG9pbnQgd2lkdGhzIChqc29uX29ianMvMilcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE1hdGguY2VpbChqc29uX29ianMubGVuZ3RoIC8gMik7IGorKykge1xyXG4gICAgICAgICAgICB2bS53cmFwcGVycy5wdXNoKG5ldyBXcmFwcGVyKGopKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vYWRkIGFsbCBpdGVtc1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uanNvbl9vYmpzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZtLml0ZW1zLnB1c2gobmV3IFBvcnRmb2xpb0l0ZW0odm0sIGksIGpzb25fb2Jqc1tpXS50aXRsZSwganNvbl9vYmpzW2ldLnRpdGxlX2ltYWdlLCBqc29uX29ianNbaV0uZGVzYywganNvbl9vYmpzW2ldLnN0YWNrLCBqc29uX29ianNbaV0ubWVkaWEsIGpzb25fb2Jqc1tpXS50eXBlLCBqc29uX29ianNbaV0udXJsKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2bS5hcHBlbmRBbGwoKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhcHBlbmRBbGwoKSB7IC8vYXBwZW5kcyBQb3J0Zm9saW9JdGVtcyBiYXNlZCBvbiBzY3JlZW4gc2l6ZTsgZ2V0cyBkaWdlc3RlZFxyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2YXIgc2NyZWVuV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHJcbiAgICAgICAgLy9yZWFzc2lnbnMgY29scyBiYXNlZCBvbiBicmVha3BvaW50c1xyXG4gICAgICAgIHZhciBicmVha3BvaW50cyA9IFt7IG1pbjogMCwgbWF4OiA3NjgsIGNvbF9zaXplOiAnY29sLXhzLTYnLCBwZXJfcm93OiAyIH0sIHsgbWluOiA3NjksIG1heDogOTkyLCBjb2xfc2l6ZTogJ2NvbC14cy00JywgcGVyX3JvdzogMyB9LCB7IG1pbjogOTkzLCBtYXg6IDEyMDAsIGNvbF9zaXplOiAnY29sLXhzLTMnLCBwZXJfcm93OiA0IH0sIHsgbWluOiAxMjAwLCBtYXg6IDk5OTksIGNvbF9zaXplOiAnY29sLXhzLTMnLCBwZXJfcm93OiA0IH1dO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnJlYWtwb2ludHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIC8vaWYgaW4gYnJlYWtwb2ludCByYW5nZSwgYW5kIG5vdCBzYW1lIGFzIGJlZm9yZVxyXG4gICAgICAgICAgICBpZiAoLyp2bS5pdGVtc1swXS5jb2xfc2l6ZSAhPT0gYnJlYWtwb2ludHNbaV0uY29sX3NpemUgJiYgKi9zY3JlZW5XaWR0aCA+IGJyZWFrcG9pbnRzW2ldLm1pbiAmJiBzY3JlZW5XaWR0aCA8IGJyZWFrcG9pbnRzW2ldLm1heCkge1xyXG4gICAgICAgICAgICAgICAgLy9jbGVhciBhbGwgcm93c1xyXG4gICAgICAgICAgICAgICAgdm0ucGVyX3JvdyA9IGJyZWFrcG9pbnRzW2ldLnBlcl9yb3c7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcnRmb2xpbycpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZXJhdG9yID0gcGFyZW50LmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGEgPSAxOyBhIDwgaXRlcmF0b3I7IGErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYXJlbnQuY2hpbGRyZW5bMV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vYWRkIG5ldyByb3dzIGFuZCB3cmFwcGVyc1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgciA9IDA7IHIgPCBNYXRoLmNlaWwodm0uaXRlbXMubGVuZ3RoIC8gYnJlYWtwb2ludHNbaV0ucGVyX3Jvdyk7IHIrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgICAgICByb3cuaWQgPSAncm93XycgKyByO1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdy5jbGFzc0xpc3QuYWRkKCdyb3cnLCAnbm9tYXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSB2bS53cmFwcGVyc1tyXS5odG1sO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQocm93KTtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQod3JhcHBlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL2FkZCBjb2xzIHRvIG5ldyByb3dzXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZtLml0ZW1zLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uaXRlbXNbal0uc2V0Q29sKGJyZWFrcG9pbnRzW2ldLmNvbF9zaXplKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcm93X251bSA9IE1hdGguZmxvb3IoaiAvIGJyZWFrcG9pbnRzW2ldLnBlcl9yb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLml0ZW1zW2pdLmFwcGVuZChyb3dfbnVtLCB2bS53cmFwcGVyc1tyb3dfbnVtXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsb3NlKGl0ZW1fbnVtOiBudW1iZXIpIHsgLy9jbG9zZXMgYWxsIHdyYXBwZXJzXHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIC8vY2xvc2VzIGFsbCBpdGVtcyBpbiB0aGUgcm93IG9mIHRoZSBnaXZlbiBpdGVtLlxyXG4gICAgICAgIHZhciByb3cgPSBNYXRoLmZsb29yKGl0ZW1fbnVtIC8gdm0ucGVyX3Jvdyk7XHJcblxyXG4gICAgICAgIC8vIGZvcih2YXIgaiA9IChyb3cqdm0ucGVyX3Jvdyk7IGogPCAoKHJvdyp2bS5wZXJfcm93KSt2bS5wZXJfcm93KTsgaisrKXtcclxuICAgICAgICAvLyAgICAgaWYoaXRlbV9udW0gIT09IGogJiYgdm0uaXRlbXNbal0pe1xyXG4gICAgICAgIC8vICAgICAgICAgdm0uaXRlbXNbal0ub3BlbiA9IGZhbHNlO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIHZhciByZXR1cm5fdmFsdWUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2bS5pdGVtcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoaXRlbV9udW0gIT09IGogJiYgdm0uaXRlbXNbal0pIHtcclxuICAgICAgICAgICAgICAgIHZtLml0ZW1zW2pdLm9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciByID0gMDsgciA8IHZtLndyYXBwZXJzLmxlbmd0aDsgcisrKSB7XHJcbiAgICAgICAgICAgIGlmIChyICE9PSByb3cgJiYgdm0ud3JhcHBlcnNbcl0uaHRtbC5jbGFzc0xpc3RbMV0gPT09ICdvcGVuJykge1xyXG4gICAgICAgICAgICAgICAgdm0ud3JhcHBlcnNbcl0uY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldHVybl92YWx1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdyYXBwZXIge1xyXG4gICAgdGl0bGU6IHN0cmluZztcclxuICAgIGRlc2M6IHN0cmluZztcclxuICAgIGNvbGxlY3Rpb246IHNraWxsX2JhZGdlLkNvbGxlY3Rpb247XHJcbiAgICBwb3J0X2ltYWdlOiBzdHJpbmc7XHJcbiAgICBtZWRpYTogbWVkaWEuTWVkaWE7XHJcbiAgICB1cmw6IHN0cmluZztcclxuXHJcblxyXG4gICAgaHRtbDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICB0aXRsZV9lbGVtZW50OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGRlc2NyaXB0aW9uOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHN0YWNrOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGZsZXhfZ3JpZDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBkZW1vOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbDU6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgZGVzY3JpcHRpb25fdGV4dDogVGV4dDtcclxuICAgIHRpdGxlX2VsZW1lbnRfdGV4dDogVGV4dDtcclxuICAgIGxpbms6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgbGlua190ZXh0OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbDY6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29sNkhvbGRlcjogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgY2hhbmdlOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHJvd19udW0pIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZtLmNoYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgIC8vIHZtLnRpdGxlID0gcEl0ZW0udGl0bGU7XHJcbiAgICAgICAgLy8gdm0uZGVzYyA9IHBJdGVtLmRlc2M7XHJcbiAgICAgICAgLy8gdm0uc3RhY2sgPSBwSXRlbS5zdGFjaztcclxuICAgICAgICAvLyB2bS5wb3J0X2ltYWdlID0gcEl0ZW0ucG9ydF9pbWFnZTtcclxuICAgICAgICB2bS5odG1sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uaHRtbC5pZCA9ICd3cmFwcGVyLScgKyByb3dfbnVtO1xyXG4gICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LmFkZCgnd3JhcHBlcicpO1xyXG5cclxuICAgICAgICB2YXIgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgcm93LmlkID0gJ2NvbnRlbnQnO1xyXG4gICAgICAgIHJvdy5jbGFzc0xpc3QuYWRkKCdyb3cnLCAnbm9tYXInKTtcclxuXHJcbiAgICAgICAgdm0udGl0bGVfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2Rlc2MtdGV4dDInLCAncGFkLXNwYWNpbmcnKTtcclxuICAgICAgICB2bS50aXRsZV9lbGVtZW50X3RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XHJcbiAgICAgICAgdm0udGl0bGVfZWxlbWVudC5hcHBlbmRDaGlsZCh2bS50aXRsZV9lbGVtZW50X3RleHQpO1xyXG5cclxuICAgICAgICB2bS5jb2w2SG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uY29sNkhvbGRlci5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInLCAnY29sLW1kLTYnLCAnY29sLWxnLTcnLCAncm93JywgJ25vbWFyJywgJ25vcGFkJyk7XHJcblxyXG4gICAgICAgIHZhciByb3dfZmlsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHJvd19maWxsLmNsYXNzTGlzdC5hZGQoJ3JvdycsICdqdXN0aWZ5LWNlbnRlcicsICdub21hcicpO1xyXG5cclxuICAgICAgICB2YXIgY29sMTIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb2wxMi5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInKTtcclxuXHJcbiAgICAgICAgdm0uY29sNiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmNvbDYuaWQgPSAnbWVkaWEtJyArIHJvd19udW07XHJcbiAgICAgICAgdm0uY29sNi5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInLCAnY29sLW1kLTYnLCAnY29sLWxnLTUnKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbDNfMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbDNfMi5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInLCAnY29sLW1kLTMnLCAnbm9wYWQtbGVmdCcpO1xyXG5cclxuICAgICAgICB2bS5kZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmRlc2NyaXB0aW9uLmNsYXNzTGlzdC5hZGQoJ2hlYWRlci10ZXh0JywgJ3BhZC1zcGFjaW5nJyk7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb24uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0Rlc2NyaXB0aW9uJykpO1xyXG5cclxuICAgICAgICB2YXIgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRlc2MuY2xhc3NMaXN0LmFkZCgnZGVzY3JpcHRpb24tdGV4dCcsICdwYWQtc3BhY2luZycpO1xyXG4gICAgICAgIHZtLmRlc2NyaXB0aW9uX3RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XHJcbiAgICAgICAgZGVzYy5hcHBlbmRDaGlsZCh2bS5kZXNjcmlwdGlvbl90ZXh0KTtcclxuXHJcbiAgICAgICAgdm0uc3RhY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5zdGFjay5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInLCAnY29sLW1kLTEyJywgJ2NvbC1sZy03Jyk7XHJcbiAgICAgICAgLy8gdm0uc3RhY2suYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1N0YWNrJykpO1xyXG5cclxuICAgICAgICB2YXIgc3RhY2tfdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBzdGFja190aXRsZS5jbGFzc0xpc3QuYWRkKCdoZWFkZXItdGV4dCcsICdwYWQtc3BhY2luZycpXHJcbiAgICAgICAgc3RhY2tfdGl0bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1NraWxscyBVc2VkJykpO1xyXG5cclxuICAgICAgICB2bS5mbGV4X2dyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5mbGV4X2dyaWQuaWQgPSAncGZsZXgtZ3JpZC0nICsgcm93X251bTtcclxuICAgICAgICB2bS5mbGV4X2dyaWQuY2xhc3NMaXN0LmFkZCgncm93JywgJ3BvcnRmb2xpby1mbGV4JywgJ2NvbC14cy0xMicpO1xyXG5cclxuICAgICAgICB2bS5kZW1vID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uZGVtby5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInLCAnY29sLW1kLTEyJywgJ2NvbC1sZy01Jyk7XHJcbiAgICAgICAgLy8gdm0uZGVtby5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTGl2ZSBEZW1vJykpO1xyXG5cclxuICAgICAgICB2YXIgZGVtb190aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRlbW9fdGl0bGUuY2xhc3NMaXN0LmFkZCgnaGVhZGVyLXRleHQnLCAncGFkLXNwYWNpbmcnKVxyXG4gICAgICAgIGRlbW9fdGl0bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1JlbGV2YW50IExpbmtzJykpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHZtLmxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5saW5rLmNsYXNzTGlzdC5hZGQoJ2dpdGh1Yi1idXR0b24nLCAncm93JywgJ25vbWFyJyk7XHJcblxyXG4gICAgICAgIHZtLmxpbmtfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmxpbmtfdGV4dC5jbGFzc0xpc3QuYWRkKCdibGFjay10ZXh0Jyk7XHJcbiAgICAgICAgdm0ubGlua190ZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdMaXZlIExpbmsnKSk7XHJcblxyXG4gICAgICAgIHZtLmNvbDUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5jb2w1LmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtNScpO1xyXG5cclxuICAgICAgICAvKiBHT05OQSBIQVZFIFRPIEFERCBNRURJQSBEWU5BTUlDQUxMWSAqL1xyXG5cclxuICAgICAgICB2bS5odG1sLmFwcGVuZENoaWxkKHJvdyk7XHJcbiAgICAgICAgcm93LmFwcGVuZENoaWxkKHZtLnRpdGxlX2VsZW1lbnQpO1xyXG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZCh2bS5jb2w2KTtcclxuICAgICAgICByb3cuYXBwZW5kQ2hpbGQodm0uY29sNkhvbGRlcik7XHJcblxyXG5cclxuICAgICAgICB2bS5jb2w2SG9sZGVyLmFwcGVuZENoaWxkKGNvbDEyKTtcclxuICAgICAgICBjb2wxMi5hcHBlbmRDaGlsZCh2bS5kZXNjcmlwdGlvbik7XHJcbiAgICAgICAgY29sMTIuYXBwZW5kQ2hpbGQoZGVzYyk7XHJcbiAgICAgICAgdm0uY29sNkhvbGRlci5hcHBlbmRDaGlsZCh2bS5zdGFjaylcclxuICAgICAgICB2bS5zdGFjay5hcHBlbmRDaGlsZChzdGFja190aXRsZSk7XHJcbiAgICAgICAgdm0uc3RhY2suYXBwZW5kQ2hpbGQodm0uZmxleF9ncmlkKTtcclxuICAgICAgICBcclxuICAgICAgICB2bS5jb2w2SG9sZGVyLmFwcGVuZENoaWxkKHZtLmRlbW8pXHJcbiAgICAgICAgdm0uZGVtby5hcHBlbmRDaGlsZChkZW1vX3RpdGxlKTtcclxuICAgICAgICB2bS5kZW1vLmFwcGVuZENoaWxkKHZtLmxpbmspO1xyXG4gICAgICAgIHZtLmxpbmsuYXBwZW5kQ2hpbGQodm0ubGlua190ZXh0KTtcclxuICAgICAgICB2bS5saW5rLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPSB2bS51cmw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgLy8jd3JhcHBlci0wLndyYXBwZXIub3BlblxyXG4gICAgICAgIC8vIC5yb3cjY29udGVudFxyXG4gICAgICAgIC8vICAgLmNvbC1tZC0xMi5kZXNjLXRleHQgQnJlYXRobGVzc1xyXG4gICAgICAgIC8vICAgLmNvbC1tZC02I21lZGlhLTBcclxuICAgICAgICAvLyAgIC5jb2wtbWQtNi5yb3dcclxuICAgICAgICAvLyAgICAgICAuY29sLW1kLTEyXHJcbiAgICAgICAgLy8gICAgICAgICAuaGVhZGVyLXRleHQucGFkZGluZy1sZWZ0IERlc2NyaXB0aW9uOlxyXG4gICAgICAgIC8vICAgICAgICAgLmRlc2NyaXB0aW9uLXRleHQucGFkZGluZy1sZWZ0IGFzZGZhc2RmXHJcbiAgICAgICAgLy8gICAgICAgLmNvbC1tZC02LmhlYWRlci10ZXh0IFN0YWNrOlxyXG4gICAgICAgIC8vICAgICAgIC5jb2wtbWQtNi5oZWFkZXItdGV4dCBMaXZlIERlbW86XHJcblxyXG4gICAgICAgIHZtLmh0bWwuYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmICh2bS5jaGFuZ2UpIHtcclxuICAgICAgICAgICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgdm0uc2V0RGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgdm0uY2hhbmdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgfVxyXG4gICAgLy8gY2xvc2VEYXRhKCl7XHJcbiAgICAvLyAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgLy8gICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgIC8vICAgICAgICAgdm0uY29sbGVjdGlvbi5jbG9zZSgpO1xyXG4gICAgLy8gICAgIH0sdGltZW91dCk7XHJcblxyXG4gICAgLy8gfVxyXG5cclxuICAgIHNldERhdGEoKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLnNldFRpdGxlKCk7XHJcbiAgICAgICAgdm0uc2V0RGVzYygpO1xyXG4gICAgICAgIHZtLnNldFN0YWNrKCk7XHJcbiAgICAgICAgdm0uc2V0TWVkaWEoKTtcclxuXHJcbiAgICAgICAgaWYodm0udXJsID09PSBcIlwiKXtcclxuICAgICAgICAgICAgdm0uY29sNkhvbGRlci5yZW1vdmVDaGlsZCh2bS5kZW1vKTtcclxuICAgICAgICB9IGVsc2UgaWYodm0uY29sNkhvbGRlci5sYXN0Q2hpbGQgIT09IHZtLmRlbW8pe1xyXG4gICAgICAgICAgICB2bS5jb2w2SG9sZGVyLmFwcGVuZENoaWxkKHZtLmRlbW8pOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB2bS5zZXRTdGFjayhzdGFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGl0bGUoKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnRfdGV4dC50ZXh0Q29udGVudCA9IHZtLnRpdGxlO1xyXG4gICAgfVxyXG4gICAgc2V0RGVzYygpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb25fdGV4dC50ZXh0Q29udGVudCA9IHZtLmRlc2M7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U3RhY2soKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmNvbGxlY3Rpb24ucmVzZXRJZHModm0uZmxleF9ncmlkLmlkKTtcclxuICAgICAgICB2bS5jb2xsZWN0aW9uLmxvYWQoKTtcclxuICAgIH1cclxuICAgIHNldE1lZGlhKCkge1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5tZWRpYS5zZXRJZCh2bS5tZWRpYS5pZCk7XHJcbiAgICAgICAgdm0ubWVkaWEubG9hZE1lZGlhKDApO1xyXG4gICAgfVxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4gICAgfVxyXG4gICAgY2hhbmdlV3JhcHBlcihvcGVuOiBib29sZWFuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgLy9jbG9zZSB3cmFwcGVyOlxyXG5cclxuXHJcbiAgICAgICAgaWYgKHZtLnRpdGxlID09PSB0aXRsZSkgeyAvKippZiBubyBjaGFuZ2UgKi9cclxuICAgICAgICAgICAgdm0uY2hhbmdlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAob3Blbikge1xyXG4gICAgICAgICAgICAgICAgLy8gdm0uY2xvc2VEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZtLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgICAgICAgICB2bS5kZXNjID0gZGVzYztcclxuICAgICAgICAgICAgICAgIHZtLmNvbGxlY3Rpb24gPSBzdGFjaztcclxuICAgICAgICAgICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgICAgICAgICB2bS51cmwgPSB1cmw7XHJcbiAgICAgICAgICAgICAgICB2bS5zZXREYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh2bS5odG1sLmNsYXNzTGlzdFsxXSAhPT0gJ29wZW4nKSB7IC8qKmlmIGFsbCBzZWxlY3Rpb25zIGFyZSBjbG9zZWQgaW5pdGlhbGx5L2NoYW5nZSB3aGVuIGNsb3NlZCovXHJcbiAgICAgICAgICAgIHZtLmNoYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2bS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgICAgICB2bS5kZXNjID0gZGVzYztcclxuICAgICAgICAgICAgdm0uY29sbGVjdGlvbiA9IHN0YWNrO1xyXG4gICAgICAgICAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgICAgICAgICB2bS51cmwgPSB1cmw7XHJcbiAgICAgICAgICAgIHZtLnNldERhdGEoKTtcclxuICAgICAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZtLmNoYW5nZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHZtLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgICAgIHZtLmRlc2MgPSBkZXNjO1xyXG4gICAgICAgICAgICB2bS5jb2xsZWN0aW9uID0gc3RhY2s7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgICAgIHZtLnVybCA9IHVybDtcclxuICAgICAgICAgICAgLy8gdm0uY2xvc2VEYXRhKCk7XHJcbiAgICAgICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25XcmFwcGVyKGRpZmZlcmVudF93cmFwcGVyOiBib29sZWFuLCBvcGVuOiBib29sZWFuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciByZXR1cm5fdmFsdWU7XHJcblxyXG4gICAgICAgIGlmIChkaWZmZXJlbnRfd3JhcHBlcikge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHZtLmNoYW5nZVdyYXBwZXIob3BlbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSwgdXJsKTtcclxuICAgICAgICAgICAgfSwgdGltZW91dCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChvcGVuID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb3BlbiA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHZtLmNoYW5nZVdyYXBwZXIob3BlbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSwgdXJsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHZtLmNoYW5nZVdyYXBwZXIob3BlbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSwgdXJsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldHVybl92YWx1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUG9ydGZvbGlvSXRlbSB7XHJcbiAgICB0aXRsZTogc3RyaW5nO1xyXG4gICAgdGl0bGVfaW1hZ2U6IHN0cmluZztcclxuICAgIGRlc2M6IHN0cmluZztcclxuICAgIHN0YWNrOiBza2lsbF9iYWRnZS5Db2xsZWN0aW9uO1xyXG4gICAgbWVkaWE6IG1lZGlhLk1lZGlhO1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gICAgdXJsOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8vIHtcIm5hbWVcIjogJ1B5dGhvbicsICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J3B5dGhvbi01LnN2Zyd9XHJcbnZhciBicmVhdGhsZXNzX3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ1BoYXNlci5qcycsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdwaGFzZXIuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnUGhvdG9zaG9wJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3Bob3Rvc2hvcC1jYy5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdqUXVlcnknLCBcImNsYXNzXCI6ICdjaXJjbGUtNTAnLCBcImltYWdlXCI6ICdqcXVlcnktMS5zdmcnIH1dLFxyXG50cnVlXHJcbik7XHJcbnZhciByZW1fc3RhY2sgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJycsIFt7IFwibmFtZVwiOiAnVW5pdHknLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAndW5pdHkuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnTWF5YScsIFwiY2xhc3NcIjogJ2NpcmNsZS0yNScsIFwiaW1hZ2VcIjogJ21heWEucG5nJyB9LFxyXG57IFwibmFtZVwiOiAnUGhvdG9zaG9wJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAncGhvdG9zaG9wLWNjLnN2Zyd9LFxyXG57IFwibmFtZVwiOiAnSWxsdXN0cmF0b3InLCBcImNsYXNzXCI6ICdjaXJjbGUtMjUnLCBcImltYWdlXCI6ICdhZG9iZS1pbGx1c3RyYXRvci1jYy5zdmcnfV0sXHJcbnRydWVcclxuKTtcclxuXHJcbnZhciBqZWRpXzNfc3RhY2sgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJycsIFt7IFwibmFtZVwiOiAnTWF5YScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdtYXlhLnBuZycgfSxcclxueyBcIm5hbWVcIjogJ1VucmVhbCcsIFwiY2xhc3NcIjogJ2NpcmNsZS03NScsIFwiaW1hZ2VcIjogJ3VucmVhbC5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdCbGVuZGVyJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAnYmxlbmRlci5zdmcnfV0sXHJcbnRydWVcclxuKTtcclxuXHJcbnZhciBzdXJ2aXZvcl9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgW3sgXCJuYW1lXCI6ICdVbnJlYWwnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAndW5yZWFsLnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0hvdWRpbmknLCBcImNsYXNzXCI6ICdjaXJjbGUtNzUnLCBcImltYWdlXCI6ICdob3VkaW5pLnBuZyd9LFxyXG57IFwibmFtZVwiOiAnTWF5YScsIFwiY2xhc3NcIjogJ2NpcmNsZS03NScsIFwiaW1hZ2VcIjogJ21heWEucG5nJyB9XSxcclxudHJ1ZVxyXG4pO1xyXG5cclxudmFyIG1vdXNlX3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ1VuaXR5JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3VuaXR5LnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ01vdGlvbiBCdWlsZGVyJywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAnbW9idS5wbmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdNYXlhJywgXCJjbGFzc1wiOiAnY2lyY2xlLTUwJywgXCJpbWFnZVwiOiAnbWF5YS5wbmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdWaWNvbiBCbGFkZScsIFwiY2xhc3NcIjogJ2NpcmNsZS01MCcsIFwiaW1hZ2VcIjogJ3ZpY29uLnBuZycgfSxcclxuXSxcclxudHJ1ZVxyXG4pO1xyXG5cclxudmFyIG5rX3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ1VuaXR5JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3VuaXR5LnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0lsbHVzdHJhdG9yJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2Fkb2JlLWlsbHVzdHJhdG9yLWNjLnN2Zyd9XSxcclxudHJ1ZVxyXG4pO1xyXG5cclxudmFyIGJlZV9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgW3sgXCJuYW1lXCI6ICdVbml0eScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICd1bml0eS5zdmcnIH0sXHJcbl0sXHJcbnRydWVcclxuKTtcclxuXHJcbnZhciBjYXZlX3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ0hvdWRpbmknLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnaG91ZGluaS5wbmcnfSxcclxueyBcIm5hbWVcIjogJ1VuaXR5JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3VuaXR5LnN2ZycgfV0sXHJcbnRydWVcclxuKTtcclxuXHJcbnZhciBzdG9yeWdyYXBoX3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ1VuaXR5JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3VuaXR5LnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0FmdGVyIEVmZmVjdHMnLCBcImNsYXNzXCI6ICdjaXJjbGUtMjUnLCBcImltYWdlXCI6ICdhZnRlci1lZmZlY3RzLWNjLnN2ZycgfV0sXHJcbnRydWVcclxuKTtcclxudmFyIHFiZXJ0X3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ01heWEnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnbWF5YS5wbmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdQaG90b3Nob3AnLCBcImNsYXNzXCI6ICdjaXJjbGUtMjUnLCBcImltYWdlXCI6ICdwaG90b3Nob3AtY2Muc3ZnJyB9XSxcclxudHJ1ZVxyXG4pO1xyXG52YXIgd2VhdGhlcl9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgW3sgXCJuYW1lXCI6ICdBbmd1bGFyIEpTJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2FuZ3VsYXItaWNvbi5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdEMy5qcycsIFwiY2xhc3NcIjogJ2NpcmNsZS01MCcsIFwiaW1hZ2VcIjogJ2QzLTIuc3ZnJyB9XSxcclxudHJ1ZVxyXG4pO1xyXG5cclxudmFyIHJvYXN0X3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ0VtYmVyIEpTJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2VtYmVyLnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0QzLmpzJywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAnZDMtMi5zdmcnIH1dLFxyXG50cnVlXHJcbik7XHJcblxyXG52YXIgY29udHJhc3Rfc3RhY2sgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJycsIFt7IFwibmFtZVwiOiAnSmF2YScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdqYXZhLTE0LnN2ZycgfV0sXHJcbnRydWVcclxuKTtcclxuXHJcbnZhciBwb3J0X3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ1R5cGUgU2NyaXB0JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3R5cGVzY3JpcHQuc3ZnJyB9LCBcclxueyBcIm5hbWVcIjogJ0hUTUw1JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2h0bWw1LnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ1NDU1MnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnc2Fzcy0xLnN2ZycgfV0sXHJcbnRydWVcclxuKTtcclxuXHJcbi8vIHZhciBicmVhdGhsZXNzX21lZGlhID0gbmV3IG1lZGlhLk1lZGlhKCdtZWRpYS0wJywgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9jYXQuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzE5ODE0OTc5NVwiIHdpZHRoPVwiNDcxXCIgaGVpZ2h0PVwiMzM1XCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+Jyk7XHJcblxyXG52YXIgbSA9IFtdXHJcblxyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbIFwiLi9wb3J0Zm9saW8vcmVtXzUucG5nXCIsIFwiLi9wb3J0Zm9saW8vcmVtXzMucG5nXCIsIFwiLi9wb3J0Zm9saW8vcmVtXzIucG5nXCIsIFwiLi9wb3J0Zm9saW8vcmVtXzQucG5nXCJdLCBbIFwiLi9wb3J0Zm9saW8vcmVtXzMucG5nXCIsIFwiLi9wb3J0Zm9saW8vcmVtXzIucG5nXCIsIFwiLi9wb3J0Zm9saW8vcmVtXzQucG5nXCJdLCAnPGlmcmFtZSBzcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vMjUyNDM2OTg5XCIgd2lkdGg9XCI0NzFcIiBoZWlnaHQ9XCIzMzVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vdHV0b3JpYWxfMDQucG5nJywnLi9wb3J0Zm9saW8vdHV0b3JpYWxfMDEucG5nJywgJy4vcG9ydGZvbGlvL3R1dG9yaWFsXzAyLnBuZycsICcuL3BvcnRmb2xpby90dXRvcmlhbF8wMy5wbmcnXSwgWycuL3BvcnRmb2xpby90dXRvcmlhbF8wMS5wbmcnLCAnLi9wb3J0Zm9saW8vdHV0b3JpYWxfMDIucG5nJywgJy4vcG9ydGZvbGlvL3R1dG9yaWFsXzAzLnBuZyddLCAnPGlmcmFtZSB3aWR0aD1cIjU2MFwiIGhlaWdodD1cIjMxNVwiIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL01zWmpVSGhDako4XCIgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3c9XCJhY2NlbGVyb21ldGVyOyBhdXRvcGxheTsgZW5jcnlwdGVkLW1lZGlhOyBneXJvc2NvcGU7IHBpY3R1cmUtaW4tcGljdHVyZVwiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFtcIi4vcG9ydGZvbGlvL2lzbGFuZF8wMy5wbmdcIiwgXCIuL3BvcnRmb2xpby9pc2xhbmRfMDEucG5nXCIsIFwiLi9wb3J0Zm9saW8vaXNsYW5kXzAyLnBuZ1wiXSwgW1wiLi9wb3J0Zm9saW8vaXNsYW5kXzAxLnBuZ1wiLCBcIi4vcG9ydGZvbGlvL2lzbGFuZF8wMi5wbmdcIl0sICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby80NTY2NzcyNDNcIiB3aWR0aD1cIjY0MFwiIGhlaWdodD1cIjM2MFwiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93PVwiYXV0b3BsYXk7IGZ1bGxzY3JlZW5cIiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+JykpO1xyXG4vLyBtLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX3BsYXkuanBnXCIsIFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheV8yLmpwZ1wiLCBcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfZ2FtZXBsYXkuanBnXCIsIFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19jb250cm9scy5qcGdcIl0sIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfcGxheS5qcGdcIiwgXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX2dhbWVwbGF5XzIuanBnXCIsIFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheS5qcGdcIiwgXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX2NvbnRyb2xzLmpwZ1wiXSkpO1xyXG4vLyBtLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbXCIuL3BvcnRmb2xpby9xYmVydF9wbGF5LmpwZ1wiLCBcIi4vcG9ydGZvbGlvL3FiZXJ0X3BsYXllci5qcGdcIiwgXCIuL3BvcnRmb2xpby9xYmVydF9zbmFrZS5qcGdcIl0sIFtcIi4vcG9ydGZvbGlvL3FiZXJ0X3BsYXllci5qcGdcIiwgXCIuL3BvcnRmb2xpby9xYmVydF9zbmFrZS5qcGdcIl0sICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8xOTgxNDk3OTVcIiB3aWR0aD1cIjQ3MVwiIGhlaWdodD1cIjMzNVwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicpKTtcclxuLy8gbS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgW1wiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzEucG5nXCIsIFwiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzMucG5nXCIsIFwiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzIucG5nXCJdLCBbXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMS5wbmdcIiwgXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMy5wbmdcIiwgXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMi5wbmdcIl0pKTtcclxuLy8gbS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgWycuL3BvcnRmb2xpby9tZWFuX2ZvcmVjYXN0XzEuanBnJywgJy4vcG9ydGZvbGlvL21lYW5fZm9yZWNhc3RfMi5qcGcnXSwgWycuL3BvcnRmb2xpby9tZWFuX2ZvcmVjYXN0XzEuanBnJywgJy4vcG9ydGZvbGlvL21lYW5fZm9yZWNhc3RfMi5qcGcnXSkpO1xyXG4vLyBtLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL3JvYXN0XzYucG5nJywgJy4vcG9ydGZvbGlvL3JvYXN0XzIucG5nJywgJy4vcG9ydGZvbGlvL3JvYXN0XzMucG5nJywgJy4vcG9ydGZvbGlvL3JvYXN0XzQucG5nJ10sIFsnLi9wb3J0Zm9saW8vcm9hc3RfNi5wbmcnLCAnLi9wb3J0Zm9saW8vcm9hc3RfMi5wbmcnLCcuL3BvcnRmb2xpby9yb2FzdF8zLnBuZycsICcuL3BvcnRmb2xpby9yb2FzdF80LnBuZyddKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vU3RvcnlHcmFwaF9DYXJkLnBuZycsJy4vcG9ydGZvbGlvL3N0b3J5Z3JhcGhfMS5qcGcnLCAnLi9wb3J0Zm9saW8vc3RvcnlncmFwaF8yLmpwZyddLCBbJy4vcG9ydGZvbGlvL3N0b3J5Z3JhcGhfMS5qcGcnLCAnLi9wb3J0Zm9saW8vc3RvcnlncmFwaF8yLmpwZyddLCAnPGlmcmFtZSBzcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vMzY5NzQ3NDcxXCIgd2lkdGg9XCI0NzFcIiBoZWlnaHQ9XCIzMzVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vY3Jvd2RfMS5wbmcnLCcuL3BvcnRmb2xpby9jcm93ZF8yLnBuZycsICcuL3BvcnRmb2xpby9jcm93ZF8zLnBuZyddLCBbJy4vcG9ydGZvbGlvL2Nyb3dkXzEucG5nJywnLi9wb3J0Zm9saW8vY3Jvd2RfMi5wbmcnLCAnLi9wb3J0Zm9saW8vY3Jvd2RfMy5wbmcnXSkpO1xyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL2Jpb3Nocm9vbV8xLnBuZycsJy4vcG9ydGZvbGlvL2Jpb3Nocm9vbV8yLnBuZycsICcuL3BvcnRmb2xpby9iaW9zaHJvb21fMy5wbmcnLCAnLi9wb3J0Zm9saW8vYmlvc2hyb29tXzQucG5nJ10sIFsnLi9wb3J0Zm9saW8vYmlvc2hyb29tXzEucG5nJywnLi9wb3J0Zm9saW8vYmlvc2hyb29tXzIucG5nJywnLi9wb3J0Zm9saW8vYmlvc2hyb29tXzMucG5nJ10sICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8zNjk3NTI2MzFcIiB3aWR0aD1cIjQ3MVwiIGhlaWdodD1cIjMzNVwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicpKTtcclxubS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgWycuL3BvcnRmb2xpby9heG9ucnVzaF8xLnBuZycsJy4vcG9ydGZvbGlvL2F4b25ydXNoXzIucG5nJywgJy4vcG9ydGZvbGlvL2F4b25ydXNoXzMuZ2lmJ10sIFsnLi9wb3J0Zm9saW8vYXhvbnJ1c2hfMi5wbmcnLCAnLi9wb3J0Zm9saW8vYXhvbnJ1c2hfMy5naWYnXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzQzODMwMTM4OFwiIHdpZHRoPVwiNjQwXCIgaGVpZ2h0PVwiMzYwXCIgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3c9XCJhdXRvcGxheTsgZnVsbHNjcmVlblwiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vcm9ib3RfMS5wbmcnLCcuL3BvcnRmb2xpby9yb2JvdF8yLnBuZycsICcuL3BvcnRmb2xpby9yb2JvdF8zLnBuZyddLCBbJy4vcG9ydGZvbGlvL3JvYm90XzIucG5nJywnLi9wb3J0Zm9saW8vcm9ib3RfMy5wbmcnXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzM2OTc4NDU0M1wiIHdpZHRoPVwiNDcxXCIgaGVpZ2h0PVwiMzM1XCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+JykpO1xyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL2NhdmVfMy5wbmcnLCcuL3BvcnRmb2xpby9jYXZlXzIucG5nJywgJy4vcG9ydGZvbGlvL2NhdmVfMS5wbmcnLCAnLi9wb3J0Zm9saW8vY2F2ZV80LnBuZyddLCBbJy4vcG9ydGZvbGlvL2NhdmVfMi5wbmcnLCcuL3BvcnRmb2xpby9jYXZlXzEucG5nJywnLi9wb3J0Zm9saW8vY2F2ZV80LnBuZyddLCAnPGlmcmFtZSBzcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vMzY5Nzg5MTI3XCIgd2lkdGg9XCI0NzFcIiBoZWlnaHQ9XCIzMzVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vdHViZV8zLnBuZycsICcuL3BvcnRmb2xpby90dWJlXzIucG5nJywgJy4vcG9ydGZvbGlvL3R1YmVfNC5wbmcnXSwgWycuL3BvcnRmb2xpby90dWJlXzIucG5nJywnLi9wb3J0Zm9saW8vdHViZV80LnBuZyddLCAnPGlmcmFtZSBzcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vMzY5OTU1NDYwXCIgd2lkdGg9XCI0NzFcIiBoZWlnaHQ9XCIzMzVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vaHlwZXJob3BfMDEuZ2lmJywgJy4vcG9ydGZvbGlvL2h5cGVyaG9wXzAyLmdpZicsICcuL3BvcnRmb2xpby9oeXBlcmhvcF8wMy5naWYnXSwgWycuL3BvcnRmb2xpby9oeXBlcmhvcF8wMS5naWYnLCAnLi9wb3J0Zm9saW8vaHlwZXJob3BfMDIuZ2lmJywgJy4vcG9ydGZvbGlvL2h5cGVyaG9wXzAzLmdpZiddKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vYmVlXzEucG5nJywgJy4vcG9ydGZvbGlvL2JlZV8yLnBuZycsICcuL3BvcnRmb2xpby9iZWVfMy5wbmcnXSwgWycuL3BvcnRmb2xpby9iZWVfMi5wbmcnLCAnLi9wb3J0Zm9saW8vYmVlXzMucG5nJ10sICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8zNzAyMjA5MzVcIiB3aWR0aD1cIjQ3MVwiIGhlaWdodD1cIjMzNVwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicpKTtcclxubS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgWycuL3BvcnRmb2xpby9zdXJ2aXZvcl8zLnBuZycsICcuL3BvcnRmb2xpby9zdXJ2aXZvcl8xLmpwZycsJy4vcG9ydGZvbGlvL3N1cnZpdm9yXzIuanBnJ10sIFsnLi9wb3J0Zm9saW8vc3Vydml2b3JfMy5wbmcnLCAnLi9wb3J0Zm9saW8vc3Vydml2b3JfMS5qcGcnLCcuL3BvcnRmb2xpby9zdXJ2aXZvcl8yLmpwZyddKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vamVkaV8xLnBuZyddLCBbJy4vcG9ydGZvbGlvL2plZGlfMS5wbmcnXSkpO1xyXG4vLyBtLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL3BvcnRfMS5wbmcnLCAnLi9wb3J0Zm9saW8vcG9ydF8yLnBuZycsICcuL3BvcnRmb2xpby9wb3J0XzMucG5nJywgICcuL3BvcnRmb2xpby9wb3J0XzQucG5nJ10sIFsnLi9wb3J0Zm9saW8vcG9ydF8xLnBuZycsICcuL3BvcnRmb2xpby9wb3J0XzIucG5nJywgJy4vcG9ydGZvbGlvL3BvcnRfMy5wbmcnLCAnLi9wb3J0Zm9saW8vcG9ydF80LnBuZyddKSk7XHJcblxyXG52YXIgcG9ydGZvbGlvID0gbmV3IFBvcnRmb2xpbygncG9ydGZvbGlvJywgW1xyXG4gICAgeyB0aXRsZTogJ1N0YXIgV2FycyBKZWRpOiBTdXJ2aXZvcicsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vc3Rhcl93YXJzX2NhcmQuanBnJywgZGVzYzogXCJEdXJpbmcgZGV2ZWxvcG1lbnQgb24gU3RhciBXYXJzIEplZGk6IFN1cnZpdm9yLCBJIHdvcmtlZCBjbG9zZWx5IHdpdGggYm90aCB0aGUgRW52aXJvbm1lbnQgYW5kIExpZ2h0aW5nIHRlYW1zIHRvIGJ1aWxkIHRvb2xzIGFuZCBzeXN0ZW1zIHRoYXQgc3RyZWFtbGluZWQgY29udGVudCBjcmVhdGlvbiBhbmQgaW1wcm92ZWQgaW4tZ2FtZSBwZXJmb3JtYW5jZS4gRm9yIHRoZSBFbnZpcm9ubWVudCB0ZWFtLCBJIGNyZWF0ZWQgcHJvY2VkdXJhbCBtb2RlbGluZyB0b29scyBpbiBIb3VkaW5pLCBpbmNsdWRpbmcgYSBDYWJsZSBUb29sIGFuZCBhIFBpcGUgVG9vbCwgd2hpY2ggYWxsb3dlZCBhcnRpc3RzIHRvIHF1aWNrbHkgZ2VuZXJhdGUgZmxleGlibGUsIHBoeXNpY3MtZW5hYmxlZCBhc3NldHMgd2l0aCBmdWxsIGNvbGxpc2lvbiBzdXBwb3J0IGZvciB1c2UgdGhyb3VnaG91dCB0aGUgZ2FtZeKAmXMgZXhwYW5zaXZlIGxldmVscy4gRm9yIHRoZSBMaWdodGluZyB0ZWFtLCBJIGhlbHBlZCBkZXNpZ24gYW5kIGltcGxlbWVudCBhIGN1c3RvbWl6YWJsZSBmb2cgY2FyZCBtYXRlcmlhbCBzaGFkZXIsIGdpdmluZyBhcnRpc3RzIGdyZWF0ZXIgY29udHJvbCBvdmVyIGF0bW9zcGhlcmljIGVmZmVjdHMgd2hpbGUgbWFpbnRhaW5pbmcgdmlzdWFsIGNvbnNpc3RlbmN5IGFuZCBwZXJmb3JtYW5jZS5cXG5cXG4gSW4gVW5yZWFsIEVuZ2luZSwgSSBkZXZlbG9wZWQgRENDIHRvb2xzIGZvciBsZXZlbCBkZXNpZ25lcnMgYW5kIGVudmlyb25tZW50IGFydGlzdHMgdXNpbmcgYm90aCBDKysgYW5kIFVucmVhbCBQeXRob24sIGVuYWJsaW5nIG1vcmUgZWZmaWNpZW50IHdvcmtmbG93cyBhbmQgdGlnaHRlciBpbnRlZ3JhdGlvbiBiZXR3ZWVuIHRoZSBlZGl0b3IgYW5kIGV4dGVybmFsIGNvbnRlbnQgY3JlYXRpb24gdG9vbHMuIEkgYWxzbyBjb250cmlidXRlZCB0byBicm9hZGVyIG9wdGltaXphdGlvbiBlZmZvcnRzIGJ5IGJ1aWxkaW5nIEJsdWVwcmludCBwZXJmb3JtYW5jZSBkZWJ1Z2dpbmcgdG9vbHMgYW5kIGltcHJvdmluZyBsZXZlbCBwZXJmb3JtYW5jZSB0aHJvdWdoIEhMT0Qgc2V0dXAsIG1hdGVyaWFsIGFuZCBwb2x5IGNvbXBsZXhpdHkgcmVkdWN0aW9uLCBhbmQgZmFzdGVyIGxldmVsIHN0cmVhbWluZy4gVGhlc2UgZWZmb3J0cyB3ZXJlIGNyaXRpY2FsIGluIGhlbHBpbmcgdGhlIGdhbWUgaGl0IGl0cyBwZXJmb3JtYW5jZSB0YXJnZXRzLCBwYXJ0aWN1bGFybHkgb24gY29uc29sZSBwbGF0Zm9ybXMgbGlrZSB0aGUgUGxheVN0YXRpb24gNS5cIiwgc3RhY2s6IHN1cnZpdm9yX3N0YWNrLCBtZWRpYTogbVsxMl0sIHR5cGU6ICdVbnJlYWwgRW5naW5lIEdhbWUnLCB1cmw6ICdodHRwczovL3d3dy5lYS5jb20vZ2FtZXMvc3RhcndhcnMvamVkaS1zdXJ2aXZvcicgfSxcclxuICAgIHsgdGl0bGU6ICdTdGFyIFdhcnMgSmVkaTogMycsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vc3Rhcl93YXJzXzNfY2FyZC5wbmcnLCBkZXNjOiBcIk9uIFN0YXIgV2FycyBKZWRpOiAzLCBJIHBsYXllZCBhIGtleSByb2xlIGluIGFyY2hpdGVjdGluZyBhbmQgbW9kZXJuaXppbmcgb3VyIE1heWEgUHl0aG9uIGNvZGViYXNlIHRvIGltcHJvdmUgZWZmaWNpZW5jeSBhbmQgc2NhbGFiaWxpdHkuIE9uZSBvZiBteSBsYXJnZXIgcHJvamVjdHMgd2FzIGEgQ2luZW1hdGljcyBFeHBvcnRlciB0b29sLCBJIGFkZGVkIHRoZSBmZWF0dXJlIHRvIHJlYWQgYW5kIHVwZGF0ZSBkYXRhIGZyb20gYSBiYWNrZW5kIGNpbmVtYXRpY3MgZGF0YWJhc2UsIGFsbG93aW5nIGZvciBtb3JlIGVmZmljaWVudCBhc3NldCB0cmFja2luZyBhbmQgbWFuYWdlbWVudC4gSSB0aGVuIGltcGxlbWVudGVkIGEgbXVsdGl0aHJlYWRlZCBwcm9jZXNzIHRoYXQgcmVkdWNlZCBleHBvcnQgdGltZXMgZnJvbSAyIGhvdXJzIHRvIGp1c3QgMTAgbWludXRlcywgc2lnbmlmaWNhbnRseSBpbXByb3ZpbmcgdGhlIGNpbmVtYXRpY3MgcGlwZWxpbmUgYW5kIGVuYWJsaW5nIHF1aWNrZXIgdHVybmFyb3VuZCB0aW1lcyBmb3IgY2luZW1hdGljIGNvbnRlbnQuIFxcblxcbkFkZGl0aW9uYWxseSwgSSBkZXZlbG9wZWQgYSBDaGFyYWN0ZXIgTWFuYWdlciB0b29sIHVzaW5nIE1WQyAoTW9kZWwtVmlldy1Db250cm9sbGVyKSBhcmNoaXRlY3R1cmUsIGxldmVyYWdpbmcgUHlRdCBmb3IgdGhlIFVJIGFuZCBPcGVuTWF5YSBhbmQgTWF5YSBjbWRzIGZvciBzZWFtbGVzcyBpbnRlZ3JhdGlvbiB3aXRoIE1heWHigJlzIGNvcmUuIFRoZSB0b29sIHV0aWxpemVkIGEgc3RydWN0dXJlZCBkYXRhc2V0IHRvIGxvYWQgY2hhcmFjdGVycyBhbmQgdGhlaXIgYXR0YWNobWVudHMsIG9mZmVyaW5nIG1vcmUgZmxleGliaWxpdHkgYW5kIG1vZHVsYXJpdHkgZm9yIGFydGlzdHMgYW5kIGFuaW1hdG9ycyB3b3JraW5nIHdpdGggY29tcGxleCByaWdzLiBUaGVzZSB0b29scyBub3Qgb25seSBtb2Rlcm5pemVkIG91ciB3b3JrZmxvd3MgYnV0IGFsc28gbGFpZCB0aGUgZm91bmRhdGlvbiBmb3IgbW9yZSBlZmZpY2llbnQgYW5kIHNjYWxhYmxlIGNvbnRlbnQgY3JlYXRpb24gYXMgdGhlIHByb2plY3QgZXZvbHZlZC5cIiwgc3RhY2s6IGplZGlfM19zdGFjaywgbWVkaWE6IG1bMTNdLCB0eXBlOiAnVW5yZWFsIEVuZ2luZSBHYW1lJywgdXJsOiAnJyB9LFxyXG4gICAgeyB0aXRsZTogJ1RoZSBTdG9yeSBHcmFwaCcsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vU3RvcnlHcmFwaF9DYXJkLnBuZycsIGRlc2M6IFwiVGhlIFN0b3J5IEdyYXBoIGlzIGEgbm9kZSBiYXNlZCB2aXN1YWwgc2NyaXB0aW5nIHRvb2wuIFNpbWlsYXIgdG8gQmx1ZXByaW50cyBpbiBVbnJlYWwgRW5naW5lIDQsIFRoZSBTdG9yeSBHcmFwaCBtYWtlcyBzY3JpcHRpbmcgZWFzeSBmb3IgZGVzaWduZXJzIGFuZCBkZXZlbG9wZXJzIHdobyB3YW50IHRvIHByb3RvdHlwZSByYXBpZGx5LiBUaGlzIGlzIGEgVW5pdHkgQ3VzdG9tIEVkaXRvciBUb29sIHRoYXQgY2FuIGJlIGJvdWdodCBvbiB0aGUgVW5pdHkgQXNzZXQgU3RvcmUuXCIsIHN0YWNrOiBzdG9yeWdyYXBoX3N0YWNrLCBtZWRpYTogbVszXSwgdHlwZTogJ1VuaXR5IEN1c3RvbSBFZGl0b3IgVG9vbCcsIHVybDogJ2h0dHBzOi8vYXNzZXRzdG9yZS51bml0eS5jb20vcGFja2FnZXMvdG9vbHMvdmlzdWFsLXNjcmlwdGluZy9zdG9yeS1ncmFwaC0xMzY3MTMnIH0sXHJcbiAgICB7IHRpdGxlOiAnSXNsYW5kIERlc2lnbmVyJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9pc2xhbmQucG5nJywgZGVzYzogXCJEdXJpbmcgbXkgU2lkZUZYIEludGVybnNoaXAgSSBjcmVhdGVkIGFuIElzbGFuZCBEZXNpZ25lciBnYW1lIGFzIGFuIGV4cGVyaW1lbnRhbCBwcm90b3R5cGUgZm9yIEhvdWRpbmkgZ2VuZXJhdGlvbiBvZiBjb250ZW50IGR1cmluZyBydW50aW1lLiBJIGRldmVsb3BlZCB0aGlzIHByb2plY3QgZW50aXJlbHkgZnJvbSB0aGUgZ3JvdW5kIHVwLCBpbmNsdWRpbmcgYWxsIHRoZSBIb3VkaW5pIHByb2NlZHVyYWwgYXNzZXRzLCB1c2VyIGludGVyZmFjZSwgYW5kIGludGVyYWN0aW9ucy4gVGhpcyBpc2xhbmQgZGVzaWduZXIgZXhwbG9yZXMgaW50ZXJhY3Rpb25zIHN1Y2ggYXMgcGFpbnRpbmcgZ3Jhc3MsIHBsYWNpbmcgY3VydmVkIGFzc2V0cyBzdWNoIGFzIGJyaWRnZXMgYW5kIHdhdGVyZmFsbHMsIGFuZCBwbGFjaW5nIHJhbmRvbWx5IGdlbmVyYXRlZCBvYmplY3RzIHN1Y2ggYXMgcGFsbSB0cmVlcyBhbmQgaG91c2VzLiBBbG9uZyB0aGUgd2F5IEkgbGVhcm5lZCBhIGxvdCBhYm91dCBIb3VkaW5pIHByb2NlZHVyYWwgbW9kZWxpbmcsIGFzIHdlbGwgYXMgcGlwZWxpbmUgaW50ZWdyYXRpb24gd2l0aCBVbml0eS4gUGxlYXNlIG5vdGUgdGhhdCB0aGlzIHdhcyBleHBlcmltZW50YWwgb25seSwgYW5kIHNob3VsZCBub3QgYmUgc2VlbiBhcyBhbnkgaW5kaWNhdGlvbiBmb3IgcGxhbnMgU2lkZUZYIGhhcyBmb3IgcnVudGltZSBnZW5lcmF0aW9uIG9mIGNvbnRlbnQuXCIsIHN0YWNrOiBjYXZlX3N0YWNrLCBtZWRpYTogbVsyXSwgdHlwZTogJ0hvdWRpbmkgSW50ZXJuc2hpcCBHYW1lIERlbW8nLCB1cmw6ICcnIH0sXHJcbiAgICB7IHRpdGxlOiAnUHJvY2VkdXJhbCBNb2RlbGluZyBUdXRvcmlhbCcsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vbGFodWcuanBlZycsIGRlc2M6IFwiQSB0dXRvcmlhbCBwcmVzZW50ZWQgYXQgdGhlIExBIEhvdWRpbmkgVXNlciBHcm91cCBvbiBwcm9jZWR1cmFsIG1vZGVsaW5nIGZvciBnYW1lcyB1c2luZyBIb3VkaW5pLiBTaG93Y2FzZXMgdGhlIGJhc2ljcyBvZiBWRVgsIGFuZCBob3cgSSB3ZW50IGFib3V0IGNyZWF0aW5nIGEgcHJvY2VkdXJhbCBicmlkZ2UgZHVyaW5nIG15IEhvdWRpbmkgSW50ZXJuc2hpcC5cIiwgc3RhY2s6IGNhdmVfc3RhY2ssIG1lZGlhOiBtWzFdLCB0eXBlOiAnSG91ZGluaSBUdXRvcmlhbCcsIHVybDogJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9TXNaalVIaENqSjgnIH0sXHJcbiAgICB7IHRpdGxlOiAnSHlwZXJob3A6IEdhbGFjdGljIExhbmNlcicsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vaHlwZXJob3AucG5nJywgZGVzYzogXCJIeXBlcmhvcCBpcyBteSBMdWR1bSBEYXJlIDQ2IEdhbWUgSmFtIHN1Ym1pc3Npb24uIE9uIGEgdGVhbSBvZiBmb3VyLCBpbiBqdXN0IDcyIGhvdXJzIEkgbW9kZWxlZCwgYW5pbWF0ZWQsIGFuZCBzY3JpcHRlZCBiZWhhdmlvciB0aGUgb2YgdGhlIHBsYW5ldHMsIGFzIHdlbGwgYXMgcmlnZ2VkIHRoZSBtYWluIGNoYXJhY3Rlci4gSSBsZWFybmVkIGEgbG90IGFib3V0IGJsZW5kc2hhcGVzIGFuZCBjcmVhdGluZyBmYWNpYWwgcmlncyBpbiBIb3VkaW5pIGFzIHdlbGwgYXMgYW5pbWF0aW9uIHN0YXRlcyBpbiBVbml0eS5cIiwgc3RhY2s6IGNhdmVfc3RhY2ssIG1lZGlhOiBtWzEwXSwgdHlwZTogJ1VuaXR5IEdhbWUgRGVtbycsIHVybDogJ2h0dHBzOi8vc3dhbmlqYW0uaXRjaC5pby9oeXBlcmhvcCcgfSxcclxuICAgIHsgdGl0bGU6ICdBeG9uIFJ1c2gnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL2F4b25ydXNoLnBuZycsIGRlc2M6IFwiQXhvbiBSdXNoIGlzIG15IEdsb2JhbCBHYW1lIEphbSAyMDIwIHN1Ym1pc3Npb24uIE9uIGEgdGVhbSBvZiBzaXgsIHdlIHdhbnRlZCB0byBtYWtlIGEgZ2FtZSBhYm91dCBtZW50YWwgaGVhbHRoLi4uIGxpdGVyYWxseSEgT3VyIGdhbWUgQXhvbiBSdXNoIGlzIGEgM0QgUGxhdGZvcm1lciB3aGVyZSBpdCBpcyB5b3VyIGpvYiB0byByZXBhaXIgdGhlIHRoZSBicmFpbiBieSBzaG9vdGluZyBlbGVjdHJpYyBpbXB1bHNlcyB0byBicm9rZW4gYXhvbnMuIEkgd29ya2VkIG9uIFZGWCBhbmQgdGhlIHBsYXllciBjaGFyYWN0ZXIgc2hvb3RpbmcgYmVoYXZpb3IuXCIsIHN0YWNrOiBjYXZlX3N0YWNrLCBtZWRpYTogbVs2XSwgdHlwZTogJ1VuaXR5IEdhbWUgRGVtbycsIHVybDogJ2h0dHBzOi8vZ2xvYmFsZ2FtZWphbS5vcmcvMjAyMC9nYW1lcy9heG9uLXJ1c2gtMicgfSxcclxuICAgIHsgdGl0bGU6ICdCaW9zaHJvb20nLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL2Jpb3Nocm9vbV9jYXJkLnBuZycsIGRlc2M6IFwiQmlvc2hyb29tIGlzIGEgZmlyc3QgcGVyc29uIGV4cGxvcmF0aW9uIGFuZCBnYXJkZW5pbmcgZ2FtZS4gWW91IGFyZSBhIEJpb2xvZ2lzdCBleHBsb3JpbmcgYSBmb3JlaWduIHBsYW5ldCBpbmZlc3RlZCB3aXRoIG11c2hyb29tcy4gSXQgaXMgeW91ciBnb2FsIHRvIGV4cGxvcmUgdGhlIHBsYW5ldCwgZ2F0aGVyIG5ldyBtdXNocm9vbXMsIGFuZCBicmVlZCB0aGVtIHRvIHNlbmQgYmFjayB0byB5b3VyIGhvbWUgcGxhbmV0LiBPbiB0aGlzIHByb2plY3QgSSB3b3JrZWQgYXMgYSB0ZWNobmljYWwgYXJ0aXN0IGFuZCBkZXZlbG9wZXIuIEkgZGV2ZWxvcGVkIGEgcHJvY2VkdXJhbCBtdXNocm9vbSB1c2luZyBibGVuZHNoYXBlcywgYXMgd2VsbCBhcyBhIG11c2hyb29tIHNwYXduZXIgdGhhdCB1c2VzIHZlcnRleCBjb2xvcnMgb24gdGhlIGdyb3VuZC5cIiwgc3RhY2s6IHJlbV9zdGFjaywgbWVkaWE6IG1bNV0sIHR5cGU6ICdVbml0eSBHYW1lIERlbW8nLCB1cmw6ICcnIH0sXHJcbiAgICAvLy8geyB0aXRsZTogJ0FuZCB0aGUgQ3Jvd2QgR29lcyBXaWxkIScsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vY3Jvd2RfY2FyZC5wbmcnLCBkZXNjOiBcIkFuZCB0aGUgQ3Jvd2QgR29lcyBXaWxkIGlzIGEgdmlydHVhbCByZWFsaXR5IGludGVyYWN0aXZlIGV4cGVyaWVuY2Ugd2hlcmUgeW91IHB1dCBvbiBhIG1hZ2ljIHNob3cgZm9yIGFuIGF1ZGllbmNlIG9mIGdob3N0cy4gVGhpcyBleHBlcmllbmNlIHVzZXMgT2N1bHVzIFZSIGFzIHdlbGwgYXMgdGhlIExlYXBtb3Rpb24gdG8gdHJ1bHkgc2ltdWxhdGUgbWFnaWMgY29taW5nIG91dCBvZiB5b3VyIGZpbmdlcnRpcHMgdmlhIExlYXAgTW90aW9uIGdlc3R1cmVzLiBJIGRldmVsb3BlZCB0aGlzIGdhbWUgZW50aXJlbHkgdXNpbmcgVGhlIFN0b3J5IEdyYXBoLCB0aGUgVW5pdHkgQ3VzdG9tIEVkaXRvciBUb29sIEkgY3JlYXRlZC4gTWFkZSBpbiBvbmx5IDEgbW9udGggZm9yIG15IEludHJvZHVjdGlvbiB0byBWaXJ0dWFsIFJlYWxpdHkgY2xhc3MsIHRoaXMgZXhwZXJpZW5jZSBleHBsb3JlcyBWaXJ0dWFsIFJlYWxpdHkgVXNlciBFeHBlcmllbmNlIGRlc2lnbiB3aXRoIGdlc3R1cmUgYmFzZWQgY29udHJvbHMuXCIsIHN0YWNrOiBzdG9yeWdyYXBoX3N0YWNrLCBtZWRpYTogbVs0XSwgdHlwZTogJ1VuaXR5IFZSIEV4cGVyaWVuY2UnLCB1cmw6ICcnIH0sXHJcbiAgICAvLyB7IHRpdGxlOiAnSGl2ZSBKaXZlJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9iZWVfY2FyZC5wbmcnLCBkZXNjOiBcIkhpdmUgSml2ZSBpcyBhIHZpcnR1YWwgcmVhbGl0eSBnYW1lIHdoZXJlIHlvdSBmbHkgYXJvdW5kIGFzIGEgYmVlLiBUaGUgZ29hbCBvZiB0aGUgZ2FtZSBpcyB0byByZXBvbGxpbmF0ZSB0aGUgaXNsYW5kIGFuZCBjbGVhciBpdCBvZiBhbGwgaXRzIHRyYXNoLiBJIHdvcmtlZCBpbiBhIGdyb3VwIGFzIGEgVGVjaG5pY2FsIEFydGlzdCwgd2hlcmUgSSBjcmVhdGVkIHRoZSBiZWUgZnVyIHNoYWRlciwgdGhlIGdyYXNzIHNoYWRlciwgcmlnZ2luZyB0aGUgYmVlLCBhbmQgc2V0dGluZyB1cCBHUFUgcGFpbnRpbmcgb24gdGhlIHBsYXllciBjb250cm9sbGVyLiBUaGlzIGdhbWUgd2FzIHNob3duIGF0IFNpZ2dyYXBoIGF0IERyZXhlbCBVbml2ZXJzaXR5J3MgYm9vdGggdXNpbmcgYSBNb3RvcmJpa2UgQ29udHJvbGxlci5cIiwgc3RhY2s6IGJlZV9zdGFjaywgbWVkaWE6IG1bMTFdLCB0eXBlOiAnVmlydHVhbCBSZWFsaXR5IEdhbWUnLCB1cmw6ICcnIH0sXHJcbiAgICAvLyB7IHRpdGxlOiAnUHJvY2VkdXJhbCBDYXZlJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9jYXZlX2NhcmQucG5nJywgZGVzYzogXCJUaGlzIFByb2NlZHVyYWwgQ2F2ZSBoYXMgY29udHJvbHMgbnVtYmVyIG9mIHJvb21zLCBzdGFsYWdtaXRlcywgbnVtYmVyIG9mIGhhbGx3YXlzIGJldHdlZW4gcm9vbXMsIGFzIHdlbGwgYXMgdXNpbmcgYSBwcm9jZXVkcmFsIG1hdGVyaWFsLiBUaGUgcHJvY2VkdXJhbCBtYXRlcmlhbCBpcyBleHBvcnRlZCBmcm9tIEhvdWRpbmkncyB0ZXh0dXJlIGJha2VyLCBhbmQgYnJvdWdodCBpbnRvIFVuaXR5LiBQZXJmZWN0IGFzc2V0IGZvciBhbnkgZHVuZ2VvbiBjcmF3bGVyLlwiLCBzdGFjazogY2F2ZV9zdGFjaywgbWVkaWE6IG1bOF0sIHR5cGU6ICdIb3VkaW5pIE1vZGVsJywgdXJsOiAnJyB9LFxyXG4gICAgLy8geyB0aXRsZTogJ1R1YmUgRG9tZSBFeHBlcmllbmNlJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby90dWJlX2NhcmQucG5nJywgZGVzYzogXCJGb3IgYSBEb21lIGV4aGliaXQgSSBjcmVhdGVkIGFuIGFic3RyYWN0IHR1YmUgYW5pbWF0aW9uIHVzaW5nIGRpc3RhbmNlIGZpZWxkIHZvbHVtZXMsIGFuZCBhIEdQVSBwcm9jZXVkcmFsIG1lc2ggY29tcHV0ZSBzaGFkZXIgaW4gVW5pdHkuIFRvIGV4cG9ydCBmb3IgdGhlIGRvbWUsIEkgZGV2ZWxvcGVkIGEgRmlzaGV5ZSBMZW5zIFJlbmRlciBQaXBlbGluZS4gRm9yIHRoaXMgcHJvamVjdCBJIGxldmVyYWdlZCBvcGVuIHNvdXJjZSBmcm9tIEtlaWppcm8uXCIsIHN0YWNrOiBzdG9yeWdyYXBoX3N0YWNrLCBtZWRpYTogbVs5XSwgdHlwZTogJ0ltbWVyc2l2ZSBFeHBlcmllbmNlJywgdXJsOiAnJyB9LFxyXG4gICAgLy8geyB0aXRsZTogJ1JlbScsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vcmVtZW1iZXJlbmNlX2xvZ28uanBnJywgZGVzYzogXCJSZW0gaXMgYSB2aWRlbyBnYW1lIGFib3V0IGEgeW91bmcgZ2lybCB0cmFwcGVkIGluIGEgY29tYXRvc2UgZHJlYW1zY2FwZS4gWW91IHBsYXkgYXMgYSB5b3VuZyBnaXJsIHdobyBtdXN0IG92ZXJjb21lIGhlciBmZWFycyB0byByZW1lbWJlciBoZXIgcGFzdC4gSW4gdGhpcyBmdW4sIG92ZXItdGhlLXNob3VsZGVyIHN0ZWFsdGggZ2FtZSB5b3UgbXVzdCBhdm9pZCBzY3JlZW4gaGVhZGVkIGVuZW1pZXMsIGFuZCBmaW5kIG1lbWVudG9zIG9mIHlvdXIgcGFzdC4gRm9yIHRoaXMgcHJvamVjdCBJIHdvcmtlZCBpbiBtYW55IGFyZWFzIGluY2x1ZGluZyBMZXZlbCBEZXNpZ24sIFZpc3VhbCBFZmZlY3RzLCBXZWIgRGV2ZWxvcG1lbnQsIE1vZGVsaW5nLCBhbmQgRG9jdW1lbnRhdGlvbi5cIiwgc3RhY2s6IHJlbV9zdGFjaywgbWVkaWE6IG1bMF0sIHR5cGU6ICdVbml0eSBHYW1lJywgdXJsOiAnaHR0cHM6Ly9vZmZicmFuZGhlbGx1aS5oZXJva3VhcHAuY29tLyMvaG9tZScgfSxcclxuICAgIC8vIHsgdGl0bGU6ICdSZW0nLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL3JlbWVtYmVyZW5jZV9sb2dvLmpwZycsIGRlc2M6IFwiUmVtIGlzIGEgdmlkZW8gZ2FtZSBhYm91dCBhIHlvdW5nIGdpcmwgdHJhcHBlZCBpbiBhIGNvbWF0b3NlIGRyZWFtc2NhcGUuIFlvdSBwbGF5IGFzIGEgeW91bmcgZ2lybCB3aG8gbXVzdCBvdmVyY29tZSBoZXIgZmVhcnMgdG8gcmVtZW1iZXIgaGVyIHBhc3QuIEluIHRoaXMgZnVuLCBvdmVyLXRoZS1zaG91bGRlciBzdGVhbHRoIGdhbWUgeW91IG11c3QgYXZvaWQgc2NyZWVuIGhlYWRlZCBlbmVtaWVzLCBhbmQgZmluZCBtZW1lbnRvcyBvZiB5b3VyIHBhc3QuIEZvciB0aGlzIHByb2plY3QgSSB3b3JrZWQgaW4gbWFueSBhcmVhcyBpbmNsdWRpbmcgTGV2ZWwgRGVzaWduLCBWaXN1YWwgRWZmZWN0cywgV2ViIERldmVsb3BtZW50LCBNb2RlbGluZywgYW5kIERvY3VtZW50YXRpb24uXCIsIHN0YWNrOiByZW1fc3RhY2ssIG1lZGlhOiBtWzBdLCB0eXBlOiAnVW5pdHkgR2FtZScsIHVybDogJ2h0dHBzOi8vb2ZmYnJhbmRoZWxsdWkuaGVyb2t1YXBwLmNvbS8jL2hvbWUnIH0sXHJcbiAgICAvLyB7IHRpdGxlOiAnRG9vciB0byBEb29yJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9yb2JvdF9jYXJkLnBuZycsIGRlc2M6IFwiQXMgcGFydCBvZiBteSBBbmltYXRpb24gY2xhc3MsIEkgY3JlYXRlZCBhIHNob3J0IGZpbG0gYWJvdXQgYSByb2JvdCB3aG8gZ29lcyB0aHJvdWdoIG1hbnkgc3RyYW5nZSB3b3JsZHMuIEkgbW9kZWxlZCwgdGV4dHVyZWQsIHJpZ2dlZCwgYW5kIGFuaW1hdGVkIGV2ZXJ5dGhpbmcgYW5kIHJlbmRlcmVkIG91dCBpbiBVbml0eS4gSSBhbHNvIGNyZWF0ZWQgYSB0b29uIHNoYWRlciB3aXRoIGEgaGlnaGxpZ2h0IGFuZCBvdXRsaW5lIGFzIHdlbGwgYXMgZGlkIHNvbWUgVkZYIGluIFVuaXR5LiBJdCB3YXMgYSBodWdlIGxlYXJuaW5nIGV4cGVyaWVuY2UgdG8gZ28gdGhyb3VnaCBldmVyeSBwYXJ0IG9mIHRoZSBhbmltYXRpb24gcGlwZWxpbmUhXCIsIHN0YWNrOiByZW1fc3RhY2ssIG1lZGlhOiBtWzddLCB0eXBlOiAnUm9ib3QgQW5pbWF0aW9uJywgdXJsOiAnJyB9XSk7XHJcbiAgICAvLyB7IHRpdGxlOiAnUm9hc3QnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL3JvYXN0XzcuanBnJywgZGVzYzogXCJSb2FzdCBpcyBhIHdlYmFwcCB0aGF0IHN1cnZleXMgY29tZm9ydCBpbiBhbiBpbmRvb3Igc3BhY2UuIEl0IGFza3MgcXVlc3Rpb25zIHRoYXQgZ2F1Z2UgdGVtcGVyYXR1cmUsIG5vaXNlLCBzbWVsbCwgYW5kIGh1bWlkaXR5LCBhbmQgbWFwcyBpdCB0byB3aGVyZSB5b3UgYXJlIG9uIHlvdXIgYnVpbGRpbmcncyBmbG9vcnBsYW4uIFRocm91Z2ggdGhpcyBjcm93ZCBzb3VyY2VkIGRhdGEgY29sbGVjdGVkLCBidWlsZGluZyBtYW5hZ2VycywgYXJjaGl0ZWN0cyBhbmQgdGhlIHBlb3BsZSB0YWtpbmcgdGhlIHN1cnZleSBjYW4gdW5kZXJzdGFuZCBob3cgcGVvcGxlIGZlZWwgaW4gYSBzcGFjZS4gSSB3b3JrZWQgb24gdGhpcyBwcm9qZWN0IGZvciA2IG1vbnRocyB3aGlsZSBJIHdhcyB3b3JraW5nIGF0IHRoZSBhcmNoaXRlY3R1cmUgZmlybSwgS2llcmFuIFRpbWJlcmxha2UuXCIsIHN0YWNrOiByb2FzdF9zdGFjaywgbWVkaWE6IG1bNV0sIHR5cGU6ICdXZWIgQXBwJywgdXJsOiAnJyB9LFxyXG4gICAgLy8geyB0aXRsZTogJ1BvcnRmb2xpbycsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vcG9ydF8xLnBuZycsIGRlc2M6IFwiRnJvbSBjb25jZXB0IHRvIGRlc2lnbiB0byBkZXZlbG9wbWVudCBJIHB1dCBhIGxvdCBvZiBsb3ZlIGludG8gdGhpcy4gQXMgYSBwZXJzb25hbCBjaGFsbGVuZ2UgSSBjcmVhdGVkIHRoaXMgd2Vic2l0ZSBlbnRpcmVseSBpbiBUeXBlc2NyaXB0IHdpdGggbm8galF1ZXJ5LiBBbGwgaW4gYWxsIEkgY2FuIGNvbmNsdWRlIHRoYXQgalF1ZXJ5IGlzIG92ZXJyYXRlZCEgSmF2YSBTY3JpcHQgaXMgcG93ZXJmdWwgZW5vdWdoIG9uIGl0cyBvd24uXCIsIHN0YWNrOiBwb3J0X3N0YWNrLCBtZWRpYTogbVs3XSwgdHlwZTogJ1dlYnNpdGUnLCB1cmw6ICdodHRwczovL2dpdGh1Yi5jb20vbWF0dHdhZ2FyL1dlYnNpdGVzL3RyZWUvbWFzdGVyL3BvcnRmb2xpb193ZWJzaXRlX3YyJyB9LFxyXG4gICAgLy8geyB0aXRsZTogJ0JyZWF0aGxlc3MnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnJywgZGVzYzogXCJUaGUgU3BhY2UgUGlyYXRlLCBBcmlhLCBpcyBvbiBhIG1pc3Npb24gdG8gbG9vdCBhIG1pbmVyYWwgY2FyZ28gc2hpcC4gSG93ZXZlciwgdXBvbiBsYW5kaW5nIG9uIHRoZSBjYXJnbyBzaGlwLCBBcmlhJ3MgaGVsbWV0IGNyYWNrcyBjYXVzaW5nIGhlciB0byBzbG93bHkgbG9zZSBveHlnZW4uIEl0J3Mgbm93IGEgcmFjZSBhZ2FpbnN0IHRpbWUgdG8gY29sbGVjdCBhbGwgdGhlIGdlbXMgYmVmb3JlIGhlciBveHlnZW4gcnVucyBvdXQhXCIsIHN0YWNrOiBicmVhdGhsZXNzX3N0YWNrLCBtZWRpYTogbVsyXSwgdHlwZTogJ0hUTUw1IEdhbWUnLCB1cmw6ICcvYnJlYXRobGVzcycgfV0pO1xyXG4gICAgLy8geyB0aXRsZTogJ0JyZWF0aGxlc3MnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnJywgZGVzYzogXCJUaGUgU3BhY2UgUGlyYXRlLCBBcmlhLCBpcyBvbiBhIG1pc3Npb24gdG8gbG9vdCBhIG1pbmVyYWwgY2FyZ28gc2hpcC4gSG93ZXZlciwgdXBvbiBsYW5kaW5nIG9uIHRoZSBjYXJnbyBzaGlwLCBBcmlhJ3MgaGVsbWV0IGNyYWNrcyBjYXVzaW5nIGhlciB0byBzbG93bHkgbG9zZSBveHlnZW4uIEl0J3Mgbm93IGEgcmFjZSBhZ2FpbnN0IHRpbWUgdG8gY29sbGVjdCBhbGwgdGhlIGdlbXMgYmVmb3JlIGhlciBveHlnZW4gcnVucyBvdXQhXCIsIHN0YWNrOiBicmVhdGhsZXNzX3N0YWNrLCBtZWRpYTogbVsyXSwgdHlwZTogJ0hUTUw1IEdhbWUnLCB1cmw6ICcvYnJlYXRobGVzcycgfV0pO1xyXG4gICAgLy8geyB0aXRsZTogJ01lYW4gRm9yZWNhc3QnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL21lYW5fZm9yZWNhc3RfMS5qcGcnLCBkZXNjOiAnQSBzbWFsbCB3ZWIgYXBwIHRoYXQgY2FsY3VsYXRlcyB0aGUgYXZlcmFnZSBvZiAzIHdlYXRoZXIgQVBJXFwnczogV3VuZGVyZ3JvdW5kLCBGb3JlY2FzdC5pbywgYW5kIFdvcmxkIFdlYXRoZXIgT25saW5lLiBUaGlzIGRhdGEgaXMgdGhlbiBzZXJ2ZWQgb250byBhIEQzLmpzIExpbmUgQ2hhcnQgZm9yIHRlbXBlcmF0dXJlLCBodW1pZHR5LCBhbmQgd2luZHNwZWVkLiBBbHNvIHRoZSB3ZWJhcHAgaXRzZWxmIGhhcyBtYW55IHN1YnRsZXRpZXMgdGhhdCBhcmUgYWZmZWN0ZWQgYnkgd2VhdGhlciBkYXRhLiBGb3IgZXhhbXBsZSwgdGhlIHZpZGVvICByZXNlbWJsZXMgdGhlIGN1cnJlbnQgd2VhdGhlci4gQWxzbyBlYWNoIGdyYXBoIGlzIGNvbG9yIGNvYXRlZCBieSBhIGdyYWRpZW50IGJhc2VkIG9uIHRoZSB3ZWF0aGVyIGRhdGEuJywgc3RhY2s6IHdlYXRoZXJfc3RhY2ssIG1lZGlhOiBtWzRdLCB0eXBlOiAnV2Vic2l0ZScsIHVybDogJy9tZWFuZm9yZWNhc3QnIH0sXHJcbiAgICAvLyB7IHRpdGxlOiAnUSpCZXJ0JywgdGl0bGVfaW1hZ2U6IFwiLi9wb3J0Zm9saW8vcWJlcnRfcGxheS5qcGdcIiwgZGVzYzogJ1RoaXMgaXMgbXkgQm91bmNpbmcgQmFsbCBBc3NpZ25tZW50IGZvciBBbmltYXRpb24gMSBhdCBEcmV4ZWwgVW5pdmVyc2l0eS4gV2hlbiBwaWNraW5nIGEgZ2FtZSB0aGF0IG1peGVzIG15IGxvdmUgb2YgcmV0cm8gdmlkZW8gZ2FtZXMgYW5kIGJvdW5jaW5nIGJhbGxzLCBRKkJlcnQgd2FzIGEgbm8tYnJhaW5lci4gRXZlcnl0aGluZyBpcyBvcmlnaW5hbGx5IG1vZGVsbGVkLCB0ZXh0dXJlZCwgYW5kIGFuaW1hdGVkLiBNYWRlIGluIE1heWEsIGFuZCByZW5kZXJlZCBpbiBWLVJheS4nLCBzdGFjazogcWJlcnRfc3RhY2ssIG1lZGlhOiBtWzJdLCB0eXBlOiAnQW5pbWF0aW9uJywgdXJsOiAnaHR0cHM6Ly92aW1lby5jb20vMTk4MTQ5Nzk1JyB9LFxyXG4gICAgLy8geyB0aXRsZTogJ0JlZHJvb20nLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL2NnaV9maW5hbF8xLnBuZycsIGRlc2M6ICdUaGlzIGlzIG15IGZpbmFsIGZvciBDR0kgMiBhdCBEcmV4ZWwgVW5pdmVyc2l0eS4gVGhlIGFzc2lnbm1lbnQgd2FzIHRvIHJlY3JlYXRlIGFueSB0eXBlIG9mIHJvb20sIHNvIEkgY2hvc2UgYSBsaXR0bGUgYm95XFwncyByb29tLiBXZSB3ZXJlIHRhc2tlZCB3aXRoIGNyZWF0aW5nIGF0IGxlYXN0IG9uZSBjb21wbGV4IG9iamVjdCwgc28gSSBkZWNpZGVkIHRvIGdvIHdpdGggYSB0cmFpbiBzZXQuJywgc3RhY2s6IHFiZXJ0X3N0YWNrLCBtZWRpYTogbVszXSwgdHlwZTogJzNEIFJlbmRlcicsIHVybDogJycgfV0pO1xyXG4gICAgXSk7XHJcblxyXG5cclxuLy8gdmFyIHdlbGNvbWVfYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWxjb21lLWJ1dHRvbicpO1xyXG4vLyB3ZWxjb21lX2Iub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuLy8gICAgIGp1bXAoJyNwb3J0Zm9saW8nLCB7XHJcbi8vICAgICAgICAgZHVyYXRpb246IDEwMDAsXHJcbi8vICAgICAgICAgb2Zmc2V0OiAwLFxyXG4vLyAgICAgICAgIGNhbGxiYWNrOiB1bmRlZmluZWQsXHJcbi8vICAgICAgICAgZWFzaW5nOiBqdW1wLmVhc2VJbk91dFF1YWQsXHJcbi8vICAgICAgICAgYWxseTogZmFsc2VcclxuLy8gICAgIH0pXHJcbi8vIH1cclxuXHJcblxyXG4vKiogXHJcbiAqIHBvcnRmb2xpbyB3ZWJzaXRlXHJcbiAqIGJyZWF0aGxlc3NcclxuICogd2VhdGhlciB3ZWJzaXRlXHJcbiAqIHFiZXJ0IGFuaW1hdGlvblxyXG4gKiBjZ2kgMiBmaW5hbD8/IFxyXG4gKiBcclxuKi9cclxuXHJcblxyXG5cclxud2luZG93Lm9ucmVzaXplID0gKGUpID0+IHtcclxuICAgIGlmIChhcHAuY2FudmFzKSB7XHJcbiAgICAgICAgYXBwLnNpemVDYW52YXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwb3J0Zm9saW8uYXBwZW5kQWxsKCk7XHJcblxyXG59O1xyXG5cclxuY29uc3QgbW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImltYWdlTW9kYWxcIik7XHJcbndpbmRvdy5vbmNsaWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0ID09IG1vZGFsKSB7XHJcbiAgICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIH1cclxuICB9O1xyXG4gIFxyXG5jb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xvc2VcIik7XHJcbmNsb3NlQnRuLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbn07XHJcblxyXG5cclxuLy8gdmFyIGRvY1dpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm9mZnNldFdpZHRoO1xyXG5cclxuLy8gW10uZm9yRWFjaC5jYWxsKFxyXG4vLyAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyonKSxcclxuLy8gICBmdW5jdGlvbihlbCkge1xyXG4vLyAgICAgaWYgKGVsLm9mZnNldFdpZHRoID4gZG9jV2lkdGgpIHtcclxuLy8gICAgICAgY29uc29sZS5sb2coZWwpO1xyXG4vLyAgICAgfVxyXG4vLyAgIH1cclxuLy8gKTtcclxuXHJcbi8vIHZhciBtZWRpYSA9IG5ldyBNZWRpYSgnbWVkaWEtMCcsIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiXSwgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2NhdC5qcGdcIiwgXCIuL3BvcnRmb2xpby9jYXQuanBnXCJdKTtcclxuXHJcbiIsImV4cG9ydCAqIGZyb20gXCIuL21lZGlhXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWVkaWFJdGVte1xyXG4gICAgbWVkaWE6IE1lZGlhO1xyXG4gICAgaHRtbDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBvcmRlcjogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IobWVkaWE6IE1lZGlhLCBodG1sOkhUTUxEaXZFbGVtZW50LCBvcmRlcjogbnVtYmVyKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ubWVkaWEgPSBtZWRpYTtcclxuICAgICAgICB2bS5odG1sID0gaHRtbDtcclxuICAgICAgICB2bS5vcmRlciA9IG9yZGVyO1xyXG4gICAgICAgIHZtLmh0bWwub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhLmxvYWRNZWRpYSh2bS5vcmRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTWVkaWEge1xyXG4gICAgaWQ6c3RyaW5nXHJcbiAgICBlbGVtZW50czogYW55W107XHJcbiAgICB0aHVtYm5haWxzOiBIVE1MSW1hZ2VFbGVtZW50W107XHJcbiAgICBtZWRpYV9pdGVtczogTWVkaWFJdGVtW107XHJcbiAgICBzZWxlY3RlZDogbnVtYmVyO1xyXG4gICAgdmltZW86c3RyaW5nO1xyXG5cclxuXHJcbiAgICByb3c6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBvdmVybGF5OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgc3ZnX292ZXJsYXk6SFRNTEltYWdlRWxlbWVudDtcclxuICAgIGNvbG1kOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgXHJcbiAgICBtZWRpYV9zZWxlY3RlZDpIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIHRodW1ibmFpbHM6IHN0cmluZ1tdLCBmaWxlcz86IHN0cmluZ1tdLCB2aW1lbz86IHN0cmluZyl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmlkID0gaWQ7XHJcbiAgICAgICAgdm0uc2VsZWN0ZWQgPSAwO1xyXG4gICAgICAgIHZtLmVsZW1lbnRzID0gW107XHJcbiAgICAgICAgdm0ubWVkaWFfaXRlbXMgPSBbXTtcclxuICAgICAgICB2bS50aHVtYm5haWxzID0gW107XHJcblxyXG4gICAgICAgIHZtLnZpbWVvID0gdmltZW87XHJcbiAgICAgICAgaWYodmltZW8pe1xyXG4gICAgICAgICAgICAgICAgdmFyIGZyYWcgPSB2bS5jcmVhdGVGcmFnbWVudCh2aW1lbyk7XHJcbiAgICAgICAgICAgICAgICB2bS5lbGVtZW50cy5wdXNoKGZyYWcpO1xyXG4gICAgICAgICAgICAgICAgLy8gdm0uZWxlbWVudHNbaV0uY2xhc3NMaXN0LmFkZCgnZHJvcHNoYWRvdycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHZtLmVsZW1lbnRzLmxlbmd0aDtcclxuICAgICAgICBpZihmaWxlcyl7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxyXG4gICAgICAgICAgICAgICAgaW1hZ2Uuc3JjID0gZmlsZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpbWFnZS5jbGFzc0xpc3QuYWRkKCdkcm9wc2hhZG93Jyk7XHJcbiAgICAgICAgICAgICAgICB2bS5lbGVtZW50cy5wdXNoKGltYWdlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5tZWRpYV9zZWxlY3RlZC5pZCA9ICdtZWRpYS1zZWxlY3RlZCc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdm0ub3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLm92ZXJsYXkuaWQgPSBcImltYWdlLW92ZXJsYXlcIjtcclxuICAgICAgICB2bS5vdmVybGF5LmNsYXNzTGlzdC5hZGQoJ292ZXJsYXktbWVkaWEnKTtcclxuICAgICAgICB2bS5tZWRpYV9zZWxlY3RlZC5hcHBlbmRDaGlsZCh2bS5vdmVybGF5KTtcclxuXHJcbiAgICAgICAgdm0uc3ZnX292ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIHZtLnN2Z19vdmVybGF5LnNyYyA9IFwiLi9wb3J0Zm9saW8vZXhwYW5kLnN2Z1wiO1xyXG4gICAgICAgIHZtLnN2Z19vdmVybGF5LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIHZtLnN2Z19vdmVybGF5LnN0eWxlLmJvdHRvbSA9IFwiMTBweFwiO1xyXG4gICAgICAgIHZtLnN2Z19vdmVybGF5LnN0eWxlLnJpZ2h0ID0gXCIxMHB4XCI7XHJcbiAgICAgICAgdm0uc3ZnX292ZXJsYXkuc3R5bGUud2lkdGggPSBcIjI0cHhcIjtcclxuICAgICAgICB2bS5zdmdfb3ZlcmxheS5zdHlsZS5oZWlnaHQgPSBcIjI0cHhcIjtcclxuICAgICAgICB2bS5zdmdfb3ZlcmxheS5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcclxuICAgICAgICB2bS5zdmdfb3ZlcmxheS5zdHlsZS5wYWRkaW5nID0gXCIycHhcIjtcclxuICAgICAgICB2bS5zdmdfb3ZlcmxheS5zdHlsZS5maWxsID0gXCJ3aGl0ZVwiO1xyXG5cclxuICAgICAgICB2bS5vdmVybGF5LmFwcGVuZENoaWxkKHZtLnN2Z19vdmVybGF5KTtcclxuXHJcbiAgICAgICAgdm0ub3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBtb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW1hZ2VNb2RhbFwiKTtcclxuICAgICAgICAgICAgdmFyIG1vZGFsSW1nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RhbEltYWdlXCIpO1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxEZXNjID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RhbERlc2NyaXB0aW9uXCIpO1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxEZXNjID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RhbFRpdGxlXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2bS5lbGVtZW50c1t2bS5zZWxlY3RlZF0uc3JjKVxyXG4gICAgICAgICAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgICAgICBtb2RhbEltZy5zcmMgPSB2bS5lbGVtZW50c1t2bS5zZWxlY3RlZF0uc3JjO1xyXG4gICAgICAgICAgICBtb2RhbERlc2MudGV4dENvbnRlbnQgPSBcIkhlcmXigJlzIGEgbW9yZSBkZXRhaWxlZCBkZXNjcmlwdGlvbiBvZiB0aGUgaW1hZ2UuXCI7XHJcbiAgICAgICAgICAgIG1vZGFsVGl0bGUudGV4dENvbnRlbnQgPSBcIlRoZSBCZXN0IFRpdGxlXCI7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gdm0ub3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIC8vIHZtLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnb3ZlcmxheS1tZWRpYScpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHZtLm92ZXJsYXkpXHJcbiAgICAgICAgLy8gdm0ubWVkaWFfc2VsZWN0ZWQuYXBwZW5kQ2hpbGQodm0ub3ZlcmxheSk7XHJcblxyXG4gICAgICAgIHZtLnJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnJvdy5jbGFzc0xpc3QuYWRkKCdyb3cnLCdqdXN0aWZ5LWNlbnRlcicsJ21lZGlhLWNvbnRhaW5lcicpO1xyXG5cclxuICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgdm0uZWxlbWVudHMubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgICAgICB2bS5jb2xtZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICB2bS5jb2xtZC5jbGFzc0xpc3QuYWRkKCdjb2wteHMnKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBodG1sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICAgICAgaHRtbC5jbGFzc0xpc3QuYWRkKCdtZWRpYS1pdGVtJyk7XHJcbiAgICAgICAgICAgIHZhciBtZWRpYV9pdGVtID0gbmV3IE1lZGlhSXRlbSh2bSxodG1sLGopO1xyXG4gICAgICAgICAgICB2bS5tZWRpYV9pdGVtcy5wdXNoKG1lZGlhX2l0ZW0pO1xyXG5cclxuICAgICAgICAgICAgdm0udGh1bWJuYWlscy5wdXNoKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpKTtcclxuICAgICAgICAgICAgdm0udGh1bWJuYWlsc1tqXS5jbGFzc0xpc3QuYWRkKCdkcm9wc2hhZG93Jyk7XHJcbiAgICAgICAgICAgIHZtLnRodW1ibmFpbHNbal0uc3JjID0gdGh1bWJuYWlsc1tqXTtcclxuXHJcbiAgICAgICAgICAgIHZtLmNvbG1kLmFwcGVuZENoaWxkKHZtLm1lZGlhX2l0ZW1zW2pdLmh0bWwpO1xyXG5cclxuICAgICAgICAgICAgaWYodm0uZWxlbWVudHMubGVuZ3RoICE9PSAxKXtcclxuICAgICAgICAgICAgICAgIHZtLmNvbG1kLmFwcGVuZENoaWxkKHZtLnRodW1ibmFpbHNbal0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZtLnJvdy5hcHBlbmRDaGlsZCh2bS5jb2xtZCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAjbWVkaWEtc2VsZWN0ZWRcclxuICAgICAgICAvLyAgICAgICAgICAgICAgLm92ZXJsYXlcclxuICAgICAgICAvLyAgICAgICAgICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpLmRyb3BzaGFkb3dcclxuICAgICAgICAvLyAgICAgICAgICAucm93Lmp1c3RpZnktY2VudGVyLm1lZGlhLWNvbnRhaW5lclxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAuY29sLW1kXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAubWVkaWEtaXRlbVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpLmRyb3BzaGFkb3dcclxuICAgICAgICAvLyAgICAgICAgICAgICAgLmNvbC1tZFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgLm1lZGlhLWl0ZW1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKS5kcm9wc2hhZG93XHJcblxyXG5cclxuICAgICAgICB2bS5tZWRpYV9pdGVtc1t2bS5zZWxlY3RlZF0uaHRtbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgIC8vIHZtLmVsZW1lbnRzLnB1c2godm0uZWxlbWVudHNbMF0pO1xyXG4gICAgICAgIC8vIHZtLmVsZW1lbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgLy8gdm0uc2V0SWQoaWQpO1xyXG4gICAgICAgIC8vIHZtLmxvYWRNZWRpYSgwKTtcclxuXHJcbiAgICB9XHJcbiAgICBjcmVhdGVGcmFnbWVudChzdHI6IHN0cmluZywgd2lkdGg/OiBudW1iZXIsIGhlaWdodD86IG51bWJlciApIHtcclxuICAgICAgICB2YXIgbmV3c3RyID0gc3RyO1xyXG4gICAgICAgIGlmKHdpZHRoKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIG5ld3N0ciA9IHN0ci5yZXBsYWNlKCd3aWR0aD1cIlxcZCtcIiBoZWlnaHQ9XCJcXGQrXCInLCAnd2lkdGg9XCInK3dpZHRoKydcIiBoZWlnaHQ9XCInK2hlaWdodCsnXCInKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuXHJcbiAgICAgICAgdmFyIGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBlbGVtLmlubmVySFRNTCA9IHN0cjtcclxuXHJcbiAgICAgICAgd2hpbGUgKGVsZW0uY2hpbGROb2Rlc1swXSkge1xyXG4gICAgICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGVsZW0uY2hpbGROb2Rlc1swXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmcmFnO1xyXG4gICAgfVxyXG5cclxuICAgIHNldElkKGlkOiBzdHJpbmcpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2YXIgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIHdoaWxlKHBhcmVudC5maXJzdENoaWxkKXtcclxuICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHBhcmVudC5maXJzdENoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHZtLm1lZGlhX3NlbGVjdGVkKTtcclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodm0ucm93KTtcclxuICAgIH1cclxuXHJcbiAgICBzaXplKCl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLm92ZXJsYXkuc3R5bGUud2lkdGggPSAodm0ubWVkaWFfc2VsZWN0ZWQuY2xpZW50V2lkdGgrMTIpKydweCc7XHJcbiAgICAgICAgdm0ub3ZlcmxheS5zdHlsZS5oZWlnaHQgPSAodm0ubWVkaWFfc2VsZWN0ZWQuY2xpZW50SGVpZ2h0KzgpKydweCc7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZE1lZGlhKHRodW1iX251bTpudW1iZXIpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICAgICAgICAgIC8vIHZtLm1lZGlhX3NlbGVjdGVkLnJlbW92ZUNoaWxkKHZtLm1lZGlhX3NlbGVjdGVkLmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIHZtLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnY2xvc2UtbWVkaWEnKTtcclxuXHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB2bS5tZWRpYV9pdGVtcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhX2l0ZW1zW2ldLmh0bWwuc3R5bGUud2lkdGggPSB2bS5jb2xtZC5jbGllbnRXaWR0aCsncHgnO1xyXG4gICAgICAgICAgICB2bS5tZWRpYV9pdGVtc1tpXS5odG1sLnN0eWxlLmhlaWdodCA9IHZtLmNvbG1kLmNsaWVudEhlaWdodCsncHgnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodm0udmltZW8gJiYgdGh1bWJfbnVtID09PSAwKXtcclxuICAgICAgICAgICAgdm0uZWxlbWVudHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgdmFyIGZyYWcgPSB2bS5jcmVhdGVGcmFnbWVudCh2bS52aW1lbywgdm0ubWVkaWFfc2VsZWN0ZWQuY2xpZW50V2lkdGgsIHZtLm1lZGlhX3NlbGVjdGVkLmNsaWVudEhlaWdodCk7XHJcbiAgICAgICAgICAgIHZtLmVsZW1lbnRzLnVuc2hpZnQoZnJhZyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2bS5vdmVybGF5LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIHZtLmVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQoJ2Ryb3BzaGFkb3cnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2bS5vdmVybGF5LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLypidXR0b24gdHJhbnNpdGlvbiovXHJcbiAgICAgICAgdm0ubWVkaWFfaXRlbXNbdm0uc2VsZWN0ZWRdLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcclxuICAgICAgICB2bS5zZWxlY3RlZCA9IHRodW1iX251bTtcclxuICAgICAgICB2bS5tZWRpYV9pdGVtc1t2bS5zZWxlY3RlZF0uaHRtbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG5cclxuICAgICAgICAvKnBpY3R1cmUgdHJhbnNpdGlvbiovXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgLy8gaWYodm0udmltZW8gJiYgdm0uc2VsZWN0ZWQgPT09IDApe1xyXG5cclxuICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgaWYgKHZtLm1lZGlhX3NlbGVjdGVkLmNoaWxkcmVuLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQucmVtb3ZlQ2hpbGQodm0ubWVkaWFfc2VsZWN0ZWQubGFzdENoaWxkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQuYXBwZW5kQ2hpbGQodm0uZWxlbWVudHNbdm0uc2VsZWN0ZWRdKTtcclxuICAgICAgICAgICAgdm0uc2l6ZSgpO1xyXG4gICAgICAgICAgICB2bS5vdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2Nsb3NlLW1lZGlhJyk7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhX2l0ZW1zW3ZtLnNlbGVjdGVkXS5odG1sLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XHJcblxyXG4gICAgICAgICAgICBpZih2bS52aW1lbyAmJiB0aHVtYl9udW0gPT09IDApe1xyXG4gICAgICAgICAgICAgICAgdm0uc3ZnX292ZXJsYXkuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdm0uc3ZnX292ZXJsYXkuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCA2MDApOyAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8vIGhhbmRsZUNsaWNrKGV2ZW50KVxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIGNvbnN0IHZtID0gdGhpc1xyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKHZtLmVsZW1lbnRzKVxyXG4gICAgLy8gICAgIHZhciBtb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW1hZ2VNb2RhbFwiKTtcclxuICAgIC8vICAgICB2YXIgbW9kYWxJbWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGFsSW1hZ2VcIik7XHJcbiAgICAvLyAgICAgdmFyIG1vZGFsRGVzYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9kYWxEZXNjcmlwdGlvblwiKTtcclxuICAgIC8vICAgICB2YXIgbW9kYWxEZXNjID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RhbFRpdGxlXCIpO1xyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKHZtLmVsZW1lbnRzW3ZtLnNlbGVjdGVkXS5zcmMpXHJcbiAgICAvLyAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIC8vICAgICBtb2RhbEltZy5zcmMgPSB2bS5lbGVtZW50c1t2bS5zZWxlY3RlZF0uc3JjO1xyXG4gICAgLy8gICAgIG1vZGFsRGVzYy50ZXh0Q29udGVudCA9IFwiSGVyZeKAmXMgYSBtb3JlIGRldGFpbGVkIGRlc2NyaXB0aW9uIG9mIHRoZSBpbWFnZS5cIjtcclxuICAgIC8vICAgICBtb2RhbFRpdGxlLnRleHRDb250ZW50ID0gXCJUaGUgQmVzdCBUaXRsZVwiO1xyXG4gICAgLy8gfVxyXG5cclxufSIsImV4cG9ydCAqIGZyb20gXCIuL3NraWxsX2JhZGdlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2tpbGwge1xyXG4gIGZsZXhfaXRlbTogSFRNTERpdkVsZW1lbnQ7XHJcbiAgc3ZnOiBTVkdTVkdFbGVtZW50O1xyXG4gIHN2Z19jaXJjbGU6IFNWR0NpcmNsZUVsZW1lbnQ7XHJcbiAgc2NhbGVfYm94OiBIVE1MRGl2RWxlbWVudDtcclxuICBpbWFnZTogSFRNTEltYWdlRWxlbWVudDtcclxuICB0ZXh0OiBIVE1MRGl2RWxlbWVudDtcclxuICBmbGV4X2dyaWRfaWQ6IHN0cmluZztcclxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGNsYXNzcGVyY2VudDogc3RyaW5nLCBpbWFnZTogc3RyaW5nLCBmbGV4X2dyaWRfaWQ6IHN0cmluZywgYmxhY2t0ZXh0OiBib29sZWFuKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgdm0uZmxleF9ncmlkX2lkID0gZmxleF9ncmlkX2lkO1xyXG5cclxuICAgIHZtLmZsZXhfaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdm0uZmxleF9pdGVtLmNsYXNzTmFtZSArPSAnZmxleC1pdGVtJztcclxuXHJcbiAgICB2bS5zdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInN2Z1wiKVxyXG4gICAgdm0uc3ZnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbGFzc3BlcmNlbnQpXHJcbiAgICB2bS5zdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsICc4NCcpO1xyXG4gICAgdm0uc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzg0Jyk7XHJcblxyXG4gICAgdm0uc3ZnX2NpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdjaXJjbGUnKTtcclxuICAgIHZtLnN2Z19jaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2NsYXNzJywgJ291dGVyJyk7XHJcbiAgICB2bS5zdmdfY2lyY2xlLnNldEF0dHJpYnV0ZU5TKG51bGwsIFwiY3hcIiwgJy00MicpO1xyXG4gICAgdm0uc3ZnX2NpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCBcImN5XCIsICc0MicpO1xyXG4gICAgdm0uc3ZnX2NpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCBcInJcIiwgJzM3Jyk7XHJcbiAgICB2bS5zdmdfY2lyY2xlLnNldEF0dHJpYnV0ZU5TKG51bGwsIFwidHJhbnNmb3JtXCIsIFwicm90YXRlKC05MCwgMCwgMClcIik7XHJcblxyXG4gICAgdm0uc2NhbGVfYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBpZiAobmFtZSA9PT0gXCJUeXBlIFNjcmlwdFwiIHx8IG5hbWUgPT09IFwiQm9vdHN0cmFwXCIgfHwgbmFtZSA9PT0gXCJEMy5qc1wiIHx8IG5hbWUgPT09IFwiUGhvdG9zaG9wXCIgfHwgbmFtZSA9PT0gXCJJbGx1c3RyYXRvclwiIHx8IG5hbWUgPT09IFwiQWZ0ZXIgRWZmZWN0c1wiIHx8IG5hbWUgPT09IFwiTWF5YVwiIHx8IG5hbWUgPT09IFwiTXVkYm94XCIpIHtcclxuICAgICAgdm0uc2NhbGVfYm94LmNsYXNzTmFtZSArPSAnc2NhbGUtYm94LXNxdWFyZSc7XHJcbiAgICB9IGVsc2UgaWYgKG5hbWUgPT09IFwiVW5pdHlcIiB8fCBuYW1lID09PSBcIlBoYXNlci5qc1wiIHx8IG5hbWUgPT09IFwiRDMuanNcIiB8fCBuYW1lID09PSBcIlNDU1NcIiB8fCBuYW1lID09PSBcIkphdmFcIiB8fCBuYW1lID09PSBcIlB5dGhvblwiKSB7XHJcbiAgICAgIHZtLnNjYWxlX2JveC5jbGFzc05hbWUgKz0gJ3NjYWxlLWJveC1taWQnO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHZtLnNjYWxlX2JveC5jbGFzc05hbWUgKz0gJ3NjYWxlLWJveCc7XHJcbiAgICB9XHJcblxyXG4gICAgdm0uaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgIHZtLmltYWdlLnNyYyA9IGltYWdlO1xyXG5cclxuICAgIHZtLnRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGlmIChibGFja3RleHQpIHtcclxuICAgICAgdm0udGV4dC5jbGFzc05hbWUgKz0gJ3RleHQgYmxhY2stdGV4dCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2bS50ZXh0LmNsYXNzTmFtZSArPSAndGV4dCc7XHJcbiAgICB9XHJcbiAgICB2bS50ZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5hbWUpKTtcclxuXHJcbiAgICAvLyAuZmxleC1pdGVtXHJcbiAgICAvLyAgICAgICBzdmcuY2lyY2xlLTc1KHdpZHRoPSc4NCcsIGhlaWdodD0nODQnKVxyXG4gICAgLy8gICAgICAgICBjaXJjbGUub3V0ZXIoY3g9Jy00MicsIGN5PSc0MicsIHI9JzM3JyB0cmFuc2Zvcm09XCJyb3RhdGUoLTkwLCAwLCAwKVwiKSBcclxuICAgIC8vICAgICAgIC5zY2FsZS1ib3hcclxuICAgIC8vICAgICAgICAgaW1nKGlkPVwiZm91clwiKVxyXG4gICAgLy8gICAgICAgICAudGV4dCBhYmNcclxuICAgIHZtLmZsZXhfaXRlbS5hcHBlbmRDaGlsZCh2bS5zdmcpO1xyXG4gICAgdm0uc3ZnLmFwcGVuZENoaWxkKHZtLnN2Z19jaXJjbGUpO1xyXG4gICAgdm0uZmxleF9pdGVtLmFwcGVuZENoaWxkKHZtLnNjYWxlX2JveCk7XHJcbiAgICB2bS5zY2FsZV9ib3guYXBwZW5kQ2hpbGQodm0uaW1hZ2UpO1xyXG4gICAgdm0uZmxleF9pdGVtLmFwcGVuZENoaWxkKHZtLnRleHQpO1xyXG4gIH1cclxuICByZXNldElkKGlkOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZtLmZsZXhfZ3JpZF9pZCA9IGlkO1xyXG4gIH1cclxuXHJcbiAgYXBwZW5kKCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdmFyIGZsZXhfZ3JpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHZtLmZsZXhfZ3JpZF9pZCk7XHJcbiAgICBmbGV4X2dyaWQuYXBwZW5kQ2hpbGQodm0uZmxleF9pdGVtKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNraWxsSW5mbyB7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIGNsYXNzOiBzdHJpbmc7XHJcbiAgaW1hZ2U6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbGxlY3Rpb24ge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgaW1hZ2VzOiBJU2tpbGxJbmZvW107XHJcbiAgcGF0aDogc3RyaW5nO1xyXG4gIHNraWxsczogU2tpbGxbXTtcclxuICBmbGV4X2dyaWRfaWQ6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nLCBmbGV4X2dyaWRfaWQ6IHN0cmluZywgaW1hZ2VzOiBJU2tpbGxJbmZvW10sYmxhY2t0ZXh0OiBib29sZWFuLCBpZD86IHN0cmluZykge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgIHZtLmltYWdlcyA9IGltYWdlcztcclxuICAgIHZtLnBhdGggPSBwYXRoO1xyXG4gICAgdm0uZmxleF9ncmlkX2lkID0gZmxleF9ncmlkX2lkO1xyXG5cclxuICAgIHZtLnNraWxscyA9IFtdO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW1hZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZtLnNraWxscy5wdXNoKG5ldyBTa2lsbChpbWFnZXNbaV0ubmFtZSwgaW1hZ2VzW2ldLmNsYXNzLCB2bS5wYXRoICsgaW1hZ2VzW2ldLmltYWdlLCB2bS5mbGV4X2dyaWRfaWQsIGJsYWNrdGV4dCkpO1xyXG4gICAgfVxyXG4gICAgaWYgKGlkKSB7XHJcbiAgICAgIHZtLmlkID0gaWQ7XHJcbiAgICAgIHZhciBlbGVtZW50ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHZtLmlkKTtcclxuICAgICAgZWxlbWVudC5vbm1vdXNldXAgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZtLmxvYWQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlc2V0SWRzKGlkOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZtLmZsZXhfZ3JpZF9pZCA9IGlkO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5za2lsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdm0uc2tpbGxzW2ldLnJlc2V0SWQodm0uZmxleF9ncmlkX2lkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBsb2FkKCkgeyAvL3NldHMgc3JjJ3MgdG8gdGhlIGRvbS4gdGhlbiBvbmNlIGV2ZXJ5dGhpbmcgaXMgbG9hZGVkLCBpdCBhZGRzIGNsYXNzIGFjdGl2ZSB0byBtYWtlIHRoZW0gYXBwZWFyIHZpYSBjc3NcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZhciBmbGV4X2dyaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh2bS5mbGV4X2dyaWRfaWQpO1xyXG4gICAgd2hpbGUgKGZsZXhfZ3JpZC5maXJzdENoaWxkKSB7XHJcbiAgICAgIGZsZXhfZ3JpZC5yZW1vdmVDaGlsZChmbGV4X2dyaWQuZmlyc3RDaGlsZCk7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLnNraWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2bS5za2lsbHNbaV0uYXBwZW5kKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIHB1YmxpYyBjbG9zZSgpe1xyXG4gIC8vICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gIC8vICAgdmFyIGZsZXhfZ3JpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHZtLmZsZXhfZ3JpZF9pZCk7XHJcbiAgLy8gICB3aGlsZSAoZmxleF9ncmlkLmZpcnN0Q2hpbGQpIHtcclxuICAvLyAgICAgZmxleF9ncmlkLnJlbW92ZUNoaWxkKGZsZXhfZ3JpZC5maXJzdENoaWxkKTtcclxuICAvLyAgIH1cclxuICAvLyB9XHJcbn1cclxuIl19
