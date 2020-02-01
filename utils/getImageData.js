const getImageData = ({ imageUrl, precision }) => {
  const imageData = Array.from(Array(precision), () => new Array(precision));
  const imgCanvas = document.createElement('canvas');

  imgCanvas.width = precision;
  imgCanvas.height = precision;
  imgCanvas.style.display = 'none';

  document.body.appendChild(imgCanvas);

  const context = imgCanvas.getContext('2d');
  const image = new Image();

  image.src = imageUrl;


  return new Promise(resolve => {
    image.onload = function () {
      context.drawImage(image, 0, 0, precision, precision);
  
      const { data } = context.getImageData(0, 0, precision, precision);
  
      let x, y;
      for (let i = 0; i < data.length; i += 4) {
        x = (i / 4) % precision;
        y = Math.floor((i / 4) / precision);
        imageData[x][y] = data[i];
      }

      resolve(imageData);
    }
  });
}

export default getImageData;
