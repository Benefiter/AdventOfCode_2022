const { getFileReader, Solution1 } = require('./lib');
const user_file = '/Users/benwilfred/source/repos/adventOfcode/src/advent20/encryption.data';
const r = getFileReader(user_file);

const solution = new Solution1();
r.on('line', function (text) {
    solution.process(text);
});
