const sortChunks = require('./sortChunks');

const getMarkedChunks = (bundleArr, initialChunks, initialPrefix, isServerChunk, serverPrefix) => {
    
    let initialArr = [], secondaryArr = [], serverArr = [];

    bundleArr.map(item => {
        if (isServerChunk) {
            item.label = `${serverPrefix} : ${item.label}`;
            serverArr.push(item);
        } else if (initialChunks.includes(item.chunkNames[0])) {
            item.label = `${initialPrefix} : ${item.label}`;
            initialArr.push(item);
        } else {
            secondaryArr.push(item);
        };
    });
    return { initialArr, secondaryArr, serverArr };
}

module.exports = (arr, initialLoadingResources, initialResourcePrefix, server, serverResourcePrefix) => {

    let initialSortedArr = [], secondarySortedArr = [], serverSortedArr = [];
    const { 
        initialArr,
        secondaryArr,
        serverArr } = getMarkedChunks(arr, initialLoadingResources, initialResourcePrefix, server, serverResourcePrefix);

    initialSortedArr = sortChunks(initialArr);
    secondarySortedArr = sortChunks(secondaryArr);
    serverSortedArr = sortChunks(serverArr);

    const report = [...initialSortedArr, ...secondarySortedArr, ...serverSortedArr];
    
    return report;
};
