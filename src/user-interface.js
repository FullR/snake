export default class UserInterface {
  constructor({textColor="#FFFFFF"}={}) {
    this.textColor = textColor;
  }

  render(game) {
    const {context, width, height, score, gameover} = game;
    const {textColor} = this;

    // draw score
    context.save();
    context.fillStyle = textColor;
    context.font = "15px Arial";
    context.fillText(`${score}`, 5, 15);
    context.restore();

    if(gameover) {
      const centerX = width / 2;
      const centerY = height / 2;

      // draw gameover overlay
      context.save();
      context.globalAplha = 0.5;
      context.fillStyle = "rgba(0, 0, 0, 0.8)";
      context.textAlign = "center";
      context.fillRect(0, 0, width, height);

      // draw gameover text
      context.fillStyle = textColor;
      context.font = "50px Arial";
      context.fillText("Game Over", centerX, centerY - 50);
      context.font = "35px Arial";
      context.fillText(`Score: ${score}`, centerX, centerY + 25)
      context.fillText("Press any key to restart", centerX, centerY + 75)
      context.restore();
    }
  }
}
