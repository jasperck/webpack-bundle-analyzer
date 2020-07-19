const sortChunks = require('./sortChunks');

const getMarkedChunks = (bundleArr, initialChunks, initialPrefix, isServerChunk, serverPrefix) => {

  const initialArr = [];
  const secondaryArr = [];
  const serverArr = [];

  bundleArr.map(item => {
    if (isServerChunk) {
      item.label = `${serverPrefix}${item.label}`;
      return serverArr.push(item);
    } else if (initialChunks.includes(item.chunkNames[0])) {
      item.label = `${initialPrefix}${item.label}`;
      return initialArr.push(item);
    } else {
      return secondaryArr.push(item);
    };
  });
  return { initialArr, secondaryArr, serverArr };
};

module.exports = (arr, initialLoadingResources, initialResourcePrefix, server, serverResourcePrefix) => {

  let initialSortedArr = [];
  let secondarySortedArr = [];
  let serverSortedArr = [];
  const { initialArr,
    secondaryArr,
    serverArr } = getMarkedChunks(arr, initialLoadingResources, initialResourcePrefix, server, serverResourcePrefix);

  initialSortedArr = sortChunks(initialArr);
  secondarySortedArr = sortChunks(secondaryArr);
  serverSortedArr = sortChunks(serverArr);

  const report = [...initialSortedArr, ...secondarySortedArr, ...serverSortedArr];

  return report;
};
