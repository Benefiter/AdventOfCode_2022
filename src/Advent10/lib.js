const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

class Solution1 {
    constructor() {
        this.currentCommand='';
        this.x = 1;
        this.cycleXVals = [];
    }

    showResults() {
        let sum = 0;
        [20, 60, 100, 140, 180, 220].forEach(i => {
            const signalStrength = this.cycleXVals[i-1] * i;
            console.log(`${i}: ${signalStrength}`);
            console.log(`${i}: cycleVal=${this.cycleXVals[i-1]} `);
            sum += signalStrength;
        })
        console.log(`total cycles: ${this.cycleXVals.length}, sum: ${sum}`);
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }


    processText(text) {
        if (text.startsWith('addx')){
            if (this.currentCommand !== 'noop'){
                this.x += +this.currentCommand;
            }
            const commandVals = text.split(' ');
            console.log(commandVals);
            this.currentCommand = +commandVals[1];
            this.cycleXVals.push(this.x);
            this.cycleXVals.push(this.x);
        } else {
            if (this.currentCommand !== 'noop'){
                this.x += +this.currentCommand;
            }
            this.currentCommand = 'noop';
            this.cycleXVals.push(this.x);
        }
    }

    process(text) {
        if (this.finishedProcessing(text)) {
            this.showResults();
        } else {
            this.processText(text);
        }
    }
}

const blankScreenLine = '........................................';
class Solution2 {
    constructor() {
        this.currentCommand='';
        this.x = 1;
        this.cycleXVals = [];
        this.spritePos = 0;
        this.screen =
            [1, 2, 3, 4, 5, 6].map(_ => blankScreenLine.split(''));
    }

    showResults() {
        // this.cycleXVals.forEach((cv,index) => console.log({index, cv}));
        // return;
        const FgBlack = "\x1b[30m";
        // const FgRed = "\x1b[31m";
        // const FgGreen = "\x1b[32m";
        const FgYellow = "\x1b[33m";
        // const FgBlue = "\x1b[34m";
        // const FgMagenta = "\x1b[35m";
        // const FgCyan = "\x1b[36m";
        // const FgWhite = "\x1b[37m";

        this.cycleXVals.forEach((x, index) => {
            const screenLineNumber = Math.floor((index)/40);
            console.log({screenLineNumber});
            const screenLine = this.screen[screenLineNumber];
            const spritePosIndexes = [this.cycleXVals[index]-1, this.cycleXVals[index], this.cycleXVals[index] + 1];
            console.log({spritePosIndexes});
            if (spritePosIndexes.includes(index % 40)){
                screenLine[index % 40] = `${FgYellow}#`;
            } else {
                screenLine[index % 40] = `${FgBlack}.`;
            }
        });
        this.screen.forEach(l => {
            let printLine = '';
            l.forEach(c => printLine += c);
            console.log(printLine);
        });
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }


    processText(text) {
        if (text.startsWith('addx')){
            if (this.currentCommand !== 'noop'){
                this.x += +this.currentCommand;
            }
            const commandVals = text.split(' ');
            console.log(commandVals);
            this.currentCommand = +commandVals[1];
            this.cycleXVals.push(this.x);
            this.cycleXVals.push(this.x);
        } else {
            if (this.currentCommand !== 'noop'){
                this.x += +this.currentCommand;
            }
            this.currentCommand = 'noop';
            this.cycleXVals.push(this.x);
        }
    }

    process(text) {
        if (this.finishedProcessing(text)) {
            this.showResults();
        } else {
            this.processText(text);
        }
    }
}

module.exports.getFileReader = getFileReader;
module.exports.Solution1 = Solution1;
module.exports.Solution2 = Solution2;


