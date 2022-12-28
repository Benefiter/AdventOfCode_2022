const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

class Solution1 {
    constructor() {
        this.monkeyData = [];
        this.monkeyIdFromIndex = new Map();
        this.indexFromMonkeyId = new Map();
        this.result = null;
    }

    showResults() {
        console.log({ result: this.result });
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }


    processText(text) {
        // nzmq: mnfb * pggv
        const data = text.split(':');
        const id = data[0].trim();
        const test = +(data[1].trim());
        let number;
        let value;
        let dependencies;
        if (Number.isNaN(test)) {
            const algorithm = (data[1].trim()).split(' ');
            if (algorithm.length !== 3) {
                throw new Error('Invalid monkey algorthim!');
            }
            number = { monkey1: algorithm[0], monkey2: algorithm[2], operation: id === 'root' ? '=' : algorithm[1] };
            dependencies = [number.monkey1, number.monkey2];
        } else {
            if (id !== 'humn') {
                number = test;
                value = test;
            }
        }

        this.monkeyIdFromIndex.set(this.monkeyData.length, id);
        this.indexFromMonkeyId.set(id, this.monkeyData.length);
        this.monkeyData.push({ id, number, value, dependencies });
    }

    calc(val1, val2, operation) {
        switch (operation) {
            case '*':
                return val1 * val2;
            case '+':
                return val1 + val2;
            case '-':
                return val1 - val2;
            case '/':
                return val1 / val2;
            case '=':
                return val1 === val2;
            default:
                throw new Error('unknown operation!');
        }
    };

    doMonkeyYells() {
        let done = false;
        let index = this.monkeyData.length;
        while (!done) {
            if (index >= (this.monkeyData.length - 1)) {
                index = 0;
            } else {
                index++;
            }
            let currMonkey = this.monkeyData[index];
            if (Object.keys(currMonkey.number).includes('monkey1')) {
                const { monkey1, monkey2, operation } = currMonkey.number;
                const monkey1Index = this.indexFromMonkeyId.get(monkey1);
                const monkey2Index = this.indexFromMonkeyId.get(monkey2);
                const monkey1Data = this.monkeyData[monkey1Index];
                if (monkey1Data.value) {
                    const monkey2Data = this.monkeyData[monkey2Index];
                    if (monkey2Data.value) {
                        currMonkey.value = this.calc(monkey1Data.value, monkey2Data.value, operation);
                        if (currMonkey.id === 'root') {
                            this.result = currMonkey.value;
                            done = true;
                        }
                    }
                }
            }
        }
    }

    process(text) {
        if (this.finishedProcessing(text)) {
            this.doMonkeyYells();
            this.showResults();
        } else {
            this.processText(text);
        }
    }
}

class Parser {
    constructor(val) {
        this.value = val.replace('"', '').replace('"', '');
        this.parsedVal = val.replace('"', '').replace('"', '');
    }

    // equation: ((2 * ((((((5 * ((59560918 / (2))) / 5) + 3754452) * 3543821) - (((146 + ((22 * (((((2 * ((((((((((((((3 * (((((337 + ((8 * ((((904 + ((2 * ((((((633 + (((928 + ((2 * ((((958 + ((((97 + ((((((10 * (((((32 * ((438 + ((((((4 * (((((794 + ((((560 + ((((((humn) + 816) + 497) / 3) - 395) * 45)) * 2) - 671)) + 697) / 5) + 558)) - 284) / 10) - 428) / 3))) + 984) / 8) - 802)) + 694) / 2) - 486) * 2)) * 2) - 161)) / 3) - 384))) / 2)) / 2) - 773) * 2) - 19))) / 10) - 59))) + 389) / 6) - 146)) + 446) + 918) / 5) - 606) * 11) + 228) + 746) + 477) / 5) - 638) / 5) + 628)) - 792) / 2) + 298))) / 2)))
    getNextOpAndOperand() {
        while (this.parsedVal.startsWith('(') && this.parsedVal.endsWith(')')) {
            if (this.parsedVal.startsWith('(')) {
                this.parsedVal = this.parsedVal.replace('(', '');
            }
            if (this.parsedVal.endsWith(')')) {
                this.parsedVal = this.parsedVal.slice(0, -1);
            }
        }
        const vals = this.parsedVal.split(' ');
        if (!this.parsedVal.startsWith('(')) {
            while (!this.parsedVal.startsWith('(')) {
                this.parsedVal = this.parsedVal.slice(1);
            }
            return { operator: vals[1], operand: vals[0] };
        } else {
            while (!this.parsedVal.endsWith(')')) {
                this.parsedVal = this.parsedVal.slice(0, -1);
            }
            return { operator: vals[vals.length - 2], operand: vals[vals.length - 1] };
        }
    }
}

class Parser1 {
    constructor(val, val2) {
        this.value = val.replace('"', '').replace('"', '');
        this.parsedVal = val.replace('"', '').replace('"', '');
        this.startIndex = 0;
        this.nextIndex = 0;
        this.result = val2;
    }

    // equation: ((2 * ((((((5 * ((59560918 / (2))) / 5) + 3754452) * 3543821) - (((146 + ((22 * (((((2 * ((((((((((((((3 * (((((337 + ((8 * ((((904 + ((2 * ((((((633 + (((928 + ((2 * ((((958 + ((((97 + ((((((10 * (((((32 * ((438 + ((((((4 * (((((794 + ((((560 + ((((((humn) + 816) + 497) / 3) - 395) * 45)) * 2) - 671)) + 697) / 5) + 558)) - 284) / 10) - 428) / 3))) + 984) / 8) - 802)) + 694) / 2) - 486) * 2)) * 2) - 161)) / 3) - 384))) / 2)) / 2) - 773) * 2) - 19))) / 10) - 59))) + 389) / 6) - 146)) + 446) + 918) / 5) - 606) * 11) + 228) + 746) + 477) / 5) - 638) / 5) + 628)) - 792) / 2) + 298))) / 2)))
    init() {
        this.startIndex = this.value.search('(humn)') - 2;
        this.endIndex = this.startIndex + 1 + '(humn)'.length;
    }

    getNextOpAndOperand() {
        if ((this.value[this.startIndex] === '(') && (this.value[this.endIndex] === ')')){
            // this.startIndex--;
            this.endIndex++;
        }

        if (this.value[this.startIndex] === '(') {
            this.startIndex--;
            const vals = this.value.substring(this.endIndex).split(' ');
            while (this.value[this.endIndex] === ')'){
                this.endIndex++;
            }
            this.endIndex = this.value.indexOf(')', this.endIndex);
            return { operator: this.endIndex === -1 ? 'done' : vals[1], operand: this.endIndex === -1 ? 'done' : vals[2].replace(/\)/g, '') };
        } else if (this.value[this.endIndex] === ')') {
            this.endIndex++;
            const vals = this.value.substring(0, this.startIndex).split(' ');
            while (this.value[this.startIndex] !== '(' && (this.value[this.startIndex] !== ')')) {
                this.startIndex--;
            }
            const done = (this.endIndex === -1) || (this.startIndex < 0);
            return { operator: done ? 'done' : vals[vals.length - 1], operand: done ? 'done' : vals[vals.length - 2].replace(/\(/g, '') };
        } else {
            const vals = this.value.substring(0, this.endIndex).split(' ');
            while (this.value[this.startIndex] !== '(') {
                this.startIndex--;
            }
            const done = this.startIndex < 0;
            return { operator: done ? 'done' : vals[vals.length - 1], operand: done ? 'done' : vals[vals.length - 2].replace(/\)/g, '') };
        }
    }
}

class Solution2 extends Solution1 {
    constructor() {
        super();
        this.rootDependencies = [];
        this.originalRootDependencies = [];
        this.firstRootDependencies = [];
        this.secondRootDependencies = [];
        this.originalFirstRootDependencies = [];
        this.originalSecondRootDependencies = [];
        this.done = false;
        this.equation = '';
    }

    showResults() {
        console.log({ equation: this.equation, result: this.result });
    }

    getValues(index, doActualCalc = false) {
        if (!this.monkeyData[index]) {
            console.log('here1');
        }
        if (!(this.monkeyData[index].dependencies) && !(this.monkeyData[index].value)) {
            return this.monkeyData[index].id;
        }
        if ((this.monkeyData[index]).value) {
            return (this.monkeyData[index].value);
        }
        const childMonkeys = (this.monkeyData[index]).dependencies || [];
        const childMonkey1 = this.indexFromMonkeyId.get(childMonkeys[0]);
        const childMonkey2 = this.indexFromMonkeyId.get(childMonkeys[1]);
        const { operation } = this.monkeyData[index].number;

        if (!this.monkeyData[childMonkey1]) {
            console.log('here');
        }

        if (!this.monkeyData[childMonkey1]) {
            console.log('here2');
        }
        if (doActualCalc) {
            // if (this.monkeyData[childMonkey1].value) {
            //     return this.calc(this.monkeyData[childMonkey1].value, this.getValues(childMonkey2, true), operation);
            // } else if (this.monkeyData[childMonkey2].value) {
            //     return this.calc(this.getValues(childMonkey1, true), this.monkeyData[childMonkey2].value, operation);
            // } else {
            //     return this.calc(this.getValues(childMonkey1, true),this.getValues(childMonkey2, true), operation);
            // }
            if (this.monkeyData[childMonkey1].value) {
                if (this.monkeyData[childMonkey2].id === 'humn') {
                    return this.monkeyData[childMonkey1].value;
                }

                return this.doMath(this.monkeyData[childMonkey1].value, operation, this.getValues(childMonkey2, true));
            } else if (this.monkeyData[childMonkey2].value) {
                if (this.monkeyData[childMonkey1].id === 'humn') {
                    return this.monkeyData[childMonkey2].value;
                }

                return this.doMath(this.getValues(childMonkey1, true), operation, this.monkeyData[childMonkey2].value);
            } else {
                if (this.monkeyData[childMonkey1].id === 'humn') {
                    return this.getValues(childMonkey2, true);
                } else if (this.monkeyData[childMonkey2].id === 'humn') {
                    return this.getValues(childMonkey1, true);
                }
                return this.doMath(this.getValues(childMonkey1, true), operation, this.getValues(childMonkey2, true));
            }
        } else {
            if (this.monkeyData[childMonkey1].value) {
                return `(${this.monkeyData[childMonkey1].value} ${operation} (${this.getValues(childMonkey2)})`;
            } else if (this.monkeyData[childMonkey2].value) {
                return `(${this.getValues(childMonkey1)}) ${operation} ${this.monkeyData[childMonkey2].value}`;
            } else {
                return `(${this.getValues(childMonkey1)}) ${operation} (${this.getValues(childMonkey2)})`;
            }
        }
    }

    calcHumanYell(value, monkeyIndex) {
        const parent = this.monkeyData[monkeyIndex];
        if (parent.value) {
            return `${parent.value}`;
        } else {
            return this.getValues(monkeyIndex);
        }
    }

    doMath(val1, operation, val2) {
        switch (operation) {
            case '*':
                return val1 / val2;
            case '/':
                return val1 * val2;
            case '+':
                return val1 - val2;
            case '-':
                return val1 + val2;
            default:
                throw new Error('Unknown operation');
        }
    }

    calcBothUnknownValues(operation, id1, id2) {
        const value1 = this.getValues(id1, true);
        const value2 = this.getValues(id2, true);
        return this.calc(value1, value2, operation);
    }

    calcValues(value, index, indexOfOperation) {
        if (!(this.monkeyData[index].dependencies) && !(this.monkeyData[index].value)) {
            return value;
        }
        if ((this.monkeyData[index]).value) {
            const { operation } = this.monkeyData[indexOfOperation].number;
            return this.doMath(value, operation, this.monkeyData[index].value);
        }
        const childMonkeys = (this.monkeyData[index]).dependencies || [];
        const childMonkey1 = this.indexFromMonkeyId.get(childMonkeys[0]);
        const childMonkey2 = this.indexFromMonkeyId.get(childMonkeys[1]);
        const { operation } = this.monkeyData[index].number;

        if (!this.monkeyData[childMonkey1]) {
            console.log('here');
        }

        if (!this.monkeyData[childMonkey1]) {
            console.log('here2');
        }
        if (this.monkeyData[childMonkey1].value) {
            return this.calcValues(this.doMath(value, operation, this.monkeyData[childMonkey1].value), childMonkey2, childMonkey1);
        } else if (this.monkeyData[childMonkey2].value) {
            return this.calcValues(this.doMath(value, operation, this.monkeyData[childMonkey2].value), childMonkey1, childMonkey2);
        } else {
            // throw new Error('Shouldnt get here');
            return this.doMath(value, operation, this.calcBothUnknownValues(operation, childMonkey1, childMonkey2));
        }
    }

    calcHumanVal(monkeyIndex) {
        const parent = this.monkeyData[monkeyIndex];
        if (parent.value) {
            return `${parent.value}`;
        } else {
            return this.getValues(monkeyIndex, true);
        }
    }

    checkRootValues() {
        const parentMonkey = this.indexFromMonkeyId.get('root');
        const childMonkeys = (this.monkeyData[parentMonkey]).dependencies || [];
        const childMonkey1 = this.indexFromMonkeyId.get(childMonkeys[0]);
        const childMonkey2 = this.indexFromMonkeyId.get(childMonkeys[1]);
        let val1 = this.monkeyData[childMonkey1].value
        let val2 = this.monkeyData[childMonkey2].value
        const monkey1Operation = this.monkeyData[childMonkey1].number.operation;
        const monkey2Operation = this.monkeyData[childMonkey2].number.operation;
        if ((!val1 && !val2) || (Number.isNaN(val1) && Number.isNaN(val2))) {
            return
        }
        if (Number.isNaN(val1)) {
            val2 = this.calcHumanYell(this.monkeyData[childMonkey1].value, childMonkey2)
        } else if (this.monkeyData[childMonkey2].value) {
            val1 = this.calcHumanYell(this.monkeyData[childMonkey2].value, childMonkey1)
        } else {
            return;
        }
        this.equation = `(${val1}) ${(this.monkeyData[parentMonkey]).number.operation} (${val2}) `;


        // const parser = new Parser1(val1, val2);
        // parser.init();
        // while (true) {
        //     const res = parser.getNextOpAndOperand();
        //     console.log(res);
        // }

        if (Number.isNaN(val2)) {
            this.result = this.doMath(val1, monkey2Operation, this.calcHumanVal(childMonkey2));
        } else {
            this.result = this.doMath(this.calcHumanVal(childMonkey1), monkey1Operation, val2);
        }
        this.done = true;
    }

    checkDependencies() {
        const updatedFirstRootDependencies = [];
        this.firstRootDependencies.forEach(d => {
            const depIndex = this.indexFromMonkeyId.get(d);
            const depMonkeyData = this.monkeyData[depIndex];
            if (!depMonkeyData.value || d === 'humn') {
                updatedFirstRootDependencies.push(d);
            }
        })

        this.firstRootDependencies = updatedFirstRootDependencies;
        if (this.firstRootDependencies.length === 0) {
            console.log('first dependencies are empty')
        } else if (this.firstRootDependencies.every(d => d === 'humn')) {
            console.log('All entries are humn');
        }

        const updatedSecondRootDependencies = [];
        this.secondRootDependencies.forEach(d => {
            const depIndex = this.indexFromMonkeyId.get(d);
            const depMonkeyData = this.monkeyData[depIndex];
            if (!depMonkeyData.value || d === 'humn') {
                updatedSecondRootDependencies.push(d);
            }
        })

        this.secondRootDependencies = updatedSecondRootDependencies;
        if (this.secondRootDependencies.length === 0) {
            console.log('second dependencies are empty')
        } else if (this.secondRootDependencies.every(d => d === 'humn')) {
            console.log('All entries are humn');
        }
        this.checkRootValues();
    }

    doMonkeyYells1() {
        this.done = false;
        let index = this.monkeyData.length;
        while (!this.done) {
            if (index >= (this.monkeyData.length - 1)) {
                index = 0;
                this.checkDependencies();
            } else {
                index++;
            }
            if (!this.done) {
                let currMonkey = this.monkeyData[index];
                if (currMonkey.number && Object.keys(currMonkey.number).includes('monkey1')) {
                    const { monkey1, monkey2, operation } = currMonkey.number;
                    const monkey1Index = this.indexFromMonkeyId.get(monkey1);
                    const monkey2Index = this.indexFromMonkeyId.get(monkey2);
                    const monkey1Data = this.monkeyData[monkey1Index];
                    if (monkey1Data.value) {
                        const monkey2Data = this.monkeyData[monkey2Index];
                        if (monkey2Data.value) {
                            currMonkey.value = this.calc(monkey1Data.value, monkey2Data.value, operation);
                            if (currMonkey.id === 'root') {
                                this.result = currMonkey.value;
                            }
                        }
                    }
                }
            }
        }
    }

    setDependencies(id, dependencies) {
        const parentMonkey = this.indexFromMonkeyId.get(id);
        const childMonkeys = (this.monkeyData[parentMonkey]).dependencies || [];
        childMonkeys.forEach(cm => {
            dependencies.push(cm);
            this.setupDependencies(cm, dependencies);
        });
    }

    setupDependencies(id) {
        const parentMonkey = this.indexFromMonkeyId.get(id);
        const childMonkeys = (this.monkeyData[parentMonkey]).dependencies || [];
        childMonkeys.forEach((cm, index) => {
            if (index === 0) {
                this.firstRootDependencies.push(cm);
                this.setDependencies(cm, this.firstRootDependencies);
            } else {
                this.secondRootDependencies.push(cm);
                this.setDependencies(cm, this.secondRootDependencies);
            }
        });
    }

    process(text) {
        if (this.finishedProcessing(text)) {
            this.setupDependencies('root', this.rootDependencies);
            this.originalFirstRootDependencies = [...this.firstRootDependencies];
            this.originalSecondRootDependencies = [...this.secondRootDependencies];
            this.doMonkeyYells1();
            this.showResults();
        } else {
            this.processText(text);
        }
    }

}

module.exports.getFileReader = getFileReader;
module.exports.Solution1 = Solution1;
module.exports.Solution2 = Solution2;


