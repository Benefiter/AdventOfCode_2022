const stack1 = ['R', 'H', 'M', 'P','Z'];
const stack2 = ['B', 'J', 'C', 'P'];
const stack3 = ['D', 'C', 'L', 'G','H','N','S'];
const stack4 = ['L', 'R', 'S', 'Q','D','M','T','F'];
const stack5 = ['M', 'Z', 'T', 'B','Q','P','S','F'];
const stack6 = ['G', 'B', 'Z', 'S','F','T'];
const stack7 = ['V', 'R', 'N'];
const stack8 = ['M', 'C', 'V', 'D','T','L','G','P'];
const stack9 = ['L', 'M', 'F', 'J','N','Q','W'];
const stacks = [
    stack1,
    stack2,
    stack3,
    stack4,
    stack5,
    stack6,
    stack7,
    stack8,
    stack9,
];

const { getFileReader, getMoveData } = require('./lib');
const user_file = './markers.data';
const r = getFileReader(user_file);
r.on('line', function (text) {
    if (text.startsWith('end')) {
        console.log({
            stack1: stack1[0],
            stack2: stack2[0],
            stack3: stack3[0],
            stack4: stack4[0],
            stack5: stack5[0],
            stack6: stack6[0],
            stack7: stack7[0],
            stack8: stack8[0],
            stack9: stack9[0],
        })
    } else {
        const { amount, fromStack, toStack } = getMoveData(text);
        const source = stacks[fromStack - 1];
        const to = stacks [toStack - 1];
        for (let i = 1; i <= amount; i++) {
            const firstElement = source.shift();
            to.unshift(firstElement);
        }
    }
});
