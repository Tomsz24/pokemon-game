class BackgroundSprite extends Sprite {
  constructor(params) {
    super(params);
    this.image.onload = () => {
      console.log('Background image loaded');
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    }
    this.image.onerror = () => {
      console.error('Error loading background image');
    }
  }

  draw() {
    // log the dimensions before drawing
    console.log(`Drawing background: ${this.width}x${this.height}`);

    ctx.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      0,
      0,
      this.width,
      this.height
    );
  }
}
