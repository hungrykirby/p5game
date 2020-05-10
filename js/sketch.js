var s = function( sketch ){
  let w = 0;
  let h = sketch.windowHeight;
  const NumBalls = 2;

  let now_playing_index = 0;
  let balls = [];

  let cat = [];
  sketch.setup = function() {
    w = sketch.windowWidth;
    cat.push(sketch.loadSound('js/sound/cat.mp3'))
    sketch.createCanvas(w, h);
    for(var i = 0; i < NumBalls; i++){
      ball = new Ball(sketch, w, h);
      ball.setup(50);
      balls.push(ball);
    }
  };
  sketch.windowResized = function() {
    w = sketch.windowWidth;
    sketch.resizeCanvas(w, h);
  };
  sketch.draw = function() {
    // ball.drawCircle(sketch.mouseX, sketch.mouseY, 100);
    // sketch.background('white');
    for(let i = 0; i < NumBalls; i++){
      balls[i].drawCircle();
    }
  };
  sketch.mouseClicked = function() {
    now_playing_index++;
    if(now_playing_index >= cat.length){
      now_playing_index = 0;
    }
    if (cat[now_playing_index].isPlaying()) {
      cat[now_playing_index].stop();
    } else {
      for(let i = 0; i < NumBalls; i++){
        if(balls[i].isInCircle(sketch.mouseX, sketch.mouseY)){
          cat[now_playing_index].play();
        }
      }
    }
  }
};
class Ball{
  constructor(sketch, w, h){
    this.sketch = sketch;
    this.w = w; this.h = h;
    this.c = this.sketch.color(this.sketch.random(360), 100, 100, this.sketch.random(100));
    this.firstPos = {x: this.sketch.random(w), y: this.sketch.random(h)};
  }
  setup(d){
    this.d = d;
  }
  drawCircle(){
    this.sketch.fill('green');
    this.sketch.noStroke();
    this.sketch.ellipse(this.firstPos.x, this.firstPos.y, this.d, this.d);
  };

  isInCircle(x, y){
    let distXY = this.sketch.dist(x, y, this.firstPos.x, this.firstPos.y)
    if(distXY < this.d){
      return true;
    }
    return false;
  }

  isInCanvas(x, y, d) {
    where = false;
    if(0 + d > x){
      where = "x0"
    }else if(0 + d > y){
      where = "y0"
    }else if(w + d < x){
      where = "xw"
    }else if(h + d < y){
      where = "yh"
    }
    return where;

  }
};
var myp5 = new p5(s, document.getElementById('p5sketch'));
