class Sprite {
  constructor({position, image, frames = {max: 1, hold: 10}, sprites = [], animate = false, isEnemy = false}) {
    this.position = position;
    this.image = image;
    this.frames = {...frames, val: 0, elapsed: 0};
    this.sprites = sprites;
    this.animate = animate;
    this.frames.hold = frames.hold;
    this.opacity = 1;
    this.health = 100,
    this.isEnemy = isEnemy,

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height,
    );
    ctx.restore();

    if(!this.animate) return

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }

    if(this.frames.elapsed % this.frames.hold === 0) {
      if(this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }

  attack({attack, recipient, renderedSprites}) {
    this.health -= attack.damage;
    let movementDistance = 20;
    let healthBar = '#enemyHealthBar';
    if(this.isEnemy) {
      movementDistance = -20;
      healthBar = '#healthBar';
    }
    switch (attack.name) {
      case 'Tackle':
        const tl = gsap.timeline()

        tl.to(this.position, {
          x: this.position.x - movementDistance
        }).to(this.position, {
          x: this.position.x + movementDistance * 2,
          duration: 0.1,
          onComplete: () => {
            // Enemy gets hit
            gsap.to(recipient.position, {
              x: recipient.position.x + movementDistance,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            })

            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            })

            gsap.to(healthBar, {
              width: `${this.health}%`
            })
          }
        }).to(this.position, {
          x: this.position.x - 20
        })
        break
      case 'Fireball':
        const fireballImage = new Image();
        fireballImage.src = './img/fireball.png';
        const fireball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 10
          },
          animate: true,
        })

        renderedSprites.splice(1, 0, fireball);

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            // Enemy gets hit
            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            })

            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            })

            gsap.to(healthBar, {
              width: `${this.health}%`
            })
            renderedSprites.splice(1,1);
          }
        })
    }

  }
}
