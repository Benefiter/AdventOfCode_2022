const stack1 = ['R', 'H', 'M', 'P', 'Z'];
const stack2 = ['B', 'J', 'C', 'P'];
const stack3 = ['D', 'C', 'L', 'G', 'H', 'N', 'S'];
const stack4 = ['L', 'R', 'S', 'Q', 'D', 'M', 'T', 'F'];
const stack5 = ['M', 'Z', 'T', 'B', 'Q', 'P', 'S', 'F'];
const stack6 = ['G', 'B', 'Z', 'S', 'F', 'T'];
const stack7 = ['V', 'R', 'N'];
const stack8 = ['M', 'C', 'V', 'D', 'T', 'L', 'G', 'P'];
const stack9 = ['L', 'M', 'F', 'J', 'N', 'Q', 'W'];
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
const user_file = './moves.data';
const r = getFileReader(user_file);
r.on('line', function (text) {
    if (text.startsWith('end')) {
        const res = stacks.reduce((acc, curr) => {
            console.log({ curr });
            acc.push(curr[0]);
            return acc;
        }, []);
        console.log({
            res
        })
    } else {
        const { amount, fromStack, toStack } = getMoveData(text);
        const source = stacks[fromStack - 1];
        const to = stacks [toStack - 1];
        const removed = source.splice(0, amount);
        stacks[fromStack - 1] = source;
        stacks[toStack - 1] = [...removed, ...to];
        console.log({ removed, source, to, result: stacks[toStack - 1], stackSource: stacks[fromStack - 1] });
    }
});
