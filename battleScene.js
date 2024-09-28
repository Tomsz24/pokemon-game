const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/battleBackground.png";

const battleBackground = new BackgroundSprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

const draggleImage = new Image();
draggleImage.src = "./img/draggleSprite.png";

const draggle = new Sprite({
  position: {
    x: 1500,
    y: 325,
  },
  image: draggleImage,
  frames: {
    max: 4,
    hold: 30,
  },
  animate: true,
  isEnemy: true,
  name: "Draggle",
});

const embyImage = new Image();
embyImage.src = "./img/embySprite.png";

const emby = new Sprite({
  position: {
    x: 600,
    y: 800,
  },
  image: embyImage,
  frames: {
    max: 4,
    hold: 10,
  },
  animate: true,
  name: "Emby",
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
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (e) => {
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

document.getElementById("dialogBox").addEventListener("click", () => {
  console.log("clicked dialoge");
  if (queue.length === 0) {
    document.getElementById("dialogBox").style.display = "none";
  } else {
    queue[0]();
    queue.shift();
  }
});
