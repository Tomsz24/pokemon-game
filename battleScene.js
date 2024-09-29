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
let battleAnimationId;
const animateBattle = () => {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
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

    //Check health of opponent
    if (draggle.health <= 0) {
      queue.push(() => {
        draggle.faint();
      });
      queue.push(() => {
        gsap.to('.flashing-background', {
          opacity: 1,
          onComplete: () => {
            cancelAnimationFrame(battleAnimationId);
            animate();
            document.getElementById('userInterface').style.display = 'none';
            gsap.to('.flashing-background', {
              opacity: 0,
            });
          },
        });
      });
      return;
    }

    // draggle or enemy attakc right here
    const randomAttack =
      draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

    queue.push(() => {
      draggle.attack({
        attack: randomAttack,
        recipient: emby,
        renderedSprites,
      });

      if (emby.health <= 0) {
        queue.push(() => {
          emby.faint();
        });
      }
    });
  });

  button.addEventListener('mouseover', (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML];

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
