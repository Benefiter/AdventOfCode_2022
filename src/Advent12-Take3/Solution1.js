const { getFileReader, Solution1 } = require('./lib1');
const user_file = '/Users/benwilfred/source/repos/adventOfcode/src/advent12-Take3/terrain.data';
const r = getFileReader(user_file);

const solution = new Solution1();
r.on('line', function (text) {
    solution.processTerrainLine(text);
});
