export default class Wall {
  constructor({x, y, color="#888"}) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  onCollision(game) {
    game.end();
  }

  render(game) {
    const {context, cellWidth, cellHeight} = game;
    const {x, y, color} = this;
    const cx = x * cellWidth
    const cy = y * cellHeight

    context.save();
    context.fillStyle = context.strokeStyle = color;
    context.fillRect(cx, cy, cellWidth, cellHeight);
    context.strokeRect(cx, cy, cellWidth, cellHeight);
    context.restore();
  }
}
