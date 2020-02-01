import canvasSketch from 'canvas-sketch';

import Line from './premitives/Line';
import Shape from './premitives/Shape';
import arrayFrom from './utils/arrayFrom';

const settings = {
  dimensions: [1280, 720],
  duration: 4,
  animate: true
};

const LINES_COUNT = 500;

const sketch = ({ width, height }) => {
  const lines = arrayFrom(() => new Line(), LINES_COUNT);
  const shapes = [];

  // Size of canvas. 
  const precision = 150;
  const imageData = Array.from(Array(precision), () => new Array(precision));
  const imgCanvas = document.createElement('canvas');

  imgCanvas.style.display = 'none';
  imgCanvas.width = precision;
  imgCanvas.height = precision;

  const imgCanvasContext = imgCanvas.getContext('2d');
  const image = new Image();

  image.src = '/assets/text.png';

  image.onload = function () {
    imgCanvasContext.drawImage(image, 0, 0, precision, precision);

    const { data } = imgCanvasContext.getImageData(0, 0, precision, precision);

    let x, y;
    for (let i = 0; i < data.length; i += 4) {
      x = (i / 4) % precision;
      y = Math.floor((i / 4) / precision);
      imageData[x][y] = data[i];

      //  if is black
      if (imageData[x][y] < 255 && Math.random() > 0.3) {
        shapes.push(new Shape(
          (x - precision / 2) * 3,
          (y - precision / 2) * 3
        ))
      }
    }
  }

  document.body.appendChild(imgCanvas);

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