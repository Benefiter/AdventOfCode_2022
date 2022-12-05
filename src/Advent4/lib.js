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
module.exports.getFileReader = getFileReader;
module.exports.getArrayOfRange = getArrayOfRange;


