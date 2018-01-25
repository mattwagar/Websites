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
            image.src = 'city.jpg';
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
var frontend = new skill_badge.Collection('./skills/', 'flex-grid1', [{ "name": 'HTML5', "class": 'circle-100', "image": 'html5.svg' },
    { "name": 'Java Script', "class": 'circle-100', "image": 'javascript-2.svg' },
    { "name": 'Ember JS', "class": 'circle-100', "image": 'ember.svg' },
    { "name": 'Angular JS', "class": 'circle-75', "image": 'angular-icon.svg' },
    { "name": 'Type Script', "class": 'circle-75', "image": 'typescript.svg' },
    { "name": 'D3.js', "class": 'circle-75', "image": 'd3-2.svg' },
    { "name": 'CSS3', "class": 'circle-50', "image": 'css-3.svg' },
    { "name": 'jQuery', "class": 'circle-50', "image": 'jquery-1.svg' },
    { "name": 'SCSS', "class": 'circle-50', "image": 'sass-1.svg' },
    { "name": 'React JS', "class": 'circle-25', "image": 'react.svg' }], 'frontend');
var softeng = new skill_badge.Collection('./skills/', 'flex-grid2', [{ "name": 'Java', "class": 'circle-75', "image": 'java-14.svg' },
    { "name": 'Unity', "class": 'circle-75', "image": 'unity.svg' },
    { "name": 'C++', "class": 'circle-75', "image": 'c-seeklogo.com.svg' },
    { "name": 'C#', "class": 'circle-50', "image": 'csharp.svg' },
    { "name": 'Python', "class": 'circle-50', "image": 'python-5.svg' },
    { "name": 'Open GL', "class": 'circle-25', "image": 'opengl2.svg' },
    { "name": 'Node JS', "class": 'circle-25', "image": 'nodejs-icon.svg' },
    { "name": 'Android Studio', "class": 'circle-25', "image": 'Android_studio.svg' }], 'softeng');
var design = new skill_badge.Collection('./skills/', 'flex-grid3', [{ "name": 'Photoshop', "class": 'circle-50', "image": 'photoshop-cc.svg' },
    { "name": 'Illustrator', "class": 'circle-50', "image": 'adobe-illustrator-cc.svg' },
    { "name": 'Maya', "class": 'circle-50', "image": 'maya.png' },
    { "name": 'After Effects', "class": 'circle-25', "image": 'after-effects-cc.svg' },
    { "name": 'Mudbox', "class": 'circle-25', "image": 'mudbox.png' }], 'design');
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
        vm.title_element.classList.add('col-xs-12', 'desc-text', 'pad-spacing');
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
    { "name": 'jQuery', "class": 'circle-50', "image": 'jquery-1.svg' }
]);
var rem_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Unity', "class": 'circle-100', "image": 'unity.svg' },
    { "name": 'Maya', "class": 'circle-25', "image": 'maya.png' },
    { "name": 'Photoshop', "class": 'circle-25', "image": 'photoshop-cc.svg' },
    { "name": 'Illustrator', "class": 'circle-25', "image": 'adobe-illustrator-cc.svg' }
]);
var qbert_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Maya', "class": 'circle-100', "image": 'maya.png' },
    { "name": 'Photoshop', "class": 'circle-25', "image": 'photoshop-cc.svg' }
]);
var weather_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Angular JS', "class": 'circle-100', "image": 'angular-icon.svg' },
    { "name": 'D3.js', "class": 'circle-50', "image": 'd3-2.svg' }
]);
var roast_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Ember JS', "class": 'circle-100', "image": 'ember.svg' },
    { "name": 'D3.js', "class": 'circle-75', "image": 'd3-2.svg' }
]);
var contrast_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Java', "class": 'circle-100', "image": 'java-14.svg' }
]);
var port_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Type Script', "class": 'circle-100', "image": 'typescript.svg' },
    { "name": 'HTML5', "class": 'circle-100', "image": 'html5.svg' },
    { "name": 'SCSS', "class": 'circle-100', "image": 'sass-1.svg' }
]);
// var breathless_media = new media.Media('media-0', ["./portfolio/breathless.jpg","./portfolio/breathless.jpg","./portfolio/cat.jpg"], ["./portfolio/breathless.jpg","./portfolio/cat.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
var m = [];
m.push(new media.Media('', ["./portfolio/rem_5.png", "./portfolio/rem_3.png", "./portfolio/rem_2.png", "./portfolio/rem_4.png"], ["./portfolio/rem_3.png", "./portfolio/rem_2.png", "./portfolio/rem_4.png"], '<iframe src="https://player.vimeo.com/video/252436989" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"], ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"]));
m.push(new media.Media('', ["./portfolio/qbert_play.jpg", "./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], ["./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"], ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"]));
m.push(new media.Media('', ['./portfolio/mean_forecast_1.jpg', './portfolio/mean_forecast_2.jpg'], ['./portfolio/mean_forecast_1.jpg', './portfolio/mean_forecast_2.jpg']));
m.push(new media.Media('', ['./portfolio/roast_6.png', './portfolio/roast_2.png', './portfolio/roast_3.png', './portfolio/roast_4.png'], ['./portfolio/roast_6.png', './portfolio/roast_2.png', './portfolio/roast_3.png', './portfolio/roast_4.png']));
m.push(new media.Media('', ['./portfolio/contrast_3.png', './portfolio/contrast_5.png', './portfolio/contrast_4.png', './portfolio/contrast_7.png'], ['./portfolio/contrast_3.png', './portfolio/contrast_5.png', './portfolio/contrast_4.png', './portfolio/contrast_7.png']));
m.push(new media.Media('', ['./portfolio/port_1.png', './portfolio/port_2.png', './portfolio/port_3.png', './portfolio/port_4.png'], ['./portfolio/port_1.png', './portfolio/port_2.png', './portfolio/port_3.png', './portfolio/port_4.png']));
var portfolio = new Portfolio('portfolio', [
    { title: 'Rem', title_image: './portfolio/rememberence_logo.jpg', desc: "Rem is a video game about a young girl trapped in a comatose dreamscape. You play as a young girl who must overcome her fears to remember her past. In this fun, over-the-shoulder stealth game you must avoid screen headed enemies, and find mementos of your past. For this project I worked in many areas including Web Development, Level Design, Modeling, and Documentation.", stack: rem_stack, media: m[0], type: 'Unity Game', url: 'http://offbrandhell.games/#/home' },
    { title: 'Roast', title_image: './portfolio/roast_7.jpg', desc: "Roast is a webapp that surveys comfort in an indoor space. It asks questions that gauge temperature, noise, smell, and humidity, and maps it to where you are on your building's floorplan. Through this crowd sourced data collected, building managers, architects and the people taking the survey can understand how people feel in a space. I worked on this project for 6 months while I was working at the architecture firm, Kieran Timberlake.", stack: roast_stack, media: m[5], type: 'Web App', url: '' },
    { title: 'Contrast', title_image: './portfolio/contrast_6.png', desc: "Contrast in color theory is when two colors are starkly different from each other. In this game your objective is to select the most contrasting circle with the background color. This is created in Java Swing with a game engine hand coded by me using the Buffered Image class. This game engine includes a Frame Buffer, Input Manager, and Animation Loop.", stack: contrast_stack, media: m[6], type: 'Java Game', url: 'https://drive.google.com/open?id=1Gy0Oshu941-MPfhutWlO63F92IVux9fM' },
    { title: 'Portfolio', title_image: './portfolio/port_1.png', desc: "From concept to design to development I put a lot of love into this. As a personal challenge I created this website entirely in Typescript with no jQuery. All in all I can conclude that jQuery is overrated! Java Script is powerful enough on its own.", stack: port_stack, media: m[7], type: 'Website', url: 'https://github.com/mattwagar/Websites/tree/master/portfolio_website_v2' },
    { title: 'Breathless', title_image: './portfolio/breathless.jpg', desc: "The Space Pirate, Aria, is on a mission to loot a mineral cargo ship. However, upon landing on the cargo ship, Aria's helmet cracks causing her to slowly lose oxygen. It's now a race against time to collect all the gems before her oxygen runs out!", stack: breathless_stack, media: m[1], type: 'HTML5 Game', url: '/breathless' },
    { title: 'Mean Forecast', title_image: './portfolio/mean_forecast_1.jpg', desc: 'A small web app that calculates the average of 3 weather API\'s: Wunderground, Forecast.io, and World Weather Online. This data is then served onto a D3.js Line Chart for temperature, humidty, and windspeed. Also the webapp itself has many subtleties that are affected by weather data. For example, the video  resembles the current weather. Also each graph is color coated by a gradient based on the weather data.', stack: weather_stack, media: m[4], type: 'Website', url: '/meanforecast' },
    { title: 'Q*Bert', title_image: "./portfolio/qbert_play.jpg", desc: 'This is my Bouncing Ball Assignment for Animation 1 at Drexel University. When picking a game that mixes my love of retro video games and bouncing balls, Q*Bert was a no-brainer. Everything is originally modelled, textured, and animated. Made in Maya, and rendered in V-Ray.', stack: qbert_stack, media: m[2], type: 'Animation', url: 'https://vimeo.com/198149795' },
    { title: 'Bedroom', title_image: './portfolio/cgi_final_1.png', desc: 'This is my final for CGI 2 at Drexel University. The assignment was to recreate any type of room, so I chose a little boy\'s room. We were tasked with creating at least one complex object, so I decided to go with a train set.', stack: qbert_stack, media: m[3], type: '3D Render', url: '' }
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
var Collection = /** @class */ (function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvanVtcC5qcy9kaXN0L2p1bXAuanMiLCJzcmMvaW1hZ2VfY2FudmFzLnRzIiwic3JjL21haW4udHMiLCJzcmMvbWVkaWEudHMiLCJzcmMvc2tpbGxfYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDM0MsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxhQUFhLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxTCxDQUFDO1FBRUQsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBR25CLENBQUM7SUFFTSw2QkFBUyxHQUFoQjtRQUNJLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBRXBDLHFDQUFxQztRQUNyQyxJQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNVAs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QUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDMUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7SUFDSCxDQUFDO0lBRU0seUJBQUksR0FBWDtRQUNFLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN6RCxPQUFPLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUM1QixTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQ0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDeEIsQ0FBQztJQUNILENBQUM7SUFRSCxpQkFBQztBQUFELENBckRBLEFBcURDLElBQUE7QUFyRFksZ0NBQVUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsLkp1bXAgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbi8vIFJvYmVydCBQZW5uZXIncyBlYXNlSW5PdXRRdWFkXG5cbi8vIGZpbmQgdGhlIHJlc3Qgb2YgaGlzIGVhc2luZyBmdW5jdGlvbnMgaGVyZTogaHR0cDovL3JvYmVydHBlbm5lci5jb20vZWFzaW5nL1xuLy8gZmluZCB0aGVtIGV4cG9ydGVkIGZvciBFUzYgY29uc3VtcHRpb24gaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL2pheGdlbGxlci9lei5qc1xuXG52YXIgZWFzZUluT3V0UXVhZCA9IGZ1bmN0aW9uIGVhc2VJbk91dFF1YWQodCwgYiwgYywgZCkge1xuICB0IC89IGQgLyAyO1xuICBpZiAodCA8IDEpIHJldHVybiBjIC8gMiAqIHQgKiB0ICsgYjtcbiAgdC0tO1xuICByZXR1cm4gLWMgLyAyICogKHQgKiAodCAtIDIpIC0gMSkgKyBiO1xufTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmo7XG59IDogZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbn07XG5cbnZhciBqdW1wZXIgPSBmdW5jdGlvbiBqdW1wZXIoKSB7XG4gIC8vIHByaXZhdGUgdmFyaWFibGUgY2FjaGVcbiAgLy8gbm8gdmFyaWFibGVzIGFyZSBjcmVhdGVkIGR1cmluZyBhIGp1bXAsIHByZXZlbnRpbmcgbWVtb3J5IGxlYWtzXG5cbiAgdmFyIGVsZW1lbnQgPSB2b2lkIDA7IC8vIGVsZW1lbnQgdG8gc2Nyb2xsIHRvICAgICAgICAgICAgICAgICAgIChub2RlKVxuXG4gIHZhciBzdGFydCA9IHZvaWQgMDsgLy8gd2hlcmUgc2Nyb2xsIHN0YXJ0cyAgICAgICAgICAgICAgICAgICAgKHB4KVxuICB2YXIgc3RvcCA9IHZvaWQgMDsgLy8gd2hlcmUgc2Nyb2xsIHN0b3BzICAgICAgICAgICAgICAgICAgICAgKHB4KVxuXG4gIHZhciBvZmZzZXQgPSB2b2lkIDA7IC8vIGFkanVzdG1lbnQgZnJvbSB0aGUgc3RvcCBwb3NpdGlvbiAgICAgIChweClcbiAgdmFyIGVhc2luZyA9IHZvaWQgMDsgLy8gZWFzaW5nIGZ1bmN0aW9uICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uKVxuICB2YXIgYTExeSA9IHZvaWQgMDsgLy8gYWNjZXNzaWJpbGl0eSBzdXBwb3J0IGZsYWcgICAgICAgICAgICAgKGJvb2xlYW4pXG5cbiAgdmFyIGRpc3RhbmNlID0gdm9pZCAwOyAvLyBkaXN0YW5jZSBvZiBzY3JvbGwgICAgICAgICAgICAgICAgICAgICAocHgpXG4gIHZhciBkdXJhdGlvbiA9IHZvaWQgMDsgLy8gc2Nyb2xsIGR1cmF0aW9uICAgICAgICAgICAgICAgICAgICAgICAgKG1zKVxuXG4gIHZhciB0aW1lU3RhcnQgPSB2b2lkIDA7IC8vIHRpbWUgc2Nyb2xsIHN0YXJ0ZWQgICAgICAgICAgICAgICAgICAgIChtcylcbiAgdmFyIHRpbWVFbGFwc2VkID0gdm9pZCAwOyAvLyB0aW1lIHNwZW50IHNjcm9sbGluZyB0aHVzIGZhciAgICAgICAgICAobXMpXG5cbiAgdmFyIG5leHQgPSB2b2lkIDA7IC8vIG5leHQgc2Nyb2xsIHBvc2l0aW9uICAgICAgICAgICAgICAgICAgIChweClcblxuICB2YXIgY2FsbGJhY2sgPSB2b2lkIDA7IC8vIHRvIGNhbGwgd2hlbiBkb25lIHNjcm9sbGluZyAgICAgICAgICAgIChmdW5jdGlvbilcblxuICAvLyBzY3JvbGwgcG9zaXRpb24gaGVscGVyXG5cbiAgZnVuY3Rpb24gbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5zY3JvbGxZIHx8IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgfVxuXG4gIC8vIGVsZW1lbnQgb2Zmc2V0IGhlbHBlclxuXG4gIGZ1bmN0aW9uIHRvcChlbGVtZW50KSB7XG4gICAgcmV0dXJuIGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgc3RhcnQ7XG4gIH1cblxuICAvLyByQUYgbG9vcCBoZWxwZXJcblxuICBmdW5jdGlvbiBsb29wKHRpbWVDdXJyZW50KSB7XG4gICAgLy8gc3RvcmUgdGltZSBzY3JvbGwgc3RhcnRlZCwgaWYgbm90IHN0YXJ0ZWQgYWxyZWFkeVxuICAgIGlmICghdGltZVN0YXJ0KSB7XG4gICAgICB0aW1lU3RhcnQgPSB0aW1lQ3VycmVudDtcbiAgICB9XG5cbiAgICAvLyBkZXRlcm1pbmUgdGltZSBzcGVudCBzY3JvbGxpbmcgc28gZmFyXG4gICAgdGltZUVsYXBzZWQgPSB0aW1lQ3VycmVudCAtIHRpbWVTdGFydDtcblxuICAgIC8vIGNhbGN1bGF0ZSBuZXh0IHNjcm9sbCBwb3NpdGlvblxuICAgIG5leHQgPSBlYXNpbmcodGltZUVsYXBzZWQsIHN0YXJ0LCBkaXN0YW5jZSwgZHVyYXRpb24pO1xuXG4gICAgLy8gc2Nyb2xsIHRvIGl0XG4gICAgd2luZG93LnNjcm9sbFRvKDAsIG5leHQpO1xuXG4gICAgLy8gY2hlY2sgcHJvZ3Jlc3NcbiAgICB0aW1lRWxhcHNlZCA8IGR1cmF0aW9uID8gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKSAvLyBjb250aW51ZSBzY3JvbGwgbG9vcFxuICAgIDogZG9uZSgpOyAvLyBzY3JvbGxpbmcgaXMgZG9uZVxuICB9XG5cbiAgLy8gc2Nyb2xsIGZpbmlzaGVkIGhlbHBlclxuXG4gIGZ1bmN0aW9uIGRvbmUoKSB7XG4gICAgLy8gYWNjb3VudCBmb3IgckFGIHRpbWUgcm91bmRpbmcgaW5hY2N1cmFjaWVzXG4gICAgd2luZG93LnNjcm9sbFRvKDAsIHN0YXJ0ICsgZGlzdGFuY2UpO1xuXG4gICAgLy8gaWYgc2Nyb2xsaW5nIHRvIGFuIGVsZW1lbnQsIGFuZCBhY2Nlc3NpYmlsaXR5IGlzIGVuYWJsZWRcbiAgICBpZiAoZWxlbWVudCAmJiBhMTF5KSB7XG4gICAgICAvLyBhZGQgdGFiaW5kZXggaW5kaWNhdGluZyBwcm9ncmFtbWF0aWMgZm9jdXNcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuXG4gICAgICAvLyBmb2N1cyB0aGUgZWxlbWVudFxuICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgIH1cblxuICAgIC8vIGlmIGl0IGV4aXN0cywgZmlyZSB0aGUgY2FsbGJhY2tcbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cblxuICAgIC8vIHJlc2V0IHRpbWUgZm9yIG5leHQganVtcFxuICAgIHRpbWVTdGFydCA9IGZhbHNlO1xuICB9XG5cbiAgLy8gQVBJXG5cbiAgZnVuY3Rpb24ganVtcCh0YXJnZXQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICAvLyByZXNvbHZlIG9wdGlvbnMsIG9yIHVzZSBkZWZhdWx0c1xuICAgIGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbiB8fCAxMDAwO1xuICAgIG9mZnNldCA9IG9wdGlvbnMub2Zmc2V0IHx8IDA7XG4gICAgY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrOyAvLyBcInVuZGVmaW5lZFwiIGlzIGEgc3VpdGFibGUgZGVmYXVsdCwgYW5kIHdvbid0IGJlIGNhbGxlZFxuICAgIGVhc2luZyA9IG9wdGlvbnMuZWFzaW5nIHx8IGVhc2VJbk91dFF1YWQ7XG4gICAgYTExeSA9IG9wdGlvbnMuYTExeSB8fCBmYWxzZTtcblxuICAgIC8vIGNhY2hlIHN0YXJ0aW5nIHBvc2l0aW9uXG4gICAgc3RhcnQgPSBsb2NhdGlvbigpO1xuXG4gICAgLy8gcmVzb2x2ZSB0YXJnZXRcbiAgICBzd2l0Y2ggKHR5cGVvZiB0YXJnZXQgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHRhcmdldCkpIHtcbiAgICAgIC8vIHNjcm9sbCBmcm9tIGN1cnJlbnQgcG9zaXRpb25cbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGVsZW1lbnQgPSB1bmRlZmluZWQ7IC8vIG5vIGVsZW1lbnQgdG8gc2Nyb2xsIHRvXG4gICAgICAgIGExMXkgPSBmYWxzZTsgLy8gbWFrZSBzdXJlIGFjY2Vzc2liaWxpdHkgaXMgb2ZmXG4gICAgICAgIHN0b3AgPSBzdGFydCArIHRhcmdldDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIHNjcm9sbCB0byBlbGVtZW50IChub2RlKVxuICAgICAgLy8gYm91bmRpbmcgcmVjdCBpcyByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnRcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGVsZW1lbnQgPSB0YXJnZXQ7XG4gICAgICAgIHN0b3AgPSB0b3AoZWxlbWVudCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBzY3JvbGwgdG8gZWxlbWVudCAoc2VsZWN0b3IpXG4gICAgICAvLyBib3VuZGluZyByZWN0IGlzIHJlbGF0aXZlIHRvIHRoZSB2aWV3cG9ydFxuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcbiAgICAgICAgc3RvcCA9IHRvcChlbGVtZW50KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gcmVzb2x2ZSBzY3JvbGwgZGlzdGFuY2UsIGFjY291bnRpbmcgZm9yIG9mZnNldFxuICAgIGRpc3RhbmNlID0gc3RvcCAtIHN0YXJ0ICsgb2Zmc2V0O1xuXG4gICAgLy8gcmVzb2x2ZSBkdXJhdGlvblxuICAgIHN3aXRjaCAoX3R5cGVvZihvcHRpb25zLmR1cmF0aW9uKSkge1xuICAgICAgLy8gbnVtYmVyIGluIG1zXG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb247XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBmdW5jdGlvbiBwYXNzZWQgdGhlIGRpc3RhbmNlIG9mIHRoZSBzY3JvbGxcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uKGRpc3RhbmNlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gc3RhcnQgdGhlIGxvb3BcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICB9XG5cbiAgLy8gZXhwb3NlIG9ubHkgdGhlIGp1bXAgbWV0aG9kXG4gIHJldHVybiBqdW1wO1xufTtcblxuLy8gZXhwb3J0IHNpbmdsZXRvblxuXG52YXIgc2luZ2xldG9uID0ganVtcGVyKCk7XG5cbnJldHVybiBzaW5nbGV0b247XG5cbn0pKSk7XG4iLCJcclxuZXhwb3J0ICogZnJvbSBcIi4vaW1hZ2VfY2FudmFzXCI7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxlcnAoZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyLCBwZXJjZW50OiBudW1iZXIpIHtcclxuICB2YXIgZGlmZmVyYW5jZSA9IHRvIC0gZnJvbTtcclxuICByZXR1cm4gZnJvbSArIChkaWZmZXJhbmNlICogcGVyY2VudCk7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgSW1nIHtcclxuICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gIGltYWdlOiBIVE1MSW1hZ2VFbGVtZW50XHJcbiAgdzogbnVtYmVyO1xyXG4gIGg6IG51bWJlcjtcclxuICB4X29mZnNldF9kZXN0OiBudW1iZXI7XHJcbiAgeV9vZmZzZXRfZGVzdDogbnVtYmVyO1xyXG4gIHhfb2Zmc2V0OiBudW1iZXI7XHJcbiAgeV9vZmZzZXQ6IG51bWJlcjtcclxuICBhbmNob3JYOiBudW1iZXI7XHJcbiAgYW5jaG9yWTogbnVtYmVyO1xyXG5cclxuICBpbWdXaWR0aDogbnVtYmVyO1xyXG4gIHNjcmVlbldpZHRoOiBudW1iZXI7XHJcbiAgc2NhbGVYOiBudW1iZXI7XHJcbiAgc2NhbGVZOiBudW1iZXI7XHJcbiAgc2NhbGU6IG51bWJlcjtcclxuICBpbWdIZWlnaHQ6IG51bWJlcjtcclxuICBzY3JlZW5IZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgbG9hZGVkOiBib29sZWFuO1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3Iod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZtLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgdm0uY3R4ID0gdm0uY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB2bS53ID0gdm0uY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICB2bS5oID0gdm0uY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIHZtLmltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICB2bS5pbWFnZS5zcmMgPSAnY2l0eS5qcGcnO1xyXG4gICAgdm0ubG9hZGVkID0gZmFsc2U7XHJcblxyXG4gICAgdm0uaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2bS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICB2bS5zaXplKHZtLncsIHZtLmgpO1xyXG4gICAgICB2bS5kcmF3KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2l6ZSh3LCBoKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgdm0udyA9IHZtLmNhbnZhcy53aWR0aCA9IHc7XHJcbiAgICB2bS5oID0gdm0uY2FudmFzLmhlaWdodCA9IGg7XHJcblxyXG4gICAgLypnZXRzIHNjYWxlWCBiYXNlZCBvbiBzY3JlZW4gYW5kIGltYWdlIHdpZHRoICovXHJcbiAgICB2bS5pbWdXaWR0aCA9IHZtLmltYWdlLm5hdHVyYWxXaWR0aDtcclxuICAgIHZtLnNjcmVlbldpZHRoID0gdztcclxuICAgIHZtLnNjYWxlWCA9IHZtLnNjcmVlbldpZHRoIC8gdm0uaW1nV2lkdGg7XHJcblxyXG4gICAgLypnZXRzIHNjYWxlWSBiYXNlZCBvbiBzY3JlZW4gYW5kIGltYWdlIHdpZHRoICovXHJcbiAgICB2bS5pbWdIZWlnaHQgPSB2bS5pbWFnZS5uYXR1cmFsSGVpZ2h0O1xyXG4gICAgdm0uc2NyZWVuSGVpZ2h0ID0gaDtcclxuICAgIHZtLnNjYWxlWSA9IHZtLnNjcmVlbkhlaWdodCAvIHZtLmltZ0hlaWdodDtcclxuXHJcblxyXG4gICAgLypzZXRzIGJhc2ljIHNjYWxlIHRvIFggKi9cclxuXHJcbiAgICB2bS5zY2FsZSA9IHZtLnNjYWxlWFxyXG4gICAgaWYgKHZtLnNjYWxlWCA8IHZtLnNjYWxlWSkge1xyXG4gICAgICB2bS5zY2FsZSA9IHZtLnNjYWxlWTtcclxuICAgIH1cclxuXHJcbiAgICB2bS5pbWdXaWR0aCAqPSB2bS5zY2FsZSAqIDEuMDU7XHJcbiAgICB2bS5pbWdIZWlnaHQgKj0gdm0uc2NhbGUgKiAxLjA1O1xyXG5cclxuICAgIHZtLmFuY2hvclggPSAodm0uaW1nV2lkdGggLSB2bS5zY3JlZW5XaWR0aCk7XHJcbiAgICB2bS5hbmNob3JZID0gKHZtLmltZ0hlaWdodCAtIHZtLnNjcmVlbkhlaWdodCk7XHJcblxyXG4gICAgdm0ueF9vZmZzZXRfZGVzdCA9IHZtLnhfb2Zmc2V0ID0gdm0uYW5jaG9yWDtcclxuICAgIHZtLnlfb2Zmc2V0X2Rlc3QgPSB2bS55X29mZnNldCA9IHZtLmFuY2hvclk7XHJcblxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXcoKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAvLyB2bS5jdHguY2xlYXJSZWN0KDAsMCx2bS53LCB2bS5oKTtcclxuXHJcbiAgICB2bS5jdHguZHJhd0ltYWdlKHZtLmltYWdlLCB2bS54X29mZnNldCwgdm0ueV9vZmZzZXQsIHZtLmltYWdlLm5hdHVyYWxXaWR0aCwgdm0uaW1hZ2UubmF0dXJhbEhlaWdodCwgMCwgMCwgdm0uaW1nV2lkdGgsIHZtLmltZ0hlaWdodCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXBwIHtcclxuICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gIHc6IG51bWJlcjtcclxuICBoOiBudW1iZXI7XHJcbiAgLy8gcmVjdDogUmVjdGFuZ2xlXHJcbiAgaW1nOiBJbWc7XHJcblxyXG4gIG1vdXNlSW46IGJvb2xlYW47XHJcbiAgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XHJcblxyXG4gICAgdmFyIGlzTW9iaWxlID0gZmFsc2U7IC8vaW5pdGlhdGUgYXMgZmFsc2VcclxuICAgIC8vIGRldmljZSBkZXRlY3Rpb25cclxuICAgIGlmICgvKGFuZHJvaWR8YmJcXGQrfG1lZWdvKS4rbW9iaWxlfGF2YW50Z298YmFkYVxcL3xibGFja2JlcnJ5fGJsYXplcnxjb21wYWx8ZWxhaW5lfGZlbm5lY3xoaXB0b3B8aWVtb2JpbGV8aXAoaG9uZXxvZCl8aXBhZHxpcmlzfGtpbmRsZXxBbmRyb2lkfFNpbGt8bGdlIHxtYWVtb3xtaWRwfG1tcHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyAoY2V8cGhvbmUpfHhkYXx4aWluby9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgfHwgLzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50LnN1YnN0cigwLCA0KSkpIGlzTW9iaWxlID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoaXNNb2JpbGUpIHtcclxuICAgICAgdmFyIGltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgIGltYWdlLnNyYyA9ICdjaXR5LmpwZyc7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzLWNvbnRhaW5lcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlbGNvbWUtcGFnZScpLmluc2VydEJlZm9yZShpbWFnZSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcy10ZXh0LW92ZXJsYXknKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuXHJcblxyXG4gICAgICB2bS5jYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xyXG4gICAgICB2bS5jdHggPSB2bS5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcblxyXG5cclxuICAgICAgdm0uc2l6ZUNhbnZhcygpO1xyXG4gICAgICAvLyB2bS5pbml0RXZlbnRzKCk7XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHQpID0+IHsgdm0uZHJhdyh0KTsgfSk7XHJcblxyXG4gICAgICB2bS5pbWcgPSBuZXcgSW1nKHZtLncsIHZtLmgpO1xyXG5cclxuICAgICAgdm0ubW91c2VJbiA9IGZhbHNlO1xyXG5cclxuICAgICAgdm0uY29udGFpbmVyID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMtY29udGFpbmVyJyk7XHJcblxyXG4gICAgICB2bS5jb250YWluZXIub25tb3VzZW1vdmUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZtLmRyYXdJbWdJbigwLCBlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdm0uY29udGFpbmVyLm9ubW91c2VlbnRlciA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdm0ubW91c2VJbiA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZtLmNvbnRhaW5lci5vbm1vdXNlb3V0ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2bS5tb3VzZUluID0gZmFsc2U7XHJcbiAgICAgICAgdm0uZHJhd0ltZ091dCgwLCBlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHNpemVDYW52YXMoKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2bS5jYW52YXMuc3R5bGUud2lkdGggPSAnMTAwJSc7XHJcbiAgICB2bS5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xyXG4gICAgdGhpcy53ID0gdGhpcy5jYW52YXMud2lkdGggPSB2bS5jYW52YXMub2Zmc2V0V2lkdGg7XHJcbiAgICB0aGlzLmggPSB0aGlzLmNhbnZhcy5oZWlnaHQgPSB2bS5jYW52YXMub2Zmc2V0SGVpZ2h0O1xyXG5cclxuICAgIGlmICh2bS5pbWcpIHtcclxuICAgICAgdm0uaW1nLnNpemUodm0udywgdm0uaCk7XHJcbiAgICAgIHZtLmltZy5kcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuICBwdWJsaWMgZHJhdyh0OiBhbnkpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHQpID0+IHsgdGhpcy5kcmF3KHQpOyB9KTtcclxuICAgIHZtLmN0eC5jbGVhclJlY3QoMCwgMCwgdm0udywgdm0uaCk7XHJcblxyXG4gICAgdm0uY3R4LmRyYXdJbWFnZSh2bS5pbWcuY2FudmFzLCAwLCAwKTtcclxuICAgIHZtLmltZy5kcmF3KCk7XHJcblxyXG5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3SW1nSW4odDogYW55LCBlOiBhbnkpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcblxyXG4gICAgLypyYXRpbyA9IChpbWdXaWR0aCAvIHNjcmVlbldpZHRoKSAgKi9cclxuXHJcbiAgICB2YXIgbW92ZVJhdGlvWCA9IChlLmNsaWVudFggLyB2bS5pbWcuc2NyZWVuV2lkdGgpOyAvL3JhbmdlIGZyb20gWzAsIDFdOiAwIGJlaW5nIGxlZnQsIDEgYmVpbmcgcmlnaHRcclxuICAgIHZhciBtb3ZlT2Zmc2V0WCA9IC12bS5pbWcuYW5jaG9yWCArIChtb3ZlUmF0aW9YICogdm0uaW1nLmFuY2hvclgpO1xyXG5cclxuICAgIHZhciBtb3ZlUmF0aW9ZID0gKGUuY2xpZW50WSAvIHZtLmltZy5zY3JlZW5IZWlnaHQpOyAvL3JhbmdlIGZyb20gWzAsIDFdOiAwIGJlaW5nIGxlZnQsIDEgYmVpbmcgcmlnaHRcclxuICAgIHZhciBtb3ZlT2Zmc2V0WSA9IC12bS5pbWcuYW5jaG9yWSArIChtb3ZlUmF0aW9ZICogdm0uaW1nLmFuY2hvclkpO1xyXG5cclxuXHJcbiAgICAvKm9mZnNldCA9IG1pZGRsZV9hbmNob3IgKyBkcmFnZ2VkX29mZnNldCovXHJcbiAgICB2bS5pbWcueF9vZmZzZXRfZGVzdCA9IHZtLmltZy5hbmNob3JYICsgbW92ZU9mZnNldFg7XHJcbiAgICB2bS5pbWcueV9vZmZzZXRfZGVzdCA9IHZtLmltZy5hbmNob3JZICsgbW92ZU9mZnNldFk7XHJcblxyXG4gICAgaWYgKHZtLm1vdXNlSW4gPT09IHRydWUgJiYgTWF0aC5yb3VuZCh2bS5pbWcueV9vZmZzZXQpICE9PSBNYXRoLnJvdW5kKHZtLmltZy55X29mZnNldF9kZXN0KSAmJiBNYXRoLnJvdW5kKHZtLmltZy54X29mZnNldCkgIT09IE1hdGgucm91bmQodm0uaW1nLnhfb2Zmc2V0X2Rlc3QpKSB7XHJcblxyXG5cclxuICAgICAgdm0uaW1nLnhfb2Zmc2V0ID0gTWF0aC5yb3VuZChsZXJwKHZtLmltZy54X29mZnNldCwgdm0uaW1nLnhfb2Zmc2V0X2Rlc3QsIDAuMSkpO1xyXG4gICAgICB2bS5pbWcueV9vZmZzZXQgPSBNYXRoLnJvdW5kKGxlcnAodm0uaW1nLnlfb2Zmc2V0LCB2bS5pbWcueV9vZmZzZXRfZGVzdCwgMC4xKSk7XHJcblxyXG4gICAgICAvLyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0KSA9PiB7IHZtLmRyYXdJbWdJbih0LCBlKSB9KTtcclxuXHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdJbWdPdXQodDogYW55LCBlOiBhbnkpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICAvKnJhdGlvID0gKGltZ1dpZHRoIC8gc2NyZWVuV2lkdGgpICAqL1xyXG5cclxuICAgIC8vIHZhciBtb3ZlUmF0aW9YID0gKGUuY2xpZW50WCAvIHZtLmltZy5zY3JlZW5XaWR0aCk7IC8vcmFuZ2UgZnJvbSBbMCwgMV06IDAgYmVpbmcgbGVmdCwgMSBiZWluZyByaWdodFxyXG4gICAgLy8gdmFyIG1vdmVPZmZzZXRYID0gLXZtLmltZy5hbmNob3JYICsgKG1vdmVSYXRpb1ggKiB2bS5pbWcuYW5jaG9yWCAqIDIpO1xyXG5cclxuICAgIC8vIHZhciBtb3ZlUmF0aW9ZID0gKGUuY2xpZW50WSAvIHZtLmltZy5zY3JlZW5IZWlnaHQpICogMjsgLy9yYW5nZSBmcm9tIFswLCAxXTogMCBiZWluZyBsZWZ0LCAxIGJlaW5nIHJpZ2h0XHJcbiAgICAvLyB2YXIgbW92ZU9mZnNldFkgPSAtdm0uaW1nLmFuY2hvclkgKyAobW92ZVJhdGlvWSAqIHZtLmltZy5hbmNob3JZKTtcclxuXHJcblxyXG4gICAgLypvZmZzZXQgPSBtaWRkbGVfYW5jaG9yICsgZHJhZ2dlZF9vZmZzZXQqL1xyXG4gICAgdm0uaW1nLnhfb2Zmc2V0X2Rlc3QgPSB2bS5pbWcuYW5jaG9yWDtcclxuICAgIHZtLmltZy55X29mZnNldF9kZXN0ID0gdm0uaW1nLmFuY2hvclk7XHJcblxyXG4gICAgaWYgKHZtLm1vdXNlSW4gPT09IGZhbHNlICYmIE1hdGgucm91bmQodm0uaW1nLnlfb2Zmc2V0KSAhPT0gTWF0aC5yb3VuZCh2bS5pbWcueV9vZmZzZXRfZGVzdCkgJiYgTWF0aC5yb3VuZCh2bS5pbWcueF9vZmZzZXQpICE9PSBNYXRoLnJvdW5kKHZtLmltZy54X29mZnNldF9kZXN0KSkge1xyXG5cclxuXHJcbiAgICAgIHZtLmltZy54X29mZnNldCA9IGxlcnAodm0uaW1nLnhfb2Zmc2V0LCB2bS5pbWcueF9vZmZzZXRfZGVzdCwgMC4xKTtcclxuICAgICAgdm0uaW1nLnlfb2Zmc2V0ID0gbGVycCh2bS5pbWcueV9vZmZzZXQsIHZtLmltZy55X29mZnNldF9kZXN0LCAwLjEpO1xyXG5cclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodCkgPT4geyB2bS5kcmF3SW1nT3V0KHQsIGUpIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICAvLyBpbml0RXZlbnRzKCkge1xyXG4gIC8vICAgd2luZG93Lm9ucmVzaXplID0gKGUpID0+IHtcclxuICAvLyAgICAgdGhpcy5zaXplQ2FudmFzKCk7XHJcbiAgLy8gICB9O1xyXG4gIC8vIH1cclxuXHJcbn0iLCJpbXBvcnQgKiBhcyBqdW1wIGZyb20gXCJqdW1wLmpzXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBpbWFnZV9jYW52YXMgZnJvbSBcIi4vaW1hZ2VfY2FudmFzXCI7XHJcblxyXG5pbXBvcnQgKiBhcyBza2lsbF9iYWRnZSBmcm9tIFwiLi9za2lsbF9iYWRnZVwiO1xyXG5cclxuaW1wb3J0ICogYXMgbWVkaWEgZnJvbSBcIi4vbWVkaWFcIjtcclxuXHJcbi8veW9vXHJcbmNvbnN0IHRpbWVvdXQ6IG51bWJlciA9IDEwMDA7XHJcblxyXG52YXIgZnJvbnRlbmQgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJ2ZsZXgtZ3JpZDEnLCBbeyBcIm5hbWVcIjogJ0hUTUw1JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2h0bWw1LnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0phdmEgU2NyaXB0JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2phdmFzY3JpcHQtMi5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdFbWJlciBKUycsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdlbWJlci5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdBbmd1bGFyIEpTJywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAnYW5ndWxhci1pY29uLnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ1R5cGUgU2NyaXB0JywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAndHlwZXNjcmlwdC5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdEMy5qcycsIFwiY2xhc3NcIjogJ2NpcmNsZS03NScsIFwiaW1hZ2VcIjogJ2QzLTIuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnQ1NTMycsIFwiY2xhc3NcIjogJ2NpcmNsZS01MCcsIFwiaW1hZ2VcIjogJ2Nzcy0zLnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ2pRdWVyeScsIFwiY2xhc3NcIjogJ2NpcmNsZS01MCcsIFwiaW1hZ2VcIjogJ2pxdWVyeS0xLnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ1NDU1MnLCBcImNsYXNzXCI6ICdjaXJjbGUtNTAnLCBcImltYWdlXCI6ICdzYXNzLTEuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnUmVhY3QgSlMnLCBcImNsYXNzXCI6ICdjaXJjbGUtMjUnLCBcImltYWdlXCI6ICdyZWFjdC5zdmcnIH1dLCAnZnJvbnRlbmQnKTtcclxudmFyIHNvZnRlbmcgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJ2ZsZXgtZ3JpZDInLCBbeyBcIm5hbWVcIjogJ0phdmEnLCBcImNsYXNzXCI6ICdjaXJjbGUtNzUnLCBcImltYWdlXCI6ICdqYXZhLTE0LnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ1VuaXR5JywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAndW5pdHkuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnQysrJywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAnYy1zZWVrbG9nby5jb20uc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnQyMnLCBcImNsYXNzXCI6ICdjaXJjbGUtNTAnLCBcImltYWdlXCI6ICdjc2hhcnAuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnUHl0aG9uJywgXCJjbGFzc1wiOiAnY2lyY2xlLTUwJywgXCJpbWFnZVwiOiAncHl0aG9uLTUuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnT3BlbiBHTCcsIFwiY2xhc3NcIjogJ2NpcmNsZS0yNScsIFwiaW1hZ2VcIjogJ29wZW5nbDIuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnTm9kZSBKUycsIFwiY2xhc3NcIjogJ2NpcmNsZS0yNScsIFwiaW1hZ2VcIjogJ25vZGVqcy1pY29uLnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0FuZHJvaWQgU3R1ZGlvJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAnQW5kcm9pZF9zdHVkaW8uc3ZnJyB9XSwgJ3NvZnRlbmcnKTtcclxudmFyIGRlc2lnbiA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnZmxleC1ncmlkMycsIFt7IFwibmFtZVwiOiAnUGhvdG9zaG9wJywgXCJjbGFzc1wiOiAnY2lyY2xlLTUwJywgXCJpbWFnZVwiOiAncGhvdG9zaG9wLWNjLnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0lsbHVzdHJhdG9yJywgXCJjbGFzc1wiOiAnY2lyY2xlLTUwJywgXCJpbWFnZVwiOiAnYWRvYmUtaWxsdXN0cmF0b3ItY2Muc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnTWF5YScsIFwiY2xhc3NcIjogJ2NpcmNsZS01MCcsIFwiaW1hZ2VcIjogJ21heWEucG5nJyB9LFxyXG57IFwibmFtZVwiOiAnQWZ0ZXIgRWZmZWN0cycsIFwiY2xhc3NcIjogJ2NpcmNsZS0yNScsIFwiaW1hZ2VcIjogJ2FmdGVyLWVmZmVjdHMtY2Muc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnTXVkYm94JywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAnbXVkYm94LnBuZycgfV0sICdkZXNpZ24nKTtcclxuZnJvbnRlbmQubG9hZCgpO1xyXG5zb2Z0ZW5nLmxvYWQoKTtcclxuZGVzaWduLmxvYWQoKTtcclxuXHJcblxyXG52YXIgYXBwO1xyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBhcHAgPSBuZXcgaW1hZ2VfY2FudmFzLkFwcCgpO1xyXG59KTtcclxuXHJcblxyXG4vLyB3aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpe1xyXG4vLyAgICAgY29uc29sZS5sb2cod2luZG93LnNjcm9sbFkpO1xyXG4vLyB9XHJcblxyXG5cclxuLy8gdmFyIHcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndyYXBwZXItMFwiKTtcclxuLy8gdmFyIGIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncDEnKTtcclxuXHJcblxyXG4vLyBiLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4vLyAgICAgaWYody5jbGFzc0xpc3RbMV0gPT09IFwib3BlblwiKXtcclxuLy8gICAgICAgICB3LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuLy8gICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgdy5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcbi8vICAgICB9XHJcbi8vIH1cclxuXHJcbmV4cG9ydCBjbGFzcyBQb3J0Zm9saW9JdGVtIHtcclxuICAgIHRpdGxlOiBzdHJpbmc7XHJcbiAgICB0aXRsZV9pbWFnZTogc3RyaW5nO1xyXG4gICAgZGVzYzogc3RyaW5nO1xyXG4gICAgc3RhY2s6IHNraWxsX2JhZGdlLkNvbGxlY3Rpb247XHJcbiAgICBwb3J0X2ltYWdlOiBzdHJpbmc7XHJcbiAgICB1cmw6IHN0cmluZztcclxuXHJcbiAgICBpdGVtX251bTogbnVtYmVyO1xyXG5cclxuICAgIGNvbF9zaXplOiBzdHJpbmc7XHJcbiAgICBjb2w6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gICAgdGV4dDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBzdWJfdGV4dDogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgb3BlbjogYm9vbGVhbjtcclxuICAgIG1lZGlhOiBtZWRpYS5NZWRpYTtcclxuICAgIHRhcmdldF93cmFwcGVyOiBXcmFwcGVyO1xyXG4gICAgcG9ydGZvbGlvOiBQb3J0Zm9saW87XHJcbiAgICByb3c6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwb3J0Zm9saW86IFBvcnRmb2xpbywgaXRlbV9udW06IG51bWJlciwgdGl0bGU6IHN0cmluZywgdGl0bGVfaW1hZ2U6IHN0cmluZywgZGVzYzogc3RyaW5nLCBzdGFjazogc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbiwgbWVkaWE6IG1lZGlhLk1lZGlhLCB0eXBlOiBzdHJpbmcsIHVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB2bS5wb3J0Zm9saW8gPSBwb3J0Zm9saW87XHJcbiAgICAgICAgdm0uaXRlbV9udW0gPSBpdGVtX251bTtcclxuICAgICAgICB2bS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHZtLnRpdGxlX2ltYWdlID0gdGl0bGVfaW1hZ2U7XHJcbiAgICAgICAgdm0uZGVzYyA9IGRlc2M7XHJcbiAgICAgICAgdm0uc3RhY2sgPSBzdGFjaztcclxuICAgICAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgICAgIHZtLnVybCA9IHVybDtcclxuICAgICAgICB2bS5jb2xfc2l6ZSA9IFwiY29sLW1kLTNcIjtcclxuXHJcblxyXG4gICAgICAgIHZtLmNvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmNvbC5jbGFzc0xpc3QuYWRkKHZtLmNvbF9zaXplKTtcclxuXHJcbiAgICAgICAgdmFyIGNhcmRfc2hhZG93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY2FyZF9zaGFkb3cuY2xhc3NMaXN0LmFkZCgnY2FyZC1kcm9wc2hhZG93JywgJ3JvdycpO1xyXG5cclxuICAgICAgICB2YXIgbm9wYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBub3BhZC5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInLCAnbm9wYWQnKTtcclxuXHJcbiAgICAgICAgdm0uaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgICAgdm0uaW1nLnNyYyA9IHZtLnRpdGxlX2ltYWdlO1xyXG5cclxuICAgICAgICB2YXIgY29sMTIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb2wxMi5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInKTtcclxuXHJcbiAgICAgICAgdm0udGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnRleHQuY2xhc3NMaXN0LmFkZCgndGV4dCcsICdwYWRkaW5nLXRvcCcpO1xyXG4gICAgICAgIHZtLnRleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGl0bGUpKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbDEyXzIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb2wxMl8yLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicpO1xyXG5cclxuICAgICAgICB2bS5zdWJfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnN1Yl90ZXh0LmNsYXNzTGlzdC5hZGQoJ3RleHRfbGlnaHQnKTtcclxuICAgICAgICB2bS5zdWJfdGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0eXBlKSk7XHJcblxyXG4gICAgICAgIC8vIC5jb2wtbWQtM1xyXG4gICAgICAgIC8vICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKSNwMVxyXG4gICAgICAgIC8vICAgICAgIC50ZXh0IEJyZWF0aGxlc3M6IEhUTUw1IEdhbWVcclxuXHJcbiAgICAgICAgLy8gLmNvbC1tZC0zXHJcbiAgICAgICAgLy8gICAgICAgLmNhcmQtZHJvcHNoYWRvdy5yb3dcclxuICAgICAgICAvLyAgICAgICAgIC5jb2wtbWQtMTIubm9wYWRcclxuICAgICAgICAvLyAgICAgICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpI3AxLmRyb3BzaGFkb3dcclxuICAgICAgICAvLyAgICAgICAgIC5jb2wtbWQtMTJcclxuICAgICAgICAvLyAgICAgICAgICAgLnRleHQgQnJlYXRobGVzc1xyXG4gICAgICAgIC8vICAgICAgICAgLmNvbC1tZC0xMlxyXG4gICAgICAgIC8vICAgICAgICAgICAudGV4dF9saWdodCBIVE1MNSBHYW1lXHJcblxyXG4gICAgICAgIHZtLmNvbC5hcHBlbmRDaGlsZChjYXJkX3NoYWRvdyk7XHJcbiAgICAgICAgY2FyZF9zaGFkb3cuYXBwZW5kQ2hpbGQobm9wYWQpO1xyXG4gICAgICAgIG5vcGFkLmFwcGVuZENoaWxkKHZtLmltZyk7XHJcbiAgICAgICAgY2FyZF9zaGFkb3cuYXBwZW5kQ2hpbGQoY29sMTIpO1xyXG4gICAgICAgIGNvbDEyLmFwcGVuZENoaWxkKHZtLnRleHQpO1xyXG4gICAgICAgIGNhcmRfc2hhZG93LmFwcGVuZENoaWxkKGNvbDEyXzIpO1xyXG4gICAgICAgIGNvbDEyXzIuYXBwZW5kQ2hpbGQodm0uc3ViX3RleHQpO1xyXG5cclxuICAgICAgICB2bS5vcGVuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHZtLmNvbC5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyAgIGNvbnNvbGUuKHZtLml0ZW1zWzBdKTtcclxuICAgICAgICAgICAgdmFyIGRpZmZlcmVudF93cmFwcGVyID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBkaWZmZXJlbnRfd3JhcHBlciA9IHZtLnBvcnRmb2xpby5jbG9zZSh2bS5pdGVtX251bSk7XHJcblxyXG4gICAgICAgICAgICB2bS5vcGVuID0gdm0udGFyZ2V0X3dyYXBwZXIudHJhbnNpdGlvbldyYXBwZXIoZGlmZmVyZW50X3dyYXBwZXIsIHZtLm9wZW4sIHZtLnRpdGxlLCB2bS5kZXNjLCB2bS5zdGFjaywgdm0ubWVkaWEsIHZtLnVybClcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAganVtcCgnI3dyYXBwZXItJyArIHZtLnJvdywge1xyXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxyXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogLXZtLmNvbC5jbGllbnRIZWlnaHQgLSAzNVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSwgdGltZW91dCk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gICB2bS5zZXREYXRhKCk7ICBcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgYXBwZW5kKHJvdzogbnVtYmVyLCB3cmFwcGVyOiBXcmFwcGVyKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZhciByb3dfZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb3dfJyArIHJvdyk7XHJcbiAgICAgICAgcm93X2VsZW1lbnQuYXBwZW5kQ2hpbGQodm0uY29sKTtcclxuICAgICAgICB2bS50YXJnZXRfd3JhcHBlciA9IHdyYXBwZXI7XHJcbiAgICAgICAgdm0uc3RhY2suZmxleF9ncmlkX2lkID0gd3JhcHBlci5mbGV4X2dyaWQuaWQ7XHJcbiAgICAgICAgdm0ubWVkaWEuaWQgPSAnbWVkaWEtJyArIHJvdztcclxuICAgICAgICB2bS5yb3cgPSByb3c7XHJcbiAgICB9XHJcbiAgICBzZXRDb2woY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uY29sLmNsYXNzTGlzdC5yZW1vdmUodm0uY29sX3NpemUpO1xyXG4gICAgICAgIHZtLmNvbF9zaXplID0gY2xhc3NOYW1lO1xyXG4gICAgICAgIHZtLmNvbC5jbGFzc0xpc3QuYWRkKHZtLmNvbF9zaXplKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUG9ydGZvbGlvIHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBqc29uX29ianM6IElQb3J0Zm9saW9JdGVtW107XHJcbiAgICBwYXRoOiBzdHJpbmc7XHJcbiAgICBpdGVtczogUG9ydGZvbGlvSXRlbVtdO1xyXG4gICAgd3JhcHBlcnM6IFdyYXBwZXJbXTtcclxuICAgIGZsZXhfZ3JpZF9pZDogc3RyaW5nO1xyXG4gICAgcGVyX3JvdzogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGpzb25fb2JqczogSVBvcnRmb2xpb0l0ZW1bXSkge1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5pZCA9IGlkO1xyXG4gICAgICAgIHZtLmpzb25fb2JqcyA9IGpzb25fb2JqcztcclxuXHJcblxyXG4gICAgICAgIHZtLml0ZW1zID0gW107XHJcbiAgICAgICAgdm0ud3JhcHBlcnMgPSBbXTtcclxuXHJcbiAgICAgICAgLy9hZGQgd3JhcHBlcnMgYmFzZWQgb24gYWxsIHBvc3NpYmxlIGJyZWFrcG9pbnQgd2lkdGhzIChqc29uX29ianMvMilcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE1hdGguY2VpbChqc29uX29ianMubGVuZ3RoIC8gMik7IGorKykge1xyXG4gICAgICAgICAgICB2bS53cmFwcGVycy5wdXNoKG5ldyBXcmFwcGVyKGopKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vYWRkIGFsbCBpdGVtc1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uanNvbl9vYmpzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZtLml0ZW1zLnB1c2gobmV3IFBvcnRmb2xpb0l0ZW0odm0sIGksIGpzb25fb2Jqc1tpXS50aXRsZSwganNvbl9vYmpzW2ldLnRpdGxlX2ltYWdlLCBqc29uX29ianNbaV0uZGVzYywganNvbl9vYmpzW2ldLnN0YWNrLCBqc29uX29ianNbaV0ubWVkaWEsIGpzb25fb2Jqc1tpXS50eXBlLCBqc29uX29ianNbaV0udXJsKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2bS5hcHBlbmRBbGwoKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhcHBlbmRBbGwoKSB7IC8vYXBwZW5kcyBQb3J0Zm9saW9JdGVtcyBiYXNlZCBvbiBzY3JlZW4gc2l6ZTsgZ2V0cyBkaWdlc3RlZFxyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2YXIgc2NyZWVuV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHJcbiAgICAgICAgLy9yZWFzc2lnbnMgY29scyBiYXNlZCBvbiBicmVha3BvaW50c1xyXG4gICAgICAgIHZhciBicmVha3BvaW50cyA9IFt7IG1pbjogMCwgbWF4OiA3NjgsIGNvbF9zaXplOiAnY29sLXhzLTYnLCBwZXJfcm93OiAyIH0sIHsgbWluOiA3NjksIG1heDogOTkyLCBjb2xfc2l6ZTogJ2NvbC14cy00JywgcGVyX3JvdzogMyB9LCB7IG1pbjogOTkzLCBtYXg6IDEyMDAsIGNvbF9zaXplOiAnY29sLXhzLTMnLCBwZXJfcm93OiA0IH0sIHsgbWluOiAxMjAwLCBtYXg6IDk5OTksIGNvbF9zaXplOiAnY29sLXhzLTMnLCBwZXJfcm93OiA0IH1dO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnJlYWtwb2ludHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIC8vaWYgaW4gYnJlYWtwb2ludCByYW5nZSwgYW5kIG5vdCBzYW1lIGFzIGJlZm9yZVxyXG4gICAgICAgICAgICBpZiAoLyp2bS5pdGVtc1swXS5jb2xfc2l6ZSAhPT0gYnJlYWtwb2ludHNbaV0uY29sX3NpemUgJiYgKi9zY3JlZW5XaWR0aCA+IGJyZWFrcG9pbnRzW2ldLm1pbiAmJiBzY3JlZW5XaWR0aCA8IGJyZWFrcG9pbnRzW2ldLm1heCkge1xyXG4gICAgICAgICAgICAgICAgLy9jbGVhciBhbGwgcm93c1xyXG4gICAgICAgICAgICAgICAgdm0ucGVyX3JvdyA9IGJyZWFrcG9pbnRzW2ldLnBlcl9yb3c7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcnRmb2xpbycpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZXJhdG9yID0gcGFyZW50LmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGEgPSAxOyBhIDwgaXRlcmF0b3I7IGErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYXJlbnQuY2hpbGRyZW5bMV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vYWRkIG5ldyByb3dzIGFuZCB3cmFwcGVyc1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgciA9IDA7IHIgPCBNYXRoLmNlaWwodm0uaXRlbXMubGVuZ3RoIC8gYnJlYWtwb2ludHNbaV0ucGVyX3Jvdyk7IHIrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgICAgICByb3cuaWQgPSAncm93XycgKyByO1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdy5jbGFzc0xpc3QuYWRkKCdyb3cnLCAnbm9tYXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSB2bS53cmFwcGVyc1tyXS5odG1sO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQocm93KTtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQod3JhcHBlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL2FkZCBjb2xzIHRvIG5ldyByb3dzXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZtLml0ZW1zLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uaXRlbXNbal0uc2V0Q29sKGJyZWFrcG9pbnRzW2ldLmNvbF9zaXplKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcm93X251bSA9IE1hdGguZmxvb3IoaiAvIGJyZWFrcG9pbnRzW2ldLnBlcl9yb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLml0ZW1zW2pdLmFwcGVuZChyb3dfbnVtLCB2bS53cmFwcGVyc1tyb3dfbnVtXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsb3NlKGl0ZW1fbnVtOiBudW1iZXIpIHsgLy9jbG9zZXMgYWxsIHdyYXBwZXJzXHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIC8vY2xvc2VzIGFsbCBpdGVtcyBpbiB0aGUgcm93IG9mIHRoZSBnaXZlbiBpdGVtLlxyXG4gICAgICAgIHZhciByb3cgPSBNYXRoLmZsb29yKGl0ZW1fbnVtIC8gdm0ucGVyX3Jvdyk7XHJcblxyXG4gICAgICAgIC8vIGZvcih2YXIgaiA9IChyb3cqdm0ucGVyX3Jvdyk7IGogPCAoKHJvdyp2bS5wZXJfcm93KSt2bS5wZXJfcm93KTsgaisrKXtcclxuICAgICAgICAvLyAgICAgaWYoaXRlbV9udW0gIT09IGogJiYgdm0uaXRlbXNbal0pe1xyXG4gICAgICAgIC8vICAgICAgICAgdm0uaXRlbXNbal0ub3BlbiA9IGZhbHNlO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIHZhciByZXR1cm5fdmFsdWUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2bS5pdGVtcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoaXRlbV9udW0gIT09IGogJiYgdm0uaXRlbXNbal0pIHtcclxuICAgICAgICAgICAgICAgIHZtLml0ZW1zW2pdLm9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciByID0gMDsgciA8IHZtLndyYXBwZXJzLmxlbmd0aDsgcisrKSB7XHJcbiAgICAgICAgICAgIGlmIChyICE9PSByb3cgJiYgdm0ud3JhcHBlcnNbcl0uaHRtbC5jbGFzc0xpc3RbMV0gPT09ICdvcGVuJykge1xyXG4gICAgICAgICAgICAgICAgdm0ud3JhcHBlcnNbcl0uY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldHVybl92YWx1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdyYXBwZXIge1xyXG4gICAgdGl0bGU6IHN0cmluZztcclxuICAgIGRlc2M6IHN0cmluZztcclxuICAgIGNvbGxlY3Rpb246IHNraWxsX2JhZGdlLkNvbGxlY3Rpb247XHJcbiAgICBwb3J0X2ltYWdlOiBzdHJpbmc7XHJcbiAgICBtZWRpYTogbWVkaWEuTWVkaWE7XHJcbiAgICB1cmw6IHN0cmluZztcclxuXHJcblxyXG4gICAgaHRtbDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICB0aXRsZV9lbGVtZW50OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGRlc2NyaXB0aW9uOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHN0YWNrOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGZsZXhfZ3JpZDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBkZW1vOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbDU6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgZGVzY3JpcHRpb25fdGV4dDogVGV4dDtcclxuICAgIHRpdGxlX2VsZW1lbnRfdGV4dDogVGV4dDtcclxuICAgIGxpbms6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgbGlua190ZXh0OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbDY6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29sNkhvbGRlcjogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgY2hhbmdlOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHJvd19udW0pIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZtLmNoYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgIC8vIHZtLnRpdGxlID0gcEl0ZW0udGl0bGU7XHJcbiAgICAgICAgLy8gdm0uZGVzYyA9IHBJdGVtLmRlc2M7XHJcbiAgICAgICAgLy8gdm0uc3RhY2sgPSBwSXRlbS5zdGFjaztcclxuICAgICAgICAvLyB2bS5wb3J0X2ltYWdlID0gcEl0ZW0ucG9ydF9pbWFnZTtcclxuICAgICAgICB2bS5odG1sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uaHRtbC5pZCA9ICd3cmFwcGVyLScgKyByb3dfbnVtO1xyXG4gICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LmFkZCgnd3JhcHBlcicpO1xyXG5cclxuICAgICAgICB2YXIgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgcm93LmlkID0gJ2NvbnRlbnQnO1xyXG4gICAgICAgIHJvdy5jbGFzc0xpc3QuYWRkKCdyb3cnLCAnbm9tYXInKTtcclxuXHJcbiAgICAgICAgdm0udGl0bGVfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2Rlc2MtdGV4dCcsICdwYWQtc3BhY2luZycpO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnRfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcclxuICAgICAgICB2bS50aXRsZV9lbGVtZW50LmFwcGVuZENoaWxkKHZtLnRpdGxlX2VsZW1lbnRfdGV4dCk7XHJcblxyXG4gICAgICAgIHZtLmNvbDZIb2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5jb2w2SG9sZGVyLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtNicsICdjb2wtbGctNycsICdyb3cnLCAnbm9tYXInLCAnbm9wYWQnKTtcclxuXHJcbiAgICAgICAgdmFyIHJvd19maWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgcm93X2ZpbGwuY2xhc3NMaXN0LmFkZCgncm93JywgJ2p1c3RpZnktY2VudGVyJywgJ25vbWFyJyk7XHJcblxyXG4gICAgICAgIHZhciBjb2wxMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbDEyLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicpO1xyXG5cclxuICAgICAgICB2bS5jb2w2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uY29sNi5pZCA9ICdtZWRpYS0nICsgcm93X251bTtcclxuICAgICAgICB2bS5jb2w2LmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtNicsICdjb2wtbGctNScpO1xyXG5cclxuICAgICAgICB2YXIgY29sM18yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29sM18yLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtMycsICdub3BhZC1sZWZ0Jyk7XHJcblxyXG4gICAgICAgIHZtLmRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb24uY2xhc3NMaXN0LmFkZCgnaGVhZGVyLXRleHQnLCAncGFkLXNwYWNpbmcnKTtcclxuICAgICAgICB2bS5kZXNjcmlwdGlvbi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnRGVzY3JpcHRpb24nKSk7XHJcblxyXG4gICAgICAgIHZhciBkZXNjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGVzYy5jbGFzc0xpc3QuYWRkKCdkZXNjcmlwdGlvbi10ZXh0JywgJ3BhZC1zcGFjaW5nJyk7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb25fdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcclxuICAgICAgICBkZXNjLmFwcGVuZENoaWxkKHZtLmRlc2NyaXB0aW9uX3RleHQpO1xyXG5cclxuICAgICAgICB2bS5zdGFjayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnN0YWNrLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtMTInLCAnY29sLWxnLTcnKTtcclxuICAgICAgICAvLyB2bS5zdGFjay5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnU3RhY2snKSk7XHJcblxyXG4gICAgICAgIHZhciBzdGFja190aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHN0YWNrX3RpdGxlLmNsYXNzTGlzdC5hZGQoJ2hlYWRlci10ZXh0JywgJ3BhZC1zcGFjaW5nJylcclxuICAgICAgICBzdGFja190aXRsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnU3RhY2snKSk7XHJcblxyXG4gICAgICAgIHZtLmZsZXhfZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmZsZXhfZ3JpZC5pZCA9ICdwZmxleC1ncmlkLScgKyByb3dfbnVtO1xyXG4gICAgICAgIHZtLmZsZXhfZ3JpZC5jbGFzc0xpc3QuYWRkKCdyb3cnLCAncG9ydGZvbGlvLWZsZXgnLCAnY29sLXhzLTEyJyk7XHJcblxyXG4gICAgICAgIHZtLmRlbW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5kZW1vLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtMTInLCAnY29sLWxnLTUnKTtcclxuICAgICAgICAvLyB2bS5kZW1vLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdMaXZlIERlbW8nKSk7XHJcblxyXG4gICAgICAgIHZhciBkZW1vX3RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGVtb190aXRsZS5jbGFzc0xpc3QuYWRkKCdoZWFkZXItdGV4dCcsICdwYWQtc3BhY2luZycpXHJcbiAgICAgICAgZGVtb190aXRsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnUmVsZXZhbnQgTGlua3MnKSk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgdm0ubGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmxpbmsuY2xhc3NMaXN0LmFkZCgnZ2l0aHViLWJ1dHRvbicsICdyb3cnLCAnbm9tYXInKTtcclxuXHJcbiAgICAgICAgdm0ubGlua190ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0ubGlua190ZXh0LmNsYXNzTGlzdC5hZGQoJ3RleHQnKTtcclxuICAgICAgICB2bS5saW5rX3RleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0xpdmUgTGluaycpKTtcclxuXHJcbiAgICAgICAgdm0uY29sNSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmNvbDUuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2NvbC1tZC01Jyk7XHJcblxyXG4gICAgICAgIC8qIEdPTk5BIEhBVkUgVE8gQUREIE1FRElBIERZTkFNSUNBTExZICovXHJcblxyXG4gICAgICAgIHZtLmh0bWwuYXBwZW5kQ2hpbGQocm93KTtcclxuICAgICAgICByb3cuYXBwZW5kQ2hpbGQodm0udGl0bGVfZWxlbWVudCk7XHJcbiAgICAgICAgcm93LmFwcGVuZENoaWxkKHZtLmNvbDYpO1xyXG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZCh2bS5jb2w2SG9sZGVyKTtcclxuXHJcblxyXG4gICAgICAgIHZtLmNvbDZIb2xkZXIuYXBwZW5kQ2hpbGQoY29sMTIpO1xyXG4gICAgICAgIGNvbDEyLmFwcGVuZENoaWxkKHZtLmRlc2NyaXB0aW9uKTtcclxuICAgICAgICBjb2wxMi5hcHBlbmRDaGlsZChkZXNjKTtcclxuICAgICAgICB2bS5jb2w2SG9sZGVyLmFwcGVuZENoaWxkKHZtLnN0YWNrKVxyXG4gICAgICAgIHZtLnN0YWNrLmFwcGVuZENoaWxkKHN0YWNrX3RpdGxlKTtcclxuICAgICAgICB2bS5zdGFjay5hcHBlbmRDaGlsZCh2bS5mbGV4X2dyaWQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZtLmNvbDZIb2xkZXIuYXBwZW5kQ2hpbGQodm0uZGVtbylcclxuICAgICAgICB2bS5kZW1vLmFwcGVuZENoaWxkKGRlbW9fdGl0bGUpO1xyXG4gICAgICAgIHZtLmRlbW8uYXBwZW5kQ2hpbGQodm0ubGluayk7XHJcbiAgICAgICAgdm0ubGluay5hcHBlbmRDaGlsZCh2bS5saW5rX3RleHQpO1xyXG4gICAgICAgIHZtLmxpbmsub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbG9jYXRpb24uaHJlZiA9IHZtLnVybDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAvLyN3cmFwcGVyLTAud3JhcHBlci5vcGVuXHJcbiAgICAgICAgLy8gLnJvdyNjb250ZW50XHJcbiAgICAgICAgLy8gICAuY29sLW1kLTEyLmRlc2MtdGV4dCBCcmVhdGhsZXNzXHJcbiAgICAgICAgLy8gICAuY29sLW1kLTYjbWVkaWEtMFxyXG4gICAgICAgIC8vICAgLmNvbC1tZC02LnJvd1xyXG4gICAgICAgIC8vICAgICAgIC5jb2wtbWQtMTJcclxuICAgICAgICAvLyAgICAgICAgIC5oZWFkZXItdGV4dC5wYWRkaW5nLWxlZnQgRGVzY3JpcHRpb246XHJcbiAgICAgICAgLy8gICAgICAgICAuZGVzY3JpcHRpb24tdGV4dC5wYWRkaW5nLWxlZnQgYXNkZmFzZGZcclxuICAgICAgICAvLyAgICAgICAuY29sLW1kLTYuaGVhZGVyLXRleHQgU3RhY2s6XHJcbiAgICAgICAgLy8gICAgICAgLmNvbC1tZC02LmhlYWRlci10ZXh0IExpdmUgRGVtbzpcclxuXHJcbiAgICAgICAgdm0uaHRtbC5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgaWYgKHZtLmNoYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICAgICB2bS5zZXREYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5jaGFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICB9XHJcbiAgICAvLyBjbG9zZURhdGEoKXtcclxuICAgIC8vICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAvLyAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgLy8gICAgICAgICB2bS5jb2xsZWN0aW9uLmNsb3NlKCk7XHJcbiAgICAvLyAgICAgfSx0aW1lb3V0KTtcclxuXHJcbiAgICAvLyB9XHJcblxyXG4gICAgc2V0RGF0YSgpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uc2V0VGl0bGUoKTtcclxuICAgICAgICB2bS5zZXREZXNjKCk7XHJcbiAgICAgICAgdm0uc2V0U3RhY2soKTtcclxuICAgICAgICB2bS5zZXRNZWRpYSgpO1xyXG5cclxuICAgICAgICBpZih2bS51cmwgPT09IFwiXCIpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSSBUSElOSyBUSElTIEhBUFBFTkVEPycpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2bS5jb2w2Lmxhc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIHZtLmNvbDZIb2xkZXIucmVtb3ZlQ2hpbGQodm0uZGVtbyk7XHJcbiAgICAgICAgfSBlbHNlIGlmKHZtLmNvbDZIb2xkZXIubGFzdENoaWxkICE9PSB2bS5kZW1vKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1dPQUggVEhJUyBXT1JLUz8nKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codm0uY29sNi5sYXN0Q2hpbGQpO1xyXG4gICAgICAgICAgICB2bS5jb2w2SG9sZGVyLmFwcGVuZENoaWxkKHZtLmRlbW8pOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB2bS5zZXRTdGFjayhzdGFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGl0bGUoKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnRfdGV4dC50ZXh0Q29udGVudCA9IHZtLnRpdGxlO1xyXG4gICAgfVxyXG4gICAgc2V0RGVzYygpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb25fdGV4dC50ZXh0Q29udGVudCA9IHZtLmRlc2M7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U3RhY2soKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmNvbGxlY3Rpb24ucmVzZXRJZHModm0uZmxleF9ncmlkLmlkKTtcclxuICAgICAgICB2bS5jb2xsZWN0aW9uLmxvYWQoKTtcclxuICAgIH1cclxuICAgIHNldE1lZGlhKCkge1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5tZWRpYS5zZXRJZCh2bS5tZWRpYS5pZCk7XHJcbiAgICAgICAgdm0ubWVkaWEubG9hZE1lZGlhKDApO1xyXG4gICAgfVxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4gICAgfVxyXG4gICAgY2hhbmdlV3JhcHBlcihvcGVuOiBib29sZWFuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgLy9jbG9zZSB3cmFwcGVyOlxyXG5cclxuXHJcbiAgICAgICAgaWYgKHZtLnRpdGxlID09PSB0aXRsZSkgeyAvKippZiBubyBjaGFuZ2UgKi9cclxuICAgICAgICAgICAgdm0uY2hhbmdlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAob3Blbikge1xyXG4gICAgICAgICAgICAgICAgLy8gdm0uY2xvc2VEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZtLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgICAgICAgICB2bS5kZXNjID0gZGVzYztcclxuICAgICAgICAgICAgICAgIHZtLmNvbGxlY3Rpb24gPSBzdGFjaztcclxuICAgICAgICAgICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgICAgICAgICB2bS51cmwgPSB1cmw7XHJcbiAgICAgICAgICAgICAgICB2bS5zZXREYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh2bS5odG1sLmNsYXNzTGlzdFsxXSAhPT0gJ29wZW4nKSB7IC8qKmlmIGFsbCBzZWxlY3Rpb25zIGFyZSBjbG9zZWQgaW5pdGlhbGx5L2NoYW5nZSB3aGVuIGNsb3NlZCovXHJcbiAgICAgICAgICAgIHZtLmNoYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2bS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgICAgICB2bS5kZXNjID0gZGVzYztcclxuICAgICAgICAgICAgdm0uY29sbGVjdGlvbiA9IHN0YWNrO1xyXG4gICAgICAgICAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgICAgICAgICB2bS51cmwgPSB1cmw7XHJcbiAgICAgICAgICAgIHZtLnNldERhdGEoKTtcclxuICAgICAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZtLmNoYW5nZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHZtLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgICAgIHZtLmRlc2MgPSBkZXNjO1xyXG4gICAgICAgICAgICB2bS5jb2xsZWN0aW9uID0gc3RhY2s7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgICAgIHZtLnVybCA9IHVybDtcclxuICAgICAgICAgICAgLy8gdm0uY2xvc2VEYXRhKCk7XHJcbiAgICAgICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25XcmFwcGVyKGRpZmZlcmVudF93cmFwcGVyOiBib29sZWFuLCBvcGVuOiBib29sZWFuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciByZXR1cm5fdmFsdWU7XHJcblxyXG4gICAgICAgIGlmIChkaWZmZXJlbnRfd3JhcHBlcikge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHZtLmNoYW5nZVdyYXBwZXIob3BlbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSwgdXJsKTtcclxuICAgICAgICAgICAgfSwgdGltZW91dCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChvcGVuID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb3BlbiA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHZtLmNoYW5nZVdyYXBwZXIob3BlbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSwgdXJsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHZtLmNoYW5nZVdyYXBwZXIob3BlbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSwgdXJsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldHVybl92YWx1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUG9ydGZvbGlvSXRlbSB7XHJcbiAgICB0aXRsZTogc3RyaW5nO1xyXG4gICAgdGl0bGVfaW1hZ2U6IHN0cmluZztcclxuICAgIGRlc2M6IHN0cmluZztcclxuICAgIHN0YWNrOiBza2lsbF9iYWRnZS5Db2xsZWN0aW9uO1xyXG4gICAgbWVkaWE6IG1lZGlhLk1lZGlhO1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gICAgdXJsOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8vIHtcIm5hbWVcIjogJ1B5dGhvbicsICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J3B5dGhvbi01LnN2Zyd9XHJcbnZhciBicmVhdGhsZXNzX3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ1BoYXNlci5qcycsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdwaGFzZXIuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnUGhvdG9zaG9wJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3Bob3Rvc2hvcC1jYy5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdqUXVlcnknLCBcImNsYXNzXCI6ICdjaXJjbGUtNTAnLCBcImltYWdlXCI6ICdqcXVlcnktMS5zdmcnIH1cclxuXSk7XHJcbnZhciByZW1fc3RhY2sgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJycsIFt7IFwibmFtZVwiOiAnVW5pdHknLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAndW5pdHkuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnTWF5YScsIFwiY2xhc3NcIjogJ2NpcmNsZS0yNScsIFwiaW1hZ2VcIjogJ21heWEucG5nJyB9LFxyXG57IFwibmFtZVwiOiAnUGhvdG9zaG9wJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAncGhvdG9zaG9wLWNjLnN2Zyd9LFxyXG57IFwibmFtZVwiOiAnSWxsdXN0cmF0b3InLCBcImNsYXNzXCI6ICdjaXJjbGUtMjUnLCBcImltYWdlXCI6ICdhZG9iZS1pbGx1c3RyYXRvci1jYy5zdmcnfVxyXG5dKTtcclxudmFyIHFiZXJ0X3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ01heWEnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnbWF5YS5wbmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdQaG90b3Nob3AnLCBcImNsYXNzXCI6ICdjaXJjbGUtMjUnLCBcImltYWdlXCI6ICdwaG90b3Nob3AtY2Muc3ZnJyB9XHJcbl0pO1xyXG52YXIgd2VhdGhlcl9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgW3sgXCJuYW1lXCI6ICdBbmd1bGFyIEpTJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2FuZ3VsYXItaWNvbi5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdEMy5qcycsIFwiY2xhc3NcIjogJ2NpcmNsZS01MCcsIFwiaW1hZ2VcIjogJ2QzLTIuc3ZnJyB9XHJcbl0pO1xyXG5cclxudmFyIHJvYXN0X3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ0VtYmVyIEpTJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2VtYmVyLnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0QzLmpzJywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAnZDMtMi5zdmcnIH1cclxuXSk7XHJcblxyXG52YXIgY29udHJhc3Rfc3RhY2sgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJycsIFt7IFwibmFtZVwiOiAnSmF2YScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdqYXZhLTE0LnN2ZycgfVxyXG5dKTtcclxuXHJcbnZhciBwb3J0X3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ1R5cGUgU2NyaXB0JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3R5cGVzY3JpcHQuc3ZnJyB9LCBcclxueyBcIm5hbWVcIjogJ0hUTUw1JywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2h0bWw1LnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ1NDU1MnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnc2Fzcy0xLnN2ZycgfVxyXG5dKTtcclxuXHJcbi8vIHZhciBicmVhdGhsZXNzX21lZGlhID0gbmV3IG1lZGlhLk1lZGlhKCdtZWRpYS0wJywgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9jYXQuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzE5ODE0OTc5NVwiIHdpZHRoPVwiNDcxXCIgaGVpZ2h0PVwiMzM1XCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+Jyk7XHJcblxyXG52YXIgbSA9IFtdXHJcblxyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbIFwiLi9wb3J0Zm9saW8vcmVtXzUucG5nXCIsIFwiLi9wb3J0Zm9saW8vcmVtXzMucG5nXCIsIFwiLi9wb3J0Zm9saW8vcmVtXzIucG5nXCIsIFwiLi9wb3J0Zm9saW8vcmVtXzQucG5nXCJdLCBbIFwiLi9wb3J0Zm9saW8vcmVtXzMucG5nXCIsIFwiLi9wb3J0Zm9saW8vcmVtXzIucG5nXCIsIFwiLi9wb3J0Zm9saW8vcmVtXzQucG5nXCJdLCAnPGlmcmFtZSBzcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vMjUyNDM2OTg5XCIgd2lkdGg9XCI0NzFcIiBoZWlnaHQ9XCIzMzVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKSk7XHJcblxyXG5cclxubS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19wbGF5LmpwZ1wiLCBcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfZ2FtZXBsYXlfMi5qcGdcIiwgXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX2dhbWVwbGF5LmpwZ1wiLCBcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfY29udHJvbHMuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX3BsYXkuanBnXCIsIFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheV8yLmpwZ1wiLCBcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfZ2FtZXBsYXkuanBnXCIsIFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19jb250cm9scy5qcGdcIl0pKTtcclxuXHJcblxyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbXCIuL3BvcnRmb2xpby9xYmVydF9wbGF5LmpwZ1wiLCBcIi4vcG9ydGZvbGlvL3FiZXJ0X3BsYXllci5qcGdcIiwgXCIuL3BvcnRmb2xpby9xYmVydF9zbmFrZS5qcGdcIl0sIFtcIi4vcG9ydGZvbGlvL3FiZXJ0X3BsYXllci5qcGdcIiwgXCIuL3BvcnRmb2xpby9xYmVydF9zbmFrZS5qcGdcIl0sICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8xOTgxNDk3OTVcIiB3aWR0aD1cIjQ3MVwiIGhlaWdodD1cIjMzNVwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicpKTtcclxuXHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFtcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8xLnBuZ1wiLCBcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8zLnBuZ1wiLCBcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8yLnBuZ1wiXSwgW1wiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzEucG5nXCIsIFwiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzMucG5nXCIsIFwiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzIucG5nXCJdKSk7XHJcblxyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL21lYW5fZm9yZWNhc3RfMS5qcGcnLCAnLi9wb3J0Zm9saW8vbWVhbl9mb3JlY2FzdF8yLmpwZyddLCBbJy4vcG9ydGZvbGlvL21lYW5fZm9yZWNhc3RfMS5qcGcnLCAnLi9wb3J0Zm9saW8vbWVhbl9mb3JlY2FzdF8yLmpwZyddKSk7XHJcblxyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL3JvYXN0XzYucG5nJywgJy4vcG9ydGZvbGlvL3JvYXN0XzIucG5nJywgJy4vcG9ydGZvbGlvL3JvYXN0XzMucG5nJywgJy4vcG9ydGZvbGlvL3JvYXN0XzQucG5nJ10sIFsnLi9wb3J0Zm9saW8vcm9hc3RfNi5wbmcnLCAnLi9wb3J0Zm9saW8vcm9hc3RfMi5wbmcnLCcuL3BvcnRmb2xpby9yb2FzdF8zLnBuZycsICcuL3BvcnRmb2xpby9yb2FzdF80LnBuZyddKSk7XHJcblxyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL2NvbnRyYXN0XzMucG5nJywgJy4vcG9ydGZvbGlvL2NvbnRyYXN0XzUucG5nJywgJy4vcG9ydGZvbGlvL2NvbnRyYXN0XzQucG5nJywgICcuL3BvcnRmb2xpby9jb250cmFzdF83LnBuZyddLCBbJy4vcG9ydGZvbGlvL2NvbnRyYXN0XzMucG5nJywgJy4vcG9ydGZvbGlvL2NvbnRyYXN0XzUucG5nJywgJy4vcG9ydGZvbGlvL2NvbnRyYXN0XzQucG5nJywgJy4vcG9ydGZvbGlvL2NvbnRyYXN0XzcucG5nJ10pKTtcclxuXHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vcG9ydF8xLnBuZycsICcuL3BvcnRmb2xpby9wb3J0XzIucG5nJywgJy4vcG9ydGZvbGlvL3BvcnRfMy5wbmcnLCAgJy4vcG9ydGZvbGlvL3BvcnRfNC5wbmcnXSwgWycuL3BvcnRmb2xpby9wb3J0XzEucG5nJywgJy4vcG9ydGZvbGlvL3BvcnRfMi5wbmcnLCAnLi9wb3J0Zm9saW8vcG9ydF8zLnBuZycsICcuL3BvcnRmb2xpby9wb3J0XzQucG5nJ10pKTtcclxuXHJcbnZhciBwb3J0Zm9saW8gPSBuZXcgUG9ydGZvbGlvKCdwb3J0Zm9saW8nLCBbXHJcbiAgICB7IHRpdGxlOiAnUmVtJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9yZW1lbWJlcmVuY2VfbG9nby5qcGcnLCBkZXNjOiBcIlJlbSBpcyBhIHZpZGVvIGdhbWUgYWJvdXQgYSB5b3VuZyBnaXJsIHRyYXBwZWQgaW4gYSBjb21hdG9zZSBkcmVhbXNjYXBlLiBZb3UgcGxheSBhcyBhIHlvdW5nIGdpcmwgd2hvIG11c3Qgb3ZlcmNvbWUgaGVyIGZlYXJzIHRvIHJlbWVtYmVyIGhlciBwYXN0LiBJbiB0aGlzIGZ1biwgb3Zlci10aGUtc2hvdWxkZXIgc3RlYWx0aCBnYW1lIHlvdSBtdXN0IGF2b2lkIHNjcmVlbiBoZWFkZWQgZW5lbWllcywgYW5kIGZpbmQgbWVtZW50b3Mgb2YgeW91ciBwYXN0LiBGb3IgdGhpcyBwcm9qZWN0IEkgd29ya2VkIGluIG1hbnkgYXJlYXMgaW5jbHVkaW5nIFdlYiBEZXZlbG9wbWVudCwgTGV2ZWwgRGVzaWduLCBNb2RlbGluZywgYW5kIERvY3VtZW50YXRpb24uXCIsIHN0YWNrOiByZW1fc3RhY2ssIG1lZGlhOiBtWzBdLCB0eXBlOiAnVW5pdHkgR2FtZScsIHVybDogJ2h0dHA6Ly9vZmZicmFuZGhlbGwuZ2FtZXMvIy9ob21lJyB9LFxyXG4gICAgeyB0aXRsZTogJ1JvYXN0JywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9yb2FzdF83LmpwZycsIGRlc2M6IFwiUm9hc3QgaXMgYSB3ZWJhcHAgdGhhdCBzdXJ2ZXlzIGNvbWZvcnQgaW4gYW4gaW5kb29yIHNwYWNlLiBJdCBhc2tzIHF1ZXN0aW9ucyB0aGF0IGdhdWdlIHRlbXBlcmF0dXJlLCBub2lzZSwgc21lbGwsIGFuZCBodW1pZGl0eSwgYW5kIG1hcHMgaXQgdG8gd2hlcmUgeW91IGFyZSBvbiB5b3VyIGJ1aWxkaW5nJ3MgZmxvb3JwbGFuLiBUaHJvdWdoIHRoaXMgY3Jvd2Qgc291cmNlZCBkYXRhIGNvbGxlY3RlZCwgYnVpbGRpbmcgbWFuYWdlcnMsIGFyY2hpdGVjdHMgYW5kIHRoZSBwZW9wbGUgdGFraW5nIHRoZSBzdXJ2ZXkgY2FuIHVuZGVyc3RhbmQgaG93IHBlb3BsZSBmZWVsIGluIGEgc3BhY2UuIEkgd29ya2VkIG9uIHRoaXMgcHJvamVjdCBmb3IgNiBtb250aHMgd2hpbGUgSSB3YXMgd29ya2luZyBhdCB0aGUgYXJjaGl0ZWN0dXJlIGZpcm0sIEtpZXJhbiBUaW1iZXJsYWtlLlwiLCBzdGFjazogcm9hc3Rfc3RhY2ssIG1lZGlhOiBtWzVdLCB0eXBlOiAnV2ViIEFwcCcsIHVybDogJycgfSxcclxuICAgIHsgdGl0bGU6ICdDb250cmFzdCcsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vY29udHJhc3RfNi5wbmcnLCBkZXNjOiBcIkNvbnRyYXN0IGluIGNvbG9yIHRoZW9yeSBpcyB3aGVuIHR3byBjb2xvcnMgYXJlIHN0YXJrbHkgZGlmZmVyZW50IGZyb20gZWFjaCBvdGhlci4gSW4gdGhpcyBnYW1lIHlvdXIgb2JqZWN0aXZlIGlzIHRvIHNlbGVjdCB0aGUgbW9zdCBjb250cmFzdGluZyBjaXJjbGUgd2l0aCB0aGUgYmFja2dyb3VuZCBjb2xvci4gVGhpcyBpcyBjcmVhdGVkIGluIEphdmEgU3dpbmcgd2l0aCBhIGdhbWUgZW5naW5lIGhhbmQgY29kZWQgYnkgbWUgdXNpbmcgdGhlIEJ1ZmZlcmVkIEltYWdlIGNsYXNzLiBUaGlzIGdhbWUgZW5naW5lIGluY2x1ZGVzIGEgRnJhbWUgQnVmZmVyLCBJbnB1dCBNYW5hZ2VyLCBhbmQgQW5pbWF0aW9uIExvb3AuXCIsIHN0YWNrOiBjb250cmFzdF9zdGFjaywgbWVkaWE6IG1bNl0sIHR5cGU6ICdKYXZhIEdhbWUnLCB1cmw6ICdodHRwczovL2RyaXZlLmdvb2dsZS5jb20vb3Blbj9pZD0xR3kwT3NodTk0MS1NUGZodXRXbE82M0Y5MklWdXg5Zk0nIH0sXHJcbiAgICB7IHRpdGxlOiAnUG9ydGZvbGlvJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9wb3J0XzEucG5nJywgZGVzYzogXCJGcm9tIGNvbmNlcHQgdG8gZGVzaWduIHRvIGRldmVsb3BtZW50IEkgcHV0IGEgbG90IG9mIGxvdmUgaW50byB0aGlzLiBBcyBhIHBlcnNvbmFsIGNoYWxsZW5nZSBJIGNyZWF0ZWQgdGhpcyB3ZWJzaXRlIGVudGlyZWx5IGluIFR5cGVzY3JpcHQgd2l0aCBubyBqUXVlcnkuIEFsbCBpbiBhbGwgSSBjYW4gY29uY2x1ZGUgdGhhdCBqUXVlcnkgaXMgb3ZlcnJhdGVkISBKYXZhIFNjcmlwdCBpcyBwb3dlcmZ1bCBlbm91Z2ggb24gaXRzIG93bi5cIiwgc3RhY2s6IHBvcnRfc3RhY2ssIG1lZGlhOiBtWzddLCB0eXBlOiAnV2Vic2l0ZScsIHVybDogJ2h0dHBzOi8vZ2l0aHViLmNvbS9tYXR0d2FnYXIvV2Vic2l0ZXMvdHJlZS9tYXN0ZXIvcG9ydGZvbGlvX3dlYnNpdGVfdjInIH0sXHJcbiAgICB7IHRpdGxlOiAnQnJlYXRobGVzcycsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGcnLCBkZXNjOiBcIlRoZSBTcGFjZSBQaXJhdGUsIEFyaWEsIGlzIG9uIGEgbWlzc2lvbiB0byBsb290IGEgbWluZXJhbCBjYXJnbyBzaGlwLiBIb3dldmVyLCB1cG9uIGxhbmRpbmcgb24gdGhlIGNhcmdvIHNoaXAsIEFyaWEncyBoZWxtZXQgY3JhY2tzIGNhdXNpbmcgaGVyIHRvIHNsb3dseSBsb3NlIG94eWdlbi4gSXQncyBub3cgYSByYWNlIGFnYWluc3QgdGltZSB0byBjb2xsZWN0IGFsbCB0aGUgZ2VtcyBiZWZvcmUgaGVyIG94eWdlbiBydW5zIG91dCFcIiwgc3RhY2s6IGJyZWF0aGxlc3Nfc3RhY2ssIG1lZGlhOiBtWzFdLCB0eXBlOiAnSFRNTDUgR2FtZScsIHVybDogJy9icmVhdGhsZXNzJyB9LFxyXG4gICAgeyB0aXRsZTogJ01lYW4gRm9yZWNhc3QnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL21lYW5fZm9yZWNhc3RfMS5qcGcnLCBkZXNjOiAnQSBzbWFsbCB3ZWIgYXBwIHRoYXQgY2FsY3VsYXRlcyB0aGUgYXZlcmFnZSBvZiAzIHdlYXRoZXIgQVBJXFwnczogV3VuZGVyZ3JvdW5kLCBGb3JlY2FzdC5pbywgYW5kIFdvcmxkIFdlYXRoZXIgT25saW5lLiBUaGlzIGRhdGEgaXMgdGhlbiBzZXJ2ZWQgb250byBhIEQzLmpzIExpbmUgQ2hhcnQgZm9yIHRlbXBlcmF0dXJlLCBodW1pZHR5LCBhbmQgd2luZHNwZWVkLiBBbHNvIHRoZSB3ZWJhcHAgaXRzZWxmIGhhcyBtYW55IHN1YnRsZXRpZXMgdGhhdCBhcmUgYWZmZWN0ZWQgYnkgd2VhdGhlciBkYXRhLiBGb3IgZXhhbXBsZSwgdGhlIHZpZGVvICByZXNlbWJsZXMgdGhlIGN1cnJlbnQgd2VhdGhlci4gQWxzbyBlYWNoIGdyYXBoIGlzIGNvbG9yIGNvYXRlZCBieSBhIGdyYWRpZW50IGJhc2VkIG9uIHRoZSB3ZWF0aGVyIGRhdGEuJywgc3RhY2s6IHdlYXRoZXJfc3RhY2ssIG1lZGlhOiBtWzRdLCB0eXBlOiAnV2Vic2l0ZScsIHVybDogJy9tZWFuZm9yZWNhc3QnIH0sXHJcbiAgICB7IHRpdGxlOiAnUSpCZXJ0JywgdGl0bGVfaW1hZ2U6IFwiLi9wb3J0Zm9saW8vcWJlcnRfcGxheS5qcGdcIiwgZGVzYzogJ1RoaXMgaXMgbXkgQm91bmNpbmcgQmFsbCBBc3NpZ25tZW50IGZvciBBbmltYXRpb24gMSBhdCBEcmV4ZWwgVW5pdmVyc2l0eS4gV2hlbiBwaWNraW5nIGEgZ2FtZSB0aGF0IG1peGVzIG15IGxvdmUgb2YgcmV0cm8gdmlkZW8gZ2FtZXMgYW5kIGJvdW5jaW5nIGJhbGxzLCBRKkJlcnQgd2FzIGEgbm8tYnJhaW5lci4gRXZlcnl0aGluZyBpcyBvcmlnaW5hbGx5IG1vZGVsbGVkLCB0ZXh0dXJlZCwgYW5kIGFuaW1hdGVkLiBNYWRlIGluIE1heWEsIGFuZCByZW5kZXJlZCBpbiBWLVJheS4nLCBzdGFjazogcWJlcnRfc3RhY2ssIG1lZGlhOiBtWzJdLCB0eXBlOiAnQW5pbWF0aW9uJywgdXJsOiAnaHR0cHM6Ly92aW1lby5jb20vMTk4MTQ5Nzk1JyB9LFxyXG4gICAgeyB0aXRsZTogJ0JlZHJvb20nLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL2NnaV9maW5hbF8xLnBuZycsIGRlc2M6ICdUaGlzIGlzIG15IGZpbmFsIGZvciBDR0kgMiBhdCBEcmV4ZWwgVW5pdmVyc2l0eS4gVGhlIGFzc2lnbm1lbnQgd2FzIHRvIHJlY3JlYXRlIGFueSB0eXBlIG9mIHJvb20sIHNvIEkgY2hvc2UgYSBsaXR0bGUgYm95XFwncyByb29tLiBXZSB3ZXJlIHRhc2tlZCB3aXRoIGNyZWF0aW5nIGF0IGxlYXN0IG9uZSBjb21wbGV4IG9iamVjdCwgc28gSSBkZWNpZGVkIHRvIGdvIHdpdGggYSB0cmFpbiBzZXQuJywgc3RhY2s6IHFiZXJ0X3N0YWNrLCBtZWRpYTogbVszXSwgdHlwZTogJzNEIFJlbmRlcicsIHVybDogJycgfV0pO1xyXG5cclxuXHJcbnZhciB3ZWxjb21lX2IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2VsY29tZS1idXR0b24nKTtcclxud2VsY29tZV9iLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBqdW1wKCcjcG9ydGZvbGlvJywge1xyXG4gICAgICAgIGR1cmF0aW9uOiAxMDAwLFxyXG4gICAgICAgIG9mZnNldDogMCxcclxuICAgICAgICBjYWxsYmFjazogdW5kZWZpbmVkLFxyXG4gICAgICAgIGVhc2luZzoganVtcC5lYXNlSW5PdXRRdWFkLFxyXG4gICAgICAgIGFsbHk6IGZhbHNlXHJcbiAgICB9KVxyXG59XHJcblxyXG5cclxuLyoqIFxyXG4gKiBwb3J0Zm9saW8gd2Vic2l0ZVxyXG4gKiBicmVhdGhsZXNzXHJcbiAqIHdlYXRoZXIgd2Vic2l0ZVxyXG4gKiBxYmVydCBhbmltYXRpb25cclxuICogY2dpIDIgZmluYWw/PyBcclxuICogXHJcbiovXHJcblxyXG5cclxuXHJcbndpbmRvdy5vbnJlc2l6ZSA9IChlKSA9PiB7XHJcbiAgICBpZiAoYXBwLmNhbnZhcykge1xyXG4gICAgICAgIGFwcC5zaXplQ2FudmFzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcG9ydGZvbGlvLmFwcGVuZEFsbCgpO1xyXG5cclxufTtcclxuXHJcblxyXG4vLyB2YXIgZG9jV2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub2Zmc2V0V2lkdGg7XHJcblxyXG4vLyBbXS5mb3JFYWNoLmNhbGwoXHJcbi8vICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnKicpLFxyXG4vLyAgIGZ1bmN0aW9uKGVsKSB7XHJcbi8vICAgICBpZiAoZWwub2Zmc2V0V2lkdGggPiBkb2NXaWR0aCkge1xyXG4vLyAgICAgICBjb25zb2xlLmxvZyhlbCk7XHJcbi8vICAgICB9XHJcbi8vICAgfVxyXG4vLyApO1xyXG5cclxuLy8gdmFyIG1lZGlhID0gbmV3IE1lZGlhKCdtZWRpYS0wJywgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9jYXQuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiLCBcIi4vcG9ydGZvbGlvL2NhdC5qcGdcIl0pO1xyXG5cclxuIiwiZXhwb3J0ICogZnJvbSBcIi4vbWVkaWFcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNZWRpYUl0ZW17XHJcbiAgICBtZWRpYTogTWVkaWE7XHJcbiAgICBodG1sOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIG9yZGVyOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihtZWRpYTogTWVkaWEsIGh0bWw6SFRNTERpdkVsZW1lbnQsIG9yZGVyOiBudW1iZXIpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgICAgIHZtLmh0bWwgPSBodG1sO1xyXG4gICAgICAgIHZtLm9yZGVyID0gb3JkZXI7XHJcbiAgICAgICAgdm0uaHRtbC5vbmNsaWNrID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdm0ubWVkaWEubG9hZE1lZGlhKHZtLm9yZGVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNZWRpYSB7XHJcbiAgICBpZDpzdHJpbmdcclxuICAgIGVsZW1lbnRzOiBhbnlbXTtcclxuICAgIHRodW1ibmFpbHM6IEhUTUxJbWFnZUVsZW1lbnRbXTtcclxuICAgIG1lZGlhX2l0ZW1zOiBNZWRpYUl0ZW1bXTtcclxuICAgIHNlbGVjdGVkOiBudW1iZXI7XHJcbiAgICB2aW1lbzpzdHJpbmc7XHJcblxyXG4gICAgcm93OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgb3ZlcmxheTpIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbG1kOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgXHJcbiAgICBtZWRpYV9zZWxlY3RlZDpIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIHRodW1ibmFpbHM6IHN0cmluZ1tdLCBmaWxlcz86IHN0cmluZ1tdLCB2aW1lbz86IHN0cmluZyl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmlkID0gaWQ7XHJcbiAgICAgICAgdm0uc2VsZWN0ZWQgPSAwO1xyXG4gICAgICAgIHZtLmVsZW1lbnRzID0gW107XHJcbiAgICAgICAgdm0ubWVkaWFfaXRlbXMgPSBbXTtcclxuICAgICAgICB2bS50aHVtYm5haWxzID0gW107XHJcblxyXG4gICAgICAgIHZtLnZpbWVvID0gdmltZW87XHJcbiAgICAgICAgaWYodmltZW8pe1xyXG4gICAgICAgICAgICAgICAgdmFyIGZyYWcgPSB2bS5jcmVhdGVGcmFnbWVudCh2aW1lbyk7XHJcbiAgICAgICAgICAgICAgICB2bS5lbGVtZW50cy5wdXNoKGZyYWcpO1xyXG4gICAgICAgICAgICAgICAgLy8gdm0uZWxlbWVudHNbaV0uY2xhc3NMaXN0LmFkZCgnZHJvcHNoYWRvdycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHZtLmVsZW1lbnRzLmxlbmd0aDtcclxuICAgICAgICBpZihmaWxlcyl7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxyXG4gICAgICAgICAgICAgICAgaW1hZ2Uuc3JjID0gZmlsZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpbWFnZS5jbGFzc0xpc3QuYWRkKCdkcm9wc2hhZG93Jyk7XHJcbiAgICAgICAgICAgICAgICB2bS5lbGVtZW50cy5wdXNoKGltYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5tZWRpYV9zZWxlY3RlZC5pZCA9ICdtZWRpYS1zZWxlY3RlZCc7XHJcblxyXG4gICAgICAgIHZtLm92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5vdmVybGF5LmNsYXNzTGlzdC5hZGQoJ292ZXJsYXktbWVkaWEnKTtcclxuXHJcbiAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQuYXBwZW5kQ2hpbGQodm0ub3ZlcmxheSk7XHJcblxyXG4gICAgICAgIHZtLnJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnJvdy5jbGFzc0xpc3QuYWRkKCdyb3cnLCdqdXN0aWZ5LWNlbnRlcicsJ21lZGlhLWNvbnRhaW5lcicpO1xyXG5cclxuICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgdm0uZWxlbWVudHMubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgICAgICB2bS5jb2xtZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICB2bS5jb2xtZC5jbGFzc0xpc3QuYWRkKCdjb2wteHMnKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBodG1sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICAgICAgaHRtbC5jbGFzc0xpc3QuYWRkKCdtZWRpYS1pdGVtJyk7XHJcbiAgICAgICAgICAgIHZhciBtZWRpYV9pdGVtID0gbmV3IE1lZGlhSXRlbSh2bSxodG1sLGopO1xyXG4gICAgICAgICAgICB2bS5tZWRpYV9pdGVtcy5wdXNoKG1lZGlhX2l0ZW0pO1xyXG5cclxuICAgICAgICAgICAgdm0udGh1bWJuYWlscy5wdXNoKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpKTtcclxuICAgICAgICAgICAgdm0udGh1bWJuYWlsc1tqXS5jbGFzc0xpc3QuYWRkKCdkcm9wc2hhZG93Jyk7XHJcbiAgICAgICAgICAgIHZtLnRodW1ibmFpbHNbal0uc3JjID0gdGh1bWJuYWlsc1tqXTtcclxuXHJcbiAgICAgICAgICAgIHZtLmNvbG1kLmFwcGVuZENoaWxkKHZtLm1lZGlhX2l0ZW1zW2pdLmh0bWwpO1xyXG4gICAgICAgICAgICB2bS5jb2xtZC5hcHBlbmRDaGlsZCh2bS50aHVtYm5haWxzW2pdKTtcclxuICAgICAgICAgICAgdm0ucm93LmFwcGVuZENoaWxkKHZtLmNvbG1kKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICAgICAgICNtZWRpYS1zZWxlY3RlZFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAub3ZlcmxheVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICBpbWcoc3JjPVwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIikuZHJvcHNoYWRvd1xyXG4gICAgICAgIC8vICAgICAgICAgIC5yb3cuanVzdGlmeS1jZW50ZXIubWVkaWEtY29udGFpbmVyXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIC5jb2wtbWRcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIC5tZWRpYS1pdGVtXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICBpbWcoc3JjPVwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIikuZHJvcHNoYWRvd1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAuY29sLW1kXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAubWVkaWEtaXRlbVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpLmRyb3BzaGFkb3dcclxuXHJcblxyXG4gICAgICAgIHZtLm1lZGlhX2l0ZW1zW3ZtLnNlbGVjdGVkXS5odG1sLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgLy8gdm0uZWxlbWVudHMucHVzaCh2bS5lbGVtZW50c1swXSk7XHJcbiAgICAgICAgLy8gdm0uZWxlbWVudHMuc2hpZnQoKTtcclxuICAgICAgICAvLyB2bS5zZXRJZChpZCk7XHJcbiAgICAgICAgLy8gdm0ubG9hZE1lZGlhKDApO1xyXG5cclxuICAgIH1cclxuICAgIGNyZWF0ZUZyYWdtZW50KHN0cjogc3RyaW5nLCB3aWR0aD86IG51bWJlciwgaGVpZ2h0PzogbnVtYmVyICkge1xyXG4gICAgICAgIHZhciBuZXdzdHIgPSBzdHI7XHJcbiAgICAgICAgaWYod2lkdGgpe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbmV3c3RyID0gc3RyLnJlcGxhY2UoJ3dpZHRoPVwiXFxkK1wiIGhlaWdodD1cIlxcZCtcIicsICd3aWR0aD1cIicrd2lkdGgrJ1wiIGhlaWdodD1cIicraGVpZ2h0KydcIicpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG5cclxuICAgICAgICB2YXIgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGVsZW0uaW5uZXJIVE1MID0gc3RyO1xyXG5cclxuICAgICAgICB3aGlsZSAoZWxlbS5jaGlsZE5vZGVzWzBdKSB7XHJcbiAgICAgICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoZWxlbS5jaGlsZE5vZGVzWzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZyYWc7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SWQoaWQ6IHN0cmluZyl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZhciBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgd2hpbGUocGFyZW50LmZpcnN0Q2hpbGQpe1xyXG4gICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQocGFyZW50LmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodm0ubWVkaWFfc2VsZWN0ZWQpO1xyXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh2bS5yb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIHNpemUoKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ub3ZlcmxheS5zdHlsZS53aWR0aCA9ICh2bS5tZWRpYV9zZWxlY3RlZC5jbGllbnRXaWR0aCsxMikrJ3B4JztcclxuICAgICAgICB2bS5vdmVybGF5LnN0eWxlLmhlaWdodCA9ICh2bS5tZWRpYV9zZWxlY3RlZC5jbGllbnRIZWlnaHQrOCkrJ3B4JztcclxuICAgIH1cclxuXHJcbiAgICBsb2FkTWVkaWEodGh1bWJfbnVtOm51bWJlcil7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgLy8gdm0ubWVkaWFfc2VsZWN0ZWQucmVtb3ZlQ2hpbGQodm0ubWVkaWFfc2VsZWN0ZWQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgdm0ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdjbG9zZS1tZWRpYScpO1xyXG5cclxuICAgICAgICB2bS5zaXplKCk7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB2bS5tZWRpYV9pdGVtcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhX2l0ZW1zW2ldLmh0bWwuc3R5bGUud2lkdGggPSB2bS5jb2xtZC5jbGllbnRXaWR0aCsncHgnO1xyXG4gICAgICAgICAgICB2bS5tZWRpYV9pdGVtc1tpXS5odG1sLnN0eWxlLmhlaWdodCA9IHZtLmNvbG1kLmNsaWVudEhlaWdodCsncHgnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodm0udmltZW8gJiYgdGh1bWJfbnVtID09PSAwKXtcclxuICAgICAgICAgICAgICAgIHZtLmVsZW1lbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZnJhZyA9IHZtLmNyZWF0ZUZyYWdtZW50KHZtLnZpbWVvLCB2bS5tZWRpYV9zZWxlY3RlZC5jbGllbnRXaWR0aCwgdm0ubWVkaWFfc2VsZWN0ZWQuY2xpZW50SGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIHZtLmVsZW1lbnRzLnVuc2hpZnQoZnJhZyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdm0ub3ZlcmxheS5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5lbGVtZW50c1tpXS5jbGFzc0xpc3QuYWRkKCdkcm9wc2hhZG93Jyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdm0ub3ZlcmxheS5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8qYnV0dG9uIHRyYW5zaXRpb24qL1xyXG4gICAgICAgIHZtLm1lZGlhX2l0ZW1zW3ZtLnNlbGVjdGVkXS5odG1sLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgdm0uc2VsZWN0ZWQgPSB0aHVtYl9udW07XHJcbiAgICAgICAgdm0ubWVkaWFfaXRlbXNbdm0uc2VsZWN0ZWRdLmh0bWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgICAgLypwaWN0dXJlIHRyYW5zaXRpb24qL1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgIC8vIGlmKHZtLnZpbWVvICYmIHZtLnNlbGVjdGVkID09PSAwKXtcclxuXHJcbiAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh2bS5tZWRpYV9zZWxlY3RlZC5jaGlsZHJlbi5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIHZtLm1lZGlhX3NlbGVjdGVkLnJlbW92ZUNoaWxkKHZtLm1lZGlhX3NlbGVjdGVkLmxhc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZtLm1lZGlhX3NlbGVjdGVkLmFwcGVuZENoaWxkKHZtLmVsZW1lbnRzW3ZtLnNlbGVjdGVkXSk7XHJcbiAgICAgICAgICAgIHZtLm92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZSgnY2xvc2UtbWVkaWEnKTtcclxuICAgICAgICAgICAgdm0ubWVkaWFfaXRlbXNbdm0uc2VsZWN0ZWRdLmh0bWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcclxuICAgICAgICB9LCA2MDApOyAgIFxyXG4gICAgfVxyXG59IiwiZXhwb3J0ICogZnJvbSBcIi4vc2tpbGxfYmFkZ2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTa2lsbCB7XHJcbiAgZmxleF9pdGVtOiBIVE1MRGl2RWxlbWVudDtcclxuICBzdmc6IFNWR1NWR0VsZW1lbnQ7XHJcbiAgc3ZnX2NpcmNsZTogU1ZHQ2lyY2xlRWxlbWVudDtcclxuICBzY2FsZV9ib3g6IEhUTUxEaXZFbGVtZW50O1xyXG4gIGltYWdlOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gIHRleHQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gIGZsZXhfZ3JpZF9pZDogc3RyaW5nO1xyXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgY2xhc3NwZXJjZW50OiBzdHJpbmcsIGltYWdlOiBzdHJpbmcsIGZsZXhfZ3JpZF9pZDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgdm0uZmxleF9ncmlkX2lkID0gZmxleF9ncmlkX2lkO1xyXG5cclxuICAgIHZtLmZsZXhfaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdm0uZmxleF9pdGVtLmNsYXNzTmFtZSArPSAnZmxleC1pdGVtJztcclxuXHJcbiAgICB2bS5zdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInN2Z1wiKVxyXG4gICAgdm0uc3ZnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbGFzc3BlcmNlbnQpXHJcbiAgICB2bS5zdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsICc4NCcpO1xyXG4gICAgdm0uc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzg0Jyk7XHJcblxyXG4gICAgdm0uc3ZnX2NpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdjaXJjbGUnKTtcclxuICAgIHZtLnN2Z19jaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2NsYXNzJywgJ291dGVyJyk7XHJcbiAgICB2bS5zdmdfY2lyY2xlLnNldEF0dHJpYnV0ZU5TKG51bGwsIFwiY3hcIiwgJy00MicpO1xyXG4gICAgdm0uc3ZnX2NpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCBcImN5XCIsICc0MicpO1xyXG4gICAgdm0uc3ZnX2NpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCBcInJcIiwgJzM3Jyk7XHJcbiAgICB2bS5zdmdfY2lyY2xlLnNldEF0dHJpYnV0ZU5TKG51bGwsIFwidHJhbnNmb3JtXCIsIFwicm90YXRlKC05MCwgMCwgMClcIik7XHJcblxyXG4gICAgdm0uc2NhbGVfYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBpZiAobmFtZSA9PT0gXCJUeXBlIFNjcmlwdFwiIHx8IG5hbWUgPT09IFwiQm9vdHN0cmFwXCIgfHwgbmFtZSA9PT0gXCJEMy5qc1wiIHx8IG5hbWUgPT09IFwiUGhvdG9zaG9wXCIgfHwgbmFtZSA9PT0gXCJJbGx1c3RyYXRvclwiIHx8IG5hbWUgPT09IFwiQWZ0ZXIgRWZmZWN0c1wiIHx8IG5hbWUgPT09IFwiTWF5YVwiIHx8IG5hbWUgPT09IFwiTXVkYm94XCIpIHtcclxuICAgICAgdm0uc2NhbGVfYm94LmNsYXNzTmFtZSArPSAnc2NhbGUtYm94LXNxdWFyZSc7XHJcbiAgICB9IGVsc2UgaWYgKG5hbWUgPT09IFwiVW5pdHlcIiB8fCBuYW1lID09PSBcIlBoYXNlci5qc1wiIHx8IG5hbWUgPT09IFwiRDMuanNcIiB8fCBuYW1lID09PSBcIlNDU1NcIiB8fCBuYW1lID09PSBcIkphdmFcIiB8fCBuYW1lID09PSBcIlB5dGhvblwiKSB7XHJcbiAgICAgIHZtLnNjYWxlX2JveC5jbGFzc05hbWUgKz0gJ3NjYWxlLWJveC1taWQnO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHZtLnNjYWxlX2JveC5jbGFzc05hbWUgKz0gJ3NjYWxlLWJveCc7XHJcbiAgICB9XHJcblxyXG4gICAgdm0uaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgIHZtLmltYWdlLnNyYyA9IGltYWdlO1xyXG5cclxuICAgIHZtLnRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHZtLnRleHQuY2xhc3NOYW1lICs9ICd0ZXh0JztcclxuICAgIHZtLnRleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmFtZSkpO1xyXG5cclxuICAgIC8vIC5mbGV4LWl0ZW1cclxuICAgIC8vICAgICAgIHN2Zy5jaXJjbGUtNzUod2lkdGg9Jzg0JywgaGVpZ2h0PSc4NCcpXHJcbiAgICAvLyAgICAgICAgIGNpcmNsZS5vdXRlcihjeD0nLTQyJywgY3k9JzQyJywgcj0nMzcnIHRyYW5zZm9ybT1cInJvdGF0ZSgtOTAsIDAsIDApXCIpIFxyXG4gICAgLy8gICAgICAgLnNjYWxlLWJveFxyXG4gICAgLy8gICAgICAgICBpbWcoaWQ9XCJmb3VyXCIpXHJcbiAgICAvLyAgICAgICAgIC50ZXh0IGFiY1xyXG4gICAgdm0uZmxleF9pdGVtLmFwcGVuZENoaWxkKHZtLnN2Zyk7XHJcbiAgICB2bS5zdmcuYXBwZW5kQ2hpbGQodm0uc3ZnX2NpcmNsZSk7XHJcbiAgICB2bS5mbGV4X2l0ZW0uYXBwZW5kQ2hpbGQodm0uc2NhbGVfYm94KTtcclxuICAgIHZtLnNjYWxlX2JveC5hcHBlbmRDaGlsZCh2bS5pbWFnZSk7XHJcbiAgICB2bS5mbGV4X2l0ZW0uYXBwZW5kQ2hpbGQodm0udGV4dCk7XHJcbiAgfVxyXG4gIHJlc2V0SWQoaWQ6IHN0cmluZyl7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2bS5mbGV4X2dyaWRfaWQgPSBpZDtcclxuICB9XHJcblxyXG4gIGFwcGVuZCgpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZhciBmbGV4X2dyaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh2bS5mbGV4X2dyaWRfaWQpO1xyXG4gICAgZmxleF9ncmlkLmFwcGVuZENoaWxkKHZtLmZsZXhfaXRlbSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTa2lsbEluZm8ge1xyXG4gIG5hbWU6IHN0cmluZztcclxuICBjbGFzczogc3RyaW5nO1xyXG4gIGltYWdlOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xsZWN0aW9uIHtcclxuICBpZDogc3RyaW5nO1xyXG4gIGltYWdlczogSVNraWxsSW5mb1tdO1xyXG4gIHBhdGg6IHN0cmluZztcclxuICBza2lsbHM6IFNraWxsW107XHJcbiAgZmxleF9ncmlkX2lkOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZywgZmxleF9ncmlkX2lkOiBzdHJpbmcsIGltYWdlczogSVNraWxsSW5mb1tdLCBpZD86IHN0cmluZykge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgXHJcbiAgICB2bS5pbWFnZXMgPSBpbWFnZXM7XHJcbiAgICB2bS5wYXRoID0gcGF0aDtcclxuICAgIHZtLmZsZXhfZ3JpZF9pZCA9IGZsZXhfZ3JpZF9pZDtcclxuXHJcbiAgICB2bS5za2lsbHMgPSBbXTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGltYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2bS5za2lsbHMucHVzaChuZXcgU2tpbGwoaW1hZ2VzW2ldLm5hbWUsIGltYWdlc1tpXS5jbGFzcywgdm0ucGF0aCArIGltYWdlc1tpXS5pbWFnZSwgdm0uZmxleF9ncmlkX2lkKSk7XHJcbiAgICB9XHJcbiAgICBpZihpZCl7XHJcbiAgICAgIHZtLmlkID0gaWQ7XHJcbiAgICAgIHZhciBlbGVtZW50ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHZtLmlkKTtcclxuICAgICAgZWxlbWVudC5vbm1vdXNldXAgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZtLmxvYWQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlc2V0SWRzKGlkOiBzdHJpbmcpe1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdm0uZmxleF9ncmlkX2lkID0gaWQ7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLnNraWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2bS5za2lsbHNbaV0ucmVzZXRJZCh2bS5mbGV4X2dyaWRfaWQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGxvYWQoKSB7IC8vc2V0cyBzcmMncyB0byB0aGUgZG9tLiB0aGVuIG9uY2UgZXZlcnl0aGluZyBpcyBsb2FkZWQsIGl0IGFkZHMgY2xhc3MgYWN0aXZlIHRvIG1ha2UgdGhlbSBhcHBlYXIgdmlhIGNzc1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdmFyIGZsZXhfZ3JpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHZtLmZsZXhfZ3JpZF9pZCk7XHJcbiAgICB3aGlsZSAoZmxleF9ncmlkLmZpcnN0Q2hpbGQpIHtcclxuICAgICAgZmxleF9ncmlkLnJlbW92ZUNoaWxkKGZsZXhfZ3JpZC5maXJzdENoaWxkKTtcclxuICAgIH1cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uc2tpbGxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZtLnNraWxsc1tpXS5hcHBlbmQoKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gcHVibGljIGNsb3NlKCl7XHJcbiAgLy8gICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgLy8gICB2YXIgZmxleF9ncmlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodm0uZmxleF9ncmlkX2lkKTtcclxuICAvLyAgIHdoaWxlIChmbGV4X2dyaWQuZmlyc3RDaGlsZCkge1xyXG4gIC8vICAgICBmbGV4X2dyaWQucmVtb3ZlQ2hpbGQoZmxleF9ncmlkLmZpcnN0Q2hpbGQpO1xyXG4gIC8vICAgfVxyXG4gIC8vIH1cclxufVxyXG4iXX0=
