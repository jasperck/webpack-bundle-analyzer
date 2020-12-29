const bytes = require('bytes');

module.exports = (arr) => {
  const dataToKb = arr.map((item) => {
    const sizeInBytes = bytes(item.gzipSize);
    const convertToKb = bytes(sizeInBytes, { unit: 'KB', unitSeparator: ' ' });
    const sizeInKb = convertToKb.split(' ')[0];
    item.gzipSizeInKB = parseFloat(sizeInKb);
    return item;
  });
  return dataToKb;
};
