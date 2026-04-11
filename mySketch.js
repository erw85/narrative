// Modified from Daniel Shifman - codingtra.in
// Starter Option One: Particles
//Things to try:
// - Change the words - try phrases for more narrative / poetics!
// - Change the colors - try the background, and the words!
// - Change the font and size of the words
// - Change the particle system - try changing the starting points
// - Change the movement - try playing with the alpha and direction

particles = [];
clouds = [];
treeline = [];
flockX = 0;
flockY = 0;
//Just like with Tracery, put anything you want in the ""s
words = ["mourning dove","house finch","tufted titmouse","northern cardinal","blue jay","brown thrasher","red-bellied woodpecker","northern mockingbird"]

function setup() {
  createCanvas(windowWidth, windowHeight);
  generateTreeline();
  // A handful of slow, subtle clouds
  for (let i = 0; i < 12; i++) {
    clouds.push(new Cloud(random(windowWidth), random(windowHeight * 0.55)));
  }
}

function generateTreeline() {
  treeline = [];
  let baseY = windowHeight - 60;
  let x = 0;
  while (x <= windowWidth + 60) {
    let treeW = random(28, 72);
    let treeH = random(45, 145);
    if (random() > 0.4) {
      // Pine-like: single sharp peak
      treeline.push({x: x,             y: baseY});
      treeline.push({x: x + treeW/2,   y: baseY - treeH});
      treeline.push({x: x + treeW,     y: baseY});
    } else {
      // Deciduous: rounded double-bump
      treeline.push({x: x,              y: baseY});
      treeline.push({x: x + treeW*0.25, y: baseY - treeH*0.75});
      treeline.push({x: x + treeW*0.5,  y: baseY - treeH});
      treeline.push({x: x + treeW*0.75, y: baseY - treeH*0.75});
      treeline.push({x: x + treeW,      y: baseY});
    }
    x += treeW * random(0.55, 0.95);
  }
}

function drawSky() {
  // Gradient from deep blue at top to pale horizon blue at bottom
  let topCol    = color(80,  150, 220);
  let bottomCol = color(140, 205, 235);
  noStroke();
  let strips = 80;
  for (let i = 0; i < strips; i++) {
    fill(lerpColor(topCol, bottomCol, i / strips));
    rect(0, (i / strips) * windowHeight, windowWidth, windowHeight / strips + 1);
  }
}

function drawTreeline() {
  fill(20, 55, 20);
  noStroke();
  beginShape();
  vertex(0, windowHeight);
  for (let p of treeline) {
    vertex(p.x, p.y);
  }
  vertex(windowWidth, windowHeight);
  endShape(CLOSE);
}

function draw() {
  drawSky();

  // Clouds float in the sky behind everything else
  for (let cloud of clouds) {
    cloud.update();
    cloud.show();
  }

  // Update flock centroid for cohesion
  if (particles.length > 0) {
    flockX = 0; flockY = 0;
    for (let p of particles) { flockX += p.x; flockY += p.y; }
    flockX /= particles.length;
    flockY /= particles.length;
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

  // Treeline and grass drawn last so text emerges from behind them
  drawTreeline();
  noStroke();
  fill(34, 100, 20);
  rect(0, windowHeight - 60, windowWidth, 60);
  fill(50, 140, 30);
  rect(0, windowHeight - 68, windowWidth, 16);
}

class Cloud {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = random(0.1, 0.35);
    this.alpha = random(110, 170);
    let base = random(40, 90);
    this.halfWidth = base * 2.2;
    this.bumps = [];
    let count = floor(random(4, 9));
    for (let i = 0; i < count; i++) {
      this.bumps.push({
        ox: random(-base, base),
        oy: random(-base * 0.25, base * 0.25),
        w:  random(base * 0.6, base * 1.3),
        h:  random(base * 0.4, base * 0.85),
      });
    }
  }

  update() {
    this.x += this.speed;
    if (this.x > windowWidth + this.halfWidth) {
      this.x = -this.halfWidth;
      this.y = random(windowHeight * 0.55);
    }
  }

  show() {
    noStroke();
    fill(255, 255, 255, this.alpha);
    for (let b of this.bumps) {
      ellipse(this.x + b.ox, this.y + b.oy, b.w, b.h);
    }
  }
}

class Particle {
  constructor() {
    //This sets the x value to anywhere - try using a static value
    this.x = random(0, windowWidth);
    //This keeps the y fixed - try reversing it using windowHeight
    this.y = windowHeight;
    // Base horizontal drift — wind and flocking are layered on top each frame
    this.baseVx = random(-1, 1);
    //This sets the range of y movement - try reversing it
    this.vy = random(-5, -1);
    // Random phase for wind drift so each bird sways differently
    this.phase = random(TWO_PI);
    //This sets the starting alpha so it starts bright and fades
    this.alpha = 255;
    //This picks a random word for each particle
    this.text = random(words);
    // Per-bird base color; defaults to red
    let colorMap = {
      "blue jay":       [20,  60,  200],
      "brown thrasher": [110, 55,  10 ],
    };
    if (colorMap[this.text]) {
      [this.r, this.g, this.b] = colorMap[this.text];
    } else {
      this.r = 255; this.g = 0; this.b = 0;
    }
  }

  finished() {
    return this.alpha < 0;
  }

  update() {
    // Wind drift — recomputed each frame so it never accumulates
    let wind = sin(frameCount * 0.015 + this.phase) * 0.8;
    // Flocking cohesion — horizontal only, so vy stays constant
    let flock = (flockX - this.x) * 0.0004;
    this.vx = this.baseVx + wind + flock;
    // vy is never modified — rise speed stays steady
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 1;
  }

  show() {
    noStroke();
    // Color by altitude — brightness scales with height for all birds
    let brightness = map(this.y, windowHeight, 0, 0.35, 1.0);
    fill(this.r * brightness, this.g * brightness, this.b * brightness, this.alpha);
    //This positions the text
    text(this.text, this.x, this.y);
  }
}
