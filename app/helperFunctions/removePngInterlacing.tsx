const fs = require('fs');
const { PNG } = require('pngjs');
const imageType = require('image-type');

const removePngInterlacing = file => {
  const buffer = fs.readFileSync(file);
  const { mime } = imageType(buffer);

  if (mime === 'image/png') {
    const png = PNG.sync.read(buffer);
    if (png.interlace) {
      return PNG.sync.write(png, { interlace: false });
    }
  }
  return file;
}

module.exports = removePngInterlacing;
