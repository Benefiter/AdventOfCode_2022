

const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

const findMarkerPos = (markerArray = [], markerLen = 4) => {
    let done = false;
    if (markerArray.length === 0) return {result: 'Unusable marker array'};
    let next = 0;
    let checkString = '';
    while (next < markerArray.length && !done){
        checkString += markerArray[next];
        const set = new Set([...markerArray.slice(next, next+markerLen), ...markerArray.slice(next,next+markerLen)]);
        // console.log({slice: m.slice(next, next+4), setSize: set.size, next,});
        if (set.size === markerLen){
            done = true;
        }else{
            next++;
        }
    }
    return { result: done ? next + markerLen : 'no marker found'};
};
module.exports.getFileReader = getFileReader;
module.exports.findMarkerPos = findMarkerPos;


