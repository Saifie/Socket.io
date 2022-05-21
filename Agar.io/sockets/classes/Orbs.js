class Orbs {
  constructor(settings) {
    this.color = this.randdomColor();
    this.locx = Math.floor(Math.random() * settings.worldWidth);
    this.locy = Math.floor(Math.random() * settings.worldHeight);
    this.radius = 5;
  }
  randdomColor() {
    const r = Math.floor(Math.random() * 250 + 50);
    const g = Math.floor(Math.random() * 250 + 50);
    const b = Math.floor(Math.random() * 250 + 50);
    return `rgb(${r},${g},${b})`;
  }
}

module.exports = Orbs;
