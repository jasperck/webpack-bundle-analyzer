const sortChunks = require('./sortChunks');
const Validator = require('./validator');

const getMarkedChunks = (
  bundleArr,
  initialChunks,
  initialPrefix,
  isServerChunk,
  serverPrefix
) => {
  const initialArr = [];
  const secondaryArr = [];
  const serverArr = [];
  const initNames = initialChunks.map(chunk => (Array.isArray(chunk) ? chunk[0] : chunk));

  bundleArr.forEach((item) => {
    if (isServerChunk) {
      item.label = `${serverPrefix}${item.label}`;
      return serverArr.push(item);
    } else if (initNames.includes(item.chunkNames[0])) {
      item.label = `${initialPrefix}${item.label}`;
      return initialArr.push(item);
    } else {
      return secondaryArr.push(item);
    }
  });
  return { initialArr, secondaryArr, serverArr };
};

module.exports = (
  arr,
  {
    initialLoadingResources,
    maxInitialLoadingSizeSingle,
    maxInitialLoadingSizeBundle,
    chunksLoadingResources,
    maxLazyLoadingSizeSingle,
    maxLazyLoadingSizeBundle,
    initialResourcePrefix,
    server,
    serverResourcePrefix
  }
) => {
  const validator = new Validator({
    initialLoadingResources,
    maxInitialLoadingSizeSingle,
    maxInitialLoadingSizeBundle,
    chunksLoadingResources,
    maxLazyLoadingSizeSingle,
    maxLazyLoadingSizeBundle
  });
  let initialSortedArr = [];
  let secondarySortedArr = [];
  let serverSortedArr = [];
  const { initialArr, secondaryArr, serverArr } = getMarkedChunks(
    arr,
    initialLoadingResources,
    initialResourcePrefix,
    server,
    serverResourcePrefix
  );

  initialSortedArr = validator.checkInitial(sortChunks(initialArr));
  secondarySortedArr = validator.checkChunks(sortChunks(secondaryArr));
  serverSortedArr = sortChunks(serverArr);

  const report = [
    ...initialSortedArr,
    ...secondarySortedArr,
    ...serverSortedArr
  ];

  return { report, budgetErrors: validator.errorsArray };
};
