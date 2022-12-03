const f = require('fs');
const readline = require('readline');
const { splitEqually, getTotalPriorities } = require('./lib');
const user_file = './rucksack.data';
const r = readline.createInterface({
    input: f.createReadStream(user_file)
});
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
        firstHalf.forEach(v => {
            if (secondHalf.includes(v)) {
                dup = v;
            }
        })
        priorities.push(dup);
    }
});
