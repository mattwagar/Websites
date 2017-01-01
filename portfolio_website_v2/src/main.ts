

import * as image_canvas from "./image_canvas";

import * as skill_badge from "./skill_badge";



var frontend = new skill_badge.Collection('frontend','./skills/frontend/', 'flex-grid1', [  {"name": 'HTML5',           "class":'circle-100', "image":'html5.svg'}, 
                                                                                            {"name": 'Java Script',     "class":'circle-100', "image":'javascript-2.svg'}, 
                                                                                            {"name": 'Bootstrap',       "class":'circle-100', "image":'bootstrap-4.svg'},
                                                                                            {"name": 'Angular JS',      "class":'circle-75', "image":'angular-icon.svg'}, 
                                                                                            {"name": 'Type Script',     "class":'circle-75', "image":'typescript.svg'},  
                                                                                            {"name": 'Gulp',            "class":'circle-75', "image":'gulp.svg'}, 
                                                                                            {"name": 'CSS3',            "class":'circle-50', "image":'css-3.svg'}, 
                                                                                            {"name": 'jQuery',          "class":'circle-50', "image":'jquery-1.svg'}, 
                                                                                            {"name": 'SCSS',            "class":'circle-50', "image":'sass-1.svg'},
                                                                                            {"name": 'D3.js',           "class":'circle-25', "image":'d3-2.svg'}]);
var softeng = new skill_badge.Collection('softeng','./skills/softeng/', 'flex-grid2',    [{"name": 'Java',        "class":'circle-75', "image":'java-14.svg'}, 
                                                                {"name": 'Python',      "class":'circle-50', "image":'python-5.svg'}, 
                                                                {"name": 'C++',          "class":'circle-25', "image":'c-seeklogo.com.svg'}, 
                                                                {"name": 'Android Studio',  "class":'circle-25', "image":'Android_studio.svg'}]);
var design = new skill_badge.Collection('design','./skills/design/', 'flex-grid3',       [{"name": 'Photoshop',       "class":'circle-50', "image":'photoshop-cc.svg'},
                                                                {"name": 'Illustrator',     "class":'circle-50', "image":'adobe-illustrator-cc.svg'},
                                                                {"name": 'Maya',            "class":'circle-50', "image":'maya.png'},  
                                                                {"name": 'After Effects',   "class":'circle-25', "image":'after-effects-cc.svg'}, 
                                                                {"name": 'Mudbox',          "class":'circle-25', "image":'mudbox.png'}]);
frontend.load();
softeng.load();
design.load();


var app = new image_canvas.App();


// window.onscroll = function(){
//     console.log(window.scrollY);
// }


var w = document.getElementById("wrapper");
var b = document.getElementById('p1');


b.onclick = function(){
    if(w.classList[0] === "open"){
        w.classList.remove('open');
    } else {
        w.classList.add('open');
    }
}

// class Portfolio {
//     title: string;
//     desc: string;
//     stack: string;
//     links: string;
//     cover_img: any;
//     constructor(){

//     }
// }


