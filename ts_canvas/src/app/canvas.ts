window.requestAnimFrame = function() {
  return  window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(callback) {
            window.setTimeout(callback, 1000/ 60);
          };
}();

window.onload = function() {
  canv:HTMLCanvasElement = document.getElementById('canvas')
  canv.width = 500;
  canv.height = 500;
  ctx = my_canvas.getContext("2d");
  animate();
};

function animate() {
  update();
  draw();
  requestAnimFrame(animate);
}

function update(){
  
}

function draw(){
    ctx.
}