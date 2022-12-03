const f = require('fs');
const readline = require('readline');
const lib = require('./lib');
const user_file = './rucksack.data';
const r = readline.createInterface({
    input: f.createReadStream(user_file)
});
let total = 0;
const {arbitrateScore, rocks, papers} = lib;
r.on('line', function (text) {
    if (text.startsWith('end')) {
        console.log({ total });
    } else {
        const vals = text.split(' ');
        let [first, second] = vals;
        if (rocks.includes(first)) {
            first = 'rock';
        } else if (papers.includes(first)) {
            first = 'paper';
        } else {
            first = 'scissor';
        }
        if (rocks.includes(second)) {
            second = 'rock';
        } else if (papers.includes(second)) {
            second = 'paper';
        } else {
            second = 'scissor';
        }
        total += arbitrateScore(first, second);

    }
});
