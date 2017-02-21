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
var qbert_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Maya', "class": 'circle-100', "image": 'maya.png' },
    { "name": 'Photoshop', "class": 'circle-25', "image": 'photoshop-cc.svg' }
]);
var weather_stack = new skill_badge.Collection('./skills/', '', [{ "name": 'Angular JS', "class": 'circle-100', "image": 'angular-icon.svg' },
    { "name": 'D3.js', "class": 'circle-50', "image": 'd3-2.svg' }
]);
// var breathless_media = new media.Media('media-0', ["./portfolio/breathless.jpg","./portfolio/breathless.jpg","./portfolio/cat.jpg"], ["./portfolio/breathless.jpg","./portfolio/cat.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
var m = [];
m.push(new media.Media('', ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"], ["./portfolio/breathless_play.jpg", "./portfolio/breathless_gameplay_2.jpg", "./portfolio/breathless_gameplay.jpg", "./portfolio/breathless_controls.jpg"]));
m.push(new media.Media('', ["./portfolio/qbert_play.jpg", "./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], ["./portfolio/qbert_player.jpg", "./portfolio/qbert_snake.jpg"], '<iframe src="https://player.vimeo.com/video/198149795" width="471" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));
m.push(new media.Media('', ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"], ["./portfolio/cgi_final_1.png", "./portfolio/cgi_final_3.png", "./portfolio/cgi_final_2.png"]));
m.push(new media.Media('', ['./portfolio/mean_forecast_1.jpg', './portfolio/mean_forecast_2.jpg'], ['./portfolio/mean_forecast_1.jpg', './portfolio/mean_forecast_2.jpg']));
var portfolio = new Portfolio('portfolio', [
    { title: 'Breathless', title_image: './portfolio/breathless.jpg', desc: "The Space Pirate, Aria, is on a mission to loot a mineral cargo ship. However, upon landing on the cargo ship, Aria's helmet cracks causing her to slowly lose oxygen. It's now a race against time to collect all the gems before her oxygen runs out!", stack: breathless_stack, media: m[0], type: 'HTML5 Game', url: '/breathless' },
    { title: 'Mean Forecast', title_image: './portfolio/mean_forecast_1.jpg', desc: 'A small web app that calculates the average of 3 weather API\'s: Wunderground, Forecast.io, and World Weather Online. This data is then served onto a D3.js Line Chart for temperature, humidty, and windspeed. Also the webapp itself has many subtleties that are affected by weather data. For example, the video  resembles the current weather. Also each graph is color coated by a gradient based on the weather data.', stack: weather_stack, media: m[3], type: 'Website', url: '/meanforecast' },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvanVtcC5qcy9kaXN0L2p1bXAuanMiLCJzcmMvaW1hZ2VfY2FudmFzLnRzIiwic3JjL21haW4udHMiLCJzcmMvbWVkaWEudHMiLCJzcmMvc2tpbGxfYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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RUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMxQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3hCLENBQUM7SUFDSCxDQUFDO0lBUUgsaUJBQUM7QUFBRCxDQXJEQSxBQXFEQyxJQUFBO0FBckRZLGdDQUFVIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGdsb2JhbC5KdW1wID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4vLyBSb2JlcnQgUGVubmVyJ3MgZWFzZUluT3V0UXVhZFxuXG4vLyBmaW5kIHRoZSByZXN0IG9mIGhpcyBlYXNpbmcgZnVuY3Rpb25zIGhlcmU6IGh0dHA6Ly9yb2JlcnRwZW5uZXIuY29tL2Vhc2luZy9cbi8vIGZpbmQgdGhlbSBleHBvcnRlZCBmb3IgRVM2IGNvbnN1bXB0aW9uIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qYXhnZWxsZXIvZXouanNcblxudmFyIGVhc2VJbk91dFF1YWQgPSBmdW5jdGlvbiBlYXNlSW5PdXRRdWFkKHQsIGIsIGMsIGQpIHtcbiAgdCAvPSBkIC8gMjtcbiAgaWYgKHQgPCAxKSByZXR1cm4gYyAvIDIgKiB0ICogdCArIGI7XG4gIHQtLTtcbiAgcmV0dXJuIC1jIC8gMiAqICh0ICogKHQgLSAyKSAtIDEpICsgYjtcbn07XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqO1xufSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG59O1xuXG52YXIganVtcGVyID0gZnVuY3Rpb24ganVtcGVyKCkge1xuICAvLyBwcml2YXRlIHZhcmlhYmxlIGNhY2hlXG4gIC8vIG5vIHZhcmlhYmxlcyBhcmUgY3JlYXRlZCBkdXJpbmcgYSBqdW1wLCBwcmV2ZW50aW5nIG1lbW9yeSBsZWFrc1xuXG4gIHZhciBlbGVtZW50ID0gdm9pZCAwOyAvLyBlbGVtZW50IHRvIHNjcm9sbCB0byAgICAgICAgICAgICAgICAgICAobm9kZSlcblxuICB2YXIgc3RhcnQgPSB2b2lkIDA7IC8vIHdoZXJlIHNjcm9sbCBzdGFydHMgICAgICAgICAgICAgICAgICAgIChweClcbiAgdmFyIHN0b3AgPSB2b2lkIDA7IC8vIHdoZXJlIHNjcm9sbCBzdG9wcyAgICAgICAgICAgICAgICAgICAgIChweClcblxuICB2YXIgb2Zmc2V0ID0gdm9pZCAwOyAvLyBhZGp1c3RtZW50IGZyb20gdGhlIHN0b3AgcG9zaXRpb24gICAgICAocHgpXG4gIHZhciBlYXNpbmcgPSB2b2lkIDA7IC8vIGVhc2luZyBmdW5jdGlvbiAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbilcbiAgdmFyIGExMXkgPSB2b2lkIDA7IC8vIGFjY2Vzc2liaWxpdHkgc3VwcG9ydCBmbGFnICAgICAgICAgICAgIChib29sZWFuKVxuXG4gIHZhciBkaXN0YW5jZSA9IHZvaWQgMDsgLy8gZGlzdGFuY2Ugb2Ygc2Nyb2xsICAgICAgICAgICAgICAgICAgICAgKHB4KVxuICB2YXIgZHVyYXRpb24gPSB2b2lkIDA7IC8vIHNjcm9sbCBkdXJhdGlvbiAgICAgICAgICAgICAgICAgICAgICAgIChtcylcblxuICB2YXIgdGltZVN0YXJ0ID0gdm9pZCAwOyAvLyB0aW1lIHNjcm9sbCBzdGFydGVkICAgICAgICAgICAgICAgICAgICAobXMpXG4gIHZhciB0aW1lRWxhcHNlZCA9IHZvaWQgMDsgLy8gdGltZSBzcGVudCBzY3JvbGxpbmcgdGh1cyBmYXIgICAgICAgICAgKG1zKVxuXG4gIHZhciBuZXh0ID0gdm9pZCAwOyAvLyBuZXh0IHNjcm9sbCBwb3NpdGlvbiAgICAgICAgICAgICAgICAgICAocHgpXG5cbiAgdmFyIGNhbGxiYWNrID0gdm9pZCAwOyAvLyB0byBjYWxsIHdoZW4gZG9uZSBzY3JvbGxpbmcgICAgICAgICAgICAoZnVuY3Rpb24pXG5cbiAgLy8gc2Nyb2xsIHBvc2l0aW9uIGhlbHBlclxuXG4gIGZ1bmN0aW9uIGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB3aW5kb3cuc2Nyb2xsWSB8fCB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gIH1cblxuICAvLyBlbGVtZW50IG9mZnNldCBoZWxwZXJcblxuICBmdW5jdGlvbiB0b3AoZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHN0YXJ0O1xuICB9XG5cbiAgLy8gckFGIGxvb3AgaGVscGVyXG5cbiAgZnVuY3Rpb24gbG9vcCh0aW1lQ3VycmVudCkge1xuICAgIC8vIHN0b3JlIHRpbWUgc2Nyb2xsIHN0YXJ0ZWQsIGlmIG5vdCBzdGFydGVkIGFscmVhZHlcbiAgICBpZiAoIXRpbWVTdGFydCkge1xuICAgICAgdGltZVN0YXJ0ID0gdGltZUN1cnJlbnQ7XG4gICAgfVxuXG4gICAgLy8gZGV0ZXJtaW5lIHRpbWUgc3BlbnQgc2Nyb2xsaW5nIHNvIGZhclxuICAgIHRpbWVFbGFwc2VkID0gdGltZUN1cnJlbnQgLSB0aW1lU3RhcnQ7XG5cbiAgICAvLyBjYWxjdWxhdGUgbmV4dCBzY3JvbGwgcG9zaXRpb25cbiAgICBuZXh0ID0gZWFzaW5nKHRpbWVFbGFwc2VkLCBzdGFydCwgZGlzdGFuY2UsIGR1cmF0aW9uKTtcblxuICAgIC8vIHNjcm9sbCB0byBpdFxuICAgIHdpbmRvdy5zY3JvbGxUbygwLCBuZXh0KTtcblxuICAgIC8vIGNoZWNrIHByb2dyZXNzXG4gICAgdGltZUVsYXBzZWQgPCBkdXJhdGlvbiA/IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCkgLy8gY29udGludWUgc2Nyb2xsIGxvb3BcbiAgICA6IGRvbmUoKTsgLy8gc2Nyb2xsaW5nIGlzIGRvbmVcbiAgfVxuXG4gIC8vIHNjcm9sbCBmaW5pc2hlZCBoZWxwZXJcblxuICBmdW5jdGlvbiBkb25lKCkge1xuICAgIC8vIGFjY291bnQgZm9yIHJBRiB0aW1lIHJvdW5kaW5nIGluYWNjdXJhY2llc1xuICAgIHdpbmRvdy5zY3JvbGxUbygwLCBzdGFydCArIGRpc3RhbmNlKTtcblxuICAgIC8vIGlmIHNjcm9sbGluZyB0byBhbiBlbGVtZW50LCBhbmQgYWNjZXNzaWJpbGl0eSBpcyBlbmFibGVkXG4gICAgaWYgKGVsZW1lbnQgJiYgYTExeSkge1xuICAgICAgLy8gYWRkIHRhYmluZGV4IGluZGljYXRpbmcgcHJvZ3JhbW1hdGljIGZvY3VzXG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcblxuICAgICAgLy8gZm9jdXMgdGhlIGVsZW1lbnRcbiAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICAvLyBpZiBpdCBleGlzdHMsIGZpcmUgdGhlIGNhbGxiYWNrXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG5cbiAgICAvLyByZXNldCB0aW1lIGZvciBuZXh0IGp1bXBcbiAgICB0aW1lU3RhcnQgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIEFQSVxuXG4gIGZ1bmN0aW9uIGp1bXAodGFyZ2V0KSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgLy8gcmVzb2x2ZSBvcHRpb25zLCBvciB1c2UgZGVmYXVsdHNcbiAgICBkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb24gfHwgMTAwMDtcbiAgICBvZmZzZXQgPSBvcHRpb25zLm9mZnNldCB8fCAwO1xuICAgIGNhbGxiYWNrID0gb3B0aW9ucy5jYWxsYmFjazsgLy8gXCJ1bmRlZmluZWRcIiBpcyBhIHN1aXRhYmxlIGRlZmF1bHQsIGFuZCB3b24ndCBiZSBjYWxsZWRcbiAgICBlYXNpbmcgPSBvcHRpb25zLmVhc2luZyB8fCBlYXNlSW5PdXRRdWFkO1xuICAgIGExMXkgPSBvcHRpb25zLmExMXkgfHwgZmFsc2U7XG5cbiAgICAvLyBjYWNoZSBzdGFydGluZyBwb3NpdGlvblxuICAgIHN0YXJ0ID0gbG9jYXRpb24oKTtcblxuICAgIC8vIHJlc29sdmUgdGFyZ2V0XG4gICAgc3dpdGNoICh0eXBlb2YgdGFyZ2V0ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZih0YXJnZXQpKSB7XG4gICAgICAvLyBzY3JvbGwgZnJvbSBjdXJyZW50IHBvc2l0aW9uXG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBlbGVtZW50ID0gdW5kZWZpbmVkOyAvLyBubyBlbGVtZW50IHRvIHNjcm9sbCB0b1xuICAgICAgICBhMTF5ID0gZmFsc2U7IC8vIG1ha2Ugc3VyZSBhY2Nlc3NpYmlsaXR5IGlzIG9mZlxuICAgICAgICBzdG9wID0gc3RhcnQgKyB0YXJnZXQ7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBzY3JvbGwgdG8gZWxlbWVudCAobm9kZSlcbiAgICAgIC8vIGJvdW5kaW5nIHJlY3QgaXMgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBlbGVtZW50ID0gdGFyZ2V0O1xuICAgICAgICBzdG9wID0gdG9wKGVsZW1lbnQpO1xuICAgICAgICBicmVhaztcblxuICAgICAgLy8gc2Nyb2xsIHRvIGVsZW1lbnQgKHNlbGVjdG9yKVxuICAgICAgLy8gYm91bmRpbmcgcmVjdCBpcyByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnRcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG4gICAgICAgIHN0b3AgPSB0b3AoZWxlbWVudCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIHJlc29sdmUgc2Nyb2xsIGRpc3RhbmNlLCBhY2NvdW50aW5nIGZvciBvZmZzZXRcbiAgICBkaXN0YW5jZSA9IHN0b3AgLSBzdGFydCArIG9mZnNldDtcblxuICAgIC8vIHJlc29sdmUgZHVyYXRpb25cbiAgICBzd2l0Y2ggKF90eXBlb2Yob3B0aW9ucy5kdXJhdGlvbikpIHtcbiAgICAgIC8vIG51bWJlciBpbiBtc1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uO1xuICAgICAgICBicmVhaztcblxuICAgICAgLy8gZnVuY3Rpb24gcGFzc2VkIHRoZSBkaXN0YW5jZSBvZiB0aGUgc2Nyb2xsXG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbihkaXN0YW5jZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIHN0YXJ0IHRoZSBsb29wXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgfVxuXG4gIC8vIGV4cG9zZSBvbmx5IHRoZSBqdW1wIG1ldGhvZFxuICByZXR1cm4ganVtcDtcbn07XG5cbi8vIGV4cG9ydCBzaW5nbGV0b25cblxudmFyIHNpbmdsZXRvbiA9IGp1bXBlcigpO1xuXG5yZXR1cm4gc2luZ2xldG9uO1xuXG59KSkpO1xuIiwiXHJcbmV4cG9ydCAqIGZyb20gXCIuL2ltYWdlX2NhbnZhc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsZXJwKGZyb206IG51bWJlciwgdG86IG51bWJlciwgcGVyY2VudDogbnVtYmVyKSB7XHJcbiAgdmFyIGRpZmZlcmFuY2UgPSB0byAtIGZyb207XHJcbiAgcmV0dXJuIGZyb20gKyAoZGlmZmVyYW5jZSAqIHBlcmNlbnQpO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEltZyB7XHJcbiAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICBpbWFnZTogSFRNTEltYWdlRWxlbWVudFxyXG4gIHc6IG51bWJlcjtcclxuICBoOiBudW1iZXI7XHJcbiAgeF9vZmZzZXRfZGVzdDogbnVtYmVyO1xyXG4gIHlfb2Zmc2V0X2Rlc3Q6IG51bWJlcjtcclxuICB4X29mZnNldDogbnVtYmVyO1xyXG4gIHlfb2Zmc2V0OiBudW1iZXI7XHJcbiAgYW5jaG9yWDogbnVtYmVyO1xyXG4gIGFuY2hvclk6IG51bWJlcjtcclxuXHJcbiAgaW1nV2lkdGg6IG51bWJlcjtcclxuICBzY3JlZW5XaWR0aDogbnVtYmVyO1xyXG4gIHNjYWxlWDogbnVtYmVyO1xyXG4gIHNjYWxlWTogbnVtYmVyO1xyXG4gIHNjYWxlOiBudW1iZXI7XHJcbiAgaW1nSGVpZ2h0OiBudW1iZXI7XHJcbiAgc2NyZWVuSGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gIGxvYWRlZDogYm9vbGVhbjtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2bS5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIHZtLmN0eCA9IHZtLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgdm0udyA9IHZtLmNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgdm0uaCA9IHZtLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB2bS5pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgdm0uaW1hZ2Uuc3JjID0gJ2NpdHkuanBnJztcclxuICAgIHZtLmxvYWRlZCA9IGZhbHNlO1xyXG5cclxuICAgIHZtLmltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdm0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgdm0uc2l6ZSh2bS53LCB2bS5oKTtcclxuICAgICAgdm0uZHJhdygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHNpemUodywgaCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgIHZtLncgPSB2bS5jYW52YXMud2lkdGggPSB3O1xyXG4gICAgdm0uaCA9IHZtLmNhbnZhcy5oZWlnaHQgPSBoO1xyXG5cclxuICAgIC8qZ2V0cyBzY2FsZVggYmFzZWQgb24gc2NyZWVuIGFuZCBpbWFnZSB3aWR0aCAqL1xyXG4gICAgdm0uaW1nV2lkdGggPSB2bS5pbWFnZS5uYXR1cmFsV2lkdGg7XHJcbiAgICB2bS5zY3JlZW5XaWR0aCA9IHc7XHJcbiAgICB2bS5zY2FsZVggPSB2bS5zY3JlZW5XaWR0aCAvIHZtLmltZ1dpZHRoO1xyXG5cclxuICAgIC8qZ2V0cyBzY2FsZVkgYmFzZWQgb24gc2NyZWVuIGFuZCBpbWFnZSB3aWR0aCAqL1xyXG4gICAgdm0uaW1nSGVpZ2h0ID0gdm0uaW1hZ2UubmF0dXJhbEhlaWdodDtcclxuICAgIHZtLnNjcmVlbkhlaWdodCA9IGg7XHJcbiAgICB2bS5zY2FsZVkgPSB2bS5zY3JlZW5IZWlnaHQgLyB2bS5pbWdIZWlnaHQ7XHJcblxyXG5cclxuICAgIC8qc2V0cyBiYXNpYyBzY2FsZSB0byBYICovXHJcblxyXG4gICAgdm0uc2NhbGUgPSB2bS5zY2FsZVhcclxuICAgIGlmICh2bS5zY2FsZVggPCB2bS5zY2FsZVkpIHtcclxuICAgICAgdm0uc2NhbGUgPSB2bS5zY2FsZVk7XHJcbiAgICB9XHJcblxyXG4gICAgdm0uaW1nV2lkdGggKj0gdm0uc2NhbGUgKiAxLjA1O1xyXG4gICAgdm0uaW1nSGVpZ2h0ICo9IHZtLnNjYWxlICogMS4wNTtcclxuXHJcbiAgICB2bS5hbmNob3JYID0gKHZtLmltZ1dpZHRoIC0gdm0uc2NyZWVuV2lkdGgpO1xyXG4gICAgdm0uYW5jaG9yWSA9ICh2bS5pbWdIZWlnaHQgLSB2bS5zY3JlZW5IZWlnaHQpO1xyXG5cclxuICAgIHZtLnhfb2Zmc2V0X2Rlc3QgPSB2bS54X29mZnNldCA9IHZtLmFuY2hvclg7XHJcbiAgICB2bS55X29mZnNldF9kZXN0ID0gdm0ueV9vZmZzZXQgPSB2bS5hbmNob3JZO1xyXG5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3KCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgLy8gdm0uY3R4LmNsZWFyUmVjdCgwLDAsdm0udywgdm0uaCk7XHJcblxyXG4gICAgdm0uY3R4LmRyYXdJbWFnZSh2bS5pbWFnZSwgdm0ueF9vZmZzZXQsIHZtLnlfb2Zmc2V0LCB2bS5pbWFnZS5uYXR1cmFsV2lkdGgsIHZtLmltYWdlLm5hdHVyYWxIZWlnaHQsIDAsIDAsIHZtLmltZ1dpZHRoLCB2bS5pbWdIZWlnaHQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFwcCB7XHJcbiAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICB3OiBudW1iZXI7XHJcbiAgaDogbnVtYmVyO1xyXG4gIC8vIHJlY3Q6IFJlY3RhbmdsZVxyXG4gIGltZzogSW1nO1xyXG5cclxuICBtb3VzZUluOiBib29sZWFuO1xyXG4gIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xyXG5cclxuICAgIHZhciBpc01vYmlsZSA9IGZhbHNlOyAvL2luaXRpYXRlIGFzIGZhbHNlXHJcbiAgICAvLyBkZXZpY2UgZGV0ZWN0aW9uXHJcbiAgICBpZiAoLyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlwYWR8aXJpc3xraW5kbGV8QW5kcm9pZHxTaWxrfGxnZSB8bWFlbW98bWlkcHxtbXB8bmV0ZnJvbnR8b3BlcmEgbShvYnxpbilpfHBhbG0oIG9zKT98cGhvbmV8cChpeGl8cmUpXFwvfHBsdWNrZXJ8cG9ja2V0fHBzcHxzZXJpZXMoNHw2KTB8c3ltYmlhbnx0cmVvfHVwXFwuKGJyb3dzZXJ8bGluayl8dm9kYWZvbmV8d2FwfHdpbmRvd3MgKGNlfHBob25lKXx4ZGF8eGlpbm8vaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpIHx8IC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudC5zdWJzdHIoMCwgNCkpKSBpc01vYmlsZSA9IHRydWU7XHJcblxyXG4gICAgaWYgKGlzTW9iaWxlKSB7XHJcbiAgICAgIHZhciBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgICBpbWFnZS5zcmMgPSAnY2l0eS5qcGcnO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcy1jb250YWluZXInKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWxjb21lLXBhZ2UnKS5pbnNlcnRCZWZvcmUoaW1hZ2UsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMtdGV4dC1vdmVybGF5JykpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuXHJcblxyXG5cclxuICAgICAgdm0uY2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcclxuICAgICAgdm0uY3R4ID0gdm0uY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG5cclxuXHJcbiAgICAgIHZtLnNpemVDYW52YXMoKTtcclxuICAgICAgLy8gdm0uaW5pdEV2ZW50cygpO1xyXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0KSA9PiB7IHZtLmRyYXcodCk7IH0pO1xyXG5cclxuICAgICAgdm0uaW1nID0gbmV3IEltZyh2bS53LCB2bS5oKTtcclxuXHJcbiAgICAgIHZtLm1vdXNlSW4gPSBmYWxzZTtcclxuXHJcbiAgICAgIHZtLmNvbnRhaW5lciA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzLWNvbnRhaW5lcicpO1xyXG5cclxuICAgICAgdm0uY29udGFpbmVyLm9ubW91c2Vtb3ZlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2bS5kcmF3SW1nSW4oMCwgZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZtLmNvbnRhaW5lci5vbm1vdXNlZW50ZXIgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZtLm1vdXNlSW4gPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2bS5jb250YWluZXIub25tb3VzZW91dCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdm0ubW91c2VJbiA9IGZhbHNlO1xyXG4gICAgICAgIHZtLmRyYXdJbWdPdXQoMCwgZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBzaXplQ2FudmFzKCkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdm0uY2FudmFzLnN0eWxlLndpZHRoID0gJzEwMCUnO1xyXG4gICAgdm0uY2FudmFzLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcclxuICAgIHRoaXMudyA9IHRoaXMuY2FudmFzLndpZHRoID0gdm0uY2FudmFzLm9mZnNldFdpZHRoO1xyXG4gICAgdGhpcy5oID0gdGhpcy5jYW52YXMuaGVpZ2h0ID0gdm0uY2FudmFzLm9mZnNldEhlaWdodDtcclxuXHJcbiAgICBpZiAodm0uaW1nKSB7XHJcbiAgICAgIHZtLmltZy5zaXplKHZtLncsIHZtLmgpO1xyXG4gICAgICB2bS5pbWcuZHJhdygpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcbiAgcHVibGljIGRyYXcodDogYW55KSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0KSA9PiB7IHRoaXMuZHJhdyh0KTsgfSk7XHJcbiAgICB2bS5jdHguY2xlYXJSZWN0KDAsIDAsIHZtLncsIHZtLmgpO1xyXG5cclxuICAgIHZtLmN0eC5kcmF3SW1hZ2Uodm0uaW1nLmNhbnZhcywgMCwgMCk7XHJcbiAgICB2bS5pbWcuZHJhdygpO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd0ltZ0luKHQ6IGFueSwgZTogYW55KSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG5cclxuICAgIC8qcmF0aW8gPSAoaW1nV2lkdGggLyBzY3JlZW5XaWR0aCkgICovXHJcblxyXG4gICAgdmFyIG1vdmVSYXRpb1ggPSAoZS5jbGllbnRYIC8gdm0uaW1nLnNjcmVlbldpZHRoKTsgLy9yYW5nZSBmcm9tIFswLCAxXTogMCBiZWluZyBsZWZ0LCAxIGJlaW5nIHJpZ2h0XHJcbiAgICB2YXIgbW92ZU9mZnNldFggPSAtdm0uaW1nLmFuY2hvclggKyAobW92ZVJhdGlvWCAqIHZtLmltZy5hbmNob3JYKTtcclxuXHJcbiAgICB2YXIgbW92ZVJhdGlvWSA9IChlLmNsaWVudFkgLyB2bS5pbWcuc2NyZWVuSGVpZ2h0KTsgLy9yYW5nZSBmcm9tIFswLCAxXTogMCBiZWluZyBsZWZ0LCAxIGJlaW5nIHJpZ2h0XHJcbiAgICB2YXIgbW92ZU9mZnNldFkgPSAtdm0uaW1nLmFuY2hvclkgKyAobW92ZVJhdGlvWSAqIHZtLmltZy5hbmNob3JZKTtcclxuXHJcblxyXG4gICAgLypvZmZzZXQgPSBtaWRkbGVfYW5jaG9yICsgZHJhZ2dlZF9vZmZzZXQqL1xyXG4gICAgdm0uaW1nLnhfb2Zmc2V0X2Rlc3QgPSB2bS5pbWcuYW5jaG9yWCArIG1vdmVPZmZzZXRYO1xyXG4gICAgdm0uaW1nLnlfb2Zmc2V0X2Rlc3QgPSB2bS5pbWcuYW5jaG9yWSArIG1vdmVPZmZzZXRZO1xyXG5cclxuICAgIGlmICh2bS5tb3VzZUluID09PSB0cnVlICYmIE1hdGgucm91bmQodm0uaW1nLnlfb2Zmc2V0KSAhPT0gTWF0aC5yb3VuZCh2bS5pbWcueV9vZmZzZXRfZGVzdCkgJiYgTWF0aC5yb3VuZCh2bS5pbWcueF9vZmZzZXQpICE9PSBNYXRoLnJvdW5kKHZtLmltZy54X29mZnNldF9kZXN0KSkge1xyXG5cclxuXHJcbiAgICAgIHZtLmltZy54X29mZnNldCA9IE1hdGgucm91bmQobGVycCh2bS5pbWcueF9vZmZzZXQsIHZtLmltZy54X29mZnNldF9kZXN0LCAwLjEpKTtcclxuICAgICAgdm0uaW1nLnlfb2Zmc2V0ID0gTWF0aC5yb3VuZChsZXJwKHZtLmltZy55X29mZnNldCwgdm0uaW1nLnlfb2Zmc2V0X2Rlc3QsIDAuMSkpO1xyXG5cclxuICAgICAgLy8gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodCkgPT4geyB2bS5kcmF3SW1nSW4odCwgZSkgfSk7XHJcblxyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3SW1nT3V0KHQ6IGFueSwgZTogYW55KSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcblxyXG4gICAgLypyYXRpbyA9IChpbWdXaWR0aCAvIHNjcmVlbldpZHRoKSAgKi9cclxuXHJcbiAgICAvLyB2YXIgbW92ZVJhdGlvWCA9IChlLmNsaWVudFggLyB2bS5pbWcuc2NyZWVuV2lkdGgpOyAvL3JhbmdlIGZyb20gWzAsIDFdOiAwIGJlaW5nIGxlZnQsIDEgYmVpbmcgcmlnaHRcclxuICAgIC8vIHZhciBtb3ZlT2Zmc2V0WCA9IC12bS5pbWcuYW5jaG9yWCArIChtb3ZlUmF0aW9YICogdm0uaW1nLmFuY2hvclggKiAyKTtcclxuXHJcbiAgICAvLyB2YXIgbW92ZVJhdGlvWSA9IChlLmNsaWVudFkgLyB2bS5pbWcuc2NyZWVuSGVpZ2h0KSAqIDI7IC8vcmFuZ2UgZnJvbSBbMCwgMV06IDAgYmVpbmcgbGVmdCwgMSBiZWluZyByaWdodFxyXG4gICAgLy8gdmFyIG1vdmVPZmZzZXRZID0gLXZtLmltZy5hbmNob3JZICsgKG1vdmVSYXRpb1kgKiB2bS5pbWcuYW5jaG9yWSk7XHJcblxyXG5cclxuICAgIC8qb2Zmc2V0ID0gbWlkZGxlX2FuY2hvciArIGRyYWdnZWRfb2Zmc2V0Ki9cclxuICAgIHZtLmltZy54X29mZnNldF9kZXN0ID0gdm0uaW1nLmFuY2hvclg7XHJcbiAgICB2bS5pbWcueV9vZmZzZXRfZGVzdCA9IHZtLmltZy5hbmNob3JZO1xyXG5cclxuICAgIGlmICh2bS5tb3VzZUluID09PSBmYWxzZSAmJiBNYXRoLnJvdW5kKHZtLmltZy55X29mZnNldCkgIT09IE1hdGgucm91bmQodm0uaW1nLnlfb2Zmc2V0X2Rlc3QpICYmIE1hdGgucm91bmQodm0uaW1nLnhfb2Zmc2V0KSAhPT0gTWF0aC5yb3VuZCh2bS5pbWcueF9vZmZzZXRfZGVzdCkpIHtcclxuXHJcblxyXG4gICAgICB2bS5pbWcueF9vZmZzZXQgPSBsZXJwKHZtLmltZy54X29mZnNldCwgdm0uaW1nLnhfb2Zmc2V0X2Rlc3QsIDAuMSk7XHJcbiAgICAgIHZtLmltZy55X29mZnNldCA9IGxlcnAodm0uaW1nLnlfb2Zmc2V0LCB2bS5pbWcueV9vZmZzZXRfZGVzdCwgMC4xKTtcclxuXHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHQpID0+IHsgdm0uZHJhd0ltZ091dCh0LCBlKSB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgLy8gaW5pdEV2ZW50cygpIHtcclxuICAvLyAgIHdpbmRvdy5vbnJlc2l6ZSA9IChlKSA9PiB7XHJcbiAgLy8gICAgIHRoaXMuc2l6ZUNhbnZhcygpO1xyXG4gIC8vICAgfTtcclxuICAvLyB9XHJcblxyXG59IiwiaW1wb3J0ICogYXMganVtcCBmcm9tIFwianVtcC5qc1wiO1xyXG5cclxuaW1wb3J0ICogYXMgaW1hZ2VfY2FudmFzIGZyb20gXCIuL2ltYWdlX2NhbnZhc1wiO1xyXG5cclxuaW1wb3J0ICogYXMgc2tpbGxfYmFkZ2UgZnJvbSBcIi4vc2tpbGxfYmFkZ2VcIjtcclxuXHJcbmltcG9ydCAqIGFzIG1lZGlhIGZyb20gXCIuL21lZGlhXCI7XHJcblxyXG4vL3lvb1xyXG5jb25zdCB0aW1lb3V0Om51bWJlciA9IDEwMDA7XHJcblxyXG52YXIgZnJvbnRlbmQgPSBuZXcgc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbignLi9za2lsbHMvJywgJ2ZsZXgtZ3JpZDEnLCBbICB7XCJuYW1lXCI6ICdIVE1MNScsICAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0xMDAnLCBcImltYWdlXCI6J2h0bWw1LnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdKYXZhIFNjcmlwdCcsICAgICBcImNsYXNzXCI6J2NpcmNsZS0xMDAnLCBcImltYWdlXCI6J2phdmFzY3JpcHQtMi5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnQm9vdHN0cmFwJywgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMTAwJywgXCJpbWFnZVwiOidib290c3RyYXAtNC5zdmcnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdBbmd1bGFyIEpTJywgICAgICBcImNsYXNzXCI6J2NpcmNsZS03NScsIFwiaW1hZ2VcIjonYW5ndWxhci1pY29uLnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdUeXBlIFNjcmlwdCcsICAgICBcImNsYXNzXCI6J2NpcmNsZS03NScsIFwiaW1hZ2VcIjondHlwZXNjcmlwdC5zdmcnfSwgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0d1bHAnLCAgICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTc1JywgXCJpbWFnZVwiOidndWxwLnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdDU1MzJywgICAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS01MCcsIFwiaW1hZ2VcIjonY3NzLTMuc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ2pRdWVyeScsICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTUwJywgXCJpbWFnZVwiOidqcXVlcnktMS5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnU0NTUycsICAgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J3Nhc3MtMS5zdmcnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdEMy5qcycsICAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS0yNScsIFwiaW1hZ2VcIjonZDMtMi5zdmcnfV0sICdmcm9udGVuZCcpO1xyXG52YXIgc29mdGVuZyA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnZmxleC1ncmlkMicsICAgIFt7XCJuYW1lXCI6ICdKYXZhJywgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTc1JywgXCJpbWFnZVwiOidqYXZhLTE0LnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ1B5dGhvbicsICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J3B5dGhvbi01LnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0MrKycsICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTI1JywgXCJpbWFnZVwiOidjLXNlZWtsb2dvLmNvbS5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdOb2RlIEpTJywgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMjUnLCBcImltYWdlXCI6J25vZGVqcy1pY29uLnN2Zyd9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ0MjJywgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMjUnLCBcImltYWdlXCI6J2NzaGFycC5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdVbml0eScsICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTI1JywgXCJpbWFnZVwiOid1bml0eS5zdmcnfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdBbmRyb2lkIFN0dWRpbycsICBcImNsYXNzXCI6J2NpcmNsZS0yNScsIFwiaW1hZ2VcIjonQW5kcm9pZF9zdHVkaW8uc3ZnJ31dLCAnc29mdGVuZycpO1xyXG52YXIgZGVzaWduID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICdmbGV4LWdyaWQzJywgICAgICAgW3tcIm5hbWVcIjogJ1Bob3Rvc2hvcCcsICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTUwJywgXCJpbWFnZVwiOidwaG90b3Nob3AtY2Muc3ZnJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdJbGx1c3RyYXRvcicsICAgICBcImNsYXNzXCI6J2NpcmNsZS01MCcsIFwiaW1hZ2VcIjonYWRvYmUtaWxsdXN0cmF0b3ItY2Muc3ZnJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdNYXlhJywgICAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS01MCcsIFwiaW1hZ2VcIjonbWF5YS5wbmcnfSwgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnQWZ0ZXIgRWZmZWN0cycsICAgXCJjbGFzc1wiOidjaXJjbGUtMjUnLCBcImltYWdlXCI6J2FmdGVyLWVmZmVjdHMtY2Muc3ZnJ30sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnTXVkYm94JywgICAgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMjUnLCBcImltYWdlXCI6J211ZGJveC5wbmcnfV0sICdkZXNpZ24nKTtcclxuZnJvbnRlbmQubG9hZCgpO1xyXG5zb2Z0ZW5nLmxvYWQoKTtcclxuZGVzaWduLmxvYWQoKTtcclxuXHJcblxyXG52YXIgYXBwO1xyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCBldmVudCApIHtcclxuICAgIGFwcCA9IG5ldyBpbWFnZV9jYW52YXMuQXBwKCk7XHJcbn0pO1xyXG5cclxuXHJcbi8vIHdpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uKCl7XHJcbi8vICAgICBjb25zb2xlLmxvZyh3aW5kb3cuc2Nyb2xsWSk7XHJcbi8vIH1cclxuXHJcblxyXG4vLyB2YXIgdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid3JhcHBlci0wXCIpO1xyXG4vLyB2YXIgYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwMScpO1xyXG5cclxuXHJcbi8vIGIub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcbi8vICAgICBpZih3LmNsYXNzTGlzdFsxXSA9PT0gXCJvcGVuXCIpe1xyXG4vLyAgICAgICAgIHcuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4vLyAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICB3LmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuLy8gICAgIH1cclxuLy8gfVxyXG5cclxuZXhwb3J0IGNsYXNzIFBvcnRmb2xpb0l0ZW0ge1xyXG4gICAgdGl0bGU6IHN0cmluZzsgXHJcbiAgICB0aXRsZV9pbWFnZTogc3RyaW5nOyBcclxuICAgIGRlc2M6IHN0cmluZztcclxuICAgIHN0YWNrOiBza2lsbF9iYWRnZS5Db2xsZWN0aW9uOyBcclxuICAgIHBvcnRfaW1hZ2U6IHN0cmluZztcclxuICAgIHVybDogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBpdGVtX251bTogbnVtYmVyO1xyXG5cclxuICAgIGNvbF9zaXplOiBzdHJpbmc7XHJcbiAgICBjb2w6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gICAgdGV4dDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBzdWJfdGV4dDogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgb3BlbjogYm9vbGVhbjtcclxuICAgIG1lZGlhOm1lZGlhLk1lZGlhO1xyXG4gICAgdGFyZ2V0X3dyYXBwZXI6IFdyYXBwZXI7XHJcbiAgICBwb3J0Zm9saW86IFBvcnRmb2xpbztcclxuICAgIHJvdzogbnVtYmVyO1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKHBvcnRmb2xpbzogUG9ydGZvbGlvLCBpdGVtX251bTogbnVtYmVyLCAgdGl0bGU6IHN0cmluZywgdGl0bGVfaW1hZ2U6IHN0cmluZywgZGVzYzogc3RyaW5nLCBzdGFjazogc2tpbGxfYmFkZ2UuQ29sbGVjdGlvbiwgbWVkaWE6bWVkaWEuTWVkaWEsIHR5cGU6IHN0cmluZywgdXJsOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICB2bS5wb3J0Zm9saW8gPSBwb3J0Zm9saW87XHJcbiAgICB2bS5pdGVtX251bSA9IGl0ZW1fbnVtO1xyXG4gICAgdm0udGl0bGUgPSB0aXRsZTtcclxuICAgIHZtLnRpdGxlX2ltYWdlID0gdGl0bGVfaW1hZ2U7XHJcbiAgICB2bS5kZXNjID0gZGVzYztcclxuICAgIHZtLnN0YWNrID0gc3RhY2s7XHJcbiAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgdm0udXJsID0gdXJsO1xyXG4gICAgdm0uY29sX3NpemUgPSBcImNvbC1tZC0zXCI7XHJcbiAgICBcclxuXHJcbiAgICB2bS5jb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHZtLmNvbC5jbGFzc0xpc3QuYWRkKHZtLmNvbF9zaXplKTtcclxuXHJcbiAgICB2YXIgY2FyZF9zaGFkb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGNhcmRfc2hhZG93LmNsYXNzTGlzdC5hZGQoJ2NhcmQtZHJvcHNoYWRvdycsICdyb3cnKTtcclxuXHJcbiAgICB2YXIgbm9wYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIG5vcGFkLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsJ25vcGFkJyk7XHJcblxyXG4gICAgdm0uaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICB2bS5pbWcuc3JjID0gdm0udGl0bGVfaW1hZ2U7XHJcblxyXG4gICAgdmFyIGNvbDEyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBjb2wxMi5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInKTtcclxuXHJcbiAgICB2bS50ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB2bS50ZXh0LmNsYXNzTGlzdC5hZGQoJ3RleHQnLCAncGFkZGluZy10b3AnKTtcclxuICAgIHZtLnRleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGl0bGUpKTtcclxuXHJcbiAgICB2YXIgY29sMTJfMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgY29sMTJfMi5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInKTtcclxuXHJcbiAgICB2bS5zdWJfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdm0uc3ViX3RleHQuY2xhc3NMaXN0LmFkZCgndGV4dF9saWdodCcpO1xyXG4gICAgdm0uc3ViX3RleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodHlwZSkpO1xyXG5cclxuICAgIC8vIC5jb2wtbWQtM1xyXG4gICAgLy8gICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpI3AxXHJcbiAgICAvLyAgICAgICAudGV4dCBCcmVhdGhsZXNzOiBIVE1MNSBHYW1lXHJcblxyXG4gICAgLy8gLmNvbC1tZC0zXHJcbiAgICAvLyAgICAgICAuY2FyZC1kcm9wc2hhZG93LnJvd1xyXG4gICAgLy8gICAgICAgICAuY29sLW1kLTEyLm5vcGFkXHJcbiAgICAvLyAgICAgICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpI3AxLmRyb3BzaGFkb3dcclxuICAgIC8vICAgICAgICAgLmNvbC1tZC0xMlxyXG4gICAgLy8gICAgICAgICAgIC50ZXh0IEJyZWF0aGxlc3NcclxuICAgIC8vICAgICAgICAgLmNvbC1tZC0xMlxyXG4gICAgLy8gICAgICAgICAgIC50ZXh0X2xpZ2h0IEhUTUw1IEdhbWVcclxuXHJcbiAgICB2bS5jb2wuYXBwZW5kQ2hpbGQoY2FyZF9zaGFkb3cpO1xyXG4gICAgY2FyZF9zaGFkb3cuYXBwZW5kQ2hpbGQobm9wYWQpO1xyXG4gICAgbm9wYWQuYXBwZW5kQ2hpbGQodm0uaW1nKTtcclxuICAgIGNhcmRfc2hhZG93LmFwcGVuZENoaWxkKGNvbDEyKTtcclxuICAgIGNvbDEyLmFwcGVuZENoaWxkKHZtLnRleHQpO1xyXG4gICAgY2FyZF9zaGFkb3cuYXBwZW5kQ2hpbGQoY29sMTJfMik7XHJcbiAgICBjb2wxMl8yLmFwcGVuZENoaWxkKHZtLnN1Yl90ZXh0KTtcclxuXHJcbiAgICB2bS5vcGVuID0gZmFsc2U7XHJcbiAgICBcclxuICAgIHZtLmNvbC5vbmNsaWNrID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAvLyAgIGNvbnNvbGUuKHZtLml0ZW1zWzBdKTtcclxuICAgICAgICB2YXIgZGlmZmVyZW50X3dyYXBwZXIgPSBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICBkaWZmZXJlbnRfd3JhcHBlciA9IHZtLnBvcnRmb2xpby5jbG9zZSh2bS5pdGVtX251bSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdm0ub3BlbiA9IHZtLnRhcmdldF93cmFwcGVyLnRyYW5zaXRpb25XcmFwcGVyKGRpZmZlcmVudF93cmFwcGVyLCB2bS5vcGVuLCB2bS50aXRsZSwgdm0uZGVzYywgdm0uc3RhY2ssIHZtLm1lZGlhLCB2bS51cmwpXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAganVtcCgnI3dyYXBwZXItJyt2bS5yb3csIHtcclxuICAgICAgICAgICAgZHVyYXRpb246IDEwMDAsXHJcbiAgICAgICAgICAgIG9mZnNldDogLXZtLmNvbC5jbGllbnRIZWlnaHQgLSAzNVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgfSwgdGltZW91dCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gICB2bS5zZXREYXRhKCk7ICBcclxuICAgICAgfVxyXG4gICAgXHJcbiAgfVxyXG4gIGFwcGVuZChyb3c6IG51bWJlciwgd3JhcHBlcjogV3JhcHBlcikge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdmFyIHJvd19lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvd18nK3Jvdyk7XHJcbiAgICByb3dfZWxlbWVudC5hcHBlbmRDaGlsZCh2bS5jb2wpO1xyXG4gICAgdm0udGFyZ2V0X3dyYXBwZXIgPSB3cmFwcGVyO1xyXG4gICAgdm0uc3RhY2suZmxleF9ncmlkX2lkID0gd3JhcHBlci5mbGV4X2dyaWQuaWQ7XHJcbiAgICB2bS5tZWRpYS5pZCA9ICdtZWRpYS0nK3JvdztcclxuICAgIHZtLnJvdyA9IHJvdztcclxuICB9XHJcbiAgc2V0Q29sKGNsYXNzTmFtZTogc3RyaW5nKXtcclxuICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICB2bS5jb2wuY2xhc3NMaXN0LnJlbW92ZSh2bS5jb2xfc2l6ZSk7XHJcbiAgICAgIHZtLmNvbF9zaXplID0gY2xhc3NOYW1lO1xyXG4gICAgICB2bS5jb2wuY2xhc3NMaXN0LmFkZCh2bS5jb2xfc2l6ZSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBQb3J0Zm9saW8ge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAganNvbl9vYmpzOiBJUG9ydGZvbGlvSXRlbVtdO1xyXG4gIHBhdGg6IHN0cmluZztcclxuICBpdGVtczogUG9ydGZvbGlvSXRlbVtdO1xyXG4gIHdyYXBwZXJzOiBXcmFwcGVyW107XHJcbiAgZmxleF9ncmlkX2lkOiBzdHJpbmc7XHJcbiAgcGVyX3JvdzpudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGpzb25fb2JqczogSVBvcnRmb2xpb0l0ZW1bXSkge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdm0uaWQgPSBpZDtcclxuICAgIHZtLmpzb25fb2JqcyA9IGpzb25fb2JqcztcclxuICAgICBcclxuXHJcbiAgICB2bS5pdGVtcyA9IFtdO1xyXG4gICAgdm0ud3JhcHBlcnMgPSBbXTtcclxuXHJcbiAgICAvL2FkZCB3cmFwcGVycyBiYXNlZCBvbiBhbGwgcG9zc2libGUgYnJlYWtwb2ludCB3aWR0aHMgKGpzb25fb2Jqcy8yKVxyXG4gICAgZm9yKHZhciBqID0gMDsgaiA8IE1hdGguY2VpbChqc29uX29ianMubGVuZ3RoLzIpOyBqKyspe1xyXG4gICAgICAgIHZtLndyYXBwZXJzLnB1c2gobmV3IFdyYXBwZXIoaikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vYWRkIGFsbCBpdGVtc1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5qc29uX29ianMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdm0uaXRlbXMucHVzaChuZXcgUG9ydGZvbGlvSXRlbSh2bSwgaSwganNvbl9vYmpzW2ldLnRpdGxlLCBqc29uX29ianNbaV0udGl0bGVfaW1hZ2UsIGpzb25fb2Jqc1tpXS5kZXNjLCBqc29uX29ianNbaV0uc3RhY2ssIGpzb25fb2Jqc1tpXS5tZWRpYSwganNvbl9vYmpzW2ldLnR5cGUsIGpzb25fb2Jqc1tpXS51cmwpKTtcclxuICAgIH1cclxuXHJcbiAgICB2bS5hcHBlbmRBbGwoKTtcclxuXHJcbiAgICBcclxuICB9XHJcblxyXG4gICAgcHVibGljIGFwcGVuZEFsbCgpeyAvL2FwcGVuZHMgUG9ydGZvbGlvSXRlbXMgYmFzZWQgb24gc2NyZWVuIHNpemU7IGdldHMgZGlnZXN0ZWRcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHNjcmVlbldpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblxyXG4gICAgICAgIC8vcmVhc3NpZ25zIGNvbHMgYmFzZWQgb24gYnJlYWtwb2ludHNcclxuICAgICAgICB2YXIgYnJlYWtwb2ludHMgPSBbe21pbjogMCwgbWF4Ojc2OCwgY29sX3NpemU6ICdjb2wteHMtNicsIHBlcl9yb3c6IDJ9LHttaW46IDc2OSwgbWF4Ojk5MiwgY29sX3NpemU6ICdjb2wteHMtNCcsIHBlcl9yb3c6IDN9LCB7bWluOiA5OTMsIG1heDoxMjAwLCBjb2xfc2l6ZTogJ2NvbC14cy0zJywgcGVyX3JvdzogNH0sIHttaW46IDEyMDAsIG1heDo5OTk5LCBjb2xfc2l6ZTogJ2NvbC14cy0zJywgcGVyX3JvdzogNH1dO1xyXG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGJyZWFrcG9pbnRzLmxlbmd0aDsgaSsrKXtcclxuXHJcbiAgICAgICAgICAgIC8vaWYgaW4gYnJlYWtwb2ludCByYW5nZSwgYW5kIG5vdCBzYW1lIGFzIGJlZm9yZVxyXG4gICAgICAgICAgICBpZigvKnZtLml0ZW1zWzBdLmNvbF9zaXplICE9PSBicmVha3BvaW50c1tpXS5jb2xfc2l6ZSAmJiAqL3NjcmVlbldpZHRoID4gYnJlYWtwb2ludHNbaV0ubWluICYmIHNjcmVlbldpZHRoIDwgYnJlYWtwb2ludHNbaV0ubWF4KXtcclxuICAgICAgICAgICAgICAgIC8vY2xlYXIgYWxsIHJvd3NcclxuICAgICAgICAgICAgICAgIHZtLnBlcl9yb3cgPSBicmVha3BvaW50c1tpXS5wZXJfcm93O1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3J0Zm9saW8nKTtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IHBhcmVudC5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGEgPSAxOyBhIDwgaXRlcmF0b3I7IGErKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHBhcmVudC5jaGlsZHJlblsxXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy9hZGQgbmV3IHJvd3MgYW5kIHdyYXBwZXJzXHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIHIgPSAwOyByIDwgTWF0aC5jZWlsKHZtLml0ZW1zLmxlbmd0aCAvIGJyZWFrcG9pbnRzW2ldLnBlcl9yb3cpOyByKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgICAgICByb3cuaWQgPSAncm93XycrcjtcclxuICAgICAgICAgICAgICAgICAgICByb3cuY2xhc3NMaXN0LmFkZCgncm93JywgJ25vbWFyJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB3cmFwcGVyID0gdm0ud3JhcHBlcnNbcl0uaHRtbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHJvdyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHdyYXBwZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9hZGQgY29scyB0byBuZXcgcm93c1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBqPTA7IGo8dm0uaXRlbXMubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLml0ZW1zW2pdLnNldENvbChicmVha3BvaW50c1tpXS5jb2xfc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvd19udW0gPSBNYXRoLmZsb29yKGovYnJlYWtwb2ludHNbaV0ucGVyX3Jvdyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uaXRlbXNbal0uYXBwZW5kKHJvd19udW0sIHZtLndyYXBwZXJzW3Jvd19udW1dKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgcHVibGljIGNsb3NlKGl0ZW1fbnVtOiBudW1iZXIpIHsgLy9jbG9zZXMgYWxsIHdyYXBwZXJzXHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAvL2Nsb3NlcyBhbGwgaXRlbXMgaW4gdGhlIHJvdyBvZiB0aGUgZ2l2ZW4gaXRlbS5cclxuICAgIHZhciByb3cgPSBNYXRoLmZsb29yKGl0ZW1fbnVtL3ZtLnBlcl9yb3cpO1xyXG5cclxuICAgIC8vIGZvcih2YXIgaiA9IChyb3cqdm0ucGVyX3Jvdyk7IGogPCAoKHJvdyp2bS5wZXJfcm93KSt2bS5wZXJfcm93KTsgaisrKXtcclxuICAgIC8vICAgICBpZihpdGVtX251bSAhPT0gaiAmJiB2bS5pdGVtc1tqXSl7XHJcbiAgICAvLyAgICAgICAgIHZtLml0ZW1zW2pdLm9wZW4gPSBmYWxzZTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcbiAgICB2YXIgcmV0dXJuX3ZhbHVlID0gZmFsc2U7XHJcblxyXG4gICAgZm9yKHZhciBqID0gMDsgaiA8IHZtLml0ZW1zLmxlbmd0aDsgaisrKXtcclxuICAgICAgICBpZihpdGVtX251bSAhPT0gaiAmJiB2bS5pdGVtc1tqXSl7XHJcbiAgICAgICAgICAgIHZtLml0ZW1zW2pdLm9wZW4gPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IodmFyIHIgPSAwOyByIDwgdm0ud3JhcHBlcnMubGVuZ3RoOyByKyspe1xyXG4gICAgICAgIGlmKHIgIT09IHJvdyAmJiB2bS53cmFwcGVyc1tyXS5odG1sLmNsYXNzTGlzdFsxXSA9PT0gJ29wZW4nKXtcclxuICAgICAgICAgICAgdm0ud3JhcHBlcnNbcl0uY2xvc2UoKTtcclxuICAgICAgICAgICAgcmV0dXJuX3ZhbHVlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0dXJuX3ZhbHVlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdyYXBwZXIge1xyXG4gICAgdGl0bGU6IHN0cmluZzsgXHJcbiAgICBkZXNjOiBzdHJpbmc7XHJcbiAgICBjb2xsZWN0aW9uOiBza2lsbF9iYWRnZS5Db2xsZWN0aW9uO1xyXG4gICAgcG9ydF9pbWFnZTogc3RyaW5nOyBcclxuICAgIG1lZGlhOiBtZWRpYS5NZWRpYTtcclxuICAgIHVybDogc3RyaW5nO1xyXG4gICAgXHJcblxyXG4gICAgaHRtbDpIVE1MRGl2RWxlbWVudDtcclxuICAgIHRpdGxlX2VsZW1lbnQ6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBkZXNjcmlwdGlvbjpIVE1MRGl2RWxlbWVudDtcclxuICAgIHN0YWNrOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgZmxleF9ncmlkOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgZGVtbzpIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbDU6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBkZXNjcmlwdGlvbl90ZXh0OiBUZXh0O1xyXG4gICAgdGl0bGVfZWxlbWVudF90ZXh0OiBUZXh0O1xyXG4gICAgbGluazpIVE1MRGl2RWxlbWVudDtcclxuICAgIGxpbmtfdGV4dDpIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbDY6SFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgY2hhbmdlOmJvb2xlYW47XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHJvd19udW0pe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgdm0uY2hhbmdlID0gZmFsc2U7XHJcbiAgICAgICAgLy8gdm0udGl0bGUgPSBwSXRlbS50aXRsZTtcclxuICAgICAgICAvLyB2bS5kZXNjID0gcEl0ZW0uZGVzYztcclxuICAgICAgICAvLyB2bS5zdGFjayA9IHBJdGVtLnN0YWNrO1xyXG4gICAgICAgIC8vIHZtLnBvcnRfaW1hZ2UgPSBwSXRlbS5wb3J0X2ltYWdlO1xyXG4gICAgICAgIHZtLmh0bWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5odG1sLmlkID0gJ3dyYXBwZXItJytyb3dfbnVtO1xyXG4gICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LmFkZCgnd3JhcHBlcicpO1xyXG5cclxuICAgICAgICB2YXIgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgcm93LmlkID0gJ2NvbnRlbnQnO1xyXG4gICAgICAgIHJvdy5jbGFzc0xpc3QuYWRkKCdyb3cnLCAnbm9tYXInKTtcclxuXHJcbiAgICAgICAgdm0udGl0bGVfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTEyJywgJ2Rlc2MtdGV4dCcsICdwYWQtc3BhY2luZycpO1xyXG4gICAgICAgIHZtLnRpdGxlX2VsZW1lbnRfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcclxuICAgICAgICB2bS50aXRsZV9lbGVtZW50LmFwcGVuZENoaWxkKHZtLnRpdGxlX2VsZW1lbnRfdGV4dCk7XHJcblxyXG4gICAgICAgIHZhciBjb2w2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29sNi5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInLCAnY29sLW1kLTYnLCAnY29sLWxnLTcnLCAncm93JywgJ25vbWFyJywgJ25vcGFkJyk7XHJcblxyXG4gICAgICAgIHZhciByb3dfZmlsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHJvd19maWxsLmNsYXNzTGlzdC5hZGQoJ3JvdycsJ2p1c3RpZnktY2VudGVyJywgJ25vbWFyJyk7XHJcblxyXG4gICAgICAgIHZhciBjb2wxMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbDEyLmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicpO1xyXG5cclxuICAgICAgICB2bS5jb2w2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uY29sNi5pZCA9ICdtZWRpYS0nK3Jvd19udW07XHJcbiAgICAgICAgdm0uY29sNi5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInLCAnY29sLW1kLTYnLCAnY29sLWxnLTUnKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbDNfMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbDNfMi5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInLCAnY29sLW1kLTMnLCAnbm9wYWQtbGVmdCcpO1xyXG5cclxuICAgICAgICB2bS5kZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmRlc2NyaXB0aW9uLmNsYXNzTGlzdC5hZGQoJ2hlYWRlci10ZXh0JywgJ3BhZC1zcGFjaW5nJyk7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb24uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0Rlc2NyaXB0aW9uJykpO1xyXG5cclxuICAgICAgICB2YXIgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRlc2MuY2xhc3NMaXN0LmFkZCgnZGVzY3JpcHRpb24tdGV4dCcsICdwYWQtc3BhY2luZycpO1xyXG4gICAgICAgIHZtLmRlc2NyaXB0aW9uX3RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XHJcbiAgICAgICAgZGVzYy5hcHBlbmRDaGlsZCh2bS5kZXNjcmlwdGlvbl90ZXh0KTtcclxuXHJcbiAgICAgICAgdm0uc3RhY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5zdGFjay5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInLCAnY29sLW1kLTEyJywgJ2NvbC1sZy03Jyk7XHJcbiAgICAgICAgLy8gdm0uc3RhY2suYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1N0YWNrJykpO1xyXG5cclxuICAgICAgICB2YXIgc3RhY2tfdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBzdGFja190aXRsZS5jbGFzc0xpc3QuYWRkKCdoZWFkZXItdGV4dCcsICdwYWQtc3BhY2luZycpXHJcbiAgICAgICAgc3RhY2tfdGl0bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1N0YWNrJykpO1xyXG5cclxuICAgICAgICB2bS5mbGV4X2dyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5mbGV4X2dyaWQuaWQgPSAncGZsZXgtZ3JpZC0nK3Jvd19udW07XHJcbiAgICAgICAgdm0uZmxleF9ncmlkLmNsYXNzTGlzdC5hZGQoJ3JvdycsJ3BvcnRmb2xpby1mbGV4JywgJ2NvbC14cy0xMicpO1xyXG5cclxuICAgICAgICB2bS5kZW1vID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0uZGVtby5jbGFzc0xpc3QuYWRkKCdjb2wteHMtMTInLCAnY29sLW1kLTEyJywgJ2NvbC1sZy01Jyk7XHJcbiAgICAgICAgLy8gdm0uZGVtby5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTGl2ZSBEZW1vJykpO1xyXG5cclxuICAgICAgICB2YXIgZGVtb190aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRlbW9fdGl0bGUuY2xhc3NMaXN0LmFkZCgnaGVhZGVyLXRleHQnLCAncGFkLXNwYWNpbmcnKVxyXG4gICAgICAgIGRlbW9fdGl0bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1JlbGV2YW50IExpbmtzJykpO1xyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgdm0ubGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZtLmxpbmsuY2xhc3NMaXN0LmFkZCgnZ2l0aHViLWJ1dHRvbicsJ3JvdycsICdub21hcicpO1xyXG5cclxuICAgICAgICB2bS5saW5rX3RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5saW5rX3RleHQuY2xhc3NMaXN0LmFkZCgndGV4dCcpO1xyXG4gICAgICAgIHZtLmxpbmtfdGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTGl2ZSBMaW5rJykpOyAgICAgICAgXHJcblxyXG4gICAgICAgIHZtLmNvbDUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5jb2w1LmNsYXNzTGlzdC5hZGQoJ2NvbC14cy0xMicsICdjb2wtbWQtNScpO1xyXG5cclxuICAgICAgICAvKiBHT05OQSBIQVZFIFRPIEFERCBNRURJQSBEWU5BTUlDQUxMWSAqL1xyXG5cclxuICAgICAgICB2bS5odG1sLmFwcGVuZENoaWxkKHJvdyk7XHJcbiAgICAgICAgcm93LmFwcGVuZENoaWxkKHZtLnRpdGxlX2VsZW1lbnQpO1xyXG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZCh2bS5jb2w2KTtcclxuICAgICAgICByb3cuYXBwZW5kQ2hpbGQoY29sNik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgY29sNi5hcHBlbmRDaGlsZChjb2wxMik7XHJcbiAgICAgICAgY29sMTIuYXBwZW5kQ2hpbGQodm0uZGVzY3JpcHRpb24pO1xyXG4gICAgICAgIGNvbDEyLmFwcGVuZENoaWxkKGRlc2MpO1xyXG4gICAgICAgIGNvbDYuYXBwZW5kQ2hpbGQodm0uc3RhY2spXHJcbiAgICAgICAgdm0uc3RhY2suYXBwZW5kQ2hpbGQoc3RhY2tfdGl0bGUpO1xyXG4gICAgICAgIHZtLnN0YWNrLmFwcGVuZENoaWxkKHZtLmZsZXhfZ3JpZCk7XHJcbiAgICAgICAgY29sNi5hcHBlbmRDaGlsZCh2bS5kZW1vKVxyXG4gICAgICAgIHZtLmRlbW8uYXBwZW5kQ2hpbGQoZGVtb190aXRsZSk7XHJcbiAgICAgICAgdm0uZGVtby5hcHBlbmRDaGlsZCh2bS5saW5rKTtcclxuICAgICAgICB2bS5saW5rLmFwcGVuZENoaWxkKHZtLmxpbmtfdGV4dCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdm0ubGluay5vbmNsaWNrID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgbG9jYXRpb24uaHJlZiA9IHZtLnVybDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vI3dyYXBwZXItMC53cmFwcGVyLm9wZW5cclxuICAgICAgICAvLyAucm93I2NvbnRlbnRcclxuICAgICAgICAvLyAgIC5jb2wtbWQtMTIuZGVzYy10ZXh0IEJyZWF0aGxlc3NcclxuICAgICAgICAvLyAgIC5jb2wtbWQtNiNtZWRpYS0wXHJcbiAgICAgICAgLy8gICAuY29sLW1kLTYucm93XHJcbiAgICAgICAgLy8gICAgICAgLmNvbC1tZC0xMlxyXG4gICAgICAgIC8vICAgICAgICAgLmhlYWRlci10ZXh0LnBhZGRpbmctbGVmdCBEZXNjcmlwdGlvbjpcclxuICAgICAgICAvLyAgICAgICAgIC5kZXNjcmlwdGlvbi10ZXh0LnBhZGRpbmctbGVmdCBhc2RmYXNkZlxyXG4gICAgICAgIC8vICAgICAgIC5jb2wtbWQtNi5oZWFkZXItdGV4dCBTdGFjazpcclxuICAgICAgICAvLyAgICAgICAuY29sLW1kLTYuaGVhZGVyLXRleHQgTGl2ZSBEZW1vOlxyXG5cclxuICAgICAgICB2bS5odG1sLmFkZEV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmKHZtLmNoYW5nZSl7XHJcbiAgICAgICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHZtLnNldERhdGEoKTtcclxuICAgICAgICAgICAgICAgIHZtLmNoYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgIH1cclxuICAgIC8vIGNsb3NlRGF0YSgpe1xyXG4gICAgLy8gICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIC8vICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAvLyAgICAgICAgIHZtLmNvbGxlY3Rpb24uY2xvc2UoKTtcclxuICAgIC8vICAgICB9LHRpbWVvdXQpO1xyXG4gICAgICAgIFxyXG4gICAgLy8gfVxyXG5cclxuICAgIHNldERhdGEoKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uc2V0VGl0bGUoKTtcclxuICAgICAgICB2bS5zZXREZXNjKCk7XHJcbiAgICAgICAgdm0uc2V0U3RhY2soKTtcclxuICAgICAgICB2bS5zZXRNZWRpYSgpO1xyXG4gICAgICAgIC8vIHZtLnNldFN0YWNrKHN0YWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRUaXRsZSgpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS50aXRsZV9lbGVtZW50X3RleHQudGV4dENvbnRlbnQgPSB2bS50aXRsZTtcclxuICAgIH1cclxuICAgIHNldERlc2MoKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uZGVzY3JpcHRpb25fdGV4dC50ZXh0Q29udGVudCA9IHZtLmRlc2M7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U3RhY2soKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uY29sbGVjdGlvbi5yZXNldElkcyh2bS5mbGV4X2dyaWQuaWQpO1xyXG4gICAgICAgIHZtLmNvbGxlY3Rpb24ubG9hZCgpO1xyXG4gICAgfVxyXG4gICAgc2V0TWVkaWEoKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ubWVkaWEuc2V0SWQodm0ubWVkaWEuaWQpO1xyXG4gICAgICAgIHZtLm1lZGlhLmxvYWRNZWRpYSgwKTtcclxuICAgIH1cclxuICAgIGNsb3NlKCl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4gICAgfVxyXG4gICAgY2hhbmdlV3JhcHBlcihvcGVuOiBib29sZWFuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICAvL2Nsb3NlIHdyYXBwZXI6XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHZtLnRpdGxlID09PSB0aXRsZSl7IC8qKmlmIG5vIGNoYW5nZSAqL1xyXG4gICAgICAgICAgICB2bS5jaGFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKG9wZW4pe1xyXG4gICAgICAgICAgICAgICAgLy8gdm0uY2xvc2VEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZtLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgICAgICAgICB2bS5kZXNjID0gZGVzYztcclxuICAgICAgICAgICAgICAgIHZtLmNvbGxlY3Rpb24gPSBzdGFjaztcclxuICAgICAgICAgICAgICAgIHZtLm1lZGlhID0gbWVkaWE7XHJcbiAgICAgICAgICAgICAgICB2bS51cmwgPSB1cmw7XHJcbiAgICAgICAgICAgICAgICB2bS5zZXREYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmKHZtLmh0bWwuY2xhc3NMaXN0WzFdICE9PSAnb3BlbicpeyAvKippZiBhbGwgc2VsZWN0aW9ucyBhcmUgY2xvc2VkIGluaXRpYWxseS9jaGFuZ2Ugd2hlbiBjbG9zZWQqL1xyXG4gICAgICAgICAgICB2bS5jaGFuZ2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgdm0udGl0bGUgPSB0aXRsZTtcclxuICAgICAgICAgICAgdm0uZGVzYyA9IGRlc2M7XHJcbiAgICAgICAgICAgIHZtLmNvbGxlY3Rpb24gPSBzdGFjaztcclxuICAgICAgICAgICAgdm0ubWVkaWEgPSBtZWRpYTtcclxuICAgICAgICAgICAgdm0udXJsID0gdXJsO1xyXG4gICAgICAgICAgICB2bS5zZXREYXRhKCk7XHJcbiAgICAgICAgICAgIHZtLmh0bWwuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2bS5jaGFuZ2UgPSB0cnVlO1xyXG4gICAgICAgICAgICB2bS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgICAgICB2bS5kZXNjID0gZGVzYztcclxuICAgICAgICAgICAgdm0uY29sbGVjdGlvbiA9IHN0YWNrO1xyXG4gICAgICAgICAgICB2bS5tZWRpYSA9IG1lZGlhO1xyXG4gICAgICAgICAgICB2bS51cmwgPSB1cmw7XHJcbiAgICAgICAgICAgIC8vIHZtLmNsb3NlRGF0YSgpO1xyXG4gICAgICAgICAgICB2bS5odG1sLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2l0aW9uV3JhcHBlcihkaWZmZXJlbnRfd3JhcHBlcjpib29sZWFuLCBvcGVuOiBib29sZWFuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHJldHVybl92YWx1ZTtcclxuXHJcbiAgICAgICAgaWYoZGlmZmVyZW50X3dyYXBwZXIpe1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5fdmFsdWUgPSB2bS5jaGFuZ2VXcmFwcGVyKG9wZW4sIHRpdGxlLCBkZXNjLCBzdGFjaywgbWVkaWEsIHVybCk7XHJcbiAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xyXG4gICAgICAgIH0gZWxzZSBpZihvcGVuID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICBvcGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuX3ZhbHVlID0gdm0uY2hhbmdlV3JhcHBlcihvcGVuLCB0aXRsZSwgZGVzYywgc3RhY2ssIG1lZGlhLCB1cmwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybl92YWx1ZSA9IHZtLmNoYW5nZVdyYXBwZXIob3BlbiwgdGl0bGUsIGRlc2MsIHN0YWNrLCBtZWRpYSwgdXJsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldHVybl92YWx1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUG9ydGZvbGlvSXRlbSB7XHJcbiAgdGl0bGU6IHN0cmluZztcclxuICB0aXRsZV9pbWFnZTogc3RyaW5nOyBcclxuICBkZXNjOiBzdHJpbmc7XHJcbiAgc3RhY2s6IHNraWxsX2JhZGdlLkNvbGxlY3Rpb247XHJcbiAgbWVkaWE6IG1lZGlhLk1lZGlhOyBcclxuICB0eXBlOiBzdHJpbmc7XHJcbiAgdXJsOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8vIHtcIm5hbWVcIjogJ1B5dGhvbicsICAgICAgXCJjbGFzc1wiOidjaXJjbGUtNTAnLCBcImltYWdlXCI6J3B5dGhvbi01LnN2Zyd9XHJcbnZhciBicmVhdGhsZXNzX3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbICAge1wibmFtZVwiOiAnUGhhc2VyLmpzJywgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMTAwJywgXCJpbWFnZVwiOidwaGFzZXIuc3ZnJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcIm5hbWVcIjogJ1Bob3Rvc2hvcCcsICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjoncGhvdG9zaG9wLWNjLnN2Zyd9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdqUXVlcnknLCAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS01MCcsIFwiaW1hZ2VcIjonanF1ZXJ5LTEuc3ZnJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSk7XHJcbnZhciBxYmVydF9zdGFjayA9IG5ldyBza2lsbF9iYWRnZS5Db2xsZWN0aW9uKCcuL3NraWxscy8nLCAnJywgWyAgIHtcIm5hbWVcIjogJ01heWEnLCAgICAgICAgICAgIFwiY2xhc3NcIjonY2lyY2xlLTEwMCcsIFwiaW1hZ2VcIjonbWF5YS5wbmcnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1wibmFtZVwiOiAnUGhvdG9zaG9wJywgICAgICAgXCJjbGFzc1wiOidjaXJjbGUtMjUnLCBcImltYWdlXCI6J3Bob3Rvc2hvcC1jYy5zdmcnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuIHZhciB3ZWF0aGVyX3N0YWNrID0gbmV3IHNraWxsX2JhZGdlLkNvbGxlY3Rpb24oJy4vc2tpbGxzLycsICcnLCBbICB7XCJuYW1lXCI6ICdBbmd1bGFyIEpTJywgICAgICBcImNsYXNzXCI6J2NpcmNsZS0xMDAnLCBcImltYWdlXCI6J2FuZ3VsYXItaWNvbi5zdmcnfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJuYW1lXCI6ICdEMy5qcycsICAgICAgICAgICBcImNsYXNzXCI6J2NpcmNsZS01MCcsIFwiaW1hZ2VcIjonZDMtMi5zdmcnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIHZhciBicmVhdGhsZXNzX21lZGlhID0gbmV3IG1lZGlhLk1lZGlhKCdtZWRpYS0wJywgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9jYXQuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiXSwgJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzE5ODE0OTc5NVwiIHdpZHRoPVwiNDcxXCIgaGVpZ2h0PVwiMzM1XCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+Jyk7XHJcbiAgIFxyXG52YXIgbSA9IFtdXHJcblxyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX3BsYXkuanBnXCIsIFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheV8yLmpwZ1wiLFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheS5qcGdcIixcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfY29udHJvbHMuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzX3BsYXkuanBnXCIsIFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheV8yLmpwZ1wiLFwiLi9wb3J0Zm9saW8vYnJlYXRobGVzc19nYW1lcGxheS5qcGdcIixcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3NfY29udHJvbHMuanBnXCJdKSk7XHJcblxyXG5tLnB1c2gobmV3IG1lZGlhLk1lZGlhKCcnLCBbXCIuL3BvcnRmb2xpby9xYmVydF9wbGF5LmpwZ1wiLFwiLi9wb3J0Zm9saW8vcWJlcnRfcGxheWVyLmpwZ1wiLFwiLi9wb3J0Zm9saW8vcWJlcnRfc25ha2UuanBnXCJdLCBbXCIuL3BvcnRmb2xpby9xYmVydF9wbGF5ZXIuanBnXCIsXCIuL3BvcnRmb2xpby9xYmVydF9zbmFrZS5qcGdcIl0sICc8aWZyYW1lIHNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8xOTgxNDk3OTVcIiB3aWR0aD1cIjQ3MVwiIGhlaWdodD1cIjMzNVwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicpKTtcclxuXHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFtcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8xLnBuZ1wiLFwiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzMucG5nXCIsXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMi5wbmdcIl0sIFtcIi4vcG9ydGZvbGlvL2NnaV9maW5hbF8xLnBuZ1wiLFwiLi9wb3J0Zm9saW8vY2dpX2ZpbmFsXzMucG5nXCIsXCIuL3BvcnRmb2xpby9jZ2lfZmluYWxfMi5wbmdcIl0pKTtcclxuXHJcbm0ucHVzaChuZXcgbWVkaWEuTWVkaWEoJycsIFsnLi9wb3J0Zm9saW8vbWVhbl9mb3JlY2FzdF8xLmpwZycsICcuL3BvcnRmb2xpby9tZWFuX2ZvcmVjYXN0XzIuanBnJ10sIFsnLi9wb3J0Zm9saW8vbWVhbl9mb3JlY2FzdF8xLmpwZycsICcuL3BvcnRmb2xpby9tZWFuX2ZvcmVjYXN0XzIuanBnJ10pKVxyXG5cclxudmFyIHBvcnRmb2xpbyA9IG5ldyBQb3J0Zm9saW8oJ3BvcnRmb2xpbycsIFtcclxuICAgIHt0aXRsZTogJ0JyZWF0aGxlc3MnLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnJywgZGVzYzpcIlRoZSBTcGFjZSBQaXJhdGUsIEFyaWEsIGlzIG9uIGEgbWlzc2lvbiB0byBsb290IGEgbWluZXJhbCBjYXJnbyBzaGlwLiBIb3dldmVyLCB1cG9uIGxhbmRpbmcgb24gdGhlIGNhcmdvIHNoaXAsIEFyaWEncyBoZWxtZXQgY3JhY2tzIGNhdXNpbmcgaGVyIHRvIHNsb3dseSBsb3NlIG94eWdlbi4gSXQncyBub3cgYSByYWNlIGFnYWluc3QgdGltZSB0byBjb2xsZWN0IGFsbCB0aGUgZ2VtcyBiZWZvcmUgaGVyIG94eWdlbiBydW5zIG91dCFcIiwgc3RhY2s6YnJlYXRobGVzc19zdGFjaywgbWVkaWE6IG1bMF0sIHR5cGU6ICdIVE1MNSBHYW1lJywgdXJsIDogJy9icmVhdGhsZXNzJ30sXHJcbiAgICB7dGl0bGU6ICdNZWFuIEZvcmVjYXN0JywgdGl0bGVfaW1hZ2U6ICcuL3BvcnRmb2xpby9tZWFuX2ZvcmVjYXN0XzEuanBnJywgZGVzYzonQSBzbWFsbCB3ZWIgYXBwIHRoYXQgY2FsY3VsYXRlcyB0aGUgYXZlcmFnZSBvZiAzIHdlYXRoZXIgQVBJXFwnczogV3VuZGVyZ3JvdW5kLCBGb3JlY2FzdC5pbywgYW5kIFdvcmxkIFdlYXRoZXIgT25saW5lLiBUaGlzIGRhdGEgaXMgdGhlbiBzZXJ2ZWQgb250byBhIEQzLmpzIExpbmUgQ2hhcnQgZm9yIHRlbXBlcmF0dXJlLCBodW1pZHR5LCBhbmQgd2luZHNwZWVkLiBBbHNvIHRoZSB3ZWJhcHAgaXRzZWxmIGhhcyBtYW55IHN1YnRsZXRpZXMgdGhhdCBhcmUgYWZmZWN0ZWQgYnkgd2VhdGhlciBkYXRhLiBGb3IgZXhhbXBsZSwgdGhlIHZpZGVvICByZXNlbWJsZXMgdGhlIGN1cnJlbnQgd2VhdGhlci4gQWxzbyBlYWNoIGdyYXBoIGlzIGNvbG9yIGNvYXRlZCBieSBhIGdyYWRpZW50IGJhc2VkIG9uIHRoZSB3ZWF0aGVyIGRhdGEuJywgc3RhY2s6d2VhdGhlcl9zdGFjaywgbWVkaWE6IG1bM10sIHR5cGU6ICdXZWJzaXRlJywgdXJsIDogJy9tZWFuZm9yZWNhc3QnfSxcclxuICAgIHt0aXRsZTogJ1EqQmVydCcsIHRpdGxlX2ltYWdlOiBcIi4vcG9ydGZvbGlvL3FiZXJ0X3BsYXkuanBnXCIsIGRlc2M6J1RoaXMgaXMgbXkgQm91bmNpbmcgQmFsbCBBc3NpZ25tZW50IGZvciBBbmltYXRpb24gMSBhdCBEcmV4ZWwgVW5pdmVyc2l0eS4gV2hlbiBwaWNraW5nIGEgZ2FtZSB0aGF0IG1peGVzIG15IGxvdmUgb2YgcmV0cm8gdmlkZW8gZ2FtZXMgYW5kIGJvdW5jaW5nIGJhbGxzLCBRKkJlcnQgd2FzIGEgbm8tYnJhaW5lci4gRXZlcnl0aGluZyBpcyBpbmRpdmlkdWFsbHkgbW9kZWxsZWQsIHRleHR1cmVkLCBhbmQgYW5pbWF0ZWQgYnkgbWUuIE1hZGUgaW4gTWF5YSwgYW5kIHJlbmRlcmVkIGluIFYtUmF5LicsIHN0YWNrOnFiZXJ0X3N0YWNrLCBtZWRpYTogbVsxXSwgdHlwZTogJ0FuaW1hdGlvbicsIHVybCA6ICdodHRwczovL3ZpbWVvLmNvbS8xOTgxNDk3OTUnfSxcclxuICAgIHt0aXRsZTogJ0JlZHJvb20nLCB0aXRsZV9pbWFnZTogJy4vcG9ydGZvbGlvL2NnaV9maW5hbF8xLnBuZycsIGRlc2M6J1RoaXMgaXMgbXkgZmluYWwgZm9yIENHSSAyIGF0IERyZXhlbCBVbml2ZXJzaXR5LiBUaGUgYXNzaWdubWVudCB3YXMgdG8gcmVjcmVhdGUgYW55IHR5cGUgb2Ygcm9vbSwgc28gSSBjaG9zZSBhIGxpdHRsZSBib3lcXCdzIHJvb20uIFdlIHdlcmUgdGFza2VkIHdpdGggY3JlYXRpbmcgYXQgbGVhc3Qgb25lIGNvbXBsZXggb2JqZWN0LCBzbyBJIGRlY2lkZWQgdG8gZ28gd2l0aCBhIHRyYWluIHNldC4nLCBzdGFjazpxYmVydF9zdGFjaywgbWVkaWE6IG1bMl0sIHR5cGU6ICczRCBSZW5kZXInLCB1cmw6Jyd9XSk7XHJcblxyXG5cclxudmFyIHdlbGNvbWVfYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWxjb21lLWJ1dHRvbicpO1xyXG53ZWxjb21lX2Iub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcbiAgICBqdW1wKCcjcG9ydGZvbGlvJyx7XHJcbiAgICAgICAgZHVyYXRpb246MTAwMCxcclxuICAgICAgICBvZmZzZXQ6MCxcclxuICAgICAgICBjYWxsYmFjazogdW5kZWZpbmVkLFxyXG4gICAgICAgIGVhc2luZzoganVtcC5lYXNlSW5PdXRRdWFkLFxyXG4gICAgICAgIGFsbHk6IGZhbHNlXHJcbiAgICB9KVxyXG59XHJcblxyXG5cclxuLyoqIFxyXG4gKiBwb3J0Zm9saW8gd2Vic2l0ZVxyXG4gKiBicmVhdGhsZXNzXHJcbiAqIHdlYXRoZXIgd2Vic2l0ZVxyXG4gKiBxYmVydCBhbmltYXRpb25cclxuICogY2dpIDIgZmluYWw/PyBcclxuICogXHJcbiovXHJcblxyXG5cclxuXHJcbndpbmRvdy5vbnJlc2l6ZSA9IChlKSA9PiB7XHJcbiAgICAgIGlmKGFwcC5jYW52YXMpe1xyXG4gICAgICAgICAgYXBwLnNpemVDYW52YXMoKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgcG9ydGZvbGlvLmFwcGVuZEFsbCgpO1xyXG5cclxuICAgIH07XHJcblxyXG5cclxuLy8gdmFyIGRvY1dpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm9mZnNldFdpZHRoO1xyXG5cclxuLy8gW10uZm9yRWFjaC5jYWxsKFxyXG4vLyAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyonKSxcclxuLy8gICBmdW5jdGlvbihlbCkge1xyXG4vLyAgICAgaWYgKGVsLm9mZnNldFdpZHRoID4gZG9jV2lkdGgpIHtcclxuLy8gICAgICAgY29uc29sZS5sb2coZWwpO1xyXG4vLyAgICAgfVxyXG4vLyAgIH1cclxuLy8gKTtcclxuXHJcbi8vIHZhciBtZWRpYSA9IG5ldyBNZWRpYSgnbWVkaWEtMCcsIFtcIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIsXCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiLFwiLi9wb3J0Zm9saW8vY2F0LmpwZ1wiXSwgW1wiLi9wb3J0Zm9saW8vYnJlYXRobGVzcy5qcGdcIixcIi4vcG9ydGZvbGlvL2NhdC5qcGdcIiwgXCIuL3BvcnRmb2xpby9jYXQuanBnXCJdKTtcclxuXHJcbiIsImV4cG9ydCAqIGZyb20gXCIuL21lZGlhXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWVkaWFJdGVte1xyXG4gICAgbWVkaWE6IE1lZGlhO1xyXG4gICAgaHRtbDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBvcmRlcjogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IobWVkaWE6IE1lZGlhLCBodG1sOkhUTUxEaXZFbGVtZW50LCBvcmRlcjogbnVtYmVyKXtcclxuICAgICAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ubWVkaWEgPSBtZWRpYTtcclxuICAgICAgICB2bS5odG1sID0gaHRtbDtcclxuICAgICAgICB2bS5vcmRlciA9IG9yZGVyO1xyXG4gICAgICAgIHZtLmh0bWwub25jbGljayA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhLmxvYWRNZWRpYSh2bS5vcmRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTWVkaWEge1xyXG4gICAgaWQ6c3RyaW5nXHJcbiAgICBlbGVtZW50czogYW55W107XHJcbiAgICB0aHVtYm5haWxzOiBIVE1MSW1hZ2VFbGVtZW50W107XHJcbiAgICBtZWRpYV9pdGVtczogTWVkaWFJdGVtW107XHJcbiAgICBzZWxlY3RlZDogbnVtYmVyO1xyXG4gICAgdmltZW86c3RyaW5nO1xyXG5cclxuICAgIHJvdzpIVE1MRGl2RWxlbWVudDtcclxuICAgIG92ZXJsYXk6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb2xtZDpIVE1MRGl2RWxlbWVudDtcclxuICAgIFxyXG4gICAgbWVkaWFfc2VsZWN0ZWQ6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCB0aHVtYm5haWxzOiBzdHJpbmdbXSwgZmlsZXM/OiBzdHJpbmdbXSwgdmltZW8/OiBzdHJpbmcpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2bS5pZCA9IGlkO1xyXG4gICAgICAgIHZtLnNlbGVjdGVkID0gMDtcclxuICAgICAgICB2bS5lbGVtZW50cyA9IFtdO1xyXG4gICAgICAgIHZtLm1lZGlhX2l0ZW1zID0gW107XHJcbiAgICAgICAgdm0udGh1bWJuYWlscyA9IFtdO1xyXG5cclxuICAgICAgICB2bS52aW1lbyA9IHZpbWVvO1xyXG4gICAgICAgIGlmKHZpbWVvKXtcclxuICAgICAgICAgICAgICAgIHZhciBmcmFnID0gdm0uY3JlYXRlRnJhZ21lbnQodmltZW8pO1xyXG4gICAgICAgICAgICAgICAgdm0uZWxlbWVudHMucHVzaChmcmFnKTtcclxuICAgICAgICAgICAgICAgIC8vIHZtLmVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQoJ2Ryb3BzaGFkb3cnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBsZW5ndGggPSB2bS5lbGVtZW50cy5sZW5ndGg7XHJcbiAgICAgICAgaWYoZmlsZXMpe1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJylcclxuICAgICAgICAgICAgICAgIGltYWdlLnNyYyA9IGZpbGVzW2ldO1xyXG4gICAgICAgICAgICAgICAgaW1hZ2UuY2xhc3NMaXN0LmFkZCgnZHJvcHNoYWRvdycpO1xyXG4gICAgICAgICAgICAgICAgdm0uZWxlbWVudHMucHVzaChpbWFnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZtLm1lZGlhX3NlbGVjdGVkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0ubWVkaWFfc2VsZWN0ZWQuaWQgPSAnbWVkaWEtc2VsZWN0ZWQnO1xyXG5cclxuICAgICAgICB2bS5vdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdm0ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdvdmVybGF5LW1lZGlhJyk7XHJcblxyXG4gICAgICAgIHZtLm1lZGlhX3NlbGVjdGVkLmFwcGVuZENoaWxkKHZtLm92ZXJsYXkpO1xyXG5cclxuICAgICAgICB2bS5yb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2bS5yb3cuY2xhc3NMaXN0LmFkZCgncm93JywnanVzdGlmeS1jZW50ZXInLCdtZWRpYS1jb250YWluZXInKTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8IHZtLmVsZW1lbnRzLmxlbmd0aDsgaisrKXtcclxuICAgICAgICAgICAgdm0uY29sbWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgdm0uY29sbWQuY2xhc3NMaXN0LmFkZCgnY29sLXhzJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaHRtbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgICAgIGh0bWwuY2xhc3NMaXN0LmFkZCgnbWVkaWEtaXRlbScpO1xyXG4gICAgICAgICAgICB2YXIgbWVkaWFfaXRlbSA9IG5ldyBNZWRpYUl0ZW0odm0saHRtbCxqKTtcclxuICAgICAgICAgICAgdm0ubWVkaWFfaXRlbXMucHVzaChtZWRpYV9pdGVtKTtcclxuXHJcbiAgICAgICAgICAgIHZtLnRodW1ibmFpbHMucHVzaChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKSk7XHJcbiAgICAgICAgICAgIHZtLnRodW1ibmFpbHNbal0uY2xhc3NMaXN0LmFkZCgnZHJvcHNoYWRvdycpO1xyXG4gICAgICAgICAgICB2bS50aHVtYm5haWxzW2pdLnNyYyA9IHRodW1ibmFpbHNbal07XHJcblxyXG4gICAgICAgICAgICB2bS5jb2xtZC5hcHBlbmRDaGlsZCh2bS5tZWRpYV9pdGVtc1tqXS5odG1sKTtcclxuICAgICAgICAgICAgdm0uY29sbWQuYXBwZW5kQ2hpbGQodm0udGh1bWJuYWlsc1tqXSk7XHJcbiAgICAgICAgICAgIHZtLnJvdy5hcHBlbmRDaGlsZCh2bS5jb2xtZCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAjbWVkaWEtc2VsZWN0ZWRcclxuICAgICAgICAvLyAgICAgICAgICAgICAgLm92ZXJsYXlcclxuICAgICAgICAvLyAgICAgICAgICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpLmRyb3BzaGFkb3dcclxuICAgICAgICAvLyAgICAgICAgICAucm93Lmp1c3RpZnktY2VudGVyLm1lZGlhLWNvbnRhaW5lclxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAuY29sLW1kXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAubWVkaWEtaXRlbVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgaW1nKHNyYz1cIi4vcG9ydGZvbGlvL2JyZWF0aGxlc3MuanBnXCIpLmRyb3BzaGFkb3dcclxuICAgICAgICAvLyAgICAgICAgICAgICAgLmNvbC1tZFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgLm1lZGlhLWl0ZW1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIGltZyhzcmM9XCIuL3BvcnRmb2xpby9icmVhdGhsZXNzLmpwZ1wiKS5kcm9wc2hhZG93XHJcblxyXG5cclxuICAgICAgICB2bS5tZWRpYV9pdGVtc1t2bS5zZWxlY3RlZF0uaHRtbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgIC8vIHZtLmVsZW1lbnRzLnB1c2godm0uZWxlbWVudHNbMF0pO1xyXG4gICAgICAgIC8vIHZtLmVsZW1lbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgLy8gdm0uc2V0SWQoaWQpO1xyXG4gICAgICAgIC8vIHZtLmxvYWRNZWRpYSgwKTtcclxuXHJcbiAgICB9XHJcbiAgICBjcmVhdGVGcmFnbWVudChzdHI6IHN0cmluZywgd2lkdGg/OiBudW1iZXIsIGhlaWdodD86IG51bWJlciApIHtcclxuICAgICAgICB2YXIgbmV3c3RyID0gc3RyO1xyXG4gICAgICAgIGlmKHdpZHRoKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIG5ld3N0ciA9IHN0ci5yZXBsYWNlKCd3aWR0aD1cIlxcZCtcIiBoZWlnaHQ9XCJcXGQrXCInLCAnd2lkdGg9XCInK3dpZHRoKydcIiBoZWlnaHQ9XCInK2hlaWdodCsnXCInKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuXHJcbiAgICAgICAgdmFyIGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBlbGVtLmlubmVySFRNTCA9IHN0cjtcclxuXHJcbiAgICAgICAgd2hpbGUgKGVsZW0uY2hpbGROb2Rlc1swXSkge1xyXG4gICAgICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGVsZW0uY2hpbGROb2Rlc1swXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmcmFnO1xyXG4gICAgfVxyXG5cclxuICAgIHNldElkKGlkOiBzdHJpbmcpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICB2YXIgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIHdoaWxlKHBhcmVudC5maXJzdENoaWxkKXtcclxuICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHBhcmVudC5maXJzdENoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHZtLm1lZGlhX3NlbGVjdGVkKTtcclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodm0ucm93KTtcclxuICAgIH1cclxuXHJcbiAgICBzaXplKCl7XHJcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLm92ZXJsYXkuc3R5bGUud2lkdGggPSAodm0ubWVkaWFfc2VsZWN0ZWQuY2xpZW50V2lkdGgrMTIpKydweCc7XHJcbiAgICAgICAgdm0ub3ZlcmxheS5zdHlsZS5oZWlnaHQgPSAodm0ubWVkaWFfc2VsZWN0ZWQuY2xpZW50SGVpZ2h0KzgpKydweCc7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZE1lZGlhKHRodW1iX251bTpudW1iZXIpe1xyXG4gICAgICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgICAgICAgICAgICAgIC8vIHZtLm1lZGlhX3NlbGVjdGVkLnJlbW92ZUNoaWxkKHZtLm1lZGlhX3NlbGVjdGVkLmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIHZtLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnY2xvc2UtbWVkaWEnKTtcclxuXHJcbiAgICAgICAgdm0uc2l6ZSgpO1xyXG5cclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdm0ubWVkaWFfaXRlbXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICB2bS5tZWRpYV9pdGVtc1tpXS5odG1sLnN0eWxlLndpZHRoID0gdm0uY29sbWQuY2xpZW50V2lkdGgrJ3B4JztcclxuICAgICAgICAgICAgdm0ubWVkaWFfaXRlbXNbaV0uaHRtbC5zdHlsZS5oZWlnaHQgPSB2bS5jb2xtZC5jbGllbnRIZWlnaHQrJ3B4JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHZtLnZpbWVvICYmIHRodW1iX251bSA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgICB2bS5lbGVtZW50cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZyYWcgPSB2bS5jcmVhdGVGcmFnbWVudCh2bS52aW1lbywgdm0ubWVkaWFfc2VsZWN0ZWQuY2xpZW50V2lkdGgsIHZtLm1lZGlhX3NlbGVjdGVkLmNsaWVudEhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB2bS5lbGVtZW50cy51bnNoaWZ0KGZyYWcpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZtLm92ZXJsYXkuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgICAgICAgICAgICAgLy8gdm0uZWxlbWVudHNbaV0uY2xhc3NMaXN0LmFkZCgnZHJvcHNoYWRvdycpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZtLm92ZXJsYXkuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvKmJ1dHRvbiB0cmFuc2l0aW9uKi9cclxuICAgICAgICB2bS5tZWRpYV9pdGVtc1t2bS5zZWxlY3RlZF0uaHRtbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgIHZtLnNlbGVjdGVkID0gdGh1bWJfbnVtO1xyXG4gICAgICAgIHZtLm1lZGlhX2l0ZW1zW3ZtLnNlbGVjdGVkXS5odG1sLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XHJcblxyXG4gICAgICAgIC8qcGljdHVyZSB0cmFuc2l0aW9uKi9cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgICAgICAvLyBpZih2bS52aW1lbyAmJiB2bS5zZWxlY3RlZCA9PT0gMCl7XHJcblxyXG4gICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICBpZiAodm0ubWVkaWFfc2VsZWN0ZWQuY2hpbGRyZW4ubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5tZWRpYV9zZWxlY3RlZC5yZW1vdmVDaGlsZCh2bS5tZWRpYV9zZWxlY3RlZC5sYXN0Q2hpbGQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2bS5tZWRpYV9zZWxlY3RlZC5hcHBlbmRDaGlsZCh2bS5lbGVtZW50c1t2bS5zZWxlY3RlZF0pO1xyXG4gICAgICAgICAgICB2bS5vdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2Nsb3NlLW1lZGlhJyk7XHJcbiAgICAgICAgICAgIHZtLm1lZGlhX2l0ZW1zW3ZtLnNlbGVjdGVkXS5odG1sLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgfSwgNjAwKTsgICBcclxuICAgIH1cclxufSIsImV4cG9ydCAqIGZyb20gXCIuL3NraWxsX2JhZGdlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2tpbGwge1xyXG4gIGZsZXhfaXRlbTogSFRNTERpdkVsZW1lbnQ7XHJcbiAgc3ZnOiBTVkdTVkdFbGVtZW50O1xyXG4gIHN2Z19jaXJjbGU6IFNWR0NpcmNsZUVsZW1lbnQ7XHJcbiAgc2NhbGVfYm94OiBIVE1MRGl2RWxlbWVudDtcclxuICBpbWFnZTogSFRNTEltYWdlRWxlbWVudDtcclxuICB0ZXh0OiBIVE1MRGl2RWxlbWVudDtcclxuICBmbGV4X2dyaWRfaWQ6IHN0cmluZztcclxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGNsYXNzcGVyY2VudDogc3RyaW5nLCBpbWFnZTogc3RyaW5nLCBmbGV4X2dyaWRfaWQ6IHN0cmluZykge1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG5cclxuICAgIHZtLmZsZXhfZ3JpZF9pZCA9IGZsZXhfZ3JpZF9pZDtcclxuXHJcbiAgICB2bS5mbGV4X2l0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHZtLmZsZXhfaXRlbS5jbGFzc05hbWUgKz0gJ2ZsZXgtaXRlbSc7XHJcblxyXG4gICAgdm0uc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJzdmdcIilcclxuICAgIHZtLnN2Zy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NwZXJjZW50KVxyXG4gICAgdm0uc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnODQnKTtcclxuICAgIHZtLnN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICc4NCcpO1xyXG5cclxuICAgIHZtLnN2Z19jaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAnY2lyY2xlJyk7XHJcbiAgICB2bS5zdmdfY2lyY2xlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdjbGFzcycsICdvdXRlcicpO1xyXG4gICAgdm0uc3ZnX2NpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCBcImN4XCIsICctNDInKTtcclxuICAgIHZtLnN2Z19jaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgXCJjeVwiLCAnNDInKTtcclxuICAgIHZtLnN2Z19jaXJjbGUuc2V0QXR0cmlidXRlTlMobnVsbCwgXCJyXCIsICczNycpO1xyXG4gICAgdm0uc3ZnX2NpcmNsZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCBcInRyYW5zZm9ybVwiLCBcInJvdGF0ZSgtOTAsIDAsIDApXCIpO1xyXG5cclxuICAgIHZtLnNjYWxlX2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgaWYgKG5hbWUgPT09IFwiVHlwZSBTY3JpcHRcIiB8fCBuYW1lID09PSBcIkJvb3RzdHJhcFwiIHx8IG5hbWUgPT09IFwiRDMuanNcIiB8fCBuYW1lID09PSBcIlBob3Rvc2hvcFwiIHx8IG5hbWUgPT09IFwiSWxsdXN0cmF0b3JcIiB8fCBuYW1lID09PSBcIkFmdGVyIEVmZmVjdHNcIiB8fCBuYW1lID09PSBcIk1heWFcIiB8fCBuYW1lID09PSBcIk11ZGJveFwiKSB7XHJcbiAgICAgIHZtLnNjYWxlX2JveC5jbGFzc05hbWUgKz0gJ3NjYWxlLWJveC1zcXVhcmUnO1xyXG4gICAgfSBlbHNlIGlmIChuYW1lID09PSBcIlVuaXR5XCIgfHwgbmFtZSA9PT0gXCJQaGFzZXIuanNcIiB8fCBuYW1lID09PSBcIkQzLmpzXCIgfHwgbmFtZSA9PT0gXCJTQ1NTXCIgfHwgbmFtZSA9PT0gXCJKYXZhXCIgfHwgbmFtZSA9PT0gXCJQeXRob25cIikge1xyXG4gICAgICB2bS5zY2FsZV9ib3guY2xhc3NOYW1lICs9ICdzY2FsZS1ib3gtbWlkJztcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2bS5zY2FsZV9ib3guY2xhc3NOYW1lICs9ICdzY2FsZS1ib3gnO1xyXG4gICAgfVxyXG5cclxuICAgIHZtLmltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICB2bS5pbWFnZS5zcmMgPSBpbWFnZTtcclxuXHJcbiAgICB2bS50ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB2bS50ZXh0LmNsYXNzTmFtZSArPSAndGV4dCc7XHJcbiAgICB2bS50ZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5hbWUpKTtcclxuXHJcbiAgICAvLyAuZmxleC1pdGVtXHJcbiAgICAvLyAgICAgICBzdmcuY2lyY2xlLTc1KHdpZHRoPSc4NCcsIGhlaWdodD0nODQnKVxyXG4gICAgLy8gICAgICAgICBjaXJjbGUub3V0ZXIoY3g9Jy00MicsIGN5PSc0MicsIHI9JzM3JyB0cmFuc2Zvcm09XCJyb3RhdGUoLTkwLCAwLCAwKVwiKSBcclxuICAgIC8vICAgICAgIC5zY2FsZS1ib3hcclxuICAgIC8vICAgICAgICAgaW1nKGlkPVwiZm91clwiKVxyXG4gICAgLy8gICAgICAgICAudGV4dCBhYmNcclxuICAgIHZtLmZsZXhfaXRlbS5hcHBlbmRDaGlsZCh2bS5zdmcpO1xyXG4gICAgdm0uc3ZnLmFwcGVuZENoaWxkKHZtLnN2Z19jaXJjbGUpO1xyXG4gICAgdm0uZmxleF9pdGVtLmFwcGVuZENoaWxkKHZtLnNjYWxlX2JveCk7XHJcbiAgICB2bS5zY2FsZV9ib3guYXBwZW5kQ2hpbGQodm0uaW1hZ2UpO1xyXG4gICAgdm0uZmxleF9pdGVtLmFwcGVuZENoaWxkKHZtLnRleHQpO1xyXG4gIH1cclxuICByZXNldElkKGlkOiBzdHJpbmcpe1xyXG4gICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gICAgdm0uZmxleF9ncmlkX2lkID0gaWQ7XHJcbiAgfVxyXG5cclxuICBhcHBlbmQoKSB7XHJcbiAgICBjb25zdCB2bSA9IHRoaXM7XHJcbiAgICB2YXIgZmxleF9ncmlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodm0uZmxleF9ncmlkX2lkKTtcclxuICAgIGZsZXhfZ3JpZC5hcHBlbmRDaGlsZCh2bS5mbGV4X2l0ZW0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU2tpbGxJbmZvIHtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgY2xhc3M6IHN0cmluZztcclxuICBpbWFnZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sbGVjdGlvbiB7XHJcbiAgaWQ6IHN0cmluZztcclxuICBpbWFnZXM6IElTa2lsbEluZm9bXTtcclxuICBwYXRoOiBzdHJpbmc7XHJcbiAgc2tpbGxzOiBTa2lsbFtdO1xyXG4gIGZsZXhfZ3JpZF9pZDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcsIGZsZXhfZ3JpZF9pZDogc3RyaW5nLCBpbWFnZXM6IElTa2lsbEluZm9bXSwgaWQ/OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIFxyXG4gICAgdm0uaW1hZ2VzID0gaW1hZ2VzO1xyXG4gICAgdm0ucGF0aCA9IHBhdGg7XHJcbiAgICB2bS5mbGV4X2dyaWRfaWQgPSBmbGV4X2dyaWRfaWQ7XHJcblxyXG4gICAgdm0uc2tpbGxzID0gW107XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbWFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdm0uc2tpbGxzLnB1c2gobmV3IFNraWxsKGltYWdlc1tpXS5uYW1lLCBpbWFnZXNbaV0uY2xhc3MsIHZtLnBhdGggKyBpbWFnZXNbaV0uaW1hZ2UsIHZtLmZsZXhfZ3JpZF9pZCkpO1xyXG4gICAgfVxyXG4gICAgaWYoaWQpe1xyXG4gICAgICB2bS5pZCA9IGlkO1xyXG4gICAgICB2YXIgZWxlbWVudCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh2bS5pZCk7XHJcbiAgICAgIGVsZW1lbnQub25tb3VzZXVwID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2bS5sb2FkKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyByZXNldElkcyhpZDogc3RyaW5nKXtcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZtLmZsZXhfZ3JpZF9pZCA9IGlkO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2bS5za2lsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdm0uc2tpbGxzW2ldLnJlc2V0SWQodm0uZmxleF9ncmlkX2lkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBsb2FkKCkgeyAvL3NldHMgc3JjJ3MgdG8gdGhlIGRvbS4gdGhlbiBvbmNlIGV2ZXJ5dGhpbmcgaXMgbG9hZGVkLCBpdCBhZGRzIGNsYXNzIGFjdGl2ZSB0byBtYWtlIHRoZW0gYXBwZWFyIHZpYSBjc3NcclxuICAgIGNvbnN0IHZtID0gdGhpcztcclxuICAgIHZhciBmbGV4X2dyaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh2bS5mbGV4X2dyaWRfaWQpO1xyXG4gICAgd2hpbGUgKGZsZXhfZ3JpZC5maXJzdENoaWxkKSB7XHJcbiAgICAgIGZsZXhfZ3JpZC5yZW1vdmVDaGlsZChmbGV4X2dyaWQuZmlyc3RDaGlsZCk7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZtLnNraWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2bS5za2lsbHNbaV0uYXBwZW5kKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIHB1YmxpYyBjbG9zZSgpe1xyXG4gIC8vICAgY29uc3Qgdm0gPSB0aGlzO1xyXG4gIC8vICAgdmFyIGZsZXhfZ3JpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHZtLmZsZXhfZ3JpZF9pZCk7XHJcbiAgLy8gICB3aGlsZSAoZmxleF9ncmlkLmZpcnN0Q2hpbGQpIHtcclxuICAvLyAgICAgZmxleF9ncmlkLnJlbW92ZUNoaWxkKGZsZXhfZ3JpZC5maXJzdENoaWxkKTtcclxuICAvLyAgIH1cclxuICAvLyB9XHJcbn1cclxuIl19
