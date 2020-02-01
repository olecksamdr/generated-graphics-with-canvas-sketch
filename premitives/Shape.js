import { easeInOutQuint } from '../utils/easing';
import fadeOutOpacity from '../utils/fadeOutOpacity';

class Shape {
  constructor(x, y, radius = 3) {
    this.x = x;
    this.y = y;
    this.offset = Math.random();
    this.verticesCount = 3 + Math.floor(Math.random() * 4);
    this.verticesCoords = [];

    let angle, vx, vy;
    for (let i = 0; i < this.verticesCount; i++) {
      angle = i * 2 * Math.PI / this.verticesCount + this.offset * Math.PI * 2;
      vx = this.x + Math.sin(angle) * radius;
      vy = this.y + Math.cos(angle) * radius;

      this.verticesCoords.push([vx, vy]);
    }
  }

  draw(context, playhead) {
    const progress = easeInOutQuint((1 - playhead + this.offset) % 1);
    let realProgress = 1
    const [startX, startY] = this.verticesCoords[0];
    let opacity = 0;

    if (progress > 0.9) {
      // fade in [0, 1]
      const ratio = (1 - progress) / 0.03
      opacity = ratio > 1 ? 1 : ratio;
    } else {
      realProgress = progress / 0.9;
      opacity = realProgress;
    }

    context.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
    context.beginPath();
    context.moveTo(startX * realProgress, startY * realProgress);

    for (let i = 1; i < this.verticesCoords.length; i++) {
      let [x, y] = this.verticesCoords[i];
      context.lineTo(x * realProgress, y * realProgress)
    }

    context.closePath();
    context.stroke();
  }
}

export default Shape;
