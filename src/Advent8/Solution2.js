const { getFileReader, Solution2 } = require('./lib');
const user_file = './treegrid.data';
const r = getFileReader(user_file);

const solution = new Solution2();
r.on('line', function (text) {
    solution.processGridLine(text);
});
