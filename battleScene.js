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

    const randomAttack =
      draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

    queue.push(() => {
      draggle.attack({
        attack: randomAttack,
        recipient: emby,
        renderedSprites,
      });
    });
  });
  button.addEventListener('mouseover', (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML];
    console.log(selectedAttack);
    document.getElementById('attackType').style.color = selectedAttack.color;
    document.getElementById('attackType').innerText = `
    Attack type: ${selectedAttack.type}
    
    Damage: ${selectedAttack.damage}
    `;
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
