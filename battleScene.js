const battleBackgroundImage = new Image();
battleBackgroundImage.src = './img/battleBackground.png';

const battleBackground = new BackgroundSprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

const draggle = new Monster(monsters.Draggle);
const emby = new Monster(monsters.Emby);

emby.attacks.forEach((attack) => {
  const button = document.createElement('button');
  button.innerText = attack.name;
  document.getElementById('attacksBox').append(button);
});

const renderedSprites = [draggle, emby];
const animateBattle = () => {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
};

animateBattle();

const queue = [];

// our event listener for buttons (attack)
document.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML];
    emby.attack({
      attack: selectedAttack,
      recipient: draggle,
      renderedSprites,
    });

    queue.push(() => {
      draggle.attack({
        attack: attacks.Tackle,
        recipient: emby,
        renderedSprites,
      });
    });
  });
});

document.getElementById('dialogBox').addEventListener('click', () => {
  console.log('clicked dialoge');
  if (queue.length === 0) {
    document.getElementById('dialogBox').style.display = 'none';
  } else {
    queue[0]();
    queue.shift();
  }
});
