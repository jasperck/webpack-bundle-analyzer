const sortWithExtension = require('./sortWithExtension')
const convertToKb = require('./convertToKb');

module.exports = (arr) => {
    const sortedArr = sortWithExtension(arr);
    const arrInKb = convertToKb(sortedArr);
    return arrInKb;
};
