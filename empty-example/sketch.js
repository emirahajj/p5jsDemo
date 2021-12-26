let angles = [];

let palette = [
  [30, 30, 30],
  [119, 182, 234],
  [203, 156, 242],
  [158, 123, 155]
]; //stores 3 RBG colors

let particleRing1, particleRing2, particleRing3, particleRing4, particleRing5;
let particleWave;

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

  particleRing4 = new ParticleRing(0, 0, 100, 7, palette[1], 1);
  particleRing5 = new ParticleRing(0, 0, 400, 7, palette[2], 1);

  particleRing1 = new ParticleRing(0, 0, 400, 7, palette[2], 1);
  particleRing2 = new ParticleRing(0, 0, 0, 30, palette[1], 1 / 4);
  particleRing3 = new ParticleRing(0, 0, 160, 30, palette[3], 1 / 2);

  b1 = color(palette[0]);
  b2 = color(palette[1]);

  stroke(0);
}

//draw forever
function draw() {
  angleMode(RADIANS);
  rectMode(CENTER);
  background(palette[0]);

  line(windowWidth / 2, 0, windowWidth / 2, windowHeight);
  line(0, windowHeight / 2, windowWidth, windowHeight / 2);
  translate(windowWidth / 2, windowHeight / 2)

  time+= PI/40;
  rotate(time/100)

  //you can call any new type of 
  let v = createVector(200 * sin(millis() / 300), 200 * cos(millis() / 300));
  //number multiplied outside trig func makes it longer
  let vv = createVector((50 * (sin(time))), (50 * cos(time)));
  //console.log(v);
  let v1 = createVector(50 * time, sin(50 * time));
  let v2 = p5.Vector.fromAngle(time, 5);
  // let v2 = p5.Vector.fromAngle(time * 8, 50);

  particleRing4.show(0.4, vv);
  particleRing5.show(0.4, vv);

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


    // beginShape();

    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      if (this.history.length > 200) {
        this.history.splice(0, 1);
      }
      strokeCap(ROUND);
      strokeJoin(ROUND);
      strokeWeight(map(i, 0, this.history.length, 0, this.size));
      stroke(this.color[0], this.color[1], this.color[2], map(i, 0, this.history.length, 0, 255));
      stroke(this.color[0], this.color[1], this.color[2],255);
      noFill();
      // vertex(pos.x, pos.y);
      point(pos.x, pos.y)
    }
    // endShape();

    pop();
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

  //this is a render method
  show(direction, v) {
    push();
    noStroke();
    //translate(this.x/100, this.y/100);
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].vector = v;
      let prevX = this.particles[i].x;
      let prevY = this.particles[i].y;
      let rotatedX = prevX * cos(PI * direction / 100) - prevY * sin(PI * direction / 100);
      let rotatedY = prevX * sin(PI * direction / 100) + prevY * cos(PI * direction / 100);
      this.particles[i].x = rotatedX
      this.particles[i].y = rotatedY
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
      angles[i] += 0.0082;
      vertex(x, y);
    }
    endShape();
    pop();
  }

}