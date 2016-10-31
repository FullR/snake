const directions = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT"
};

// used to keep the user from doing an in-place 180 (and losing immediately)
const directionOpposites = {
  [directions.UP]: directions.DOWN,
  [directions.DOWN]: directions.UP,
  [directions.LEFT]: directions.RIGHT,
  [directions.RIGHT]: directions.LEFT
};

// used to determine what action a keypress corresponds to
const controls = {
  up(keyCode) {
    return keyCode === 38 || keyCode === 87;
  },

  down(keyCode) {
    return keyCode === 40 || keyCode === 83;
  },

  left(keyCode) {
    return keyCode === 37 || keyCode === 65
  },

  right(keyCode) {
    return keyCode === 39 || keyCode === 68
  }
};

class Snake {
  constructor({x, y, direction, tailLength=3}) {
    this.segments = [{x, y}]; // add the head segment
    this.growCount = tailLength; // the tail will grow as the snake begins to move
    this.direction = direction;
  }

  // returns the coordinates the snake's head is going to move into
  getNextPosition() {
    const {x, y} = this.segments[0];
    switch(this.direction) {
      case directions.UP: return {x, y: y - 1};
      case directions.DOWN: return {x, y: y + 1};
      case directions.LEFT: return {x: x - 1, y};
      case directions.RIGHT: return {x: x + 1, y};
    }
  }

  // returns true if the snake's head is at the passed coordinates
  isHeadAt({x, y}) {
    const {x: hx, y: hy} = this.segments[0];
    return x === hx && y === hy;
  }

  // returns whether or not the snake is about to run into a wall or itself
  canStep(columns, rows) {
    const {segments} = this;
    const {x, y} = this.getNextPosition();
    return x >= 0 && y >= 0 && x < columns && y < rows && !segments.find((s) => s.x === x && s.y === y);
  }

  // Queues `count` segments to be added. Queued segments are added 1 per step to the end of the snake
  grow(count=1) {
    this.growCount += count;
  }

  // Changes the snake's direction as long as the new direction isn't the opposite of the current direction (ex. up -> down)
  setDirection(direction) {
    if(direction !== directionOpposites[this.direction]) {
      this.direction = direction;
    }
  }

  // Moves and grows the snake
  step() {
    const {segments, direction, growCount} = this;
    const head = segments[0];
    const {length} = segments;
    const nextPosition = this.getNextPosition();
    const lastSegmentPos = {
      x: head.x,
      y: head.y
    };

    // move head
    head.x = nextPosition.x;
    head.y = nextPosition.y;

    // each tail segment follows the segment before it
    for(let i = 1; i < length; i++) {
      const segment = segments[i];
      const {x, y} = segment;
      segment.x = lastSegmentPos.x;
      segment.y = lastSegmentPos.y;
      lastSegmentPos.x = x;
      lastSegmentPos.y = y;
    }

    // append a new segment at the end if any grow segments are queued
    if(growCount > 0) {
      segments.push({
        x: lastSegmentPos.x,
        y: lastSegmentPos.y
      });
      this.growCount -= 1;
    }
  }
}

class SnakeGame {
  constructor({width, height, rows, columns, fps=15, backgroundColor="#1B2632", snakeColor="#44891A", foodColor="#E06F8B", scoreColor="#FFFFFF"}) {
    this.width = width; // canvas width
    this.height = height; // canvas height
    this.rows = rows; // number of horizontal cells
    this.columns = columns; // number of vertical cells
    this.fps = fps;
    this.backgroundColor = backgroundColor;
    this.snakeColor = snakeColor;
    this.foodColor = foodColor;
    this.scoreColor = scoreColor;
    this.cellWidth = width / columns;
    this.cellHeight = height / rows;
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = width;
    this.canvas.height = height;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.addEventListeners();
    this.reset();
  }

  reset() {
    const {columns, rows} = this;
    this.gameover = false;
    this.started = false;
    this.score = 0;
    this.food = [];
    this.turnDirection = null; // used to queue up changes in direction to avoid multiple turns in a single frame
    this.snake = new Snake({ // snake starts at the center
      tailLength: 3,
      x: Math.floor(columns / 2),
      y: Math.floor(rows / 2)
    });
    this.placeFood();
    this.render();
    clearInterval(this.gameInterval);
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

  handlePress(event) {
    const {x, y} = getTouchPos(this.canvas, event);
    const snakePos = this.snake.segments[0];
    const dx = snakePos.x - x;
    const dy = snakePos.y - y;

    if(dx > dy) {
      if(dx > 0) {
        this.turnDirection = directions.RIGHT;
      } else {
        this.turnDirection = directions.LEFT;
      }
    } else {
      if(dy > 0) {
        this.turnDirection = directions.DOWN;
      } else {
        this.turnDirection = directions.UP;
      }
    }
  }

  addEventListeners() {
    window.addEventListener("keydown", this.handleKeyDown);
    this.canvas.addEventListener("touchstart", this.handlePress);
  }

  placeFood() {
    const {columns, rows} = this;
    const food = {
      x: Math.floor(Math.random() * columns),
      y: Math.floor(Math.random() * rows)
    };
    this.food.push(food);
  }

  eatFood(food) {
    this.score += 1;
    this.snake.grow(3);
    this.food.splice(this.food.indexOf(food), 1);
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
    const {snake, food, turnDirection, columns, rows, gameover} = this;

    if(!gameover) {
      const foodBeingEaten = food.find((food) => snake.isHeadAt(food));
      if(foodBeingEaten) {
        this.eatFood(foodBeingEaten);
      }

      if(turnDirection) {
        snake.setDirection(turnDirection);
        this.turnDirection = null;
      }
      if(snake.canStep(columns, rows)) {
        snake.step();
      } else {
        this.gameover = true;
      }
    }
  }

  render() {
    const {snake, food, gameover, score, width, height, cellWidth, cellHeight, backgroundColor, snakeColor, foodColor, scoreColor, context} = this;
    const {segments} = snake;
    const foodRadius = cellWidth / 2;
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);

    // draw food
    context.save();
    context.fillStyle = foodColor;
    food.forEach((food) => {
      context.beginPath();
      context.arc((food.x * cellWidth) + foodRadius, (food.y * cellHeight) + foodRadius, foodRadius, 0, Math.PI * 2);
      context.fill();
    });
    context.restore();

    // draw snake
    context.save();
    context.fillStyle = snakeColor;
    segments.forEach(({x, y}) => {
      context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    });
    context.restore();

    // draw score
    context.save();
    context.fillStyle = scoreColor;
    context.font = "15px Arial";
    context.fillText(`${score}`, 5, 15);
    context.restore();

    if(gameover) {
      const centerX = width / 2;
      const centerY = height / 2;

      context.save();
      // draw gameover overlay
      context.globalAplha = 0.5;
      context.fillStyle = "rgba(0, 0, 0, 0.8)";
      context.textAlign = "center";
      context.fillRect(0, 0, width, height);

      // draw gameover text
      context.fillStyle = "#FFF";
      context.font = "50px Arial";
      context.fillText("Game Over", centerX, centerY - 50);
      context.font = "35px Arial";
      context.fillText(`Score: ${score}`, centerX, centerY + 25)
      context.fillText("Press any key to restart", centerX, centerY + 75)
      context.restore();
    }
  }
}

function last(arr) {
  return arr[arr.length - 1];
}

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
