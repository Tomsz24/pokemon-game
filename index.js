const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionsMap = [];
const battleZonesMap = [];
const startingPoint = [];

for (let i = 0; i < playerStartingPoint.length; i += 70) {
  startingPoint.push(playerStartingPoint.slice(i, i + 70));
}

for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70));
}

for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, i + 70));
}

let lastKey;
let offset = {
  x: 0,
  y: -300,
};
const boundaries = [];

collisionsMap.forEach((row, index) => {
  row.forEach((symbol, jIndex) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: jIndex * Boundary.width + offset.x,
            y: index * Boundary.height + offset.y,
          },
        }),
      );
    }
  });
});

const battleZones = [];
battleZonesMap.forEach((row, index) => {
  row.forEach((symbol, jIndex) => {
    if (symbol === 1025) {
      battleZones.push(
        new Boundary({
          position: {
            x: jIndex * Boundary.width + offset.x,
            y: index * Boundary.height + offset.y,
          },
        }),
      );
    }
  });
});

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

const findPlayerStartingPoint = (mapData) => {
  for (let y = 0; y < mapData.length; y++) {
    for (let x = 0; x < mapData[y].length; x++) {
      if (mapData[y][x] === 1025) {
        return { x, y };
      }
    }
  }
  throw new Error(`Starting point hasn't been found`);
};
//
const whereToStart = findPlayerStartingPoint(startingPoint);
console.log(whereToStart);

const background = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: image,
});
const foreground = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: foregroundImage,
});
const player = new Sprite({
  // Dimensions of player image 192x68
  position: {
    x: whereToStart.x * Boundary.width + offset.x,
    y: whereToStart.y * Boundary.height + offset.y,
  },
  image: playerDownImage,
  frames: { max: 4, hold: 10 },
  sprites: {
    up: playerUpImage,
    down: playerDownImage,
    left: playerLeftImage,
    right: playerRightImage,
  },
});

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

const movables = [background, ...boundaries, foreground, ...battleZones];

const buffer = 0.35; // 35% collision buffer

const rectangleCollision = (rectangle1, rectangle2) => {
  return (
    rectangle1.position.x <
      rectangle2.position.x + rectangle2.width * (1 - buffer) &&
    rectangle1.position.x + rectangle1.width * (1 - buffer) >
      rectangle2.position.x &&
    rectangle1.position.y <
      rectangle2.position.y + rectangle2.height * (1 - buffer) &&
    rectangle1.position.y + rectangle1.height * (1 - buffer) >
      rectangle2.position.y
  );
};
const battle = {
  initiated: false,
};
const animate = () => {
  const animationId = window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battleZones.forEach((zone) => {
    zone.draw();
  });
  player.draw();
  foreground.draw();

  let move = true;
  player.animate = false;
  if (battle.initiated) return;

  // activate a battle
  if (keys.ArrowUp || keys.ArrowDown || keys.ArrowRight || keys.ArrowLeft) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width,
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height,
        ) -
          Math.max(player.position.y, battleZone.position.y));
      if (
        rectangleCollision(player, battleZone) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.02
      ) {
        window.cancelAnimationFrame(animationId);
        audio.Map.stop();
        audio.initBattle.play();
        audio.battle.play();
        battle.initiated = true;
        gsap.to('.flashing-background', {
          opacity: 1,
          repeat: 4,
          yoyo: true,
          duration: 0.4,
          onComplete: () => {
            initBattle();
            animateBattle();
            gsap.to('.flashing-background', {
              opacity: 0,
            });
          },
        });
        // animateBattle();
        break;
      }
    }
  }

  if (keys.ArrowUp && lastKey === 'ArrowUp') {
    player.animate = true;
    player.image = player.sprites.up;
    for (let i = 1; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangleCollision(player, {
          ...boundary,
          position: {
            x: boundary.position.x,
            y: boundary.position.y + speed,
          },
        })
      ) {
        move = false;
        break;
      }
    }
    if (move) {
      movables.forEach((move) => {
        move.position.y += speed;
      });
    }
  } else if (keys.ArrowDown && lastKey === 'ArrowDown') {
    player.animate = true;
    player.image = player.sprites.down;
    for (let i = 1; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangleCollision(player, {
          ...boundary,
          position: {
            x: boundary.position.x,
            y: boundary.position.y - speed,
          },
        })
      ) {
        move = false;
        break;
      }
    }
    if (move) {
      movables.forEach((move) => {
        move.position.y -= speed;
      });
    }
  } else if (keys.ArrowLeft && lastKey === 'ArrowLeft') {
    player.animate = true;
    player.image = player.sprites.left;
    for (let i = 1; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangleCollision(player, {
          ...boundary,
          position: {
            x: boundary.position.x + speed,
            y: boundary.position.y,
          },
        })
      ) {
        move = false;
        break;
      }
    }
    if (move) {
      movables.forEach((move) => {
        move.position.x += speed;
      });
    }
  } else if (keys.ArrowRight && lastKey === 'ArrowRight') {
    player.animate = true;
    player.image = player.sprites.right;
    for (let i = 1; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangleCollision(player, {
          ...boundary,
          position: {
            x: boundary.position.x,
            y: boundary.position.y - speed,
          },
        })
      ) {
        move = false;
        break;
      }
    }
    if (move) {
      movables.forEach((move) => {
        move.position.x -= speed;
      });
    }
  }
};

// animate();

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      keys.ArrowUp = true;
      lastKey = e.key;
      break;
    case 'ArrowDown':
      keys.ArrowDown = true;
      lastKey = e.key;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft = true;
      lastKey = e.key;
      break;
    case 'ArrowRight':
      keys.ArrowRight = true;
      lastKey = e.key;
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      keys.ArrowUp = false;
      break;
    case 'ArrowDown':
      keys.ArrowDown = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft = false;
      break;
    case 'ArrowRight':
      keys.ArrowRight = false;
      break;
  }
});

let mainMusic = false;
window.addEventListener('click', () => {
  if (!mainMusic) {
    audio.Map.play();
    mainMusic = true;
  }
});
