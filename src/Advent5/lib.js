

const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

const getArrayOfRange = (start, end) => {
    return [...Array(end - start + 1).keys()].map(x => x + start);
}

const getMoveData = (line) => {
    //move 7 from 3 to 9
    const trimmed = line.replace('move ', '');
    // console.log({trimmed});
    const data1 = trimmed.split(' from ');
    // console.log({data1});
    const amount = +data1[0];
    const data2 = data1[1].split(' to ');
    const fromStack = +data2[0];
    const toStack = +data2[1];
    // console.log({amount, fromStack,toStack});
    return { amount, fromStack, toStack };
}
module.exports.getFileReader = getFileReader;
module.exports.getArrayOfRange = getArrayOfRange;
module.exports.getMoveData = getMoveData;


