//INSERT NEW IMAGE OR VIDEO INTO GALLERY HERE
//SPECIFY ALL FIELDS
//YOU MAY SET WIDTH AND HEIGHT TO "default" AND IT WILL BE FULL RESOLUATION (case sensitive)

var files = [{
    "type": 'image',
    "file": 'test_sprites/bunny.jpg',
    "width": 250,
    "height": 375
    }, {
    "type": 'image',
    "file": 'test_sprites/dog.jpg',
    "width": 263,
    "height": 350
    }, {
    "type": 'image',
    "file": 'test_sprites/cat.jpg',
    "width": 153,
    "height": 153
    }, {
    "type": 'image',
    "file": 'test_sprites/goose.jpg',
    "width": 200,
    "height": 306,
    }, {
    "type": 'video',
    "file": 'test_sprites/example.mp4',
    "width": 320,
    "height": 176,
    }, {
    "type": 'video',
    "file": 'test_sprites/bear.mp4',
    "width": 320,
    "height": 176,
    }, {
    "type": 'image',
    "file": 'test_sprites/goose.jpg',
    "width": 200,
    "height": 306,
    }, {
    "type": 'image',
    "file": 'test_sprites/goose.jpg',
    "width": 200,
    "height": 306,
    }, {
    "type": 'image',
    "file": 'test_sprites/goose.jpg',
    "width": 200,
    "height": 306,
    }, {
    "type": 'image',
    "file": 'test_sprites/goose.jpg',
    "width": 200,
    "height": 306,
    }, {
    "type": 'image',
    "file": 'test_sprites/goose.jpg',
    "width": 200,
    "height": 306,
    }, {
    "type": 'image',
    "file": 'test_sprites/goose.jpg',
    "width": 200,
    "height": 306,
    }];


//AFTER THIS IS ALL PIXI.JS 3.0

var renderer = PIXI.autoDetectRenderer(760, 487, {
    backgroundColor: 0x333333
});
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

var video_queue = [];

for (file in files) {

    if (files[file].type === "image") {
        files[file].sprite = new PIXI.Sprite(PIXI.Texture.fromImage(files[file].file));
        files[file].spriteButton = new PIXI.Sprite(PIXI.Texture.fromImage(files[file].file));
        files[file].photo_icon_sprite = new PIXI.Sprite(PIXI.Texture.fromImage("sprites/photo_icon.png"));
    }
    if (files[file].type === "video") {


        files[file].sprite = new PIXI.Sprite(PIXI.Texture.fromVideo(files[file].file));
        files[file].spriteButton = new PIXI.Sprite(files[file].sprite._texture);
        files[file].photo_icon_sprite = new PIXI.Sprite(PIXI.Texture.fromImage("sprites/video_icon.png"));

        var video_tex = files[file].sprite._texture;

        video_queue.push(files[file].sprite._texture);
    }
}

video_load();


//recursive function for handling multiple videos
function video_load() {

    if (video_queue.length <= 0) {
        return;
    }

    var texture = video_queue.pop();
    var start = performance.now();
    texture.baseTexture.on('loaded', function () {
        texture.baseTexture.source.muted = true;
        texture.baseTexture.source.pause();
    });
    video_load();
    var end = performance.now();

    console.log("load time for " + texture.baseTexture.source.currentSrc + ": " + (end - start));
}




//var video_tex = PIXI.Texture.fromVideo('example.mp4');






var green_h_tex = PIXI.Texture.fromImage('sprites/green_highlight.png');

var menu_tex = PIXI.Texture.fromImage('sprites/menu_screen.png');
var zoom_tex = PIXI.Texture.fromImage('sprites/zoom.png');
var zoomout_tex = PIXI.Texture.fromImage('sprites/zoomout.png');
var adj_tex = PIXI.Texture.fromImage('sprites/adjust_contrast.png');
var adj_cancel_tex = PIXI.Texture.fromImage('sprites/adj_cancel.png');

var reset_tex = PIXI.Texture.fromImage('sprites/reset_contrast.png');
var bg_tex = PIXI.Texture.fromImage('sprites/black_background.png');

var playmenu_tex = PIXI.Texture.fromImage('sprites/play_menu.png');
var playbutton_tex = PIXI.Texture.fromImage('sprites/playButton.png');
var pausebutton_tex = PIXI.Texture.fromImage('sprites/pauseButton.png');
var stopbutton_tex = PIXI.Texture.fromImage('sprites/stop_button.png');
var stopplaybutton_tex = PIXI.Texture.fromImage('sprites/stop_play_button.png');
var progressbar_tex = PIXI.Texture.fromImage('sprites/progress_bar.png');

var image_scroll_tex = PIXI.Texture.fromImage('sprites/image_scroll.png');
var image_scroll2_tex = PIXI.Texture.fromImage('sprites/scrollable_image.png');



// insert sprites
var bg = new PIXI.Sprite(bg_tex);
var menu = new PIXI.Sprite(menu_tex);
var zoom = new PIXI.Sprite(zoom_tex);
var adj = new PIXI.Sprite(adj_tex);
var reset = new PIXI.Sprite(reset_tex);
var adj_cancel = new PIXI.Sprite(adj_cancel_tex);

var green_highlight = new PIXI.Sprite(green_h_tex);


var play_menu = new PIXI.Sprite(playmenu_tex);
var play_button = new PIXI.Sprite(playbutton_tex);
var stop_button = new PIXI.Sprite(stopbutton_tex);
var progress_bar = new PIXI.Sprite(progressbar_tex);

var image_scroll = new PIXI.Sprite(image_scroll_tex);

//text

var style = {
    font: '10px Arial',
};

var video_timer = new PIXI.Text('0:00:00', style);



//containers
var iv_container = new PIXI.Container();
iv_container.addChild(files[0].sprite);
iv_container.position.y -= 40;


var button_container = new PIXI.Container();



image_scroll.height = 342;


if (files.length > 8) {
    imageScroll(image_scroll);
}

image_scroll.position.y = 63;



for (button in files) {
    button_container.addChild(files[button].spriteButton);
}




var icon_container = new PIXI.Container();

for (icons in files) {
    icon_container.addChild(files[icons].photo_icon_sprite);
}
icon_container.addChild(green_highlight);


var video_container = new PIXI.Container();
video_container.addChild(progress_bar);
video_container.addChild(play_menu);
video_container.addChild(play_button);
video_container.addChild(stop_button);
video_container.addChild(video_timer);

video_container.visible = false;



//makes images buttons

for (file in files) {
    if (files[file].type === "image") {
        imageButton(files[file].spriteButton);
    }
    if (files[file].type === "video") {
        imageButton(files[file].spriteButton);
    }
}


//initializes the play screen
playScreen();

//initializes draggable object
draggable(files[0].sprite);

//zoom button

var zoomToggle = true;
zoomButton(zoom);


//color matrix

colorMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];

filter = new PIXI.filters.ColorMatrixFilter();

filter.matrix = colorMatrix;

invert_filter = new PIXI.filters.InvertFilter();

iv_container.filters = [invert_filter, filter];
button_container.filters = [invert_filter, filter];

invert_filter.invert = 0;

//custom attributes


invert_filter.invertion = 0;
filter.light = .5;

//defaults pic filter
filter.brightness(1, false);

brightnessButton(adj);

resetContrastButton(reset);

//button sizes


for (button in files) {

    spriteButton = files[button].spriteButton;

    buttonPosition(button, 15, 70);

    spriteButton.width = 90;
    spriteButton.height = 75;

}

function buttonPosition(button, x_position, y_position) {



    if (button % 2 === 0) { //left side pics
        y_position += 85 * (Math.floor(button / 2));
    } else if (button % 2 === 1) { //right side pics
        x_position = 115;
        var buttonMult = Math.floor(button / 2);
        y_position += 85 * (Math.floor(button / 2));
    }

    files[button].spriteButton.position.x = x_position;
    files[button].spriteButton.position.y = y_position;
    files[button].photo_icon_sprite.position.x = x_position
    files[button].photo_icon_sprite.position.y = y_position

}


for (file in files) {
    if (files[file].width !== "default") {
        files[file].sprite.width = files[file].width;
    }
    if (files[file].height !== "default") {
        files[file].sprite.height = files[file].height;
    }
}



//positions

bg.position.x = 238;
bg.position.y = 20;

adj.position.x = 10;
adj.position.y = 420;

adj_cancel.position.x = 1;
adj_cancel.position.y = 411;

reset.position.x = 100;
reset.position.y = 420;

zoom.position.x = 190;
zoom.position.y = 410;

play_menu.position.x = 241;
play_menu.position.y = 418;

play_button.position.x = play_menu.position.x + 32;
play_button.position.y = play_menu.position.y + 5;

stop_button.position.x = play_menu.position.x + 78;
stop_button.position.y = play_menu.position.y + 11;

progress_bar.position.x = 173;
//progress_bar.position.x = 352; END POSITION!!
//179 IN TOTAL TRANSLATION
progress_bar.position.y = play_menu.position.y + 22;

video_timer.position.x = play_menu.position.x + 336;
video_timer.position.y = play_menu.position.y + 22;




//Put all sprites/graphics on stage
stage.addChild(bg);
stage.addChild(iv_container);

stage.addChild(image_scroll);
stage.addChild(video_container);
stage.addChild(button_container);
stage.addChild(icon_container);

stage.addChild(menu);
stage.addChild(zoom);
stage.addChild(adj);
stage.addChild(reset);


var selected_image = files[0].spriteButton;


animate();




function animate() {

    for (file in files) {
        if (files[file].type === "video") {
            timer(video_timer);
        }
    }

    if (video_tex.baseTexture.source.currentTime > 0) {
        stop_button.texture = stopplaybutton_tex;
    }

    if (!(progress_bar.dragging)) { //if it is not being dragged
        progressPosition();
    }

    if (video_tex.baseTexture.source.currentTime === video_tex.baseTexture.source.duration) {
        onEnd();
    }

    green_highlight.position.x = selected_image.position.x - 3;
    green_highlight.position.y = selected_image.position.y - 3;




    // render the stage
    renderer.render(stage);

    requestAnimationFrame(animate);
}

function zoomButton(sprite) {

    sprite.interactive = true;
    sprite.buttonMode = true;

    sprite
    /// set the mousedown and touchstart callback...
        .on('mousedown', onZoom)
        .on('touchstart', onZoom)

    /// set the mouseup and touchend callback...
    .on('mouseup', onButtonUp)
        .on('touchend', onButtonUp)
        .on('mouseupoutside', onButtonUp)
        .on('touchendoutside', onButtonUp)

    /// set the mouseover callback...
    .on('mouseover', onButtonOver)

    /// set the mouseout callback...
    .on('mouseout', onButtonOut);
}

function onZoom() {

    this.alpha = 1;

    var x_translation = 492;
    var y_translation = 270;

    if (!zoomToggle) {
        this.isdown = true;
        this.texture = zoom_tex;

        iv_container.scale.x /= 2;
        iv_container.scale.y /= 2;

        iv_container.position.x += x_translation;
        iv_container.position.y += y_translation;

    } else {
        this.isdown = true;
        this.texture = zoomout_tex;

        iv_container.scale.x *= 2;
        iv_container.scale.y *= 2;

        iv_container.position.x -= x_translation;
        iv_container.position.y -= y_translation;

    }
    zoomToggle = !zoomToggle;
}

function onButtonUp() {
    this.isdown = false;
    this.alpha = 1;
}

function onButtonOver() {
    this.isOver = true;
}

function onButtonOut() {
    this.isOver = false;
    this.alpha = 1;
}






//brightness button event
function brightnessButton(sprite) {

    //makes specified sprite interactive and clickable
    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite
    /// set the mousedown and touchstart callback...
        .on('mousedown', onBrightness)
        .on('touchstart', onBrightness)

    /// set the mouseup and touchend callback...
    .on('mouseup', onButtonUp)
        .on('touchend', onButtonUp)
        .on('mouseupoutside', onButtonUp)
        .on('touchendoutside', onButtonUp)

    /// set the mouseover callback...
    .on('mouseover', onBrightnessOver)

    /// set the mouseout callback...
    .on('mouseout', onBrightnessOver);
}

function onBrightness() {
    adj_contrast(bg);

    stage.addChild(adj_cancel);

    delete adj_cancel._events;

    cancelButton(adj_cancel);


    iv_container.getChildAt(0).buttonMode = false;
   iv_container.getChildAt(0).interactive = false;
}

function onBrightnessOver() {
    bg.defaultCursor = "move";

}



//stage brightness and invert events
function adj_contrast(sprite) {
    sprite.interactive = true;
    sprite.buttonMode = true;

    sprite
        .on('mousedown', onBrightDrag)
        .on('touchstart', onBrightDrag)

    // events for drag end
    .on('mouseup', onBrightEnd)
        .on('mouseupoutside', onBrightEnd)
        .on('touchend', onBrightEnd)
        .on('touchendoutside', onBrightEnd)
        // events for drag move
        .on('mousemove', onBrightMove)
        .on('touchmove', onBrightMove);
}

function onBrightDrag(event) {
    this.data = event.data;
    this.alpha = 1;
    this.dragging = this.data.getLocalPosition(this.parent);

    y_anchor = this.data.getLocalPosition(this.parent).y;
    x_anchor = this.data.getLocalPosition(this.parent).x;
}

function onBrightEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;

}

function onBrightMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);


        //brightness
        if (newPosition.y < this.dragging.y) {
            y_anchor = this.dragging.y;
        }
        if (newPosition.y > this.dragging.y) {
            y_anchor = this.dragging.y;
        }

        var bright = filter.light;

        y_pos = (y_anchor - newPosition.y) / 1000;

        bright += y_pos;

        filter.brightness(bright, false);

        filter.light = bright;

        brightFilterMatrix = filter.matrix;

        //invert

        if (newPosition.x < this.dragging.x) {
            x_anchor = this.dragging.x;
        }
        if (newPosition.x > this.dragging.x) {
            x_anchor = this.dragging.x;
        }
        var inv = invert_filter.invertion;

        x_pos = (x_anchor - newPosition.x) / 700;

        inv += x_pos

        invert_filter.invert = inv;

        invert_filter.invertion = inv;

        for (i = 0; i < filter.matrix.length; i++) {
            filter.matrix[i] += brightFilterMatrix[i];
        }
        this.dragging = newPosition;
    }
}

//reset
function resetContrastButton(sprite) {

    sprite.interactive = true;
    sprite.buttonMode = true;

    sprite
    /// set the mousedown and touchstart callback...
        .on('mousedown', onReset)
        .on('touchstart', onReset)

    /// set the mouseup and touchend callback...
    .on('mouseup', onButtonUp)
        .on('touchend', onButtonUp)
        .on('mouseupoutside', onButtonUp)
        .on('touchendoutside', onButtonUp)

    /// set the mouseover callback...
    .on('mouseover', onButtonOver)

    /// set the mouseout callback...
    .on('mouseout', onButtonOut);
}

function onReset() {
    filter.matrix = colorMatrix;
    filter.brightness(1, false);
    invert_filter.invert = 0;
    invert_filter.invertion = 0;
    filter.light = 0.5;


}

function cancelButton(sprite) {
    sprite.interactive = true;
    sprite.buttonMode = true;

    sprite
    /// set the mousedown and touchstart callback...
        .on('mousedown', onCancel)
        .on('touchstart', onCancel)

    /// set the mouseup and touchend callback...
    .on('mouseup', onButtonUp)
        .on('touchend', onButtonUp)
        .on('mouseupoutside', onButtonUp)
        .on('touchendoutside', onButtonUp)

    /// set the mouseover callback...
    .on('mouseover', onButtonOver)

    /// set the mouseout callback...
    .on('mouseout', onButtonOut);

}

function onCancel() {
    bg.interactive = false;
    bg.buttonMode = false;

    iv_container.getChildAt(0).buttonMode = true;
    iv_container.getChildAt(0).interactive = true;

    delete adj._events;
    delete bg._events;
    brightnessButton(adj);

    stage.removeChild(adj_cancel);
}


function imageButton(sprite) {

    sprite.interactive = true;
    sprite.buttonMode = true;

    sprite
    /// set the mousedown and touchstart callback...
        .on('mousedown', onImage)
        .on('touchstart', onImage)

    /// set the mouseup and touchend callback...
    .on('mouseup', onButtonUp)
        .on('touchend', onButtonUp)
        .on('mouseupoutside', onButtonUp)
        .on('touchendoutside', onButtonUp)

    /// set the mouseover callback...
    .on('mouseover', onImageOver)

    /// set the mouseout callback...
    .on('mouseout', onButtonOut);
}

function onImage() {

    iv_container.removeChildAt(0);
    video_tex.baseTexture.source.pause();
    play_button.texture = playbutton_tex;

    for (image in files) {
        if (this === files[image].spriteButton) {
            iv_container.addChild(files[image].sprite);
            draggable(files[image].sprite);
            selected_image = files[image].spriteButton;
            if (files[image].type === "video") {
                video_container.visible = true;
                video_tex = files[image].sprite._texture
            } else {
                onEnd();
                video_container.visible = false;
            }
        }
    }
    if (bg.interactive) {
        iv_container.getChildAt(0).buttonMode = false;
        iv_container.getChildAt(0).interactive = false;
    }
}




function onImageOver() {
    this.alpha = 0.5;
}

function playScreen() {
    playButton(play_button);
    stopButton(stop_button);
    progressBar(progress_bar);
    timer(video_timer);
}



function playButton(sprite) {

    sprite.interactive = true;
    sprite.buttonMode = true;

    sprite
    /// set the mousedown and touchstart callback...
        .on('mousedown', onPlay)
        .on('touchstart', onPlay)

    /// set the mouseup and touchend callback...
    .on('mouseup', onButtonUp)
        .on('touchend', onButtonUp)
        .on('mouseupoutside', onButtonUp)
        .on('touchendoutside', onButtonUp)

    /// set the mouseout callback...
    .on('mouseout', onButtonOut);
}

function onPlay() {


    if (video_tex.baseTexture.source.paused) {
        video_tex.baseTexture.source.play();
        play_button.texture = pausebutton_tex;
    } else {
        video_tex.baseTexture.source.pause();
        play_button.texture = playbutton_tex;
    }
}

function stopButton(sprite) {
    sprite.interactive = true;
    sprite.buttonMode = true;

    sprite
    /// set the mousedown and touchstart callback...
        .on('mousedown', onStop)
        .on('touchstart', onStop)

    /// set the mouseup and touchend callback...
    .on('mouseup', onButtonUp)
        .on('touchend', onButtonUp)
        .on('mouseupoutside', onButtonUp)
        .on('touchendoutside', onButtonUp)

    /// set the mouseout callback...
    .on('mouseout', onButtonOut);
}

function onStop() {

    video_tex.baseTexture.source.play();
    video_tex.baseTexture.source.currentTime = 0;
    this.texture = stopbutton_tex;


    setTimeout(function () {
            video_tex.baseTexture.source.pause();
            play_button.texture = playbutton_tex;
            stop_button.texture = stopbutton_tex;
        },
        40);

}

function onEnd() {

    video_tex.baseTexture.source.play();
    video_tex.baseTexture.source.currentTime = 0;
    stop_button.texture = stopbutton_tex;

    setTimeout(function () {
            video_tex.baseTexture.source.pause();
            play_button.texture = playbutton_tex;
            stop_button.texture = stopbutton_tex;
        },
        40);

}


function progressBar(sprite) {
    sprite.interactive = true;
    sprite.buttonMode = true;


    // setup events
    sprite
    // events for drag start
        .on('mousedown', onProgressStart)
        .on('touchstart', onProgressStart)

    // events for drag end
    .on('mouseup', onProgressEnd)
        .on('mouseupoutside', onProgressEnd)
        .on('touchend', onProgressEnd)
        .on('touchendoutside', onProgressEnd)
        // events for drag move
        .on('mousemove', onProgressMove)
        .on('touchmove', onProgressMove);
}

function onProgressStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 1;
    this.dragging = this.data.getLocalPosition(this.parent);
}

function onProgressEnd() {

    this.alpha = 1;

    this.dragging = false;
    // set the interaction data to null
    this.data = null;


    if (play_button.texture === playbutton_tex) {
        video_tex.baseTexture.source.pause();
    } else {
        video_tex.baseTexture.source.play();
    }

}

function onProgressMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x += (newPosition.x - this.dragging.x);
        if (this.position.x > 352) {
            this.position.x = 352;
        } else if (this.position.x < 173) {
            this.position.x = 173;
        }

        this.dragging = newPosition;

        var timeMultiplier = video_tex.baseTexture.source.duration / 179;

        video_tex.baseTexture.source.currentTime = (progress_bar.position.x - 173) * (timeMultiplier);


        video_tex.update();

        video_tex.baseTexture.source.pause();


    }
}

function progressPosition() {

    var secondMultiplier = 179 / video_tex.baseTexture.source.duration

    progress_bar.position.x = 173 + video_tex.baseTexture.source.currentTime * secondMultiplier;
}


function timer(sprite) {

    var second = parseInt(video_tex.baseTexture.source.currentTime, 10)

    var minute = 0;

    var hour = 0;

    if (second > 59) {
        minute += 1;
        second = parseInt(video_tex.baseTexture.source.currentTime) - 60 * minute;
    }
    if (minute > 59) {
        hour += 1;
        minute = 0;
    }
    var secondS = zeroDigit(second).toString();
    var minuteS = zeroDigit(minute).toString();

    sprite.text = hour.toString() + ":" + minuteS + ":" + secondS;
}

function zeroDigit(n) {
    return n > 9 ? "" + n : "0" + n;
}

function imageScroll(sprite) {
    sprite.interactive = true;
    sprite.buttonMode = true;

    sprite.texture = image_scroll2_tex;

    // setup events
    sprite
    // events for drag start
        .on('mousedown', onScrollStart)
        .on('touchstart', onScrollStart)

    // events for drag end
    .on('mouseup', onScrollEnd)
        .on('mouseupoutside', onScrollEnd)
        .on('touchend', onScrollEnd)
        .on('touchendoutside', onScrollEnd)
        // events for drag move
        .on('mousemove', onScrollMove)
        .on('touchmove', onScrollMove);
}

function onScrollStart(event) {
    this.data = event.data;
    this.alpha = 1;
    this.dragging = this.data.getLocalPosition(this.parent);
}

function onScrollEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onScrollMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);


        button_container.position.y += (newPosition.y - this.dragging.y);
        icon_container.position.y += (newPosition.y - this.dragging.y);
        this.dragging = newPosition;

        if (button_container.position.y < (-1 * button_container.height) + 132) {
            button_container.position.y = (-1 * button_container.height) + 132;
            icon_container.position.y = (-1 * button_container.height) + 132;
        } else if (button_container.position.y > 20) {
            button_container.position.y = 20;
            icon_container.position.y = 20;
        }
    }
}

//drag
function draggable(sprite) {

    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite.anchor.set(0.5);

    sprite.position.x = 495;
    sprite.position.y = 260;
    // setup events
    sprite
    // events for drag start
        .on('mousedown', onDragStart)
        .on('touchstart', onDragStart)

    // events for drag end
    .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        // events for drag move
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);
}

function onDragStart(event) {
    this.data = event.data;
    this.alpha = 1;
    this.dragging = this.data.getLocalPosition(this.parent);
}

function onDragEnd() {
    this.alpha = 1;

    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x += (newPosition.x - this.dragging.x);
        this.position.y += (newPosition.y - this.dragging.y);
        this.dragging = newPosition;
    }
}
