const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

class Solution1 {
    constructor() {
        this.tailposX = 0;
        this.tailposY = 0;
        this.headposX = 0;
        this.headposY = 0;
        this.tailtrail = [[0, 0]];
        this.currentMoves = [];
        this.currentDirection = '';
        this.currentMovesMade = 0;
    }

    showResults() {
        console.log({ moves: this.tailtrail.length });

    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    moveHead() {
        switch (this.currentDirection) {
            case 'U':
                this.headposY++;
                break;
            case 'D':
                this.headposY--;
                break;
            case 'R':
                this.headposX++;
                break;
            case 'L':
                this.headposX--;
                break;
            default:
                console.log('Unknown direction');
        }
    }

    recordTailPos() {
        if (!this.tailtrail.some(v => (+v[0] === +this.tailposX && +v[1] === +this.tailposY))) {
            this.tailtrail.push([this.tailposX, this.tailposY]);
        }
    }

    moveTail() {
        if ((this.tailposY === this.headposY) &&
            Math.abs(this.headposX - this.tailposX) > 1) { // same vertical plane
            if (this.headposX > this.tailposX) {
                this.tailposX++;
            } else {
                this.tailposX--;
            }
            this.recordTailPos();
        } else if ((this.tailposX === this.headposX) && (Math.abs(this.headposY - this.tailposY) > 1)) {
            if (this.headposY > this.tailposY) {
                this.tailposY++;
            } else {
                this.tailposY--;
            }
            this.recordTailPos();
        } else if ((Math.abs(this.headposX - this.tailposX) > 1) ||
            (Math.abs(this.headposY - this.tailposY) > 1)) {
            if (this.headposX > this.tailposX) {
                this.tailposX++;
                if (this.headposY > this.tailposY) {
                    this.tailposY++;
                } else {
                    this.tailposY--;
                }
            } else {
                this.tailposX--;
                if (this.headposY > this.tailposY) {
                    this.tailposY++;
                } else {
                    this.tailposY--;
                }
            }
            this.recordTailPos();
        }
    }

    processText(text) {
        this.currentMoves = text.split(' ');
        this.currentDirection = this.currentMoves[0];
        this.currentMovesMade = 0;
        while (this.currentMovesMade < +this.currentMoves[1]) {
            this.moveHead();
            this.moveTail();
            this.currentMovesMade++;
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

class Solution2Helper {
    constructor() {
        this.tailposX = 0;
        this.tailposY = 0;
        this.headposX = 0;
        this.headposY = 0;
        this.tailtrail = [[0, 0]];
        this.currentDirection = '';
    }

    matches(pos) {
        const { x, y } = pos;
        return (+x === +this.headposX) && (+y === +this.headposY);
    }

    getTailTrail() {
        return this.tailtrail;
    }

    getTail() {
        return { x: this.tailposX, y: this.tailposY };
    }

    getHead() {
        return { x: this.headposX, y: this.headposY };
    }

    setHead(pos) {
        this.headposX = pos.x;
        this.headposY = pos.y;
    }

    setDirection(direction) {
        this.currentDirection = direction;
    }

    moveHead() {
        switch (this.currentDirection) {
            case 'U':
                this.headposY++;
                break;
            case 'D':
                this.headposY--;
                break;
            case 'R':
                this.headposX++;
                break;
            case 'L':
                this.headposX--;
                break;
            default:
                console.log('Unknown direction');
        }
    }

    recordTailPos() {
        if (!this.tailtrail.some(v => (+v[0] === +this.tailposX && +v[1] === +this.tailposY))) {
            this.tailtrail.push([this.tailposX, this.tailposY]);
        }
    }

    // If the head is ever two steps directly up, down, left, or right from the tail,
    // the tail must also move one step in that direction so it remains close enough:

    // Otherwise, if the head and tail aren't touching and aren't in the same row or column,
    // the tail always moves one step diagonally to keep up:
    moveTail() {
        if ((this.tailposY === this.headposY) &&
            Math.abs(this.headposX - this.tailposX) > 1) { // same vertical plane
            if (this.headposX > this.tailposX) {
                this.tailposX++;
            } else {
                this.tailposX--;
            }
            this.recordTailPos();
        } else if ((this.tailposX === this.headposX) && (Math.abs(this.headposY - this.tailposY) > 1)) {
            if (this.headposY > this.tailposY) {
                this.tailposY++;
            } else {
                this.tailposY--;
            }
            this.recordTailPos();
        } else if ((Math.abs(this.headposX - this.tailposX) > 1) ||
            (Math.abs(this.headposY - this.tailposY) > 1)) {
            if (this.headposX > this.tailposX) {
                this.tailposX++;
                if (this.headposY > this.tailposY) {
                    this.tailposY++;
                } else {
                    this.tailposY--;
                }
            } else {
                this.tailposX--;
                if (this.headposY > this.tailposY) {
                    this.tailposY++;
                } else {
                    this.tailposY--;
                }
            }
            this.recordTailPos();
        }
    }

    doMove() {
        this.moveHead();
        this.moveTail();
    }
}

class Solution2 {
    constructor() {
        this.knots = [
            new Solution2Helper(),
            new Solution2Helper(),
            new Solution2Helper(),
            new Solution2Helper(),
            new Solution2Helper(),
            new Solution2Helper(),
            new Solution2Helper(),
            new Solution2Helper(),
            new Solution2Helper(),
        ]
    }

    showResults() {
        for (let i=0; i < 9; i++)
        console.log({ tailTrail: this.knots[i].getTailTrail(), moves: this.knots[i].getTailTrail().length });
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    setDirection(direction) {
        this.knots.map(s => s.setDirection(direction))
    }

    print() {
        for (let y = 15; y > -15; y--) {
            let printLine = '';
            for (let x = -15; x < +15; x++) {
                let found = false;
                this.knots.forEach((k, index) => {
                    if (!found) {
                        if (k.matches({ x, y }, index === 0)) {
                            const val = `${index}`;
                            printLine = `${printLine}${val}`;
                            found = true;
                        }
                    }
                })
                if (!found) {
                    if (y === 0 && x === 0) {
                        printLine = `${printLine}s`
                    } else {
                        printLine = `${printLine}.`;
                    }
                }
            }
            console.log(printLine);
        }
    }

    processText(text) {
        this.currentMoves = text.split(' ');
        this.currentDirection = this.currentMoves[0];
        this.currentMovesMade = 0;
        this.setDirection(this.currentDirection);
        while (this.currentMovesMade < +this.currentMoves[1]) {
            this.knots.forEach((k, index) => {
                if (index === 0) {
                    k.doMove();
                    // console.log({firstTail: k.getTailTrail()});
                    console.log('');
                } else {
                    const prvTail = this.knots[index - 1].getTail();
                    k.setHead(prvTail);
                    k.moveTail();
                }
                // console.log({ index, head: k.getHead(), tail: k.getTail(), d: this.currentDirection });
            })
            if (this.currentDirection === 'U') this.print();
            this.currentMovesMade++;
        }
        // this.knots.forEach((k, index) => console.log({index, head: k.getHead(), tail:k.getTail(), d: this.currentDirection}));
        // this.print();
        console.log('*****************************************************');

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


