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
    { "name": 'Bootstrap', "class": 'circle-100', "image": 'bootstrap-4.svg' },
    { "name": 'Angular JS', "class": 'circle-75', "image": 'angular-icon.svg' },
    { "name": 'Type Script', "class": 'circle-75', "image": 'typescript.svg' },
    { "name": 'Gulp', "class": 'circle-75', "image": 'gulp.svg' },
    { "name": 'CSS3', "class": 'circle-50', "image": 'css-3.svg' },
    { "name": 'jQuery', "class": 'circle-50', "image": 'jquery-1.svg' },
    { "name": 'SCSS', "class": 'circle-50', "image": 'sass-1.svg' },
    { "name": 'D3.js', "class": 'circle-25', "image": 'd3-2.svg' }], 'frontend');
var softeng = new skill_badge.Collection('./skills/', 'flex-grid2', [{ "name": 'Java', "class": 'circle-75', "image": 'java-14.svg' },
    { "name": 'Unity', "class": 'circle-75', "image": 'unity.svg' },
    { "name": 'C++', "class": 'circle-75', "image": 'c-seeklogo.com.svg' },
    { "name": 'C#', "class": 'circle-50', "image": 'csharp.svg' },
    { "name": 'Python', "class": 'circle-50', "image": 'python-5.svg' },
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
var roast_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Angular JS', "class": 'circle-100', "image": 'angular-icon.svg' },
    { "name": 'D3.js', "class": 'circle-75', "image": 'd3-2.svg' }
]);
// var breathless_media = new media.Media('media-0', ["./portfolio/breathless.jpg","./portfolio/breathless.jpg","./portfolio/cat.jpg"], ["./portfolio/breathless.jpg","./portfolio/cat.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
var m = [];
m.push(new media.Media('', ["./portfolio/rem_5.png", "./portfolio/rem_3.png", "./portfolio/rem_2.png", "./portfolio/rem_4.png"], ["./portfolio/rem_3.png", "./portfolio/rem_2.png", "./portfolio/rem_4.png"], '<iframe src="https://player.vimeo.com/video/252436989" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"], ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"]));
m.push(new media.Media('', ["./portfolio/qbert_play.jpg", "./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], ["./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"], ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"]));
m.push(new media.Media('', ['./portfolio/mean_forecast_1.jpg', './portfolio/mean_forecast_2.jpg'], ['./portfolio/mean_forecast_1.jpg', './portfolio/mean_forecast_2.jpg']));
m.push(new media.Media('', ['./portfolio/roast_6.png', './portfolio/roast_2.png', './portfolio/roast_3.png', './portfolio/roast_4.png'], ['./portfolio/roast_6.png', './portfolio/roast_2.png', './portfolio/roast_3.png', './portfolio/roast_4.png']));
var portfolio = new Portfolio('portfolio', [
    { title: 'Rem', title_image: './portfolio/rememberence_logo.jpg', desc: "Rem is a video game about a young girl trapped in a comatose dreamscape. You play as a young girl who must overcome her fears to remember her past. In this fun, over-the-shoulder stealth game you must avoid screen headed enemies, and to find mementos of your past. For this project I worked in many areas including Web Development, Level Design, Modeling, and Documentation.", stack: rem_stack, media: m[0], type: 'Unity Game', url: 'http://offbrandhell.games/#/home' },
    { title: 'Roast', title_image: './portfolio/roast_7.jpg', desc: "Roast is a webapp that surveys comfort in an indoor space. It asks questions that gauge temperature, noise, smell, and humidity, and maps it to where you are on your building's floorplan. Through this crowd sourced data collected, building managers, architects and the people taking the survey can understand how people feel in a space. I worked on this project for 6 months while I was at the architecture firm, Kieran Timberlake.", stack: roast_stack, media: m[5], type: 'Web App', url: '' },
    { title: 'Breathless', title_image: './portfolio/breathless.jpg', desc: "The Space Pirate, Aria, is on a mission to loot a mineral cargo ship. However, upon landing on the cargo ship, Aria's helmet cracks causing her to slowly lose oxygen. It's now a race against time to collect all the gems before her oxygen runs out!", stack: breathless_stack, media: m[1], type: 'HTML5 Game', url: '/breathless' },
    { title: 'Mean Forecast', title_image: './portfolio/mean_forecast_1.jpg', desc: 'A small web app that calculates the average of 3 weather API\'s: Wunderground, Forecast.io, and World Weather Online. This data is then served onto a D3.js Line Chart for temperature, humidty, and windspeed. Also the webapp itself has many subtleties that are affected by weather data. For example, the video  resembles the current weather. Also each graph is color coated by a gradient based on the weather data.', stack: weather_stack, media: m[4], type: 'Website', url: '/meanforecast' },
    { title: 'Q*Bert', title_image: "./portfolio/qbert_play.jpg", desc: 'This is my Bouncing Ball Assignment for Animation 1 at Drexel University. When picking a game that mixes my love of retro video games and bouncing balls, Q*Bert was a no-brainer. Everything is individually modelled, textured, and animated by me. Made in Maya, and rendered in V-Ray.', stack: qbert_stack, media: m[2], type: 'Animation', url: 'https://vimeo.com/198149795' },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvanVtcC5qcy9kaXN0L2p1bXAuanMiLCJzcmMvaW1hZ2VfY2FudmFzLnRzIiwic3JjL21haW4udHMiLCJzcmMvbWVkaWEudHMiLCJzcmMvc2tpbGxfYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxTCxDQUFDO1FBRUQsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBR25CLENBQUM7SUFFTSw2QkFBUyxHQUFoQjtRQUNJLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBRXBDLHFDQUFxQztRQUNyQyxJQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNVAsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFF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QUMsVUFBVSxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUNELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMxQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3hCLENBQUM7SUFDSCxDQUFDO0lBUUgsaUJBQUM7QUFBRCxDQXJEQSxBQXFEQyxJQUFBO0FBckRZLGdDQUFVIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGdsb2JhbC5KdW1wID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4vLyBSb2JlcnQgUGVubmVyJ3MgZWFzZUluT3V0UXVhZFxuXG4vLyBmaW5kIHRoZSByZXN0IG9mIGhpcyBlYXNpbmcgZnVuY3Rpb25zIGhlcmU6IGh0dHA6Ly9yb2JlcnRwZW5uZXIuY29tL2Vhc2luZy9cbi8vIGZpbmQgdGhlbSBleHBvcnRlZCBmb3IgRVM2IGNvbnN1bXB0aW9uIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qYXhnZWxsZXIvZXouanNcblxudmFyIGVhc2VJbk91dFF1YWQgPSBmdW5jdGlvbiBlYXNlSW5PdXRRdWFkKHQsIGIsIGMsIGQpIHtcbiAgdCAvPSBkIC8gMjtcbiAgaWYgKHQgPCAxKSByZXR1cm4gYyAvIDIgKiB0ICogdCArIGI7XG4gIHQtLTtcbiAgcmV0dXJuIC1jIC8gMiAqICh0ICogKHQgLSAyKSAtIDEpICsgYjtcbn07XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqO1xufSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG59O1xuXG52YXIganVtcGVyID0gZnVuY3Rpb24ganVtcGVyKCkge1xuICAvLyBwcml2YXRlIHZhcmlhYmxlIGNhY2hlXG4gIC8vIG5vIHZhcmlhYmxlcyBhcmUgY3JlYXRlZCBkdXJpbmcgYSBqdW1wLCBwcmV2ZW50aW5nIG1lbW9yeSBsZWFrc1xuXG4gIHZhciBlbGVtZW50ID0gdm9pZCAwOyAvLyBlbGVtZW50IHRvIHNjcm9sbCB0byAgICAgICAgICAgICAgICAgICAobm9kZSlcblxuICB2YXIgc3RhcnQgPSB2b2lkIDA7IC8vIHdoZXJlIHNjcm9sbCBzdGFydHMgICAgICAgICAgICAgICAgICAgIChweClcbiAgdmFyIHN0b3AgPSB2b2lkIDA7IC8vIHdoZXJlIHNjcm9sbCBzdG9wcyAgICAgICAgICAgICAgICAgICAgIChweClcblxuICB2YXIgb2Zmc2V0ID0gdm9pZCAwOyAvLyBhZGp1c3RtZW50IGZyb20gdGhlIHN0b3AgcG9zaXRpb24gICAgICAocHgpXG4gIHZhciBlYXNpbmcgPSB2b2lkIDA7IC8vIGVhc2luZyBmdW5jdGlvbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbilcbiAgdmFyIGExMXkgPSB2b2lkIDA7IC8vIGFjY2Vzc2liaWxpdHkgc3VwcG9ydCBmbGFnICAgICAgICAgICAgIChib29sZWFuKVxuXG4gIHZhciBkaXN0YW5jZSA9IHZvaWQgMDsgLy8gZGlzdGFuY2Ugb2Ygc2Nyb2xsICAgICAgICAgICAgICAgICAgICAgKHB4KVxuICB2YXIgZHVyYXRpb24gPSB2b2lkIDA7IC8vIHNjcm9sbCBkdXJhdGlvbiAgICAgICAgICAgICAgICAgICAgICAgIChtcylcblxuICB2YXIgdGltZVN0YXJ0ID0gdm9pZCAwOyAvLyB0aW1lIHNjcm9sbCBzdGFydGVkICAgICAgICAgICAgICAgICAgICAobXMpXG4gIHZhciB0aW1lRWxhcHNlZCA9IHZvaWQgMDsgLy8gdGltZSBzcGVudCBzY3JvbGxpbmcgdGh1cyBmYXIgICAgICAgICAgKG1zKVxuXG4gIHZhciBuZXh0ID0gdm9pZCAwOyAvLyBuZXh0IHNjcm9sbCBwb3NpdGlvbiAgICAgICAgICAgICAgICAgICAocHgpXG5cbiAgdmFyIGNhbGxiYWNrID0gdm9pZCAwOyAvLyB0byBjYWxsIHdoZW4gZG9uZSBzY3JvbGxpbmcgICAgICAgICAgICAoZnVuY3Rpb24pXG5cbiAgLy8gc2Nyb2xsIHBvc2l0aW9uIGhlbHBlclxuXG4gIGZ1bmN0aW9uIGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB3aW5kb3cuc2Nyb2xsWSB8fCB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gIH1cblxuICAvLyBlbGVtZW50IG9mZnNldCBoZWxwZXJcblxuICBmdW5jdGlvbiB0b3AoZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHN0YXJ0O1xuICB9XG5cbiAgLy8gckFGIGxvb3AgaGVscGVyXG5cbiAgZnVuY3Rpb24gbG9vcCh0aW1lQ3VycmVudCkge1xuICAgIC8vIHN0b3JlIHRpbWUgc2Nyb2xsIHN0YXJ0ZWQsIGlmIG5vdCBzdGFydGVkIGFscmVhZHlcbiAgICBpZiAoIXRpbWVTdGFydCkge1xuICAgICAgdGltZVN0YXJ0ID0gdGltZUN1cnJlbnQ7XG4gICAgfVxuXG4gICAgLy8gZGV0ZXJtaW5lIHRpbWUgc3BlbnQgc2Nyb2xsaW5nIHNvIGZhclxuICAgIHRpbWVFbGFwc2VkID0gdGltZUN1cnJlbnQgLSB0aW1lU3RhcnQ7XG5cbiAgICAvLyBjYWxjdWxhdGUgbmV4dCBzY3JvbGwgcG9zaXRpb25cbiAgICBuZXh0ID0gZWFzaW5nKHRpbWVFbGFwc2VkLCBzdGFydCwgZGlzdGFuY2UsIGR1cmF0aW9uKTtcblxuICAgIC8vIHNjcm9sbCB0byBpdFxuICAgIHdpbmRvdy5zY3JvbGxUbygwLCBuZXh0KTtcblxuICAgIC8vIGNoZWNrIHByb2dyZXNzXG4gICAgdGltZUVsYXBzZWQgPCBkdXJhdGlvbiA/IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCkgLy8gY29udGludWUgc2Nyb2xsIGxvb3BcbiAgICA6IGRvbmUoKTsgLy8gc2Nyb2xsaW5nIGlzIGRvbmVcbiAgfVxuXG4gIC8vIHNjcm9sbCBmaW5pc2hlZCBoZWxwZXJcblxuICBmdW5jdGlvbiBkb25lKCkge1xuICAgIC8vIGFjY291bnQgZm9yIHJBRiB0aW1lIHJvdW5kaW5nIGluYWNjdXJhY2llc1xuICAgIHdpbmRvdy5zY3JvbGxUbygwLCBzdGFydCArIGRpc3RhbmNlKTtcblxuICAgIC8vIGlmIHNjcm9sbGluZyB0byBhbiBlbGVtZW50LCBhbmQgYWNjZXNzaWJpbGl0eSBpcyBlbmFibGVkXG4gICAgaWYgKGVsZW1lbnQgJiYgYTExeSkge1xuICAgICAgLy8gYWRkIHRhYmluZGV4IGluZGljYXRpbmcgcHJvZ3JhbW1hdGljIGZvY3VzXG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcblxuICAgICAgLy8gZm9jdXMgdGhlIGVsZW1lbnRcbiAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICAvLyBpZiBpdCBleGlzdHMsIGZpcmUgdGhlIGNhbGxiYWNrXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG5cbiAgICAvLyByZXNldCB0aW1lIGZvciBuZXh0IGp1bXBcbiAgICB0aW1lU3RhcnQgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIEFQSVxuXG4gIGZ1bmN0aW9uIGp1bXAodGFyZ2V0KSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgLy8gcmVzb2x2ZSBvcHRpb25zLCBvciB1c2UgZGVmYXVsdHNcbiAgICBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb24gfHwgMTAwMDtcbiAgICBvZmZzZXQgPSBvcHRpb25zLm9mZnNldCB8fCAwO1xuICAgIGNhbGxiYWNrID0gb3B0aW9ucy5jYWxsYmFjazsgLy8gXCJ1bmRlZmluZWRcIiBpcyBhIHN1aXRhYmxlIGRlZmF1bHQsIGFuZCB3b24ndCBiZSBjYWxsZWRcbiAgICBlYXNpbmcgPSBvcHRpb25zLmVhc2luZyB8fCBlYXNlSW5PdXRRdWFkO1xuICAgIGExMXkgPSBvcHRpb25zLmExMXkgfHwgZmFsc2U7XG5cbiAgICAvLyBjYWNoZSBzdGFydGluZyBwb3NpdGlvblxuICAgIHN0YXJ0ID0gbG9jYXRpb24oKTtcblxuICAgIC8vIHJlc29sdmUgdGFyZ2V0XG4gICAgc3dpdGNoICh0eXBlb2YgdGFyZ2V0ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZih0YXJnZXQpKSB7XG4gICAgICAvLyBzY3JvbGwgZnJvbSBjdXJyZW50IHBvc2l0aW9uXG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBlbGVtZW50ID0gdW5kZWZpbmVkOyAvLyBubyBlbGVtZW50IHRvIHNjcm9sbCB0b1xuICAgICAgICBhMTF5ID0gZmFsc2U7IC8vIG1ha2Ugc3VyZSBhY2Nlc3NpYmlsaXR5IGlzIG9mZlxuICAgICAgICBzdG9wID0gc3RhcnQgKyB0YXJnZXQ7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBzY3JvbGwgdG8gZWxlbWVudCAobm9kZSlcbiAgICAgIC8vIGJvdW5kaW5nIHJlY3QgaXMgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBlbGVtZW50ID0gdGFyZ2V0O1xuICAgICAgICBzdG9wID0gdG9wKGVsZW1lbnQpO1xuICAgICAgICBicmVhaztcblxuICAgICAgLy8gc2Nyb2xsIHRvIGVsZW1lbnQgKHNlbGVjdG9yKVxuICAgICAgLy8gYm91bmRpbmcgcmVjdCBpcyByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnRcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG4gICAgICAgIHN0b3AgPSB0b3AoZWxlbWVudCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIHJlc29sdmUgc2Nyb2xsIGRpc3RhbmNlLCBhY2NvdW50aW5nIGZvciBvZmZzZXRcbiAgICBkaXN0YW5jZSA9IHN0b3AgLSBzdGFydCArIG9mZnNldDtcblxuICAgIC8vIHJlc29sdmUgZHVyYXRpb25cbiAgICBzd2l0Y2ggKF90eXBlb2Yob3B0aW9ucy5kdXJhdGlvbikpIHtcbiAgICAgIC8vIG51bWJlciBpbiBtc1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uO1xuICAgICAgICBicmVhaztcblxuICAgICAgLy8gZnVuY3Rpb24gcGFzc2VkIHRoZSBkaXN0YW5jZSBvZiB0aGUgc2Nyb2xsXG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbihkaXN0YW5jZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIHN0YXJ0IHRoZSBsb29wXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgfVxuXG4gIC8vIGV4cG9zZSBvbmx5IHRoZSBqdW1wIG1ldGhvZFxuICByZXR1cm4ganVtcDtcbn07XG5cbi8vIGV4cG9ydCBzaW5nbGV0b25cblxudmFyIHNpbmdsZXRvbiA9IGp1bXBlcigpO1xuXG5yZXR1cm4gc2luZ2xldG9uO1xuXG59KSkpO1xuIiwiXHJcbmV4cG9ydCAqIGZyb20gXCIuL2ltYWdlX2NhbnZhc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsZXJwKGZyb206IG51bWJlciwgdG86IG51bWJlciwgcGVyY2VudDogbnVtYmVyKSB7XHJcbiAgdmFyIGRpZmZlcmFuY2UgPSB0byAtIGZyb207XHJcbiAgcmV0dXJuIGZyb20gKyAoZGlmZmVyYW5jZSAqIHBlcmNlbnQpO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEltZyB7XHJcbiAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICBpbWFnZTogSFRNTEltYWdlRWxlbWVudFxyXG4gIHc6IG51bWJlcjtcclxuICBoOiBudW1iZXI7XHJcbiAgeF9vZmZzZXRfZGVzdDogbnVtYmVyO1xyXG4gIHlfb2Zmc2V0X2Rlc3Q6IG51bWJlcjtcclxuICB4X29mZnNldDogbnVtYmVyO1xyXG4gIHlfb2Zmc2V0OiBudW1iZXI7XHJcbiAgYW5jaG9yWDogbnVtYmVyO1xyXG4gIGFuY2hvclk6IG51bWJlcjtcclxuXHJcbiAgaW1nV2lkdGg6IG51bWJlcjtcclxuICBzY3JlZW5XaWR0aDogbnVtYmVyO1xyXG4gIHNjYWxlWDogbnVtYmVyO1xyXG4gIHNjYWxlWTogbnVtYmVyO1xyXG4gIHNjYWxlOiBudW1iZXI7XHJcbiAgaW1nSGVpZ2h0OiBudW1iZXI7XHJcbiAgc2NyZWVuSGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gIGxvYWRlZDogYm9vbGVhbjtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2bS5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIHZtLmN0eCA9IHZtLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgdm0udyA9IHZtLmNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgdm0uaCA9IHZtLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB2bS5pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgdm0uaW1hZ2Uuc3JjID0gJ2NpdHkuanBnJztcclxuICAgIHZtLmxvYWRlZCA9IGZhbHNlO1xyXG5cclxuICAgIHZtLmltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdm0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgdm0uc2l6ZSh2bS53LCB2bS5oKTtcclxuICAgICAgdm0uZHJhdygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHNpemUodywgaCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgIHZtLncgPSB2bS5jYW52YXMud2lkdGggPSB3O1xyXG4gICAgdm0uaCA9IHZtLmNhbnZhcy5oZWlnaHQgPSBoO1xyXG5cclxuICAgIC8qZ2V0cyBzY2FsZVggYmFzZWQgb24gc2NyZWVuIGFuZCBpbWFnZSB3aWR0aCAqL1xyXG4gICAgdm0uaW1nV2lkdGggPSB2bS5pbWFnZS5uYXR1cmFsV2lkdGg7XHJcbiAgICB2bS5zY3JlZW5XaWR0aCA9IHc7XHJcbiAgICB2bS5zY2FsZVggPSB2bS5zY3JlZW5XaWR0aCAvIHZtLmltZ1dpZHRoO1xyXG5cclxuICAgIC8qZ2V0cyBzY2FsZVkgYmFzZWQgb24gc2NyZWVuIGFuZCBpbWFnZSB3aWR0aCAqL1xyXG4gICAgdm0uaW1nSGVpZ2h0ID0gdm0uaW1hZ2UubmF0dXJhbEhlaWdodDtcclxuICAgIHZtLnNjcmVlbkhlaWdodCA9IGg7XHJcbiAgICB2bS5zY2FsZVkgPSB2bS5zY3JlZW5IZWlnaHQgLyB2bS5pbWdIZWlnaHQ7XHJcblxyXG5cclxuICAgIC8qc2V0cyBiYXNpYyBzY2FsZSB0byBYICovXHJcblxyXG4gICAgdm0uc2NhbGUgPSB2bS5zY2FsZVhcclxuICAgIGlmICh2bS5zY2FsZVggPCB2bS5zY2FsZVkpIHtcclxuICAgICAgdm0uc2NhbGUgPSB2bS5zY2FsZVk7XHJcbiAgICB9XHJcblxyXG4gICAgdm0uaW1nV2lkdGggKj0gdm0uc2NhbGUgKiAxLjA1O1xyXG4gICAgdm0uaW1nSGVpZ2h0ICo9IHZtLnNjYWxlICogMS4wNTtcclxuXHJcbiAgICB2bS5hbmNob3JYID0gKHZtLmltZ1dpZHRoIC0gdm0uc2NyZWVuV2lkdGgpO1xyXG4gICAgdm0uYW5jaG9yWSA9ICh2bS5pbWdIZWlnaHQgLSB2bS5zY3JlZW5IZWlnaHQpO1xyXG5cclxuICAgIHZtLnhfb2Zmc2V0X2Rlc3QgPSB2bS54X29mZnNldCA9IHZtLmFuY2hvclg7XHJcbiAgICB2bS55X29mZnNldF9kZXN0ID0gdm0ueV9vZmZzZXQgPSB2bS5hbmNob3JZO1xyXG5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3KCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgLy8gdm0uY3R4LmNsZWFyUmVjdCgwLDAsdm0udywgdm0uaCk7XHJcblxyXG4gICAgdm0uY3R4LmRyYXdJbWFnZSh2bS5pbWFnZSwgdm0ueF9vZmZzZXQsIHZtLnlfb2Zmc2V0LCB2bS5pbWFnZS5uYXR1cmFsV2lkdGgsIHZtLmltYWdlLm5hdHVyYWxIZWlnaHQsIDAsIDAsIHZtLmltZ1dpZHRoLCB2bS5pbWdIZWlnaHQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFwcCB7XHJcbiAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICB3OiBudW1iZXI7XHJcbiAgaDogbnVtYmVyO1xyXG4gIC8vIHJlY3Q6IFJlY3RhbmdsZVxyXG4gIGltZzogSW1nO1xyXG5cclxuICBtb3VzZUluOiBib29sZWFuO1xyXG4gIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xyXG5cclxuICAgIHZhciBpc01vYmlsZSA9IGZhbHNlOyAvL2luaXRpYXRlIGFzIGZhbHNlXHJcbiAgICAvLyBkZXZpY2UgZGV0ZWN0aW9uXHJcbiAgICBpZiAoLyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlwYWR8aXJpc3xraW5kbGV8QW5kcm9pZHxTaWxrfGxnZSB8bWFlbW98bWlkcHxtbXB8bmV0ZnJvbnR8b3BlcmEgbShvYnxpbilpfHBhbG0oIG9zKT98cGhvbmV8cChpeGl8cmUpXFwvfHBsdWNrZXJ8cG9ja2V0fHBzcHxzZXJpZXMoNHw2KTB8c3ltYmlhbnx0cmVvfHVwXFwuKGJyb3dzZXJ8bGluayl8dm9kYWZvbmV8d2FwfHdpbmRvd3MgKGNlfHBob25lKXx4ZGF8eGlpbm8vaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpIHx8IC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudC5zdWJzdHIoMCwgNCkpKSBpc01vYmlsZSA9IHRydWU7XHJcblxyXG4gICAgaWYgKGlzTW9iaWxlKSB7XHJcbiAgICAgIHZhciBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgICBpbWFnZS5zcmMgPSAnY2l0eS5qcGcnO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcy1jb250YWluZXInKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWxjb21lLXBhZ2UnKS5pbnNlcnRCZWZvcmUoaW1hZ2UsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMtdGV4dC1vdmVybGF5JykpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuXHJcblxyXG5cclxuICAgICAgdm0uY2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcclxuICAgICAgdm0uY3R4ID0gdm0uY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG5cclxuXHJcbiAgICAgIHZtLnNpemVDYW52YXMoKTtcclxuICAgICAgLy8gdm0uaW5pdEV2ZW50cygpO1xyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0KSA9PiB7IHZtLmRyYXcodCk7IH0pO1xyXG5cclxuICAgICAgdm0uaW1nID0gbmV3IEltZyh2bS53LCB2bS5oKTtcclxuXHJcbiAgICAgIHZtLm1vdXNlSW4gPSBmYWxzZTtcclxuXHJcbiAgICAgIHZtLmNvbnRhaW5lciA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzLWNvbnRhaW5lcicpO1xyXG5cclxuICAgICAgdm0uY29udGFpbmVyLm9ubW91c2Vtb3ZlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2bS5kcmF3SW1nSW4oMCwgZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZtLmNvbnRhaW5lci5vbm1vdXNlZW50ZXIgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZtLm1vdXNlSW4gPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2bS5jb250YWluZXIub25tb3VzZW91dCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdm0ubW91c2VJbiA9IGZhbHNlO1xyXG4gICAgICAgIHZtLmRyYXdJbWdPdXQoMCwgZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBzaXplQ2FudmFzKCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdm0uY2FudmFzLnN0eWxlLndpZHRoID0gJzEwMCUnO1xyXG4gICAgdm0uY2FudmFzLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcclxuICAgIHRoaXMudyA9IHRoaXMuY2FudmFzLndpZHRoID0gdm0uY2FudmFzLm9mZnNldFdpZHRoO1xyXG4gICAgdGhpcy5oID0gdGhpcy5jYW52YXMuaGVpZ2h0ID0gdm0uY2FudmFzLm9mZnNldEhlaWdodDtcclxuXHJcbiAgICBpZiAodm0uaW1nKSB7XHJcbiAgICAgIHZtLmltZy5zaXplKHZtLncsIHZtLmgpO1xyXG4gICAgICB2bS5pbWcuZHJhdygpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcbiAgcHVibGljIGRyYXcodDogYW55KSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0KSA9PiB7IHRoaXMuZHJhdyh0KTsgfSk7XHJcbiAgICB2bS5jdHguY2xlYXJSZWN0KDAsIDAsIHZtLncsIHZtLmgpO1xyXG5cclxuICAgIHZtLmN0eC5kcmF3SW1hZ2Uodm0uaW1nLmNhbnZhcywgMCwgMCk7XHJcbiAgICB2bS5pbWcuZHJhdygpO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd0ltZ0luKHQ6IGFueSwgZTogYW55KSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG5cclxuICAgIC8qcmF0aW8gPSAoaW1nV2lkdGggLyBzY3JlZW5XaWR0aCkgICovXHJcblxyXG4gICAgdmFyIG1vdmVSYXRpb1ggPSAoZS5jbGllbnRYIC8gdm0uaW1nLnNjcmVlbldpZHRoKTsgLy9yYW5nZSBmcm9tIFswLCAxXTogMCBiZWluZyBsZWZ0LCAxIGJlaW5nIHJpZ2h0XHJcbiAgICB2YXIgbW92ZU9mZnNldFggPSAtdm0uaW1nLmFuY2hvclggKyAobW92ZVJhdGlvWCAqIHZtLmltZy5hbmNob3JYKTtcclxuXHJcbiAgICB2YXIgbW92ZVJhdGlvWSA9IChlLmNsaWVudFkgLyB2bS5pbWcuc2NyZWVuSGVpZ2h0KTsgLy9yYW5nZSBmcm9tIFswLCAxXTogMCBiZWluZyBsZWZ0LCAxIGJlaW5nIHJpZ2h0XHJcbiAgICB2YXIgbW92ZU9mZnNldFkgPSAtdm0uaW1nLmFuY2hvclkgKyAobW92ZVJhdGlvWSAqIHZtLmltZy5hbmNob3JZKTtcclxuXHJcblxyXG4gICAgLypvZmZzZXQgPSBtaWRkbGVfYW5jaG9yICsgZHJhZ2dlZF9vZmZzZXQqL1xyXG4gICAgdm0uaW1nLnhfb2Zmc2V0X2Rlc3QgPSB2bS5pbWcuYW5jaG9yWCArIG1vdmVPZmZzZXRYO1xyXG4gICAgdm0uaW1nLnlfb2Zmc2V0X2Rlc3QgPSB2bS5pbWcuYW5jaG9yWSArIG1vdmVPZmZzZXRZO1xyXG5cclxuICAgIGlmICh2bS5tb3VzZUluID09PSB0cnVlICYmIE1hdGgucm91bmQodm0uaW1nLnlfb2Zmc2V0KSAhPT0gTWF0aC5yb3VuZCh2bS5pbWcueV9vZmZzZXRfZGVzdCkgJiYgTWF0aC5yb3VuZCh2bS5pbWcueF9vZmZzZXQpICE9PSBNYXRoLnJvdW5kKHZtLmltZy54X29mZnNldF9kZXN0KSkge1xyXG5cclxuXHJcbiAgICAgIHZtLmltZy54X29mZnNldCA9IE1hdGgucm91bmQobGVycCh2bS5pbWcueF9vZmZzZXQsIHZtLmltZy54X29mZnNldF9kZXN0LCAwLjEpKTtcclxuICAgICAgdm0uaW1nLnlfb2Zmc2V0ID0gTWF0aC5yb3VuZChsZXJwKHZtLmltZy55X29mZnNldCwgdm0uaW1nLnlfb2Zmc2V0X2Rlc3QsIDAuMSkpO1xyXG5cclxuICAgICAgLy8gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodCkgPT4geyB2bS5kcmF3SW1nSW4odCwgZSkgfSk7XHJcblxyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3SW1nT3V0KHQ6IGFueSwgZTogYW55KSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgLypyYXRpbyA9IChpbWdXaWR0aCAvIHNjcmVlbldpZHRoKSAgKi9cclxuXHJcbiAgICAvLyB2YXIgbW92ZVJhdGlvWCA9IChlLmNsaWVudFggLyB2bS5pbWcuc2NyZWVuV2lkdGgpOyAvL3JhbmdlIGZyb20gWzAsIDFdOiAwIGJlaW5nIGxlZnQsIDEgYmVpbmcgcmlnaHRcclxuICAgIC8vIHZhciBtb3ZlT2Zmc2V0WCA9IC12bS5pbWcuYW5jaG9yWCArIChtb3ZlUmF0aW9YICogdm0uaW1nLmFuY2hvclggKiAyKTtcclxuXHJcbiAgICAvLyB2YXIgbW92ZVJhdGlvWSA9IChlLmNsaWVudFkgLyB2bS5pbWcuc2NyZWVuSGVpZ2h0KSAqIDI7IC8vcmFuZ2UgZnJvbSBbMCwgMV06IDAgYmVpbmcgbGVmdCwgMSBiZWluZyByaWdodFxyXG4gICAgLy8gdmFyIG1vdmVPZmZzZXRZID0gLXZtLmltZy5hbmNob3JZICsgKG1vdmVSYXRpb1kgKiB2bS5pbWcuYW5jaG9yWSk7XHJcblxyXG5cclxuICAgIC8qb2Zmc2V0ID0gbWlkZGxlX2FuY2hvciArIGRyYWdnZWRfb2Zmc2V0Ki9cclxuICAgIHZtLmltZy54X29mZnNldF9kZXN0ID0gdm0uaW1nLmFuY2hvclg7XHJcbiAgICB2bS5pbWcueV9vZmZzZXRfZGVzdCA9IHZtLmltZy5hbmNob3JZO1xyXG5cclxuICAgIGlmICh2bS5tb3VzZUluID09PSBmYWxzZSAmJiBNYXRoLnJvdW5kKHZtLmltZy55X29mZnNldCkgIT09IE1hdGgucm91bmQodm0uaW1nLnlfb2Zmc2V0X2Rlc3QpICYmIE1hdGgucm91bmQodm0uaW1nLnhfb2Zmc2V0KSAhPT0gTWF0aC5yb3VuZCh2bS5pbWcueF9vZmZzZXRfZGVzdCkpIHtcclxuXHJcblxyXG4gICAgICB2bS5pbWcueF9vZmZzZXQgPSBsZXJwKHZtLmltZy54X29mZnNldCwgdm0uaW1nLnhfb2Zmc2V0X2Rlc3QsIDAuMSk7XHJcbiAgICAgIHZtLmltZy55X29mZnNldCA9IGxlcnAodm0uaW1nLnlfb2Zmc2V0LCB2bS5pbWcueV9vZmZzZXRfZGVzdCwgMC4xKTtcclxuXHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHQpID0+IHsgdm0uZHJhd0ltZ091dCh0LCBlKSB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgLy8gaW5pdEV2ZW50cygpIHtcclxuICAvLyAgIHdpbmRvdy5vbnJlc2l6ZSA9IChlKSA9PiB7XHJcbiAgLy8gICAgIHRoaXMuc2l6ZUNhbnZhcygpO1xyXG4gIC8vICAgfTtcclxuICAvLyB9XHJcblxyXG59IiwiaW1wb3J0ICogYXMganVtcCBmcm9tIFwianVtcC5qc1wiO1xyXG5cclxuaW1wb3J0ICogYXMgaW1hZ2VfY2FudmFzIGZyb20gXCIuL2ltYWdlX2NhbnZhc1wiO1xyXG5cclxuaW1wb3J0ICogYXMgc2tpbGxfYmFkZ2UgZnJvbSBcIi4vc2tpbGxfYmFkZ2VcIjtcclxuXHJcbmltcG9ydCAqIGFzIG1lZGlhIGZyb20gXCIuL21lZGlhXCI7XHJcblxyXG4vL3lvb1xyXG5jb25zdCB0aW1lb3V0OiBudW1iZXIgPSAxMDAwO1xyXG5cclxudmFyIGZyb250ZW5kID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICdmbGV4LWdyaWQxJywgW3sgXCJuYW1lXCI6ICdIVE1MNScsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdodG1sNS5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdKYXZhIFNjcmlwdCcsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdqYXZhc2NyaXB0LTIuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnQm9vdHN0cmFwJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2Jvb3RzdHJhcC00LnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0FuZ3VsYXIgSlMnLCBcImNsYXNzXCI6ICdjaXJjbGUtNzUnLCBcImltYWdlXCI6ICdhbmd1bGFyLWljb24uc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnVHlwZSBTY3JpcHQnLCBcImNsYXNzXCI6ICdjaXJjbGUtNzUnLCBcImltYWdlXCI6ICd0eXBlc2NyaXB0LnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0d1bHAnLCBcImNsYXNzXCI6ICdjaXJjbGUtNzUnLCBcImltYWdlXCI6ICdndWxwLnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0NTUzMnLCBcImNsYXNzXCI6ICdjaXJjbGUtNTAnLCBcImltYWdlXCI6ICdjc3MtMy5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdqUXVlcnknLCBcImNsYXNzXCI6ICdjaXJjbGUtNTAnLCBcImltYWdlXCI6ICdqcXVlcnktMS5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdTQ1NTJywgXCJjbGFzc1wiOiAnY2lyY2xlLTUwJywgXCJpbWFnZVwiOiAnc2Fzcy0xLnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0QzLmpzJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAnZDMtMi5zdmcnIH1dLCAnZnJvbnRlbmQnKTtcclxudmFyIHNvZnRlbmcgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJ2ZsZXgtZ3JpZDInLCBbeyBcIm5hbWVcIjogJ0phdmEnLCBcImNsYXNzXCI6ICdjaXJjbGUtNzUnLCBcImltYWdlXCI6ICdqYXZhLTE0LnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ1VuaXR5JywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAndW5pdHkuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnQysrJywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAnYy1zZWVrbG9nby5jb20uc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnQyMnLCBcImNsYXNzXCI6ICdjaXJjbGUtNTAnLCBcImltYWdlXCI6ICdjc2hhcnAuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnUHl0aG9uJywgXCJjbGFzc1wiOiAnY2lyY2xlLTUwJywgXCJpbWFnZVwiOiAncHl0aG9uLTUuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnTm9kZSBKUycsIFwiY2xhc3NcIjogJ2NpcmNsZS0yNScsIFwiaW1hZ2VcIjogJ25vZGVqcy1pY29uLnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0FuZHJvaWQgU3R1ZGlvJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAnQW5kcm9pZF9zdHVkaW8uc3ZnJyB9XSwgJ3NvZnRlbmcnKTtcclxudmFyIGRlc2lnbiA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnZmxleC1ncmlkMycsIFt7IFwibmFtZVwiOiAnUGhvdG9zaG9wJywgXCJjbGFzc1wiOiAnY2lyY2xlLTUwJywgXCJpbWFnZVwiOiAncGhvdG9zaG9wLWNjLnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0lsbHVzdHJhdG9yJywgXCJjbGFzc1wiOiAnY2lyY2xlLTUwJywgXCJpbWFnZVwiOiAnYWRvYmUtaWxsdXN0cmF0b3ItY2Muc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnTWF5YScsIFwiY2xhc3NcIjogJ2NpcmNsZS01MCcsIFwiaW1hZ2VcIjogJ21heWEucG5nJyB9LFxyXG57IFwibmFtZVwiOiAnQWZ0ZXIgRWZmZWN0cycsIFwiY2xhc3NcIjogJ2NpcmNsZS0yNScsIFwiaW1hZ2VcIjogJ2FmdGVyLWVmZmVjdHMtY2Muc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnTXVkYm94JywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAnbXVkYm94LnBuZycgfV0sICdkZXNpZ24nKTtcclxuZnJvbnRlbmQubG9hZCgpO1xyXG5zb2Z0ZW5nLmxvYWQoKTtcclxuZGVzaWduLmxvYWQoKTtcclxuXHJcblxyXG52YXIgYXBwO1xyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBhcHAgPSBuZXcgaW1hZ2VfY2FudmFzLkFwcCgpO1xyXG59KTtcclxuXHJcblxyXG4vLyB3aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpe1xyXG4vLyAgICAgY29uc29sZS5sb2cod2luZG93LnNjcm9sbFkpO1xyXG4vLyB9XHJcblxyXG5cclxuLy8gdmFyIHcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndyYXBwZXItMFwiKTtcclxuLy8gdmFyIGIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncDEnKTtcclxuXHJcblxyXG4vLyBiLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4vLyAgICAgaWYody5jbGFzc0xpc3RbMV0gPT09IFwib3BlblwiKXtcclxuLy8gICAgICAgICB3LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuLy8gICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgdy5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcbi8vICAgICB9XHJcbi8vIH1cclxuXHJcbmV4cG9ydCBjbGFzcyBQb3J0Zm9saW9JdGVtIHtcclxuICAgIHRpdGxlOiBzdHJpbmc7XHJcbiAgICB0aXRsZV9pbWFnZTogc3RyaW5nO1xyXG4gICAgZGVzYzogc3RyaW5nO1xyXG4gICAgc3RhY2s6IHNraWxsX2JhZGdlLkNvbGxlY3Rpb247XHJcbiAgICBwb3J0X2ltYWdlOiBzdHJpbmc7XHJcbiAgICB1cmw6IHN0cmluZztcclxuXHJcbiAgICBpdGVtX251bTogbnVtYmVyO1xyXG5cclxuICAgIGNvbF9zaXplOiBzdHJpbmc7XHJcbiAgICBjb2w6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gICAgdGV4dDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBzdWJfdGV4dDogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgb3BlbjogYm9vbGVhbjtcclxuICAgIG1lZGlhOiBtZWRpYS5NZWRpYTtcclxuICAgIHRhcmdldF93cmFwcGVyOiBXcmFwcGVyO1xyXG4gICAgcG9ydGZvbGlvOiBQb3J0Zm9saW87XHJcbiAgICByb3c6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwb3J0Zm9saW86IFBvcnRmb2xpbywgaXRlbV9udW06IG51bWJlciwgdGl0bGU6IHN0cmluZywgdGl0bGVfaW1hZ2U6IHN0cmluZywgZGVzYzogc3RyaW5nLCBzdGFjazogc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbiwgbWVkaWE6IG1lZGlhLk1lZGlhLCB0eXBlOiBzdHJpbmcsIHVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB2bS5wb3J0Zm9saW8gPSBwb3J0Zm9saW87XHJcbiAgICAgICAgdm0uaXRlbV9udW0gPSBpdGVtX251bTtcclxuICAgICAgICB2bS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHZtLnRpdGxlX2ltYWdlID0gdGl0bGVfaW1hZ2U7XHJcbiAgICAgICAgdm0uZGVzYyA9IGRlc2M7XHJcbiAgICAgICAgdm0uc3RhY2sgPSBzdGFjaztcclxuICAgICAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgICAgIHZtLnVybCA9IHVybDtcclxuICAgICAgICB2bS5jb2xfc2l6ZSA9IFwiY29sLW1kLTNcIjtcclxuXHJcblxyXG4gICAgICAgIHZtLmNvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmNvbC5jbGFzc0xpc3QuYWRkKHZtLmNvbF9zaXplKTtcclxuXHJcbiAgICAgICAgdmFyIGNhcmRfc2hhZG93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY2FyZF9zaGFkb3cuY2xhc3NMaXN0LmFkZCgnY2FyZC1kcm9wc2hhZG93JywgJ3JvdycpO1xyXG5cclxuICAgICAgICB2YXIgbm9wYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBub3BhZC5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInLCAnbm9wYWQnKTtcclxuXHJcbiAgICAgICAgdm0uaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgICAgdm0uaW1nLnNyYyA9IHZtLnRpdGxlX2ltYWdlO1xyXG5cclxuICAgICAgICB2YXIgY29sMTIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb2wxMi5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInKTtcclxuXHJcbiAgICAgICAgdm0udGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnRleHQuY2xhc3NMaXN0LmFkZCgndGV4dCcsICdwYWRkaW5nLXRvcCcpO1xyXG4gICAgICAgIHZtLnRleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGl0bGUpKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbDEyXzIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb2wxMl8yLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicpO1xyXG5cclxuICAgICAgICB2bS5zdWJfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnN1Yl90ZXh0LmNsYXNzTGlzdC5hZGQoJ3RleHRfbGlnaHQnKTtcclxuICAgICAgICB2bS5zdWJfdGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0eXBlKSk7XHJcblxyXG4gICAgICAgIC8vIC5jb2wtbWQtM1xyXG4gICAgICAgIC8vICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKSNwMVxyXG4gICAgICAgIC8vICAgICAgIC50ZXh0IEJyZWF0aGxlc3M6IEhUTUw1IEdhbWVcclxuXHJcbiAgICAgICAgLy8gLmNvbC1tZC0zXHJcbiAgICAgICAgLy8gICAgICAgLmNhcmQtZHJvcHNoYWRvdy5yb3dcclxuICAgICAgICAvLyAgICAgICAgIC5jb2wtbWQtMTIubm9wYWRcclxuICAgICAgICAvLyAgICAgICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpI3AxLmRyb3BzaGFkb3dcclxuICAgICAgICAvLyAgICAgICAgIC5jb2wtbWQtMTJcclxuICAgICAgICAvLyAgICAgICAgICAgLnRleHQgQnJlYXRobGVzc1xyXG4gICAgICAgIC8vICAgICAgICAgLmNvbC1tZC0xMlxyXG4gICAgICAgIC8vICAgICAgICAgICAudGV4dF9saWdodCBIVE1MNSBHYW1lXHJcblxyXG4gICAgICAgIHZtLmNvbC5hcHBlbmRDaGlsZChjYXJkX3NoYWRvdyk7XHJcbiAgICAgICAgY2FyZF9zaGFkb3cuYXBwZW5kQ2hpbGQobm9wYWQpO1xyXG4gICAgICAgIG5vcGFkLmFwcGVuZENoaWxkKHZtLmltZyk7XHJcbiAgICAgICAgY2FyZF9zaGFkb3cuYXBwZW5kQ2hpbGQoY29sMTIpO1xyXG4gICAgICAgIGNvbDEyLmFwcGVuZENoaWxkKHZtLnRleHQpO1xyXG4gICAgICAgIGNhcmRfc2hhZG93LmFwcGVuZENoaWxkKGNvbDEyXzIpO1xyXG4gICAgICAgIGNvbDEyXzIuYXBwZW5kQ2hpbGQodm0uc3ViX3RleHQpO1xyXG5cclxuICAgICAgICB2bS5vcGVuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHZtLmNvbC5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyAgIGNvbnNvbGUuKHZtLml0ZW1zWzBdKTtcclxuICAgICAgICAgICAgdmFyIGRpZmZlcmVudF93cmFwcGVyID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBkaWZmZXJlbnRfd3JhcHBlciA9IHZtLnBvcnRmb2xpby5jbG9zZSh2bS5pdGVtX251bSk7XHJcblxyXG4gICAgICAgICAgICB2bS5vcGVuID0gdm0udGFyZ2V0X3dyYXBwZXIudHJhbnNpdGlvbldyYXBwZXIoZGlmZmVyZW50X3dyYXBwZXIsIHZtLm9wZW4sIHZtLnRpdGxlLCB2bS5kZXNjLCB2bS5zdGFjaywgdm0ubWVkaWEsIHZtLnVybClcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAganVtcCgnI3dyYXBwZXItJyArIHZtLnJvdywge1xyXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxyXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogLXZtLmNvbC5jbGllbnRIZWlnaHQgLSAzNVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSwgdGltZW91dCk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gICB2bS5zZXREYXRhKCk7ICBcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgYXBwZW5kKHJvdzogbnVtYmVyLCB3cmFwcGVyOiBXcmFwcGVyKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZhciByb3dfZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb3dfJyArIHJvdyk7XHJcbiAgICAgICAgcm93X2VsZW1lbnQuYXBwZW5kQ2hpbGQodm0uY29sKTtcclxuICAgICAgICB2bS50YXJnZXRfd3JhcHBlciA9IHdyYXBwZXI7XHJcbiAgICAgICAgdm0uc3RhY2suZmxleF9ncmlkX2lkID0gd3JhcHBlci5mbGV4X2dyaWQuaWQ7XHJcbiAgICAgICAgdm0ubWVkaWEuaWQgPSAnbWVkaWEtJyArIHJvdztcclxuICAgICAgICB2bS5yb3cgPSByb3c7XHJcbiAgICB9XHJcbiAgICBzZXRDb2woY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uY29sLmNsYXNzTGlzdC5yZW1vdmUodm0uY29sX3NpemUpO1xyXG4gICAgICAgIHZtLmNvbF9zaXplID0gY2xhc3NOYW1lO1xyXG4gICAgICAgIHZtLmNvbC5jbGFzc0xpc3QuYWRkKHZtLmNvbF9zaXplKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUG9ydGZvbGlvIHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBqc29uX29ianM6IElQb3J0Zm9saW9JdGVtW107XHJcbiAgICBwYXRoOiBzdHJpbmc7XHJcbiAgICBpdGVtczogUG9ydGZvbGlvSXRlbVtdO1xyXG4gICAgd3JhcHBlcnM6IFdyYXBwZXJbXTtcclxuICAgIGZsZXhfZ3JpZF9pZDogc3RyaW5nO1xyXG4gICAgcGVyX3JvdzogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGpzb25fb2JqczogSVBvcnRmb2xpb0l0ZW1bXSkge1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5pZCA9IGlkO1xyXG4gICAgICAgIHZtLmpzb25fb2JqcyA9IGpzb25fb2JqcztcclxuXHJcblxyXG4gICAgICAgIHZtLml0ZW1zID0gW107XHJcbiAgICAgICAgdm0ud3JhcHBlcnMgPSBbXTtcclxuXHJcbiAgICAgICAgLy9hZGQgd3JhcHBlcnMgYmFzZWQgb24gYWxsIHBvc3NpYmxlIGJyZWFrcG9pbnQgd2lkdGhzIChqc29uX29ianMvMilcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE1hdGguY2VpbChqc29uX29ianMubGVuZ3RoIC8gMik7IGorKykge1xyXG4gICAgICAgICAgICB2bS53cmFwcGVycy5wdXNoKG5ldyBXcmFwcGVyKGopKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vYWRkIGFsbCBpdGVtc1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uanNvbl9vYmpzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZtLml0ZW1zLnB1c2gobmV3IFBvcnRmb2xpb0l0ZW0odm0sIGksIGpzb25fb2Jqc1tpXS50aXRsZSwganNvbl9vYmpzW2ldLnRpdGxlX2ltYWdlLCBqc29uX29ianNbaV0uZGVzYywganNvbl9vYmpzW2ldLnN0YWNrLCBqc29uX29ianNbaV0ubWVkaWEsIGpzb25fb2Jqc1tpXS50eXBlLCBqc29uX29ianNbaV0udXJsKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2bS5hcHBlbmRBbGwoKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhcHBlbmRBbGwoKSB7IC8vYXBwZW5kcyBQb3J0Zm9saW9JdGVtcyBiYXNlZCBvbiBzY3JlZW4gc2l6ZTsgZ2V0cyBkaWdlc3RlZFxyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2YXIgc2NyZWVuV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHJcbiAgICAgICAgLy9yZWFzc2lnbnMgY29scyBiYXNlZCBvbiBicmVha3BvaW50c1xyXG4gICAgICAgIHZhciBicmVha3BvaW50cyA9IFt7IG1pbjogMCwgbWF4OiA3NjgsIGNvbF9zaXplOiAnY29sLXhzLTYnLCBwZXJfcm93OiAyIH0sIHsgbWluOiA3NjksIG1heDogOTkyLCBjb2xfc2l6ZTogJ2NvbC14cy00JywgcGVyX3JvdzogMyB9LCB7IG1pbjogOTkzLCBtYXg6IDEyMDAsIGNvbF9zaXplOiAnY29sLXhzLTMnLCBwZXJfcm93OiA0IH0sIHsgbWluOiAxMjAwLCBtYXg6IDk5OTksIGNvbF9zaXplOiAnY29sLXhzLTMnLCBwZXJfcm93OiA0IH1dO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnJlYWtwb2ludHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIC8vaWYgaW4gYnJlYWtwb2ludCByYW5nZSwgYW5kIG5vdCBzYW1lIGFzIGJlZm9yZVxyXG4gICAgICAgICAgICBpZiAoLyp2bS5pdGVtc1swXS5jb2xfc2l6ZSAhPT0gYnJlYWtwb2ludHNbaV0uY29sX3NpemUgJiYgKi9zY3JlZW5XaWR0aCA+IGJyZWFrcG9pbnRzW2ldLm1pbiAmJiBzY3JlZW5XaWR0aCA8IGJyZWFrcG9pbnRzW2ldLm1heCkge1xyXG4gICAgICAgICAgICAgICAgLy9jbGVhciBhbGwgcm93c1xyXG4gICAgICAgICAgICAgICAgdm0ucGVyX3JvdyA9IGJyZWFrcG9pbnRzW2ldLnBlcl9yb3c7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcnRmb2xpbycpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZXJhdG9yID0gcGFyZW50LmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGEgPSAxOyBhIDwgaXRlcmF0b3I7IGErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYXJlbnQuY2hpbGRyZW5bMV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vYWRkIG5ldyByb3dzIGFuZCB3cmFwcGVyc1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgciA9IDA7IHIgPCBNYXRoLmNlaWwodm0uaXRlbXMubGVuZ3RoIC8gYnJlYWtwb2ludHNbaV0ucGVyX3Jvdyk7IHIrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgICAgICByb3cuaWQgPSAncm93XycgKyByO1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdy5jbGFzc0xpc3QuYWRkKCdyb3cnLCAnbm9tYXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSB2bS53cmFwcGVyc1tyXS5odG1sO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQocm93KTtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQod3JhcHBlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL2FkZCBjb2xzIHRvIG5ldyByb3dzXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZtLml0ZW1zLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uaXRlbXNbal0uc2V0Q29sKGJyZWFrcG9pbnRzW2ldLmNvbF9zaXplKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcm93X251bSA9IE1hdGguZmxvb3IoaiAvIGJyZWFrcG9pbnRzW2ldLnBlcl9yb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLml0ZW1zW2pdLmFwcGVuZChyb3dfbnVtLCB2bS53cmFwcGVyc1tyb3dfbnVtXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsb3NlKGl0ZW1fbnVtOiBudW1iZXIpIHsgLy9jbG9zZXMgYWxsIHdyYXBwZXJzXHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIC8vY2xvc2VzIGFsbCBpdGVtcyBpbiB0aGUgcm93IG9mIHRoZSBnaXZlbiBpdGVtLlxyXG4gICAgICAgIHZhciByb3cgPSBNYXRoLmZsb29yKGl0ZW1fbnVtIC8gdm0ucGVyX3Jvdyk7XHJcblxyXG4gICAgICAgIC8vIGZvcih2YXIgaiA9IChyb3cqdm0ucGVyX3Jvdyk7IGogPCAoKHJvdyp2bS5wZXJfcm93KSt2bS5wZXJfcm93KTsgaisrKXtcclxuICAgICAgICAvLyAgICAgaWYoaXRlbV9udW0gIT09IGogJiYgdm0uaXRlbXNbal0pe1xyXG4gICAgICAgIC8vICAgICAgICAgdm0uaXRlbXNbal0ub3BlbiA9IGZhbHNlO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIHZhciByZXR1cm5fdmFsdWUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2bS5pdGVtcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoaXRlbV9udW0gIT09IGogJiYgdm0uaXRlbXNbal0pIHtcclxuICAgICAgICAgICAgICAgIHZtLml0ZW1zW2pdLm9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciByID0gMDsgciA8IHZtLndyYXBwZXJzLmxlbmd0aDsgcisrKSB7XHJcbiAgICAgICAgICAgIGlmIChyICE9PSByb3cgJiYgdm0ud3JhcHBlcnNbcl0uaHRtbC5jbGFzc0xpc3RbMV0gPT09ICdvcGVuJykge1xyXG4gICAgICAgICAgICAgICAgdm0ud3JhcHBlcnNbcl0uY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldHVybl92YWx1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdyYXBwZXIge1xyXG4gICAgdGl0bGU6IHN0cmluZztcclxuICAgIGRlc2M6IHN0cmluZztcclxuICAgIGNvbGxlY3Rpb246IHNraWxsX2JhZGdlLkNvbGxlY3Rpb247XHJcbiAgICBwb3J0X2ltYWdlOiBzdHJpbmc7XHJcbiAgICBtZWRpYTogbWVkaWEuTWVkaWE7XHJcbiAgICB1cmw6IHN0cmluZztcclxuXHJcblxyXG4gICAgaHRtbDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICB0aXRsZV9lbGVtZW50OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGRlc2NyaXB0aW9uOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHN0YWNrOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGZsZXhfZ3JpZDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBkZW1vOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbDU6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgZGVzY3JpcHRpb25fdGV4dDogVGV4dDtcclxuICAgIHRpdGxlX2VsZW1lbnRfdGV4dDogVGV4dDtcclxuICAgIGxpbms6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgbGlua190ZXh0OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbDY6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29sNkhvbGRlcjogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgY2hhbmdlOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHJvd19udW0pIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZtLmNoYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgIC8vIHZtLnRpdGxlID0gcEl0ZW0udGl0bGU7XHJcbiAgICAgICAgLy8gdm0uZGVzYyA9IHBJdGVtLmRlc2M7XHJcbiAgICAgICAgLy8gdm0uc3RhY2sgPSBwSXRlbS5zdGFjaztcclxuICAgICAgICAvLyB2bS5wb3J0X2ltYWdlID0gcEl0ZW0ucG9ydF9pbWFnZTtcclxuICAgICAgICB2bS5odG1sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uaHRtbC5pZCA9ICd3cmFwcGVyLScgKyByb3dfbnVtO1xyXG4gICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LmFkZCgnd3JhcHBlcicpO1xyXG5cclxuICAgICAgICB2YXIgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgcm93LmlkID0gJ2NvbnRlbnQnO1xyXG4gICAgICAgIHJvdy5jbGFzc0xpc3QuYWRkKCdyb3cnLCAnbm9tYXInKTtcclxuXHJcbiAgICAgICAgdm0udGl0bGVfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2Rlc2MtdGV4dCcsICdwYWQtc3BhY2luZycpO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnRfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcclxuICAgICAgICB2bS50aXRsZV9lbGVtZW50LmFwcGVuZENoaWxkKHZtLnRpdGxlX2VsZW1lbnRfdGV4dCk7XHJcblxyXG4gICAgICAgIHZtLmNvbDZIb2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5jb2w2SG9sZGVyLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtNicsICdjb2wtbGctNycsICdyb3cnLCAnbm9tYXInLCAnbm9wYWQnKTtcclxuXHJcbiAgICAgICAgdmFyIHJvd19maWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgcm93X2ZpbGwuY2xhc3NMaXN0LmFkZCgncm93JywgJ2p1c3RpZnktY2VudGVyJywgJ25vbWFyJyk7XHJcblxyXG4gICAgICAgIHZhciBjb2wxMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbDEyLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicpO1xyXG5cclxuICAgICAgICB2bS5jb2w2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uY29sNi5pZCA9ICdtZWRpYS0nICsgcm93X251bTtcclxuICAgICAgICB2bS5jb2w2LmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtNicsICdjb2wtbGctNScpO1xyXG5cclxuICAgICAgICB2YXIgY29sM18yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29sM18yLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtMycsICdub3BhZC1sZWZ0Jyk7XHJcblxyXG4gICAgICAgIHZtLmRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb24uY2xhc3NMaXN0LmFkZCgnaGVhZGVyLXRleHQnLCAncGFkLXNwYWNpbmcnKTtcclxuICAgICAgICB2bS5kZXNjcmlwdGlvbi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnRGVzY3JpcHRpb24nKSk7XHJcblxyXG4gICAgICAgIHZhciBkZXNjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGVzYy5jbGFzc0xpc3QuYWRkKCdkZXNjcmlwdGlvbi10ZXh0JywgJ3BhZC1zcGFjaW5nJyk7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb25fdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcclxuICAgICAgICBkZXNjLmFwcGVuZENoaWxkKHZtLmRlc2NyaXB0aW9uX3RleHQpO1xyXG5cclxuICAgICAgICB2bS5zdGFjayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnN0YWNrLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtMTInLCAnY29sLWxnLTcnKTtcclxuICAgICAgICAvLyB2bS5zdGFjay5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnU3RhY2snKSk7XHJcblxyXG4gICAgICAgIHZhciBzdGFja190aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHN0YWNrX3RpdGxlLmNsYXNzTGlzdC5hZGQoJ2hlYWRlci10ZXh0JywgJ3BhZC1zcGFjaW5nJylcclxuICAgICAgICBzdGFja190aXRsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnU3RhY2snKSk7XHJcblxyXG4gICAgICAgIHZtLmZsZXhfZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmZsZXhfZ3JpZC5pZCA9ICdwZmxleC1ncmlkLScgKyByb3dfbnVtO1xyXG4gICAgICAgIHZtLmZsZXhfZ3JpZC5jbGFzc0xpc3QuYWRkKCdyb3cnLCAncG9ydGZvbGlvLWZsZXgnLCAnY29sLXhzLTEyJyk7XHJcblxyXG4gICAgICAgIHZtLmRlbW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5kZW1vLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtMTInLCAnY29sLWxnLTUnKTtcclxuICAgICAgICAvLyB2bS5kZW1vLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdMaXZlIERlbW8nKSk7XHJcblxyXG4gICAgICAgIHZhciBkZW1vX3RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGVtb190aXRsZS5jbGFzc0xpc3QuYWRkKCdoZWFkZXItdGV4dCcsICdwYWQtc3BhY2luZycpXHJcbiAgICAgICAgZGVtb190aXRsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnUmVsZXZhbnQgTGlua3MnKSk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgdm0ubGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmxpbmsuY2xhc3NMaXN0LmFkZCgnZ2l0aHViLWJ1dHRvbicsICdyb3cnLCAnbm9tYXInKTtcclxuXHJcbiAgICAgICAgdm0ubGlua190ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0ubGlua190ZXh0LmNsYXNzTGlzdC5hZGQoJ3RleHQnKTtcclxuICAgICAgICB2bS5saW5rX3RleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0xpdmUgTGluaycpKTtcclxuXHJcbiAgICAgICAgdm0uY29sNSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmNvbDUuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2NvbC1tZC01Jyk7XHJcblxyXG4gICAgICAgIC8qIEdPTk5BIEhBVkUgVE8gQUREIE1FRElBIERZTkFNSUNBTExZICovXHJcblxyXG4gICAgICAgIHZtLmh0bWwuYXBwZW5kQ2hpbGQocm93KTtcclxuICAgICAgICByb3cuYXBwZW5kQ2hpbGQodm0udGl0bGVfZWxlbWVudCk7XHJcbiAgICAgICAgcm93LmFwcGVuZENoaWxkKHZtLmNvbDYpO1xyXG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZCh2bS5jb2w2SG9sZGVyKTtcclxuXHJcblxyXG4gICAgICAgIHZtLmNvbDZIb2xkZXIuYXBwZW5kQ2hpbGQoY29sMTIpO1xyXG4gICAgICAgIGNvbDEyLmFwcGVuZENoaWxkKHZtLmRlc2NyaXB0aW9uKTtcclxuICAgICAgICBjb2wxMi5hcHBlbmRDaGlsZChkZXNjKTtcclxuICAgICAgICB2bS5jb2w2SG9sZGVyLmFwcGVuZENoaWxkKHZtLnN0YWNrKVxyXG4gICAgICAgIHZtLnN0YWNrLmFwcGVuZENoaWxkKHN0YWNrX3RpdGxlKTtcclxuICAgICAgICB2bS5zdGFjay5hcHBlbmRDaGlsZCh2bS5mbGV4X2dyaWQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZtLmNvbDZIb2xkZXIuYXBwZW5kQ2hpbGQodm0uZGVtbylcclxuICAgICAgICB2bS5kZW1vLmFwcGVuZENoaWxkKGRlbW9fdGl0bGUpO1xyXG4gICAgICAgIHZtLmRlbW8uYXBwZW5kQ2hpbGQodm0ubGluayk7XHJcbiAgICAgICAgdm0ubGluay5hcHBlbmRDaGlsZCh2bS5saW5rX3RleHQpO1xyXG4gICAgICAgIHZtLmxpbmsub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbG9jYXRpb24uaHJlZiA9IHZtLnVybDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAvLyN3cmFwcGVyLTAud3JhcHBlci5vcGVuXHJcbiAgICAgICAgLy8gLnJvdyNjb250ZW50XHJcbiAgICAgICAgLy8gICAuY29sLW1kLTEyLmRlc2MtdGV4dCBCcmVhdGhsZXNzXHJcbiAgICAgICAgLy8gICAuY29sLW1kLTYjbWVkaWEtMFxyXG4gICAgICAgIC8vICAgLmNvbC1tZC02LnJvd1xyXG4gICAgICAgIC8vICAgICAgIC5jb2wtbWQtMTJcclxuICAgICAgICAvLyAgICAgICAgIC5oZWFkZXItdGV4dC5wYWRkaW5nLWxlZnQgRGVzY3JpcHRpb246XHJcbiAgICAgICAgLy8gICAgICAgICAuZGVzY3JpcHRpb24tdGV4dC5wYWRkaW5nLWxlZnQgYXNkZmFzZGZcclxuICAgICAgICAvLyAgICAgICAuY29sLW1kLTYuaGVhZGVyLXRleHQgU3RhY2s6XHJcbiAgICAgICAgLy8gICAgICAgLmNvbC1tZC02LmhlYWRlci10ZXh0IExpdmUgRGVtbzpcclxuXHJcbiAgICAgICAgdm0uaHRtbC5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgaWYgKHZtLmNoYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICAgICB2bS5zZXREYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5jaGFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICB9XHJcbiAgICAvLyBjbG9zZURhdGEoKXtcclxuICAgIC8vICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAvLyAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgLy8gICAgICAgICB2bS5jb2xsZWN0aW9uLmNsb3NlKCk7XHJcbiAgICAvLyAgICAgfSx0aW1lb3V0KTtcclxuXHJcbiAgICAvLyB9XHJcblxyXG4gICAgc2V0RGF0YSgpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uc2V0VGl0bGUoKTtcclxuICAgICAgICB2bS5zZXREZXNjKCk7XHJcbiAgICAgICAgdm0uc2V0U3RhY2soKTtcclxuICAgICAgICB2bS5zZXRNZWRpYSgpO1xyXG5cclxuICAgICAgICBpZih2bS51cmwgPT09IFwiXCIpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSSBUSElOSyBUSElTIEhBUFBFTkVEPycpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2bS5jb2w2Lmxhc3RDaGlsZCk7XHJcbiAgICAgICAgICAgIHZtLmNvbDZIb2xkZXIucmVtb3ZlQ2hpbGQodm0uZGVtbyk7XHJcbiAgICAgICAgfSBlbHNlIGlmKHZtLmNvbDZIb2xkZXIubGFzdENoaWxkICE9PSB2bS5kZW1vKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1dPQUggVEhJUyBXT1JLUz8nKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codm0uY29sNi5sYXN0Q2hpbGQpO1xyXG4gICAgICAgICAgICB2bS5jb2w2SG9sZGVyLmFwcGVuZENoaWxkKHZtLmRlbW8pOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB2bS5zZXRTdGFjayhzdGFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGl0bGUoKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnRfdGV4dC50ZXh0Q29udGVudCA9IHZtLnRpdGxlO1xyXG4gICAgfVxyXG4gICAgc2V0RGVzYygpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb25fdGV4dC50ZXh0Q29udGVudCA9IHZtLmRlc2M7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U3RhY2soKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmNvbGxlY3Rpb24ucmVzZXRJZHModm0uZmxleF9ncmlkLmlkKTtcclxuICAgICAgICB2bS5jb2xsZWN0aW9uLmxvYWQoKTtcclxuICAgIH1cclxuICAgIHNldE1lZGlhKCkge1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5tZWRpYS5zZXRJZCh2bS5tZWRpYS5pZCk7XHJcbiAgICAgICAgdm0ubWVkaWEubG9hZE1lZGlhKDApO1xyXG4gICAgfVxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4gICAgfVxyXG4gICAgY2hhbmdlV3JhcHBlcihvcGVuOiBib29sZWFuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgLy9jbG9zZSB3cmFwcGVyOlxyXG5cclxuXHJcbiAgICAgICAgaWYgKHZtLnRpdGxlID09PSB0aXRsZSkgeyAvKippZiBubyBjaGFuZ2UgKi9cclxuICAgICAgICAgICAgdm0uY2hhbmdlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAob3Blbikge1xyXG4gICAgICAgICAgICAgICAgLy8gdm0uY2xvc2VEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZtLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgICAgICAgICB2bS5kZXNjID0gZGVzYztcclxuICAgICAgICAgICAgICAgIHZtLmNvbGxlY3Rpb24gPSBzdGFjaztcclxuICAgICAgICAgICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgICAgICAgICB2bS51cmwgPSB1cmw7XHJcbiAgICAgICAgICAgICAgICB2bS5zZXREYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh2bS5odG1sLmNsYXNzTGlzdFsxXSAhPT0gJ29wZW4nKSB7IC8qKmlmIGFsbCBzZWxlY3Rpb25zIGFyZSBjbG9zZWQgaW5pdGlhbGx5L2NoYW5nZSB3aGVuIGNsb3NlZCovXHJcbiAgICAgICAgICAgIHZtLmNoYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2bS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgICAgICB2bS5kZXNjID0gZGVzYztcclxuICAgICAgICAgICAgdm0uY29sbGVjdGlvbiA9IHN0YWNrO1xyXG4gICAgICAgICAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgICAgICAgICB2bS51cmwgPSB1cmw7XHJcbiAgICAgICAgICAgIHZtLnNldERhdGEoKTtcclxuICAgICAgICAgICAgdm0uaHRtbC5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZtLmNoYW5nZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHZtLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgICAgIHZtLmRlc2MgPSBkZXNjO1xyXG4gICAgICAgICAgICB2bS5jb2xsZWN0aW9uID0gc3RhY2s7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgICAgIHZtLnVybCA9IHVybDtcclxuICAgICAgICAgICAgLy8gdm0uY2xvc2VEYXRhKCk7XHJcbiAgICAgICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zaXRpb25XcmFwcGVyKGRpZmZlcmVudF93cmFwcGVyOiBib29sZWFuLCBvcGVuOiBib29sZWFuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpIHtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciByZXR1cm5fdmFsdWU7XHJcblxyXG4gICAgICAgIGlmIChkaWZmZXJlbnRfd3JhcHBlcikge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHZtLmNoYW5nZVdyYXBwZXIob3BlbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSwgdXJsKTtcclxuICAgICAgICAgICAgfSwgdGltZW91dCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChvcGVuID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb3BlbiA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHZtLmNoYW5nZVdyYXBwZXIob3BlbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSwgdXJsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHZtLmNoYW5nZVdyYXBwZXIob3BlbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSwgdXJsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldHVybl92YWx1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUG9ydGZvbGlvSXRlbSB7XHJcbiAgICB0aXRsZTogc3RyaW5nO1xyXG4gICAgdGl0bGVfaW1hZ2U6IHN0cmluZztcclxuICAgIGRlc2M6IHN0cmluZztcclxuICAgIHN0YWNrOiBza2lsbF9iYWRnZS5Db2xsZWN0aW9uO1xyXG4gICAgbWVkaWE6IG1lZGlhLk1lZGlhO1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gICAgdXJsOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8vIHtcIm5hbWVcIjogJ1B5dGhvbicsICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J3B5dGhvbi01LnN2Zyd9XHJcbnZhciBicmVhdGhsZXNzX3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ1BoYXNlci5qcycsIFwiY2xhc3NcIjogJ2NpcmNsZS0xMDAnLCBcImltYWdlXCI6ICdwaGFzZXIuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnUGhvdG9zaG9wJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ3Bob3Rvc2hvcC1jYy5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdqUXVlcnknLCBcImNsYXNzXCI6ICdjaXJjbGUtNTAnLCBcImltYWdlXCI6ICdqcXVlcnktMS5zdmcnIH1cclxuXSk7XHJcbnZhciByZW1fc3RhY2sgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJycsIFt7IFwibmFtZVwiOiAnVW5pdHknLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAndW5pdHkuc3ZnJyB9LFxyXG57IFwibmFtZVwiOiAnTWF5YScsIFwiY2xhc3NcIjogJ2NpcmNsZS0yNScsIFwiaW1hZ2VcIjogJ21heWEucG5nJyB9LFxyXG57IFwibmFtZVwiOiAnUGhvdG9zaG9wJywgXCJjbGFzc1wiOiAnY2lyY2xlLTI1JywgXCJpbWFnZVwiOiAncGhvdG9zaG9wLWNjLnN2Zyd9LFxyXG57IFwibmFtZVwiOiAnSWxsdXN0cmF0b3InLCBcImNsYXNzXCI6ICdjaXJjbGUtMjUnLCBcImltYWdlXCI6ICdhZG9iZS1pbGx1c3RyYXRvci1jYy5zdmcnfVxyXG5dKTtcclxudmFyIHFiZXJ0X3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ01heWEnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnbWF5YS5wbmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdQaG90b3Nob3AnLCBcImNsYXNzXCI6ICdjaXJjbGUtMjUnLCBcImltYWdlXCI6ICdwaG90b3Nob3AtY2Muc3ZnJyB9XHJcbl0pO1xyXG52YXIgd2VhdGhlcl9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgW3sgXCJuYW1lXCI6ICdBbmd1bGFyIEpTJywgXCJjbGFzc1wiOiAnY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjogJ2FuZ3VsYXItaWNvbi5zdmcnIH0sXHJcbnsgXCJuYW1lXCI6ICdEMy5qcycsIFwiY2xhc3NcIjogJ2NpcmNsZS01MCcsIFwiaW1hZ2VcIjogJ2QzLTIuc3ZnJyB9XHJcbl0pO1xyXG5cclxudmFyIHJvYXN0X3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbeyBcIm5hbWVcIjogJ0FuZ3VsYXIgSlMnLCBcImNsYXNzXCI6ICdjaXJjbGUtMTAwJywgXCJpbWFnZVwiOiAnYW5ndWxhci1pY29uLnN2ZycgfSxcclxueyBcIm5hbWVcIjogJ0QzLmpzJywgXCJjbGFzc1wiOiAnY2lyY2xlLTc1JywgXCJpbWFnZVwiOiAnZDMtMi5zdmcnIH1cclxuXSk7XHJcblxyXG4vLyB2YXIgYnJlYXRobGVzc19tZWRpYSA9IG5ldyBtZWRpYS5NZWRpYSgnbWVkaWEtMCcsIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiXSwgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2NhdC5qcGdcIl0sICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8xOTgxNDk3OTVcIiB3aWR0aD1cIjQ3MVwiIGhlaWdodD1cIjMzNVwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicpO1xyXG5cclxudmFyIG0gPSBbXVxyXG5cclxubS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgWyBcIi4vcG9ydGZvbGlvL3JlbV81LnBuZ1wiLCBcIi4vcG9ydGZvbGlvL3JlbV8zLnBuZ1wiLCBcIi4vcG9ydGZvbGlvL3JlbV8yLnBuZ1wiLCBcIi4vcG9ydGZvbGlvL3JlbV80LnBuZ1wiXSwgWyBcIi4vcG9ydGZvbGlvL3JlbV8zLnBuZ1wiLCBcIi4vcG9ydGZvbGlvL3JlbV8yLnBuZ1wiLCBcIi4vcG9ydGZvbGlvL3JlbV80LnBuZ1wiXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzI1MjQzNjk4OVwiIHdpZHRoPVwiNDcxXCIgaGVpZ2h0PVwiMzM1XCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+JykpO1xyXG5cclxuXHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfcGxheS5qcGdcIiwgXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX2dhbWVwbGF5XzIuanBnXCIsIFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheS5qcGdcIiwgXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX2NvbnRyb2xzLmpwZ1wiXSwgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19wbGF5LmpwZ1wiLCBcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfZ2FtZXBsYXlfMi5qcGdcIiwgXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX2dhbWVwbGF5LmpwZ1wiLCBcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfY29udHJvbHMuanBnXCJdKSk7XHJcblxyXG5cclxubS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgW1wiLi9wb3J0Zm9saW8vcWJlcnRfcGxheS5qcGdcIiwgXCIuL3BvcnRmb2xpby9xYmVydF9wbGF5ZXIuanBnXCIsIFwiLi9wb3J0Zm9saW8vcWJlcnRfc25ha2UuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9xYmVydF9wbGF5ZXIuanBnXCIsIFwiLi9wb3J0Zm9saW8vcWJlcnRfc25ha2UuanBnXCJdLCAnPGlmcmFtZSBzcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vMTk4MTQ5Nzk1XCIgd2lkdGg9XCI0NzFcIiBoZWlnaHQ9XCIzMzVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKSk7XHJcblxyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMS5wbmdcIiwgXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMy5wbmdcIiwgXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMi5wbmdcIl0sIFtcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8xLnBuZ1wiLCBcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8zLnBuZ1wiLCBcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8yLnBuZ1wiXSkpO1xyXG5cclxubS5wdXNoKG5ldyBtZWRpYS5NZWRpYSgnJywgWycuL3BvcnRmb2xpby9tZWFuX2ZvcmVjYXN0XzEuanBnJywgJy4vcG9ydGZvbGlvL21lYW5fZm9yZWNhc3RfMi5qcGcnXSwgWycuL3BvcnRmb2xpby9tZWFuX2ZvcmVjYXN0XzEuanBnJywgJy4vcG9ydGZvbGlvL21lYW5fZm9yZWNhc3RfMi5qcGcnXSkpXHJcblxyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbJy4vcG9ydGZvbGlvL3JvYXN0XzYucG5nJywgJy4vcG9ydGZvbGlvL3JvYXN0XzIucG5nJywgJy4vcG9ydGZvbGlvL3JvYXN0XzMucG5nJywgJy4vcG9ydGZvbGlvL3JvYXN0XzQucG5nJ10sIFsnLi9wb3J0Zm9saW8vcm9hc3RfNi5wbmcnLCAnLi9wb3J0Zm9saW8vcm9hc3RfMi5wbmcnLCcuL3BvcnRmb2xpby9yb2FzdF8zLnBuZycsICcuL3BvcnRmb2xpby9yb2FzdF80LnBuZyddKSlcclxuXHJcbnZhciBwb3J0Zm9saW8gPSBuZXcgUG9ydGZvbGlvKCdwb3J0Zm9saW8nLCBbXHJcbiAgICB7IHRpdGxlOiAnUmVtJywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9yZW1lbWJlcmVuY2VfbG9nby5qcGcnLCBkZXNjOiBcIlJlbSBpcyBhIHZpZGVvIGdhbWUgYWJvdXQgYSB5b3VuZyBnaXJsIHRyYXBwZWQgaW4gYSBjb21hdG9zZSBkcmVhbXNjYXBlLiBZb3UgcGxheSBhcyBhIHlvdW5nIGdpcmwgd2hvIG11c3Qgb3ZlcmNvbWUgaGVyIGZlYXJzIHRvIHJlbWVtYmVyIGhlciBwYXN0LiBJbiB0aGlzIGZ1biwgb3Zlci10aGUtc2hvdWxkZXIgc3RlYWx0aCBnYW1lIHlvdSBtdXN0IGF2b2lkIHNjcmVlbiBoZWFkZWQgZW5lbWllcywgYW5kIHRvIGZpbmQgbWVtZW50b3Mgb2YgeW91ciBwYXN0LiBGb3IgdGhpcyBwcm9qZWN0IEkgd29ya2VkIGluIG1hbnkgYXJlYXMgaW5jbHVkaW5nIFdlYiBEZXZlbG9wbWVudCwgTGV2ZWwgRGVzaWduLCBNb2RlbGluZywgYW5kIERvY3VtZW50YXRpb24uXCIsIHN0YWNrOiByZW1fc3RhY2ssIG1lZGlhOiBtWzBdLCB0eXBlOiAnVW5pdHkgR2FtZScsIHVybDogJ2h0dHA6Ly9vZmZicmFuZGhlbGwuZ2FtZXMvIy9ob21lJyB9LFxyXG4gICAgeyB0aXRsZTogJ1JvYXN0JywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9yb2FzdF83LmpwZycsIGRlc2M6IFwiUm9hc3QgaXMgYSB3ZWJhcHAgdGhhdCBzdXJ2ZXlzIGNvbWZvcnQgaW4gYW4gaW5kb29yIHNwYWNlLiBJdCBhc2tzIHF1ZXN0aW9ucyB0aGF0IGdhdWdlIHRlbXBlcmF0dXJlLCBub2lzZSwgc21lbGwsIGFuZCBodW1pZGl0eSwgYW5kIG1hcHMgaXQgdG8gd2hlcmUgeW91IGFyZSBvbiB5b3VyIGJ1aWxkaW5nJ3MgZmxvb3JwbGFuLiBUaHJvdWdoIHRoaXMgY3Jvd2Qgc291cmNlZCBkYXRhIGNvbGxlY3RlZCwgYnVpbGRpbmcgbWFuYWdlcnMsIGFyY2hpdGVjdHMgYW5kIHRoZSBwZW9wbGUgdGFraW5nIHRoZSBzdXJ2ZXkgY2FuIHVuZGVyc3RhbmQgaG93IHBlb3BsZSBmZWVsIGluIGEgc3BhY2UuIEkgd29ya2VkIG9uIHRoaXMgcHJvamVjdCBmb3IgNiBtb250aHMgd2hpbGUgSSB3YXMgYXQgdGhlIGFyY2hpdGVjdHVyZSBmaXJtLCBLaWVyYW4gVGltYmVybGFrZS5cIiwgc3RhY2s6IHJvYXN0X3N0YWNrLCBtZWRpYTogbVs1XSwgdHlwZTogJ1dlYiBBcHAnLCB1cmw6ICcnIH0sXHJcbiAgICB7IHRpdGxlOiAnQnJlYXRobGVzcycsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGcnLCBkZXNjOiBcIlRoZSBTcGFjZSBQaXJhdGUsIEFyaWEsIGlzIG9uIGEgbWlzc2lvbiB0byBsb290IGEgbWluZXJhbCBjYXJnbyBzaGlwLiBIb3dldmVyLCB1cG9uIGxhbmRpbmcgb24gdGhlIGNhcmdvIHNoaXAsIEFyaWEncyBoZWxtZXQgY3JhY2tzIGNhdXNpbmcgaGVyIHRvIHNsb3dseSBsb3NlIG94eWdlbi4gSXQncyBub3cgYSByYWNlIGFnYWluc3QgdGltZSB0byBjb2xsZWN0IGFsbCB0aGUgZ2VtcyBiZWZvcmUgaGVyIG94eWdlbiBydW5zIG91dCFcIiwgc3RhY2s6IGJyZWF0aGxlc3Nfc3RhY2ssIG1lZGlhOiBtWzFdLCB0eXBlOiAnSFRNTDUgR2FtZScsIHVybDogJy9icmVhdGhsZXNzJyB9LFxyXG4gICAgeyB0aXRsZTogJ01lYW4gRm9yZWNhc3QnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL21lYW5fZm9yZWNhc3RfMS5qcGcnLCBkZXNjOiAnQSBzbWFsbCB3ZWIgYXBwIHRoYXQgY2FsY3VsYXRlcyB0aGUgYXZlcmFnZSBvZiAzIHdlYXRoZXIgQVBJXFwnczogV3VuZGVyZ3JvdW5kLCBGb3JlY2FzdC5pbywgYW5kIFdvcmxkIFdlYXRoZXIgT25saW5lLiBUaGlzIGRhdGEgaXMgdGhlbiBzZXJ2ZWQgb250byBhIEQzLmpzIExpbmUgQ2hhcnQgZm9yIHRlbXBlcmF0dXJlLCBodW1pZHR5LCBhbmQgd2luZHNwZWVkLiBBbHNvIHRoZSB3ZWJhcHAgaXRzZWxmIGhhcyBtYW55IHN1YnRsZXRpZXMgdGhhdCBhcmUgYWZmZWN0ZWQgYnkgd2VhdGhlciBkYXRhLiBGb3IgZXhhbXBsZSwgdGhlIHZpZGVvICByZXNlbWJsZXMgdGhlIGN1cnJlbnQgd2VhdGhlci4gQWxzbyBlYWNoIGdyYXBoIGlzIGNvbG9yIGNvYXRlZCBieSBhIGdyYWRpZW50IGJhc2VkIG9uIHRoZSB3ZWF0aGVyIGRhdGEuJywgc3RhY2s6IHdlYXRoZXJfc3RhY2ssIG1lZGlhOiBtWzRdLCB0eXBlOiAnV2Vic2l0ZScsIHVybDogJy9tZWFuZm9yZWNhc3QnIH0sXHJcbiAgICB7IHRpdGxlOiAnUSpCZXJ0JywgdGl0bGVfaW1hZ2U6IFwiLi9wb3J0Zm9saW8vcWJlcnRfcGxheS5qcGdcIiwgZGVzYzogJ1RoaXMgaXMgbXkgQm91bmNpbmcgQmFsbCBBc3NpZ25tZW50IGZvciBBbmltYXRpb24gMSBhdCBEcmV4ZWwgVW5pdmVyc2l0eS4gV2hlbiBwaWNraW5nIGEgZ2FtZSB0aGF0IG1peGVzIG15IGxvdmUgb2YgcmV0cm8gdmlkZW8gZ2FtZXMgYW5kIGJvdW5jaW5nIGJhbGxzLCBRKkJlcnQgd2FzIGEgbm8tYnJhaW5lci4gRXZlcnl0aGluZyBpcyBpbmRpdmlkdWFsbHkgbW9kZWxsZWQsIHRleHR1cmVkLCBhbmQgYW5pbWF0ZWQgYnkgbWUuIE1hZGUgaW4gTWF5YSwgYW5kIHJlbmRlcmVkIGluIFYtUmF5LicsIHN0YWNrOiBxYmVydF9zdGFjaywgbWVkaWE6IG1bMl0sIHR5cGU6ICdBbmltYXRpb24nLCB1cmw6ICdodHRwczovL3ZpbWVvLmNvbS8xOTgxNDk3OTUnIH0sXHJcbiAgICB7IHRpdGxlOiAnQmVkcm9vbScsIHRpdGxlX2ltYWdlOiAnLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzEucG5nJywgZGVzYzogJ1RoaXMgaXMgbXkgZmluYWwgZm9yIENHSSAyIGF0IERyZXhlbCBVbml2ZXJzaXR5LiBUaGUgYXNzaWdubWVudCB3YXMgdG8gcmVjcmVhdGUgYW55IHR5cGUgb2Ygcm9vbSwgc28gSSBjaG9zZSBhIGxpdHRsZSBib3lcXCdzIHJvb20uIFdlIHdlcmUgdGFza2VkIHdpdGggY3JlYXRpbmcgYXQgbGVhc3Qgb25lIGNvbXBsZXggb2JqZWN0LCBzbyBJIGRlY2lkZWQgdG8gZ28gd2l0aCBhIHRyYWluIHNldC4nLCBzdGFjazogcWJlcnRfc3RhY2ssIG1lZGlhOiBtWzNdLCB0eXBlOiAnM0QgUmVuZGVyJywgdXJsOiAnJyB9XSk7XHJcblxyXG5cclxudmFyIHdlbGNvbWVfYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWxjb21lLWJ1dHRvbicpO1xyXG53ZWxjb21lX2Iub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGp1bXAoJyNwb3J0Zm9saW8nLCB7XHJcbiAgICAgICAgZHVyYXRpb246IDEwMDAsXHJcbiAgICAgICAgb2Zmc2V0OiAwLFxyXG4gICAgICAgIGNhbGxiYWNrOiB1bmRlZmluZWQsXHJcbiAgICAgICAgZWFzaW5nOiBqdW1wLmVhc2VJbk91dFF1YWQsXHJcbiAgICAgICAgYWxseTogZmFsc2VcclxuICAgIH0pXHJcbn1cclxuXHJcblxyXG4vKiogXHJcbiAqIHBvcnRmb2xpbyB3ZWJzaXRlXHJcbiAqIGJyZWF0aGxlc3NcclxuICogd2VhdGhlciB3ZWJzaXRlXHJcbiAqIHFiZXJ0IGFuaW1hdGlvblxyXG4gKiBjZ2kgMiBmaW5hbD8/IFxyXG4gKiBcclxuKi9cclxuXHJcblxyXG5cclxud2luZG93Lm9ucmVzaXplID0gKGUpID0+IHtcclxuICAgIGlmIChhcHAuY2FudmFzKSB7XHJcbiAgICAgICAgYXBwLnNpemVDYW52YXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwb3J0Zm9saW8uYXBwZW5kQWxsKCk7XHJcblxyXG59O1xyXG5cclxuXHJcbi8vIHZhciBkb2NXaWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vZmZzZXRXaWR0aDtcclxuXHJcbi8vIFtdLmZvckVhY2guY2FsbChcclxuLy8gICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcqJyksXHJcbi8vICAgZnVuY3Rpb24oZWwpIHtcclxuLy8gICAgIGlmIChlbC5vZmZzZXRXaWR0aCA+IGRvY1dpZHRoKSB7XHJcbi8vICAgICAgIGNvbnNvbGUubG9nKGVsKTtcclxuLy8gICAgIH1cclxuLy8gICB9XHJcbi8vICk7XHJcblxyXG4vLyB2YXIgbWVkaWEgPSBuZXcgTWVkaWEoJ21lZGlhLTAnLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2NhdC5qcGdcIl0sIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9jYXQuanBnXCIsIFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiXSk7XHJcblxyXG4iLCJleHBvcnQgKiBmcm9tIFwiLi9tZWRpYVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lZGlhSXRlbXtcclxuICAgIG1lZGlhOiBNZWRpYTtcclxuICAgIGh0bWw6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgb3JkZXI6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKG1lZGlhOiBNZWRpYSwgaHRtbDpIVE1MRGl2RWxlbWVudCwgb3JkZXI6IG51bWJlcil7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgdm0uaHRtbCA9IGh0bWw7XHJcbiAgICAgICAgdm0ub3JkZXIgPSBvcmRlcjtcclxuICAgICAgICB2bS5odG1sLm9uY2xpY2sgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2bS5tZWRpYS5sb2FkTWVkaWEodm0ub3JkZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1lZGlhIHtcclxuICAgIGlkOnN0cmluZ1xyXG4gICAgZWxlbWVudHM6IGFueVtdO1xyXG4gICAgdGh1bWJuYWlsczogSFRNTEltYWdlRWxlbWVudFtdO1xyXG4gICAgbWVkaWFfaXRlbXM6IE1lZGlhSXRlbVtdO1xyXG4gICAgc2VsZWN0ZWQ6IG51bWJlcjtcclxuICAgIHZpbWVvOnN0cmluZztcclxuXHJcbiAgICByb3c6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBvdmVybGF5OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29sbWQ6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBcclxuICAgIG1lZGlhX3NlbGVjdGVkOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgdGh1bWJuYWlsczogc3RyaW5nW10sIGZpbGVzPzogc3RyaW5nW10sIHZpbWVvPzogc3RyaW5nKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaWQgPSBpZDtcclxuICAgICAgICB2bS5zZWxlY3RlZCA9IDA7XHJcbiAgICAgICAgdm0uZWxlbWVudHMgPSBbXTtcclxuICAgICAgICB2bS5tZWRpYV9pdGVtcyA9IFtdO1xyXG4gICAgICAgIHZtLnRodW1ibmFpbHMgPSBbXTtcclxuXHJcbiAgICAgICAgdm0udmltZW8gPSB2aW1lbztcclxuICAgICAgICBpZih2aW1lbyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgZnJhZyA9IHZtLmNyZWF0ZUZyYWdtZW50KHZpbWVvKTtcclxuICAgICAgICAgICAgICAgIHZtLmVsZW1lbnRzLnB1c2goZnJhZyk7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5lbGVtZW50c1tpXS5jbGFzc0xpc3QuYWRkKCdkcm9wc2hhZG93Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbGVuZ3RoID0gdm0uZWxlbWVudHMubGVuZ3RoO1xyXG4gICAgICAgIGlmKGZpbGVzKXtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXHJcbiAgICAgICAgICAgICAgICBpbWFnZS5zcmMgPSBmaWxlc1tpXTtcclxuICAgICAgICAgICAgICAgIGltYWdlLmNsYXNzTGlzdC5hZGQoJ2Ryb3BzaGFkb3cnKTtcclxuICAgICAgICAgICAgICAgIHZtLmVsZW1lbnRzLnB1c2goaW1hZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2bS5tZWRpYV9zZWxlY3RlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLm1lZGlhX3NlbGVjdGVkLmlkID0gJ21lZGlhLXNlbGVjdGVkJztcclxuXHJcbiAgICAgICAgdm0ub3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnb3ZlcmxheS1tZWRpYScpO1xyXG5cclxuICAgICAgICB2bS5tZWRpYV9zZWxlY3RlZC5hcHBlbmRDaGlsZCh2bS5vdmVybGF5KTtcclxuXHJcbiAgICAgICAgdm0ucm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0ucm93LmNsYXNzTGlzdC5hZGQoJ3JvdycsJ2p1c3RpZnktY2VudGVyJywnbWVkaWEtY29udGFpbmVyJyk7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaiA9IDA7IGogPCB2bS5lbGVtZW50cy5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgICAgIHZtLmNvbG1kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIHZtLmNvbG1kLmNsYXNzTGlzdC5hZGQoJ2NvbC14cycpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGh0bWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgICAgICBodG1sLmNsYXNzTGlzdC5hZGQoJ21lZGlhLWl0ZW0nKTtcclxuICAgICAgICAgICAgdmFyIG1lZGlhX2l0ZW0gPSBuZXcgTWVkaWFJdGVtKHZtLGh0bWwsaik7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhX2l0ZW1zLnB1c2gobWVkaWFfaXRlbSk7XHJcblxyXG4gICAgICAgICAgICB2bS50aHVtYm5haWxzLnB1c2goZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJykpO1xyXG4gICAgICAgICAgICB2bS50aHVtYm5haWxzW2pdLmNsYXNzTGlzdC5hZGQoJ2Ryb3BzaGFkb3cnKTtcclxuICAgICAgICAgICAgdm0udGh1bWJuYWlsc1tqXS5zcmMgPSB0aHVtYm5haWxzW2pdO1xyXG5cclxuICAgICAgICAgICAgdm0uY29sbWQuYXBwZW5kQ2hpbGQodm0ubWVkaWFfaXRlbXNbal0uaHRtbCk7XHJcbiAgICAgICAgICAgIHZtLmNvbG1kLmFwcGVuZENoaWxkKHZtLnRodW1ibmFpbHNbal0pO1xyXG4gICAgICAgICAgICB2bS5yb3cuYXBwZW5kQ2hpbGQodm0uY29sbWQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICAgI21lZGlhLXNlbGVjdGVkXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIC5vdmVybGF5XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKS5kcm9wc2hhZG93XHJcbiAgICAgICAgLy8gICAgICAgICAgLnJvdy5qdXN0aWZ5LWNlbnRlci5tZWRpYS1jb250YWluZXJcclxuICAgICAgICAvLyAgICAgICAgICAgICAgLmNvbC1tZFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgLm1lZGlhLWl0ZW1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKS5kcm9wc2hhZG93XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIC5jb2wtbWRcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIC5tZWRpYS1pdGVtXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICBpbWcoc3JjPVwiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIikuZHJvcHNoYWRvd1xyXG5cclxuXHJcbiAgICAgICAgdm0ubWVkaWFfaXRlbXNbdm0uc2VsZWN0ZWRdLmh0bWwuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcclxuICAgICAgICAvLyB2bS5lbGVtZW50cy5wdXNoKHZtLmVsZW1lbnRzWzBdKTtcclxuICAgICAgICAvLyB2bS5lbGVtZW50cy5zaGlmdCgpO1xyXG4gICAgICAgIC8vIHZtLnNldElkKGlkKTtcclxuICAgICAgICAvLyB2bS5sb2FkTWVkaWEoMCk7XHJcblxyXG4gICAgfVxyXG4gICAgY3JlYXRlRnJhZ21lbnQoc3RyOiBzdHJpbmcsIHdpZHRoPzogbnVtYmVyLCBoZWlnaHQ/OiBudW1iZXIgKSB7XHJcbiAgICAgICAgdmFyIG5ld3N0ciA9IHN0cjtcclxuICAgICAgICBpZih3aWR0aCl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBuZXdzdHIgPSBzdHIucmVwbGFjZSgnd2lkdGg9XCJcXGQrXCIgaGVpZ2h0PVwiXFxkK1wiJywgJ3dpZHRoPVwiJyt3aWR0aCsnXCIgaGVpZ2h0PVwiJytoZWlnaHQrJ1wiJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcblxyXG4gICAgICAgIHZhciBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgPSBzdHI7XHJcblxyXG4gICAgICAgIHdoaWxlIChlbGVtLmNoaWxkTm9kZXNbMF0pIHtcclxuICAgICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChlbGVtLmNoaWxkTm9kZXNbMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZnJhZztcclxuICAgIH1cclxuXHJcbiAgICBzZXRJZChpZDogc3RyaW5nKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICB3aGlsZShwYXJlbnQuZmlyc3RDaGlsZCl7XHJcbiAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChwYXJlbnQuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh2bS5tZWRpYV9zZWxlY3RlZCk7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHZtLnJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2l6ZSgpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5vdmVybGF5LnN0eWxlLndpZHRoID0gKHZtLm1lZGlhX3NlbGVjdGVkLmNsaWVudFdpZHRoKzEyKSsncHgnO1xyXG4gICAgICAgIHZtLm92ZXJsYXkuc3R5bGUuaGVpZ2h0ID0gKHZtLm1lZGlhX3NlbGVjdGVkLmNsaWVudEhlaWdodCs4KSsncHgnO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRNZWRpYSh0aHVtYl9udW06bnVtYmVyKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS5tZWRpYV9zZWxlY3RlZC5yZW1vdmVDaGlsZCh2bS5tZWRpYV9zZWxlY3RlZC5maXJzdENoaWxkKTtcclxuICAgICAgICB2bS5vdmVybGF5LmNsYXNzTGlzdC5hZGQoJ2Nsb3NlLW1lZGlhJyk7XHJcblxyXG4gICAgICAgIHZtLnNpemUoKTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHZtLm1lZGlhX2l0ZW1zLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgdm0ubWVkaWFfaXRlbXNbaV0uaHRtbC5zdHlsZS53aWR0aCA9IHZtLmNvbG1kLmNsaWVudFdpZHRoKydweCc7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhX2l0ZW1zW2ldLmh0bWwuc3R5bGUuaGVpZ2h0ID0gdm0uY29sbWQuY2xpZW50SGVpZ2h0KydweCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih2bS52aW1lbyAmJiB0aHVtYl9udW0gPT09IDApe1xyXG4gICAgICAgICAgICAgICAgdm0uZWxlbWVudHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIHZhciBmcmFnID0gdm0uY3JlYXRlRnJhZ21lbnQodm0udmltZW8sIHZtLm1lZGlhX3NlbGVjdGVkLmNsaWVudFdpZHRoLCB2bS5tZWRpYV9zZWxlY3RlZC5jbGllbnRIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgdm0uZWxlbWVudHMudW5zaGlmdChmcmFnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2bS5vdmVybGF5LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuICAgICAgICAgICAgICAgIC8vIHZtLmVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQoJ2Ryb3BzaGFkb3cnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2bS5vdmVybGF5LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLypidXR0b24gdHJhbnNpdGlvbiovXHJcbiAgICAgICAgdm0ubWVkaWFfaXRlbXNbdm0uc2VsZWN0ZWRdLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcclxuICAgICAgICB2bS5zZWxlY3RlZCA9IHRodW1iX251bTtcclxuICAgICAgICB2bS5tZWRpYV9pdGVtc1t2bS5zZWxlY3RlZF0uaHRtbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG5cclxuICAgICAgICAvKnBpY3R1cmUgdHJhbnNpdGlvbiovXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgLy8gaWYodm0udmltZW8gJiYgdm0uc2VsZWN0ZWQgPT09IDApe1xyXG5cclxuICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgaWYgKHZtLm1lZGlhX3NlbGVjdGVkLmNoaWxkcmVuLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQucmVtb3ZlQ2hpbGQodm0ubWVkaWFfc2VsZWN0ZWQubGFzdENoaWxkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQuYXBwZW5kQ2hpbGQodm0uZWxlbWVudHNbdm0uc2VsZWN0ZWRdKTtcclxuICAgICAgICAgICAgdm0ub3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdjbG9zZS1tZWRpYScpO1xyXG4gICAgICAgICAgICB2bS5tZWRpYV9pdGVtc1t2bS5zZWxlY3RlZF0uaHRtbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgIH0sIDYwMCk7ICAgXHJcbiAgICB9XHJcbn0iLCJleHBvcnQgKiBmcm9tIFwiLi9za2lsbF9iYWRnZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNraWxsIHtcclxuICBmbGV4X2l0ZW06IEhUTUxEaXZFbGVtZW50O1xyXG4gIHN2ZzogU1ZHU1ZHRWxlbWVudDtcclxuICBzdmdfY2lyY2xlOiBTVkdDaXJjbGVFbGVtZW50O1xyXG4gIHNjYWxlX2JveDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgaW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgdGV4dDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgZmxleF9ncmlkX2lkOiBzdHJpbmc7XHJcbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjbGFzc3BlcmNlbnQ6IHN0cmluZywgaW1hZ2U6IHN0cmluZywgZmxleF9ncmlkX2lkOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICB2bS5mbGV4X2dyaWRfaWQgPSBmbGV4X2dyaWRfaWQ7XHJcblxyXG4gICAgdm0uZmxleF9pdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB2bS5mbGV4X2l0ZW0uY2xhc3NOYW1lICs9ICdmbGV4LWl0ZW0nO1xyXG5cclxuICAgIHZtLnN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwic3ZnXCIpXHJcbiAgICB2bS5zdmcuc2V0QXR0cmlidXRlKCdjbGFzcycsIGNsYXNzcGVyY2VudClcclxuICAgIHZtLnN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzg0Jyk7XHJcbiAgICB2bS5zdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnODQnKTtcclxuXHJcbiAgICB2bS5zdmdfY2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ2NpcmNsZScpO1xyXG4gICAgdm0uc3ZnX2NpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnY2xhc3MnLCAnb3V0ZXInKTtcclxuICAgIHZtLnN2Z19jaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgXCJjeFwiLCAnLTQyJyk7XHJcbiAgICB2bS5zdmdfY2lyY2xlLnNldEF0dHJpYnV0ZU5TKG51bGwsIFwiY3lcIiwgJzQyJyk7XHJcbiAgICB2bS5zdmdfY2lyY2xlLnNldEF0dHJpYnV0ZU5TKG51bGwsIFwiclwiLCAnMzcnKTtcclxuICAgIHZtLnN2Z19jaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgXCJ0cmFuc2Zvcm1cIiwgXCJyb3RhdGUoLTkwLCAwLCAwKVwiKTtcclxuXHJcbiAgICB2bS5zY2FsZV9ib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGlmIChuYW1lID09PSBcIlR5cGUgU2NyaXB0XCIgfHwgbmFtZSA9PT0gXCJCb290c3RyYXBcIiB8fCBuYW1lID09PSBcIkQzLmpzXCIgfHwgbmFtZSA9PT0gXCJQaG90b3Nob3BcIiB8fCBuYW1lID09PSBcIklsbHVzdHJhdG9yXCIgfHwgbmFtZSA9PT0gXCJBZnRlciBFZmZlY3RzXCIgfHwgbmFtZSA9PT0gXCJNYXlhXCIgfHwgbmFtZSA9PT0gXCJNdWRib3hcIikge1xyXG4gICAgICB2bS5zY2FsZV9ib3guY2xhc3NOYW1lICs9ICdzY2FsZS1ib3gtc3F1YXJlJztcclxuICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gXCJVbml0eVwiIHx8IG5hbWUgPT09IFwiUGhhc2VyLmpzXCIgfHwgbmFtZSA9PT0gXCJEMy5qc1wiIHx8IG5hbWUgPT09IFwiU0NTU1wiIHx8IG5hbWUgPT09IFwiSmF2YVwiIHx8IG5hbWUgPT09IFwiUHl0aG9uXCIpIHtcclxuICAgICAgdm0uc2NhbGVfYm94LmNsYXNzTmFtZSArPSAnc2NhbGUtYm94LW1pZCc7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdm0uc2NhbGVfYm94LmNsYXNzTmFtZSArPSAnc2NhbGUtYm94JztcclxuICAgIH1cclxuXHJcbiAgICB2bS5pbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgdm0uaW1hZ2Uuc3JjID0gaW1hZ2U7XHJcblxyXG4gICAgdm0udGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdm0udGV4dC5jbGFzc05hbWUgKz0gJ3RleHQnO1xyXG4gICAgdm0udGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShuYW1lKSk7XHJcblxyXG4gICAgLy8gLmZsZXgtaXRlbVxyXG4gICAgLy8gICAgICAgc3ZnLmNpcmNsZS03NSh3aWR0aD0nODQnLCBoZWlnaHQ9Jzg0JylcclxuICAgIC8vICAgICAgICAgY2lyY2xlLm91dGVyKGN4PSctNDInLCBjeT0nNDInLCByPSczNycgdHJhbnNmb3JtPVwicm90YXRlKC05MCwgMCwgMClcIikgXHJcbiAgICAvLyAgICAgICAuc2NhbGUtYm94XHJcbiAgICAvLyAgICAgICAgIGltZyhpZD1cImZvdXJcIilcclxuICAgIC8vICAgICAgICAgLnRleHQgYWJjXHJcbiAgICB2bS5mbGV4X2l0ZW0uYXBwZW5kQ2hpbGQodm0uc3ZnKTtcclxuICAgIHZtLnN2Zy5hcHBlbmRDaGlsZCh2bS5zdmdfY2lyY2xlKTtcclxuICAgIHZtLmZsZXhfaXRlbS5hcHBlbmRDaGlsZCh2bS5zY2FsZV9ib3gpO1xyXG4gICAgdm0uc2NhbGVfYm94LmFwcGVuZENoaWxkKHZtLmltYWdlKTtcclxuICAgIHZtLmZsZXhfaXRlbS5hcHBlbmRDaGlsZCh2bS50ZXh0KTtcclxuICB9XHJcbiAgcmVzZXRJZChpZDogc3RyaW5nKXtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZtLmZsZXhfZ3JpZF9pZCA9IGlkO1xyXG4gIH1cclxuXHJcbiAgYXBwZW5kKCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdmFyIGZsZXhfZ3JpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHZtLmZsZXhfZ3JpZF9pZCk7XHJcbiAgICBmbGV4X2dyaWQuYXBwZW5kQ2hpbGQodm0uZmxleF9pdGVtKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNraWxsSW5mbyB7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIGNsYXNzOiBzdHJpbmc7XHJcbiAgaW1hZ2U6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbGxlY3Rpb24ge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgaW1hZ2VzOiBJU2tpbGxJbmZvW107XHJcbiAgcGF0aDogc3RyaW5nO1xyXG4gIHNraWxsczogU2tpbGxbXTtcclxuICBmbGV4X2dyaWRfaWQ6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nLCBmbGV4X2dyaWRfaWQ6IHN0cmluZywgaW1hZ2VzOiBJU2tpbGxJbmZvW10sIGlkPzogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICBcclxuICAgIHZtLmltYWdlcyA9IGltYWdlcztcclxuICAgIHZtLnBhdGggPSBwYXRoO1xyXG4gICAgdm0uZmxleF9ncmlkX2lkID0gZmxleF9ncmlkX2lkO1xyXG5cclxuICAgIHZtLnNraWxscyA9IFtdO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW1hZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZtLnNraWxscy5wdXNoKG5ldyBTa2lsbChpbWFnZXNbaV0ubmFtZSwgaW1hZ2VzW2ldLmNsYXNzLCB2bS5wYXRoICsgaW1hZ2VzW2ldLmltYWdlLCB2bS5mbGV4X2dyaWRfaWQpKTtcclxuICAgIH1cclxuICAgIGlmKGlkKXtcclxuICAgICAgdm0uaWQgPSBpZDtcclxuICAgICAgdmFyIGVsZW1lbnQgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodm0uaWQpO1xyXG4gICAgICBlbGVtZW50Lm9ubW91c2V1cCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdm0ubG9hZCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVzZXRJZHMoaWQ6IHN0cmluZyl7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2bS5mbGV4X2dyaWRfaWQgPSBpZDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdm0uc2tpbGxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZtLnNraWxsc1tpXS5yZXNldElkKHZtLmZsZXhfZ3JpZF9pZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbG9hZCgpIHsgLy9zZXRzIHNyYydzIHRvIHRoZSBkb20uIHRoZW4gb25jZSBldmVyeXRoaW5nIGlzIGxvYWRlZCwgaXQgYWRkcyBjbGFzcyBhY3RpdmUgdG8gbWFrZSB0aGVtIGFwcGVhciB2aWEgY3NzXHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2YXIgZmxleF9ncmlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodm0uZmxleF9ncmlkX2lkKTtcclxuICAgIHdoaWxlIChmbGV4X2dyaWQuZmlyc3RDaGlsZCkge1xyXG4gICAgICBmbGV4X2dyaWQucmVtb3ZlQ2hpbGQoZmxleF9ncmlkLmZpcnN0Q2hpbGQpO1xyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5za2lsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdm0uc2tpbGxzW2ldLmFwcGVuZCgpO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyBwdWJsaWMgY2xvc2UoKXtcclxuICAvLyAgIGNvbnN0IHZtID0gdGhpcztcclxuICAvLyAgIHZhciBmbGV4X2dyaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh2bS5mbGV4X2dyaWRfaWQpO1xyXG4gIC8vICAgd2hpbGUgKGZsZXhfZ3JpZC5maXJzdENoaWxkKSB7XHJcbiAgLy8gICAgIGZsZXhfZ3JpZC5yZW1vdmVDaGlsZChmbGV4X2dyaWQuZmlyc3RDaGlsZCk7XHJcbiAgLy8gICB9XHJcbiAgLy8gfVxyXG59XHJcbiJdfQ==
