const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");
const fps = 60;

let gameTick;

function start() {
  drawWalls();
  player.start();

  canvas.addEventListener("mousemove", (e) => {
    player.armController(e);
  });
}

function update() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  createRect(0, 0, canvas.width, canvas.height, "rect", "#7FACFF");

  grounds.forEach((ground) => {
    ground.update();
  });

  speed = player.running ? player.runningSpeed : player.speed;
  player.update();
}

start();
gameTick = setInterval(update, 1000 / fps);
