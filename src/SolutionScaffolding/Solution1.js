const { getFileReader, Solution1 } = require('./lib');
const user_file = './treegrid.data';
const r = getFileReader(user_file);

const solution = new Solution1();
r.on('line', function (text) {
    solution.process(text);
});


//2=-0=01——22-0-1-10
// [
//     2, -2, -1,  0, -2, 0,  1,
//     -1, -1, -1, -1,  2, 2, -1,
//     0, -1,  1, -1,  1, 0
// ]
//2=-0=01----22-0-1-10