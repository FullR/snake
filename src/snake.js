import {directions, directionOpposites} from "./constants";

export default class Snake {
  constructor({x, y, direction, tailLength=3, color="#44891A"}) {
    this.segments = [{x, y}]; // add the head segment
    this.growCount = tailLength; // the tail will grow as the snake begins to move
    this.direction = direction;
    this.color = color;
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

  render(game) {
    const {context, cellHeight, cellWidth} = game;
    const {segments, color} = this;
    context.save();
    context.fillStyle = color;
    segments.forEach(({x, y}) => {
      context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    });
    context.restore();
  }
}
