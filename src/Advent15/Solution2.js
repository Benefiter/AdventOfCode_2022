const { getFileReader, Solution2 } = require('./lib');
const user_file = '/Users/benwilfred/source/repos/adventOfcode/src/advent15/sensor.data';
const r = getFileReader(user_file);

const solution = new Solution2();
r.on('line', function (text) {
    solution.processSensorLine(text);
});
