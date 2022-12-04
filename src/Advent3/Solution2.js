const { getTotalPriorities, getFileReader } = require('./lib');
const user_file = './assignmentPairs.data';
const r = getFileReader(user_file);

let total = 0;
let itemsRead = 0;
const priorities = [];
let group = [];
r.on('line', function (text) {
    if (text.startsWith('end')) {
        total = getTotalPriorities(priorities);
        console.log({ total, priorities, plength: priorities.length });

    } else {
        itemsRead += 1;
        group.push(text);
        if (itemsRead === 3) {
            const items2 = group[1].split('');
            const items3 = group[2].split('');
            group[0].split('').every(v => {
                if ((items2.includes(v)) && items3.includes(v)) {
                    priorities.push(v)
                    return false;
                }
                return true;
            })
            itemsRead = 0;
            group = [];
        }
    }
});
