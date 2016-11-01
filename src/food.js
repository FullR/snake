const PI2 = Math.PI * 2;

export default class Food {
  constructor({x, y, color="#E06F8B"}) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  onCollision(game) {
    game.feedSnake(this);
  }

  render(game) {
    const {context, cellWidth, cellHeight} = game;
    const {x, y, color} = this;
    const radius = cellWidth / 2;

    context.save();
    context.fillStyle = color;
    context.beginPath();
    context.arc((x * cellWidth) + radius, (y * cellHeight) + radius, radius, 0, PI2);
    context.fill();
    context.restore();
  }
}
