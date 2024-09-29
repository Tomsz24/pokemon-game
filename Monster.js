class Monster extends Sprite {
  constructor({
    isEnemy = false,
    name,
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites = [],
    animate = false,
    rotation = 0,
    attacks,
  }) {
    super({
      position,
      image,
      frames,
      sprites,
      animate,
      rotation,
    });
    this.name = name;
    this.isEnemy = isEnemy;
    this.health = 100;
    this.attacks = attacks;
  }

  attack({ attack, recipient, renderedSprites }) {
    const dialogueBox = document.getElementById('dialogBox');
    dialogueBox.style.display = 'block';
    dialogueBox.innerText = `${this.name} used ${attack.name}`;

    recipient.health -= attack.damage;
    let rotation = 1;
    let movementDistance = 20;
    let healthBar = '#enemyHealthBar';
    if (this.isEnemy) {
      movementDistance = -20;
      healthBar = '#healthBar';
      rotation = -2.2;
    }
    switch (attack.name) {
      case 'Tackle':
        const tl = gsap.timeline();

        tl.to(this.position, {
          x: this.position.x - movementDistance,
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              // Enemy gets hit
              gsap.to(recipient.position, {
                x: recipient.position.x + movementDistance,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              });

              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              });

              gsap.to(healthBar, {
                width: `${recipient.health}%`,
              });
            },
          })
          .to(this.position, {
            x: this.position.x - 20,
          });
        break;
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
            hold: 10,
          },
          animate: true,
          rotation,
        });

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
            });

            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            });

            gsap.to(healthBar, {
              width: `${recipient.health}%`,
            });
            renderedSprites.splice(1, 1);
          },
        });
    }
  }

  faint() {
    console.log('Faint ', this.name);
  }
}
