const { getFileReader, Solution1 } = require('./lib');
const user_file = './program.data';
const r = getFileReader(user_file);

const solution = new Solution1();
r.on('line', function (text) {
    solution.process(text);
});
