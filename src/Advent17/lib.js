const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

class Solution1 {
    constructor() {
        this.jetPattern = [];
        this.right = '>';
        this.left = '<';
        this.empty = ' ';
        this.rock = '#';
        this.displayEmpty = '.';
        this.rocks = [];
        this.chamber = new Map();
        this.emptyChamberRow = [this.empty, this.empty, this.empty, this.empty, this.empty, this.empty, this.empty];
        this.fullChamberRow = [this.rock, this.rock, this.rock, this.rock, this.rock, this.rock, this.rock];
        this.fullDisplayRow = [this.displayEmpty, this.displayEmpty, this.displayEmpty, this.displayEmpty, this.displayEmpty, this.displayEmpty, this.displayEmpty];
        this.maxRocks = 2022;
        this.nextRockMinChamberGap = 3;
        this.jetPatternPos = 0;
        this.chamberTop = 1;
        this.currentRockBottom = 4;
        this.chamberWidth = this.emptyChamberRow.length;
        this.stillMoving = false;
    }

    showResults() {
        console.log({ chamberTop: this.chamberTop });
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    processLine(text) {
        this.jetPattern.push(...(text.split('')).map(i => i === '>' ? 1 : -1));
        console.log({jetPatternLength: this.jetPattern.length - 1});
    }

    initChamber() {
        this.chamber.set(0, [...this.fullChamberRow]);
        this.chamber.set(1, [...this.emptyChamberRow]);
        this.chamber.set(2, [...this.emptyChamberRow]);
        this.chamber.set(3, [...this.emptyChamberRow]);
    }

    initRocks() {
        const rock1 = [[2, 3, 4, 5]];
        const rock2 = [[3], [2, 3, 4], [3]];
        const rock3 = [[2, 3, 4], [4], [4]];
        const rock4 = [[2], [2], [2], [2]];
        const rock5 = [[2, 3], [2, 3]];
        this.rocks.push(rock1);
        this.rocks.push(rock2);
        this.rocks.push(rock3);
        this.rocks.push(rock4);
        this.rocks.push(rock5);
    }

    chamberIsEmpty(row, col) {
        const chamberRow = this.chamber.get(row);
        if (!chamberRow) return true;
        return chamberRow[col] === this.empty;
    }

    updateChamber(rock) {
        let chamberRow = this.currentRockBottom;
        rock.forEach(limb => {
            const cr = this.chamber.get(chamberRow);
            if (cr) {
                    limb.forEach(val => cr[val] = this.rock);
                    this.chamber.delete(chamberRow);
                    this.chamber.set(chamberRow, cr);
            } else {
                const newChamberRow = [...this.emptyChamberRow];
                limb.forEach(val => newChamberRow[val] = this.rock);this.chamber.delete(chamberRow);
                this.chamber.set(chamberRow, newChamberRow);
            }
            chamberRow++;
        })
    }

    updateRockPositionWithCollisionCheck(rock) {
        if (rock.some(limb => {
            return limb.some((val) => {
                return !this.chamberIsEmpty(this.currentRockBottom - 1, val);
            })
        })) {
            this.stillMoving = false;
            this.updateChamber(rock);
        } else {
            this.currentRockBottom--;
        }
        // } else {
        //     if (this.currentRockBottom === 1){
        //         this.stillMoving = false;
        //         this.updateChamber(rock);
        //     } else {
        //         this.currentRockBottom--;
        //     }
        // }
    }

    applyJetToRock(offset, rock) {
        if (!rock.some(limb => {
            return limb.some((val) => {
                return (((val + offset) > (this.chamberWidth - 1) ||
                    (val + offset) < 0) || !this.chamberIsEmpty(this.currentRockBottom, val + offset));
            })
        })) {
            rock.forEach(limb => {
                limb.forEach((_, index) => {
                    limb[index] += offset;
                })
            })
        }
    }

    showChamber(){
        console.clear();
        for (let row = this.chamber.size - 1; row >= 1; row--){
            const chamberRow = this.chamber.get(row);
            let rowVal = [...this.fullDisplayRow];
            chamberRow.forEach((col, index) => {
                rowVal[index] = col === this.rock ? this.rock : this.displayEmpty;
            });
            let stringVal = '';
            rowVal.forEach(rv => {
                stringVal = stringVal+rv
            });
            console.log(stringVal);
        }
    }

    moveRockDown(rock){
        this.updateRockPositionWithCollisionCheck(rock);
    }

    processRockUntilRest(rock) {
        this.stillMoving = true;
        while (this.stillMoving) {
            if (this.jetPatternPos > this.jetPattern.length - 1) {
                this.jetPatternPos = 0;
            } else {
                this.jetPatternPos++;
            }
            const offset = this.jetPattern[this.jetPatternPos];

            this.applyJetToRock(offset, rock);
            this.moveRockDown(rock);
        }
        this.chamberTop = this.currentRockBottom + (rock.length);
        this.currentRockBottom = (this.chamber.size) + 4;
        // this.showChamber();

    }

    simulateRockFall() {
        let rockNumber = 1;
        let rockStyle = 0;
        let currentRock;
        while (rockNumber <= this.maxRocks) {

            if (rockNumber === 9){
                console.log('is 9');
            }
            currentRock = this.rocks[rockStyle].map(row => ([...row]))
            this.processRockUntilRest(currentRock);

            if (rockStyle === (this.rocks.length - 1)) {
                rockStyle = 0;
            } else {
                rockStyle++;
            }
            rockNumber++
        }
    }

    processJetPattern(text) {
        if (this.finishedProcessing(text)) {
            this.initRocks();
            this.initChamber();
            this.simulateRockFall();
            this.showResults();
        } else {
            this.processLine(text);
        }
    }
}

module
    .exports
    .getFileReader = getFileReader;
module
    .exports
    .Solution1 = Solution1;


