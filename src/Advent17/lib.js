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
        this.rocks = [];
        this.chamber = new Map();
        this.emptyChamberRow = [this.empty, this.empty, this.empty, this.empty, this.empty, this.empty, this.empty];
        this.maxRocks = 2022;
        this.nextRockMinChamberGap = 3;
        this.jetPatternPos = 0;
        this.chamberTop = 0;
        this.currentRockBottom = 3;
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
    }

    initChamber() {
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
        return chamberRow[col] === ' ';
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
        const potentialChamberTop = this.currentRockBottom + (rock.length - 1);
        if (this.chamberTop < potentialChamberTop) {
            this.chamberTop = potentialChamberTop;
        }
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
    }

    applyJetToRock(offset, rock) {
        if (!rock.some(limb => {
            return limb.some((val) => {
                return ((val + offset) >= (this.chamberWidth - 1) ||
                    (val + offset) < 0);
            })
        })) {
            rock.forEach(limb => {
                limb.forEach((_, index) => {
                    limb[index] += offset;
                })
            })
        }
        if (this.currentRockBottom <= (this.chamberTop + 1)) {
            this.updateRockPositionWithCollisionCheck(rock);
            return;
        }

        this.currentRockBottom--;
    }

    processRockUntilRest(rock) {
        this.stillMoving = true;
        let jetsApplied = 0;
        this.currentRockBottom = this.chamberTop + 3;
        while (this.stillMoving) {
            if (this.jetPatternPos === this.jetPattern.length - 1) {
                this.jetPatternPos = 0;
            }
            const offset = this.jetPattern[this.jetPatternPos];
            this.jetPatternPos++;

            this.applyJetToRock(offset, rock);

            jetsApplied++;
        }
    }

    simulateRockFall() {
        let rockNumber = 1;
        let rockStyle = 0;
        while (rockNumber <= this.maxRocks) {

            this.processRockUntilRest(this.rocks[rockStyle]);

            if (rockStyle === (this.rocks.length - 1)) {
                rockStyle = 0;
            } else {
                rockStyle++;
            }
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


