let numSpheres = 100;
let entropy = 100;
let balls = [];
let bigBang = false;
let ring = 5;
let entAmt = 5;
let pg;
let shrinkTime = 0;

function preload() {
  for (let i = 0; i < numSpheres; i++) {
    balls[i] = new Ball(0, 0, 0);
  }
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('canvas-container');
  textFont('Arial', 100);
  textAlign(CENTER);
  pg = createGraphics(width, height);
  pg.textFont('Arial', 20);
  pg.textAlign(LEFT);
  pg.textSize(18);
  pg.fill(255, 255, 255);
  pg.noStroke();
  pg.text('тепло і технології 😊', 50, 400); // Added an emoji for testing
}

function draw() {
  background(0); // Set the background color here

  // Display frame count using the p5.js text function
  push();
  resetMatrix();
  setAttributes('transparency', true);
  fill(255);
  textSize(14);
  text(`Frame Count: ${frameCount}`, -width / 2 + 10, -height / 2 + 20);
  pop();

  rotateX(mouseY / 500);
  rotateY(mouseX / 500);

  if (bigBang) {
    for (let i = 0; i < balls.length; i++) {
      balls[i].display();
      if (entropy < 120) {
        balls[i].move1();
      } else {
        balls[i].shrink();
      }
    }
  } else {
    fill(255);
    directionalLight(255, 255, 255, mouseX / 50, mouseY / 50, -1);
    specularMaterial(255, 255, 255);
    noStroke();
    sphere(3);
  }

  if (bigBang && frameCount % 15 == 0) {
    entropy += 3;
  }

  texture(pg);
  ambientLight(255);
  plane(width, height);
}

function mouseClicked() {
  bigBang = true;
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    ring = max(0, ring - 1);
  } else if (keyCode === RIGHT_ARROW) {
    ring = min(10, ring + 1);
  } else if (keyCode === UP_ARROW) {
    entAmt = min(5, entAmt + 1);
  } else if (keyCode === DOWN_ARROW) {
    entAmt = max(1, entAmt - 1);
  }
}

class Ball {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.newX = 0;
    this.newY = 0;
    this.newZ = 0;
    this.size = random(0.2, 20);
    this.ringChance = random(10);
    this.rRot = random(10);
  }

  display() {
    push();
    fill(0);
    translate(this.x, this.y, this.z);
    strokeWeight(0.2);
    stroke(255, 102, 0);
    sphere(this.size);
    if (entropy > 120 && ring > this.ringChance) {
      fill(255, 102, 0);
      rotateX(this.rRot);
      rotateY(this.rRot);
      rotateZ(this.rRot);
      torus(this.size + this.size * 3, 0.2);
    }
    pop();
    this.x = lerp(this.x, this.newX, 0.00001);
    this.y = lerp(this.y, this.newY, 0.00001);
    this.z = lerp(this.z, this.newZ, 0.00001);
  }

  shrink() {
    this.newX = map(shrinkTime, 0, entAmt * 150, this.x, 0);
    this.newY = map(shrinkTime, 0, entAmt * 150, this.y, 0);
    this.newZ = map(shrinkTime, 0, entAmt * 150, this.z, 0);
    shrinkTime++;
  }

  move1() {
    this.newX = random(-10 * pow(entropy, 3), 10 * pow(entropy, 3));
    this.newY = random(-10 * pow(entropy, 3), 10 * pow(entropy, 3));
    this.newZ = random(-10 * pow(entropy, 3), 10 * pow(entropy, 3));
  }
}
