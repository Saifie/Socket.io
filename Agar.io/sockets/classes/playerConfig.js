class PlayerConfig {
  constructor(settings) {
    this.xvector = 0;
    this.yvector = 0;
    this.speed = settings.defaultSpeed;
    this.zoom = settings.defaultZoom;
  }
}

module.exports = PlayerConfig;
