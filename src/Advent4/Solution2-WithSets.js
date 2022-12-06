const { getFileReader, getArrayOfRange } = require('./lib');
const user_file = './markers.data';
const r = getFileReader(user_file);
let total = 0;
r.on('line', function (text) {
    if (text.startsWith('end')) {
        console.log({ total });

    } else {
        const [firstAss, secondAss]  = text.split(',');
        const fr = firstAss.split('-');
        const sr = secondAss.split('-');
        const firstArr = getArrayOfRange(+fr[0], +fr[1]);
        const secondArr = getArrayOfRange(+sr[0], +sr[1]);
        const set = new Set([...firstArr, ...secondArr]);
        if (set.size !== firstArr.length + secondArr.length) {
            total++;
        }
    }
});
