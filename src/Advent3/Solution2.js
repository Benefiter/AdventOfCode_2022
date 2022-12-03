const f = require('fs');
const readline = require('readline');
const { getTotalPriorities } = require('./lib');
const user_file = './rucksack.data';
const r = readline.createInterface({
    input: f.createReadStream(user_file)
});
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
        let found = false;
        if (itemsRead === 3){
            const items2 = group[1].split('');
            const items3 = group[2].split('');
            group[0].split('').forEach(v => {
                if (!found){
                    if ((items2.includes(v)) && items3.includes(v)){
                        priorities.push(v)
                        found = true;
                    }
                }
            })
            itemsRead = 0;
            group = [];
        }
    }
});
