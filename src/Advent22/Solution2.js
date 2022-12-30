const { getFileReader, Solution2 } = require('./lib1');
const user_file = '/Users/benwilfred/source/repos/adventOfcode/src/advent22/notes.data';
const r = getFileReader(user_file);

const solution = new Solution2();
r.on('line', function (text) {
    solution.process(text);
});
