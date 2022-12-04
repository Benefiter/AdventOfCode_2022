const { getFileReader } = require('./lib');
const user_file = './assignmentPairs.data';
const r = getFileReader(user_file);
let total = 0;
r.on('line', function (text) {
    if (text.startsWith('end')) {
        console.log({ total });

    } else {
        const [firstAss, secondAss]  = text.split(',');
        const fr = firstAss.split('-');
        const sr = secondAss.split('-');
        console.log({fr,sr});
        if ((+fr[0] >= +sr[0]) && (+fr[1] <= +sr[1]) ||
            (+sr[0] >= +fr[0]) && (+sr[1] <= +fr[1])){
            total++;
        }
    }
});
