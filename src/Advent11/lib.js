const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

class Solution1 {
    constructor() {
        this.monkeys = [];
        this.currentMonkey = { totalInspected: 0 };
    }

    showResults() {
        function compareNumbers(a, b) {
            return b - a;
        }

        const totalInspectedSorted = this.monkeys.map(m => m.totalInspected).sort(compareNumbers);
        const monkeyBusiness = totalInspectedSorted[0] * totalInspectedSorted[1];
        console.log({totalInspectedSorted});
        console.log({monkeyBusiness});
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    buildMonkeyRecord(text) {
        if (text.startsWith('Monkey')) {
            if (Object.keys(this.currentMonkey).length > 1) {
                this.monkeys.push({ ...this.currentMonkey });
            }
            this.currentMonkey = { totalInspected: 0 };
        }
        if (text.includes('Starting items:')) {
            const items = text.replace('Starting items: ', '');
            this.currentMonkey.items = items.split(',').map(i => i.trim());
        }
        if (text.includes('Operation: new = old ')) {
            const items = text.replace('Operation: new = old ', '').trim();
            this.currentMonkey.operation = items.split(' ');
        }
        if (text.includes('Test: divisible by ')) {
            const test = text.replace('Test: divisible by ', '').trim();
            this.currentMonkey.divisibleBy = +test;
        }
        if (text.includes('If true: throw to monkey ')) {
            const trueTestMonkey = text.replace('If true: throw to monkey ', '').trim();
            this.currentMonkey.trueTestMonkey = +trueTestMonkey;
        }
        if (text.includes('If false: throw to monkey ')) {
            const falseTestMonkey = text.replace('If false: throw to monkey ', '').trim();
            this.currentMonkey.falseTestMonkey = +falseTestMonkey;
        }
    }

    executeRound() {
        console.log({ monkeys: this.monkeys });
        this.monkeys.forEach(m => {
            const { items } = m;
            console.log({ m });
            m.items = [];
            m.totalInspected += items.length;
            items.forEach(i => {
                const operationVal = m.operation[1] === 'old' ? +i : +m.operation[1];
                const newWorryLevel = Math.floor((m.operation[0] === '*' ? (+i * operationVal) : (+i + operationVal)) / 3);
                const { divisibleBy } = m;
                const passToMonkey = ((Math.floor(newWorryLevel / divisibleBy) * divisibleBy) === newWorryLevel)
                    ? m.trueTestMonkey : m.falseTestMonkey;
                this.monkeys[passToMonkey].items.push(newWorryLevel);
            })
        })
    }

    printMonkeyItems() {
        this.monkeys.forEach(m => console.log(m.items));
    }

    processNoteLine(text) {
        if (this.finishedProcessing(text)) {
            this.monkeys.push({ ...this.currentMonkey });
            this.currentMonkey = {};
            for (let i = 0; i < 20; i++) {
                this.executeRound();
            }
            this.printMonkeyItems();
            this.showResults();
        } else {
            this.buildMonkeyRecord(text);
        }
    }
}

class Solution2 {
    constructor() {
        this.monkeys = [];
        this.currentMonkey = { totalInspected: 0 };
        this.cycleLength = 0;
    }

    showResults() {
        function compareNumbers(a, b) {
            return b - a;
        }

        let totalInspected;
            totalInspected = this.monkeys.map(m => m.totalInspected).sort(compareNumbers);
        const monkeyBusiness = totalInspected[0] * totalInspected[1];
        console.log({monkeyBusiness});
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    buildMonkeyRecord(text) {
        if (text.startsWith('Monkey')) {
            if (Object.keys(this.currentMonkey).length > 1) {
                this.monkeys.push({ ...this.currentMonkey });
            }
            this.currentMonkey = { totalInspected: 0 };
        }
        if (text.includes('Starting items:')) {
            const items = text.replace('Starting items: ', '');
            this.currentMonkey.items = items.split(',').map(i => i.trim());
        }
        if (text.includes('Operation: new = old ')) {
            const items = text.replace('Operation: new = old ', '').trim();
            this.currentMonkey.operation = items.split(' ');
        }
        if (text.includes('Test: divisible by ')) {
            const test = text.replace('Test: divisible by ', '').trim();
            this.currentMonkey.divisibleBy = +test;
        }
        if (text.includes('If true: throw to monkey ')) {
            const trueTestMonkey = text.replace('If true: throw to monkey ', '').trim();
            this.currentMonkey.trueTestMonkey = +trueTestMonkey;
        }
        if (text.includes('If false: throw to monkey ')) {
            const falseTestMonkey = text.replace('If false: throw to monkey ', '').trim();
            this.currentMonkey.falseTestMonkey = +falseTestMonkey;
        }
    }

    myBigInt(val){ return BigInt(val) };

    calcVal(m, i){
        if (m.operation[1] === 'old' && m.operation[0] === '*'){
            return (this.myBigInt( i) % this.myBigInt(m.divisibleBy));
        }
        return this.myBigInt(i);
    };

    executeRound() {
        this.monkeys.forEach(m => {
            const { items } = m;
            m.items = [];
            m.totalInspected += items.length;
            items.forEach(i => {
                const operationVal = m.operation[1] === 'old' ? this.calcVal(m, i) : this.myBigInt(m.operation[1]);
                const newWorryLevel = (m.operation[0] === '*' ? (this.myBigInt(i) * this.myBigInt(operationVal)) : (this.myBigInt(i) + this.myBigInt(operationVal))) % BigInt(this.cycleLength);
                const { divisibleBy } = m;
                const passToMonkey = this.myBigInt(newWorryLevel) % this.myBigInt(divisibleBy) === 0n
                    ? m.trueTestMonkey : m.falseTestMonkey;
                this.monkeys[passToMonkey].items.push((m.operation[0] === '*' && m.operation[1] === 'old') ? (this.myBigInt(i) * this.myBigInt(i)) : newWorryLevel);
            })
        })
    }

    printMonkeyItems() {
        this.monkeys.forEach(m => console.log(m.items));
    }

    calcCycleLength(){
        this.cycleLength = this.monkeys.reduce((acc, curr) => {
            acc = acc * +curr.divisibleBy;
            return acc;
        },1);
    }
    processNoteLine(text) {
        if (this.finishedProcessing(text)) {
            this.monkeys.push({ ...this.currentMonkey });
            this.currentMonkey = {};
            this.calcCycleLength();
            for (let i = 0; i < 10000
                ; i++) {
                this.executeRound();
            }
            // this.printMonkeyItems();
            this.showResults();
        } else {
            this.buildMonkeyRecord(text);
        }
    }
}

module.exports.getFileReader = getFileReader;
module.exports.Solution1 = Solution1;
module.exports.Solution2 = Solution2;


