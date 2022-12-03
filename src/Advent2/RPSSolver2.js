
const lib = require('./lib');
const {arbitrateScore, rocks, papers} = lib;
const f = require('fs');
const readline = require('readline');
const user_file = './rucksack.data';
const r = readline.createInterface({
    input : f.createReadStream(user_file)
});
let total = 0;
r.on('line', function (text) {
    if (text.startsWith('end')){
        console.log({total});
    }
    else {
        const vals = text.split(' ');
        let [first, second] = vals;
        if (rocks.includes(first)){
            first = 'rock';
        } else if (papers.includes(first)){
            first = 'paper';
        } else {
            first = 'scissor';
        }

        if (second === 'X'){
            //loose
            if (first === 'rock'){
                second = 'scissor';
            } else if (first === 'paper'){
                second = 'rock';
            } else {
                second = 'paper';
            }
        } else if (second === 'Y') {
            //draw
            if (first === 'rock'){
                second = 'rock';
            } else if (first === 'paper'){
                second = 'paper';
            } else {
                second = 'scissor';
            }
        } else {
            //win
            if (first === 'rock'){
                second = 'paper';
            } else if (first === 'paper'){
                second = 'scissor';
            } else {
                second = 'rock';
            }
        }

        console.log({first, second});
        const result = arbitrateScore(first, second);

        total += result;
    }
});
