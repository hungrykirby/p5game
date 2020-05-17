var s = function( sketch ){
  let w = 0;
  let h = sketch.windowHeight;
  const NumBalls = 6;
  let increasedBall = 0;
  let ballD = 75;

  let now_playing_index = 0;
  let balls = [];

  let cat = [];
  sketch.preload = function(){
    cat.push(sketch.loadSound('js/sound/cat.mp3'));
  }
  sketch.setup = function() {
    w = sketch.windowWidth;
    sketch.createCanvas(w, h);
    for(var i = 0; i < NumBalls; i++){
      ball = new Ball(sketch, w, h);
      ball.setD(ballD);
      ball.setSound(cat[0])
      balls.push(ball);
    }
  };
  sketch.windowResized = function() {
    w = sketch.windowWidth;
    sketch.resizeCanvas(w, h);
  };
  sketch.draw = function() {
    sketch.background('white');
    let falseAll = false;
    for(let i = 0; i < NumBalls + increasedBall; i++){
      let drawingBall = balls[i].draw(sketch.mouseX, sketch.mouseY);
      if(drawingBall && !falseAll){
        falseAll = true;
      }
    }
    if(!falseAll){
      increasedBall++;
      ballD -= 10;
      if(ballD < 15){
        ballD = 15;
      }
      balls = [];
      for(var i = 0; i < NumBalls + increasedBall; i++){
        ball = new Ball(sketch, w, h);
        ball.setD(ballD);
        ball.setSound(cat[0])
        balls.push(ball);
      }
    }
  };
  sketch.mousePressed = function() {
    for(let i = 0; i < NumBalls + increasedBall; i++){      
      balls[i].touchStart(sketch.mouseX, sketch.mouseY)
    }
  };
  sketch.mouseReleased = function(){
    for(let i = 0; i < NumBalls + increasedBall; i++){
      balls[i].touchEnd(sketch.mouseX, sketch.mouseY)
    }
  };
};
class Ball{
  constructor(sketch, w, h){
    this.sketch = sketch;
    this.w = w; this.h = h;
    this.sketch.colorMode(this.sketch.HSB, 360, 100, 100, 100);
    this.c = this.sketch.color(this.sketch.random(360), 100, 100, this.sketch.random(90, 100));
    this.firstPos = {x: this.sketch.random(w), y: this.sketch.random(h)};

    this.touchingStatusAndTime = {state: 0, time: this.sketch.millis()}; // 0 no touch, 1 touching, 2 reloased
    this.sound = false;
    this.arrayPos = [{x: this.firstPos.x, y: this.firstPos.y}];
    this.touchingTime = 0;

    this.maxPosArrayLength = 10;
    this.intervalToRelease = 1000;

    this.display = true; // このBallを表示するかどうか
  }
  
  // setup関数内で呼ばれる
  setD(d){
    this.d = d;
    this.defaultD = d;
  }

  setSound(sound){
    this.sound = sound;
  }

  // draw関数内で呼ばれる
  draw(_x, _y){
    let x = this.firstPos.x;
    let y = this.firstPos.y;
    if(this.dragging()){
      this.setXY(_x, _y)
      x = this.arrayPos[0].x;
      y = this.arrayPos[0].y;
    }
    
    this.updateD();
    this.fadeAndSound();

    if(this.display){
      this.drawCircle(x, y);
    }
    return this.display;
  }

  // mouse系
  touchStart(x, y){
    if(this.isInCircle(x, y) && this.touchingStatusAndTime.state !== 1){
      this.touchingStatusAndTime.state = 1;
      this.touchingStatusAndTime.time = this.sketch.millis();
    }
    
  }
  touchEnd(x, y){    
    if(this.touchingStatusAndTime.state === 1){
      this.touchingStatusAndTime.state = 2;
//       if(this.timeElapsed(this.intervalToRelease)){
//         this.display = false;
//       }
      this.touchingStatusAndTime.time = this.sketch.millis();
    }
  }

  // Class内
  setXY(x, y){
    this.pushPos(x, y);
  };

  updateD(){
    if(this.display && this.dragging()){
      this.d = this.d + 1;
    }else{
      if(this.d !== this.defaultD){
        this.d = this.defaultD;
      }
    }
  };

  fadeAndSound(){
    if(this.display && this.dragging() && this.timeElapsed(this.intervalToRelease)){
      this.display = false;
      this.startSound();
    }
  };

  drawCircle(x, y){
    this.sketch.fill(this.c);
    this.sketch.noStroke();
    this.sketch.ellipse(x, y, this.d);
  };

  startSound(){
    if(this.sound === false){
      return false;
    }else{
      if(this.sound.isPlaying()){
        return false;
      }else{
        this.sound.play();
        return true;
      }
    }
  };
  stopSound(){
    if(this.sound === false){
      return false;
    }else{
      if(this.sound.isPlaying()){
        this.sound.stop();
        return true;
      }else{
        return false;
      }
    }
  };

  isInCircle(x, y){
    let distXY = this.sketch.dist(x, y, this.firstPos.x, this.firstPos.y)
    if(distXY < this.d){
      return true;
    }
    return false;
  }

  dragging(){
    if(this.touchingStatusAndTime.state === 1 && this.touchingStatusAndTime.time !== this.sketch.millis()){
      return true;
    }else{
      return false;
    }
  }
  elapsedTime(){
    return this.sketch.millis() - this.touchingStatusAndTime.time;
  }

  timeElapsed(t){
    let et = this.elapsedTime();
    
    if(et > t){
      return true;
    }else{
      return false;
    }
  }

  pushPos(x, y){
    this.arrayPos.unshift({x: x, y: y})
    if(this.arrayPos.length > this.maxPosArrayLength){
      this.arrayPos.pop();
    }
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
