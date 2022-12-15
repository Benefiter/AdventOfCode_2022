const { getFileReader, Solution2 } = require('./lib');
const user_file = '/Users/benwilfred/source/repos/adventOfcode/src/advent14/paths.data';
const r = getFileReader(user_file);

const solution = new Solution2();
r.on('line', function (text) {
    solution.processListLine(text);
});
