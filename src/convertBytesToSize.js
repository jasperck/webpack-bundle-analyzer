module.exports = {
  convertBytesToSize
};

function convertBytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) return '0 Byte';

  const item = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  return Number(bytes / Math.pow(1024, item)).toFixed(2) + ' ' + sizes[item];
}
