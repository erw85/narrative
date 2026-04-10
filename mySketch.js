// Modified from Daniel Shifman - codingtra.in
// Starter Option One: Particles
//Things to try:
// - Change the words - try phrases for more narrative / poetics!
// - Change the colors - try the background, and the words!
// - Change the font and size of the words
// - Change the particle system - try changing the starting points
// - Change the movement - try playing with the alpha and direction

particles = [];
flockX = 0;
flockY = 0;
//Just like with Tracery, put anything you want in the ""s
words = ["mourning dove","house finch","tufted titmouse","northern cardinal","blue jay","brown thrasher","red-bellied woodpecker","northern mockingbird"]

function setup() {
	//This creates a canvas the size of the screen
  createCanvas(windowWidth, windowHeight);
}

function draw() {
	//Sky blue background
  background("#87CEEB");

  // Ground layer — birds take off from the grass
  noStroke();
  fill(34, 100, 20);
  rect(0, windowHeight - 60, windowWidth, 60);
  fill(50, 140, 30);
  rect(0, windowHeight - 68, windowWidth, 16);

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
}

class Particle {
  constructor() {
		//This sets the x value to anywhere - try using a static value
    this.x = random(0, windowWidth);
		//This keeps the y fixed - try reversing it using windowHeight
    this.y = windowHeight;
		//This sets the range of x movement - try limiting it to + or -
    this.vx = random(-1, 1);
		//This sets the range of y movement - try reversing it
    this.vy = random(-5, -1);
    // Random phase for wind drift so each bird sways differently
    this.phase = random(TWO_PI);
		//This sets the starting alpha so it starts bright and fades
    this.alpha = 255;
		//This picks a random word for each particle
		this.text = random(words);
  }

  finished() {
    return this.alpha < 0;
  }

  update() {
    // Wind drift — gentle sine-wave sway like riding air currents
    this.vx += sin(frameCount * 0.015 + this.phase) * 0.05;
    // Flocking cohesion — slight pull toward the flock center
    this.vx += (flockX - this.x) * 0.0003;
    this.vy += (flockY - this.y) * 0.0003;
    // Keep horizontal speed from drifting too far
    this.vx = constrain(this.vx, -3, 3);
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 1;
  }

  show() {
    noStroke();
    // Color by altitude — dark near the ground, bright red high in the sky
    let brightness = map(this.y, windowHeight, 0, 0.35, 1.0);
    fill(255 * brightness, 0, 0, this.alpha);
		//This positions the text
    text(this.text, this.x, this.y);
  }
}
