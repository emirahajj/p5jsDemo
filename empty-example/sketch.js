//setup runs once
let newX = Math.PI;
let translateX = 10;
let translateY = 0;
let angles = [];
let angleV = 0.0082;

let palette = [
  [55, 74, 103],
  [97, 98, 131],
  [203, 156, 242],
  [158, 123, 155]
]; //stores 3 RBG colors

//let particles = []; //array that will store our particles
let particleRings = []; //array that will store our particles
let particleRing1;
let particleRing2;
let particleRing3;
let particleRing4;
let particleWave;

let vector; //vector to determine which direction to move the individual particles in
let offset = 40;
let time = 0;


function setup() {
  createCanvas(windowWidth, windowHeight);

  particleRing4 = new ParticleRing(0, 0, 170, 80, palette[3], 1/2);

  particleRing1= new ParticleRing(0, 0, 100 ,30, palette[2], 1/2);
  particleRing2 = new ParticleRing(0, 0, 130, 30, palette[1], 1/2);
  particleRing3 = new ParticleRing(0, 0, 160, 30, palette[3], 1/2);
  //particleWave = new ParticleWave(0, 0, 10, 10, palette[1], 4)
  stroke(0);
}

//draw forever
function draw() {
  angleMode(RADIANS);
  rectMode(CENTER);
  //translateX+=10;
  background(palette[0]);

  time -= 0.1;

  line(windowWidth / 2, 0, windowWidth / 2, windowHeight);
  line(0, windowHeight / 2, windowWidth, windowHeight / 2);

  translate(windowWidth / 2, windowHeight / 2)



  //you can call any new type of 
  let v = createVector(50 * cos(time*2), 50 * sin(time*2));
  let v1 = createVector(50 * time, 50* sin(time));
  let v2 = p5.Vector.fromAngle(millis() / 100, 50);
  particleRing1.show(1, v);
  particleRing3.show(1, v);
  particleRing4.show(1, v);
  particleRing2.show(1, v);



}

//vector param is any matrix to apply a transformation so that the history of a Particle is in terms 
//of the global 
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
    circle(this.x +this.vector.x, this.y + this.vector.y, this.size);
    var v = createVector(this.x +this.vector.x, this.y + this.vector.y);
    this.history.push(v);
    beginShape();


    //experiment with drawingCOntect
    drawingContext.shadowOffset = 5;
    drawingContext.shadowOffsetX = 5;
    drawingContext.shadowOffsetY = 5;
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = 'black';
    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      if (this.history.length > 100) {
        this.history.splice(0, 1);
      }
      strokeCap(ROUND);
      strokeJoin(ROUND);

      strokeWeight(this.size-(this.size/i));
      stroke(this.color[0], this.color[1], this.color[2], 255)

      //noStroke();
      //blendMode(HARD_LIGHT);
      noFill();
      //fill(this.color[0], this.color[1], this.color[2], 255)
      //circle(pos.x, pos.y, this.size-(this.size/i));
      //point(pos.x, pos.y);

      vertex(pos.x, pos.y);

    }
    endShape();

    pop();
  }

}



class ParticleRing {
  constructor(x, y, radius, particleSize, color, period) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.particleSize = particleSize;
    this.color = color;
    this.period = period;
    this.particles = [];
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

  renderRing(){
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
    //old approach was bad. create a number of Particles in a row and then just move them up and down
    pop();
  }

}