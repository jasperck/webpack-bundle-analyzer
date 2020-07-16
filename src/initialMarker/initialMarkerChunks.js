const sortChunks = require('./sortChunks');
const getTotalInitialChunks = require('./getTotalInitialChunks');

const getMarkedChunks = (bundleArr, chunks) => {
    
    let initialArr = [], secondaryArr = [], serverArr = [];

    bundleArr.map(item => {
        const serverChunk = chunks.find(chunk => chunk === 'server');
        if (item.chunkNames[0] === serverChunk) {
            item.label = `Server resource : ${item.label}`;
            serverArr.push(item);
        } else if (chunks.includes(item.chunkNames[0])) {
            item.label = `Initial loaded resource : ${item.label}`;
            initialArr.push(item);
        } else {
            secondaryArr.push(item);
        };
    });
    return { initialArr, secondaryArr, serverArr };
}

module.exports = (arr, chunks) => {

    let initialSortedArr = [], secondarySortedArr = [], serverSortedArr = [];
    const { initialArr, secondaryArr, serverArr } = getMarkedChunks(arr, chunks);

    initialSortedArr = sortChunks(initialArr);
    secondarySortedArr = sortChunks(secondaryArr);
    serverSortedArr = sortChunks(serverArr);

    initialSortedArr.length && initialSortedArr.push(getTotalInitialChunks(initialSortedArr));

    const report = [...initialSortedArr, ...secondarySortedArr, ...serverSortedArr];
    
    return report;
};
