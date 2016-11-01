import Snake from "./snake";
import Food from "./food";
import Wall from "./wall";
import UserInterface from "./user-interface";
import controls from "./controls";
import {directions} from "./constants";

export default class SnakeGame {
  constructor({width, height, rows, columns, fps=15, backgroundColor="#1B2632"}) {
    this.width = width; // canvas width
    this.height = height; // canvas height
    this.rows = rows; // number of horizontal cells
    this.columns = columns; // number of vertical cells
    this.fps = fps;
    this.backgroundColor = backgroundColor;
    this.cellWidth = width / columns;
    this.cellHeight = height / rows;
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = width;
    this.canvas.height = height;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.ui = new UserInterface();
    this.addEventListeners();
    this.reset();
  }

  reset() {
    const {columns, rows} = this;
    this.gameover = false;
    this.started = false;
    this.score = 0;
    this.collidables = [];
    this.turnDirection = null; // used to queue up changes in direction to avoid multiple turns in a single frame
    this.snake = new Snake({ // snake starts at the center
      tailLength: 3,
      x: Math.floor(columns / 2),
      y: Math.floor(rows / 2)
    });
    this.placeFood();
    this.addWalls();
    this.render();
    clearInterval(this.gameInterval);
  }

  end() {
    this.gameover = true;
  }

  addWalls() {
    const {columns, rows} = this;
    for(let x = 0; x < columns; x++) {
      const left = new Wall({x, y: 0});
      const right = new Wall({x, y: rows - 1});
      this.collidables.push(left, right)
    }
    for(let y = 0; y < columns; y++) {
      const top = new Wall({x: 0, y});
      const bottom = new Wall({x: columns - 1, y});
      this.collidables.push(top, bottom)
    }
  }

  handleKeyDown(event) {
    const UP = 87;
    const DOWN = 83;
    const LEFT = 65;
    const RIGHT = 68;
    const {snake, started, gameover} = this;
    const {which: keyCode} = event;

    if(controls.up(keyCode)) this.turnDirection = directions.UP;
    else if(controls.down(keyCode)) this.turnDirection = directions.DOWN;
    else if(controls.left(keyCode)) this.turnDirection = directions.LEFT;
    else if(controls.right(keyCode)) this.turnDirection = directions.RIGHT;

    if(!started) {
      this.start();
    }
    if(gameover) {
      this.reset();
    }
  }

  addEventListeners() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  placeFood() {
    const {columns, rows} = this;
    const food = new Food({
      x: Math.floor(Math.random() * columns),
      y: Math.floor(Math.random() * rows)
    });
    this.collidables.push(food);
  }

  feedSnake(food) {
    this.score += 1;
    this.snake.grow(6);
    food.destroyed = true;
    this.placeFood();
  }

  start() {
    const {fps} = this;
    this.started = true;
    this.gameInterval = setInterval(() => {
      this.step();
      this.render();
    }, 1000 / fps);
    return this;
  }

  step() {
    const {snake, collidables, turnDirection, columns, rows, gameover} = this;

    if(!gameover) {
      const collisions = collidables.filter((c) => c.onCollision && snake.isHeadAt(c));
      collisions.forEach((collider) => collider.onCollision(this));

      if(turnDirection) {
        snake.setDirection(turnDirection);
        this.turnDirection = null;
      }
      if(snake.canStep(columns, rows)) {
        snake.step();
      } else {
        this.gameover = true;
      }

      this.collidables = this.collidables.filter((c) => !c.destroyed);
    }
  }

  render() {
    const {snake, collidables, ui, width, height, backgroundColor, context} = this;
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);

    collidables.forEach((c) => c.render(this));
    snake.render(this);
    ui.render(this);
  }
}
