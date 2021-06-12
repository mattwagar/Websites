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
    { "name": 'Python', "class": 'circle-75', "image": 'python-5.svg' },
    { "name": 'Java', "class": 'circle-50', "image": 'java-14.svg' },
    { "name": 'Node JS', "class": 'circle-25', "image": 'nodejs-icon.svg' },
], false, 'frontend');
var softeng = new skill_badge.Collection('./skills/', 'flex-grid2', [
    { "name": 'Unity', "class": 'circle-100', "image": 'unity.svg' },
    { "name": 'ARKit', "class": 'circle-75', "image": 'arkit.png' },
    { "name": 'Vuforia', "class": 'circle-75', "image": 'vuforia-logo.png' },
    { "name": 'Oculus VR', "class": 'circle-75', "image": 'oculus.png' },
    { "name": 'Leap Motion', "class": 'circle-75', "image": 'leap.png' },
    { "name": 'Open GL', "class": 'circle-25', "image": 'opengl2.svg' },
], false, 'softeng');
var design = new skill_badge.Collection('./skills/', 'flex-grid3', [
    { "name": 'Houdini', "class": 'circle-100', "image": 'houdini.png' },
    { "name": 'Illustrator', "class": 'circle-100', "image": 'adobe-illustrator-cc.svg' },
    { "name": 'Maya', "class": 'circle-75', "image": 'maya.png' },
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
m.push(new media.Media('', ['./portfolio/tutorial_04.png', './portfolio/tutorial_01.png', './portfolio/tutorial_02.png', './portfolio/tutorial_03.png'], ['./portfolio/tutorial_01.png', './portfolio/tutorial_02.png', './portfolio/tutorial_03.png'], '<iframe width="560" height="315" src="https://www.youtube.com/embed/MsZjUHhCjJ8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'));
m.push(new media.Media('', ["./portfolio/island_03.png", "./portfolio/island_01.png", "./portfolio/island_02.png"], ["./portfolio/island_01.png", "./portfolio/island_02.png"], '<iframe src="https://player.vimeo.com/video/456677243" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>'));
// m.push(new media.Media('', ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"], ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"]));
// m.push(new media.Media('', ["./portfolio/qbert_play.jpg", "./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], ["./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
// m.push(new media.Media('', ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"], ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"]));
// m.push(new media.Media('', ['./portfolio/mean_forecast_1.jpg', './portfolio/mean_forecast_2.jpg'], ['./portfolio/mean_forecast_1.jpg', './portfolio/mean_forecast_2.jpg']));
// m.push(new media.Media('', ['./portfolio/roast_6.png', './portfolio/roast_2.png', './portfolio/roast_3.png', './portfolio/roast_4.png'], ['./portfolio/roast_6.png', './portfolio/roast_2.png','./portfolio/roast_3.png', './portfolio/roast_4.png']));
m.push(new media.Media('', ['./portfolio/StoryGraph_Card.png', './portfolio/storygraph_1.png', './portfolio/storygraph_2.png'], ['./portfolio/storygraph_1.png', './portfolio/storygraph_2.png'], '<iframe src="https://player.vimeo.com/video/369747471" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/crowd_1.png', './portfolio/crowd_2.png', './portfolio/crowd_3.png'], ['./portfolio/crowd_1.png', './portfolio/crowd_2.png', './portfolio/crowd_3.png']));
m.push(new media.Media('', ['./portfolio/bioshroom_1.png', './portfolio/bioshroom_2.png', './portfolio/bioshroom_3.png', './portfolio/bioshroom_4.png'], ['./portfolio/bioshroom_1.png', './portfolio/bioshroom_2.png', './portfolio/bioshroom_3.png'], '<iframe src="https://player.vimeo.com/video/369752631" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/axonrush_1.png', './portfolio/axonrush_2.png', './portfolio/axonrush_3.gif'], ['./portfolio/axonrush_2.png', './portfolio/axonrush_3.gif'], '<iframe src="https://player.vimeo.com/video/438301388" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/robot_1.png', './portfolio/robot_2.png', './portfolio/robot_3.png'], ['./portfolio/robot_2.png', './portfolio/robot_3.png'], '<iframe src="https://player.vimeo.com/video/369784543" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/cave_3.png', './portfolio/cave_2.png', './portfolio/cave_1.png', './portfolio/cave_4.png'], ['./portfolio/cave_2.png', './portfolio/cave_1.png', './portfolio/cave_4.png'], '<iframe src="https://player.vimeo.com/video/369789127" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/tube_3.png', './portfolio/tube_2.png', './portfolio/tube_4.png'], ['./portfolio/tube_2.png', './portfolio/tube_4.png'], '<iframe src="https://player.vimeo.com/video/369955460" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ['./portfolio/hyperhop_01.gif', './portfolio/hyperhop_02.gif', './portfolio/hyperhop_03.gif'], ['./portfolio/hyperhop_01.gif', './portfolio/hyperhop_02.gif', './portfolio/hyperhop_03.gif']));
m.push(new media.Media('', ['./portfolio/bee_1.png', './portfolio/bee_2.png', './portfolio/bee_3.png'], ['./portfolio/bee_2.png', './portfolio/bee_3.png'], '<iframe src="https://player.vimeo.com/video/370220935" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
// m.push(new media.Media('', ['./portfolio/port_1.png', './portfolio/port_2.png', './portfolio/port_3.png',  './portfolio/port_4.png'], ['./portfolio/port_1.png', './portfolio/port_2.png', './portfolio/port_3.png', './portfolio/port_4.png']));
var portfolio = new Portfolio('portfolio', [
    { title: 'The Story Graph', title_image: './portfolio/StoryGraph_Card.png', desc: "The Story Graph is a node based visual scripting tool. Similar to Blueprints in Unreal Engine 4, The Story Graph makes scripting easy for designers and developers who want to prototype rapidly. This is a Unity Custom Editor Tool that can be bought on the Unity Asset Store.", stack: storygraph_stack, media: m[3], type: 'Unity Custom Editor Tool', url: 'https://assetstore.unity.com/packages/tools/visual-scripting/story-graph-136713' },
    { title: 'Island Designer', title_image: './portfolio/island.png', desc: "During my SideFX Internship I created an Island Designer game as an experimental prototype for Houdini generation of content during runtime. I developed this project entirely from the ground up, including all the Houdini procedural assets, user interface, and interactions. This island designer explores interactions such as painting grass, placing curved assets such as bridges and waterfalls, and placing randomly generated objects such as palm trees and houses. Along the way I learned a lot about Houdini procedural modeling, as well as pipeline integration with Unity. Please note that this was experimental only, and should not be seen as any indication for plans SideFX has for runtime generation of content.", stack: cave_stack, media: m[2], type: 'Houdini Game Demo', url: '' },
    { title: 'Procedural Modeling Tutorial', title_image: './portfolio/lahug.jpeg', desc: "A tutorial presented at the LA Houdini User Group on procedural modeling for games using Houdini. Showcases the basics of VEX, and how I went about creating a procedural bridge during my Houdini Internship.", stack: cave_stack, media: m[1], type: 'Houdini Tutorial', url: 'https://www.youtube.com/watch?v=MsZjUHhCjJ8' },
    { title: 'Hyperhop: Galactic Lancer', title_image: './portfolio/hyperhop.png', desc: "Hyperhop is my Ludum Dare 46 Game Jam submission. On a team of four, in just 72 hours I modeled, animated, and scripted behavior the of the planets, as well as rigged the main character. I learned a lot about blendshapes and creating facial rigs in Houdini as well as animation states in Unity.", stack: cave_stack, media: m[10], type: 'Unity Game', url: 'https://swanijam.itch.io/hyperhop' },
    { title: 'Axon Rush', title_image: './portfolio/axonrush.png', desc: "Axon Rush is my Global Game Jam 2020 submission. On a team of six, we wanted to make a game about mental health... literally! Our game Axon Rush is a 3D Platformer where it is your job to repair the the brain by shooting electric impulses to broken axons. I worked on VFX and the player character shooting behavior.", stack: cave_stack, media: m[6], type: 'Unity Game', url: 'https://globalgamejam.org/2020/games/axon-rush-2' },
    { title: 'Bioshroom', title_image: './portfolio/bioshroom_card.png', desc: "Bioshroom is a first person exploration and gardening game. You are a Biologist exploring a foreign planet infested with mushrooms. It is your goal to explore the planet, gather new mushrooms, and breed them to send back to your home planet. On this project I worked as a technical artist and developer. I developed a procedural mushroom using blendshapes, as well as a mushroom spawner that uses vertex colors on the ground.", stack: rem_stack, media: m[5], type: 'Unity Game', url: '' },
    { title: 'And the Crowd Goes Wild!', title_image: './portfolio/crowd_card.png', desc: "And the Crowd Goes Wild is a virtual reality interactive experience where you put on a magic show for an audience of ghosts. This experience uses Oculus VR as well as the Leapmotion to truly simulate magic coming out of your fingertips via Leap Motion gestures. I developed this game entirely using The Story Graph, the Unity Custom Editor Tool I created. Made in only 1 month for my Introduction to Virtual Reality class, this experience explores Virtual Reality User Experience design with gesture based controls.", stack: storygraph_stack, media: m[4], type: 'Unity VR Experience', url: '' },
    { title: 'Hive Jive', title_image: './portfolio/bee_card.png', desc: "Hive Jive is a virtual reality game where you fly around as a bee. The goal of the game is to repollinate the island and clear it of all its trash. I worked in a group as a Technical Artist, where I created the bee fur shader, the grass shader, rigging the bee, and setting up GPU painting on the player controller. This game was shown at Siggraph at Drexel University's booth using a Motorbike Controller.", stack: bee_stack, media: m[11], type: 'Virtual Reality Game', url: '' },
    { title: 'Procedural Cave', title_image: './portfolio/cave_card.png', desc: "This Procedural Cave has controls number of rooms, stalagmites, number of hallways between rooms, as well as using a proceudral material. The procedural material is exported from Houdini's texture baker, and brought into Unity. Perfect asset for any dungeon crawler.", stack: cave_stack, media: m[8], type: 'Houdini Model', url: '' },
    { title: 'Tube Dome Experience', title_image: './portfolio/tube_card.png', desc: "For a Dome exhibit I created an abstract tube animation using distance field volumes, and a GPU proceudral mesh compute shader in Unity. To export for the dome, I developed a Fisheye Lens Render Pipeline. For this project I leveraged open source from Keijiro.", stack: storygraph_stack, media: m[9], type: 'Immersive Experience', url: '' },
    { title: 'Rem', title_image: './portfolio/rememberence_logo.jpg', desc: "Rem is a video game about a young girl trapped in a comatose dreamscape. You play as a young girl who must overcome her fears to remember her past. In this fun, over-the-shoulder stealth game you must avoid screen headed enemies, and find mementos of your past. For this project I worked in many areas including Level Design, Visual Effects, Web Development, Modeling, and Documentation.", stack: rem_stack, media: m[0], type: 'Unity Game', url: 'https://offbrandhellui.herokuapp.com/#/home' },
    { title: 'Door to Door', title_image: './portfolio/robot_card.png', desc: "As part of my Animation class, I created a short film about a robot who goes through many strange worlds. I modeled, textured, rigged, and animated everything and rendered out in Unity. I also created a toon shader with a highlight and outline as well as did some VFX in Unity. It was a huge learning experience to go through every part of the animation pipeline!", stack: rem_stack, media: m[7], type: 'Robot Animation', url: '' }
]);
// { title: 'Roast', title_image: './portfolio/roast_7.jpg', desc: "Roast is a webapp that surveys comfort in an indoor space. It asks questions that gauge temperature, noise, smell, and humidity, and maps it to where you are on your building's floorplan. Through this crowd sourced data collected, building managers, architects and the people taking the survey can understand how people feel in a space. I worked on this project for 6 months while I was working at the architecture firm, Kieran Timberlake.", stack: roast_stack, media: m[5], type: 'Web App', url: '' },
// { title: 'Portfolio', title_image: './portfolio/port_1.png', desc: "From concept to design to development I put a lot of love into this. As a personal challenge I created this website entirely in Typescript with no jQuery. All in all I can conclude that jQuery is overrated! Java Script is powerful enough on its own.", stack: port_stack, media: m[7], type: 'Website', url: 'https://github.com/mattwagar/Websites/tree/master/portfolio_website_v2' },
// { title: 'Breathless', title_image: './portfolio/breathless.jpg', desc: "The Space Pirate, Aria, is on a mission to loot a mineral cargo ship. However, upon landing on the cargo ship, Aria's helmet cracks causing her to slowly lose oxygen. It's now a race against time to collect all the gems before her oxygen runs out!", stack: breathless_stack, media: m[2], type: 'HTML5 Game', url: '/breathless' }]);
// { title: 'Breathless', title_image: './portfolio/breathless.jpg', desc: "The Space Pirate, Aria, is on a mission to loot a mineral cargo ship. However, upon landing on the cargo ship, Aria's helmet cracks causing her to slowly lose oxygen. It's now a race against time to collect all the gems before her oxygen runs out!", stack: breathless_stack, media: m[2], type: 'HTML5 Game', url: '/breathless' }]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvanVtcC5qcy9kaXN0L2p1bXAuanMiLCJzcmMvaW1hZ2VfY2FudmFzLnRzIiwic3JjL21haW4udHMiLCJzcmMvbWVkaWEudHMiLCJzcmMvc2tpbGxfYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFMLENBQUM7UUFFRCxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7SUFHbkIsQ0FBQztJQUVNLDZCQUFTLEdBQWhCO1FBQ0ksSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFFcEMscUNBQXFDO1FBQ3JDLElBQUksV0FBVyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1UCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUUxQyxnREFBZ0Q7WUFD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LEVBQUUsQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMxQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDeEMsQ0FBQztJQUNILENBQUM7SUFFTSx5QkFBSSxHQUFYO1FBQ0UsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3pELE9BQU8sU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzVCLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFDRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDMUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN4QixDQUFDO0lBQ0gsQ0FBQztJQVFILGlCQUFDO0FBQUQsQ0FyREEsQUFxREMsSUFBQTtBQXJEWSxnQ0FBVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwuSnVtcCA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuLy8gUm9iZXJ0IFBlbm5lcidzIGVhc2VJbk91dFF1YWRcblxuLy8gZmluZCB0aGUgcmVzdCBvZiBoaXMgZWFzaW5nIGZ1bmN0aW9ucyBoZXJlOiBodHRwOi8vcm9iZXJ0cGVubmVyLmNvbS9lYXNpbmcvXG4vLyBmaW5kIHRoZW0gZXhwb3J0ZWQgZm9yIEVTNiBjb25zdW1wdGlvbiBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vamF4Z2VsbGVyL2V6LmpzXG5cbnZhciBlYXNlSW5PdXRRdWFkID0gZnVuY3Rpb24gZWFzZUluT3V0UXVhZCh0LCBiLCBjLCBkKSB7XG4gIHQgLz0gZCAvIDI7XG4gIGlmICh0IDwgMSkgcmV0dXJuIGMgLyAyICogdCAqIHQgKyBiO1xuICB0LS07XG4gIHJldHVybiAtYyAvIDIgKiAodCAqICh0IC0gMikgLSAxKSArIGI7XG59O1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iajtcbn0gOiBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xufTtcblxudmFyIGp1bXBlciA9IGZ1bmN0aW9uIGp1bXBlcigpIHtcbiAgLy8gcHJpdmF0ZSB2YXJpYWJsZSBjYWNoZVxuICAvLyBubyB2YXJpYWJsZXMgYXJlIGNyZWF0ZWQgZHVyaW5nIGEganVtcCwgcHJldmVudGluZyBtZW1vcnkgbGVha3NcblxuICB2YXIgZWxlbWVudCA9IHZvaWQgMDsgLy8gZWxlbWVudCB0byBzY3JvbGwgdG8gICAgICAgICAgICAgICAgICAgKG5vZGUpXG5cbiAgdmFyIHN0YXJ0ID0gdm9pZCAwOyAvLyB3aGVyZSBzY3JvbGwgc3RhcnRzICAgICAgICAgICAgICAgICAgICAocHgpXG4gIHZhciBzdG9wID0gdm9pZCAwOyAvLyB3aGVyZSBzY3JvbGwgc3RvcHMgICAgICAgICAgICAgICAgICAgICAocHgpXG5cbiAgdmFyIG9mZnNldCA9IHZvaWQgMDsgLy8gYWRqdXN0bWVudCBmcm9tIHRoZSBzdG9wIHBvc2l0aW9uICAgICAgKHB4KVxuICB2YXIgZWFzaW5nID0gdm9pZCAwOyAvLyBlYXNpbmcgZnVuY3Rpb24gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24pXG4gIHZhciBhMTF5ID0gdm9pZCAwOyAvLyBhY2Nlc3NpYmlsaXR5IHN1cHBvcnQgZmxhZyAgICAgICAgICAgICAoYm9vbGVhbilcblxuICB2YXIgZGlzdGFuY2UgPSB2b2lkIDA7IC8vIGRpc3RhbmNlIG9mIHNjcm9sbCAgICAgICAgICAgICAgICAgICAgIChweClcbiAgdmFyIGR1cmF0aW9uID0gdm9pZCAwOyAvLyBzY3JvbGwgZHVyYXRpb24gICAgICAgICAgICAgICAgICAgICAgICAobXMpXG5cbiAgdmFyIHRpbWVTdGFydCA9IHZvaWQgMDsgLy8gdGltZSBzY3JvbGwgc3RhcnRlZCAgICAgICAgICAgICAgICAgICAgKG1zKVxuICB2YXIgdGltZUVsYXBzZWQgPSB2b2lkIDA7IC8vIHRpbWUgc3BlbnQgc2Nyb2xsaW5nIHRodXMgZmFyICAgICAgICAgIChtcylcblxuICB2YXIgbmV4dCA9IHZvaWQgMDsgLy8gbmV4dCBzY3JvbGwgcG9zaXRpb24gICAgICAgICAgICAgICAgICAgKHB4KVxuXG4gIHZhciBjYWxsYmFjayA9IHZvaWQgMDsgLy8gdG8gY2FsbCB3aGVuIGRvbmUgc2Nyb2xsaW5nICAgICAgICAgICAgKGZ1bmN0aW9uKVxuXG4gIC8vIHNjcm9sbCBwb3NpdGlvbiBoZWxwZXJcblxuICBmdW5jdGlvbiBsb2NhdGlvbigpIHtcbiAgICByZXR1cm4gd2luZG93LnNjcm9sbFkgfHwgd2luZG93LnBhZ2VZT2Zmc2V0O1xuICB9XG5cbiAgLy8gZWxlbWVudCBvZmZzZXQgaGVscGVyXG5cbiAgZnVuY3Rpb24gdG9wKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBzdGFydDtcbiAgfVxuXG4gIC8vIHJBRiBsb29wIGhlbHBlclxuXG4gIGZ1bmN0aW9uIGxvb3AodGltZUN1cnJlbnQpIHtcbiAgICAvLyBzdG9yZSB0aW1lIHNjcm9sbCBzdGFydGVkLCBpZiBub3Qgc3RhcnRlZCBhbHJlYWR5XG4gICAgaWYgKCF0aW1lU3RhcnQpIHtcbiAgICAgIHRpbWVTdGFydCA9IHRpbWVDdXJyZW50O1xuICAgIH1cblxuICAgIC8vIGRldGVybWluZSB0aW1lIHNwZW50IHNjcm9sbGluZyBzbyBmYXJcbiAgICB0aW1lRWxhcHNlZCA9IHRpbWVDdXJyZW50IC0gdGltZVN0YXJ0O1xuXG4gICAgLy8gY2FsY3VsYXRlIG5leHQgc2Nyb2xsIHBvc2l0aW9uXG4gICAgbmV4dCA9IGVhc2luZyh0aW1lRWxhcHNlZCwgc3RhcnQsIGRpc3RhbmNlLCBkdXJhdGlvbik7XG5cbiAgICAvLyBzY3JvbGwgdG8gaXRcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgbmV4dCk7XG5cbiAgICAvLyBjaGVjayBwcm9ncmVzc1xuICAgIHRpbWVFbGFwc2VkIDwgZHVyYXRpb24gPyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApIC8vIGNvbnRpbnVlIHNjcm9sbCBsb29wXG4gICAgOiBkb25lKCk7IC8vIHNjcm9sbGluZyBpcyBkb25lXG4gIH1cblxuICAvLyBzY3JvbGwgZmluaXNoZWQgaGVscGVyXG5cbiAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAvLyBhY2NvdW50IGZvciByQUYgdGltZSByb3VuZGluZyBpbmFjY3VyYWNpZXNcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc3RhcnQgKyBkaXN0YW5jZSk7XG5cbiAgICAvLyBpZiBzY3JvbGxpbmcgdG8gYW4gZWxlbWVudCwgYW5kIGFjY2Vzc2liaWxpdHkgaXMgZW5hYmxlZFxuICAgIGlmIChlbGVtZW50ICYmIGExMXkpIHtcbiAgICAgIC8vIGFkZCB0YWJpbmRleCBpbmRpY2F0aW5nIHByb2dyYW1tYXRpYyBmb2N1c1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG5cbiAgICAgIC8vIGZvY3VzIHRoZSBlbGVtZW50XG4gICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgLy8gaWYgaXQgZXhpc3RzLCBmaXJlIHRoZSBjYWxsYmFja1xuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuXG4gICAgLy8gcmVzZXQgdGltZSBmb3IgbmV4dCBqdW1wXG4gICAgdGltZVN0YXJ0ID0gZmFsc2U7XG4gIH1cblxuICAvLyBBUElcblxuICBmdW5jdGlvbiBqdW1wKHRhcmdldCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIC8vIHJlc29sdmUgb3B0aW9ucywgb3IgdXNlIGRlZmF1bHRzXG4gICAgZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uIHx8IDEwMDA7XG4gICAgb2Zmc2V0ID0gb3B0aW9ucy5vZmZzZXQgfHwgMDtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2s7IC8vIFwidW5kZWZpbmVkXCIgaXMgYSBzdWl0YWJsZSBkZWZhdWx0LCBhbmQgd29uJ3QgYmUgY2FsbGVkXG4gICAgZWFzaW5nID0gb3B0aW9ucy5lYXNpbmcgfHwgZWFzZUluT3V0UXVhZDtcbiAgICBhMTF5ID0gb3B0aW9ucy5hMTF5IHx8IGZhbHNlO1xuXG4gICAgLy8gY2FjaGUgc3RhcnRpbmcgcG9zaXRpb25cbiAgICBzdGFydCA9IGxvY2F0aW9uKCk7XG5cbiAgICAvLyByZXNvbHZlIHRhcmdldFxuICAgIHN3aXRjaCAodHlwZW9mIHRhcmdldCA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YodGFyZ2V0KSkge1xuICAgICAgLy8gc2Nyb2xsIGZyb20gY3VycmVudCBwb3NpdGlvblxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgZWxlbWVudCA9IHVuZGVmaW5lZDsgLy8gbm8gZWxlbWVudCB0byBzY3JvbGwgdG9cbiAgICAgICAgYTExeSA9IGZhbHNlOyAvLyBtYWtlIHN1cmUgYWNjZXNzaWJpbGl0eSBpcyBvZmZcbiAgICAgICAgc3RvcCA9IHN0YXJ0ICsgdGFyZ2V0O1xuICAgICAgICBicmVhaztcblxuICAgICAgLy8gc2Nyb2xsIHRvIGVsZW1lbnQgKG5vZGUpXG4gICAgICAvLyBib3VuZGluZyByZWN0IGlzIHJlbGF0aXZlIHRvIHRoZSB2aWV3cG9ydFxuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgZWxlbWVudCA9IHRhcmdldDtcbiAgICAgICAgc3RvcCA9IHRvcChlbGVtZW50KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIHNjcm9sbCB0byBlbGVtZW50IChzZWxlY3RvcilcbiAgICAgIC8vIGJvdW5kaW5nIHJlY3QgaXMgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuICAgICAgICBzdG9wID0gdG9wKGVsZW1lbnQpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyByZXNvbHZlIHNjcm9sbCBkaXN0YW5jZSwgYWNjb3VudGluZyBmb3Igb2Zmc2V0XG4gICAgZGlzdGFuY2UgPSBzdG9wIC0gc3RhcnQgKyBvZmZzZXQ7XG5cbiAgICAvLyByZXNvbHZlIGR1cmF0aW9uXG4gICAgc3dpdGNoIChfdHlwZW9mKG9wdGlvbnMuZHVyYXRpb24pKSB7XG4gICAgICAvLyBudW1iZXIgaW4gbXNcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbjtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIGZ1bmN0aW9uIHBhc3NlZCB0aGUgZGlzdGFuY2Ugb2YgdGhlIHNjcm9sbFxuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb24oZGlzdGFuY2UpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBzdGFydCB0aGUgbG9vcFxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gIH1cblxuICAvLyBleHBvc2Ugb25seSB0aGUganVtcCBtZXRob2RcbiAgcmV0dXJuIGp1bXA7XG59O1xuXG4vLyBleHBvcnQgc2luZ2xldG9uXG5cbnZhciBzaW5nbGV0b24gPSBqdW1wZXIoKTtcblxucmV0dXJuIHNpbmdsZXRvbjtcblxufSkpKTtcbiIsIlxyXG5leHBvcnQgKiBmcm9tIFwiLi9pbWFnZV9jYW52YXNcIjtcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbGVycChmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIsIHBlcmNlbnQ6IG51bWJlcikge1xyXG4gIHZhciBkaWZmZXJhbmNlID0gdG8gLSBmcm9tO1xyXG4gIHJldHVybiBmcm9tICsgKGRpZmZlcmFuY2UgKiBwZXJjZW50KTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBJbWcge1xyXG4gIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgaW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnRcclxuICB3OiBudW1iZXI7XHJcbiAgaDogbnVtYmVyO1xyXG4gIHhfb2Zmc2V0X2Rlc3Q6IG51bWJlcjtcclxuICB5X29mZnNldF9kZXN0OiBudW1iZXI7XHJcbiAgeF9vZmZzZXQ6IG51bWJlcjtcclxuICB5X29mZnNldDogbnVtYmVyO1xyXG4gIGFuY2hvclg6IG51bWJlcjtcclxuICBhbmNob3JZOiBudW1iZXI7XHJcblxyXG4gIGltZ1dpZHRoOiBudW1iZXI7XHJcbiAgc2NyZWVuV2lkdGg6IG51bWJlcjtcclxuICBzY2FsZVg6IG51bWJlcjtcclxuICBzY2FsZVk6IG51bWJlcjtcclxuICBzY2FsZTogbnVtYmVyO1xyXG4gIGltZ0hlaWdodDogbnVtYmVyO1xyXG4gIHNjcmVlbkhlaWdodDogbnVtYmVyO1xyXG5cclxuICBsb2FkZWQ6IGJvb2xlYW47XHJcblxyXG5cclxuICBjb25zdHJ1Y3Rvcih3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdm0uY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICB2bS5jdHggPSB2bS5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIHZtLncgPSB2bS5jYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgIHZtLmggPSB2bS5jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgdm0uaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIHZtLmltYWdlLnNyYyA9ICdwZXJsaW5fYmFja2dyb3VuZC5wbmcnO1xyXG4gICAgdm0ubG9hZGVkID0gZmFsc2U7XHJcblxyXG4gICAgdm0uaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2bS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICB2bS5zaXplKHZtLncsIHZtLmgpO1xyXG4gICAgICB2bS5kcmF3KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2l6ZSh3LCBoKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgdm0udyA9IHZtLmNhbnZhcy53aWR0aCA9IHc7XHJcbiAgICB2bS5oID0gdm0uY2FudmFzLmhlaWdodCA9IGg7XHJcblxyXG4gICAgLypnZXRzIHNjYWxlWCBiYXNlZCBvbiBzY3JlZW4gYW5kIGltYWdlIHdpZHRoICovXHJcbiAgICB2bS5pbWdXaWR0aCA9IHZtLmltYWdlLm5hdHVyYWxXaWR0aDtcclxuICAgIHZtLnNjcmVlbldpZHRoID0gdztcclxuICAgIHZtLnNjYWxlWCA9IHZtLnNjcmVlbldpZHRoIC8gdm0uaW1nV2lkdGg7XHJcblxyXG4gICAgLypnZXRzIHNjYWxlWSBiYXNlZCBvbiBzY3JlZW4gYW5kIGltYWdlIHdpZHRoICovXHJcbiAgICB2bS5pbWdIZWlnaHQgPSB2bS5pbWFnZS5uYXR1cmFsSGVpZ2h0O1xyXG4gICAgdm0uc2NyZWVuSGVpZ2h0ID0gaDtcclxuICAgIHZtLnNjYWxlWSA9IHZtLnNjcmVlbkhlaWdodCAvIHZtLmltZ0hlaWdodDtcclxuXHJcblxyXG4gICAgLypzZXRzIGJhc2ljIHNjYWxlIHRvIFggKi9cclxuXHJcbiAgICB2bS5zY2FsZSA9IHZtLnNjYWxlWFxyXG4gICAgaWYgKHZtLnNjYWxlWCA8IHZtLnNjYWxlWSkge1xyXG4gICAgICB2bS5zY2FsZSA9IHZtLnNjYWxlWTtcclxuICAgIH1cclxuXHJcbiAgICB2bS5pbWdXaWR0aCAqPSB2bS5zY2FsZSAqIDEuMTtcclxuICAgIHZtLmltZ0hlaWdodCAqPSB2bS5zY2FsZSAqIDEuMDE7XHJcblxyXG4gICAgdm0uYW5jaG9yWCA9ICh2bS5pbWdXaWR0aCAtIHZtLnNjcmVlbldpZHRoKTtcclxuICAgIHZtLmFuY2hvclkgPSAodm0uaW1nSGVpZ2h0IC0gdm0uc2NyZWVuSGVpZ2h0KTtcclxuXHJcbiAgICB2bS54X29mZnNldF9kZXN0ID0gdm0ueF9vZmZzZXQgPSB2bS5hbmNob3JYO1xyXG4gICAgdm0ueV9vZmZzZXRfZGVzdCA9IHZtLnlfb2Zmc2V0ID0gdm0uYW5jaG9yWTtcclxuXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhdygpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIC8vIHZtLmN0eC5jbGVhclJlY3QoMCwwLHZtLncsIHZtLmgpO1xyXG5cclxuICAgIHZtLmN0eC5kcmF3SW1hZ2Uodm0uaW1hZ2UsIHZtLnhfb2Zmc2V0LCB2bS55X29mZnNldCwgdm0uaW1hZ2UubmF0dXJhbFdpZHRoLCB2bS5pbWFnZS5uYXR1cmFsSGVpZ2h0LCAwLCAwLCB2bS5pbWdXaWR0aCwgdm0uaW1nSGVpZ2h0KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBcHAge1xyXG4gIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgdzogbnVtYmVyO1xyXG4gIGg6IG51bWJlcjtcclxuICAvLyByZWN0OiBSZWN0YW5nbGVcclxuICBpbWc6IEltZztcclxuXHJcbiAgbW91c2VJbjogYm9vbGVhbjtcclxuICBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcclxuXHJcbiAgICB2YXIgaXNNb2JpbGUgPSBmYWxzZTsgLy9pbml0aWF0ZSBhcyBmYWxzZVxyXG4gICAgLy8gZGV2aWNlIGRldGVjdGlvblxyXG4gICAgaWYgKC8oYW5kcm9pZHxiYlxcZCt8bWVlZ28pLittb2JpbGV8YXZhbnRnb3xiYWRhXFwvfGJsYWNrYmVycnl8YmxhemVyfGNvbXBhbHxlbGFpbmV8ZmVubmVjfGhpcHRvcHxpZW1vYmlsZXxpcChob25lfG9kKXxpcGFkfGlyaXN8a2luZGxlfEFuZHJvaWR8U2lsa3xsZ2UgfG1hZW1vfG1pZHB8bW1wfG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIChjZXxwaG9uZSl8eGRhfHhpaW5vL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSB8fCAvMTIwN3w2MzEwfDY1OTB8M2dzb3w0dGhwfDUwWzEtNl1pfDc3MHN8ODAyc3xhIHdhfGFiYWN8YWMoZXJ8b298c1xcLSl8YWkoa298cm4pfGFsKGF2fGNhfGNvKXxhbW9pfGFuKGV4fG55fHl3KXxhcHR1fGFyKGNofGdvKXxhcyh0ZXx1cyl8YXR0d3xhdShkaXxcXC1tfHIgfHMgKXxhdmFufGJlKGNrfGxsfG5xKXxiaShsYnxyZCl8YmwoYWN8YXopfGJyKGV8dil3fGJ1bWJ8YndcXC0obnx1KXxjNTVcXC98Y2FwaXxjY3dhfGNkbVxcLXxjZWxsfGNodG18Y2xkY3xjbWRcXC18Y28obXB8bmQpfGNyYXd8ZGEoaXR8bGx8bmcpfGRidGV8ZGNcXC1zfGRldml8ZGljYXxkbW9ifGRvKGN8cClvfGRzKDEyfFxcLWQpfGVsKDQ5fGFpKXxlbShsMnx1bCl8ZXIoaWN8azApfGVzbDh8ZXooWzQtN10wfG9zfHdhfHplKXxmZXRjfGZseShcXC18Xyl8ZzEgdXxnNTYwfGdlbmV8Z2ZcXC01fGdcXC1tb3xnbyhcXC53fG9kKXxncihhZHx1bil8aGFpZXxoY2l0fGhkXFwtKG18cHx0KXxoZWlcXC18aGkocHR8dGEpfGhwKCBpfGlwKXxoc1xcLWN8aHQoYyhcXC18IHxffGF8Z3xwfHN8dCl8dHApfGh1KGF3fHRjKXxpXFwtKDIwfGdvfG1hKXxpMjMwfGlhYyggfFxcLXxcXC8pfGlicm98aWRlYXxpZzAxfGlrb218aW0xa3xpbm5vfGlwYXF8aXJpc3xqYSh0fHYpYXxqYnJvfGplbXV8amlnc3xrZGRpfGtlaml8a2d0KCB8XFwvKXxrbG9ufGtwdCB8a3djXFwtfGt5byhjfGspfGxlKG5vfHhpKXxsZyggZ3xcXC8oa3xsfHUpfDUwfDU0fFxcLVthLXddKXxsaWJ3fGx5bnh8bTFcXC13fG0zZ2F8bTUwXFwvfG1hKHRlfHVpfHhvKXxtYygwMXwyMXxjYSl8bVxcLWNyfG1lKHJjfHJpKXxtaShvOHxvYXx0cyl8bW1lZnxtbygwMXwwMnxiaXxkZXxkb3x0KFxcLXwgfG98dil8enopfG10KDUwfHAxfHYgKXxtd2JwfG15d2F8bjEwWzAtMl18bjIwWzItM118bjMwKDB8Mil8bjUwKDB8Mnw1KXxuNygwKDB8MSl8MTApfG5lKChjfG0pXFwtfG9ufHRmfHdmfHdnfHd0KXxub2soNnxpKXxuenBofG8yaW18b3AodGl8d3YpfG9yYW58b3dnMXxwODAwfHBhbihhfGR8dCl8cGR4Z3xwZygxM3xcXC0oWzEtOF18YykpfHBoaWx8cGlyZXxwbChheXx1Yyl8cG5cXC0yfHBvKGNrfHJ0fHNlKXxwcm94fHBzaW98cHRcXC1nfHFhXFwtYXxxYygwN3wxMnwyMXwzMnw2MHxcXC1bMi03XXxpXFwtKXxxdGVrfHIzODB8cjYwMHxyYWtzfHJpbTl8cm8odmV8em8pfHM1NVxcL3xzYShnZXxtYXxtbXxtc3xueXx2YSl8c2MoMDF8aFxcLXxvb3xwXFwtKXxzZGtcXC98c2UoYyhcXC18MHwxKXw0N3xtY3xuZHxyaSl8c2doXFwtfHNoYXJ8c2llKFxcLXxtKXxza1xcLTB8c2woNDV8aWQpfHNtKGFsfGFyfGIzfGl0fHQ1KXxzbyhmdHxueSl8c3AoMDF8aFxcLXx2XFwtfHYgKXxzeSgwMXxtYil8dDIoMTh8NTApfHQ2KDAwfDEwfDE4KXx0YShndHxsayl8dGNsXFwtfHRkZ1xcLXx0ZWwoaXxtKXx0aW1cXC18dFxcLW1vfHRvKHBsfHNoKXx0cyg3MHxtXFwtfG0zfG01KXx0eFxcLTl8dXAoXFwuYnxnMXxzaSl8dXRzdHx2NDAwfHY3NTB8dmVyaXx2aShyZ3x0ZSl8dmsoNDB8NVswLTNdfFxcLXYpfHZtNDB8dm9kYXx2dWxjfHZ4KDUyfDUzfDYwfDYxfDcwfDgwfDgxfDgzfDg1fDk4KXx3M2MoXFwtfCApfHdlYmN8d2hpdHx3aShnIHxuY3xudyl8d21sYnx3b251fHg3MDB8eWFzXFwtfHlvdXJ8emV0b3x6dGVcXC0vaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQuc3Vic3RyKDAsIDQpKSkgaXNNb2JpbGUgPSB0cnVlO1xyXG5cclxuICAgIGlmIChpc01vYmlsZSkge1xyXG4gICAgICB2YXIgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgICAgaW1hZ2Uuc3JjID0gJ3Blcmxpbl9iYWNrZ3JvdW5kLnBuZyc7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzLWNvbnRhaW5lcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlbGNvbWUtcGFnZScpLmluc2VydEJlZm9yZShpbWFnZSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcy10ZXh0LW92ZXJsYXknKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuXHJcblxyXG4gICAgICB2bS5jYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xyXG4gICAgICB2bS5jdHggPSB2bS5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcblxyXG5cclxuICAgICAgdm0uc2l6ZUNhbnZhcygpO1xyXG4gICAgICAvLyB2bS5pbml0RXZlbnRzKCk7XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHQpID0+IHsgdm0uZHJhdyh0KTsgfSk7XHJcblxyXG4gICAgICB2bS5pbWcgPSBuZXcgSW1nKHZtLncsIHZtLmgpO1xyXG5cclxuICAgICAgdm0ubW91c2VJbiA9IGZhbHNlO1xyXG5cclxuICAgICAgdm0uY29udGFpbmVyID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMtY29udGFpbmVyJyk7XHJcblxyXG4gICAgICB2bS5jb250YWluZXIub25tb3VzZW1vdmUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZtLmRyYXdJbWdJbigwLCBlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdm0uY29udGFpbmVyLm9ubW91c2VlbnRlciA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdm0ubW91c2VJbiA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZtLmNvbnRhaW5lci5vbm1vdXNlb3V0ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2bS5tb3VzZUluID0gZmFsc2U7XHJcbiAgICAgICAgdm0uZHJhd0ltZ091dCgwLCBlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHNpemVDYW52YXMoKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2bS5jYW52YXMuc3R5bGUud2lkdGggPSAnMTAwJSc7XHJcbiAgICB2bS5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xyXG4gICAgdGhpcy53ID0gdGhpcy5jYW52YXMud2lkdGggPSB2bS5jYW52YXMub2Zmc2V0V2lkdGg7XHJcbiAgICB0aGlzLmggPSB0aGlzLmNhbnZhcy5oZWlnaHQgPSB2bS5jYW52YXMub2Zmc2V0SGVpZ2h0O1xyXG5cclxuICAgIGlmICh2bS5pbWcpIHtcclxuICAgICAgdm0uaW1nLnNpemUodm0udywgdm0uaCk7XHJcbiAgICAgIHZtLmltZy5kcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuICBwdWJsaWMgZHJhdyh0OiBhbnkpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHQpID0+IHsgdGhpcy5kcmF3KHQpOyB9KTtcclxuICAgIHZtLmN0eC5jbGVhclJlY3QoMCwgMCwgdm0udywgdm0uaCk7XHJcblxyXG4gICAgdm0uY3R4LmRyYXdJbWFnZSh2bS5pbWcuY2FudmFzLCAwLCAwKTtcclxuICAgIHZtLmltZy5kcmF3KCk7XHJcblxyXG5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3SW1nSW4odDogYW55LCBlOiBhbnkpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcblxyXG4gICAgLypyYXRpbyA9IChpbWdXaWR0aCAvIHNjcmVlbldpZHRoKSAgKi9cclxuXHJcbiAgICB2YXIgbW92ZVJhdGlvWCA9IChlLmNsaWVudFggLyB2bS5pbWcuc2NyZWVuV2lkdGgpOyAvL3JhbmdlIGZyb20gWzAsIDFdOiAwIGJlaW5nIGxlZnQsIDEgYmVpbmcgcmlnaHRcclxuICAgIHZhciBtb3ZlT2Zmc2V0WCA9IC12bS5pbWcuYW5jaG9yWCArIChtb3ZlUmF0aW9YICogdm0uaW1nLmFuY2hvclgpO1xyXG5cclxuICAgIHZhciBtb3ZlUmF0aW9ZID0gKGUuY2xpZW50WSAvIHZtLmltZy5zY3JlZW5IZWlnaHQpOyAvL3JhbmdlIGZyb20gWzAsIDFdOiAwIGJlaW5nIGxlZnQsIDEgYmVpbmcgcmlnaHRcclxuICAgIHZhciBtb3ZlT2Zmc2V0WSA9IC12bS5pbWcuYW5jaG9yWSArIChtb3ZlUmF0aW9ZICogdm0uaW1nLmFuY2hvclkpO1xyXG5cclxuXHJcbiAgICAvKm9mZnNldCA9IG1pZGRsZV9hbmNob3IgKyBkcmFnZ2VkX29mZnNldCovXHJcbiAgICB2bS5pbWcueF9vZmZzZXRfZGVzdCA9IHZtLmltZy5hbmNob3JYICsgbW92ZU9mZnNldFg7XHJcbiAgICB2bS5pbWcueV9vZmZzZXRfZGVzdCA9IHZtLmltZy5hbmNob3JZICsgbW92ZU9mZnNldFk7XHJcblxyXG4gICAgaWYgKHZtLm1vdXNlSW4gPT09IHRydWUgJiYgTWF0aC5yb3VuZCh2bS5pbWcueV9vZmZzZXQpICE9PSBNYXRoLnJvdW5kKHZtLmltZy55X29mZnNldF9kZXN0KSAmJiBNYXRoLnJvdW5kKHZtLmltZy54X29mZnNldCkgIT09IE1hdGgucm91bmQodm0uaW1nLnhfb2Zmc2V0X2Rlc3QpKSB7XHJcblxyXG5cclxuICAgICAgdm0uaW1nLnhfb2Zmc2V0ID0gTWF0aC5yb3VuZChsZXJwKHZtLmltZy54X29mZnNldCwgdm0uaW1nLnhfb2Zmc2V0X2Rlc3QsIDAuMSkpO1xyXG4gICAgICB2bS5pbWcueV9vZmZzZXQgPSBNYXRoLnJvdW5kKGxlcnAodm0uaW1nLnlfb2Zmc2V0LCB2bS5pbWcueV9vZmZzZXRfZGVzdCwgMC4xKSk7XHJcblxyXG4gICAgICAvLyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0KSA9PiB7IHZtLmRyYXdJbWdJbih0LCBlKSB9KTtcclxuXHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdJbWdPdXQodDogYW55LCBlOiBhbnkpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICAvKnJhdGlvID0gKGltZ1dpZHRoIC8gc2NyZWVuV2lkdGgpICAqL1xyXG5cclxuICAgIC8vIHZhciBtb3ZlUmF0aW9YID0gKGUuY2xpZW50WCAvIHZtLmltZy5zY3JlZW5XaWR0aCk7IC8vcmFuZ2UgZnJvbSBbMCwgMV06IDAgYmVpbmcgbGVmdCwgMSBiZWluZyByaWdodFxyXG4gICAgLy8gdmFyIG1vdmVPZmZzZXRYID0gLXZtLmltZy5hbmNob3JYICsgKG1vdmVSYXRpb1ggKiB2bS5pbWcuYW5jaG9yWCAqIDIpO1xyXG5cclxuICAgIC8vIHZhciBtb3ZlUmF0aW9ZID0gKGUuY2xpZW50WSAvIHZtLmltZy5zY3JlZW5IZWlnaHQpICogMjsgLy9yYW5nZSBmcm9tIFswLCAxXTogMCBiZWluZyBsZWZ0LCAxIGJlaW5nIHJpZ2h0XHJcbiAgICAvLyB2YXIgbW92ZU9mZnNldFkgPSAtdm0uaW1nLmFuY2hvclkgKyAobW92ZVJhdGlvWSAqIHZtLmltZy5hbmNob3JZKTtcclxuXHJcblxyXG4gICAgLypvZmZzZXQgPSBtaWRkbGVfYW5jaG9yICsgZHJhZ2dlZF9vZmZzZXQqL1xyXG4gICAgdm0uaW1nLnhfb2Zmc2V0X2Rlc3QgPSB2bS5pbWcuYW5jaG9yWDtcclxuICAgIHZtLmltZy55X29mZnNldF9kZXN0ID0gdm0uaW1nLmFuY2hvclk7XHJcblxyXG4gICAgaWYgKHZtLm1vdXNlSW4gPT09IGZhbHNlICYmIE1hdGgucm91bmQodm0uaW1nLnlfb2Zmc2V0KSAhPT0gTWF0aC5yb3VuZCh2bS5pbWcueV9vZmZzZXRfZGVzdCkgJiYgTWF0aC5yb3VuZCh2bS5pbWcueF9vZmZzZXQpICE9PSBNYXRoLnJvdW5kKHZtLmltZy54X29mZnNldF9kZXN0KSkge1xyXG5cclxuXHJcbiAgICAgIHZtLmltZy54X29mZnNldCA9IGxlcnAodm0uaW1nLnhfb2Zmc2V0LCB2bS5pbWcueF9vZmZzZXRfZGVzdCwgMC4xKTtcclxuICAgICAgdm0uaW1nLnlfb2Zmc2V0ID0gbGVycCh2bS5pbWcueV9vZmZzZXQsIHZtLmltZy55X29mZnNldF9kZXN0LCAwLjEpO1xyXG5cclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodCkgPT4geyB2bS5kcmF3SW1nT3V0KHQsIGUpIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICAvLyBpbml0RXZlbnRzKCkge1xyXG4gIC8vICAgd2luZG93Lm9ucmVzaXplID0gKGUpID0+IHtcclxuICAvLyAgICAgdGhpcy5zaXplQ2FudmFzKCk7XHJcbiAgLy8gICB9O1xyXG4gIC8vIH1cclxuXHJcbn0iLCJpbXBvcnQgKiBhcyBqdW1wIGZyb20gXCJqdW1wLmpzXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBpbWFnZV9jYW52YXMgZnJvbSBcIi4vaW1hZ2VfY2FudmFzXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBza2lsbF9iYWRnZSBmcm9tIFwiLi9za2lsbF9iYWRnZVwiO1xyXG5cclxuaW1wb3J0ICogYXMgbWVkaWEgZnJvbSBcIi4vbWVkaWFcIjtcclxuXHJcbi8veW9vXHJcbmNvbnN0IHRpbWVvdXQ6IG51bWJlciA9IDEwMDA7XHJcblxyXG52YXIgZnJvbnRlbmQgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJ2ZsZXgtZ3JpZDEnLCBbXHJcbnsgXCJuYW1lXCI6ICdDIycsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdjc2hhcnAuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnSmF2YSBTY3JpcHQnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnamF2YXNjcmlwdC0yLnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0hUTUw1JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2h0bWw1LnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0NTUzMnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnY3NzLTMuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnQysrJywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAnYy1zZWVrbG9nby5jb20uc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnUHl0aG9uJywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAncHl0aG9uLTUuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnSmF2YScsIFwiY2xhc3NcIjogJ2NpcmNsZS01MCcsIFwiaW1hZ2VcIjogJ2phdmEtMTQuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnTm9kZSBKUycsIFwiY2xhc3NcIjogJ2NpcmNsZS0yNScsIFwiaW1hZ2VcIjogJ25vZGVqcy1pY29uLnN2ZycgfSxcclxuLy8geyBcIm5hbWVcIjogJ2pRdWVyeScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdqcXVlcnktMS5zdmcnIH0sXHJcbi8vIHsgXCJuYW1lXCI6ICdFbWJlciBKUycsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdlbWJlci5zdmcnIH0sXHJcbi8vIHsgXCJuYW1lXCI6ICdBbmd1bGFyIEpTJywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAnYW5ndWxhci1pY29uLnN2ZycgfSxcclxuLy8geyBcIm5hbWVcIjogJ1R5cGUgU2NyaXB0JywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAndHlwZXNjcmlwdC5zdmcnIH0sXHJcbi8vIHsgXCJuYW1lXCI6ICdEMy5qcycsIFwiY2xhc3NcIjogJ2NpcmNsZS03NScsIFwiaW1hZ2VcIjogJ2QzLTIuc3ZnJyB9LFxyXG4vLyB7IFwibmFtZVwiOiAnU0NTUycsIFwiY2xhc3NcIjogJ2NpcmNsZS01MCcsIFwiaW1hZ2VcIjogJ3Nhc3MtMS5zdmcnIH0sXHJcbi8vIHsgXCJuYW1lXCI6ICdSZWFjdCBKUycsIFwiY2xhc3NcIjogJ2NpcmNsZS0yNScsIFwiaW1hZ2VcIjogJ3JlYWN0LnN2ZycgfVxyXG5dLCBmYWxzZSwgJ2Zyb250ZW5kJyk7XHJcbnZhciBzb2Z0ZW5nID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICdmbGV4LWdyaWQyJywgW1xyXG4gICAgeyBcIm5hbWVcIjogJ1VuaXR5JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3VuaXR5LnN2ZycgfSxcclxuICAgIHsgXCJuYW1lXCI6ICdBUktpdCcsIFwiY2xhc3NcIjogJ2NpcmNsZS03NScsIFwiaW1hZ2VcIjogJ2Fya2l0LnBuZycgfSxcclxuICAgIHsgXCJuYW1lXCI6ICdWdWZvcmlhJywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAndnVmb3JpYS1sb2dvLnBuZycgfSxcclxuICAgIHsgXCJuYW1lXCI6ICdPY3VsdXMgVlInLCBcImNsYXNzXCI6ICdjaXJjbGUtNzUnLCBcImltYWdlXCI6ICdvY3VsdXMucG5nJyB9LFxyXG4gICAgeyBcIm5hbWVcIjogJ0xlYXAgTW90aW9uJywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAnbGVhcC5wbmcnIH0sXHJcbiAgICB7IFwibmFtZVwiOiAnT3BlbiBHTCcsIFwiY2xhc3NcIjogJ2NpcmNsZS0yNScsIFwiaW1hZ2VcIjogJ29wZW5nbDIuc3ZnJyB9LFxyXG4gICAgLy8geyBcIm5hbWVcIjogJ0FuZHJvaWQgU3R1ZGlvJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAnQW5kcm9pZF9zdHVkaW8uc3ZnJyB9XHJcbl0sIGZhbHNlLCAnc29mdGVuZycpO1xyXG52YXIgZGVzaWduID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICdmbGV4LWdyaWQzJywgW1xyXG57IFwibmFtZVwiOiAnSG91ZGluaScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdob3VkaW5pLnBuZyd9LFxyXG57IFwibmFtZVwiOiAnSWxsdXN0cmF0b3InLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnYWRvYmUtaWxsdXN0cmF0b3ItY2Muc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnTWF5YScsIFwiY2xhc3NcIjogJ2NpcmNsZS03NScsIFwiaW1hZ2VcIjogJ21heWEucG5nJyB9LFxyXG57IFwibmFtZVwiOiAnQWZ0ZXIgRWZmZWN0cycsIFwiY2xhc3NcIjogJ2NpcmNsZS01MCcsIFwiaW1hZ2VcIjogJ2FmdGVyLWVmZmVjdHMtY2Muc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnTW90aW9uIEJ1aWxkZXInLCBcImNsYXNzXCI6ICdjaXJjbGUtMjUnLCBcImltYWdlXCI6ICdtb2J1LnBuZycgfSxcclxueyBcIm5hbWVcIjogJ1ZpY29uIEJsYWRlJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAndmljb24ucG5nJyB9LFxyXG57IFwibmFtZVwiOiAnUGhvdG9zaG9wJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAncGhvdG9zaG9wLWNjLnN2ZycgfSxcclxuXHJcbi8vIHsgXCJuYW1lXCI6ICdNdWRib3gnLCBcImNsYXNzXCI6ICdjaXJjbGUtMjUnLCBcImltYWdlXCI6ICdtdWRib3gucG5nJyB9XHJcbl0sIGZhbHNlLCAnZGVzaWduJyk7XHJcbmZyb250ZW5kLmxvYWQoKTtcclxuc29mdGVuZy5sb2FkKCk7XHJcbmRlc2lnbi5sb2FkKCk7XHJcblxyXG5cclxudmFyIGFwcDtcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgYXBwID0gbmV3IGltYWdlX2NhbnZhcy5BcHAoKTtcclxufSk7XHJcblxyXG5cclxuLy8gd2luZG93Lm9uc2Nyb2xsID0gZnVuY3Rpb24oKXtcclxuLy8gICAgIGNvbnNvbGUubG9nKHdpbmRvdy5zY3JvbGxZKTtcclxuLy8gfVxyXG5cclxuXHJcbi8vIHZhciB3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3cmFwcGVyLTBcIik7XHJcbi8vIHZhciBiID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3AxJyk7XHJcblxyXG5cclxuLy8gYi5vbmNsaWNrID0gZnVuY3Rpb24oKXtcclxuLy8gICAgIGlmKHcuY2xhc3NMaXN0WzFdID09PSBcIm9wZW5cIil7XHJcbi8vICAgICAgICAgdy5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XHJcbi8vICAgICB9IGVsc2Uge1xyXG4vLyAgICAgICAgIHcuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xyXG4vLyAgICAgfVxyXG4vLyB9XHJcblxyXG5leHBvcnQgY2xhc3MgUG9ydGZvbGlvSXRlbSB7XHJcbiAgICB0aXRsZTogc3RyaW5nO1xyXG4gICAgdGl0bGVfaW1hZ2U6IHN0cmluZztcclxuICAgIGRlc2M6IHN0cmluZztcclxuICAgIHN0YWNrOiBza2lsbF9iYWRnZS5Db2xsZWN0aW9uO1xyXG4gICAgcG9ydF9pbWFnZTogc3RyaW5nO1xyXG4gICAgdXJsOiBzdHJpbmc7XHJcblxyXG4gICAgaXRlbV9udW06IG51bWJlcjtcclxuXHJcbiAgICBjb2xfc2l6ZTogc3RyaW5nO1xyXG4gICAgY29sOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGltZzogSFRNTEltYWdlRWxlbWVudDtcclxuICAgIHRleHQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgc3ViX3RleHQ6IEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIG9wZW46IGJvb2xlYW47XHJcbiAgICBtZWRpYTogbWVkaWEuTWVkaWE7XHJcbiAgICB0YXJnZXRfd3JhcHBlcjogV3JhcHBlcjtcclxuICAgIHBvcnRmb2xpbzogUG9ydGZvbGlvO1xyXG4gICAgcm93OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocG9ydGZvbGlvOiBQb3J0Zm9saW8sIGl0ZW1fbnVtOiBudW1iZXIsIHRpdGxlOiBzdHJpbmcsIHRpdGxlX2ltYWdlOiBzdHJpbmcsIGRlc2M6IHN0cmluZywgc3RhY2s6IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24sIG1lZGlhOiBtZWRpYS5NZWRpYSwgdHlwZTogc3RyaW5nLCB1cmw6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgdm0ucG9ydGZvbGlvID0gcG9ydGZvbGlvO1xyXG4gICAgICAgIHZtLml0ZW1fbnVtID0gaXRlbV9udW07XHJcbiAgICAgICAgdm0udGl0bGUgPSB0aXRsZTtcclxuICAgICAgICB2bS50aXRsZV9pbWFnZSA9IHRpdGxlX2ltYWdlO1xyXG4gICAgICAgIHZtLmRlc2MgPSBkZXNjO1xyXG4gICAgICAgIHZtLnN0YWNrID0gc3RhY2s7XHJcbiAgICAgICAgdm0ubWVkaWEgPSBtZWRpYTtcclxuICAgICAgICB2bS51cmwgPSB1cmw7XHJcbiAgICAgICAgdm0uY29sX3NpemUgPSBcImNvbC1tZC0zXCI7XHJcblxyXG5cclxuICAgICAgICB2bS5jb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5jb2wuY2xhc3NMaXN0LmFkZCh2bS5jb2xfc2l6ZSk7XHJcblxyXG4gICAgICAgIHZhciBjYXJkX3NoYWRvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNhcmRfc2hhZG93LmNsYXNzTGlzdC5hZGQoJ2NhcmQtZHJvcHNoYWRvdycsICdyb3cnKTtcclxuXHJcbiAgICAgICAgdmFyIG5vcGFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgbm9wYWQuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ25vcGFkJyk7XHJcblxyXG4gICAgICAgIHZtLmltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgICAgIHZtLmltZy5zcmMgPSB2bS50aXRsZV9pbWFnZTtcclxuXHJcbiAgICAgICAgdmFyIGNvbDEyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29sMTIuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJyk7XHJcblxyXG4gICAgICAgIHZtLnRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS50ZXh0LmNsYXNzTGlzdC5hZGQoJ3RleHQnLCAncGFkZGluZy10b3AnKTtcclxuICAgICAgICB2bS50ZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRpdGxlKSk7XHJcblxyXG4gICAgICAgIHZhciBjb2wxMl8yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29sMTJfMi5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInKTtcclxuXHJcbiAgICAgICAgdm0uc3ViX3RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5zdWJfdGV4dC5jbGFzc0xpc3QuYWRkKCd0ZXh0X2xpZ2h0Jyk7XHJcbiAgICAgICAgdm0uc3ViX3RleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodHlwZSkpO1xyXG5cclxuICAgICAgICAvLyAuY29sLW1kLTNcclxuICAgICAgICAvLyAgICAgICBpbWcoc3JjPVwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIikjcDFcclxuICAgICAgICAvLyAgICAgICAudGV4dCBCcmVhdGhsZXNzOiBIVE1MNSBHYW1lXHJcblxyXG4gICAgICAgIC8vIC5jb2wtbWQtM1xyXG4gICAgICAgIC8vICAgICAgIC5jYXJkLWRyb3BzaGFkb3cucm93XHJcbiAgICAgICAgLy8gICAgICAgICAuY29sLW1kLTEyLm5vcGFkXHJcbiAgICAgICAgLy8gICAgICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKSNwMS5kcm9wc2hhZG93XHJcbiAgICAgICAgLy8gICAgICAgICAuY29sLW1kLTEyXHJcbiAgICAgICAgLy8gICAgICAgICAgIC50ZXh0IEJyZWF0aGxlc3NcclxuICAgICAgICAvLyAgICAgICAgIC5jb2wtbWQtMTJcclxuICAgICAgICAvLyAgICAgICAgICAgLnRleHRfbGlnaHQgSFRNTDUgR2FtZVxyXG5cclxuICAgICAgICB2bS5jb2wuYXBwZW5kQ2hpbGQoY2FyZF9zaGFkb3cpO1xyXG4gICAgICAgIGNhcmRfc2hhZG93LmFwcGVuZENoaWxkKG5vcGFkKTtcclxuICAgICAgICBub3BhZC5hcHBlbmRDaGlsZCh2bS5pbWcpO1xyXG4gICAgICAgIGNhcmRfc2hhZG93LmFwcGVuZENoaWxkKGNvbDEyKTtcclxuICAgICAgICBjb2wxMi5hcHBlbmRDaGlsZCh2bS50ZXh0KTtcclxuICAgICAgICBjYXJkX3NoYWRvdy5hcHBlbmRDaGlsZChjb2wxMl8yKTtcclxuICAgICAgICBjb2wxMl8yLmFwcGVuZENoaWxkKHZtLnN1Yl90ZXh0KTtcclxuXHJcbiAgICAgICAgdm0ub3BlbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICB2bS5jb2wub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gICBjb25zb2xlLih2bS5pdGVtc1swXSk7XHJcbiAgICAgICAgICAgIHZhciBkaWZmZXJlbnRfd3JhcHBlciA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgZGlmZmVyZW50X3dyYXBwZXIgPSB2bS5wb3J0Zm9saW8uY2xvc2Uodm0uaXRlbV9udW0pO1xyXG5cclxuICAgICAgICAgICAgdm0ub3BlbiA9IHZtLnRhcmdldF93cmFwcGVyLnRyYW5zaXRpb25XcmFwcGVyKGRpZmZlcmVudF93cmFwcGVyLCB2bS5vcGVuLCB2bS50aXRsZSwgdm0uZGVzYywgdm0uc3RhY2ssIHZtLm1lZGlhLCB2bS51cmwpXHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGp1bXAoJyN3cmFwcGVyLScgKyB2bS5yb3csIHtcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcclxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IC12bS5jb2wuY2xpZW50SGVpZ2h0IC0gMzVcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vICAgdm0uc2V0RGF0YSgpOyAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIGFwcGVuZChyb3c6IG51bWJlciwgd3JhcHBlcjogV3JhcHBlcikge1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2YXIgcm93X2VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm93XycgKyByb3cpO1xyXG4gICAgICAgIHJvd19lbGVtZW50LmFwcGVuZENoaWxkKHZtLmNvbCk7XHJcbiAgICAgICAgdm0udGFyZ2V0X3dyYXBwZXIgPSB3cmFwcGVyO1xyXG4gICAgICAgIHZtLnN0YWNrLmZsZXhfZ3JpZF9pZCA9IHdyYXBwZXIuZmxleF9ncmlkLmlkO1xyXG4gICAgICAgIHZtLm1lZGlhLmlkID0gJ21lZGlhLScgKyByb3c7XHJcbiAgICAgICAgdm0ucm93ID0gcm93O1xyXG4gICAgfVxyXG4gICAgc2V0Q29sKGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmNvbC5jbGFzc0xpc3QucmVtb3ZlKHZtLmNvbF9zaXplKTtcclxuICAgICAgICB2bS5jb2xfc2l6ZSA9IGNsYXNzTmFtZTtcclxuICAgICAgICB2bS5jb2wuY2xhc3NMaXN0LmFkZCh2bS5jb2xfc2l6ZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFBvcnRmb2xpbyB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAganNvbl9vYmpzOiBJUG9ydGZvbGlvSXRlbVtdO1xyXG4gICAgcGF0aDogc3RyaW5nO1xyXG4gICAgaXRlbXM6IFBvcnRmb2xpb0l0ZW1bXTtcclxuICAgIHdyYXBwZXJzOiBXcmFwcGVyW107XHJcbiAgICBmbGV4X2dyaWRfaWQ6IHN0cmluZztcclxuICAgIHBlcl9yb3c6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBqc29uX29ianM6IElQb3J0Zm9saW9JdGVtW10pIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaWQgPSBpZDtcclxuICAgICAgICB2bS5qc29uX29ianMgPSBqc29uX29ianM7XHJcblxyXG5cclxuICAgICAgICB2bS5pdGVtcyA9IFtdO1xyXG4gICAgICAgIHZtLndyYXBwZXJzID0gW107XHJcblxyXG4gICAgICAgIC8vYWRkIHdyYXBwZXJzIGJhc2VkIG9uIGFsbCBwb3NzaWJsZSBicmVha3BvaW50IHdpZHRocyAoanNvbl9vYmpzLzIpXHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBNYXRoLmNlaWwoanNvbl9vYmpzLmxlbmd0aCAvIDIpOyBqKyspIHtcclxuICAgICAgICAgICAgdm0ud3JhcHBlcnMucHVzaChuZXcgV3JhcHBlcihqKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2FkZCBhbGwgaXRlbXNcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLmpzb25fb2Jqcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2bS5pdGVtcy5wdXNoKG5ldyBQb3J0Zm9saW9JdGVtKHZtLCBpLCBqc29uX29ianNbaV0udGl0bGUsIGpzb25fb2Jqc1tpXS50aXRsZV9pbWFnZSwganNvbl9vYmpzW2ldLmRlc2MsIGpzb25fb2Jqc1tpXS5zdGFjaywganNvbl9vYmpzW2ldLm1lZGlhLCBqc29uX29ianNbaV0udHlwZSwganNvbl9vYmpzW2ldLnVybCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdm0uYXBwZW5kQWxsKCk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXBwZW5kQWxsKCkgeyAvL2FwcGVuZHMgUG9ydGZvbGlvSXRlbXMgYmFzZWQgb24gc2NyZWVuIHNpemU7IGdldHMgZGlnZXN0ZWRcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHNjcmVlbldpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblxyXG4gICAgICAgIC8vcmVhc3NpZ25zIGNvbHMgYmFzZWQgb24gYnJlYWtwb2ludHNcclxuICAgICAgICB2YXIgYnJlYWtwb2ludHMgPSBbeyBtaW46IDAsIG1heDogNzY4LCBjb2xfc2l6ZTogJ2NvbC14cy02JywgcGVyX3JvdzogMiB9LCB7IG1pbjogNzY5LCBtYXg6IDk5MiwgY29sX3NpemU6ICdjb2wteHMtNCcsIHBlcl9yb3c6IDMgfSwgeyBtaW46IDk5MywgbWF4OiAxMjAwLCBjb2xfc2l6ZTogJ2NvbC14cy0zJywgcGVyX3JvdzogNCB9LCB7IG1pbjogMTIwMCwgbWF4OiA5OTk5LCBjb2xfc2l6ZTogJ2NvbC14cy0zJywgcGVyX3JvdzogNCB9XTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJyZWFrcG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAvL2lmIGluIGJyZWFrcG9pbnQgcmFuZ2UsIGFuZCBub3Qgc2FtZSBhcyBiZWZvcmVcclxuICAgICAgICAgICAgaWYgKC8qdm0uaXRlbXNbMF0uY29sX3NpemUgIT09IGJyZWFrcG9pbnRzW2ldLmNvbF9zaXplICYmICovc2NyZWVuV2lkdGggPiBicmVha3BvaW50c1tpXS5taW4gJiYgc2NyZWVuV2lkdGggPCBicmVha3BvaW50c1tpXS5tYXgpIHtcclxuICAgICAgICAgICAgICAgIC8vY2xlYXIgYWxsIHJvd3NcclxuICAgICAgICAgICAgICAgIHZtLnBlcl9yb3cgPSBicmVha3BvaW50c1tpXS5wZXJfcm93O1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3J0Zm9saW8nKTtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IHBhcmVudC5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBhID0gMTsgYSA8IGl0ZXJhdG9yOyBhKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQocGFyZW50LmNoaWxkcmVuWzFdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL2FkZCBuZXcgcm93cyBhbmQgd3JhcHBlcnNcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHIgPSAwOyByIDwgTWF0aC5jZWlsKHZtLml0ZW1zLmxlbmd0aCAvIGJyZWFrcG9pbnRzW2ldLnBlcl9yb3cpOyByKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93LmlkID0gJ3Jvd18nICsgcjtcclxuICAgICAgICAgICAgICAgICAgICByb3cuY2xhc3NMaXN0LmFkZCgncm93JywgJ25vbWFyJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB3cmFwcGVyID0gdm0ud3JhcHBlcnNbcl0uaHRtbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHJvdyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHdyYXBwZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9hZGQgY29scyB0byBuZXcgcm93c1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2bS5pdGVtcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLml0ZW1zW2pdLnNldENvbChicmVha3BvaW50c1tpXS5jb2xfc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvd19udW0gPSBNYXRoLmZsb29yKGogLyBicmVha3BvaW50c1tpXS5wZXJfcm93KTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5pdGVtc1tqXS5hcHBlbmQocm93X251bSwgdm0ud3JhcHBlcnNbcm93X251bV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbG9zZShpdGVtX251bTogbnVtYmVyKSB7IC8vY2xvc2VzIGFsbCB3cmFwcGVyc1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICAvL2Nsb3NlcyBhbGwgaXRlbXMgaW4gdGhlIHJvdyBvZiB0aGUgZ2l2ZW4gaXRlbS5cclxuICAgICAgICB2YXIgcm93ID0gTWF0aC5mbG9vcihpdGVtX251bSAvIHZtLnBlcl9yb3cpO1xyXG5cclxuICAgICAgICAvLyBmb3IodmFyIGogPSAocm93KnZtLnBlcl9yb3cpOyBqIDwgKChyb3cqdm0ucGVyX3Jvdykrdm0ucGVyX3Jvdyk7IGorKyl7XHJcbiAgICAgICAgLy8gICAgIGlmKGl0ZW1fbnVtICE9PSBqICYmIHZtLml0ZW1zW2pdKXtcclxuICAgICAgICAvLyAgICAgICAgIHZtLml0ZW1zW2pdLm9wZW4gPSBmYWxzZTtcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH1cclxuICAgICAgICB2YXIgcmV0dXJuX3ZhbHVlID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdm0uaXRlbXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW1fbnVtICE9PSBqICYmIHZtLml0ZW1zW2pdKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5pdGVtc1tqXS5vcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgciA9IDA7IHIgPCB2bS53cmFwcGVycy5sZW5ndGg7IHIrKykge1xyXG4gICAgICAgICAgICBpZiAociAhPT0gcm93ICYmIHZtLndyYXBwZXJzW3JdLmh0bWwuY2xhc3NMaXN0WzFdID09PSAnb3BlbicpIHtcclxuICAgICAgICAgICAgICAgIHZtLndyYXBwZXJzW3JdLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5fdmFsdWUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXR1cm5fdmFsdWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXcmFwcGVyIHtcclxuICAgIHRpdGxlOiBzdHJpbmc7XHJcbiAgICBkZXNjOiBzdHJpbmc7XHJcbiAgICBjb2xsZWN0aW9uOiBza2lsbF9iYWRnZS5Db2xsZWN0aW9uO1xyXG4gICAgcG9ydF9pbWFnZTogc3RyaW5nO1xyXG4gICAgbWVkaWE6IG1lZGlhLk1lZGlhO1xyXG4gICAgdXJsOiBzdHJpbmc7XHJcblxyXG5cclxuICAgIGh0bWw6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgdGl0bGVfZWxlbWVudDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBkZXNjcmlwdGlvbjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBzdGFjazogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBmbGV4X2dyaWQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgZGVtbzogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb2w1OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGRlc2NyaXB0aW9uX3RleHQ6IFRleHQ7XHJcbiAgICB0aXRsZV9lbGVtZW50X3RleHQ6IFRleHQ7XHJcbiAgICBsaW5rOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGxpbmtfdGV4dDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb2w2OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbDZIb2xkZXI6IEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIGNoYW5nZTogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihyb3dfbnVtKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB2bS5jaGFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAvLyB2bS50aXRsZSA9IHBJdGVtLnRpdGxlO1xyXG4gICAgICAgIC8vIHZtLmRlc2MgPSBwSXRlbS5kZXNjO1xyXG4gICAgICAgIC8vIHZtLnN0YWNrID0gcEl0ZW0uc3RhY2s7XHJcbiAgICAgICAgLy8gdm0ucG9ydF9pbWFnZSA9IHBJdGVtLnBvcnRfaW1hZ2U7XHJcbiAgICAgICAgdm0uaHRtbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmh0bWwuaWQgPSAnd3JhcHBlci0nICsgcm93X251bTtcclxuICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5hZGQoJ3dyYXBwZXInKTtcclxuXHJcbiAgICAgICAgdmFyIHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHJvdy5pZCA9ICdjb250ZW50JztcclxuICAgICAgICByb3cuY2xhc3NMaXN0LmFkZCgncm93JywgJ25vbWFyJyk7XHJcblxyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS50aXRsZV9lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdkZXNjLXRleHQyJywgJ3BhZC1zcGFjaW5nJyk7XHJcbiAgICAgICAgdm0udGl0bGVfZWxlbWVudF90ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnQuYXBwZW5kQ2hpbGQodm0udGl0bGVfZWxlbWVudF90ZXh0KTtcclxuXHJcbiAgICAgICAgdm0uY29sNkhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmNvbDZIb2xkZXIuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2NvbC1tZC02JywgJ2NvbC1sZy03JywgJ3JvdycsICdub21hcicsICdub3BhZCcpO1xyXG5cclxuICAgICAgICB2YXIgcm93X2ZpbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICByb3dfZmlsbC5jbGFzc0xpc3QuYWRkKCdyb3cnLCAnanVzdGlmeS1jZW50ZXInLCAnbm9tYXInKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbDEyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29sMTIuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJyk7XHJcblxyXG4gICAgICAgIHZtLmNvbDYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5jb2w2LmlkID0gJ21lZGlhLScgKyByb3dfbnVtO1xyXG4gICAgICAgIHZtLmNvbDYuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2NvbC1tZC02JywgJ2NvbC1sZy01Jyk7XHJcblxyXG4gICAgICAgIHZhciBjb2wzXzIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb2wzXzIuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2NvbC1tZC0zJywgJ25vcGFkLWxlZnQnKTtcclxuXHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5kZXNjcmlwdGlvbi5jbGFzc0xpc3QuYWRkKCdoZWFkZXItdGV4dCcsICdwYWQtc3BhY2luZycpO1xyXG4gICAgICAgIHZtLmRlc2NyaXB0aW9uLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdEZXNjcmlwdGlvbicpKTtcclxuXHJcbiAgICAgICAgdmFyIGRlc2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkZXNjLmNsYXNzTGlzdC5hZGQoJ2Rlc2NyaXB0aW9uLXRleHQnLCAncGFkLXNwYWNpbmcnKTtcclxuICAgICAgICB2bS5kZXNjcmlwdGlvbl90ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xyXG4gICAgICAgIGRlc2MuYXBwZW5kQ2hpbGQodm0uZGVzY3JpcHRpb25fdGV4dCk7XHJcblxyXG4gICAgICAgIHZtLnN0YWNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uc3RhY2suY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2NvbC1tZC0xMicsICdjb2wtbGctNycpO1xyXG4gICAgICAgIC8vIHZtLnN0YWNrLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdTdGFjaycpKTtcclxuXHJcbiAgICAgICAgdmFyIHN0YWNrX3RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgc3RhY2tfdGl0bGUuY2xhc3NMaXN0LmFkZCgnaGVhZGVyLXRleHQnLCAncGFkLXNwYWNpbmcnKVxyXG4gICAgICAgIHN0YWNrX3RpdGxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdTa2lsbHMgVXNlZCcpKTtcclxuXHJcbiAgICAgICAgdm0uZmxleF9ncmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uZmxleF9ncmlkLmlkID0gJ3BmbGV4LWdyaWQtJyArIHJvd19udW07XHJcbiAgICAgICAgdm0uZmxleF9ncmlkLmNsYXNzTGlzdC5hZGQoJ3JvdycsICdwb3J0Zm9saW8tZmxleCcsICdjb2wteHMtMTInKTtcclxuXHJcbiAgICAgICAgdm0uZGVtbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmRlbW8uY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2NvbC1tZC0xMicsICdjb2wtbGctNScpO1xyXG4gICAgICAgIC8vIHZtLmRlbW8uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0xpdmUgRGVtbycpKTtcclxuXHJcbiAgICAgICAgdmFyIGRlbW9fdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkZW1vX3RpdGxlLmNsYXNzTGlzdC5hZGQoJ2hlYWRlci10ZXh0JywgJ3BhZC1zcGFjaW5nJylcclxuICAgICAgICBkZW1vX3RpdGxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdSZWxldmFudCBMaW5rcycpKTtcclxuXHJcblxyXG5cclxuICAgICAgICB2bS5saW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0ubGluay5jbGFzc0xpc3QuYWRkKCdnaXRodWItYnV0dG9uJywgJ3JvdycsICdub21hcicpO1xyXG5cclxuICAgICAgICB2bS5saW5rX3RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5saW5rX3RleHQuY2xhc3NMaXN0LmFkZCgnYmxhY2stdGV4dCcpO1xyXG4gICAgICAgIHZtLmxpbmtfdGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTGl2ZSBMaW5rJykpO1xyXG5cclxuICAgICAgICB2bS5jb2w1ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uY29sNS5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInLCAnY29sLW1kLTUnKTtcclxuXHJcbiAgICAgICAgLyogR09OTkEgSEFWRSBUTyBBREQgTUVESUEgRFlOQU1JQ0FMTFkgKi9cclxuXHJcbiAgICAgICAgdm0uaHRtbC5hcHBlbmRDaGlsZChyb3cpO1xyXG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZCh2bS50aXRsZV9lbGVtZW50KTtcclxuICAgICAgICByb3cuYXBwZW5kQ2hpbGQodm0uY29sNik7XHJcbiAgICAgICAgcm93LmFwcGVuZENoaWxkKHZtLmNvbDZIb2xkZXIpO1xyXG5cclxuXHJcbiAgICAgICAgdm0uY29sNkhvbGRlci5hcHBlbmRDaGlsZChjb2wxMik7XHJcbiAgICAgICAgY29sMTIuYXBwZW5kQ2hpbGQodm0uZGVzY3JpcHRpb24pO1xyXG4gICAgICAgIGNvbDEyLmFwcGVuZENoaWxkKGRlc2MpO1xyXG4gICAgICAgIHZtLmNvbDZIb2xkZXIuYXBwZW5kQ2hpbGQodm0uc3RhY2spXHJcbiAgICAgICAgdm0uc3RhY2suYXBwZW5kQ2hpbGQoc3RhY2tfdGl0bGUpO1xyXG4gICAgICAgIHZtLnN0YWNrLmFwcGVuZENoaWxkKHZtLmZsZXhfZ3JpZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdm0uY29sNkhvbGRlci5hcHBlbmRDaGlsZCh2bS5kZW1vKVxyXG4gICAgICAgIHZtLmRlbW8uYXBwZW5kQ2hpbGQoZGVtb190aXRsZSk7XHJcbiAgICAgICAgdm0uZGVtby5hcHBlbmRDaGlsZCh2bS5saW5rKTtcclxuICAgICAgICB2bS5saW5rLmFwcGVuZENoaWxkKHZtLmxpbmtfdGV4dCk7XHJcbiAgICAgICAgdm0ubGluay5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gdm0udXJsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIC8vI3dyYXBwZXItMC53cmFwcGVyLm9wZW5cclxuICAgICAgICAvLyAucm93I2NvbnRlbnRcclxuICAgICAgICAvLyAgIC5jb2wtbWQtMTIuZGVzYy10ZXh0IEJyZWF0aGxlc3NcclxuICAgICAgICAvLyAgIC5jb2wtbWQtNiNtZWRpYS0wXHJcbiAgICAgICAgLy8gICAuY29sLW1kLTYucm93XHJcbiAgICAgICAgLy8gICAgICAgLmNvbC1tZC0xMlxyXG4gICAgICAgIC8vICAgICAgICAgLmhlYWRlci10ZXh0LnBhZGRpbmctbGVmdCBEZXNjcmlwdGlvbjpcclxuICAgICAgICAvLyAgICAgICAgIC5kZXNjcmlwdGlvbi10ZXh0LnBhZGRpbmctbGVmdCBhc2RmYXNkZlxyXG4gICAgICAgIC8vICAgICAgIC5jb2wtbWQtNi5oZWFkZXItdGV4dCBTdGFjazpcclxuICAgICAgICAvLyAgICAgICAuY29sLW1kLTYuaGVhZGVyLXRleHQgTGl2ZSBEZW1vOlxyXG5cclxuICAgICAgICB2bS5odG1sLmFkZEV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICBpZiAodm0uY2hhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHZtLnNldERhdGEoKTtcclxuICAgICAgICAgICAgICAgIHZtLmNoYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgIH1cclxuICAgIC8vIGNsb3NlRGF0YSgpe1xyXG4gICAgLy8gICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIC8vICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAvLyAgICAgICAgIHZtLmNvbGxlY3Rpb24uY2xvc2UoKTtcclxuICAgIC8vICAgICB9LHRpbWVvdXQpO1xyXG5cclxuICAgIC8vIH1cclxuXHJcbiAgICBzZXREYXRhKCkge1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5zZXRUaXRsZSgpO1xyXG4gICAgICAgIHZtLnNldERlc2MoKTtcclxuICAgICAgICB2bS5zZXRTdGFjaygpO1xyXG4gICAgICAgIHZtLnNldE1lZGlhKCk7XHJcblxyXG4gICAgICAgIGlmKHZtLnVybCA9PT0gXCJcIil7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJIFRISU5LIFRISVMgSEFQUEVORUQ/Jyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLmNvbDYubGFzdENoaWxkKTtcclxuICAgICAgICAgICAgdm0uY29sNkhvbGRlci5yZW1vdmVDaGlsZCh2bS5kZW1vKTtcclxuICAgICAgICB9IGVsc2UgaWYodm0uY29sNkhvbGRlci5sYXN0Q2hpbGQgIT09IHZtLmRlbW8pe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnV09BSCBUSElTIFdPUktTPycpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2bS5jb2w2Lmxhc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIHZtLmNvbDZIb2xkZXIuYXBwZW5kQ2hpbGQodm0uZGVtbyk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHZtLnNldFN0YWNrKHN0YWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRUaXRsZSgpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0udGl0bGVfZWxlbWVudF90ZXh0LnRleHRDb250ZW50ID0gdm0udGl0bGU7XHJcbiAgICB9XHJcbiAgICBzZXREZXNjKCkge1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5kZXNjcmlwdGlvbl90ZXh0LnRleHRDb250ZW50ID0gdm0uZGVzYztcclxuICAgIH1cclxuXHJcbiAgICBzZXRTdGFjaygpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uY29sbGVjdGlvbi5yZXNldElkcyh2bS5mbGV4X2dyaWQuaWQpO1xyXG4gICAgICAgIHZtLmNvbGxlY3Rpb24ubG9hZCgpO1xyXG4gICAgfVxyXG4gICAgc2V0TWVkaWEoKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLm1lZGlhLnNldElkKHZtLm1lZGlhLmlkKTtcclxuICAgICAgICB2bS5tZWRpYS5sb2FkTWVkaWEoMCk7XHJcbiAgICB9XHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XHJcbiAgICB9XHJcbiAgICBjaGFuZ2VXcmFwcGVyKG9wZW46IGJvb2xlYW4sIHRpdGxlLCBkZXNjLCBzdGFjaywgbWVkaWEsIHVybCkge1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICAvL2Nsb3NlIHdyYXBwZXI6XHJcblxyXG5cclxuICAgICAgICBpZiAodm0udGl0bGUgPT09IHRpdGxlKSB7IC8qKmlmIG5vIGNoYW5nZSAqL1xyXG4gICAgICAgICAgICB2bS5jaGFuZ2UgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChvcGVuKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5jbG9zZURhdGEoKTtcclxuICAgICAgICAgICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdm0udGl0bGUgPSB0aXRsZTtcclxuICAgICAgICAgICAgICAgIHZtLmRlc2MgPSBkZXNjO1xyXG4gICAgICAgICAgICAgICAgdm0uY29sbGVjdGlvbiA9IHN0YWNrO1xyXG4gICAgICAgICAgICAgICAgdm0ubWVkaWEgPSBtZWRpYTtcclxuICAgICAgICAgICAgICAgIHZtLnVybCA9IHVybDtcclxuICAgICAgICAgICAgICAgIHZtLnNldERhdGEoKTtcclxuICAgICAgICAgICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHZtLmh0bWwuY2xhc3NMaXN0WzFdICE9PSAnb3BlbicpIHsgLyoqaWYgYWxsIHNlbGVjdGlvbnMgYXJlIGNsb3NlZCBpbml0aWFsbHkvY2hhbmdlIHdoZW4gY2xvc2VkKi9cclxuICAgICAgICAgICAgdm0uY2hhbmdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZtLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgICAgIHZtLmRlc2MgPSBkZXNjO1xyXG4gICAgICAgICAgICB2bS5jb2xsZWN0aW9uID0gc3RhY2s7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgICAgIHZtLnVybCA9IHVybDtcclxuICAgICAgICAgICAgdm0uc2V0RGF0YSgpO1xyXG4gICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdm0uY2hhbmdlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdm0udGl0bGUgPSB0aXRsZTtcclxuICAgICAgICAgICAgdm0uZGVzYyA9IGRlc2M7XHJcbiAgICAgICAgICAgIHZtLmNvbGxlY3Rpb24gPSBzdGFjaztcclxuICAgICAgICAgICAgdm0ubWVkaWEgPSBtZWRpYTtcclxuICAgICAgICAgICAgdm0udXJsID0gdXJsO1xyXG4gICAgICAgICAgICAvLyB2bS5jbG9zZURhdGEoKTtcclxuICAgICAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNpdGlvbldyYXBwZXIoZGlmZmVyZW50X3dyYXBwZXI6IGJvb2xlYW4sIG9wZW46IGJvb2xlYW4sIHRpdGxlLCBkZXNjLCBzdGFjaywgbWVkaWEsIHVybCkge1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHJldHVybl92YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKGRpZmZlcmVudF93cmFwcGVyKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuX3ZhbHVlID0gdm0uY2hhbmdlV3JhcHBlcihvcGVuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpO1xyXG4gICAgICAgICAgICB9LCB0aW1lb3V0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKG9wZW4gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvcGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuX3ZhbHVlID0gdm0uY2hhbmdlV3JhcHBlcihvcGVuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuX3ZhbHVlID0gdm0uY2hhbmdlV3JhcHBlcihvcGVuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0dXJuX3ZhbHVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQb3J0Zm9saW9JdGVtIHtcclxuICAgIHRpdGxlOiBzdHJpbmc7XHJcbiAgICB0aXRsZV9pbWFnZTogc3RyaW5nO1xyXG4gICAgZGVzYzogc3RyaW5nO1xyXG4gICAgc3RhY2s6IHNraWxsX2JhZGdlLkNvbGxlY3Rpb247XHJcbiAgICBtZWRpYTogbWVkaWEuTWVkaWE7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICB1cmw6IHN0cmluZztcclxufVxyXG5cclxuLy8ge1wibmFtZVwiOiAnUHl0aG9uJywgICAgICBcImNsYXNzXCI6J2NpcmNsZS01MCcsIFwiaW1hZ2VcIjoncHl0aG9uLTUuc3ZnJ31cclxudmFyIGJyZWF0aGxlc3Nfc3RhY2sgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJycsIFt7IFwibmFtZVwiOiAnUGhhc2VyLmpzJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3BoYXNlci5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdQaG90b3Nob3AnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAncGhvdG9zaG9wLWNjLnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ2pRdWVyeScsIFwiY2xhc3NcIjogJ2NpcmNsZS01MCcsIFwiaW1hZ2VcIjogJ2pxdWVyeS0xLnN2ZycgfV0sXHJcbnRydWVcclxuKTtcclxudmFyIHJlbV9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgW3sgXCJuYW1lXCI6ICdVbml0eScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICd1bml0eS5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdNYXlhJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAnbWF5YS5wbmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdQaG90b3Nob3AnLCBcImNsYXNzXCI6ICdjaXJjbGUtMjUnLCBcImltYWdlXCI6ICdwaG90b3Nob3AtY2Muc3ZnJ30sXHJcbnsgXCJuYW1lXCI6ICdJbGx1c3RyYXRvcicsIFwiY2xhc3NcIjogJ2NpcmNsZS0yNScsIFwiaW1hZ2VcIjogJ2Fkb2JlLWlsbHVzdHJhdG9yLWNjLnN2Zyd9XSxcclxudHJ1ZVxyXG4pO1xyXG5cclxudmFyIG1vdXNlX3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ1VuaXR5JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3VuaXR5LnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ01vdGlvbiBCdWlsZGVyJywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAnbW9idS5wbmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdNYXlhJywgXCJjbGFzc1wiOiAnY2lyY2xlLTUwJywgXCJpbWFnZVwiOiAnbWF5YS5wbmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdWaWNvbiBCbGFkZScsIFwiY2xhc3NcIjogJ2NpcmNsZS01MCcsIFwiaW1hZ2VcIjogJ3ZpY29uLnBuZycgfSxcclxuXSxcclxudHJ1ZVxyXG4pO1xyXG5cclxudmFyIG5rX3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ1VuaXR5JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3VuaXR5LnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0lsbHVzdHJhdG9yJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2Fkb2JlLWlsbHVzdHJhdG9yLWNjLnN2Zyd9XSxcclxudHJ1ZVxyXG4pO1xyXG5cclxudmFyIGJlZV9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgW3sgXCJuYW1lXCI6ICdVbml0eScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICd1bml0eS5zdmcnIH0sXHJcbl0sXHJcbnRydWVcclxuKTtcclxuXHJcbnZhciBjYXZlX3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ0hvdWRpbmknLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnaG91ZGluaS5wbmcnfSxcclxueyBcIm5hbWVcIjogJ1VuaXR5JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3VuaXR5LnN2ZycgfV0sXHJcbnRydWVcclxuKTtcclxuXHJcbnZhciBzdG9yeWdyYXBoX3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ1VuaXR5JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3VuaXR5LnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0FmdGVyIEVmZmVjdHMnLCBcImNsYXNzXCI6ICdjaXJjbGUtMjUnLCBcImltYWdlXCI6ICdhZnRlci1lZmZlY3RzLWNjLnN2ZycgfV0sXHJcbnRydWVcclxuKTtcclxudmFyIHFiZXJ0X3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ01heWEnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnbWF5YS5wbmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdQaG90b3Nob3AnLCBcImNsYXNzXCI6ICdjaXJjbGUtMjUnLCBcImltYWdlXCI6ICdwaG90b3Nob3AtY2Muc3ZnJyB9XSxcclxudHJ1ZVxyXG4pO1xyXG52YXIgd2VhdGhlcl9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgW3sgXCJuYW1lXCI6ICdBbmd1bGFyIEpTJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2FuZ3VsYXItaWNvbi5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdEMy5qcycsIFwiY2xhc3NcIjogJ2NpcmNsZS01MCcsIFwiaW1hZ2VcIjogJ2QzLTIuc3ZnJyB9XSxcclxudHJ1ZVxyXG4pO1xyXG5cclxudmFyIHJvYXN0X3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ0VtYmVyIEpTJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2VtYmVyLnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0QzLmpzJywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAnZDMtMi5zdmcnIH1dLFxyXG50cnVlXHJcbik7XHJcblxyXG52YXIgY29udHJhc3Rfc3RhY2sgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJycsIFt7IFwibmFtZVwiOiAnSmF2YScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdqYXZhLTE0LnN2ZycgfV0sXHJcbnRydWVcclxuKTtcclxuXHJcbnZhciBwb3J0X3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ1R5cGUgU2NyaXB0JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3R5cGVzY3JpcHQuc3ZnJyB9LCBcclxueyBcIm5hbWVcIjogJ0hUTUw1JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2h0bWw1LnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ1NDU1MnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnc2Fzcy0xLnN2ZycgfV0sXHJcbnRydWVcclxuKTtcclxuXHJcbi8vIHZhciBicmVhdGhsZXNzX21lZGlhID0gbmV3IG1lZGlhLk1lZGlhKCdtZWRpYS0wJywgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9jYXQuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzE5ODE0OTc5NVwiIHdpZHRoPVwiNDcxXCIgaGVpZ2h0PVwiMzM1XCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+Jyk7XHJcblxyXG52YXIgbSA9IFtdXHJcblxyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbIFwiLi9wb3J0Zm9saW8vcmVtXzUucG5nXCIsIFwiLi9wb3J0Zm9saW8vcmVtXzMucG5nXCIsIFwiLi9wb3J0Zm9saW8vcmVtXzIucG5nXCIsIFwiLi9wb3J0Zm9saW8vcmVtXzQucG5nXCJdLCBbIFwiLi9wb3J0Zm9saW8vcmVtXzMucG5nXCIsIFwiLi9wb3J0Zm9saW8vcmVtXzIucG5nXCIsIFwiLi9wb3J0Zm9saW8vcmVtXzQucG5nXCJdLCAnPGlmcmFtZSBzcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vMjUyNDM2OTg5XCIgd2lkdGg9XCI0NzFcIiBoZWlnaHQ9XCIzMzVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vdHV0b3JpYWxfMDQucG5nJywnLi9wb3J0Zm9saW8vdHV0b3JpYWxfMDEucG5nJywgJy4vcG9ydGZvbGlvL3R1dG9yaWFsXzAyLnBuZycsICcuL3BvcnRmb2xpby90dXRvcmlhbF8wMy5wbmcnXSwgWycuL3BvcnRmb2xpby90dXRvcmlhbF8wMS5wbmcnLCAnLi9wb3J0Zm9saW8vdHV0b3JpYWxfMDIucG5nJywgJy4vcG9ydGZvbGlvL3R1dG9yaWFsXzAzLnBuZyddLCAnPGlmcmFtZSB3aWR0aD1cIjU2MFwiIGhlaWdodD1cIjMxNVwiIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL01zWmpVSGhDako4XCIgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3c9XCJhY2NlbGVyb21ldGVyOyBhdXRvcGxheTsgZW5jcnlwdGVkLW1lZGlhOyBneXJvc2NvcGU7IHBpY3R1cmUtaW4tcGljdHVyZVwiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFtcIi4vcG9ydGZvbGlvL2lzbGFuZF8wMy5wbmdcIiwgXCIuL3BvcnRmb2xpby9pc2xhbmRfMDEucG5nXCIsIFwiLi9wb3J0Zm9saW8vaXNsYW5kXzAyLnBuZ1wiXSwgW1wiLi9wb3J0Zm9saW8vaXNsYW5kXzAxLnBuZ1wiLCBcIi4vcG9ydGZvbGlvL2lzbGFuZF8wMi5wbmdcIl0sICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby80NTY2NzcyNDNcIiB3aWR0aD1cIjY0MFwiIGhlaWdodD1cIjM2MFwiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93PVwiYXV0b3BsYXk7IGZ1bGxzY3JlZW5cIiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+JykpO1xyXG4vLyBtLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX3BsYXkuanBnXCIsIFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheV8yLmpwZ1wiLCBcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfZ2FtZXBsYXkuanBnXCIsIFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19jb250cm9scy5qcGdcIl0sIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfcGxheS5qcGdcIiwgXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX2dhbWVwbGF5XzIuanBnXCIsIFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheS5qcGdcIiwgXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX2NvbnRyb2xzLmpwZ1wiXSkpO1xyXG4vLyBtLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbXCIuL3BvcnRmb2xpby9xYmVydF9wbGF5LmpwZ1wiLCBcIi4vcG9ydGZvbGlvL3FiZXJ0X3BsYXllci5qcGdcIiwgXCIuL3BvcnRmb2xpby9xYmVydF9zbmFrZS5qcGdcIl0sIFtcIi4vcG9ydGZvbGlvL3FiZXJ0X3BsYXllci5qcGdcIiwgXCIuL3BvcnRmb2xpby9xYmVydF9zbmFrZS5qcGdcIl0sICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8xOTgxNDk3OTVcIiB3aWR0aD1cIjQ3MVwiIGhlaWdodD1cIjMzNVwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicpKTtcclxuLy8gbS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgW1wiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzEucG5nXCIsIFwiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzMucG5nXCIsIFwiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzIucG5nXCJdLCBbXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMS5wbmdcIiwgXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMy5wbmdcIiwgXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMi5wbmdcIl0pKTtcclxuLy8gbS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgWycuL3BvcnRmb2xpby9tZWFuX2ZvcmVjYXN0XzEuanBnJywgJy4vcG9ydGZvbGlvL21lYW5fZm9yZWNhc3RfMi5qcGcnXSwgWycuL3BvcnRmb2xpby9tZWFuX2ZvcmVjYXN0XzEuanBnJywgJy4vcG9ydGZvbGlvL21lYW5fZm9yZWNhc3RfMi5qcGcnXSkpO1xyXG4vLyBtLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL3JvYXN0XzYucG5nJywgJy4vcG9ydGZvbGlvL3JvYXN0XzIucG5nJywgJy4vcG9ydGZvbGlvL3JvYXN0XzMucG5nJywgJy4vcG9ydGZvbGlvL3JvYXN0XzQucG5nJ10sIFsnLi9wb3J0Zm9saW8vcm9hc3RfNi5wbmcnLCAnLi9wb3J0Zm9saW8vcm9hc3RfMi5wbmcnLCcuL3BvcnRmb2xpby9yb2FzdF8zLnBuZycsICcuL3BvcnRmb2xpby9yb2FzdF80LnBuZyddKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vU3RvcnlHcmFwaF9DYXJkLnBuZycsJy4vcG9ydGZvbGlvL3N0b3J5Z3JhcGhfMS5wbmcnLCAnLi9wb3J0Zm9saW8vc3RvcnlncmFwaF8yLnBuZyddLCBbJy4vcG9ydGZvbGlvL3N0b3J5Z3JhcGhfMS5wbmcnLCAnLi9wb3J0Zm9saW8vc3RvcnlncmFwaF8yLnBuZyddLCAnPGlmcmFtZSBzcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vMzY5NzQ3NDcxXCIgd2lkdGg9XCI0NzFcIiBoZWlnaHQ9XCIzMzVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vY3Jvd2RfMS5wbmcnLCcuL3BvcnRmb2xpby9jcm93ZF8yLnBuZycsICcuL3BvcnRmb2xpby9jcm93ZF8zLnBuZyddLCBbJy4vcG9ydGZvbGlvL2Nyb3dkXzEucG5nJywnLi9wb3J0Zm9saW8vY3Jvd2RfMi5wbmcnLCAnLi9wb3J0Zm9saW8vY3Jvd2RfMy5wbmcnXSkpO1xyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL2Jpb3Nocm9vbV8xLnBuZycsJy4vcG9ydGZvbGlvL2Jpb3Nocm9vbV8yLnBuZycsICcuL3BvcnRmb2xpby9iaW9zaHJvb21fMy5wbmcnLCAnLi9wb3J0Zm9saW8vYmlvc2hyb29tXzQucG5nJ10sIFsnLi9wb3J0Zm9saW8vYmlvc2hyb29tXzEucG5nJywnLi9wb3J0Zm9saW8vYmlvc2hyb29tXzIucG5nJywnLi9wb3J0Zm9saW8vYmlvc2hyb29tXzMucG5nJ10sICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8zNjk3NTI2MzFcIiB3aWR0aD1cIjQ3MVwiIGhlaWdodD1cIjMzNVwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicpKTtcclxubS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgWycuL3BvcnRmb2xpby9heG9ucnVzaF8xLnBuZycsJy4vcG9ydGZvbGlvL2F4b25ydXNoXzIucG5nJywgJy4vcG9ydGZvbGlvL2F4b25ydXNoXzMuZ2lmJ10sIFsnLi9wb3J0Zm9saW8vYXhvbnJ1c2hfMi5wbmcnLCAnLi9wb3J0Zm9saW8vYXhvbnJ1c2hfMy5naWYnXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzQzODMwMTM4OFwiIHdpZHRoPVwiNjQwXCIgaGVpZ2h0PVwiMzYwXCIgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3c9XCJhdXRvcGxheTsgZnVsbHNjcmVlblwiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vcm9ib3RfMS5wbmcnLCcuL3BvcnRmb2xpby9yb2JvdF8yLnBuZycsICcuL3BvcnRmb2xpby9yb2JvdF8zLnBuZyddLCBbJy4vcG9ydGZvbGlvL3JvYm90XzIucG5nJywnLi9wb3J0Zm9saW8vcm9ib3RfMy5wbmcnXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzM2OTc4NDU0M1wiIHdpZHRoPVwiNDcxXCIgaGVpZ2h0PVwiMzM1XCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+JykpO1xyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL2NhdmVfMy5wbmcnLCcuL3BvcnRmb2xpby9jYXZlXzIucG5nJywgJy4vcG9ydGZvbGlvL2NhdmVfMS5wbmcnLCAnLi9wb3J0Zm9saW8vY2F2ZV80LnBuZyddLCBbJy4vcG9ydGZvbGlvL2NhdmVfMi5wbmcnLCcuL3BvcnRmb2xpby9jYXZlXzEucG5nJywnLi9wb3J0Zm9saW8vY2F2ZV80LnBuZyddLCAnPGlmcmFtZSBzcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vMzY5Nzg5MTI3XCIgd2lkdGg9XCI0NzFcIiBoZWlnaHQ9XCIzMzVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vdHViZV8zLnBuZycsICcuL3BvcnRmb2xpby90dWJlXzIucG5nJywgJy4vcG9ydGZvbGlvL3R1YmVfNC5wbmcnXSwgWycuL3BvcnRmb2xpby90dWJlXzIucG5nJywnLi9wb3J0Zm9saW8vdHViZV80LnBuZyddLCAnPGlmcmFtZSBzcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vMzY5OTU1NDYwXCIgd2lkdGg9XCI0NzFcIiBoZWlnaHQ9XCIzMzVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vaHlwZXJob3BfMDEuZ2lmJywgJy4vcG9ydGZvbGlvL2h5cGVyaG9wXzAyLmdpZicsICcuL3BvcnRmb2xpby9oeXBlcmhvcF8wMy5naWYnXSwgWycuL3BvcnRmb2xpby9oeXBlcmhvcF8wMS5naWYnLCAnLi9wb3J0Zm9saW8vaHlwZXJob3BfMDIuZ2lmJywgJy4vcG9ydGZvbGlvL2h5cGVyaG9wXzAzLmdpZiddKSk7XHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vYmVlXzEucG5nJywgJy4vcG9ydGZvbGlvL2JlZV8yLnBuZycsICcuL3BvcnRmb2xpby9iZWVfMy5wbmcnXSwgWycuL3BvcnRmb2xpby9iZWVfMi5wbmcnLCAnLi9wb3J0Zm9saW8vYmVlXzMucG5nJ10sICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8zNzAyMjA5MzVcIiB3aWR0aD1cIjQ3MVwiIGhlaWdodD1cIjMzNVwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicpKTtcclxuLy8gbS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgWycuL3BvcnRmb2xpby9wb3J0XzEucG5nJywgJy4vcG9ydGZvbGlvL3BvcnRfMi5wbmcnLCAnLi9wb3J0Zm9saW8vcG9ydF8zLnBuZycsICAnLi9wb3J0Zm9saW8vcG9ydF80LnBuZyddLCBbJy4vcG9ydGZvbGlvL3BvcnRfMS5wbmcnLCAnLi9wb3J0Zm9saW8vcG9ydF8yLnBuZycsICcuL3BvcnRmb2xpby9wb3J0XzMucG5nJywgJy4vcG9ydGZvbGlvL3BvcnRfNC5wbmcnXSkpO1xyXG5cclxudmFyIHBvcnRmb2xpbyA9IG5ldyBQb3J0Zm9saW8oJ3BvcnRmb2xpbycsIFtcclxuICAgIHsgdGl0bGU6ICdUaGUgU3RvcnkgR3JhcGgnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL1N0b3J5R3JhcGhfQ2FyZC5wbmcnLCBkZXNjOiBcIlRoZSBTdG9yeSBHcmFwaCBpcyBhIG5vZGUgYmFzZWQgdmlzdWFsIHNjcmlwdGluZyB0b29sLiBTaW1pbGFyIHRvIEJsdWVwcmludHMgaW4gVW5yZWFsIEVuZ2luZSA0LCBUaGUgU3RvcnkgR3JhcGggbWFrZXMgc2NyaXB0aW5nIGVhc3kgZm9yIGRlc2lnbmVycyBhbmQgZGV2ZWxvcGVycyB3aG8gd2FudCB0byBwcm90b3R5cGUgcmFwaWRseS4gVGhpcyBpcyBhIFVuaXR5IEN1c3RvbSBFZGl0b3IgVG9vbCB0aGF0IGNhbiBiZSBib3VnaHQgb24gdGhlIFVuaXR5IEFzc2V0IFN0b3JlLlwiLCBzdGFjazogc3RvcnlncmFwaF9zdGFjaywgbWVkaWE6IG1bM10sIHR5cGU6ICdVbml0eSBDdXN0b20gRWRpdG9yIFRvb2wnLCB1cmw6ICdodHRwczovL2Fzc2V0c3RvcmUudW5pdHkuY29tL3BhY2thZ2VzL3Rvb2xzL3Zpc3VhbC1zY3JpcHRpbmcvc3RvcnktZ3JhcGgtMTM2NzEzJyB9LFxyXG4gICAgeyB0aXRsZTogJ0lzbGFuZCBEZXNpZ25lcicsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vaXNsYW5kLnBuZycsIGRlc2M6IFwiRHVyaW5nIG15IFNpZGVGWCBJbnRlcm5zaGlwIEkgY3JlYXRlZCBhbiBJc2xhbmQgRGVzaWduZXIgZ2FtZSBhcyBhbiBleHBlcmltZW50YWwgcHJvdG90eXBlIGZvciBIb3VkaW5pIGdlbmVyYXRpb24gb2YgY29udGVudCBkdXJpbmcgcnVudGltZS4gSSBkZXZlbG9wZWQgdGhpcyBwcm9qZWN0IGVudGlyZWx5IGZyb20gdGhlIGdyb3VuZCB1cCwgaW5jbHVkaW5nIGFsbCB0aGUgSG91ZGluaSBwcm9jZWR1cmFsIGFzc2V0cywgdXNlciBpbnRlcmZhY2UsIGFuZCBpbnRlcmFjdGlvbnMuIFRoaXMgaXNsYW5kIGRlc2lnbmVyIGV4cGxvcmVzIGludGVyYWN0aW9ucyBzdWNoIGFzIHBhaW50aW5nIGdyYXNzLCBwbGFjaW5nIGN1cnZlZCBhc3NldHMgc3VjaCBhcyBicmlkZ2VzIGFuZCB3YXRlcmZhbGxzLCBhbmQgcGxhY2luZyByYW5kb21seSBnZW5lcmF0ZWQgb2JqZWN0cyBzdWNoIGFzIHBhbG0gdHJlZXMgYW5kIGhvdXNlcy4gQWxvbmcgdGhlIHdheSBJIGxlYXJuZWQgYSBsb3QgYWJvdXQgSG91ZGluaSBwcm9jZWR1cmFsIG1vZGVsaW5nLCBhcyB3ZWxsIGFzIHBpcGVsaW5lIGludGVncmF0aW9uIHdpdGggVW5pdHkuIFBsZWFzZSBub3RlIHRoYXQgdGhpcyB3YXMgZXhwZXJpbWVudGFsIG9ubHksIGFuZCBzaG91bGQgbm90IGJlIHNlZW4gYXMgYW55IGluZGljYXRpb24gZm9yIHBsYW5zIFNpZGVGWCBoYXMgZm9yIHJ1bnRpbWUgZ2VuZXJhdGlvbiBvZiBjb250ZW50LlwiLCBzdGFjazogY2F2ZV9zdGFjaywgbWVkaWE6IG1bMl0sIHR5cGU6ICdIb3VkaW5pIEdhbWUgRGVtbycsIHVybDogJycgfSxcclxuICAgIHsgdGl0bGU6ICdQcm9jZWR1cmFsIE1vZGVsaW5nIFR1dG9yaWFsJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9sYWh1Zy5qcGVnJywgZGVzYzogXCJBIHR1dG9yaWFsIHByZXNlbnRlZCBhdCB0aGUgTEEgSG91ZGluaSBVc2VyIEdyb3VwIG9uIHByb2NlZHVyYWwgbW9kZWxpbmcgZm9yIGdhbWVzIHVzaW5nIEhvdWRpbmkuIFNob3djYXNlcyB0aGUgYmFzaWNzIG9mIFZFWCwgYW5kIGhvdyBJIHdlbnQgYWJvdXQgY3JlYXRpbmcgYSBwcm9jZWR1cmFsIGJyaWRnZSBkdXJpbmcgbXkgSG91ZGluaSBJbnRlcm5zaGlwLlwiLCBzdGFjazogY2F2ZV9zdGFjaywgbWVkaWE6IG1bMV0sIHR5cGU6ICdIb3VkaW5pIFR1dG9yaWFsJywgdXJsOiAnaHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1Nc1pqVUhoQ2pKOCcgfSxcclxuICAgIHsgdGl0bGU6ICdIeXBlcmhvcDogR2FsYWN0aWMgTGFuY2VyJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9oeXBlcmhvcC5wbmcnLCBkZXNjOiBcIkh5cGVyaG9wIGlzIG15IEx1ZHVtIERhcmUgNDYgR2FtZSBKYW0gc3VibWlzc2lvbi4gT24gYSB0ZWFtIG9mIGZvdXIsIGluIGp1c3QgNzIgaG91cnMgSSBtb2RlbGVkLCBhbmltYXRlZCwgYW5kIHNjcmlwdGVkIGJlaGF2aW9yIHRoZSBvZiB0aGUgcGxhbmV0cywgYXMgd2VsbCBhcyByaWdnZWQgdGhlIG1haW4gY2hhcmFjdGVyLiBJIGxlYXJuZWQgYSBsb3QgYWJvdXQgYmxlbmRzaGFwZXMgYW5kIGNyZWF0aW5nIGZhY2lhbCByaWdzIGluIEhvdWRpbmkgYXMgd2VsbCBhcyBhbmltYXRpb24gc3RhdGVzIGluIFVuaXR5LlwiLCBzdGFjazogY2F2ZV9zdGFjaywgbWVkaWE6IG1bMTBdLCB0eXBlOiAnVW5pdHkgR2FtZScsIHVybDogJ2h0dHBzOi8vc3dhbmlqYW0uaXRjaC5pby9oeXBlcmhvcCcgfSxcclxuICAgIHsgdGl0bGU6ICdBeG9uIFJ1c2gnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL2F4b25ydXNoLnBuZycsIGRlc2M6IFwiQXhvbiBSdXNoIGlzIG15IEdsb2JhbCBHYW1lIEphbSAyMDIwIHN1Ym1pc3Npb24uIE9uIGEgdGVhbSBvZiBzaXgsIHdlIHdhbnRlZCB0byBtYWtlIGEgZ2FtZSBhYm91dCBtZW50YWwgaGVhbHRoLi4uIGxpdGVyYWxseSEgT3VyIGdhbWUgQXhvbiBSdXNoIGlzIGEgM0QgUGxhdGZvcm1lciB3aGVyZSBpdCBpcyB5b3VyIGpvYiB0byByZXBhaXIgdGhlIHRoZSBicmFpbiBieSBzaG9vdGluZyBlbGVjdHJpYyBpbXB1bHNlcyB0byBicm9rZW4gYXhvbnMuIEkgd29ya2VkIG9uIFZGWCBhbmQgdGhlIHBsYXllciBjaGFyYWN0ZXIgc2hvb3RpbmcgYmVoYXZpb3IuXCIsIHN0YWNrOiBjYXZlX3N0YWNrLCBtZWRpYTogbVs2XSwgdHlwZTogJ1VuaXR5IEdhbWUnLCB1cmw6ICdodHRwczovL2dsb2JhbGdhbWVqYW0ub3JnLzIwMjAvZ2FtZXMvYXhvbi1ydXNoLTInIH0sXHJcbiAgICB7IHRpdGxlOiAnQmlvc2hyb29tJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9iaW9zaHJvb21fY2FyZC5wbmcnLCBkZXNjOiBcIkJpb3Nocm9vbSBpcyBhIGZpcnN0IHBlcnNvbiBleHBsb3JhdGlvbiBhbmQgZ2FyZGVuaW5nIGdhbWUuIFlvdSBhcmUgYSBCaW9sb2dpc3QgZXhwbG9yaW5nIGEgZm9yZWlnbiBwbGFuZXQgaW5mZXN0ZWQgd2l0aCBtdXNocm9vbXMuIEl0IGlzIHlvdXIgZ29hbCB0byBleHBsb3JlIHRoZSBwbGFuZXQsIGdhdGhlciBuZXcgbXVzaHJvb21zLCBhbmQgYnJlZWQgdGhlbSB0byBzZW5kIGJhY2sgdG8geW91ciBob21lIHBsYW5ldC4gT24gdGhpcyBwcm9qZWN0IEkgd29ya2VkIGFzIGEgdGVjaG5pY2FsIGFydGlzdCBhbmQgZGV2ZWxvcGVyLiBJIGRldmVsb3BlZCBhIHByb2NlZHVyYWwgbXVzaHJvb20gdXNpbmcgYmxlbmRzaGFwZXMsIGFzIHdlbGwgYXMgYSBtdXNocm9vbSBzcGF3bmVyIHRoYXQgdXNlcyB2ZXJ0ZXggY29sb3JzIG9uIHRoZSBncm91bmQuXCIsIHN0YWNrOiByZW1fc3RhY2ssIG1lZGlhOiBtWzVdLCB0eXBlOiAnVW5pdHkgR2FtZScsIHVybDogJycgfSxcclxuICAgIHsgdGl0bGU6ICdBbmQgdGhlIENyb3dkIEdvZXMgV2lsZCEnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL2Nyb3dkX2NhcmQucG5nJywgZGVzYzogXCJBbmQgdGhlIENyb3dkIEdvZXMgV2lsZCBpcyBhIHZpcnR1YWwgcmVhbGl0eSBpbnRlcmFjdGl2ZSBleHBlcmllbmNlIHdoZXJlIHlvdSBwdXQgb24gYSBtYWdpYyBzaG93IGZvciBhbiBhdWRpZW5jZSBvZiBnaG9zdHMuIFRoaXMgZXhwZXJpZW5jZSB1c2VzIE9jdWx1cyBWUiBhcyB3ZWxsIGFzIHRoZSBMZWFwbW90aW9uIHRvIHRydWx5IHNpbXVsYXRlIG1hZ2ljIGNvbWluZyBvdXQgb2YgeW91ciBmaW5nZXJ0aXBzIHZpYSBMZWFwIE1vdGlvbiBnZXN0dXJlcy4gSSBkZXZlbG9wZWQgdGhpcyBnYW1lIGVudGlyZWx5IHVzaW5nIFRoZSBTdG9yeSBHcmFwaCwgdGhlIFVuaXR5IEN1c3RvbSBFZGl0b3IgVG9vbCBJIGNyZWF0ZWQuIE1hZGUgaW4gb25seSAxIG1vbnRoIGZvciBteSBJbnRyb2R1Y3Rpb24gdG8gVmlydHVhbCBSZWFsaXR5IGNsYXNzLCB0aGlzIGV4cGVyaWVuY2UgZXhwbG9yZXMgVmlydHVhbCBSZWFsaXR5IFVzZXIgRXhwZXJpZW5jZSBkZXNpZ24gd2l0aCBnZXN0dXJlIGJhc2VkIGNvbnRyb2xzLlwiLCBzdGFjazogc3RvcnlncmFwaF9zdGFjaywgbWVkaWE6IG1bNF0sIHR5cGU6ICdVbml0eSBWUiBFeHBlcmllbmNlJywgdXJsOiAnJyB9LFxyXG4gICAgeyB0aXRsZTogJ0hpdmUgSml2ZScsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vYmVlX2NhcmQucG5nJywgZGVzYzogXCJIaXZlIEppdmUgaXMgYSB2aXJ0dWFsIHJlYWxpdHkgZ2FtZSB3aGVyZSB5b3UgZmx5IGFyb3VuZCBhcyBhIGJlZS4gVGhlIGdvYWwgb2YgdGhlIGdhbWUgaXMgdG8gcmVwb2xsaW5hdGUgdGhlIGlzbGFuZCBhbmQgY2xlYXIgaXQgb2YgYWxsIGl0cyB0cmFzaC4gSSB3b3JrZWQgaW4gYSBncm91cCBhcyBhIFRlY2huaWNhbCBBcnRpc3QsIHdoZXJlIEkgY3JlYXRlZCB0aGUgYmVlIGZ1ciBzaGFkZXIsIHRoZSBncmFzcyBzaGFkZXIsIHJpZ2dpbmcgdGhlIGJlZSwgYW5kIHNldHRpbmcgdXAgR1BVIHBhaW50aW5nIG9uIHRoZSBwbGF5ZXIgY29udHJvbGxlci4gVGhpcyBnYW1lIHdhcyBzaG93biBhdCBTaWdncmFwaCBhdCBEcmV4ZWwgVW5pdmVyc2l0eSdzIGJvb3RoIHVzaW5nIGEgTW90b3JiaWtlIENvbnRyb2xsZXIuXCIsIHN0YWNrOiBiZWVfc3RhY2ssIG1lZGlhOiBtWzExXSwgdHlwZTogJ1ZpcnR1YWwgUmVhbGl0eSBHYW1lJywgdXJsOiAnJyB9LFxyXG4gICAgeyB0aXRsZTogJ1Byb2NlZHVyYWwgQ2F2ZScsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vY2F2ZV9jYXJkLnBuZycsIGRlc2M6IFwiVGhpcyBQcm9jZWR1cmFsIENhdmUgaGFzIGNvbnRyb2xzIG51bWJlciBvZiByb29tcywgc3RhbGFnbWl0ZXMsIG51bWJlciBvZiBoYWxsd2F5cyBiZXR3ZWVuIHJvb21zLCBhcyB3ZWxsIGFzIHVzaW5nIGEgcHJvY2V1ZHJhbCBtYXRlcmlhbC4gVGhlIHByb2NlZHVyYWwgbWF0ZXJpYWwgaXMgZXhwb3J0ZWQgZnJvbSBIb3VkaW5pJ3MgdGV4dHVyZSBiYWtlciwgYW5kIGJyb3VnaHQgaW50byBVbml0eS4gUGVyZmVjdCBhc3NldCBmb3IgYW55IGR1bmdlb24gY3Jhd2xlci5cIiwgc3RhY2s6IGNhdmVfc3RhY2ssIG1lZGlhOiBtWzhdLCB0eXBlOiAnSG91ZGluaSBNb2RlbCcsIHVybDogJycgfSxcclxuICAgIHsgdGl0bGU6ICdUdWJlIERvbWUgRXhwZXJpZW5jZScsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vdHViZV9jYXJkLnBuZycsIGRlc2M6IFwiRm9yIGEgRG9tZSBleGhpYml0IEkgY3JlYXRlZCBhbiBhYnN0cmFjdCB0dWJlIGFuaW1hdGlvbiB1c2luZyBkaXN0YW5jZSBmaWVsZCB2b2x1bWVzLCBhbmQgYSBHUFUgcHJvY2V1ZHJhbCBtZXNoIGNvbXB1dGUgc2hhZGVyIGluIFVuaXR5LiBUbyBleHBvcnQgZm9yIHRoZSBkb21lLCBJIGRldmVsb3BlZCBhIEZpc2hleWUgTGVucyBSZW5kZXIgUGlwZWxpbmUuIEZvciB0aGlzIHByb2plY3QgSSBsZXZlcmFnZWQgb3BlbiBzb3VyY2UgZnJvbSBLZWlqaXJvLlwiLCBzdGFjazogc3RvcnlncmFwaF9zdGFjaywgbWVkaWE6IG1bOV0sIHR5cGU6ICdJbW1lcnNpdmUgRXhwZXJpZW5jZScsIHVybDogJycgfSxcclxuICAgIHsgdGl0bGU6ICdSZW0nLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL3JlbWVtYmVyZW5jZV9sb2dvLmpwZycsIGRlc2M6IFwiUmVtIGlzIGEgdmlkZW8gZ2FtZSBhYm91dCBhIHlvdW5nIGdpcmwgdHJhcHBlZCBpbiBhIGNvbWF0b3NlIGRyZWFtc2NhcGUuIFlvdSBwbGF5IGFzIGEgeW91bmcgZ2lybCB3aG8gbXVzdCBvdmVyY29tZSBoZXIgZmVhcnMgdG8gcmVtZW1iZXIgaGVyIHBhc3QuIEluIHRoaXMgZnVuLCBvdmVyLXRoZS1zaG91bGRlciBzdGVhbHRoIGdhbWUgeW91IG11c3QgYXZvaWQgc2NyZWVuIGhlYWRlZCBlbmVtaWVzLCBhbmQgZmluZCBtZW1lbnRvcyBvZiB5b3VyIHBhc3QuIEZvciB0aGlzIHByb2plY3QgSSB3b3JrZWQgaW4gbWFueSBhcmVhcyBpbmNsdWRpbmcgTGV2ZWwgRGVzaWduLCBWaXN1YWwgRWZmZWN0cywgV2ViIERldmVsb3BtZW50LCBNb2RlbGluZywgYW5kIERvY3VtZW50YXRpb24uXCIsIHN0YWNrOiByZW1fc3RhY2ssIG1lZGlhOiBtWzBdLCB0eXBlOiAnVW5pdHkgR2FtZScsIHVybDogJ2h0dHBzOi8vb2ZmYnJhbmRoZWxsdWkuaGVyb2t1YXBwLmNvbS8jL2hvbWUnIH0sXHJcbiAgICB7IHRpdGxlOiAnRG9vciB0byBEb29yJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9yb2JvdF9jYXJkLnBuZycsIGRlc2M6IFwiQXMgcGFydCBvZiBteSBBbmltYXRpb24gY2xhc3MsIEkgY3JlYXRlZCBhIHNob3J0IGZpbG0gYWJvdXQgYSByb2JvdCB3aG8gZ29lcyB0aHJvdWdoIG1hbnkgc3RyYW5nZSB3b3JsZHMuIEkgbW9kZWxlZCwgdGV4dHVyZWQsIHJpZ2dlZCwgYW5kIGFuaW1hdGVkIGV2ZXJ5dGhpbmcgYW5kIHJlbmRlcmVkIG91dCBpbiBVbml0eS4gSSBhbHNvIGNyZWF0ZWQgYSB0b29uIHNoYWRlciB3aXRoIGEgaGlnaGxpZ2h0IGFuZCBvdXRsaW5lIGFzIHdlbGwgYXMgZGlkIHNvbWUgVkZYIGluIFVuaXR5LiBJdCB3YXMgYSBodWdlIGxlYXJuaW5nIGV4cGVyaWVuY2UgdG8gZ28gdGhyb3VnaCBldmVyeSBwYXJ0IG9mIHRoZSBhbmltYXRpb24gcGlwZWxpbmUhXCIsIHN0YWNrOiByZW1fc3RhY2ssIG1lZGlhOiBtWzddLCB0eXBlOiAnUm9ib3QgQW5pbWF0aW9uJywgdXJsOiAnJyB9XSk7XHJcbiAgICAvLyB7IHRpdGxlOiAnUm9hc3QnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL3JvYXN0XzcuanBnJywgZGVzYzogXCJSb2FzdCBpcyBhIHdlYmFwcCB0aGF0IHN1cnZleXMgY29tZm9ydCBpbiBhbiBpbmRvb3Igc3BhY2UuIEl0IGFza3MgcXVlc3Rpb25zIHRoYXQgZ2F1Z2UgdGVtcGVyYXR1cmUsIG5vaXNlLCBzbWVsbCwgYW5kIGh1bWlkaXR5LCBhbmQgbWFwcyBpdCB0byB3aGVyZSB5b3UgYXJlIG9uIHlvdXIgYnVpbGRpbmcncyBmbG9vcnBsYW4uIFRocm91Z2ggdGhpcyBjcm93ZCBzb3VyY2VkIGRhdGEgY29sbGVjdGVkLCBidWlsZGluZyBtYW5hZ2VycywgYXJjaGl0ZWN0cyBhbmQgdGhlIHBlb3BsZSB0YWtpbmcgdGhlIHN1cnZleSBjYW4gdW5kZXJzdGFuZCBob3cgcGVvcGxlIGZlZWwgaW4gYSBzcGFjZS4gSSB3b3JrZWQgb24gdGhpcyBwcm9qZWN0IGZvciA2IG1vbnRocyB3aGlsZSBJIHdhcyB3b3JraW5nIGF0IHRoZSBhcmNoaXRlY3R1cmUgZmlybSwgS2llcmFuIFRpbWJlcmxha2UuXCIsIHN0YWNrOiByb2FzdF9zdGFjaywgbWVkaWE6IG1bNV0sIHR5cGU6ICdXZWIgQXBwJywgdXJsOiAnJyB9LFxyXG4gICAgLy8geyB0aXRsZTogJ1BvcnRmb2xpbycsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vcG9ydF8xLnBuZycsIGRlc2M6IFwiRnJvbSBjb25jZXB0IHRvIGRlc2lnbiB0byBkZXZlbG9wbWVudCBJIHB1dCBhIGxvdCBvZiBsb3ZlIGludG8gdGhpcy4gQXMgYSBwZXJzb25hbCBjaGFsbGVuZ2UgSSBjcmVhdGVkIHRoaXMgd2Vic2l0ZSBlbnRpcmVseSBpbiBUeXBlc2NyaXB0IHdpdGggbm8galF1ZXJ5LiBBbGwgaW4gYWxsIEkgY2FuIGNvbmNsdWRlIHRoYXQgalF1ZXJ5IGlzIG92ZXJyYXRlZCEgSmF2YSBTY3JpcHQgaXMgcG93ZXJmdWwgZW5vdWdoIG9uIGl0cyBvd24uXCIsIHN0YWNrOiBwb3J0X3N0YWNrLCBtZWRpYTogbVs3XSwgdHlwZTogJ1dlYnNpdGUnLCB1cmw6ICdodHRwczovL2dpdGh1Yi5jb20vbWF0dHdhZ2FyL1dlYnNpdGVzL3RyZWUvbWFzdGVyL3BvcnRmb2xpb193ZWJzaXRlX3YyJyB9LFxyXG4gICAgLy8geyB0aXRsZTogJ0JyZWF0aGxlc3MnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnJywgZGVzYzogXCJUaGUgU3BhY2UgUGlyYXRlLCBBcmlhLCBpcyBvbiBhIG1pc3Npb24gdG8gbG9vdCBhIG1pbmVyYWwgY2FyZ28gc2hpcC4gSG93ZXZlciwgdXBvbiBsYW5kaW5nIG9uIHRoZSBjYXJnbyBzaGlwLCBBcmlhJ3MgaGVsbWV0IGNyYWNrcyBjYXVzaW5nIGhlciB0byBzbG93bHkgbG9zZSBveHlnZW4uIEl0J3Mgbm93IGEgcmFjZSBhZ2FpbnN0IHRpbWUgdG8gY29sbGVjdCBhbGwgdGhlIGdlbXMgYmVmb3JlIGhlciBveHlnZW4gcnVucyBvdXQhXCIsIHN0YWNrOiBicmVhdGhsZXNzX3N0YWNrLCBtZWRpYTogbVsyXSwgdHlwZTogJ0hUTUw1IEdhbWUnLCB1cmw6ICcvYnJlYXRobGVzcycgfV0pO1xyXG4gICAgLy8geyB0aXRsZTogJ0JyZWF0aGxlc3MnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnJywgZGVzYzogXCJUaGUgU3BhY2UgUGlyYXRlLCBBcmlhLCBpcyBvbiBhIG1pc3Npb24gdG8gbG9vdCBhIG1pbmVyYWwgY2FyZ28gc2hpcC4gSG93ZXZlciwgdXBvbiBsYW5kaW5nIG9uIHRoZSBjYXJnbyBzaGlwLCBBcmlhJ3MgaGVsbWV0IGNyYWNrcyBjYXVzaW5nIGhlciB0byBzbG93bHkgbG9zZSBveHlnZW4uIEl0J3Mgbm93IGEgcmFjZSBhZ2FpbnN0IHRpbWUgdG8gY29sbGVjdCBhbGwgdGhlIGdlbXMgYmVmb3JlIGhlciBveHlnZW4gcnVucyBvdXQhXCIsIHN0YWNrOiBicmVhdGhsZXNzX3N0YWNrLCBtZWRpYTogbVsyXSwgdHlwZTogJ0hUTUw1IEdhbWUnLCB1cmw6ICcvYnJlYXRobGVzcycgfV0pO1xyXG4gICAgLy8geyB0aXRsZTogJ01lYW4gRm9yZWNhc3QnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL21lYW5fZm9yZWNhc3RfMS5qcGcnLCBkZXNjOiAnQSBzbWFsbCB3ZWIgYXBwIHRoYXQgY2FsY3VsYXRlcyB0aGUgYXZlcmFnZSBvZiAzIHdlYXRoZXIgQVBJXFwnczogV3VuZGVyZ3JvdW5kLCBGb3JlY2FzdC5pbywgYW5kIFdvcmxkIFdlYXRoZXIgT25saW5lLiBUaGlzIGRhdGEgaXMgdGhlbiBzZXJ2ZWQgb250byBhIEQzLmpzIExpbmUgQ2hhcnQgZm9yIHRlbXBlcmF0dXJlLCBodW1pZHR5LCBhbmQgd2luZHNwZWVkLiBBbHNvIHRoZSB3ZWJhcHAgaXRzZWxmIGhhcyBtYW55IHN1YnRsZXRpZXMgdGhhdCBhcmUgYWZmZWN0ZWQgYnkgd2VhdGhlciBkYXRhLiBGb3IgZXhhbXBsZSwgdGhlIHZpZGVvICByZXNlbWJsZXMgdGhlIGN1cnJlbnQgd2VhdGhlci4gQWxzbyBlYWNoIGdyYXBoIGlzIGNvbG9yIGNvYXRlZCBieSBhIGdyYWRpZW50IGJhc2VkIG9uIHRoZSB3ZWF0aGVyIGRhdGEuJywgc3RhY2s6IHdlYXRoZXJfc3RhY2ssIG1lZGlhOiBtWzRdLCB0eXBlOiAnV2Vic2l0ZScsIHVybDogJy9tZWFuZm9yZWNhc3QnIH0sXHJcbiAgICAvLyB7IHRpdGxlOiAnUSpCZXJ0JywgdGl0bGVfaW1hZ2U6IFwiLi9wb3J0Zm9saW8vcWJlcnRfcGxheS5qcGdcIiwgZGVzYzogJ1RoaXMgaXMgbXkgQm91bmNpbmcgQmFsbCBBc3NpZ25tZW50IGZvciBBbmltYXRpb24gMSBhdCBEcmV4ZWwgVW5pdmVyc2l0eS4gV2hlbiBwaWNraW5nIGEgZ2FtZSB0aGF0IG1peGVzIG15IGxvdmUgb2YgcmV0cm8gdmlkZW8gZ2FtZXMgYW5kIGJvdW5jaW5nIGJhbGxzLCBRKkJlcnQgd2FzIGEgbm8tYnJhaW5lci4gRXZlcnl0aGluZyBpcyBvcmlnaW5hbGx5IG1vZGVsbGVkLCB0ZXh0dXJlZCwgYW5kIGFuaW1hdGVkLiBNYWRlIGluIE1heWEsIGFuZCByZW5kZXJlZCBpbiBWLVJheS4nLCBzdGFjazogcWJlcnRfc3RhY2ssIG1lZGlhOiBtWzJdLCB0eXBlOiAnQW5pbWF0aW9uJywgdXJsOiAnaHR0cHM6Ly92aW1lby5jb20vMTk4MTQ5Nzk1JyB9LFxyXG4gICAgLy8geyB0aXRsZTogJ0JlZHJvb20nLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL2NnaV9maW5hbF8xLnBuZycsIGRlc2M6ICdUaGlzIGlzIG15IGZpbmFsIGZvciBDR0kgMiBhdCBEcmV4ZWwgVW5pdmVyc2l0eS4gVGhlIGFzc2lnbm1lbnQgd2FzIHRvIHJlY3JlYXRlIGFueSB0eXBlIG9mIHJvb20sIHNvIEkgY2hvc2UgYSBsaXR0bGUgYm95XFwncyByb29tLiBXZSB3ZXJlIHRhc2tlZCB3aXRoIGNyZWF0aW5nIGF0IGxlYXN0IG9uZSBjb21wbGV4IG9iamVjdCwgc28gSSBkZWNpZGVkIHRvIGdvIHdpdGggYSB0cmFpbiBzZXQuJywgc3RhY2s6IHFiZXJ0X3N0YWNrLCBtZWRpYTogbVszXSwgdHlwZTogJzNEIFJlbmRlcicsIHVybDogJycgfV0pO1xyXG5cclxuXHJcbi8vIHZhciB3ZWxjb21lX2IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2VsY29tZS1idXR0b24nKTtcclxuLy8gd2VsY29tZV9iLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICBqdW1wKCcjcG9ydGZvbGlvJywge1xyXG4vLyAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxyXG4vLyAgICAgICAgIG9mZnNldDogMCxcclxuLy8gICAgICAgICBjYWxsYmFjazogdW5kZWZpbmVkLFxyXG4vLyAgICAgICAgIGVhc2luZzoganVtcC5lYXNlSW5PdXRRdWFkLFxyXG4vLyAgICAgICAgIGFsbHk6IGZhbHNlXHJcbi8vICAgICB9KVxyXG4vLyB9XHJcblxyXG5cclxuLyoqIFxyXG4gKiBwb3J0Zm9saW8gd2Vic2l0ZVxyXG4gKiBicmVhdGhsZXNzXHJcbiAqIHdlYXRoZXIgd2Vic2l0ZVxyXG4gKiBxYmVydCBhbmltYXRpb25cclxuICogY2dpIDIgZmluYWw/PyBcclxuICogXHJcbiovXHJcblxyXG5cclxuXHJcbndpbmRvdy5vbnJlc2l6ZSA9IChlKSA9PiB7XHJcbiAgICBpZiAoYXBwLmNhbnZhcykge1xyXG4gICAgICAgIGFwcC5zaXplQ2FudmFzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcG9ydGZvbGlvLmFwcGVuZEFsbCgpO1xyXG5cclxufTtcclxuXHJcblxyXG4vLyB2YXIgZG9jV2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub2Zmc2V0V2lkdGg7XHJcblxyXG4vLyBbXS5mb3JFYWNoLmNhbGwoXHJcbi8vICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnKicpLFxyXG4vLyAgIGZ1bmN0aW9uKGVsKSB7XHJcbi8vICAgICBpZiAoZWwub2Zmc2V0V2lkdGggPiBkb2NXaWR0aCkge1xyXG4vLyAgICAgICBjb25zb2xlLmxvZyhlbCk7XHJcbi8vICAgICB9XHJcbi8vICAgfVxyXG4vLyApO1xyXG5cclxuLy8gdmFyIG1lZGlhID0gbmV3IE1lZGlhKCdtZWRpYS0wJywgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9jYXQuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiLCBcIi4vcG9ydGZvbGlvL2NhdC5qcGdcIl0pO1xyXG5cclxuIiwiZXhwb3J0ICogZnJvbSBcIi4vbWVkaWFcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNZWRpYUl0ZW17XHJcbiAgICBtZWRpYTogTWVkaWE7XHJcbiAgICBodG1sOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIG9yZGVyOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihtZWRpYTogTWVkaWEsIGh0bWw6SFRNTERpdkVsZW1lbnQsIG9yZGVyOiBudW1iZXIpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgICAgIHZtLmh0bWwgPSBodG1sO1xyXG4gICAgICAgIHZtLm9yZGVyID0gb3JkZXI7XHJcbiAgICAgICAgdm0uaHRtbC5vbmNsaWNrID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdm0ubWVkaWEubG9hZE1lZGlhKHZtLm9yZGVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNZWRpYSB7XHJcbiAgICBpZDpzdHJpbmdcclxuICAgIGVsZW1lbnRzOiBhbnlbXTtcclxuICAgIHRodW1ibmFpbHM6IEhUTUxJbWFnZUVsZW1lbnRbXTtcclxuICAgIG1lZGlhX2l0ZW1zOiBNZWRpYUl0ZW1bXTtcclxuICAgIHNlbGVjdGVkOiBudW1iZXI7XHJcbiAgICB2aW1lbzpzdHJpbmc7XHJcblxyXG4gICAgcm93OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgb3ZlcmxheTpIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbG1kOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgXHJcbiAgICBtZWRpYV9zZWxlY3RlZDpIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIHRodW1ibmFpbHM6IHN0cmluZ1tdLCBmaWxlcz86IHN0cmluZ1tdLCB2aW1lbz86IHN0cmluZyl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmlkID0gaWQ7XHJcbiAgICAgICAgdm0uc2VsZWN0ZWQgPSAwO1xyXG4gICAgICAgIHZtLmVsZW1lbnRzID0gW107XHJcbiAgICAgICAgdm0ubWVkaWFfaXRlbXMgPSBbXTtcclxuICAgICAgICB2bS50aHVtYm5haWxzID0gW107XHJcblxyXG4gICAgICAgIHZtLnZpbWVvID0gdmltZW87XHJcbiAgICAgICAgaWYodmltZW8pe1xyXG4gICAgICAgICAgICAgICAgdmFyIGZyYWcgPSB2bS5jcmVhdGVGcmFnbWVudCh2aW1lbyk7XHJcbiAgICAgICAgICAgICAgICB2bS5lbGVtZW50cy5wdXNoKGZyYWcpO1xyXG4gICAgICAgICAgICAgICAgLy8gdm0uZWxlbWVudHNbaV0uY2xhc3NMaXN0LmFkZCgnZHJvcHNoYWRvdycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHZtLmVsZW1lbnRzLmxlbmd0aDtcclxuICAgICAgICBpZihmaWxlcyl7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxyXG4gICAgICAgICAgICAgICAgaW1hZ2Uuc3JjID0gZmlsZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpbWFnZS5jbGFzc0xpc3QuYWRkKCdkcm9wc2hhZG93Jyk7XHJcbiAgICAgICAgICAgICAgICB2bS5lbGVtZW50cy5wdXNoKGltYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5tZWRpYV9zZWxlY3RlZC5pZCA9ICdtZWRpYS1zZWxlY3RlZCc7XHJcblxyXG4gICAgICAgIHZtLm92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5vdmVybGF5LmNsYXNzTGlzdC5hZGQoJ292ZXJsYXktbWVkaWEnKTtcclxuXHJcbiAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQuYXBwZW5kQ2hpbGQodm0ub3ZlcmxheSk7XHJcblxyXG4gICAgICAgIHZtLnJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnJvdy5jbGFzc0xpc3QuYWRkKCdyb3cnLCdqdXN0aWZ5LWNlbnRlcicsJ21lZGlhLWNvbnRhaW5lcicpO1xyXG5cclxuICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgdm0uZWxlbWVudHMubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgICAgICB2bS5jb2xtZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICB2bS5jb2xtZC5jbGFzc0xpc3QuYWRkKCdjb2wteHMnKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBodG1sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICAgICAgaHRtbC5jbGFzc0xpc3QuYWRkKCdtZWRpYS1pdGVtJyk7XHJcbiAgICAgICAgICAgIHZhciBtZWRpYV9pdGVtID0gbmV3IE1lZGlhSXRlbSh2bSxodG1sLGopO1xyXG4gICAgICAgICAgICB2bS5tZWRpYV9pdGVtcy5wdXNoKG1lZGlhX2l0ZW0pO1xyXG5cclxuICAgICAgICAgICAgdm0udGh1bWJuYWlscy5wdXNoKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpKTtcclxuICAgICAgICAgICAgdm0udGh1bWJuYWlsc1tqXS5jbGFzc0xpc3QuYWRkKCdkcm9wc2hhZG93Jyk7XHJcbiAgICAgICAgICAgIHZtLnRodW1ibmFpbHNbal0uc3JjID0gdGh1bWJuYWlsc1tqXTtcclxuXHJcbiAgICAgICAgICAgIHZtLmNvbG1kLmFwcGVuZENoaWxkKHZtLm1lZGlhX2l0ZW1zW2pdLmh0bWwpO1xyXG4gICAgICAgICAgICB2bS5jb2xtZC5hcHBlbmRDaGlsZCh2bS50aHVtYm5haWxzW2pdKTtcclxuICAgICAgICAgICAgdm0ucm93LmFwcGVuZENoaWxkKHZtLmNvbG1kKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICAgICAgICNtZWRpYS1zZWxlY3RlZFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAub3ZlcmxheVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICBpbWcoc3JjPVwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIikuZHJvcHNoYWRvd1xyXG4gICAgICAgIC8vICAgICAgICAgIC5yb3cuanVzdGlmeS1jZW50ZXIubWVkaWEtY29udGFpbmVyXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIC5jb2wtbWRcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIC5tZWRpYS1pdGVtXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICBpbWcoc3JjPVwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIikuZHJvcHNoYWRvd1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAuY29sLW1kXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAubWVkaWEtaXRlbVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpLmRyb3BzaGFkb3dcclxuXHJcblxyXG4gICAgICAgIHZtLm1lZGlhX2l0ZW1zW3ZtLnNlbGVjdGVkXS5odG1sLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgLy8gdm0uZWxlbWVudHMucHVzaCh2bS5lbGVtZW50c1swXSk7XHJcbiAgICAgICAgLy8gdm0uZWxlbWVudHMuc2hpZnQoKTtcclxuICAgICAgICAvLyB2bS5zZXRJZChpZCk7XHJcbiAgICAgICAgLy8gdm0ubG9hZE1lZGlhKDApO1xyXG5cclxuICAgIH1cclxuICAgIGNyZWF0ZUZyYWdtZW50KHN0cjogc3RyaW5nLCB3aWR0aD86IG51bWJlciwgaGVpZ2h0PzogbnVtYmVyICkge1xyXG4gICAgICAgIHZhciBuZXdzdHIgPSBzdHI7XHJcbiAgICAgICAgaWYod2lkdGgpe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbmV3c3RyID0gc3RyLnJlcGxhY2UoJ3dpZHRoPVwiXFxkK1wiIGhlaWdodD1cIlxcZCtcIicsICd3aWR0aD1cIicrd2lkdGgrJ1wiIGhlaWdodD1cIicraGVpZ2h0KydcIicpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG5cclxuICAgICAgICB2YXIgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGVsZW0uaW5uZXJIVE1MID0gc3RyO1xyXG5cclxuICAgICAgICB3aGlsZSAoZWxlbS5jaGlsZE5vZGVzWzBdKSB7XHJcbiAgICAgICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoZWxlbS5jaGlsZE5vZGVzWzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZyYWc7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SWQoaWQ6IHN0cmluZyl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZhciBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgd2hpbGUocGFyZW50LmZpcnN0Q2hpbGQpe1xyXG4gICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQocGFyZW50LmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodm0ubWVkaWFfc2VsZWN0ZWQpO1xyXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh2bS5yb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIHNpemUoKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ub3ZlcmxheS5zdHlsZS53aWR0aCA9ICh2bS5tZWRpYV9zZWxlY3RlZC5jbGllbnRXaWR0aCsxMikrJ3B4JztcclxuICAgICAgICB2bS5vdmVybGF5LnN0eWxlLmhlaWdodCA9ICh2bS5tZWRpYV9zZWxlY3RlZC5jbGllbnRIZWlnaHQrOCkrJ3B4JztcclxuICAgIH1cclxuXHJcbiAgICBsb2FkTWVkaWEodGh1bWJfbnVtOm51bWJlcil7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgLy8gdm0ubWVkaWFfc2VsZWN0ZWQucmVtb3ZlQ2hpbGQodm0ubWVkaWFfc2VsZWN0ZWQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgdm0ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdjbG9zZS1tZWRpYScpO1xyXG5cclxuICAgICAgICB2bS5zaXplKCk7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB2bS5tZWRpYV9pdGVtcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhX2l0ZW1zW2ldLmh0bWwuc3R5bGUud2lkdGggPSB2bS5jb2xtZC5jbGllbnRXaWR0aCsncHgnO1xyXG4gICAgICAgICAgICB2bS5tZWRpYV9pdGVtc1tpXS5odG1sLnN0eWxlLmhlaWdodCA9IHZtLmNvbG1kLmNsaWVudEhlaWdodCsncHgnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodm0udmltZW8gJiYgdGh1bWJfbnVtID09PSAwKXtcclxuICAgICAgICAgICAgICAgIHZtLmVsZW1lbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZnJhZyA9IHZtLmNyZWF0ZUZyYWdtZW50KHZtLnZpbWVvLCB2bS5tZWRpYV9zZWxlY3RlZC5jbGllbnRXaWR0aCwgdm0ubWVkaWFfc2VsZWN0ZWQuY2xpZW50SGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIHZtLmVsZW1lbnRzLnVuc2hpZnQoZnJhZyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdm0ub3ZlcmxheS5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5lbGVtZW50c1tpXS5jbGFzc0xpc3QuYWRkKCdkcm9wc2hhZG93Jyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdm0ub3ZlcmxheS5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8qYnV0dG9uIHRyYW5zaXRpb24qL1xyXG4gICAgICAgIHZtLm1lZGlhX2l0ZW1zW3ZtLnNlbGVjdGVkXS5odG1sLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgdm0uc2VsZWN0ZWQgPSB0aHVtYl9udW07XHJcbiAgICAgICAgdm0ubWVkaWFfaXRlbXNbdm0uc2VsZWN0ZWRdLmh0bWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgICAgLypwaWN0dXJlIHRyYW5zaXRpb24qL1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgIC8vIGlmKHZtLnZpbWVvICYmIHZtLnNlbGVjdGVkID09PSAwKXtcclxuXHJcbiAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh2bS5tZWRpYV9zZWxlY3RlZC5jaGlsZHJlbi5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1lZGlhX3NlbGVjdGVkLnJlbW92ZUNoaWxkKHZtLm1lZGlhX3NlbGVjdGVkLmxhc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZtLm1lZGlhX3NlbGVjdGVkLmFwcGVuZENoaWxkKHZtLmVsZW1lbnRzW3ZtLnNlbGVjdGVkXSk7XHJcbiAgICAgICAgICAgIHZtLm92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZSgnY2xvc2UtbWVkaWEnKTtcclxuICAgICAgICAgICAgdm0ubWVkaWFfaXRlbXNbdm0uc2VsZWN0ZWRdLmh0bWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcclxuICAgICAgICB9LCA2MDApOyAgIFxyXG4gICAgfVxyXG59IiwiZXhwb3J0ICogZnJvbSBcIi4vc2tpbGxfYmFkZ2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTa2lsbCB7XHJcbiAgZmxleF9pdGVtOiBIVE1MRGl2RWxlbWVudDtcclxuICBzdmc6IFNWR1NWR0VsZW1lbnQ7XHJcbiAgc3ZnX2NpcmNsZTogU1ZHQ2lyY2xlRWxlbWVudDtcclxuICBzY2FsZV9ib3g6IEhUTUxEaXZFbGVtZW50O1xyXG4gIGltYWdlOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gIHRleHQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gIGZsZXhfZ3JpZF9pZDogc3RyaW5nO1xyXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgY2xhc3NwZXJjZW50OiBzdHJpbmcsIGltYWdlOiBzdHJpbmcsIGZsZXhfZ3JpZF9pZDogc3RyaW5nLCBibGFja3RleHQ6IGJvb2xlYW4pIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICB2bS5mbGV4X2dyaWRfaWQgPSBmbGV4X2dyaWRfaWQ7XHJcblxyXG4gICAgdm0uZmxleF9pdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB2bS5mbGV4X2l0ZW0uY2xhc3NOYW1lICs9ICdmbGV4LWl0ZW0nO1xyXG5cclxuICAgIHZtLnN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwic3ZnXCIpXHJcbiAgICB2bS5zdmcuc2V0QXR0cmlidXRlKCdjbGFzcycsIGNsYXNzcGVyY2VudClcclxuICAgIHZtLnN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzg0Jyk7XHJcbiAgICB2bS5zdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnODQnKTtcclxuXHJcbiAgICB2bS5zdmdfY2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ2NpcmNsZScpO1xyXG4gICAgdm0uc3ZnX2NpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnY2xhc3MnLCAnb3V0ZXInKTtcclxuICAgIHZtLnN2Z19jaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgXCJjeFwiLCAnLTQyJyk7XHJcbiAgICB2bS5zdmdfY2lyY2xlLnNldEF0dHJpYnV0ZU5TKG51bGwsIFwiY3lcIiwgJzQyJyk7XHJcbiAgICB2bS5zdmdfY2lyY2xlLnNldEF0dHJpYnV0ZU5TKG51bGwsIFwiclwiLCAnMzcnKTtcclxuICAgIHZtLnN2Z19jaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgXCJ0cmFuc2Zvcm1cIiwgXCJyb3RhdGUoLTkwLCAwLCAwKVwiKTtcclxuXHJcbiAgICB2bS5zY2FsZV9ib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGlmIChuYW1lID09PSBcIlR5cGUgU2NyaXB0XCIgfHwgbmFtZSA9PT0gXCJCb290c3RyYXBcIiB8fCBuYW1lID09PSBcIkQzLmpzXCIgfHwgbmFtZSA9PT0gXCJQaG90b3Nob3BcIiB8fCBuYW1lID09PSBcIklsbHVzdHJhdG9yXCIgfHwgbmFtZSA9PT0gXCJBZnRlciBFZmZlY3RzXCIgfHwgbmFtZSA9PT0gXCJNYXlhXCIgfHwgbmFtZSA9PT0gXCJNdWRib3hcIikge1xyXG4gICAgICB2bS5zY2FsZV9ib3guY2xhc3NOYW1lICs9ICdzY2FsZS1ib3gtc3F1YXJlJztcclxuICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gXCJVbml0eVwiIHx8IG5hbWUgPT09IFwiUGhhc2VyLmpzXCIgfHwgbmFtZSA9PT0gXCJEMy5qc1wiIHx8IG5hbWUgPT09IFwiU0NTU1wiIHx8IG5hbWUgPT09IFwiSmF2YVwiIHx8IG5hbWUgPT09IFwiUHl0aG9uXCIpIHtcclxuICAgICAgdm0uc2NhbGVfYm94LmNsYXNzTmFtZSArPSAnc2NhbGUtYm94LW1pZCc7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdm0uc2NhbGVfYm94LmNsYXNzTmFtZSArPSAnc2NhbGUtYm94JztcclxuICAgIH1cclxuXHJcbiAgICB2bS5pbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgdm0uaW1hZ2Uuc3JjID0gaW1hZ2U7XHJcblxyXG4gICAgdm0udGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgaWYgKGJsYWNrdGV4dCkge1xyXG4gICAgICB2bS50ZXh0LmNsYXNzTmFtZSArPSAndGV4dCBibGFjay10ZXh0JztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZtLnRleHQuY2xhc3NOYW1lICs9ICd0ZXh0JztcclxuICAgIH1cclxuICAgIHZtLnRleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmFtZSkpO1xyXG5cclxuICAgIC8vIC5mbGV4LWl0ZW1cclxuICAgIC8vICAgICAgIHN2Zy5jaXJjbGUtNzUod2lkdGg9Jzg0JywgaGVpZ2h0PSc4NCcpXHJcbiAgICAvLyAgICAgICAgIGNpcmNsZS5vdXRlcihjeD0nLTQyJywgY3k9JzQyJywgcj0nMzcnIHRyYW5zZm9ybT1cInJvdGF0ZSgtOTAsIDAsIDApXCIpIFxyXG4gICAgLy8gICAgICAgLnNjYWxlLWJveFxyXG4gICAgLy8gICAgICAgICBpbWcoaWQ9XCJmb3VyXCIpXHJcbiAgICAvLyAgICAgICAgIC50ZXh0IGFiY1xyXG4gICAgdm0uZmxleF9pdGVtLmFwcGVuZENoaWxkKHZtLnN2Zyk7XHJcbiAgICB2bS5zdmcuYXBwZW5kQ2hpbGQodm0uc3ZnX2NpcmNsZSk7XHJcbiAgICB2bS5mbGV4X2l0ZW0uYXBwZW5kQ2hpbGQodm0uc2NhbGVfYm94KTtcclxuICAgIHZtLnNjYWxlX2JveC5hcHBlbmRDaGlsZCh2bS5pbWFnZSk7XHJcbiAgICB2bS5mbGV4X2l0ZW0uYXBwZW5kQ2hpbGQodm0udGV4dCk7XHJcbiAgfVxyXG4gIHJlc2V0SWQoaWQ6IHN0cmluZykge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdm0uZmxleF9ncmlkX2lkID0gaWQ7XHJcbiAgfVxyXG5cclxuICBhcHBlbmQoKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2YXIgZmxleF9ncmlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodm0uZmxleF9ncmlkX2lkKTtcclxuICAgIGZsZXhfZ3JpZC5hcHBlbmRDaGlsZCh2bS5mbGV4X2l0ZW0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU2tpbGxJbmZvIHtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgY2xhc3M6IHN0cmluZztcclxuICBpbWFnZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sbGVjdGlvbiB7XHJcbiAgaWQ6IHN0cmluZztcclxuICBpbWFnZXM6IElTa2lsbEluZm9bXTtcclxuICBwYXRoOiBzdHJpbmc7XHJcbiAgc2tpbGxzOiBTa2lsbFtdO1xyXG4gIGZsZXhfZ3JpZF9pZDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcsIGZsZXhfZ3JpZF9pZDogc3RyaW5nLCBpbWFnZXM6IElTa2lsbEluZm9bXSxibGFja3RleHQ6IGJvb2xlYW4sIGlkPzogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgdm0uaW1hZ2VzID0gaW1hZ2VzO1xyXG4gICAgdm0ucGF0aCA9IHBhdGg7XHJcbiAgICB2bS5mbGV4X2dyaWRfaWQgPSBmbGV4X2dyaWRfaWQ7XHJcblxyXG4gICAgdm0uc2tpbGxzID0gW107XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbWFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdm0uc2tpbGxzLnB1c2gobmV3IFNraWxsKGltYWdlc1tpXS5uYW1lLCBpbWFnZXNbaV0uY2xhc3MsIHZtLnBhdGggKyBpbWFnZXNbaV0uaW1hZ2UsIHZtLmZsZXhfZ3JpZF9pZCwgYmxhY2t0ZXh0KSk7XHJcbiAgICB9XHJcbiAgICBpZiAoaWQpIHtcclxuICAgICAgdm0uaWQgPSBpZDtcclxuICAgICAgdmFyIGVsZW1lbnQgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodm0uaWQpO1xyXG4gICAgICBlbGVtZW50Lm9ubW91c2V1cCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdm0ubG9hZCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVzZXRJZHMoaWQ6IHN0cmluZykge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdm0uZmxleF9ncmlkX2lkID0gaWQ7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLnNraWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2bS5za2lsbHNbaV0ucmVzZXRJZCh2bS5mbGV4X2dyaWRfaWQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGxvYWQoKSB7IC8vc2V0cyBzcmMncyB0byB0aGUgZG9tLiB0aGVuIG9uY2UgZXZlcnl0aGluZyBpcyBsb2FkZWQsIGl0IGFkZHMgY2xhc3MgYWN0aXZlIHRvIG1ha2UgdGhlbSBhcHBlYXIgdmlhIGNzc1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdmFyIGZsZXhfZ3JpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHZtLmZsZXhfZ3JpZF9pZCk7XHJcbiAgICB3aGlsZSAoZmxleF9ncmlkLmZpcnN0Q2hpbGQpIHtcclxuICAgICAgZmxleF9ncmlkLnJlbW92ZUNoaWxkKGZsZXhfZ3JpZC5maXJzdENoaWxkKTtcclxuICAgIH1cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uc2tpbGxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZtLnNraWxsc1tpXS5hcHBlbmQoKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gcHVibGljIGNsb3NlKCl7XHJcbiAgLy8gICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgLy8gICB2YXIgZmxleF9ncmlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodm0uZmxleF9ncmlkX2lkKTtcclxuICAvLyAgIHdoaWxlIChmbGV4X2dyaWQuZmlyc3RDaGlsZCkge1xyXG4gIC8vICAgICBmbGV4X2dyaWQucmVtb3ZlQ2hpbGQoZmxleF9ncmlkLmZpcnN0Q2hpbGQpO1xyXG4gIC8vICAgfVxyXG4gIC8vIH1cclxufVxyXG4iXX0=
