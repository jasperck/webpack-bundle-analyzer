const sortBy = require('lodash/sortBy');

const sortArr = (arr) => sortBy(arr, [arrData => arrData.label.toLowerCase()]);

module.exports = (arr) => {
    let cssArr = [], jsArr = [];
    const cssPattern = /\.css$/;
    arr.map(item => {
        const isCss = cssPattern.test(item.label);
        isCss ? cssArr.push(item) : jsArr.push(item);
    });
    const sortedCssArr = sortArr(cssArr);
    const sortedJsArr = sortArr(jsArr);
    return [...sortedCssArr, ...sortedJsArr];
};
