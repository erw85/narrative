// Modified from Daniel Shifman - codingtra.in
// Starter Option One: Particles
//Things to try:
// - Change the words - try phrases for more narrative / poetics!
// - Change the colors - try the background, and the words!
// - Change the font and size of the words
// - Change the particle system - try changing the starting points
// - Change the movement - try playing with the alpha and direction

particles = [];
branches = [];
leaves = [];
//Just like with Tracery, put anything you want in the ""s
words = ["mourning dove","house finch","tufted titmouse","northern cardinal","blue jay","brown thrasher","red-bellied woodpecker","northern mockingbird"]

function setup() {
	//This creates a canvas the size of the screen
  createCanvas(windowWidth, windowHeight);
  generateCanopy();
}

function generateCanopy() {
  branches = [];
  leaves = [];
  let numTrees = ceil(windowWidth / 150);
  let spacing = windowWidth / numTrees;
  for (let i = 0; i <= numTrees; i++) {
    let x = i * spacing + random(-spacing * 0.3, spacing * 0.3);
    growBranch(x, 0, HALF_PI, random(50, 90), 0);
  }
}

function growBranch(x, y, angle, len, depth) {
  if (depth > 5 || len < 10) return;
  let ex = x + cos(angle) * len;
  let ey = y + sin(angle) * len;
  branches.push({ x1: x, y1: y, x2: ex, y2: ey, w: max(1, 8 - depth * 1.4) });
  if (depth >= 2) {
    for (let i = 0; i < floor(random(3, 7)); i++) {
      leaves.push({
        x: ex + random(-25, 25),
        y: ey + random(-15, 25),
        w: random(14, 34),
        h: random(12, 28),
        r: floor(random(30, 100)),
        g: floor(random(100, 175)),
        b: floor(random(20, 65))
      });
    }
  }
  growBranch(ex, ey, angle + random(0.3, 0.7), len * random(0.6, 0.75), depth + 1);
  growBranch(ex, ey, angle - random(0.3, 0.7), len * random(0.6, 0.75), depth + 1);
  if (depth < 2 && random() > 0.5) {
    growBranch(ex, ey, angle + random(-0.1, 0.1), len * 0.85, depth + 1);
  }
}

function draw() {
	//Sky blue background
  background("#87CEEB");
  // Draw branches behind everything
  noFill();
  for (let b of branches) {
    stroke(101, 67, 33);
    strokeWeight(b.w);
    line(b.x1, b.y1, b.x2, b.y2);
  }
	//This creates the particles
  for (let i = 0; i < 3; i++) {
    let p = new Particle();
    particles.push(p);
  }
	//This moves the particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) {
      // remove this particle
      particles.splice(i, 1);
    }
  }
  // Draw leaves in front of text so words disappear into the canopy
  noStroke();
  for (let l of leaves) {
    fill(l.r, l.g, l.b);
    ellipse(l.x, l.y, l.w, l.h);
  }
}

class Particle {
  constructor() {
		//This sets the x value to anywhere - try using a static value
    this.x = random (0, windowWidth);
		//This keeps the y fixed - try reversing it using windowHeight
    this.y = windowHeight;
		//This sets the range of x movement - try limiting it to + or -
    this.vx = random(-1, 1);
		//This sets the range of y movement - try reversing it
    this.vy = random(-5, -1);
		//This sets the starting alpha so it starts bright and fades
		//Try reversing it! you can start at 0, add 1, and stop at 255
    this.alpha = 255;
		//This picks a random word for each particle
		this.text = random(words);
  }

  finished() {
		//Change this to 255 if you reverse the fade
    return this.alpha < 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
		//Change this to +1 if you reverse the fade
    this.alpha -= 1;
  }

  show() {
    noStroke();
		//You can also add the outline
    //stroke(255);
    fill(255, 0, 0, this.alpha);
		//This positions the text
    text(this.text, this.x, this.y);
  }
}
