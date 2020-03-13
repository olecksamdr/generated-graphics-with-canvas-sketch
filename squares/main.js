import canvasSketch from 'canvas-sketch';
import { clamp01 } from 'canvas-sketch-util/math';

const settings = {
  dimensions: [1920, 1080],
  duration: 6,
  animate: true,
  fps: 36,
};

const SQUARE_SIZE = 50;

const easeInOutCubic = t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;

const sketch = ({ width, height }) => {
  // gap between squares is equal to size so we multiply SQUARE_SIZE by 2
  const cols = Math.ceil(width / (2 * SQUARE_SIZE)) + 1;
  const rows = Math.ceil(height / (2 * SQUARE_SIZE)) + 1;
  const squares = [];

  const maxDistanceFromCenter = Math.sqrt((width / 2)**2 + (height / 2)**2);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // (-width / 2, -height / 2) - left top corner
      // (0, 0) - center of the canvas
      // (width / 2, height / 2) - bottom right corner
      const x = j * 2 * SQUARE_SIZE - width / 2;
      const y = i * 2 * SQUARE_SIZE - height / 2;

      // distance from point with coordinates (0, 0)
      const currentDistanceFromCenter = Math.sqrt(x**2 + y**2);
      squares.push({
        x,
        y,
        // offset go from 0 to 1
        offset: currentDistanceFromCenter / maxDistanceFromCenter,
      })
    }
  }

  // Another effect: squares.sort((a, b) => b.offset - a.offset).reverse();
  squares.sort((a, b) => b.offset - a.offset);

  return ({ context, playhead }) => {
    const linearProgress = playhead <= 0.5 ? playhead / 0.5 : (1 - playhead) / 0.5
    const progress = easeInOutCubic(linearProgress);

    context.fillStyle = '#000';
    context.clearRect(0, 0, width, height);
    context.fillRect(0, 0, width, height);

    context.strokeStyle = '#fff';
    context.lineWidth = 10 + 20 * progress;

    context.save();
    // (0, 0) coordinate will be in the center of the screen
    context.translate(width / 2, height / 2)

    squares.forEach(square => {
      const currentProgress = playhead <= 0.5
      ? clamp01((progress - 0.8 * square.offset) / 0.2)
      : clamp01(progress + 5 * (square.offset - (1 - progress)));

      // each square will grow from SQUARE_SIZE to 4 * SQUARE_SIZE
      const currentSize = SQUARE_SIZE + 3 * SQUARE_SIZE * currentProgress;

      context.save();
      context.translate(square.x, square.y);
      context.rotate(currentProgress * Math.PI / 4)
      context.beginPath();
      // Set rotation origin to the center of square
      context.rect(
        -currentSize / 2,
        -currentSize / 2,
        currentSize,
        currentSize
      );
      context.stroke();
      context.fill();
      context.restore();
    });

    context.restore();
  };
};

canvasSketch(sketch, settings);