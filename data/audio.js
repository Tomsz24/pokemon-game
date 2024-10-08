const audio = {
  Map: new Howl({
    src: './audio/map.wav',
    html5: true,
  }),
  initBattle: new Howl({
    src: './audio/initBattle.wav',
    html5: true,
    volume: 0.1,
  }),
  battle: new Howl({
    src: './audio/battle.mp3',
    html5: true,
    volume: 0.3,
  }),
  tackleHit: new Howl({
    src: './audio/tackleHit.wav',
    html5: true,
    volume: 0.5,
  }),
  fireballInit: new Howl({
    src: './audio/initFireball.wav',
    html5: true,
    volume: 0.5,
  }),
  fireballHit: new Howl({
    src: './audio/fireballHit.wav',
    html5: true,
    volume: 0.5,
  }),
  victory: new Howl({
    src: './audio/victory.wav',
    html5: true,
    volume: 0.5,
  }),
};
