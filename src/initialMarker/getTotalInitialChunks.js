const sumBy = require('lodash/sumBy');

module.exports = (initialSortedArr) => {
    const totalGzip = parseFloat((sumBy(initialSortedArr, 'gzipSizeInKB').toFixed(2)));
    return {label: 'Total Initial Loading Resources', gzipSizeInKB: totalGzip};
};
