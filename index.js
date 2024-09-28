const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(gsap);

const collisionsMap = [];
const battleZonesMap = [];

for (let i = 0; i < collisions.length; i+= 70) {
  collisionsMap.push(collisions.slice(i, i + 70));
}

for (let i = 0; i < battleZonesData.length; i+= 70) {
  battleZonesMap.push(battleZonesData.slice(i, i + 70));
}

console.log(collisionsMap)
console.log(battleZonesMap)
let lastKey;
const offset = {
  x: 0,
  y: -300
}
const boundaries = []

collisionsMap.forEach((row, index) => {
  row.forEach((symbol, jIndex) => {
    if (symbol === 1025) {
      boundaries.push(new Boundary({
        position: {
          x: jIndex * Boundary.width + offset.x,
          y: index * Boundary.height + offset.y
        }
      }));
    }
  })
})

const battleZones = [];
battleZonesMap.forEach((row, index) => {
  row.forEach((symbol, jIndex) => {
    if (symbol === 1025) {
      battleZones.push(new Boundary({
        position: {
          x: jIndex * Boundary.width + offset.x,
          y: index * Boundary.height + offset.y
        }
      }));
    }
  })
})

console.log(battleZones)


const image = new Image();
image.src = './img/PelletTown.png';
const foregroundImage = new Image();
foregroundImage.src = './img/foregroundObjects.png';

const playerDownImage = new Image();
playerDownImage.src = './img/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './img/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = './img/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = './img/playerRight.png';


const speed = 3;


const background = new Sprite({position: { x: offset.x, y: offset.y }, image: image});
const foreground = new Sprite({position: {x: offset.x, y: offset.y}, image: foregroundImage});
const player = new Sprite({
  // Dimensions of player image 192x68
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  frames: {max: 4},
  sprites: {
    up: playerUpImage,
    down: playerDownImage,
    left: playerLeftImage,
    right: playerRightImage,
  }
})

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
}

const movables = [background, ...boundaries, foreground, ...battleZones];

const rectangleCollision =(rectangle1, rectangle2) => {
  return (
      rectangle1.position.x < rectangle2.position.x + rectangle2.width &&
      rectangle1.position.x + rectangle1.width > rectangle2.position.x &&
      rectangle1.position.y < rectangle2.position.y + rectangle2.height &&
      rectangle1.position.y + rectangle1.height > rectangle2.position.y

  );
}
const battle = {
  initiated: false,
}
const animate = () => {
  const animationId = window.requestAnimationFrame(animate);
  // console.log(animationId)
  background.draw();
  boundaries.forEach(boundary => {
    boundary.draw();
  });
  battleZones.forEach(zone => {
    zone.draw();
  })
  player.draw();
  foreground.draw();

  let move = true;
  player.animate = false;
  if(battle.initiated) return

  // activate a battle
  if (keys.ArrowUp || keys.ArrowDown || keys.ArrowRight || keys.ArrowLeft) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
            player.position.x + player.width,
            battleZone.position.x + battleZone.width
          ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
            player.position.y + player.height,
            battleZone.position.y + battleZone.height
          ) -
          Math.max(player.position.y, battleZone.position.y))
      if (rectangleCollision(player, battleZone) && overlappingArea > (player.width * player.height) / 2 && Math.random() < 0.02) {
        console.log('Wszedles do strefy walki')
        window.cancelAnimationFrame(animationId);
        battle.initiated = true;
        gsap.to('.flashing-background', {
          opacity: 1,
          repeat: 4,
          yoyo: true,
          duration: 0.4,
          onComplete: () => {
            animateBattle()
            gsap.to('.flashing-background', {
              opacity: 0,
            })
          }
        })
        // animateBattle();
        break
      }
    }
  }


  if (keys.ArrowUp && lastKey === 'ArrowUp') {
    player.animate = true;
    player.image = player.sprites.up
    for (let i = 1; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (rectangleCollision(player, {...boundary, position: {
        x: boundary.position.x,
        y: boundary.position.y + speed
      }})) {
        console.log('blokada')
        move = false;
        break
      }
    }
    if (move) {
      movables.forEach((move) => {
        move.position.y += speed;
      })
    }
  } else if (keys.ArrowDown && lastKey === 'ArrowDown') {
    player.animate = true;
    player.image = player.sprites.down;
    for (let i = 1; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (rectangleCollision(player, {...boundary, position: {
          x: boundary.position.x,
          y: boundary.position.y - speed
        }})) {
        console.log('blokada')
        move = false;
        break
      }
    }
    if (move) {
      movables.forEach((move) => {
        move.position.y -= speed;
      })
    }
  } else if (keys.ArrowLeft && lastKey === 'ArrowLeft') {
    player.animate = true;
    player.image = player.sprites.left
    for (let i = 1; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (rectangleCollision(player, {...boundary, position: {
          x: boundary.position.x + speed,
          y: boundary.position.y
        }})) {
        console.log('blokada')
        move = false;
        break
      }
    }
    if (move) {
      movables.forEach((move) => {
        move.position.x += speed;
      })
    }
  } else if (keys.ArrowRight && lastKey === 'ArrowRight') {
    player.animate = true;
    player.image = player.sprites.right
    for (let i = 1; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (rectangleCollision(player, {...boundary, position: {
          x: boundary.position.x,
          y: boundary.position.y - speed
        }})) {
        console.log('blokada')
        move = false;
        break
      }
    }
    if (move) {
      movables.forEach((move) => {
        move.position.x -= speed;
      })
    }
  }
}

// animate();

const battleBackgroundImage = new Image();
battleBackgroundImage.src = './img/battleBackground.png';

const battleBackground = new BackgroundSprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage
})

const draggleImage = new Image();
draggleImage.src = './img/draggleSprite.png';

const draggle = new Sprite({
  position: {
    x: 1500,
    y: 325
  },
  image: draggleImage,
  frames: {
    max: 4,
    hold: 30
  },
  animate: true,
  isEnemy: true,
})

const embyImage = new Image();
embyImage.src = './img/embySprite.png';

const emby = new Sprite({
  position: {
    x: 600,
    y: 800
  },
  image: embyImage,
  frames: {
    max: 4,
    hold: 10
  },
  animate: true
})

const renderedSprites = [draggle, emby];
const animateBattle = () => {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach(sprite => {
    sprite.draw()
  })
}

animateBattle();

// our event listener for buttons (attack)
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML]
    emby.attack({
      attack: selectedAttack,
      recipient: draggle,
      renderedSprites
    })
  })
})

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      keys.ArrowUp = true
      lastKey = e.key;
      break
    case 'ArrowDown':
      keys.ArrowDown = true
      lastKey = e.key;
      break
    case 'ArrowLeft':
      keys.ArrowLeft = true
      lastKey = e.key;
      break
    case 'ArrowRight':
      keys.ArrowRight = true
      lastKey = e.key;
      break
  }
})

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      keys.ArrowUp = false
      break
    case 'ArrowDown':
      keys.ArrowDown = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft = false
      break
    case 'ArrowRight':
      keys.ArrowRight = false
      break
  }
})

