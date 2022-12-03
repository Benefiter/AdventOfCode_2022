
let elfCount = 1;
const elfStats=[];
let calTotal = 0;

const processResults = () => {
    let mostCalories = 0;
    let theElf = 0;
    console.log({ elfCount, stat0: elfStats[0], statLast: elfStats[240] });
    const top3Elves = []
    const skipIndex = [];
    const getHighestCalories = () => {
        elfStats.forEach((s, index) => {
            if (!skipIndex.includes(index) && s > mostCalories) {
                mostCalories = s;
                theElf = index;
            }
        })
        top3Elves.push(mostCalories);
        mostCalories = 0;
        skipIndex.push(theElf);
    }
    [1, 2, 3].forEach((_) => getHighestCalories())

    let totalCalsFor3 = 0;
    top3Elves.forEach(c => totalCalsFor3 += c);
    console.log({mostCalories, theElf ,skipIndex, top3Elves, totalCalsFor3});

    console.log(...elfStats);
}
const f = require('fs');
const readline = require('readline');
const user_file = './rucksack.data';
const r = readline.createInterface({
    input : f.createReadStream(user_file)
});
r.on('line', function (text) {
    if (text.startsWith('end')){
        elfStats.push(calTotal);
        processResults();
    }
    else if (+text === 0){
        elfStats.push(calTotal);
        calTotal = 0;
        elfCount++;
    }else {
        calTotal += +text;
    }

});
console.log({elfCount});