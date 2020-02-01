import canvasSketch from 'canvas-sketch';

import Line from './premitives/Line';
import Shape from './premitives/Shape';
import arrayFrom from './utils/arrayFrom';
import getImageData from './utils/getImageData';

const settings = {
  dimensions: [1280, 720],
  duration: 4,
  animate: true
};

const LINES_COUNT = 500;

const sketch = ({ width, height }) => {
  const lines = arrayFrom(() => new Line(), LINES_COUNT);
  const shapes = [];

  // This value allows scaling a generated result from image
  const SCALE = 3;

  // The loaded image will be scaled down to square with
  // width and height equals to precision. 
  const PERCISION = 150;

  // To add more rondom we will not draw every point.
  // We chouse only thouse points for which condition
  // Math.random() > RANDOM_BOUNDARY is true
  const RANDOM_BOUNDARY = 0.3;

  // Generate shapes in place of black pixels from an image
  getImageData({
     imageUrl: '/assets/text.png',
     precision: PERCISION,
  }).then(imageData => {
    for (let x = 0; x < imageData.length; x++) {
      for (let y = 0; y < imageData[x].length; y++) {
        if (imageData[x][y] < 255 && Math.random() > RANDOM_BOUNDARY) {
          shapes.push(new Shape(
            (x - PERCISION / 2) * SCALE,
            (y - PERCISION / 2) * SCALE
          ))
        }
      }
    }
  });

  return ({ context, playhead }) => {
    context.fillStyle = '#000';
    context.clearRect(0, 0, width, height);
    context.fillRect(0, 0, width, height);

    context.fillStyle = '#fff';

    context.save();
    context.translate(width / 2, height / 2);

    lines.forEach(line => {
      context.save();
      context.rotate(line.angle);
      line.draw(context, playhead);
      context.restore();
    });

    shapes.forEach(shape => {
      shape.draw(context, playhead);
    });

    context.restore();
  };
};

canvasSketch(sketch, settings);