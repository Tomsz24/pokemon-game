const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionsMap = []
for (let i = 0; i < collisions.length; i+= 70) {
  collisionsMap.push(collisions.slice(i, i + 70));
}
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

console.log(boundaries)
// ctx.fillRect(0, 0, canvas.width, canvas.height);


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

const movables = [background, ...boundaries, foreground];

const rectangleCollision =(rectangle1, rectangle2) => {
  return (
      rectangle1.position.x < rectangle2.position.x + rectangle2.width &&
      rectangle1.position.x + rectangle1.width > rectangle2.position.x &&
      rectangle1.position.y < rectangle2.position.y + rectangle2.height &&
      rectangle1.position.y + rectangle1.height > rectangle2.position.y
  );
}

const animate = () => {
  window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach(boundary => {
    boundary.draw();

  });
  player.draw();
  foreground.draw();

  let move = true;
  player.moving = false;
  if (keys.ArrowUp && lastKey === 'ArrowUp') {
    player.moving = true;
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
    player.moving = true;
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
    player.moving = true;
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
    player.moving = true;
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

animate()

window.addEventListener('keydown', (e) => {
  console.log('key has been pressed', e)
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

