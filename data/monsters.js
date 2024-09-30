const monsters = {
  Emby: {
    position: {
      x: 600,
      y: 800,
    },
    image: {
      src: './img/embySprite.png',
    },
    frames: {
      max: 4,
      hold: 10,
    },
    animate: true,
    name: 'Emby',
    attacks: [attacks.Tackle, attacks.Fireball],
  },
  Draggle: {
    position: {
      x: 1500,
      y: 325,
    },
    image: {
      src: './img/draggleSprite.png',
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    isEnemy: true,
    name: 'Draggle',
    attacks: [
      attacks.Fireball,
      attacks.Tackle,
      attacks.Tackle,
      attacks.Tackle,
      attacks.Tackle,
      attacks.Tackle,
    ],
  },
};
