

import * as image_canvas from "./image_canvas";

import * as skill_badge from "./skill_badge";



var frontend = new skill_badge.Collection('frontend','./skills/frontend/', [{"name": 'HTML5',           "class":'circle-100', "image":'html5.svg'}, 
                                                                {"name": 'Java Script',     "class":'circle-75', "image":'javascript-2.svg'}, 
                                                                {"name": 'CSS3',            "class":'circle-50', "image":'css-3.svg'}, 
                                                                {"name": 'Angular JS',      "class":'circle-75', "image":'angular-icon.svg'}, 
                                                                {"name": 'jQuery',          "class":'circle-50', "image":'jquery-1.svg'}, 
                                                                {"name": 'SCSS',            "class":'circle-75', "image":'sass-1.svg'}, 
                                                                {"name": 'Type Script',     "class":'circle-75', "image":'typescript.svg'}, 
                                                                {"name": 'Phaser.js',       "class":'circle-100', "image":'phaser.svg'}, 
                                                                {"name": 'Gulp',            "class":'circle-75', "image":'gulp.svg'}, 
                                                                {"name": 'D3.js',           "class":'circle-25', "image":'d3-2.svg'}, 
                                                                {"name": 'Bootstrap',     "class":'circle-100', "image":'bootstrap-4.svg'}, 
                                                                {"name": 'Pug/Jade',        "class":'circle-100', "image":'pug.svg'}]);
var softeng = new skill_badge.Collection('softeng','./skills/softeng/',    [{"name": 'Java',        "class":'circle-75', "image":'java-14.svg'}, 
                                                                {"name": 'Python',      "class":'circle-50', "image":'python-5.svg'}, 
                                                                {"name": 'C++',          "class":'circle-25', "image":'c-seeklogo.com.svg'}, 
                                                                {"name": 'Android Studio',  "class":'circle-25', "image":'Android_studio.svg'}]);
var design = new skill_badge.Collection('design','./skills/design/',       [{"name": 'Photoshop',       "class":'circle-25', "image":'photoshop-cc.svg'},
                                                                {"name": 'Illustrator',     "class":'circle-25', "image":'adobe-illustrator-cc.svg'}, 
                                                                {"name": 'After Effects',   "class":'circle-25', "image":'after-effects-cc.svg'}, 
                                                                {"name": 'Maya',            "class":'circle-50', "image":'maya.png'}, 
                                                                {"name": 'Mudbox',          "class":'circle-25', "image":'mudbox.png'}]);
frontend.load();


var app = new image_canvas.App();


window.onscroll = function(){
    console.log(window.scrollY);
}




