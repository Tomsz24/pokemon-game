class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites = [],
    animate = false,
    rotation = 0,
  }) {
    this.position = position;
    this.image = new Image();
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.sprites = sprites;
    this.animate = animate;
    this.frames.hold = frames.hold;
    this.opacity = 1;
    this.rotation = rotation;

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.image.src = image.src;
  }

  draw() {
    ctx.save();
    ctx.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2,
    );
    ctx.rotate(this.rotation);
    ctx.translate(-this.width / 2, -this.height / 2);
    ctx.globalAlpha = this.opacity;
    ctx.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      0,
      0,
      this.image.width / this.frames.max,
      this.image.height,
    );
    ctx.restore();

    if (!this.animate) return;

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }

    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}
