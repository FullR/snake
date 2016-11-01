import SnakeGame from "./snake-game";

const width = Math.min(window.innerWidth, 1000);
const height = width * 0.8;

const game = new SnakeGame({
  width,
  height,
  fps: 15,
  rows: 80,
  columns: 100
});

document.body.appendChild(game.canvas);
