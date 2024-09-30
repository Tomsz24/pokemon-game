const battleBackgroundImage = new Image();
battleBackgroundImage.src = './img/battleBackground.png';

const battleBackground = new BackgroundSprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

let draggle;
let emby;
let renderedSprites;
let battleAnimationId;
let queue;

const initBattle = () => {
  // reset html
  document.getElementById('userInterface').style.display = 'block';
  document.getElementById('dialogBox').style.display = 'none';
  document.getElementById('healthBar').style.width = '100%';
  document.getElementById('enemyHealthBar').style.width = '100%';
  document.getElementById('attacksBox').replaceChildren();

  // init objects
  draggle = new Monster(monsters.Draggle);
  emby = new Monster(monsters.Emby);
  renderedSprites = [draggle, emby];
  queue = [];

  //exit function
  const exitFromBattle = () => {
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

          battle.initiated = false;
          audio.Map.play();
        },
      });
    });
  };

  emby.attacks.forEach((attack) => {
    const button = document.createElement('button');
    button.innerText = attack.name;
    document.getElementById('attacksBox').append(button);
  });

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
        exitFromBattle();
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
          exitFromBattle();
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
};
const animateBattle = () => {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
};

animate();

document.getElementById('dialogBox').addEventListener('click', () => {
  if (queue.length === 0) {
    document.getElementById('dialogBox').style.display = 'none';
  } else {
    queue[0]();
    queue.shift();
  }
});
