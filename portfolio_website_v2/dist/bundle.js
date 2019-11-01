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
exports.__esModule = true;
__export(require("./image_canvas"));
function lerp(from, to, percent) {
    var differance = to - from;
    return from + (differance * percent);
}
exports.lerp = lerp;
var Img = /** @class */ (function () {
    function Img(width, height) {
        var vm = this;
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
            image.src = 'perlin_background.png';
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
exports.__esModule = true;
var jump = require("jump.js");
var image_canvas = require("./image_canvas");
var skill_badge = require("./skill_badge");
var media = require("./media");
//yoo
var timeout = 1000;
var frontend = new skill_badge.Collection('./skills/', 'flex-grid1', [
    { "name": 'C#', "class": 'circle-100', "image": 'csharp.svg' },
    { "name": 'Java Script', "class": 'circle-100', "image": 'javascript-2.svg' },
    { "name": 'HTML5', "class": 'circle-100', "image": 'html5.svg' },
    { "name": 'CSS3', "class": 'circle-100', "image": 'css-3.svg' },
    { "name": 'C++', "class": 'circle-75', "image": 'c-seeklogo.com.svg' },
    { "name": 'Java', "class": 'circle-75', "image": 'java-14.svg' },
    { "name": 'Python', "class": 'circle-50', "image": 'python-5.svg' },
    { "name": 'Node JS', "class": 'circle-25', "image": 'nodejs-icon.svg' },
], false, 'frontend');
var softeng = new skill_badge.Collection('./skills/', 'flex-grid2', [
    { "name": 'Unity', "class": 'circle-100', "image": 'unity.svg' },
    { "name": 'Vuforia', "class": 'circle-75', "image": 'vuforia-logo.png' },
    { "name": 'Oculus VR', "class": 'circle-75', "image": 'oculus.png' },
    { "name": 'Leap Motion', "class": 'circle-75', "image": 'leap.png' },
    { "name": 'Open GL', "class": 'circle-25', "image": 'opengl2.svg' },
], false, 'softeng');
var design = new skill_badge.Collection('./skills/', 'flex-grid3', [
    { "name": 'Illustrator', "class": 'circle-100', "image": 'adobe-illustrator-cc.svg' },
    { "name": 'Maya', "class": 'circle-75', "image": 'maya.png' },
    { "name": 'Houdini', "class": 'circle-50', "image": 'houdini.png' },
    { "name": 'After Effects', "class": 'circle-50', "image": 'after-effects-cc.svg' },
    { "name": 'Motion Builder', "class": 'circle-25', "image": 'mobu.png' },
    { "name": 'Vicon Blade', "class": 'circle-25', "image": 'vicon.png' },
    { "name": 'Photoshop', "class": 'circle-25', "image": 'photoshop-cc.svg' },
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
            console.log('I THINK THIS HAPPENED?');
            console.log(vm.col6.lastChild);
            vm.col6Holder.removeChild(vm.demo);
        }
        else if (vm.col6Holder.lastChild !== vm.demo) {
            console.log('WOAH THIS WORKS?');
            console.log(vm.col6.lastChild);
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
        if (vm.title === title) {
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
m.push(new media.Media('', ['./portfolio/contrast_3.png', './portfolio/contrast_5.png', './portfolio/contrast_4.png', './portfolio/contrast_7.png'], ['./portfolio/contrast_3.png', './portfolio/contrast_5.png', './portfolio/contrast_4.png', './portfolio/contrast_7.png']));
m.push(new media.Media('', ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"], ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"]));
// m.push(new media.Media('', ["./portfolio/qbert_play.jpg", "./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], ["./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
// m.push(new media.Media('', ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"], ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"]));
// m.push(new media.Media('', ['./portfolio/mean_forecast_1.jpg', './portfolio/mean_forecast_2.jpg'], ['./portfolio/mean_forecast_1.jpg', './portfolio/mean_forecast_2.jpg']));
// m.push(new media.Media('', ['./portfolio/roast_6.png', './portfolio/roast_2.png', './portfolio/roast_3.png', './portfolio/roast_4.png'], ['./portfolio/roast_6.png', './portfolio/roast_2.png','./portfolio/roast_3.png', './portfolio/roast_4.png']));
m.push(new media.Media('', ['./portfolio/StoryGraph_Card.png', './portfolio/storygraph_1.png', './portfolio/storygraph_2.png'], ['./portfolio/storygraph_1.png', './portfolio/storygraph_2.png'], '<iframe src="https://player.vimeo.com/video/369747471" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/crowd_1.png', './portfolio/crowd_2.png', './portfolio/crowd_3.png'], ['./portfolio/crowd_1.png', './portfolio/crowd_2.png', './portfolio/crowd_3.png']));
m.push(new media.Media('', ['./portfolio/bioshroom_1.png', './portfolio/bioshroom_2.PNG', './portfolio/bioshroom_3.PNG', './portfolio/bioshroom_4.PNG'], ['./portfolio/bioshroom_1.png', './portfolio/bioshroom_2.PNG', './portfolio/bioshroom_3.PNG'], '<iframe src="https://player.vimeo.com/video/369752631" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/nk_3.png', './portfolio/nk_1.PNG', './portfolio/nk_2.PNG'], ['./portfolio/nk_1.png', './portfolio/nk_2.PNG'], '<iframe src="https://player.vimeo.com/video/349513373" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/robot_1.png', './portfolio/robot_2.PNG', './portfolio/robot_3.PNG'], ['./portfolio/robot_2.png', './portfolio/robot_3.PNG'], '<iframe src="https://player.vimeo.com/video/369784543" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/cave_3.png', './portfolio/cave_2.PNG', './portfolio/cave_1.PNG', './portfolio/cave_4.PNG'], ['./portfolio/cave_2.png', './portfolio/cave_1.PNG', './portfolio/cave_4.PNG'], '<iframe src="https://player.vimeo.com/video/369789127" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/tube_3.PNG', './portfolio/tube_2.PNG', './portfolio/tube_4.PNG'], ['./portfolio/tube_2.PNG', './portfolio/tube_4.PNG'], '<iframe src="https://player.vimeo.com/video/369955460" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/mouse_1.PNG', './portfolio/mouse_2.PNG', './portfolio/mouse_3.PNG'], ['./portfolio/mouse_1.PNG', './portfolio/mouse_2.PNG', './portfolio/mouse_3.PNG']));
m.push(new media.Media('', ['./portfolio/bee_1.PNG', './portfolio/bee_2.PNG', './portfolio/bee_3.PNG'], ['./portfolio/bee_2.PNG', './portfolio/bee_3.PNG'], '<iframe src="https://player.vimeo.com/video/370220935" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
// m.push(new media.Media('', ['./portfolio/port_1.png', './portfolio/port_2.png', './portfolio/port_3.png',  './portfolio/port_4.png'], ['./portfolio/port_1.png', './portfolio/port_2.png', './portfolio/port_3.png', './portfolio/port_4.png']));
var portfolio = new Portfolio('portfolio', [
    { title: 'The Story Graph', title_image: './portfolio/StoryGraph_Card.png', desc: "The Story Graph is a node based visual scripting tool. Similar to Blueprints in Unreal Engine 4, The Story Graph makes scripting easy for designers and developers who want to prototype rapidly. This is a Unity Custom Editor Tool that can be bought on the Unity Asset Store.", stack: storygraph_stack, media: m[3], type: 'Unity Custom Editor Tool', url: 'https://assetstore.unity.com/packages/tools/visual-scripting/story-graph-136713' },
    { title: 'Bioshroom', title_image: './portfolio/bioshroom_card.png', desc: "Bioshroom is a first person exploration and gardening game. You are a Biologist exploring a foreign planet infested with mushrooms. It is your goal to explore the planet, gather new mushrooms, and breed them to send back to your home planet. On this project I worked as a technical artist and developer. I developed a procedural mushroom using blendshapes, as well as a mushroom spawner that uses vertex colors on the ground.", stack: rem_stack, media: m[5], type: 'Unity Game', url: '' },
    { title: 'And the Crowd Goes Wild!', title_image: './portfolio/crowd_card.png', desc: "And the Crowd Goes Wild is a virtual reality interactive experience where you put on a magic show for an audience of ghosts. This experience uses Oculus VR as well as the Leapmotion to truly simulate magic coming out of your fingertips via Leap Motion gestures. I developed this game entirely using The Story Graph, the Unity Custom Editor Tool I created. Made in only 1 month for my Introduction to Virtual Reality class, this experience explores Virtual Reality User Experience design with gesture based controls.", stack: storygraph_stack, media: m[4], type: 'Unity VR Experience', url: '' },
    { title: 'Hive Jive', title_image: './portfolio/bee_card.png', desc: "Hive Jive is a virtual reality game where you fly around as a bee. The goal of the game is to repollinate the island and clear it of all its trash. I worked in a group as a Technical Artist, where I created the bee fur shader, the grass shader, rigging the bee, and setting up GPU painting on the player controller. This game was shown at Siggraph at Drexel University's booth using a Motorbike Controller.", stack: bee_stack, media: m[11], type: 'Virtual Reality Game', url: '' },
    { title: 'Lost And Founders', title_image: './portfolio/nk_card.png', desc: "Lost and Founders is an augmented reality game I worked on while I was working at Night Kitchen Interactive. Currently at the Edgar Allen Poe National Historic Site anyone can use their augmented reality enabled device to be led on Poe's famous stories as an interactive adventure. On this project I worked as a UI and AR developer in Unity 3d. I set up a Model View Controller framework and CSV converter to make data entry quick and easy from the editor.", stack: nk_stack, media: m[6], type: 'Augmented Reality Game', url: 'https://www.whatscookin.com/' },
    { title: 'Procedural Cave', title_image: './portfolio/cave_card.png', desc: "This Procedural Cave has controls number of rooms, stalagmites, number of hallways between rooms, as well as using a proceudral material. The procedural material is exported from Houdini's texture baker, and brought into Unity. Perfect asset for any dungeon crawler.", stack: cave_stack, media: m[8], type: 'Houdini Model', url: '' },
    { title: 'Tube Dome Experience', title_image: './portfolio/tube_card.PNG', desc: "For a Dome exhibit I created an abstract tube animation using distance field volumes, and a GPU proceudral mesh compute shader in Unity. To export for the dome, I developed a Fisheye Lens Render Pipeline. For this project I leveraged open source from Keijiro.", stack: storygraph_stack, media: m[9], type: 'Immersive Experience', url: '' },
    { title: 'Motion Capture Mouse', title_image: './portfolio/mouse_card.png', desc: "I created an animation controller in Unity, using Motion Capture data that I created and cleaned in Vikon Blade. I also rigged and weight painted a Mouse model using Maya Human IK tool, and applied mocap data to the model in Motion Builder. Finally I brought it into Unity and blended between animations using third person controller inputs.", stack: mouse_stack, media: m[10], type: 'Rig and Mocap', url: '' },
    { title: 'Rem', title_image: './portfolio/rememberence_logo.jpg', desc: "Rem is a video game about a young girl trapped in a comatose dreamscape. You play as a young girl who must overcome her fears to remember her past. In this fun, over-the-shoulder stealth game you must avoid screen headed enemies, and find mementos of your past. For this project I worked in many areas including Level Design, Visual Effects, Web Development, Modeling, and Documentation.", stack: rem_stack, media: m[0], type: 'Unity Game', url: 'https://offbrandhellui.herokuapp.com/#/home' },
    { title: 'Door to Door', title_image: './portfolio/robot_card.png', desc: "As part of my Animation class, I created a short film about a robot who goes through many strange worlds. I modeled, textured, rigged, and animated everything and rendered out in Unity. I also created a toon shader with a highlight and outline as well as did some VFX in Unity. It was a huge learning experience to go through every part of the animation pipeline!", stack: rem_stack, media: m[7], type: 'Robot Animation', url: '' },
    // { title: 'Roast', title_image: './portfolio/roast_7.jpg', desc: "Roast is a webapp that surveys comfort in an indoor space. It asks questions that gauge temperature, noise, smell, and humidity, and maps it to where you are on your building's floorplan. Through this crowd sourced data collected, building managers, architects and the people taking the survey can understand how people feel in a space. I worked on this project for 6 months while I was working at the architecture firm, Kieran Timberlake.", stack: roast_stack, media: m[5], type: 'Web App', url: '' },
    { title: 'Contrast', title_image: './portfolio/contrast_6.png', desc: "Contrast in color theory is when two colors are starkly different from each other. In this game your objective is to select the most contrasting circle with the background color. This is created in Java Swing with a game engine hand coded by me using the Buffered Image class. This game engine includes a Frame Buffer, Input Manager, and Animation Loop.", stack: contrast_stack, media: m[1], type: 'Java Game', url: 'https://drive.google.com/open?id=1Gy0Oshu941-MPfhutWlO63F92IVux9fM' },
    // { title: 'Portfolio', title_image: './portfolio/port_1.png', desc: "From concept to design to development I put a lot of love into this. As a personal challenge I created this website entirely in Typescript with no jQuery. All in all I can conclude that jQuery is overrated! Java Script is powerful enough on its own.", stack: port_stack, media: m[7], type: 'Website', url: 'https://github.com/mattwagar/Websites/tree/master/portfolio_website_v2' },
    { title: 'Breathless', title_image: './portfolio/breathless.jpg', desc: "The Space Pirate, Aria, is on a mission to loot a mineral cargo ship. However, upon landing on the cargo ship, Aria's helmet cracks causing her to slowly lose oxygen. It's now a race against time to collect all the gems before her oxygen runs out!", stack: breathless_stack, media: m[2], type: 'HTML5 Game', url: '/breathless' }
]);
// { title: 'Mean Forecast', title_image: './portfolio/mean_forecast_1.jpg', desc: 'A small web app that calculates the average of 3 weather API\'s: Wunderground, Forecast.io, and World Weather Online. This data is then served onto a D3.js Line Chart for temperature, humidty, and windspeed. Also the webapp itself has many subtleties that are affected by weather data. For example, the video  resembles the current weather. Also each graph is color coated by a gradient based on the weather data.', stack: weather_stack, media: m[4], type: 'Website', url: '/meanforecast' },
// { title: 'Q*Bert', title_image: "./portfolio/qbert_play.jpg", desc: 'This is my Bouncing Ball Assignment for Animation 1 at Drexel University. When picking a game that mixes my love of retro video games and bouncing balls, Q*Bert was a no-brainer. Everything is originally modelled, textured, and animated. Made in Maya, and rendered in V-Ray.', stack: qbert_stack, media: m[2], type: 'Animation', url: 'https://vimeo.com/198149795' },
// { title: 'Bedroom', title_image: './portfolio/cgi_final_1.png', desc: 'This is my final for CGI 2 at Drexel University. The assignment was to recreate any type of room, so I chose a little boy\'s room. We were tasked with creating at least one complex object, so I decided to go with a train set.', stack: qbert_stack, media: m[3], type: '3D Render', url: '' }]);
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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(require("./media"));
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
exports.__esModule = true;
__export(require("./skill_badge"));
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
            vm.skills.push(new Skill(images[i].name, images[i]["class"], vm.path + images[i].image, vm.flex_grid_id, blacktext));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvanVtcC5qcy9kaXN0L2p1bXAuanMiLCJzcmMvaW1hZ2VfY2FudmFzLnRzIiwic3JjL21haW4udHMiLCJzcmMvbWVkaWEudHMiLCJzcmMvc2tpbGxfYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN4QyxDQUFDO0lBQ0gsQ0FBQztJQUVNLHlCQUFJLEdBQVg7UUFDRSxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDekQsT0FBTyxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDNUIsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUNELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMxQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3hCLENBQUM7SUFDSCxDQUFDO0lBUUgsaUJBQUM7QUFBRCxDQXJEQSxBQXFEQyxJQUFBO0FBckRZLGdDQUFVIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGdsb2JhbC5KdW1wID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4vLyBSb2JlcnQgUGVubmVyJ3MgZWFzZUluT3V0UXVhZFxuXG4vLyBmaW5kIHRoZSByZXN0IG9mIGhpcyBlYXNpbmcgZnVuY3Rpb25zIGhlcmU6IGh0dHA6Ly9yb2JlcnRwZW5uZXIuY29tL2Vhc2luZy9cbi8vIGZpbmQgdGhlbSBleHBvcnRlZCBmb3IgRVM2IGNvbnN1bXB0aW9uIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qYXhnZWxsZXIvZXouanNcblxudmFyIGVhc2VJbk91dFF1YWQgPSBmdW5jdGlvbiBlYXNlSW5PdXRRdWFkKHQsIGIsIGMsIGQpIHtcbiAgdCAvPSBkIC8gMjtcbiAgaWYgKHQgPCAxKSByZXR1cm4gYyAvIDIgKiB0ICogdCArIGI7XG4gIHQtLTtcbiAgcmV0dXJuIC1jIC8gMiAqICh0ICogKHQgLSAyKSAtIDEpICsgYjtcbn07XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqO1xufSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG59O1xuXG52YXIganVtcGVyID0gZnVuY3Rpb24ganVtcGVyKCkge1xuICAvLyBwcml2YXRlIHZhcmlhYmxlIGNhY2hlXG4gIC8vIG5vIHZhcmlhYmxlcyBhcmUgY3JlYXRlZCBkdXJpbmcgYSBqdW1wLCBwcmV2ZW50aW5nIG1lbW9yeSBsZWFrc1xuXG4gIHZhciBlbGVtZW50ID0gdm9pZCAwOyAvLyBlbGVtZW50IHRvIHNjcm9sbCB0byAgICAgICAgICAgICAgICAgICAobm9kZSlcblxuICB2YXIgc3RhcnQgPSB2b2lkIDA7IC8vIHdoZXJlIHNjcm9sbCBzdGFydHMgICAgICAgICAgICAgICAgICAgIChweClcbiAgdmFyIHN0b3AgPSB2b2lkIDA7IC8vIHdoZXJlIHNjcm9sbCBzdG9wcyAgICAgICAgICAgICAgICAgICAgIChweClcblxuICB2YXIgb2Zmc2V0ID0gdm9pZCAwOyAvLyBhZGp1c3RtZW50IGZyb20gdGhlIHN0b3AgcG9zaXRpb24gICAgICAocHgpXG4gIHZhciBlYXNpbmcgPSB2b2lkIDA7IC8vIGVhc2luZyBmdW5jdGlvbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbilcbiAgdmFyIGExMXkgPSB2b2lkIDA7IC8vIGFjY2Vzc2liaWxpdHkgc3VwcG9ydCBmbGFnICAgICAgICAgICAgIChib29sZWFuKVxuXG4gIHZhciBkaXN0YW5jZSA9IHZvaWQgMDsgLy8gZGlzdGFuY2Ugb2Ygc2Nyb2xsICAgICAgICAgICAgICAgICAgICAgKHB4KVxuICB2YXIgZHVyYXRpb24gPSB2b2lkIDA7IC8vIHNjcm9sbCBkdXJhdGlvbiAgICAgICAgICAgICAgICAgICAgICAgIChtcylcblxuICB2YXIgdGltZVN0YXJ0ID0gdm9pZCAwOyAvLyB0aW1lIHNjcm9sbCBzdGFydGVkICAgICAgICAgICAgICAgICAgICAobXMpXG4gIHZhciB0aW1lRWxhcHNlZCA9IHZvaWQgMDsgLy8gdGltZSBzcGVudCBzY3JvbGxpbmcgdGh1cyBmYXIgICAgICAgICAgKG1zKVxuXG4gIHZhciBuZXh0ID0gdm9pZCAwOyAvLyBuZXh0IHNjcm9sbCBwb3NpdGlvbiAgICAgICAgICAgICAgICAgICAocHgpXG5cbiAgdmFyIGNhbGxiYWNrID0gdm9pZCAwOyAvLyB0byBjYWxsIHdoZW4gZG9uZSBzY3JvbGxpbmcgICAgICAgICAgICAoZnVuY3Rpb24pXG5cbiAgLy8gc2Nyb2xsIHBvc2l0aW9uIGhlbHBlclxuXG4gIGZ1bmN0aW9uIGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB3aW5kb3cuc2Nyb2xsWSB8fCB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gIH1cblxuICAvLyBlbGVtZW50IG9mZnNldCBoZWxwZXJcblxuICBmdW5jdGlvbiB0b3AoZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHN0YXJ0O1xuICB9XG5cbiAgLy8gckFGIGxvb3AgaGVscGVyXG5cbiAgZnVuY3Rpb24gbG9vcCh0aW1lQ3VycmVudCkge1xuICAgIC8vIHN0b3JlIHRpbWUgc2Nyb2xsIHN0YXJ0ZWQsIGlmIG5vdCBzdGFydGVkIGFscmVhZHlcbiAgICBpZiAoIXRpbWVTdGFydCkge1xuICAgICAgdGltZVN0YXJ0ID0gdGltZUN1cnJlbnQ7XG4gICAgfVxuXG4gICAgLy8gZGV0ZXJtaW5lIHRpbWUgc3BlbnQgc2Nyb2xsaW5nIHNvIGZhclxuICAgIHRpbWVFbGFwc2VkID0gdGltZUN1cnJlbnQgLSB0aW1lU3RhcnQ7XG5cbiAgICAvLyBjYWxjdWxhdGUgbmV4dCBzY3JvbGwgcG9zaXRpb25cbiAgICBuZXh0ID0gZWFzaW5nKHRpbWVFbGFwc2VkLCBzdGFydCwgZGlzdGFuY2UsIGR1cmF0aW9uKTtcblxuICAgIC8vIHNjcm9sbCB0byBpdFxuICAgIHdpbmRvdy5zY3JvbGxUbygwLCBuZXh0KTtcblxuICAgIC8vIGNoZWNrIHByb2dyZXNzXG4gICAgdGltZUVsYXBzZWQgPCBkdXJhdGlvbiA/IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCkgLy8gY29udGludWUgc2Nyb2xsIGxvb3BcbiAgICA6IGRvbmUoKTsgLy8gc2Nyb2xsaW5nIGlzIGRvbmVcbiAgfVxuXG4gIC8vIHNjcm9sbCBmaW5pc2hlZCBoZWxwZXJcblxuICBmdW5jdGlvbiBkb25lKCkge1xuICAgIC8vIGFjY291bnQgZm9yIHJBRiB0aW1lIHJvdW5kaW5nIGluYWNjdXJhY2llc1xuICAgIHdpbmRvdy5zY3JvbGxUbygwLCBzdGFydCArIGRpc3RhbmNlKTtcblxuICAgIC8vIGlmIHNjcm9sbGluZyB0byBhbiBlbGVtZW50LCBhbmQgYWNjZXNzaWJpbGl0eSBpcyBlbmFibGVkXG4gICAgaWYgKGVsZW1lbnQgJiYgYTExeSkge1xuICAgICAgLy8gYWRkIHRhYmluZGV4IGluZGljYXRpbmcgcHJvZ3JhbW1hdGljIGZvY3VzXG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcblxuICAgICAgLy8gZm9jdXMgdGhlIGVsZW1lbnRcbiAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICAvLyBpZiBpdCBleGlzdHMsIGZpcmUgdGhlIGNhbGxiYWNrXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG5cbiAgICAvLyByZXNldCB0aW1lIGZvciBuZXh0IGp1bXBcbiAgICB0aW1lU3RhcnQgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIEFQSVxuXG4gIGZ1bmN0aW9uIGp1bXAodGFyZ2V0KSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgLy8gcmVzb2x2ZSBvcHRpb25zLCBvciB1c2UgZGVmYXVsdHNcbiAgICBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb24gfHwgMTAwMDtcbiAgICBvZmZzZXQgPSBvcHRpb25zLm9mZnNldCB8fCAwO1xuICAgIGNhbGxiYWNrID0gb3B0aW9ucy5jYWxsYmFjazsgLy8gXCJ1bmRlZmluZWRcIiBpcyBhIHN1aXRhYmxlIGRlZmF1bHQsIGFuZCB3b24ndCBiZSBjYWxsZWRcbiAgICBlYXNpbmcgPSBvcHRpb25zLmVhc2luZyB8fCBlYXNlSW5PdXRRdWFkO1xuICAgIGExMXkgPSBvcHRpb25zLmExMXkgfHwgZmFsc2U7XG5cbiAgICAvLyBjYWNoZSBzdGFydGluZyBwb3NpdGlvblxuICAgIHN0YXJ0ID0gbG9jYXRpb24oKTtcblxuICAgIC8vIHJlc29sdmUgdGFyZ2V0XG4gICAgc3dpdGNoICh0eXBlb2YgdGFyZ2V0ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZih0YXJnZXQpKSB7XG4gICAgICAvLyBzY3JvbGwgZnJvbSBjdXJyZW50IHBvc2l0aW9uXG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBlbGVtZW50ID0gdW5kZWZpbmVkOyAvLyBubyBlbGVtZW50IHRvIHNjcm9sbCB0b1xuICAgICAgICBhMTF5ID0gZmFsc2U7IC8vIG1ha2Ugc3VyZSBhY2Nlc3NpYmlsaXR5IGlzIG9mZlxuICAgICAgICBzdG9wID0gc3RhcnQgKyB0YXJnZXQ7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBzY3JvbGwgdG8gZWxlbWVudCAobm9kZSlcbiAgICAgIC8vIGJvdW5kaW5nIHJlY3QgaXMgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBlbGVtZW50ID0gdGFyZ2V0O1xuICAgICAgICBzdG9wID0gdG9wKGVsZW1lbnQpO1xuICAgICAgICBicmVhaztcblxuICAgICAgLy8gc2Nyb2xsIHRvIGVsZW1lbnQgKHNlbGVjdG9yKVxuICAgICAgLy8gYm91bmRpbmcgcmVjdCBpcyByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnRcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG4gICAgICAgIHN0b3AgPSB0b3AoZWxlbWVudCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIHJlc29sdmUgc2Nyb2xsIGRpc3RhbmNlLCBhY2NvdW50aW5nIGZvciBvZmZzZXRcbiAgICBkaXN0YW5jZSA9IHN0b3AgLSBzdGFydCArIG9mZnNldDtcblxuICAgIC8vIHJlc29sdmUgZHVyYXRpb25cbiAgICBzd2l0Y2ggKF90eXBlb2Yob3B0aW9ucy5kdXJhdGlvbikpIHtcbiAgICAgIC8vIG51bWJlciBpbiBtc1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uO1xuICAgICAgICBicmVhaztcblxuICAgICAgLy8gZnVuY3Rpb24gcGFzc2VkIHRoZSBkaXN0YW5jZSBvZiB0aGUgc2Nyb2xsXG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbihkaXN0YW5jZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIHN0YXJ0IHRoZSBsb29wXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgfVxuXG4gIC8vIGV4cG9zZSBvbmx5IHRoZSBqdW1wIG1ldGhvZFxuICByZXR1cm4ganVtcDtcbn07XG5cbi8vIGV4cG9ydCBzaW5nbGV0b25cblxudmFyIHNpbmdsZXRvbiA9IGp1bXBlcigpO1xuXG5yZXR1cm4gc2luZ2xldG9uO1xuXG59KSkpO1xuIiwiXHJcbmV4cG9ydCAqIGZyb20gXCIuL2ltYWdlX2NhbnZhc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsZXJwKGZyb206IG51bWJlciwgdG86IG51bWJlciwgcGVyY2VudDogbnVtYmVyKSB7XHJcbiAgdmFyIGRpZmZlcmFuY2UgPSB0byAtIGZyb207XHJcbiAgcmV0dXJuIGZyb20gKyAoZGlmZmVyYW5jZSAqIHBlcmNlbnQpO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEltZyB7XHJcbiAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICBpbWFnZTogSFRNTEltYWdlRWxlbWVudFxyXG4gIHc6IG51bWJlcjtcclxuICBoOiBudW1iZXI7XHJcbiAgeF9vZmZzZXRfZGVzdDogbnVtYmVyO1xyXG4gIHlfb2Zmc2V0X2Rlc3Q6IG51bWJlcjtcclxuICB4X29mZnNldDogbnVtYmVyO1xyXG4gIHlfb2Zmc2V0OiBudW1iZXI7XHJcbiAgYW5jaG9yWDogbnVtYmVyO1xyXG4gIGFuY2hvclk6IG51bWJlcjtcclxuXHJcbiAgaW1nV2lkdGg6IG51bWJlcjtcclxuICBzY3JlZW5XaWR0aDogbnVtYmVyO1xyXG4gIHNjYWxlWDogbnVtYmVyO1xyXG4gIHNjYWxlWTogbnVtYmVyO1xyXG4gIHNjYWxlOiBudW1iZXI7XHJcbiAgaW1nSGVpZ2h0OiBudW1iZXI7XHJcbiAgc2NyZWVuSGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gIGxvYWRlZDogYm9vbGVhbjtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2bS5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIHZtLmN0eCA9IHZtLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgdm0udyA9IHZtLmNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgdm0uaCA9IHZtLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB2bS5pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgdm0uaW1hZ2Uuc3JjID0gJ3Blcmxpbl9iYWNrZ3JvdW5kLnBuZyc7XHJcbiAgICB2bS5sb2FkZWQgPSBmYWxzZTtcclxuXHJcbiAgICB2bS5pbWFnZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZtLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgIHZtLnNpemUodm0udywgdm0uaCk7XHJcbiAgICAgIHZtLmRyYXcoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBzaXplKHcsIGgpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICB2bS53ID0gdm0uY2FudmFzLndpZHRoID0gdztcclxuICAgIHZtLmggPSB2bS5jYW52YXMuaGVpZ2h0ID0gaDtcclxuXHJcbiAgICAvKmdldHMgc2NhbGVYIGJhc2VkIG9uIHNjcmVlbiBhbmQgaW1hZ2Ugd2lkdGggKi9cclxuICAgIHZtLmltZ1dpZHRoID0gdm0uaW1hZ2UubmF0dXJhbFdpZHRoO1xyXG4gICAgdm0uc2NyZWVuV2lkdGggPSB3O1xyXG4gICAgdm0uc2NhbGVYID0gdm0uc2NyZWVuV2lkdGggLyB2bS5pbWdXaWR0aDtcclxuXHJcbiAgICAvKmdldHMgc2NhbGVZIGJhc2VkIG9uIHNjcmVlbiBhbmQgaW1hZ2Ugd2lkdGggKi9cclxuICAgIHZtLmltZ0hlaWdodCA9IHZtLmltYWdlLm5hdHVyYWxIZWlnaHQ7XHJcbiAgICB2bS5zY3JlZW5IZWlnaHQgPSBoO1xyXG4gICAgdm0uc2NhbGVZID0gdm0uc2NyZWVuSGVpZ2h0IC8gdm0uaW1nSGVpZ2h0O1xyXG5cclxuXHJcbiAgICAvKnNldHMgYmFzaWMgc2NhbGUgdG8gWCAqL1xyXG5cclxuICAgIHZtLnNjYWxlID0gdm0uc2NhbGVYXHJcbiAgICBpZiAodm0uc2NhbGVYIDwgdm0uc2NhbGVZKSB7XHJcbiAgICAgIHZtLnNjYWxlID0gdm0uc2NhbGVZO1xyXG4gICAgfVxyXG5cclxuICAgIHZtLmltZ1dpZHRoICo9IHZtLnNjYWxlICogMS4xO1xyXG4gICAgdm0uaW1nSGVpZ2h0ICo9IHZtLnNjYWxlICogMS4wMTtcclxuXHJcbiAgICB2bS5hbmNob3JYID0gKHZtLmltZ1dpZHRoIC0gdm0uc2NyZWVuV2lkdGgpO1xyXG4gICAgdm0uYW5jaG9yWSA9ICh2bS5pbWdIZWlnaHQgLSB2bS5zY3JlZW5IZWlnaHQpO1xyXG5cclxuICAgIHZtLnhfb2Zmc2V0X2Rlc3QgPSB2bS54X29mZnNldCA9IHZtLmFuY2hvclg7XHJcbiAgICB2bS55X29mZnNldF9kZXN0ID0gdm0ueV9vZmZzZXQgPSB2bS5hbmNob3JZO1xyXG5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3KCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgLy8gdm0uY3R4LmNsZWFyUmVjdCgwLDAsdm0udywgdm0uaCk7XHJcblxyXG4gICAgdm0uY3R4LmRyYXdJbWFnZSh2bS5pbWFnZSwgdm0ueF9vZmZzZXQsIHZtLnlfb2Zmc2V0LCB2bS5pbWFnZS5uYXR1cmFsV2lkdGgsIHZtLmltYWdlLm5hdHVyYWxIZWlnaHQsIDAsIDAsIHZtLmltZ1dpZHRoLCB2bS5pbWdIZWlnaHQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFwcCB7XHJcbiAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICB3OiBudW1iZXI7XHJcbiAgaDogbnVtYmVyO1xyXG4gIC8vIHJlY3Q6IFJlY3RhbmdsZVxyXG4gIGltZzogSW1nO1xyXG5cclxuICBtb3VzZUluOiBib29sZWFuO1xyXG4gIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xyXG5cclxuICAgIHZhciBpc01vYmlsZSA9IGZhbHNlOyAvL2luaXRpYXRlIGFzIGZhbHNlXHJcbiAgICAvLyBkZXZpY2UgZGV0ZWN0aW9uXHJcbiAgICBpZiAoLyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlwYWR8aXJpc3xraW5kbGV8QW5kcm9pZHxTaWxrfGxnZSB8bWFlbW98bWlkcHxtbXB8bmV0ZnJvbnR8b3BlcmEgbShvYnxpbilpfHBhbG0oIG9zKT98cGhvbmV8cChpeGl8cmUpXFwvfHBsdWNrZXJ8cG9ja2V0fHBzcHxzZXJpZXMoNHw2KTB8c3ltYmlhbnx0cmVvfHVwXFwuKGJyb3dzZXJ8bGluayl8dm9kYWZvbmV8d2FwfHdpbmRvd3MgKGNlfHBob25lKXx4ZGF8eGlpbm8vaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpIHx8IC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudC5zdWJzdHIoMCwgNCkpKSBpc01vYmlsZSA9IHRydWU7XHJcblxyXG4gICAgaWYgKGlzTW9iaWxlKSB7XHJcbiAgICAgIHZhciBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgICBpbWFnZS5zcmMgPSAncGVybGluX2JhY2tncm91bmQucG5nJztcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMtY29udGFpbmVyJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2VsY29tZS1wYWdlJykuaW5zZXJ0QmVmb3JlKGltYWdlLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzLXRleHQtb3ZlcmxheScpKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcblxyXG5cclxuXHJcbiAgICAgIHZtLmNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XHJcbiAgICAgIHZtLmN0eCA9IHZtLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuXHJcblxyXG4gICAgICB2bS5zaXplQ2FudmFzKCk7XHJcbiAgICAgIC8vIHZtLmluaXRFdmVudHMoKTtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodCkgPT4geyB2bS5kcmF3KHQpOyB9KTtcclxuXHJcbiAgICAgIHZtLmltZyA9IG5ldyBJbWcodm0udywgdm0uaCk7XHJcblxyXG4gICAgICB2bS5tb3VzZUluID0gZmFsc2U7XHJcblxyXG4gICAgICB2bS5jb250YWluZXIgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcy1jb250YWluZXInKTtcclxuXHJcbiAgICAgIHZtLmNvbnRhaW5lci5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdm0uZHJhd0ltZ0luKDAsIGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2bS5jb250YWluZXIub25tb3VzZWVudGVyID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2bS5tb3VzZUluID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdm0uY29udGFpbmVyLm9ubW91c2VvdXQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZtLm1vdXNlSW4gPSBmYWxzZTtcclxuICAgICAgICB2bS5kcmF3SW1nT3V0KDAsIGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2l6ZUNhbnZhcygpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZtLmNhbnZhcy5zdHlsZS53aWR0aCA9ICcxMDAlJztcclxuICAgIHZtLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XHJcbiAgICB0aGlzLncgPSB0aGlzLmNhbnZhcy53aWR0aCA9IHZtLmNhbnZhcy5vZmZzZXRXaWR0aDtcclxuICAgIHRoaXMuaCA9IHRoaXMuY2FudmFzLmhlaWdodCA9IHZtLmNhbnZhcy5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgaWYgKHZtLmltZykge1xyXG4gICAgICB2bS5pbWcuc2l6ZSh2bS53LCB2bS5oKTtcclxuICAgICAgdm0uaW1nLmRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG4gIHB1YmxpYyBkcmF3KHQ6IGFueSkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodCkgPT4geyB0aGlzLmRyYXcodCk7IH0pO1xyXG4gICAgdm0uY3R4LmNsZWFyUmVjdCgwLCAwLCB2bS53LCB2bS5oKTtcclxuXHJcbiAgICB2bS5jdHguZHJhd0ltYWdlKHZtLmltZy5jYW52YXMsIDAsIDApO1xyXG4gICAgdm0uaW1nLmRyYXcoKTtcclxuXHJcblxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdJbWdJbih0OiBhbnksIGU6IGFueSkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuXHJcbiAgICAvKnJhdGlvID0gKGltZ1dpZHRoIC8gc2NyZWVuV2lkdGgpICAqL1xyXG5cclxuICAgIHZhciBtb3ZlUmF0aW9YID0gKGUuY2xpZW50WCAvIHZtLmltZy5zY3JlZW5XaWR0aCk7IC8vcmFuZ2UgZnJvbSBbMCwgMV06IDAgYmVpbmcgbGVmdCwgMSBiZWluZyByaWdodFxyXG4gICAgdmFyIG1vdmVPZmZzZXRYID0gLXZtLmltZy5hbmNob3JYICsgKG1vdmVSYXRpb1ggKiB2bS5pbWcuYW5jaG9yWCk7XHJcblxyXG4gICAgdmFyIG1vdmVSYXRpb1kgPSAoZS5jbGllbnRZIC8gdm0uaW1nLnNjcmVlbkhlaWdodCk7IC8vcmFuZ2UgZnJvbSBbMCwgMV06IDAgYmVpbmcgbGVmdCwgMSBiZWluZyByaWdodFxyXG4gICAgdmFyIG1vdmVPZmZzZXRZID0gLXZtLmltZy5hbmNob3JZICsgKG1vdmVSYXRpb1kgKiB2bS5pbWcuYW5jaG9yWSk7XHJcblxyXG5cclxuICAgIC8qb2Zmc2V0ID0gbWlkZGxlX2FuY2hvciArIGRyYWdnZWRfb2Zmc2V0Ki9cclxuICAgIHZtLmltZy54X29mZnNldF9kZXN0ID0gdm0uaW1nLmFuY2hvclggKyBtb3ZlT2Zmc2V0WDtcclxuICAgIHZtLmltZy55X29mZnNldF9kZXN0ID0gdm0uaW1nLmFuY2hvclkgKyBtb3ZlT2Zmc2V0WTtcclxuXHJcbiAgICBpZiAodm0ubW91c2VJbiA9PT0gdHJ1ZSAmJiBNYXRoLnJvdW5kKHZtLmltZy55X29mZnNldCkgIT09IE1hdGgucm91bmQodm0uaW1nLnlfb2Zmc2V0X2Rlc3QpICYmIE1hdGgucm91bmQodm0uaW1nLnhfb2Zmc2V0KSAhPT0gTWF0aC5yb3VuZCh2bS5pbWcueF9vZmZzZXRfZGVzdCkpIHtcclxuXHJcblxyXG4gICAgICB2bS5pbWcueF9vZmZzZXQgPSBNYXRoLnJvdW5kKGxlcnAodm0uaW1nLnhfb2Zmc2V0LCB2bS5pbWcueF9vZmZzZXRfZGVzdCwgMC4xKSk7XHJcbiAgICAgIHZtLmltZy55X29mZnNldCA9IE1hdGgucm91bmQobGVycCh2bS5pbWcueV9vZmZzZXQsIHZtLmltZy55X29mZnNldF9kZXN0LCAwLjEpKTtcclxuXHJcbiAgICAgIC8vIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHQpID0+IHsgdm0uZHJhd0ltZ0luKHQsIGUpIH0pO1xyXG5cclxuXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd0ltZ091dCh0OiBhbnksIGU6IGFueSkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgIC8qcmF0aW8gPSAoaW1nV2lkdGggLyBzY3JlZW5XaWR0aCkgICovXHJcblxyXG4gICAgLy8gdmFyIG1vdmVSYXRpb1ggPSAoZS5jbGllbnRYIC8gdm0uaW1nLnNjcmVlbldpZHRoKTsgLy9yYW5nZSBmcm9tIFswLCAxXTogMCBiZWluZyBsZWZ0LCAxIGJlaW5nIHJpZ2h0XHJcbiAgICAvLyB2YXIgbW92ZU9mZnNldFggPSAtdm0uaW1nLmFuY2hvclggKyAobW92ZVJhdGlvWCAqIHZtLmltZy5hbmNob3JYICogMik7XHJcblxyXG4gICAgLy8gdmFyIG1vdmVSYXRpb1kgPSAoZS5jbGllbnRZIC8gdm0uaW1nLnNjcmVlbkhlaWdodCkgKiAyOyAvL3JhbmdlIGZyb20gWzAsIDFdOiAwIGJlaW5nIGxlZnQsIDEgYmVpbmcgcmlnaHRcclxuICAgIC8vIHZhciBtb3ZlT2Zmc2V0WSA9IC12bS5pbWcuYW5jaG9yWSArIChtb3ZlUmF0aW9ZICogdm0uaW1nLmFuY2hvclkpO1xyXG5cclxuXHJcbiAgICAvKm9mZnNldCA9IG1pZGRsZV9hbmNob3IgKyBkcmFnZ2VkX29mZnNldCovXHJcbiAgICB2bS5pbWcueF9vZmZzZXRfZGVzdCA9IHZtLmltZy5hbmNob3JYO1xyXG4gICAgdm0uaW1nLnlfb2Zmc2V0X2Rlc3QgPSB2bS5pbWcuYW5jaG9yWTtcclxuXHJcbiAgICBpZiAodm0ubW91c2VJbiA9PT0gZmFsc2UgJiYgTWF0aC5yb3VuZCh2bS5pbWcueV9vZmZzZXQpICE9PSBNYXRoLnJvdW5kKHZtLmltZy55X29mZnNldF9kZXN0KSAmJiBNYXRoLnJvdW5kKHZtLmltZy54X29mZnNldCkgIT09IE1hdGgucm91bmQodm0uaW1nLnhfb2Zmc2V0X2Rlc3QpKSB7XHJcblxyXG5cclxuICAgICAgdm0uaW1nLnhfb2Zmc2V0ID0gbGVycCh2bS5pbWcueF9vZmZzZXQsIHZtLmltZy54X29mZnNldF9kZXN0LCAwLjEpO1xyXG4gICAgICB2bS5pbWcueV9vZmZzZXQgPSBsZXJwKHZtLmltZy55X29mZnNldCwgdm0uaW1nLnlfb2Zmc2V0X2Rlc3QsIDAuMSk7XHJcblxyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0KSA9PiB7IHZtLmRyYXdJbWdPdXQodCwgZSkgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIC8vIGluaXRFdmVudHMoKSB7XHJcbiAgLy8gICB3aW5kb3cub25yZXNpemUgPSAoZSkgPT4ge1xyXG4gIC8vICAgICB0aGlzLnNpemVDYW52YXMoKTtcclxuICAvLyAgIH07XHJcbiAgLy8gfVxyXG5cclxufSIsImltcG9ydCAqIGFzIGp1bXAgZnJvbSBcImp1bXAuanNcIjtcclxuXHJcbmltcG9ydCAqIGFzIGltYWdlX2NhbnZhcyBmcm9tIFwiLi9pbWFnZV9jYW52YXNcIjtcclxuXHJcbmltcG9ydCAqIGFzIHNraWxsX2JhZGdlIGZyb20gXCIuL3NraWxsX2JhZGdlXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBtZWRpYSBmcm9tIFwiLi9tZWRpYVwiO1xyXG5cclxuLy95b29cclxuY29uc3QgdGltZW91dDogbnVtYmVyID0gMTAwMDtcclxuXHJcbnZhciBmcm9udGVuZCA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnZmxleC1ncmlkMScsIFtcclxueyBcIm5hbWVcIjogJ0MjJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2NzaGFycC5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdKYXZhIFNjcmlwdCcsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdqYXZhc2NyaXB0LTIuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnSFRNTDUnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnaHRtbDUuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnQ1NTMycsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdjc3MtMy5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdDKysnLCBcImNsYXNzXCI6ICdjaXJjbGUtNzUnLCBcImltYWdlXCI6ICdjLXNlZWtsb2dvLmNvbS5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdKYXZhJywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAnamF2YS0xNC5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdQeXRob24nLCBcImNsYXNzXCI6ICdjaXJjbGUtNTAnLCBcImltYWdlXCI6ICdweXRob24tNS5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdOb2RlIEpTJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAnbm9kZWpzLWljb24uc3ZnJyB9LFxyXG4vLyB7IFwibmFtZVwiOiAnalF1ZXJ5JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2pxdWVyeS0xLnN2ZycgfSxcclxuLy8geyBcIm5hbWVcIjogJ0VtYmVyIEpTJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2VtYmVyLnN2ZycgfSxcclxuLy8geyBcIm5hbWVcIjogJ0FuZ3VsYXIgSlMnLCBcImNsYXNzXCI6ICdjaXJjbGUtNzUnLCBcImltYWdlXCI6ICdhbmd1bGFyLWljb24uc3ZnJyB9LFxyXG4vLyB7IFwibmFtZVwiOiAnVHlwZSBTY3JpcHQnLCBcImNsYXNzXCI6ICdjaXJjbGUtNzUnLCBcImltYWdlXCI6ICd0eXBlc2NyaXB0LnN2ZycgfSxcclxuLy8geyBcIm5hbWVcIjogJ0QzLmpzJywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAnZDMtMi5zdmcnIH0sXHJcbi8vIHsgXCJuYW1lXCI6ICdTQ1NTJywgXCJjbGFzc1wiOiAnY2lyY2xlLTUwJywgXCJpbWFnZVwiOiAnc2Fzcy0xLnN2ZycgfSxcclxuLy8geyBcIm5hbWVcIjogJ1JlYWN0IEpTJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAncmVhY3Quc3ZnJyB9XHJcbl0sIGZhbHNlLCAnZnJvbnRlbmQnKTtcclxudmFyIHNvZnRlbmcgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJ2ZsZXgtZ3JpZDInLCBbXHJcbiAgICB7IFwibmFtZVwiOiAnVW5pdHknLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAndW5pdHkuc3ZnJyB9LFxyXG4gICAgeyBcIm5hbWVcIjogJ1Z1Zm9yaWEnLCBcImNsYXNzXCI6ICdjaXJjbGUtNzUnLCBcImltYWdlXCI6ICd2dWZvcmlhLWxvZ28ucG5nJyB9LFxyXG4gICAgeyBcIm5hbWVcIjogJ09jdWx1cyBWUicsIFwiY2xhc3NcIjogJ2NpcmNsZS03NScsIFwiaW1hZ2VcIjogJ29jdWx1cy5wbmcnIH0sXHJcbiAgICB7IFwibmFtZVwiOiAnTGVhcCBNb3Rpb24nLCBcImNsYXNzXCI6ICdjaXJjbGUtNzUnLCBcImltYWdlXCI6ICdsZWFwLnBuZycgfSxcclxuICAgIHsgXCJuYW1lXCI6ICdPcGVuIEdMJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAnb3BlbmdsMi5zdmcnIH0sXHJcbiAgICAvLyB7IFwibmFtZVwiOiAnQW5kcm9pZCBTdHVkaW8nLCBcImNsYXNzXCI6ICdjaXJjbGUtMjUnLCBcImltYWdlXCI6ICdBbmRyb2lkX3N0dWRpby5zdmcnIH1cclxuXSwgZmFsc2UsICdzb2Z0ZW5nJyk7XHJcbnZhciBkZXNpZ24gPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJ2ZsZXgtZ3JpZDMnLCBbXHJcbnsgXCJuYW1lXCI6ICdJbGx1c3RyYXRvcicsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdhZG9iZS1pbGx1c3RyYXRvci1jYy5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdNYXlhJywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAnbWF5YS5wbmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdIb3VkaW5pJywgXCJjbGFzc1wiOiAnY2lyY2xlLTUwJywgXCJpbWFnZVwiOiAnaG91ZGluaS5wbmcnfSxcclxueyBcIm5hbWVcIjogJ0FmdGVyIEVmZmVjdHMnLCBcImNsYXNzXCI6ICdjaXJjbGUtNTAnLCBcImltYWdlXCI6ICdhZnRlci1lZmZlY3RzLWNjLnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ01vdGlvbiBCdWlsZGVyJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAnbW9idS5wbmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdWaWNvbiBCbGFkZScsIFwiY2xhc3NcIjogJ2NpcmNsZS0yNScsIFwiaW1hZ2VcIjogJ3ZpY29uLnBuZycgfSxcclxueyBcIm5hbWVcIjogJ1Bob3Rvc2hvcCcsIFwiY2xhc3NcIjogJ2NpcmNsZS0yNScsIFwiaW1hZ2VcIjogJ3Bob3Rvc2hvcC1jYy5zdmcnIH0sXHJcblxyXG4vLyB7IFwibmFtZVwiOiAnTXVkYm94JywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAnbXVkYm94LnBuZycgfVxyXG5dLCBmYWxzZSwgJ2Rlc2lnbicpO1xyXG5mcm9udGVuZC5sb2FkKCk7XHJcbnNvZnRlbmcubG9hZCgpO1xyXG5kZXNpZ24ubG9hZCgpO1xyXG5cclxuXHJcbnZhciBhcHA7XHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGFwcCA9IG5ldyBpbWFnZV9jYW52YXMuQXBwKCk7XHJcbn0pO1xyXG5cclxuXHJcbi8vIHdpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uKCl7XHJcbi8vICAgICBjb25zb2xlLmxvZyh3aW5kb3cuc2Nyb2xsWSk7XHJcbi8vIH1cclxuXHJcblxyXG4vLyB2YXIgdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid3JhcHBlci0wXCIpO1xyXG4vLyB2YXIgYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwMScpO1xyXG5cclxuXHJcbi8vIGIub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcbi8vICAgICBpZih3LmNsYXNzTGlzdFsxXSA9PT0gXCJvcGVuXCIpe1xyXG4vLyAgICAgICAgIHcuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4vLyAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICB3LmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuLy8gICAgIH1cclxuLy8gfVxyXG5cclxuZXhwb3J0IGNsYXNzIFBvcnRmb2xpb0l0ZW0ge1xyXG4gICAgdGl0bGU6IHN0cmluZztcclxuICAgIHRpdGxlX2ltYWdlOiBzdHJpbmc7XHJcbiAgICBkZXNjOiBzdHJpbmc7XHJcbiAgICBzdGFjazogc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbjtcclxuICAgIHBvcnRfaW1hZ2U6IHN0cmluZztcclxuICAgIHVybDogc3RyaW5nO1xyXG5cclxuICAgIGl0ZW1fbnVtOiBudW1iZXI7XHJcblxyXG4gICAgY29sX3NpemU6IHN0cmluZztcclxuICAgIGNvbDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICB0ZXh0OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHN1Yl90ZXh0OiBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBvcGVuOiBib29sZWFuO1xyXG4gICAgbWVkaWE6IG1lZGlhLk1lZGlhO1xyXG4gICAgdGFyZ2V0X3dyYXBwZXI6IFdyYXBwZXI7XHJcbiAgICBwb3J0Zm9saW86IFBvcnRmb2xpbztcclxuICAgIHJvdzogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBvcnRmb2xpbzogUG9ydGZvbGlvLCBpdGVtX251bTogbnVtYmVyLCB0aXRsZTogc3RyaW5nLCB0aXRsZV9pbWFnZTogc3RyaW5nLCBkZXNjOiBzdHJpbmcsIHN0YWNrOiBza2lsbF9iYWRnZS5Db2xsZWN0aW9uLCBtZWRpYTogbWVkaWEuTWVkaWEsIHR5cGU6IHN0cmluZywgdXJsOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZtLnBvcnRmb2xpbyA9IHBvcnRmb2xpbztcclxuICAgICAgICB2bS5pdGVtX251bSA9IGl0ZW1fbnVtO1xyXG4gICAgICAgIHZtLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgdm0udGl0bGVfaW1hZ2UgPSB0aXRsZV9pbWFnZTtcclxuICAgICAgICB2bS5kZXNjID0gZGVzYztcclxuICAgICAgICB2bS5zdGFjayA9IHN0YWNrO1xyXG4gICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgdm0udXJsID0gdXJsO1xyXG4gICAgICAgIHZtLmNvbF9zaXplID0gXCJjb2wtbWQtM1wiO1xyXG5cclxuXHJcbiAgICAgICAgdm0uY29sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uY29sLmNsYXNzTGlzdC5hZGQodm0uY29sX3NpemUpO1xyXG5cclxuICAgICAgICB2YXIgY2FyZF9zaGFkb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjYXJkX3NoYWRvdy5jbGFzc0xpc3QuYWRkKCdjYXJkLWRyb3BzaGFkb3cnLCAncm93Jyk7XHJcblxyXG4gICAgICAgIHZhciBub3BhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIG5vcGFkLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdub3BhZCcpO1xyXG5cclxuICAgICAgICB2bS5pbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgICAgICB2bS5pbWcuc3JjID0gdm0udGl0bGVfaW1hZ2U7XHJcblxyXG4gICAgICAgIHZhciBjb2wxMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbDEyLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicpO1xyXG5cclxuICAgICAgICB2bS50ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0udGV4dC5jbGFzc0xpc3QuYWRkKCd0ZXh0JywgJ3BhZGRpbmctdG9wJyk7XHJcbiAgICAgICAgdm0udGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aXRsZSkpO1xyXG5cclxuICAgICAgICB2YXIgY29sMTJfMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbDEyXzIuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJyk7XHJcblxyXG4gICAgICAgIHZtLnN1Yl90ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uc3ViX3RleHQuY2xhc3NMaXN0LmFkZCgndGV4dF9saWdodCcpO1xyXG4gICAgICAgIHZtLnN1Yl90ZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHR5cGUpKTtcclxuXHJcbiAgICAgICAgLy8gLmNvbC1tZC0zXHJcbiAgICAgICAgLy8gICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpI3AxXHJcbiAgICAgICAgLy8gICAgICAgLnRleHQgQnJlYXRobGVzczogSFRNTDUgR2FtZVxyXG5cclxuICAgICAgICAvLyAuY29sLW1kLTNcclxuICAgICAgICAvLyAgICAgICAuY2FyZC1kcm9wc2hhZG93LnJvd1xyXG4gICAgICAgIC8vICAgICAgICAgLmNvbC1tZC0xMi5ub3BhZFxyXG4gICAgICAgIC8vICAgICAgICAgICBpbWcoc3JjPVwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIikjcDEuZHJvcHNoYWRvd1xyXG4gICAgICAgIC8vICAgICAgICAgLmNvbC1tZC0xMlxyXG4gICAgICAgIC8vICAgICAgICAgICAudGV4dCBCcmVhdGhsZXNzXHJcbiAgICAgICAgLy8gICAgICAgICAuY29sLW1kLTEyXHJcbiAgICAgICAgLy8gICAgICAgICAgIC50ZXh0X2xpZ2h0IEhUTUw1IEdhbWVcclxuXHJcbiAgICAgICAgdm0uY29sLmFwcGVuZENoaWxkKGNhcmRfc2hhZG93KTtcclxuICAgICAgICBjYXJkX3NoYWRvdy5hcHBlbmRDaGlsZChub3BhZCk7XHJcbiAgICAgICAgbm9wYWQuYXBwZW5kQ2hpbGQodm0uaW1nKTtcclxuICAgICAgICBjYXJkX3NoYWRvdy5hcHBlbmRDaGlsZChjb2wxMik7XHJcbiAgICAgICAgY29sMTIuYXBwZW5kQ2hpbGQodm0udGV4dCk7XHJcbiAgICAgICAgY2FyZF9zaGFkb3cuYXBwZW5kQ2hpbGQoY29sMTJfMik7XHJcbiAgICAgICAgY29sMTJfMi5hcHBlbmRDaGlsZCh2bS5zdWJfdGV4dCk7XHJcblxyXG4gICAgICAgIHZtLm9wZW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdm0uY29sLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vICAgY29uc29sZS4odm0uaXRlbXNbMF0pO1xyXG4gICAgICAgICAgICB2YXIgZGlmZmVyZW50X3dyYXBwZXIgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGRpZmZlcmVudF93cmFwcGVyID0gdm0ucG9ydGZvbGlvLmNsb3NlKHZtLml0ZW1fbnVtKTtcclxuXHJcbiAgICAgICAgICAgIHZtLm9wZW4gPSB2bS50YXJnZXRfd3JhcHBlci50cmFuc2l0aW9uV3JhcHBlcihkaWZmZXJlbnRfd3JhcHBlciwgdm0ub3Blbiwgdm0udGl0bGUsIHZtLmRlc2MsIHZtLnN0YWNrLCB2bS5tZWRpYSwgdm0udXJsKVxyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBqdW1wKCcjd3JhcHBlci0nICsgdm0ucm93LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDEwMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiAtdm0uY29sLmNsaWVudEhlaWdodCAtIDM1XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LCB0aW1lb3V0KTtcclxuXHJcblxyXG4gICAgICAgICAgICAvLyAgIHZtLnNldERhdGEoKTsgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBhcHBlbmQocm93OiBudW1iZXIsIHdyYXBwZXI6IFdyYXBwZXIpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHJvd19lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvd18nICsgcm93KTtcclxuICAgICAgICByb3dfZWxlbWVudC5hcHBlbmRDaGlsZCh2bS5jb2wpO1xyXG4gICAgICAgIHZtLnRhcmdldF93cmFwcGVyID0gd3JhcHBlcjtcclxuICAgICAgICB2bS5zdGFjay5mbGV4X2dyaWRfaWQgPSB3cmFwcGVyLmZsZXhfZ3JpZC5pZDtcclxuICAgICAgICB2bS5tZWRpYS5pZCA9ICdtZWRpYS0nICsgcm93O1xyXG4gICAgICAgIHZtLnJvdyA9IHJvdztcclxuICAgIH1cclxuICAgIHNldENvbChjbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5jb2wuY2xhc3NMaXN0LnJlbW92ZSh2bS5jb2xfc2l6ZSk7XHJcbiAgICAgICAgdm0uY29sX3NpemUgPSBjbGFzc05hbWU7XHJcbiAgICAgICAgdm0uY29sLmNsYXNzTGlzdC5hZGQodm0uY29sX3NpemUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBQb3J0Zm9saW8ge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIGpzb25fb2JqczogSVBvcnRmb2xpb0l0ZW1bXTtcclxuICAgIHBhdGg6IHN0cmluZztcclxuICAgIGl0ZW1zOiBQb3J0Zm9saW9JdGVtW107XHJcbiAgICB3cmFwcGVyczogV3JhcHBlcltdO1xyXG4gICAgZmxleF9ncmlkX2lkOiBzdHJpbmc7XHJcbiAgICBwZXJfcm93OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywganNvbl9vYmpzOiBJUG9ydGZvbGlvSXRlbVtdKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmlkID0gaWQ7XHJcbiAgICAgICAgdm0uanNvbl9vYmpzID0ganNvbl9vYmpzO1xyXG5cclxuXHJcbiAgICAgICAgdm0uaXRlbXMgPSBbXTtcclxuICAgICAgICB2bS53cmFwcGVycyA9IFtdO1xyXG5cclxuICAgICAgICAvL2FkZCB3cmFwcGVycyBiYXNlZCBvbiBhbGwgcG9zc2libGUgYnJlYWtwb2ludCB3aWR0aHMgKGpzb25fb2Jqcy8yKVxyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgTWF0aC5jZWlsKGpzb25fb2Jqcy5sZW5ndGggLyAyKTsgaisrKSB7XHJcbiAgICAgICAgICAgIHZtLndyYXBwZXJzLnB1c2gobmV3IFdyYXBwZXIoaikpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9hZGQgYWxsIGl0ZW1zXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5qc29uX29ianMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdm0uaXRlbXMucHVzaChuZXcgUG9ydGZvbGlvSXRlbSh2bSwgaSwganNvbl9vYmpzW2ldLnRpdGxlLCBqc29uX29ianNbaV0udGl0bGVfaW1hZ2UsIGpzb25fb2Jqc1tpXS5kZXNjLCBqc29uX29ianNbaV0uc3RhY2ssIGpzb25fb2Jqc1tpXS5tZWRpYSwganNvbl9vYmpzW2ldLnR5cGUsIGpzb25fb2Jqc1tpXS51cmwpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZtLmFwcGVuZEFsbCgpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFwcGVuZEFsbCgpIHsgLy9hcHBlbmRzIFBvcnRmb2xpb0l0ZW1zIGJhc2VkIG9uIHNjcmVlbiBzaXplOyBnZXRzIGRpZ2VzdGVkXHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZhciBzY3JlZW5XaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG5cclxuICAgICAgICAvL3JlYXNzaWducyBjb2xzIGJhc2VkIG9uIGJyZWFrcG9pbnRzXHJcbiAgICAgICAgdmFyIGJyZWFrcG9pbnRzID0gW3sgbWluOiAwLCBtYXg6IDc2OCwgY29sX3NpemU6ICdjb2wteHMtNicsIHBlcl9yb3c6IDIgfSwgeyBtaW46IDc2OSwgbWF4OiA5OTIsIGNvbF9zaXplOiAnY29sLXhzLTQnLCBwZXJfcm93OiAzIH0sIHsgbWluOiA5OTMsIG1heDogMTIwMCwgY29sX3NpemU6ICdjb2wteHMtMycsIHBlcl9yb3c6IDQgfSwgeyBtaW46IDEyMDAsIG1heDogOTk5OSwgY29sX3NpemU6ICdjb2wteHMtMycsIHBlcl9yb3c6IDQgfV07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBicmVha3BvaW50cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgLy9pZiBpbiBicmVha3BvaW50IHJhbmdlLCBhbmQgbm90IHNhbWUgYXMgYmVmb3JlXHJcbiAgICAgICAgICAgIGlmICgvKnZtLml0ZW1zWzBdLmNvbF9zaXplICE9PSBicmVha3BvaW50c1tpXS5jb2xfc2l6ZSAmJiAqL3NjcmVlbldpZHRoID4gYnJlYWtwb2ludHNbaV0ubWluICYmIHNjcmVlbldpZHRoIDwgYnJlYWtwb2ludHNbaV0ubWF4KSB7XHJcbiAgICAgICAgICAgICAgICAvL2NsZWFyIGFsbCByb3dzXHJcbiAgICAgICAgICAgICAgICB2bS5wZXJfcm93ID0gYnJlYWtwb2ludHNbaV0ucGVyX3JvdztcclxuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9ydGZvbGlvJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBwYXJlbnQuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYSA9IDE7IGEgPCBpdGVyYXRvcjsgYSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHBhcmVudC5jaGlsZHJlblsxXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy9hZGQgbmV3IHJvd3MgYW5kIHdyYXBwZXJzXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciByID0gMDsgciA8IE1hdGguY2VpbCh2bS5pdGVtcy5sZW5ndGggLyBicmVha3BvaW50c1tpXS5wZXJfcm93KTsgcisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdy5pZCA9ICdyb3dfJyArIHI7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93LmNsYXNzTGlzdC5hZGQoJ3JvdycsICdub21hcicpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgd3JhcHBlciA9IHZtLndyYXBwZXJzW3JdLmh0bWw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChyb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vYWRkIGNvbHMgdG8gbmV3IHJvd3NcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdm0uaXRlbXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5pdGVtc1tqXS5zZXRDb2woYnJlYWtwb2ludHNbaV0uY29sX3NpemUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3dfbnVtID0gTWF0aC5mbG9vcihqIC8gYnJlYWtwb2ludHNbaV0ucGVyX3Jvdyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uaXRlbXNbal0uYXBwZW5kKHJvd19udW0sIHZtLndyYXBwZXJzW3Jvd19udW1dKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvc2UoaXRlbV9udW06IG51bWJlcikgeyAvL2Nsb3NlcyBhbGwgd3JhcHBlcnNcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgLy9jbG9zZXMgYWxsIGl0ZW1zIGluIHRoZSByb3cgb2YgdGhlIGdpdmVuIGl0ZW0uXHJcbiAgICAgICAgdmFyIHJvdyA9IE1hdGguZmxvb3IoaXRlbV9udW0gLyB2bS5wZXJfcm93KTtcclxuXHJcbiAgICAgICAgLy8gZm9yKHZhciBqID0gKHJvdyp2bS5wZXJfcm93KTsgaiA8ICgocm93KnZtLnBlcl9yb3cpK3ZtLnBlcl9yb3cpOyBqKyspe1xyXG4gICAgICAgIC8vICAgICBpZihpdGVtX251bSAhPT0gaiAmJiB2bS5pdGVtc1tqXSl7XHJcbiAgICAgICAgLy8gICAgICAgICB2bS5pdGVtc1tqXS5vcGVuID0gZmFsc2U7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgdmFyIHJldHVybl92YWx1ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZtLml0ZW1zLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtX251bSAhPT0gaiAmJiB2bS5pdGVtc1tqXSkge1xyXG4gICAgICAgICAgICAgICAgdm0uaXRlbXNbal0ub3BlbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIHIgPSAwOyByIDwgdm0ud3JhcHBlcnMubGVuZ3RoOyByKyspIHtcclxuICAgICAgICAgICAgaWYgKHIgIT09IHJvdyAmJiB2bS53cmFwcGVyc1tyXS5odG1sLmNsYXNzTGlzdFsxXSA9PT0gJ29wZW4nKSB7XHJcbiAgICAgICAgICAgICAgICB2bS53cmFwcGVyc1tyXS5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuX3ZhbHVlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0dXJuX3ZhbHVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV3JhcHBlciB7XHJcbiAgICB0aXRsZTogc3RyaW5nO1xyXG4gICAgZGVzYzogc3RyaW5nO1xyXG4gICAgY29sbGVjdGlvbjogc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbjtcclxuICAgIHBvcnRfaW1hZ2U6IHN0cmluZztcclxuICAgIG1lZGlhOiBtZWRpYS5NZWRpYTtcclxuICAgIHVybDogc3RyaW5nO1xyXG5cclxuXHJcbiAgICBodG1sOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHRpdGxlX2VsZW1lbnQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgZGVzY3JpcHRpb246IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgc3RhY2s6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgZmxleF9ncmlkOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGRlbW86IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29sNTogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBkZXNjcmlwdGlvbl90ZXh0OiBUZXh0O1xyXG4gICAgdGl0bGVfZWxlbWVudF90ZXh0OiBUZXh0O1xyXG4gICAgbGluazogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBsaW5rX3RleHQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29sNjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb2w2SG9sZGVyOiBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBjaGFuZ2U6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3Iocm93X251bSkge1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgdm0uY2hhbmdlID0gZmFsc2U7XHJcbiAgICAgICAgLy8gdm0udGl0bGUgPSBwSXRlbS50aXRsZTtcclxuICAgICAgICAvLyB2bS5kZXNjID0gcEl0ZW0uZGVzYztcclxuICAgICAgICAvLyB2bS5zdGFjayA9IHBJdGVtLnN0YWNrO1xyXG4gICAgICAgIC8vIHZtLnBvcnRfaW1hZ2UgPSBwSXRlbS5wb3J0X2ltYWdlO1xyXG4gICAgICAgIHZtLmh0bWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5odG1sLmlkID0gJ3dyYXBwZXItJyArIHJvd19udW07XHJcbiAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QuYWRkKCd3cmFwcGVyJyk7XHJcblxyXG4gICAgICAgIHZhciByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICByb3cuaWQgPSAnY29udGVudCc7XHJcbiAgICAgICAgcm93LmNsYXNzTGlzdC5hZGQoJ3JvdycsICdub21hcicpO1xyXG5cclxuICAgICAgICB2bS50aXRsZV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0udGl0bGVfZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInLCAnZGVzYy10ZXh0MicsICdwYWQtc3BhY2luZycpO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnRfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcclxuICAgICAgICB2bS50aXRsZV9lbGVtZW50LmFwcGVuZENoaWxkKHZtLnRpdGxlX2VsZW1lbnRfdGV4dCk7XHJcblxyXG4gICAgICAgIHZtLmNvbDZIb2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5jb2w2SG9sZGVyLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtNicsICdjb2wtbGctNycsICdyb3cnLCAnbm9tYXInLCAnbm9wYWQnKTtcclxuXHJcbiAgICAgICAgdmFyIHJvd19maWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgcm93X2ZpbGwuY2xhc3NMaXN0LmFkZCgncm93JywgJ2p1c3RpZnktY2VudGVyJywgJ25vbWFyJyk7XHJcblxyXG4gICAgICAgIHZhciBjb2wxMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbDEyLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicpO1xyXG5cclxuICAgICAgICB2bS5jb2w2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uY29sNi5pZCA9ICdtZWRpYS0nICsgcm93X251bTtcclxuICAgICAgICB2bS5jb2w2LmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtNicsICdjb2wtbGctNScpO1xyXG5cclxuICAgICAgICB2YXIgY29sM18yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29sM18yLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtMycsICdub3BhZC1sZWZ0Jyk7XHJcblxyXG4gICAgICAgIHZtLmRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb24uY2xhc3NMaXN0LmFkZCgnaGVhZGVyLXRleHQnLCAncGFkLXNwYWNpbmcnKTtcclxuICAgICAgICB2bS5kZXNjcmlwdGlvbi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnRGVzY3JpcHRpb24nKSk7XHJcblxyXG4gICAgICAgIHZhciBkZXNjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGVzYy5jbGFzc0xpc3QuYWRkKCdkZXNjcmlwdGlvbi10ZXh0JywgJ3BhZC1zcGFjaW5nJyk7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb25fdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcclxuICAgICAgICBkZXNjLmFwcGVuZENoaWxkKHZtLmRlc2NyaXB0aW9uX3RleHQpO1xyXG5cclxuICAgICAgICB2bS5zdGFjayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnN0YWNrLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtMTInLCAnY29sLWxnLTcnKTtcclxuICAgICAgICAvLyB2bS5zdGFjay5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnU3RhY2snKSk7XHJcblxyXG4gICAgICAgIHZhciBzdGFja190aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHN0YWNrX3RpdGxlLmNsYXNzTGlzdC5hZGQoJ2hlYWRlci10ZXh0JywgJ3BhZC1zcGFjaW5nJylcclxuICAgICAgICBzdGFja190aXRsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnU2tpbGxzIFVzZWQnKSk7XHJcblxyXG4gICAgICAgIHZtLmZsZXhfZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmZsZXhfZ3JpZC5pZCA9ICdwZmxleC1ncmlkLScgKyByb3dfbnVtO1xyXG4gICAgICAgIHZtLmZsZXhfZ3JpZC5jbGFzc0xpc3QuYWRkKCdyb3cnLCAncG9ydGZvbGlvLWZsZXgnLCAnY29sLXhzLTEyJyk7XHJcblxyXG4gICAgICAgIHZtLmRlbW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5kZW1vLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtMTInLCAnY29sLWxnLTUnKTtcclxuICAgICAgICAvLyB2bS5kZW1vLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdMaXZlIERlbW8nKSk7XHJcblxyXG4gICAgICAgIHZhciBkZW1vX3RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGVtb190aXRsZS5jbGFzc0xpc3QuYWRkKCdoZWFkZXItdGV4dCcsICdwYWQtc3BhY2luZycpXHJcbiAgICAgICAgZGVtb190aXRsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnUmVsZXZhbnQgTGlua3MnKSk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgdm0ubGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmxpbmsuY2xhc3NMaXN0LmFkZCgnZ2l0aHViLWJ1dHRvbicsICdyb3cnLCAnbm9tYXInKTtcclxuXHJcbiAgICAgICAgdm0ubGlua190ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0ubGlua190ZXh0LmNsYXNzTGlzdC5hZGQoJ2JsYWNrLXRleHQnKTtcclxuICAgICAgICB2bS5saW5rX3RleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0xpdmUgTGluaycpKTtcclxuXHJcbiAgICAgICAgdm0uY29sNSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmNvbDUuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2NvbC1tZC01Jyk7XHJcblxyXG4gICAgICAgIC8qIEdPTk5BIEhBVkUgVE8gQUREIE1FRElBIERZTkFNSUNBTExZICovXHJcblxyXG4gICAgICAgIHZtLmh0bWwuYXBwZW5kQ2hpbGQocm93KTtcclxuICAgICAgICByb3cuYXBwZW5kQ2hpbGQodm0udGl0bGVfZWxlbWVudCk7XHJcbiAgICAgICAgcm93LmFwcGVuZENoaWxkKHZtLmNvbDYpO1xyXG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZCh2bS5jb2w2SG9sZGVyKTtcclxuXHJcblxyXG4gICAgICAgIHZtLmNvbDZIb2xkZXIuYXBwZW5kQ2hpbGQoY29sMTIpO1xyXG4gICAgICAgIGNvbDEyLmFwcGVuZENoaWxkKHZtLmRlc2NyaXB0aW9uKTtcclxuICAgICAgICBjb2wxMi5hcHBlbmRDaGlsZChkZXNjKTtcclxuICAgICAgICB2bS5jb2w2SG9sZGVyLmFwcGVuZENoaWxkKHZtLnN0YWNrKVxyXG4gICAgICAgIHZtLnN0YWNrLmFwcGVuZENoaWxkKHN0YWNrX3RpdGxlKTtcclxuICAgICAgICB2bS5zdGFjay5hcHBlbmRDaGlsZCh2bS5mbGV4X2dyaWQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZtLmNvbDZIb2xkZXIuYXBwZW5kQ2hpbGQodm0uZGVtbylcclxuICAgICAgICB2bS5kZW1vLmFwcGVuZENoaWxkKGRlbW9fdGl0bGUpO1xyXG4gICAgICAgIHZtLmRlbW8uYXBwZW5kQ2hpbGQodm0ubGluayk7XHJcbiAgICAgICAgdm0ubGluay5hcHBlbmRDaGlsZCh2bS5saW5rX3RleHQpO1xyXG4gICAgICAgIHZtLmxpbmsub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbG9jYXRpb24uaHJlZiA9IHZtLnVybDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAvLyN3cmFwcGVyLTAud3JhcHBlci5vcGVuXHJcbiAgICAgICAgLy8gLnJvdyNjb250ZW50XHJcbiAgICAgICAgLy8gICAuY29sLW1kLTEyLmRlc2MtdGV4dCBCcmVhdGhsZXNzXHJcbiAgICAgICAgLy8gICAuY29sLW1kLTYjbWVkaWEtMFxyXG4gICAgICAgIC8vICAgLmNvbC1tZC02LnJvd1xyXG4gICAgICAgIC8vICAgICAgIC5jb2wtbWQtMTJcclxuICAgICAgICAvLyAgICAgICAgIC5oZWFkZXItdGV4dC5wYWRkaW5nLWxlZnQgRGVzY3JpcHRpb246XHJcbiAgICAgICAgLy8gICAgICAgICAuZGVzY3JpcHRpb24tdGV4dC5wYWRkaW5nLWxlZnQgYXNkZmFzZGZcclxuICAgICAgICAvLyAgICAgICAuY29sLW1kLTYuaGVhZGVyLXRleHQgU3RhY2s6XHJcbiAgICAgICAgLy8gICAgICAgLmNvbC1tZC02LmhlYWRlci10ZXh0IExpdmUgRGVtbzpcclxuXHJcbiAgICAgICAgdm0uaHRtbC5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgaWYgKHZtLmNoYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICAgICB2bS5zZXREYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5jaGFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICB9XHJcbiAgICAvLyBjbG9zZURhdGEoKXtcclxuICAgIC8vICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAvLyAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgLy8gICAgICAgICB2bS5jb2xsZWN0aW9uLmNsb3NlKCk7XHJcbiAgICAvLyAgICAgfSx0aW1lb3V0KTtcclxuXHJcbiAgICAvLyB9XHJcblxyXG4gICAgc2V0RGF0YSgpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uc2V0VGl0bGUoKTtcclxuICAgICAgICB2bS5zZXREZXNjKCk7XHJcbiAgICAgICAgdm0uc2V0U3RhY2soKTtcclxuICAgICAgICB2bS5zZXRNZWRpYSgpO1xyXG5cclxuICAgICAgICBpZih2bS51cmwgPT09IFwiXCIpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSSBUSElOSyBUSElTIEhBUFBFTkVEPycpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2bS5jb2w2Lmxhc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIHZtLmNvbDZIb2xkZXIucmVtb3ZlQ2hpbGQodm0uZGVtbyk7XHJcbiAgICAgICAgfSBlbHNlIGlmKHZtLmNvbDZIb2xkZXIubGFzdENoaWxkICE9PSB2bS5kZW1vKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1dPQUggVEhJUyBXT1JLUz8nKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codm0uY29sNi5sYXN0Q2hpbGQpO1xyXG4gICAgICAgICAgICB2bS5jb2w2SG9sZGVyLmFwcGVuZENoaWxkKHZtLmRlbW8pOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB2bS5zZXRTdGFjayhzdGFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGl0bGUoKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnRfdGV4dC50ZXh0Q29udGVudCA9IHZtLnRpdGxlO1xyXG4gICAgfVxyXG4gICAgc2V0RGVzYygpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb25fdGV4dC50ZXh0Q29udGVudCA9IHZtLmRlc2M7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U3RhY2soKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmNvbGxlY3Rpb24ucmVzZXRJZHModm0uZmxleF9ncmlkLmlkKTtcclxuICAgICAgICB2bS5jb2xsZWN0aW9uLmxvYWQoKTtcclxuICAgIH1cclxuICAgIHNldE1lZGlhKCkge1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5tZWRpYS5zZXRJZCh2bS5tZWRpYS5pZCk7XHJcbiAgICAgICAgdm0ubWVkaWEubG9hZE1lZGlhKDApO1xyXG4gICAgfVxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4gICAgfVxyXG4gICAgY2hhbmdlV3JhcHBlcihvcGVuOiBib29sZWFuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgLy9jbG9zZSB3cmFwcGVyOlxyXG5cclxuXHJcbiAgICAgICAgaWYgKHZtLnRpdGxlID09PSB0aXRsZSkgeyAvKippZiBubyBjaGFuZ2UgKi9cclxuICAgICAgICAgICAgdm0uY2hhbmdlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAob3Blbikge1xyXG4gICAgICAgICAgICAgICAgLy8gdm0uY2xvc2VEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZtLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgICAgICAgICB2bS5kZXNjID0gZGVzYztcclxuICAgICAgICAgICAgICAgIHZtLmNvbGxlY3Rpb24gPSBzdGFjaztcclxuICAgICAgICAgICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgICAgICAgICB2bS51cmwgPSB1cmw7XHJcbiAgICAgICAgICAgICAgICB2bS5zZXREYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh2bS5odG1sLmNsYXNzTGlzdFsxXSAhPT0gJ29wZW4nKSB7IC8qKmlmIGFsbCBzZWxlY3Rpb25zIGFyZSBjbG9zZWQgaW5pdGlhbGx5L2NoYW5nZSB3aGVuIGNsb3NlZCovXHJcbiAgICAgICAgICAgIHZtLmNoYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2bS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgICAgICB2bS5kZXNjID0gZGVzYztcclxuICAgICAgICAgICAgdm0uY29sbGVjdGlvbiA9IHN0YWNrO1xyXG4gICAgICAgICAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgICAgICAgICB2bS51cmwgPSB1cmw7XHJcbiAgICAgICAgICAgIHZtLnNldERhdGEoKTtcclxuICAgICAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZtLmNoYW5nZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHZtLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgICAgIHZtLmRlc2MgPSBkZXNjO1xyXG4gICAgICAgICAgICB2bS5jb2xsZWN0aW9uID0gc3RhY2s7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgICAgIHZtLnVybCA9IHVybDtcclxuICAgICAgICAgICAgLy8gdm0uY2xvc2VEYXRhKCk7XHJcbiAgICAgICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25XcmFwcGVyKGRpZmZlcmVudF93cmFwcGVyOiBib29sZWFuLCBvcGVuOiBib29sZWFuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciByZXR1cm5fdmFsdWU7XHJcblxyXG4gICAgICAgIGlmIChkaWZmZXJlbnRfd3JhcHBlcikge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHZtLmNoYW5nZVdyYXBwZXIob3BlbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSwgdXJsKTtcclxuICAgICAgICAgICAgfSwgdGltZW91dCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChvcGVuID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb3BlbiA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHZtLmNoYW5nZVdyYXBwZXIob3BlbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSwgdXJsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHZtLmNoYW5nZVdyYXBwZXIob3BlbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSwgdXJsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldHVybl92YWx1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUG9ydGZvbGlvSXRlbSB7XHJcbiAgICB0aXRsZTogc3RyaW5nO1xyXG4gICAgdGl0bGVfaW1hZ2U6IHN0cmluZztcclxuICAgIGRlc2M6IHN0cmluZztcclxuICAgIHN0YWNrOiBza2lsbF9iYWRnZS5Db2xsZWN0aW9uO1xyXG4gICAgbWVkaWE6IG1lZGlhLk1lZGlhO1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gICAgdXJsOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8vIHtcIm5hbWVcIjogJ1B5dGhvbicsICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J3B5dGhvbi01LnN2Zyd9XHJcbnZhciBicmVhdGhsZXNzX3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ1BoYXNlci5qcycsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdwaGFzZXIuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnUGhvdG9zaG9wJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3Bob3Rvc2hvcC1jYy5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdqUXVlcnknLCBcImNsYXNzXCI6ICdjaXJjbGUtNTAnLCBcImltYWdlXCI6ICdqcXVlcnktMS5zdmcnIH1dLFxyXG50cnVlXHJcbik7XHJcbnZhciByZW1fc3RhY2sgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJycsIFt7IFwibmFtZVwiOiAnVW5pdHknLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAndW5pdHkuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnTWF5YScsIFwiY2xhc3NcIjogJ2NpcmNsZS0yNScsIFwiaW1hZ2VcIjogJ21heWEucG5nJyB9LFxyXG57IFwibmFtZVwiOiAnUGhvdG9zaG9wJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAncGhvdG9zaG9wLWNjLnN2Zyd9LFxyXG57IFwibmFtZVwiOiAnSWxsdXN0cmF0b3InLCBcImNsYXNzXCI6ICdjaXJjbGUtMjUnLCBcImltYWdlXCI6ICdhZG9iZS1pbGx1c3RyYXRvci1jYy5zdmcnfV0sXHJcbnRydWVcclxuKTtcclxuXHJcbnZhciBtb3VzZV9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgW3sgXCJuYW1lXCI6ICdVbml0eScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICd1bml0eS5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdNb3Rpb24gQnVpbGRlcicsIFwiY2xhc3NcIjogJ2NpcmNsZS03NScsIFwiaW1hZ2VcIjogJ21vYnUucG5nJyB9LFxyXG57IFwibmFtZVwiOiAnTWF5YScsIFwiY2xhc3NcIjogJ2NpcmNsZS01MCcsIFwiaW1hZ2VcIjogJ21heWEucG5nJyB9LFxyXG57IFwibmFtZVwiOiAnVmljb24gQmxhZGUnLCBcImNsYXNzXCI6ICdjaXJjbGUtNTAnLCBcImltYWdlXCI6ICd2aWNvbi5wbmcnIH0sXHJcbl0sXHJcbnRydWVcclxuKTtcclxuXHJcbnZhciBua19zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgW3sgXCJuYW1lXCI6ICdVbml0eScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICd1bml0eS5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdJbGx1c3RyYXRvcicsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdhZG9iZS1pbGx1c3RyYXRvci1jYy5zdmcnfV0sXHJcbnRydWVcclxuKTtcclxuXHJcbnZhciBiZWVfc3RhY2sgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJycsIFt7IFwibmFtZVwiOiAnVW5pdHknLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAndW5pdHkuc3ZnJyB9LFxyXG5dLFxyXG50cnVlXHJcbik7XHJcblxyXG52YXIgY2F2ZV9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgW3sgXCJuYW1lXCI6ICdIb3VkaW5pJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2hvdWRpbmkucG5nJ30sXHJcbnsgXCJuYW1lXCI6ICdVbml0eScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICd1bml0eS5zdmcnIH1dLFxyXG50cnVlXHJcbik7XHJcblxyXG52YXIgc3RvcnlncmFwaF9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgW3sgXCJuYW1lXCI6ICdVbml0eScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICd1bml0eS5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdBZnRlciBFZmZlY3RzJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAnYWZ0ZXItZWZmZWN0cy1jYy5zdmcnIH1dLFxyXG50cnVlXHJcbik7XHJcbnZhciBxYmVydF9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgW3sgXCJuYW1lXCI6ICdNYXlhJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ21heWEucG5nJyB9LFxyXG57IFwibmFtZVwiOiAnUGhvdG9zaG9wJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAncGhvdG9zaG9wLWNjLnN2ZycgfV0sXHJcbnRydWVcclxuKTtcclxudmFyIHdlYXRoZXJfc3RhY2sgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJycsIFt7IFwibmFtZVwiOiAnQW5ndWxhciBKUycsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdhbmd1bGFyLWljb24uc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnRDMuanMnLCBcImNsYXNzXCI6ICdjaXJjbGUtNTAnLCBcImltYWdlXCI6ICdkMy0yLnN2ZycgfV0sXHJcbnRydWVcclxuKTtcclxuXHJcbnZhciByb2FzdF9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgW3sgXCJuYW1lXCI6ICdFbWJlciBKUycsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdlbWJlci5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdEMy5qcycsIFwiY2xhc3NcIjogJ2NpcmNsZS03NScsIFwiaW1hZ2VcIjogJ2QzLTIuc3ZnJyB9XSxcclxudHJ1ZVxyXG4pO1xyXG5cclxudmFyIGNvbnRyYXN0X3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ0phdmEnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnamF2YS0xNC5zdmcnIH1dLFxyXG50cnVlXHJcbik7XHJcblxyXG52YXIgcG9ydF9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgW3sgXCJuYW1lXCI6ICdUeXBlIFNjcmlwdCcsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICd0eXBlc2NyaXB0LnN2ZycgfSwgXHJcbnsgXCJuYW1lXCI6ICdIVE1MNScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdodG1sNS5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdTQ1NTJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3Nhc3MtMS5zdmcnIH1dLFxyXG50cnVlXHJcbik7XHJcblxyXG4vLyB2YXIgYnJlYXRobGVzc19tZWRpYSA9IG5ldyBtZWRpYS5NZWRpYSgnbWVkaWEtMCcsIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiXSwgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2NhdC5qcGdcIl0sICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8xOTgxNDk3OTVcIiB3aWR0aD1cIjQ3MVwiIGhlaWdodD1cIjMzNVwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicpO1xyXG5cclxudmFyIG0gPSBbXVxyXG5cclxubS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgWyBcIi4vcG9ydGZvbGlvL3JlbV81LnBuZ1wiLCBcIi4vcG9ydGZvbGlvL3JlbV8zLnBuZ1wiLCBcIi4vcG9ydGZvbGlvL3JlbV8yLnBuZ1wiLCBcIi4vcG9ydGZvbGlvL3JlbV80LnBuZ1wiXSwgWyBcIi4vcG9ydGZvbGlvL3JlbV8zLnBuZ1wiLCBcIi4vcG9ydGZvbGlvL3JlbV8yLnBuZ1wiLCBcIi4vcG9ydGZvbGlvL3JlbV80LnBuZ1wiXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzI1MjQzNjk4OVwiIHdpZHRoPVwiNDcxXCIgaGVpZ2h0PVwiMzM1XCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+JykpO1xyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL2NvbnRyYXN0XzMucG5nJywgJy4vcG9ydGZvbGlvL2NvbnRyYXN0XzUucG5nJywgJy4vcG9ydGZvbGlvL2NvbnRyYXN0XzQucG5nJywgICcuL3BvcnRmb2xpby9jb250cmFzdF83LnBuZyddLCBbJy4vcG9ydGZvbGlvL2NvbnRyYXN0XzMucG5nJywgJy4vcG9ydGZvbGlvL2NvbnRyYXN0XzUucG5nJywgJy4vcG9ydGZvbGlvL2NvbnRyYXN0XzQucG5nJywgJy4vcG9ydGZvbGlvL2NvbnRyYXN0XzcucG5nJ10pKTtcclxubS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19wbGF5LmpwZ1wiLCBcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfZ2FtZXBsYXlfMi5qcGdcIiwgXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX2dhbWVwbGF5LmpwZ1wiLCBcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfY29udHJvbHMuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX3BsYXkuanBnXCIsIFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheV8yLmpwZ1wiLCBcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfZ2FtZXBsYXkuanBnXCIsIFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19jb250cm9scy5qcGdcIl0pKTtcclxuLy8gbS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgW1wiLi9wb3J0Zm9saW8vcWJlcnRfcGxheS5qcGdcIiwgXCIuL3BvcnRmb2xpby9xYmVydF9wbGF5ZXIuanBnXCIsIFwiLi9wb3J0Zm9saW8vcWJlcnRfc25ha2UuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9xYmVydF9wbGF5ZXIuanBnXCIsIFwiLi9wb3J0Zm9saW8vcWJlcnRfc25ha2UuanBnXCJdLCAnPGlmcmFtZSBzcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vMTk4MTQ5Nzk1XCIgd2lkdGg9XCI0NzFcIiBoZWlnaHQ9XCIzMzVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKSk7XHJcbi8vIG0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFtcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8xLnBuZ1wiLCBcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8zLnBuZ1wiLCBcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8yLnBuZ1wiXSwgW1wiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzEucG5nXCIsIFwiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzMucG5nXCIsIFwiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzIucG5nXCJdKSk7XHJcbi8vIG0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vbWVhbl9mb3JlY2FzdF8xLmpwZycsICcuL3BvcnRmb2xpby9tZWFuX2ZvcmVjYXN0XzIuanBnJ10sIFsnLi9wb3J0Zm9saW8vbWVhbl9mb3JlY2FzdF8xLmpwZycsICcuL3BvcnRmb2xpby9tZWFuX2ZvcmVjYXN0XzIuanBnJ10pKTtcclxuLy8gbS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgWycuL3BvcnRmb2xpby9yb2FzdF82LnBuZycsICcuL3BvcnRmb2xpby9yb2FzdF8yLnBuZycsICcuL3BvcnRmb2xpby9yb2FzdF8zLnBuZycsICcuL3BvcnRmb2xpby9yb2FzdF80LnBuZyddLCBbJy4vcG9ydGZvbGlvL3JvYXN0XzYucG5nJywgJy4vcG9ydGZvbGlvL3JvYXN0XzIucG5nJywnLi9wb3J0Zm9saW8vcm9hc3RfMy5wbmcnLCAnLi9wb3J0Zm9saW8vcm9hc3RfNC5wbmcnXSkpO1xyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL1N0b3J5R3JhcGhfQ2FyZC5wbmcnLCcuL3BvcnRmb2xpby9zdG9yeWdyYXBoXzEucG5nJywgJy4vcG9ydGZvbGlvL3N0b3J5Z3JhcGhfMi5wbmcnXSwgWycuL3BvcnRmb2xpby9zdG9yeWdyYXBoXzEucG5nJywgJy4vcG9ydGZvbGlvL3N0b3J5Z3JhcGhfMi5wbmcnXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzM2OTc0NzQ3MVwiIHdpZHRoPVwiNDcxXCIgaGVpZ2h0PVwiMzM1XCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+JykpO1xyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL2Nyb3dkXzEucG5nJywnLi9wb3J0Zm9saW8vY3Jvd2RfMi5wbmcnLCAnLi9wb3J0Zm9saW8vY3Jvd2RfMy5wbmcnXSwgWycuL3BvcnRmb2xpby9jcm93ZF8xLnBuZycsJy4vcG9ydGZvbGlvL2Nyb3dkXzIucG5nJywgJy4vcG9ydGZvbGlvL2Nyb3dkXzMucG5nJ10pKTtcclxubS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgWycuL3BvcnRmb2xpby9iaW9zaHJvb21fMS5wbmcnLCcuL3BvcnRmb2xpby9iaW9zaHJvb21fMi5QTkcnLCAnLi9wb3J0Zm9saW8vYmlvc2hyb29tXzMuUE5HJywgJy4vcG9ydGZvbGlvL2Jpb3Nocm9vbV80LlBORyddLCBbJy4vcG9ydGZvbGlvL2Jpb3Nocm9vbV8xLnBuZycsJy4vcG9ydGZvbGlvL2Jpb3Nocm9vbV8yLlBORycsJy4vcG9ydGZvbGlvL2Jpb3Nocm9vbV8zLlBORyddLCAnPGlmcmFtZSBzcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vMzY5NzUyNjMxXCIgd2lkdGg9XCI0NzFcIiBoZWlnaHQ9XCIzMzVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vbmtfMy5wbmcnLCcuL3BvcnRmb2xpby9ua18xLlBORycsICcuL3BvcnRmb2xpby9ua18yLlBORyddLCBbJy4vcG9ydGZvbGlvL25rXzEucG5nJywnLi9wb3J0Zm9saW8vbmtfMi5QTkcnXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzM0OTUxMzM3M1wiIHdpZHRoPVwiNDcxXCIgaGVpZ2h0PVwiMzM1XCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+JykpO1xyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL3JvYm90XzEucG5nJywnLi9wb3J0Zm9saW8vcm9ib3RfMi5QTkcnLCAnLi9wb3J0Zm9saW8vcm9ib3RfMy5QTkcnXSwgWycuL3BvcnRmb2xpby9yb2JvdF8yLnBuZycsJy4vcG9ydGZvbGlvL3JvYm90XzMuUE5HJ10sICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8zNjk3ODQ1NDNcIiB3aWR0aD1cIjQ3MVwiIGhlaWdodD1cIjMzNVwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicpKTtcclxubS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgWycuL3BvcnRmb2xpby9jYXZlXzMucG5nJywnLi9wb3J0Zm9saW8vY2F2ZV8yLlBORycsICcuL3BvcnRmb2xpby9jYXZlXzEuUE5HJywgJy4vcG9ydGZvbGlvL2NhdmVfNC5QTkcnXSwgWycuL3BvcnRmb2xpby9jYXZlXzIucG5nJywnLi9wb3J0Zm9saW8vY2F2ZV8xLlBORycsJy4vcG9ydGZvbGlvL2NhdmVfNC5QTkcnXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzM2OTc4OTEyN1wiIHdpZHRoPVwiNDcxXCIgaGVpZ2h0PVwiMzM1XCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+JykpO1xyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL3R1YmVfMy5QTkcnLCAnLi9wb3J0Zm9saW8vdHViZV8yLlBORycsICcuL3BvcnRmb2xpby90dWJlXzQuUE5HJ10sIFsnLi9wb3J0Zm9saW8vdHViZV8yLlBORycsJy4vcG9ydGZvbGlvL3R1YmVfNC5QTkcnXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzM2OTk1NTQ2MFwiIHdpZHRoPVwiNDcxXCIgaGVpZ2h0PVwiMzM1XCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+JykpO1xyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL21vdXNlXzEuUE5HJywgJy4vcG9ydGZvbGlvL21vdXNlXzIuUE5HJywgJy4vcG9ydGZvbGlvL21vdXNlXzMuUE5HJ10sIFsnLi9wb3J0Zm9saW8vbW91c2VfMS5QTkcnLCAnLi9wb3J0Zm9saW8vbW91c2VfMi5QTkcnLCAnLi9wb3J0Zm9saW8vbW91c2VfMy5QTkcnXSkpO1xyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL2JlZV8xLlBORycsICcuL3BvcnRmb2xpby9iZWVfMi5QTkcnLCAnLi9wb3J0Zm9saW8vYmVlXzMuUE5HJ10sIFsnLi9wb3J0Zm9saW8vYmVlXzIuUE5HJywgJy4vcG9ydGZvbGlvL2JlZV8zLlBORyddLCAnPGlmcmFtZSBzcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vMzcwMjIwOTM1XCIgd2lkdGg9XCI0NzFcIiBoZWlnaHQ9XCIzMzVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKSk7XHJcbi8vIG0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vcG9ydF8xLnBuZycsICcuL3BvcnRmb2xpby9wb3J0XzIucG5nJywgJy4vcG9ydGZvbGlvL3BvcnRfMy5wbmcnLCAgJy4vcG9ydGZvbGlvL3BvcnRfNC5wbmcnXSwgWycuL3BvcnRmb2xpby9wb3J0XzEucG5nJywgJy4vcG9ydGZvbGlvL3BvcnRfMi5wbmcnLCAnLi9wb3J0Zm9saW8vcG9ydF8zLnBuZycsICcuL3BvcnRmb2xpby9wb3J0XzQucG5nJ10pKTtcclxuXHJcbnZhciBwb3J0Zm9saW8gPSBuZXcgUG9ydGZvbGlvKCdwb3J0Zm9saW8nLCBbXHJcbiAgICB7IHRpdGxlOiAnVGhlIFN0b3J5IEdyYXBoJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9TdG9yeUdyYXBoX0NhcmQucG5nJywgZGVzYzogXCJUaGUgU3RvcnkgR3JhcGggaXMgYSBub2RlIGJhc2VkIHZpc3VhbCBzY3JpcHRpbmcgdG9vbC4gU2ltaWxhciB0byBCbHVlcHJpbnRzIGluIFVucmVhbCBFbmdpbmUgNCwgVGhlIFN0b3J5IEdyYXBoIG1ha2VzIHNjcmlwdGluZyBlYXN5IGZvciBkZXNpZ25lcnMgYW5kIGRldmVsb3BlcnMgd2hvIHdhbnQgdG8gcHJvdG90eXBlIHJhcGlkbHkuIFRoaXMgaXMgYSBVbml0eSBDdXN0b20gRWRpdG9yIFRvb2wgdGhhdCBjYW4gYmUgYm91Z2h0IG9uIHRoZSBVbml0eSBBc3NldCBTdG9yZS5cIiwgc3RhY2s6IHN0b3J5Z3JhcGhfc3RhY2ssIG1lZGlhOiBtWzNdLCB0eXBlOiAnVW5pdHkgQ3VzdG9tIEVkaXRvciBUb29sJywgdXJsOiAnaHR0cHM6Ly9hc3NldHN0b3JlLnVuaXR5LmNvbS9wYWNrYWdlcy90b29scy92aXN1YWwtc2NyaXB0aW5nL3N0b3J5LWdyYXBoLTEzNjcxMycgfSxcclxuICAgIHsgdGl0bGU6ICdCaW9zaHJvb20nLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL2Jpb3Nocm9vbV9jYXJkLnBuZycsIGRlc2M6IFwiQmlvc2hyb29tIGlzIGEgZmlyc3QgcGVyc29uIGV4cGxvcmF0aW9uIGFuZCBnYXJkZW5pbmcgZ2FtZS4gWW91IGFyZSBhIEJpb2xvZ2lzdCBleHBsb3JpbmcgYSBmb3JlaWduIHBsYW5ldCBpbmZlc3RlZCB3aXRoIG11c2hyb29tcy4gSXQgaXMgeW91ciBnb2FsIHRvIGV4cGxvcmUgdGhlIHBsYW5ldCwgZ2F0aGVyIG5ldyBtdXNocm9vbXMsIGFuZCBicmVlZCB0aGVtIHRvIHNlbmQgYmFjayB0byB5b3VyIGhvbWUgcGxhbmV0LiBPbiB0aGlzIHByb2plY3QgSSB3b3JrZWQgYXMgYSB0ZWNobmljYWwgYXJ0aXN0IGFuZCBkZXZlbG9wZXIuIEkgZGV2ZWxvcGVkIGEgcHJvY2VkdXJhbCBtdXNocm9vbSB1c2luZyBibGVuZHNoYXBlcywgYXMgd2VsbCBhcyBhIG11c2hyb29tIHNwYXduZXIgdGhhdCB1c2VzIHZlcnRleCBjb2xvcnMgb24gdGhlIGdyb3VuZC5cIiwgc3RhY2s6IHJlbV9zdGFjaywgbWVkaWE6IG1bNV0sIHR5cGU6ICdVbml0eSBHYW1lJywgdXJsOiAnJyB9LFxyXG4gICAgeyB0aXRsZTogJ0FuZCB0aGUgQ3Jvd2QgR29lcyBXaWxkIScsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vY3Jvd2RfY2FyZC5wbmcnLCBkZXNjOiBcIkFuZCB0aGUgQ3Jvd2QgR29lcyBXaWxkIGlzIGEgdmlydHVhbCByZWFsaXR5IGludGVyYWN0aXZlIGV4cGVyaWVuY2Ugd2hlcmUgeW91IHB1dCBvbiBhIG1hZ2ljIHNob3cgZm9yIGFuIGF1ZGllbmNlIG9mIGdob3N0cy4gVGhpcyBleHBlcmllbmNlIHVzZXMgT2N1bHVzIFZSIGFzIHdlbGwgYXMgdGhlIExlYXBtb3Rpb24gdG8gdHJ1bHkgc2ltdWxhdGUgbWFnaWMgY29taW5nIG91dCBvZiB5b3VyIGZpbmdlcnRpcHMgdmlhIExlYXAgTW90aW9uIGdlc3R1cmVzLiBJIGRldmVsb3BlZCB0aGlzIGdhbWUgZW50aXJlbHkgdXNpbmcgVGhlIFN0b3J5IEdyYXBoLCB0aGUgVW5pdHkgQ3VzdG9tIEVkaXRvciBUb29sIEkgY3JlYXRlZC4gTWFkZSBpbiBvbmx5IDEgbW9udGggZm9yIG15IEludHJvZHVjdGlvbiB0byBWaXJ0dWFsIFJlYWxpdHkgY2xhc3MsIHRoaXMgZXhwZXJpZW5jZSBleHBsb3JlcyBWaXJ0dWFsIFJlYWxpdHkgVXNlciBFeHBlcmllbmNlIGRlc2lnbiB3aXRoIGdlc3R1cmUgYmFzZWQgY29udHJvbHMuXCIsIHN0YWNrOiBzdG9yeWdyYXBoX3N0YWNrLCBtZWRpYTogbVs0XSwgdHlwZTogJ1VuaXR5IFZSIEV4cGVyaWVuY2UnLCB1cmw6ICcnIH0sXHJcbiAgICB7IHRpdGxlOiAnSGl2ZSBKaXZlJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9iZWVfY2FyZC5wbmcnLCBkZXNjOiBcIkhpdmUgSml2ZSBpcyBhIHZpcnR1YWwgcmVhbGl0eSBnYW1lIHdoZXJlIHlvdSBmbHkgYXJvdW5kIGFzIGEgYmVlLiBUaGUgZ29hbCBvZiB0aGUgZ2FtZSBpcyB0byByZXBvbGxpbmF0ZSB0aGUgaXNsYW5kIGFuZCBjbGVhciBpdCBvZiBhbGwgaXRzIHRyYXNoLiBJIHdvcmtlZCBpbiBhIGdyb3VwIGFzIGEgVGVjaG5pY2FsIEFydGlzdCwgd2hlcmUgSSBjcmVhdGVkIHRoZSBiZWUgZnVyIHNoYWRlciwgdGhlIGdyYXNzIHNoYWRlciwgcmlnZ2luZyB0aGUgYmVlLCBhbmQgc2V0dGluZyB1cCBHUFUgcGFpbnRpbmcgb24gdGhlIHBsYXllciBjb250cm9sbGVyLiBUaGlzIGdhbWUgd2FzIHNob3duIGF0IFNpZ2dyYXBoIGF0IERyZXhlbCBVbml2ZXJzaXR5J3MgYm9vdGggdXNpbmcgYSBNb3RvcmJpa2UgQ29udHJvbGxlci5cIiwgc3RhY2s6IGJlZV9zdGFjaywgbWVkaWE6IG1bMTFdLCB0eXBlOiAnVmlydHVhbCBSZWFsaXR5IEdhbWUnLCB1cmw6ICcnIH0sXHJcbiAgICB7IHRpdGxlOiAnTG9zdCBBbmQgRm91bmRlcnMnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL25rX2NhcmQucG5nJywgZGVzYzogXCJMb3N0IGFuZCBGb3VuZGVycyBpcyBhbiBhdWdtZW50ZWQgcmVhbGl0eSBnYW1lIEkgd29ya2VkIG9uIHdoaWxlIEkgd2FzIHdvcmtpbmcgYXQgTmlnaHQgS2l0Y2hlbiBJbnRlcmFjdGl2ZS4gQ3VycmVudGx5IGF0IHRoZSBFZGdhciBBbGxlbiBQb2UgTmF0aW9uYWwgSGlzdG9yaWMgU2l0ZSBhbnlvbmUgY2FuIHVzZSB0aGVpciBhdWdtZW50ZWQgcmVhbGl0eSBlbmFibGVkIGRldmljZSB0byBiZSBsZWQgb24gUG9lJ3MgZmFtb3VzIHN0b3JpZXMgYXMgYW4gaW50ZXJhY3RpdmUgYWR2ZW50dXJlLiBPbiB0aGlzIHByb2plY3QgSSB3b3JrZWQgYXMgYSBVSSBhbmQgQVIgZGV2ZWxvcGVyIGluIFVuaXR5IDNkLiBJIHNldCB1cCBhIE1vZGVsIFZpZXcgQ29udHJvbGxlciBmcmFtZXdvcmsgYW5kIENTViBjb252ZXJ0ZXIgdG8gbWFrZSBkYXRhIGVudHJ5IHF1aWNrIGFuZCBlYXN5IGZyb20gdGhlIGVkaXRvci5cIiwgc3RhY2s6IG5rX3N0YWNrLCBtZWRpYTogbVs2XSwgdHlwZTogJ0F1Z21lbnRlZCBSZWFsaXR5IEdhbWUnLCB1cmw6ICdodHRwczovL3d3dy53aGF0c2Nvb2tpbi5jb20vJyB9LFxyXG4gICAgeyB0aXRsZTogJ1Byb2NlZHVyYWwgQ2F2ZScsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vY2F2ZV9jYXJkLnBuZycsIGRlc2M6IFwiVGhpcyBQcm9jZWR1cmFsIENhdmUgaGFzIGNvbnRyb2xzIG51bWJlciBvZiByb29tcywgc3RhbGFnbWl0ZXMsIG51bWJlciBvZiBoYWxsd2F5cyBiZXR3ZWVuIHJvb21zLCBhcyB3ZWxsIGFzIHVzaW5nIGEgcHJvY2V1ZHJhbCBtYXRlcmlhbC4gVGhlIHByb2NlZHVyYWwgbWF0ZXJpYWwgaXMgZXhwb3J0ZWQgZnJvbSBIb3VkaW5pJ3MgdGV4dHVyZSBiYWtlciwgYW5kIGJyb3VnaHQgaW50byBVbml0eS4gUGVyZmVjdCBhc3NldCBmb3IgYW55IGR1bmdlb24gY3Jhd2xlci5cIiwgc3RhY2s6IGNhdmVfc3RhY2ssIG1lZGlhOiBtWzhdLCB0eXBlOiAnSG91ZGluaSBNb2RlbCcsIHVybDogJycgfSxcclxuICAgIHsgdGl0bGU6ICdUdWJlIERvbWUgRXhwZXJpZW5jZScsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vdHViZV9jYXJkLlBORycsIGRlc2M6IFwiRm9yIGEgRG9tZSBleGhpYml0IEkgY3JlYXRlZCBhbiBhYnN0cmFjdCB0dWJlIGFuaW1hdGlvbiB1c2luZyBkaXN0YW5jZSBmaWVsZCB2b2x1bWVzLCBhbmQgYSBHUFUgcHJvY2V1ZHJhbCBtZXNoIGNvbXB1dGUgc2hhZGVyIGluIFVuaXR5LiBUbyBleHBvcnQgZm9yIHRoZSBkb21lLCBJIGRldmVsb3BlZCBhIEZpc2hleWUgTGVucyBSZW5kZXIgUGlwZWxpbmUuIEZvciB0aGlzIHByb2plY3QgSSBsZXZlcmFnZWQgb3BlbiBzb3VyY2UgZnJvbSBLZWlqaXJvLlwiLCBzdGFjazogc3RvcnlncmFwaF9zdGFjaywgbWVkaWE6IG1bOV0sIHR5cGU6ICdJbW1lcnNpdmUgRXhwZXJpZW5jZScsIHVybDogJycgfSxcclxuICAgIHsgdGl0bGU6ICdNb3Rpb24gQ2FwdHVyZSBNb3VzZScsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vbW91c2VfY2FyZC5wbmcnLCBkZXNjOiBcIkkgY3JlYXRlZCBhbiBhbmltYXRpb24gY29udHJvbGxlciBpbiBVbml0eSwgdXNpbmcgTW90aW9uIENhcHR1cmUgZGF0YSB0aGF0IEkgY3JlYXRlZCBhbmQgY2xlYW5lZCBpbiBWaWtvbiBCbGFkZS4gSSBhbHNvIHJpZ2dlZCBhbmQgd2VpZ2h0IHBhaW50ZWQgYSBNb3VzZSBtb2RlbCB1c2luZyBNYXlhIEh1bWFuIElLIHRvb2wsIGFuZCBhcHBsaWVkIG1vY2FwIGRhdGEgdG8gdGhlIG1vZGVsIGluIE1vdGlvbiBCdWlsZGVyLiBGaW5hbGx5IEkgYnJvdWdodCBpdCBpbnRvIFVuaXR5IGFuZCBibGVuZGVkIGJldHdlZW4gYW5pbWF0aW9ucyB1c2luZyB0aGlyZCBwZXJzb24gY29udHJvbGxlciBpbnB1dHMuXCIsIHN0YWNrOiBtb3VzZV9zdGFjaywgbWVkaWE6IG1bMTBdLCB0eXBlOiAnUmlnIGFuZCBNb2NhcCcsIHVybDogJycgfSxcclxuICAgIHsgdGl0bGU6ICdSZW0nLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL3JlbWVtYmVyZW5jZV9sb2dvLmpwZycsIGRlc2M6IFwiUmVtIGlzIGEgdmlkZW8gZ2FtZSBhYm91dCBhIHlvdW5nIGdpcmwgdHJhcHBlZCBpbiBhIGNvbWF0b3NlIGRyZWFtc2NhcGUuIFlvdSBwbGF5IGFzIGEgeW91bmcgZ2lybCB3aG8gbXVzdCBvdmVyY29tZSBoZXIgZmVhcnMgdG8gcmVtZW1iZXIgaGVyIHBhc3QuIEluIHRoaXMgZnVuLCBvdmVyLXRoZS1zaG91bGRlciBzdGVhbHRoIGdhbWUgeW91IG11c3QgYXZvaWQgc2NyZWVuIGhlYWRlZCBlbmVtaWVzLCBhbmQgZmluZCBtZW1lbnRvcyBvZiB5b3VyIHBhc3QuIEZvciB0aGlzIHByb2plY3QgSSB3b3JrZWQgaW4gbWFueSBhcmVhcyBpbmNsdWRpbmcgTGV2ZWwgRGVzaWduLCBWaXN1YWwgRWZmZWN0cywgV2ViIERldmVsb3BtZW50LCBNb2RlbGluZywgYW5kIERvY3VtZW50YXRpb24uXCIsIHN0YWNrOiByZW1fc3RhY2ssIG1lZGlhOiBtWzBdLCB0eXBlOiAnVW5pdHkgR2FtZScsIHVybDogJ2h0dHBzOi8vb2ZmYnJhbmRoZWxsdWkuaGVyb2t1YXBwLmNvbS8jL2hvbWUnIH0sXHJcbiAgICB7IHRpdGxlOiAnRG9vciB0byBEb29yJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9yb2JvdF9jYXJkLnBuZycsIGRlc2M6IFwiQXMgcGFydCBvZiBteSBBbmltYXRpb24gY2xhc3MsIEkgY3JlYXRlZCBhIHNob3J0IGZpbG0gYWJvdXQgYSByb2JvdCB3aG8gZ29lcyB0aHJvdWdoIG1hbnkgc3RyYW5nZSB3b3JsZHMuIEkgbW9kZWxlZCwgdGV4dHVyZWQsIHJpZ2dlZCwgYW5kIGFuaW1hdGVkIGV2ZXJ5dGhpbmcgYW5kIHJlbmRlcmVkIG91dCBpbiBVbml0eS4gSSBhbHNvIGNyZWF0ZWQgYSB0b29uIHNoYWRlciB3aXRoIGEgaGlnaGxpZ2h0IGFuZCBvdXRsaW5lIGFzIHdlbGwgYXMgZGlkIHNvbWUgVkZYIGluIFVuaXR5LiBJdCB3YXMgYSBodWdlIGxlYXJuaW5nIGV4cGVyaWVuY2UgdG8gZ28gdGhyb3VnaCBldmVyeSBwYXJ0IG9mIHRoZSBhbmltYXRpb24gcGlwZWxpbmUhXCIsIHN0YWNrOiByZW1fc3RhY2ssIG1lZGlhOiBtWzddLCB0eXBlOiAnUm9ib3QgQW5pbWF0aW9uJywgdXJsOiAnJyB9LFxyXG4gICAgLy8geyB0aXRsZTogJ1JvYXN0JywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9yb2FzdF83LmpwZycsIGRlc2M6IFwiUm9hc3QgaXMgYSB3ZWJhcHAgdGhhdCBzdXJ2ZXlzIGNvbWZvcnQgaW4gYW4gaW5kb29yIHNwYWNlLiBJdCBhc2tzIHF1ZXN0aW9ucyB0aGF0IGdhdWdlIHRlbXBlcmF0dXJlLCBub2lzZSwgc21lbGwsIGFuZCBodW1pZGl0eSwgYW5kIG1hcHMgaXQgdG8gd2hlcmUgeW91IGFyZSBvbiB5b3VyIGJ1aWxkaW5nJ3MgZmxvb3JwbGFuLiBUaHJvdWdoIHRoaXMgY3Jvd2Qgc291cmNlZCBkYXRhIGNvbGxlY3RlZCwgYnVpbGRpbmcgbWFuYWdlcnMsIGFyY2hpdGVjdHMgYW5kIHRoZSBwZW9wbGUgdGFraW5nIHRoZSBzdXJ2ZXkgY2FuIHVuZGVyc3RhbmQgaG93IHBlb3BsZSBmZWVsIGluIGEgc3BhY2UuIEkgd29ya2VkIG9uIHRoaXMgcHJvamVjdCBmb3IgNiBtb250aHMgd2hpbGUgSSB3YXMgd29ya2luZyBhdCB0aGUgYXJjaGl0ZWN0dXJlIGZpcm0sIEtpZXJhbiBUaW1iZXJsYWtlLlwiLCBzdGFjazogcm9hc3Rfc3RhY2ssIG1lZGlhOiBtWzVdLCB0eXBlOiAnV2ViIEFwcCcsIHVybDogJycgfSxcclxuICAgIHsgdGl0bGU6ICdDb250cmFzdCcsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vY29udHJhc3RfNi5wbmcnLCBkZXNjOiBcIkNvbnRyYXN0IGluIGNvbG9yIHRoZW9yeSBpcyB3aGVuIHR3byBjb2xvcnMgYXJlIHN0YXJrbHkgZGlmZmVyZW50IGZyb20gZWFjaCBvdGhlci4gSW4gdGhpcyBnYW1lIHlvdXIgb2JqZWN0aXZlIGlzIHRvIHNlbGVjdCB0aGUgbW9zdCBjb250cmFzdGluZyBjaXJjbGUgd2l0aCB0aGUgYmFja2dyb3VuZCBjb2xvci4gVGhpcyBpcyBjcmVhdGVkIGluIEphdmEgU3dpbmcgd2l0aCBhIGdhbWUgZW5naW5lIGhhbmQgY29kZWQgYnkgbWUgdXNpbmcgdGhlIEJ1ZmZlcmVkIEltYWdlIGNsYXNzLiBUaGlzIGdhbWUgZW5naW5lIGluY2x1ZGVzIGEgRnJhbWUgQnVmZmVyLCBJbnB1dCBNYW5hZ2VyLCBhbmQgQW5pbWF0aW9uIExvb3AuXCIsIHN0YWNrOiBjb250cmFzdF9zdGFjaywgbWVkaWE6IG1bMV0sIHR5cGU6ICdKYXZhIEdhbWUnLCB1cmw6ICdodHRwczovL2RyaXZlLmdvb2dsZS5jb20vb3Blbj9pZD0xR3kwT3NodTk0MS1NUGZodXRXbE82M0Y5MklWdXg5Zk0nIH0sXHJcbiAgICAvLyB7IHRpdGxlOiAnUG9ydGZvbGlvJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9wb3J0XzEucG5nJywgZGVzYzogXCJGcm9tIGNvbmNlcHQgdG8gZGVzaWduIHRvIGRldmVsb3BtZW50IEkgcHV0IGEgbG90IG9mIGxvdmUgaW50byB0aGlzLiBBcyBhIHBlcnNvbmFsIGNoYWxsZW5nZSBJIGNyZWF0ZWQgdGhpcyB3ZWJzaXRlIGVudGlyZWx5IGluIFR5cGVzY3JpcHQgd2l0aCBubyBqUXVlcnkuIEFsbCBpbiBhbGwgSSBjYW4gY29uY2x1ZGUgdGhhdCBqUXVlcnkgaXMgb3ZlcnJhdGVkISBKYXZhIFNjcmlwdCBpcyBwb3dlcmZ1bCBlbm91Z2ggb24gaXRzIG93bi5cIiwgc3RhY2s6IHBvcnRfc3RhY2ssIG1lZGlhOiBtWzddLCB0eXBlOiAnV2Vic2l0ZScsIHVybDogJ2h0dHBzOi8vZ2l0aHViLmNvbS9tYXR0d2FnYXIvV2Vic2l0ZXMvdHJlZS9tYXN0ZXIvcG9ydGZvbGlvX3dlYnNpdGVfdjInIH0sXHJcbiAgICB7IHRpdGxlOiAnQnJlYXRobGVzcycsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGcnLCBkZXNjOiBcIlRoZSBTcGFjZSBQaXJhdGUsIEFyaWEsIGlzIG9uIGEgbWlzc2lvbiB0byBsb290IGEgbWluZXJhbCBjYXJnbyBzaGlwLiBIb3dldmVyLCB1cG9uIGxhbmRpbmcgb24gdGhlIGNhcmdvIHNoaXAsIEFyaWEncyBoZWxtZXQgY3JhY2tzIGNhdXNpbmcgaGVyIHRvIHNsb3dseSBsb3NlIG94eWdlbi4gSXQncyBub3cgYSByYWNlIGFnYWluc3QgdGltZSB0byBjb2xsZWN0IGFsbCB0aGUgZ2VtcyBiZWZvcmUgaGVyIG94eWdlbiBydW5zIG91dCFcIiwgc3RhY2s6IGJyZWF0aGxlc3Nfc3RhY2ssIG1lZGlhOiBtWzJdLCB0eXBlOiAnSFRNTDUgR2FtZScsIHVybDogJy9icmVhdGhsZXNzJyB9XSk7XHJcbiAgICAvLyB7IHRpdGxlOiAnTWVhbiBGb3JlY2FzdCcsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vbWVhbl9mb3JlY2FzdF8xLmpwZycsIGRlc2M6ICdBIHNtYWxsIHdlYiBhcHAgdGhhdCBjYWxjdWxhdGVzIHRoZSBhdmVyYWdlIG9mIDMgd2VhdGhlciBBUElcXCdzOiBXdW5kZXJncm91bmQsIEZvcmVjYXN0LmlvLCBhbmQgV29ybGQgV2VhdGhlciBPbmxpbmUuIFRoaXMgZGF0YSBpcyB0aGVuIHNlcnZlZCBvbnRvIGEgRDMuanMgTGluZSBDaGFydCBmb3IgdGVtcGVyYXR1cmUsIGh1bWlkdHksIGFuZCB3aW5kc3BlZWQuIEFsc28gdGhlIHdlYmFwcCBpdHNlbGYgaGFzIG1hbnkgc3VidGxldGllcyB0aGF0IGFyZSBhZmZlY3RlZCBieSB3ZWF0aGVyIGRhdGEuIEZvciBleGFtcGxlLCB0aGUgdmlkZW8gIHJlc2VtYmxlcyB0aGUgY3VycmVudCB3ZWF0aGVyLiBBbHNvIGVhY2ggZ3JhcGggaXMgY29sb3IgY29hdGVkIGJ5IGEgZ3JhZGllbnQgYmFzZWQgb24gdGhlIHdlYXRoZXIgZGF0YS4nLCBzdGFjazogd2VhdGhlcl9zdGFjaywgbWVkaWE6IG1bNF0sIHR5cGU6ICdXZWJzaXRlJywgdXJsOiAnL21lYW5mb3JlY2FzdCcgfSxcclxuICAgIC8vIHsgdGl0bGU6ICdRKkJlcnQnLCB0aXRsZV9pbWFnZTogXCIuL3BvcnRmb2xpby9xYmVydF9wbGF5LmpwZ1wiLCBkZXNjOiAnVGhpcyBpcyBteSBCb3VuY2luZyBCYWxsIEFzc2lnbm1lbnQgZm9yIEFuaW1hdGlvbiAxIGF0IERyZXhlbCBVbml2ZXJzaXR5LiBXaGVuIHBpY2tpbmcgYSBnYW1lIHRoYXQgbWl4ZXMgbXkgbG92ZSBvZiByZXRybyB2aWRlbyBnYW1lcyBhbmQgYm91bmNpbmcgYmFsbHMsIFEqQmVydCB3YXMgYSBuby1icmFpbmVyLiBFdmVyeXRoaW5nIGlzIG9yaWdpbmFsbHkgbW9kZWxsZWQsIHRleHR1cmVkLCBhbmQgYW5pbWF0ZWQuIE1hZGUgaW4gTWF5YSwgYW5kIHJlbmRlcmVkIGluIFYtUmF5LicsIHN0YWNrOiBxYmVydF9zdGFjaywgbWVkaWE6IG1bMl0sIHR5cGU6ICdBbmltYXRpb24nLCB1cmw6ICdodHRwczovL3ZpbWVvLmNvbS8xOTgxNDk3OTUnIH0sXHJcbiAgICAvLyB7IHRpdGxlOiAnQmVkcm9vbScsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzEucG5nJywgZGVzYzogJ1RoaXMgaXMgbXkgZmluYWwgZm9yIENHSSAyIGF0IERyZXhlbCBVbml2ZXJzaXR5LiBUaGUgYXNzaWdubWVudCB3YXMgdG8gcmVjcmVhdGUgYW55IHR5cGUgb2Ygcm9vbSwgc28gSSBjaG9zZSBhIGxpdHRsZSBib3lcXCdzIHJvb20uIFdlIHdlcmUgdGFza2VkIHdpdGggY3JlYXRpbmcgYXQgbGVhc3Qgb25lIGNvbXBsZXggb2JqZWN0LCBzbyBJIGRlY2lkZWQgdG8gZ28gd2l0aCBhIHRyYWluIHNldC4nLCBzdGFjazogcWJlcnRfc3RhY2ssIG1lZGlhOiBtWzNdLCB0eXBlOiAnM0QgUmVuZGVyJywgdXJsOiAnJyB9XSk7XHJcblxyXG5cclxuLy8gdmFyIHdlbGNvbWVfYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWxjb21lLWJ1dHRvbicpO1xyXG4vLyB3ZWxjb21lX2Iub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuLy8gICAgIGp1bXAoJyNwb3J0Zm9saW8nLCB7XHJcbi8vICAgICAgICAgZHVyYXRpb246IDEwMDAsXHJcbi8vICAgICAgICAgb2Zmc2V0OiAwLFxyXG4vLyAgICAgICAgIGNhbGxiYWNrOiB1bmRlZmluZWQsXHJcbi8vICAgICAgICAgZWFzaW5nOiBqdW1wLmVhc2VJbk91dFF1YWQsXHJcbi8vICAgICAgICAgYWxseTogZmFsc2VcclxuLy8gICAgIH0pXHJcbi8vIH1cclxuXHJcblxyXG4vKiogXHJcbiAqIHBvcnRmb2xpbyB3ZWJzaXRlXHJcbiAqIGJyZWF0aGxlc3NcclxuICogd2VhdGhlciB3ZWJzaXRlXHJcbiAqIHFiZXJ0IGFuaW1hdGlvblxyXG4gKiBjZ2kgMiBmaW5hbD8/IFxyXG4gKiBcclxuKi9cclxuXHJcblxyXG5cclxud2luZG93Lm9ucmVzaXplID0gKGUpID0+IHtcclxuICAgIGlmIChhcHAuY2FudmFzKSB7XHJcbiAgICAgICAgYXBwLnNpemVDYW52YXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwb3J0Zm9saW8uYXBwZW5kQWxsKCk7XHJcblxyXG59O1xyXG5cclxuXHJcbi8vIHZhciBkb2NXaWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vZmZzZXRXaWR0aDtcclxuXHJcbi8vIFtdLmZvckVhY2guY2FsbChcclxuLy8gICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcqJyksXHJcbi8vICAgZnVuY3Rpb24oZWwpIHtcclxuLy8gICAgIGlmIChlbC5vZmZzZXRXaWR0aCA+IGRvY1dpZHRoKSB7XHJcbi8vICAgICAgIGNvbnNvbGUubG9nKGVsKTtcclxuLy8gICAgIH1cclxuLy8gICB9XHJcbi8vICk7XHJcblxyXG4vLyB2YXIgbWVkaWEgPSBuZXcgTWVkaWEoJ21lZGlhLTAnLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2NhdC5qcGdcIl0sIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9jYXQuanBnXCIsIFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiXSk7XHJcblxyXG4iLCJleHBvcnQgKiBmcm9tIFwiLi9tZWRpYVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lZGlhSXRlbXtcclxuICAgIG1lZGlhOiBNZWRpYTtcclxuICAgIGh0bWw6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgb3JkZXI6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKG1lZGlhOiBNZWRpYSwgaHRtbDpIVE1MRGl2RWxlbWVudCwgb3JkZXI6IG51bWJlcil7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgdm0uaHRtbCA9IGh0bWw7XHJcbiAgICAgICAgdm0ub3JkZXIgPSBvcmRlcjtcclxuICAgICAgICB2bS5odG1sLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2bS5tZWRpYS5sb2FkTWVkaWEodm0ub3JkZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1lZGlhIHtcclxuICAgIGlkOnN0cmluZ1xyXG4gICAgZWxlbWVudHM6IGFueVtdO1xyXG4gICAgdGh1bWJuYWlsczogSFRNTEltYWdlRWxlbWVudFtdO1xyXG4gICAgbWVkaWFfaXRlbXM6IE1lZGlhSXRlbVtdO1xyXG4gICAgc2VsZWN0ZWQ6IG51bWJlcjtcclxuICAgIHZpbWVvOnN0cmluZztcclxuXHJcbiAgICByb3c6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBvdmVybGF5OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29sbWQ6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBcclxuICAgIG1lZGlhX3NlbGVjdGVkOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgdGh1bWJuYWlsczogc3RyaW5nW10sIGZpbGVzPzogc3RyaW5nW10sIHZpbWVvPzogc3RyaW5nKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaWQgPSBpZDtcclxuICAgICAgICB2bS5zZWxlY3RlZCA9IDA7XHJcbiAgICAgICAgdm0uZWxlbWVudHMgPSBbXTtcclxuICAgICAgICB2bS5tZWRpYV9pdGVtcyA9IFtdO1xyXG4gICAgICAgIHZtLnRodW1ibmFpbHMgPSBbXTtcclxuXHJcbiAgICAgICAgdm0udmltZW8gPSB2aW1lbztcclxuICAgICAgICBpZih2aW1lbyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgZnJhZyA9IHZtLmNyZWF0ZUZyYWdtZW50KHZpbWVvKTtcclxuICAgICAgICAgICAgICAgIHZtLmVsZW1lbnRzLnB1c2goZnJhZyk7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5lbGVtZW50c1tpXS5jbGFzc0xpc3QuYWRkKCdkcm9wc2hhZG93Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbGVuZ3RoID0gdm0uZWxlbWVudHMubGVuZ3RoO1xyXG4gICAgICAgIGlmKGZpbGVzKXtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5zcmMgPSBmaWxlc1tpXTtcclxuICAgICAgICAgICAgICAgIGltYWdlLmNsYXNzTGlzdC5hZGQoJ2Ryb3BzaGFkb3cnKTtcclxuICAgICAgICAgICAgICAgIHZtLmVsZW1lbnRzLnB1c2goaW1hZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2bS5tZWRpYV9zZWxlY3RlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLm1lZGlhX3NlbGVjdGVkLmlkID0gJ21lZGlhLXNlbGVjdGVkJztcclxuXHJcbiAgICAgICAgdm0ub3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnb3ZlcmxheS1tZWRpYScpO1xyXG5cclxuICAgICAgICB2bS5tZWRpYV9zZWxlY3RlZC5hcHBlbmRDaGlsZCh2bS5vdmVybGF5KTtcclxuXHJcbiAgICAgICAgdm0ucm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0ucm93LmNsYXNzTGlzdC5hZGQoJ3JvdycsJ2p1c3RpZnktY2VudGVyJywnbWVkaWEtY29udGFpbmVyJyk7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaiA9IDA7IGogPCB2bS5lbGVtZW50cy5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgICAgIHZtLmNvbG1kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIHZtLmNvbG1kLmNsYXNzTGlzdC5hZGQoJ2NvbC14cycpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGh0bWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgICAgICBodG1sLmNsYXNzTGlzdC5hZGQoJ21lZGlhLWl0ZW0nKTtcclxuICAgICAgICAgICAgdmFyIG1lZGlhX2l0ZW0gPSBuZXcgTWVkaWFJdGVtKHZtLGh0bWwsaik7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhX2l0ZW1zLnB1c2gobWVkaWFfaXRlbSk7XHJcblxyXG4gICAgICAgICAgICB2bS50aHVtYm5haWxzLnB1c2goZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJykpO1xyXG4gICAgICAgICAgICB2bS50aHVtYm5haWxzW2pdLmNsYXNzTGlzdC5hZGQoJ2Ryb3BzaGFkb3cnKTtcclxuICAgICAgICAgICAgdm0udGh1bWJuYWlsc1tqXS5zcmMgPSB0aHVtYm5haWxzW2pdO1xyXG5cclxuICAgICAgICAgICAgdm0uY29sbWQuYXBwZW5kQ2hpbGQodm0ubWVkaWFfaXRlbXNbal0uaHRtbCk7XHJcbiAgICAgICAgICAgIHZtLmNvbG1kLmFwcGVuZENoaWxkKHZtLnRodW1ibmFpbHNbal0pO1xyXG4gICAgICAgICAgICB2bS5yb3cuYXBwZW5kQ2hpbGQodm0uY29sbWQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICAgI21lZGlhLXNlbGVjdGVkXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIC5vdmVybGF5XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKS5kcm9wc2hhZG93XHJcbiAgICAgICAgLy8gICAgICAgICAgLnJvdy5qdXN0aWZ5LWNlbnRlci5tZWRpYS1jb250YWluZXJcclxuICAgICAgICAvLyAgICAgICAgICAgICAgLmNvbC1tZFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgLm1lZGlhLWl0ZW1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKS5kcm9wc2hhZG93XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIC5jb2wtbWRcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIC5tZWRpYS1pdGVtXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICBpbWcoc3JjPVwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIikuZHJvcHNoYWRvd1xyXG5cclxuXHJcbiAgICAgICAgdm0ubWVkaWFfaXRlbXNbdm0uc2VsZWN0ZWRdLmh0bWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcclxuICAgICAgICAvLyB2bS5lbGVtZW50cy5wdXNoKHZtLmVsZW1lbnRzWzBdKTtcclxuICAgICAgICAvLyB2bS5lbGVtZW50cy5zaGlmdCgpO1xyXG4gICAgICAgIC8vIHZtLnNldElkKGlkKTtcclxuICAgICAgICAvLyB2bS5sb2FkTWVkaWEoMCk7XHJcblxyXG4gICAgfVxyXG4gICAgY3JlYXRlRnJhZ21lbnQoc3RyOiBzdHJpbmcsIHdpZHRoPzogbnVtYmVyLCBoZWlnaHQ/OiBudW1iZXIgKSB7XHJcbiAgICAgICAgdmFyIG5ld3N0ciA9IHN0cjtcclxuICAgICAgICBpZih3aWR0aCl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBuZXdzdHIgPSBzdHIucmVwbGFjZSgnd2lkdGg9XCJcXGQrXCIgaGVpZ2h0PVwiXFxkK1wiJywgJ3dpZHRoPVwiJyt3aWR0aCsnXCIgaGVpZ2h0PVwiJytoZWlnaHQrJ1wiJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcblxyXG4gICAgICAgIHZhciBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgPSBzdHI7XHJcblxyXG4gICAgICAgIHdoaWxlIChlbGVtLmNoaWxkTm9kZXNbMF0pIHtcclxuICAgICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChlbGVtLmNoaWxkTm9kZXNbMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZnJhZztcclxuICAgIH1cclxuXHJcbiAgICBzZXRJZChpZDogc3RyaW5nKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICB3aGlsZShwYXJlbnQuZmlyc3RDaGlsZCl7XHJcbiAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYXJlbnQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh2bS5tZWRpYV9zZWxlY3RlZCk7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHZtLnJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2l6ZSgpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5vdmVybGF5LnN0eWxlLndpZHRoID0gKHZtLm1lZGlhX3NlbGVjdGVkLmNsaWVudFdpZHRoKzEyKSsncHgnO1xyXG4gICAgICAgIHZtLm92ZXJsYXkuc3R5bGUuaGVpZ2h0ID0gKHZtLm1lZGlhX3NlbGVjdGVkLmNsaWVudEhlaWdodCs4KSsncHgnO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRNZWRpYSh0aHVtYl9udW06bnVtYmVyKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5tZWRpYV9zZWxlY3RlZC5yZW1vdmVDaGlsZCh2bS5tZWRpYV9zZWxlY3RlZC5maXJzdENoaWxkKTtcclxuICAgICAgICB2bS5vdmVybGF5LmNsYXNzTGlzdC5hZGQoJ2Nsb3NlLW1lZGlhJyk7XHJcblxyXG4gICAgICAgIHZtLnNpemUoKTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHZtLm1lZGlhX2l0ZW1zLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgdm0ubWVkaWFfaXRlbXNbaV0uaHRtbC5zdHlsZS53aWR0aCA9IHZtLmNvbG1kLmNsaWVudFdpZHRoKydweCc7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhX2l0ZW1zW2ldLmh0bWwuc3R5bGUuaGVpZ2h0ID0gdm0uY29sbWQuY2xpZW50SGVpZ2h0KydweCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih2bS52aW1lbyAmJiB0aHVtYl9udW0gPT09IDApe1xyXG4gICAgICAgICAgICAgICAgdm0uZWxlbWVudHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIHZhciBmcmFnID0gdm0uY3JlYXRlRnJhZ21lbnQodm0udmltZW8sIHZtLm1lZGlhX3NlbGVjdGVkLmNsaWVudFdpZHRoLCB2bS5tZWRpYV9zZWxlY3RlZC5jbGllbnRIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgdm0uZWxlbWVudHMudW5zaGlmdChmcmFnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2bS5vdmVybGF5LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuICAgICAgICAgICAgICAgIC8vIHZtLmVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQoJ2Ryb3BzaGFkb3cnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2bS5vdmVybGF5LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLypidXR0b24gdHJhbnNpdGlvbiovXHJcbiAgICAgICAgdm0ubWVkaWFfaXRlbXNbdm0uc2VsZWN0ZWRdLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcclxuICAgICAgICB2bS5zZWxlY3RlZCA9IHRodW1iX251bTtcclxuICAgICAgICB2bS5tZWRpYV9pdGVtc1t2bS5zZWxlY3RlZF0uaHRtbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG5cclxuICAgICAgICAvKnBpY3R1cmUgdHJhbnNpdGlvbiovXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgLy8gaWYodm0udmltZW8gJiYgdm0uc2VsZWN0ZWQgPT09IDApe1xyXG5cclxuICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgaWYgKHZtLm1lZGlhX3NlbGVjdGVkLmNoaWxkcmVuLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQucmVtb3ZlQ2hpbGQodm0ubWVkaWFfc2VsZWN0ZWQubGFzdENoaWxkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQuYXBwZW5kQ2hpbGQodm0uZWxlbWVudHNbdm0uc2VsZWN0ZWRdKTtcclxuICAgICAgICAgICAgdm0ub3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdjbG9zZS1tZWRpYScpO1xyXG4gICAgICAgICAgICB2bS5tZWRpYV9pdGVtc1t2bS5zZWxlY3RlZF0uaHRtbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgIH0sIDYwMCk7ICAgXHJcbiAgICB9XHJcbn0iLCJleHBvcnQgKiBmcm9tIFwiLi9za2lsbF9iYWRnZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNraWxsIHtcclxuICBmbGV4X2l0ZW06IEhUTUxEaXZFbGVtZW50O1xyXG4gIHN2ZzogU1ZHU1ZHRWxlbWVudDtcclxuICBzdmdfY2lyY2xlOiBTVkdDaXJjbGVFbGVtZW50O1xyXG4gIHNjYWxlX2JveDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgaW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgdGV4dDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgZmxleF9ncmlkX2lkOiBzdHJpbmc7XHJcbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjbGFzc3BlcmNlbnQ6IHN0cmluZywgaW1hZ2U6IHN0cmluZywgZmxleF9ncmlkX2lkOiBzdHJpbmcsIGJsYWNrdGV4dDogYm9vbGVhbikge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgIHZtLmZsZXhfZ3JpZF9pZCA9IGZsZXhfZ3JpZF9pZDtcclxuXHJcbiAgICB2bS5mbGV4X2l0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHZtLmZsZXhfaXRlbS5jbGFzc05hbWUgKz0gJ2ZsZXgtaXRlbSc7XHJcblxyXG4gICAgdm0uc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJzdmdcIilcclxuICAgIHZtLnN2Zy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NwZXJjZW50KVxyXG4gICAgdm0uc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnODQnKTtcclxuICAgIHZtLnN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICc4NCcpO1xyXG5cclxuICAgIHZtLnN2Z19jaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAnY2lyY2xlJyk7XHJcbiAgICB2bS5zdmdfY2lyY2xlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdjbGFzcycsICdvdXRlcicpO1xyXG4gICAgdm0uc3ZnX2NpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCBcImN4XCIsICctNDInKTtcclxuICAgIHZtLnN2Z19jaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgXCJjeVwiLCAnNDInKTtcclxuICAgIHZtLnN2Z19jaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgXCJyXCIsICczNycpO1xyXG4gICAgdm0uc3ZnX2NpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCBcInRyYW5zZm9ybVwiLCBcInJvdGF0ZSgtOTAsIDAsIDApXCIpO1xyXG5cclxuICAgIHZtLnNjYWxlX2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgaWYgKG5hbWUgPT09IFwiVHlwZSBTY3JpcHRcIiB8fCBuYW1lID09PSBcIkJvb3RzdHJhcFwiIHx8IG5hbWUgPT09IFwiRDMuanNcIiB8fCBuYW1lID09PSBcIlBob3Rvc2hvcFwiIHx8IG5hbWUgPT09IFwiSWxsdXN0cmF0b3JcIiB8fCBuYW1lID09PSBcIkFmdGVyIEVmZmVjdHNcIiB8fCBuYW1lID09PSBcIk1heWFcIiB8fCBuYW1lID09PSBcIk11ZGJveFwiKSB7XHJcbiAgICAgIHZtLnNjYWxlX2JveC5jbGFzc05hbWUgKz0gJ3NjYWxlLWJveC1zcXVhcmUnO1xyXG4gICAgfSBlbHNlIGlmIChuYW1lID09PSBcIlVuaXR5XCIgfHwgbmFtZSA9PT0gXCJQaGFzZXIuanNcIiB8fCBuYW1lID09PSBcIkQzLmpzXCIgfHwgbmFtZSA9PT0gXCJTQ1NTXCIgfHwgbmFtZSA9PT0gXCJKYXZhXCIgfHwgbmFtZSA9PT0gXCJQeXRob25cIikge1xyXG4gICAgICB2bS5zY2FsZV9ib3guY2xhc3NOYW1lICs9ICdzY2FsZS1ib3gtbWlkJztcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2bS5zY2FsZV9ib3guY2xhc3NOYW1lICs9ICdzY2FsZS1ib3gnO1xyXG4gICAgfVxyXG5cclxuICAgIHZtLmltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICB2bS5pbWFnZS5zcmMgPSBpbWFnZTtcclxuXHJcbiAgICB2bS50ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBpZiAoYmxhY2t0ZXh0KSB7XHJcbiAgICAgIHZtLnRleHQuY2xhc3NOYW1lICs9ICd0ZXh0IGJsYWNrLXRleHQnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdm0udGV4dC5jbGFzc05hbWUgKz0gJ3RleHQnO1xyXG4gICAgfVxyXG4gICAgdm0udGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShuYW1lKSk7XHJcblxyXG4gICAgLy8gLmZsZXgtaXRlbVxyXG4gICAgLy8gICAgICAgc3ZnLmNpcmNsZS03NSh3aWR0aD0nODQnLCBoZWlnaHQ9Jzg0JylcclxuICAgIC8vICAgICAgICAgY2lyY2xlLm91dGVyKGN4PSctNDInLCBjeT0nNDInLCByPSczNycgdHJhbnNmb3JtPVwicm90YXRlKC05MCwgMCwgMClcIikgXHJcbiAgICAvLyAgICAgICAuc2NhbGUtYm94XHJcbiAgICAvLyAgICAgICAgIGltZyhpZD1cImZvdXJcIilcclxuICAgIC8vICAgICAgICAgLnRleHQgYWJjXHJcbiAgICB2bS5mbGV4X2l0ZW0uYXBwZW5kQ2hpbGQodm0uc3ZnKTtcclxuICAgIHZtLnN2Zy5hcHBlbmRDaGlsZCh2bS5zdmdfY2lyY2xlKTtcclxuICAgIHZtLmZsZXhfaXRlbS5hcHBlbmRDaGlsZCh2bS5zY2FsZV9ib3gpO1xyXG4gICAgdm0uc2NhbGVfYm94LmFwcGVuZENoaWxkKHZtLmltYWdlKTtcclxuICAgIHZtLmZsZXhfaXRlbS5hcHBlbmRDaGlsZCh2bS50ZXh0KTtcclxuICB9XHJcbiAgcmVzZXRJZChpZDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2bS5mbGV4X2dyaWRfaWQgPSBpZDtcclxuICB9XHJcblxyXG4gIGFwcGVuZCgpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZhciBmbGV4X2dyaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh2bS5mbGV4X2dyaWRfaWQpO1xyXG4gICAgZmxleF9ncmlkLmFwcGVuZENoaWxkKHZtLmZsZXhfaXRlbSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTa2lsbEluZm8ge1xyXG4gIG5hbWU6IHN0cmluZztcclxuICBjbGFzczogc3RyaW5nO1xyXG4gIGltYWdlOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xsZWN0aW9uIHtcclxuICBpZDogc3RyaW5nO1xyXG4gIGltYWdlczogSVNraWxsSW5mb1tdO1xyXG4gIHBhdGg6IHN0cmluZztcclxuICBza2lsbHM6IFNraWxsW107XHJcbiAgZmxleF9ncmlkX2lkOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZywgZmxleF9ncmlkX2lkOiBzdHJpbmcsIGltYWdlczogSVNraWxsSW5mb1tdLGJsYWNrdGV4dDogYm9vbGVhbiwgaWQ/OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICB2bS5pbWFnZXMgPSBpbWFnZXM7XHJcbiAgICB2bS5wYXRoID0gcGF0aDtcclxuICAgIHZtLmZsZXhfZ3JpZF9pZCA9IGZsZXhfZ3JpZF9pZDtcclxuXHJcbiAgICB2bS5za2lsbHMgPSBbXTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGltYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2bS5za2lsbHMucHVzaChuZXcgU2tpbGwoaW1hZ2VzW2ldLm5hbWUsIGltYWdlc1tpXS5jbGFzcywgdm0ucGF0aCArIGltYWdlc1tpXS5pbWFnZSwgdm0uZmxleF9ncmlkX2lkLCBibGFja3RleHQpKTtcclxuICAgIH1cclxuICAgIGlmIChpZCkge1xyXG4gICAgICB2bS5pZCA9IGlkO1xyXG4gICAgICB2YXIgZWxlbWVudCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh2bS5pZCk7XHJcbiAgICAgIGVsZW1lbnQub25tb3VzZXVwID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2bS5sb2FkKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyByZXNldElkcyhpZDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2bS5mbGV4X2dyaWRfaWQgPSBpZDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uc2tpbGxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZtLnNraWxsc1tpXS5yZXNldElkKHZtLmZsZXhfZ3JpZF9pZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbG9hZCgpIHsgLy9zZXRzIHNyYydzIHRvIHRoZSBkb20uIHRoZW4gb25jZSBldmVyeXRoaW5nIGlzIGxvYWRlZCwgaXQgYWRkcyBjbGFzcyBhY3RpdmUgdG8gbWFrZSB0aGVtIGFwcGVhciB2aWEgY3NzXHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2YXIgZmxleF9ncmlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodm0uZmxleF9ncmlkX2lkKTtcclxuICAgIHdoaWxlIChmbGV4X2dyaWQuZmlyc3RDaGlsZCkge1xyXG4gICAgICBmbGV4X2dyaWQucmVtb3ZlQ2hpbGQoZmxleF9ncmlkLmZpcnN0Q2hpbGQpO1xyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5za2lsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdm0uc2tpbGxzW2ldLmFwcGVuZCgpO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyBwdWJsaWMgY2xvc2UoKXtcclxuICAvLyAgIGNvbnN0IHZtID0gdGhpcztcclxuICAvLyAgIHZhciBmbGV4X2dyaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh2bS5mbGV4X2dyaWRfaWQpO1xyXG4gIC8vICAgd2hpbGUgKGZsZXhfZ3JpZC5maXJzdENoaWxkKSB7XHJcbiAgLy8gICAgIGZsZXhfZ3JpZC5yZW1vdmVDaGlsZChmbGV4X2dyaWQuZmlyc3RDaGlsZCk7XHJcbiAgLy8gICB9XHJcbiAgLy8gfVxyXG59XHJcbiJdfQ==
