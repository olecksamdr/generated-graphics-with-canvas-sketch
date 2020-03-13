import { easeInOutQuint } from '../utils/easing';
import fadeOutOpacity from '../utils/fadeOutOpacity';

class Line {
  constructor() {
    this.start = 1400;
    this.finish = this.start + Math.random() * 500;
    this.angle = Math.random() * 2 * Math.PI;
    this.offset = Math.random();
  }

  draw(context, playhead) {
    // Range: [1, 0]
    // Expr: 1 - playhead

    // Range [1 + offset, offset]
    // Expr: 1 - playhead + this.offset

    // Range [offset, offset]
    // (1 - playhead + this.offset) % 1
    const progress = easeInOutQuint((1 - playhead + this.offset) % 1);
    let opacity = fadeOutOpacity(progress, 0.5);

    context.beginPath();
    context.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
    context.lineWidth = 2;
    context.moveTo(this.start * progress, 0);
    context.lineTo(this.finish * progress, 0);
    context.stroke();
  }
}

export default Line;
