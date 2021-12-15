//setup runs once
let newX = Math.PI;
let translateX = 10;
let translateY = 0;
let angles = [];
let angleV = 0.0082;

let palette = [
  [55, 57, 58 ],
  [119, 182, 234],
  [203, 156, 242],
  [158, 123, 155]
]; //stores 3 RBG colors

//let particles = []; //array that will store our particles
let particleRings = []; //array that will store our particles
let particleRing1, particleRing2, particleRing3, particleRing4, particleRing5;
let particleWave;

let vector; //vector to determine which direction to move the individual particles in
let offset = 40;
let time = 0;

// Constants
const Y_AXIS = 1;
const X_AXIS = 2;
let b1, b2, c1, c2;


function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  particleRing4 = new ParticleRing(0, 0, 175, 7, palette[1], 1);
  particleRing5 = new ParticleRing(0, 0, 175, 7, palette[1], 1);

  particleRing1 = new ParticleRing(0, 0, 400, 7, palette[2], 1);
  particleRing2 = new ParticleRing(0, 0, 0, 30, palette[1], 1 / 4);
  particleRing3 = new ParticleRing(0, 0, 160, 30, palette[3], 1 / 2);
  //particleWave = new ParticleWave(0, 0, 10, 10, palette[1], 4)
  b1 = color(255);
  b2 = color(0);

  stroke(0);

    // Define colors

}

//draw forever
function draw() {
  angleMode(RADIANS);
  rectMode(CENTER);
  //translateX+=10;
  background(palette[0]);
  //setGradient(0, 0, windowWidth, windowHeight, b1, b2, X_AXIS);
  //setGradient(windowWidth / 2, 0, windowWidth / 2, windowHeight, b2, b1, X_AXIS);

  //line(windowWidth / 2, 0, windowWidth / 2, windowHeight);
  //line(0, windowHeight / 2, windowWidth, windowHeight / 2);
  translate(windowWidth / 2, windowHeight / 2)

  // if (time < 2 * PI) {
  // } else if (time >= 2* PI){
  //   time -= PI/40;
  // }

  time += PI / 200;
  //console.log(time);
    // Background



  //you can call any new type of 
  let v = createVector(200 * sin(millis() / 300), 200 * cos(millis() / 300));
  //number multiplied outside trig func makes it longer
  let vv = createVector((100 * (sin(time/1.5))), (100 * cos(time/1.5)));
  //console.log(v);
  let v1 = createVector(50 * time, sin(50 * time));
  let v2 = p5.Vector.fromAngle(time * 10, 70);
  // let v2 = p5.Vector.fromAngle(time * 8, 50);

  
  

  // if(particleRing4.reachedEnd()){
  //   particleRing4.show(1, v2);
  // }
  particleRing4.show(1, v2);
  //particleRing5.show(1, v2);
  particleRing1.show(1, v2);
  //particleRing2.show(1, v2);

  // particleRing3.show(1, v);
  // particleRing2.show(1, v);
  //particleRing1.show(-1, v);

}

//vector param is any matrix to apply a transformation so that the history of a Particle is in terms 
//of the global coordinates. Calls to rotate(), rotate the entire coordinate system. And our Particle object 
//history will still be in the original coordinate system.
class Particle {
  constructor(x, y, size, color, vector) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.history = [];
    this.vector = vector;
  }

  //this is a render method
  show() {
    push();
    stroke(255, 255, 255, 100)
    fill(this.color[0], this.color[1], this.color[2]);
    circle(this.x + this.vector.x, this.y + this.vector.y, this.size);
    var v = createVector(this.x + this.vector.x, this.y + this.vector.y);
    this.history.push(v);


    //experiment with drawingCOntect
    // drawingContext.shadowOffset = 5;
    // drawingContext.shadowOffsetX = 5;
    // drawingContext.shadowOffsetY = 5;
    // drawingContext.shadowBlur = 30;
    // drawingContext.shadowColor = 'black';
    //drawingContext.globalCompositeOperation = "source-over";

    // beginShape();

    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      if (this.history.length > 200) {
        this.history.splice(0, 1);
      }
      strokeCap(ROUND);
      strokeJoin(ROUND);
      strokeWeight(this.size/2);
      stroke(this.color[0], this.color[1], this.color[2], map(i, 0, this.history.length, 0, 255));
      // stroke(this.color[0], this.color[1], this.color[2],255);
      noFill();
      //vertex(pos.x, pos.y);
      point(pos.x, pos.y)
    }
    // endShape();

    pop();
  }

  reachedEnd(){
    if(this.history.length <2){
      if (this.history[this.history.length-1].x == this.x && this.history[this.history.length-1].y == this.y){
        return true;
      }
    }
    return false;
  }

}


/*

The ParticleRing class represents a collection of Particles, each centered at x and y coordinates
a certain distance from the origin which intersect the Unit Circle given the radius, and an x, y offset

*/
class ParticleRing {
  constructor(x, y, radius, particleSize, color, period) {
    this.x = x; //x-coord of the ParticleRing
    this.y = y; //y-coord of the ParticleRing
    this.radius = radius; //radius of the ParticleRing
    this.particleSize = particleSize; //size of the Particles
    this.color = color; //color of the Particles
    this.period = period;
    this.particles = []; //stores the number of particles in the Ring
    //for loop
    for (var i = 0; i < 2 * PI; i = (i + PI / (this.period))) {
      let prevX = cos(i) * this.radius;
      let prevY = sin(i) * this.radius;
      let part = new Particle(prevX, prevY, this.particleSize, this.color, createVector(0, 0));
      this.particles.push(part);
    }
  }

  reachedEnd(){
      for (var i = 0; i < this.particles.length; i++) {
        if(this.particles[i].reachedEnd()){
          return true;
        }
      }
    return false;
  }

  //this is a render method
  show(direction, v) {
    push();
    noStroke();
    translate(this.x, this.y);
    //translate(v);
    //translate(pathFunc.x, pathFunc.y);
    for (let i = 0; i < this.particles.length; i++) {
      // this.particles[i].x = v.x;
      // this.particles[i].y = v.y;
      this.particles[i].vector = v;
      let prevX = this.particles[i].x;
      let prevY = this.particles[i].y;
      let rotatedX = prevX * cos(newX * direction / 60) - prevY * sin(newX * direction / 60);
      let rotatedY = prevX * sin(newX * direction / 60) + prevY * cos(newX * direction / 60);
      //console.log(rotatedX, rotatedY)
      this.particles[i].x = rotatedX
      this.particles[i].y = rotatedY
      //console.log(this.particles[i].x, this.particles[i].y);
      this.particles[i].show();
    }
    //translate(-this.x, -this.y)
    pop();
  }

  renderRing() {
    push();
    noStroke();
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
    pop();
  }

}

//this will animated either from left or right 
class ParticleWave {
  constructor(x, y, amplitude, particleSize, color, period) {
    this.x = x;
    this.y = y;
    this.amplitude = amplitude;
    this.particleSize = particleSize;
    this.color = color;
    this.period = period; //how many times a particle appears along oner period of the wave
    this.particles = [];

    let total = floor(windowWidth / (particleSize * 2));
    for (var i = 0; i < total; i++) {
      angles.push(map(i, 0, total, 0, TWO_PI));
    }
    console.log(angles);

  }



  //this is a render method
  show() {
    push();
    stroke(255);
    noFill();
    beginShape();
    for (let i = 0; i < angles.length; i++) {
      let y = map(sin(angles[i]), -1, 1, -400, 400);
      //strokeWeight(1);
      let x = map(i, 0, angles.length, -windowWidth / 2, windowWidth / 2)
      //circle(x, y, this.particleSize);
      angles[i] += angleV;
      vertex(x, y);
    }
    endShape();
    pop();
  }

}