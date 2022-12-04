const { splitEqually, getTotalPriorities, getFileReader } = require('./lib');
const user_file = './assignmentPairs.data';
const r = getFileReader(user_file);
let total = 0;
const priorities = [];
r.on('line', function (text) {
    if (text.startsWith('end')) {
        total = getTotalPriorities(priorities);
        console.log({ total, priorities, plength: priorities.length });

    } else {
        total += 1;
        const { firstHalf, secondHalf } = splitEqually(text);

        let dup;
        firstHalf.every(v => {
            if (secondHalf.includes(v)) {
                dup = v;
                return false;
            }
            return true;
        })
        priorities.push(dup);
    }
});
