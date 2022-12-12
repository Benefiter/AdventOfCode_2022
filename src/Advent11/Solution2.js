const { getFileReader, Solution2 } = require('./lib');
const user_file = './notes.data';
const r = getFileReader(user_file);

const solution = new Solution2();
r.on('line', function (text) {
    solution.processNoteLine(text);
});
