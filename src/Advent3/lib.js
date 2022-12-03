const upperAlpha = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const lowerAlpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const splitEqually = (val) => {
    const arr = val.split('');
    const middleIndex = Math.ceil(arr.length / 2);

    const firstHalf = arr.splice(0, middleIndex);
    const secondHalf = arr.splice(-middleIndex);
    return { firstHalf, secondHalf };
}

const getTotalPriorities = (priorities) => {
    return priorities.reduce((acc, curr) => {
        let value;
        if (lowerAlpha.includes(curr)){
            value = lowerAlpha.indexOf(curr) + 1;
        } else {
            value = upperAlpha.indexOf(curr) + 27;
        }
        console.log({value, curr});
        acc += value;
        return acc;
    },0);
};

module.exports.splitEqually = splitEqually;
module.exports.getTotalPriorities = getTotalPriorities;
module.exports.upperAlpha = upperAlpha;
module.exports.lowerAlpha = lowerAlpha;


