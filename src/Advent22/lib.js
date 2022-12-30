const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

class Solution1 {
    constructor() {
        this.originalRows = [];
        this.path = [];
        this.rows = [];
        this.longestRow = 0;
        this.wallType = '#';
        this.pathType = '.';
        this.emptyType = ' ';
        this.currentLoc = { x: 0, y: 0, facing: this.right };
        this.right = 0;
        this.down = 1;
        this.left = 2
        this.up = 3;
        this.pathItemsLength = 0;
        this.nextPathItemIndex = 0;
    }

    password() {
        const { x, y, facing } = this.currentLoc;
        return (1000 * (y+1)) + (4 * (x+1)) + facing;
    }

    showResults() {
        // console.log({ path: this.path, rows: this.originalRows, longestRow: this.longestRow, finalRows: this.rows });
        //The final password is the sum of 1000 times the row, 4 times the column, and the facing.
        console.log({ password: this.password(), currentLoc: this.currentLoc });
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }


    processText(text) {
        const row = text.split('');
        this.originalRows.push(row);
    }

    initRows() {
        this.rows = this.originalRows.map(or => {
            const rowLen = or.length;
            if (rowLen < this.longestRow) {
                const addendum = [...Array(this.longestRow - rowLen)].map(_ => this.emptyType);
                return [...or, ...addendum];
            }
            return [...or];
        })
    }

    initializeContext() {
        this.path = (this.originalRows.splice(-1, 1))[0];
        this.originalRows.splice(-1, 1);
        this.longestRow = this.originalRows.reduce((acc, curr) => {
            if (curr.length > acc) {
                acc = curr.length;
            }
            return acc;
        }, 0);
        this.initRows();
        let done = false;
        let i = 0;
        while (!done && (i < this.rows[0].length)) {
            if (this.rows[0][i] === this.pathType) {
                this.currentLoc.x = i;
                this.currentLoc.y = 0;
                this.currentLoc.facing = this.right;
                done = true;
            } else {
                i++;
            }
        }
        this.pathItemsLength = this.path.length;
    }

    getNextPathItem() {
        let done = false;
        let value = '';
        while (!done) {
            if (this.nextPathItemIndex < this.pathItemsLength) {
                value = value + this.path[this.nextPathItemIndex++];
                if (['L', 'R'].includes(value)) {
                    done = true;
                } else {
                    if (['L', 'R'].includes(this.path[this.nextPathItemIndex])) {
                        value = +value;
                        done = true;
                    }
                }
            } else {
                done = true;
                if (value !== ''){
                    if (['L','R'].includes(value)){
                        return value;
                    }else{
                        return +value;
                    }
                }
                value = 'done';
            }
        }
        return value;
    }

    adjustDirection(pathItem) {
        let facing = this.currentLoc.facing;
        switch (facing) {
            case this.right:
                if (pathItem === 'R') {
                    facing = this.down;
                } else {
                    facing = this.up;
                }
                break;
            case this.down:
                if (pathItem === 'R') {
                    facing = this.left;
                } else {
                    facing = this.right;
                }
                break;
            case this.left:
                if (pathItem === 'R') {
                    facing = this.up;
                } else {
                    facing = this.down;
                }
                break;
            case this.up:
                if (pathItem === 'R') {
                    facing = this.right;
                } else {
                    facing = this.left;
                }
                break;
            default:
                throw new Error('invalid direction.');
        }
        this.currentLoc.facing = facing;
    }

    getRowStartType(row) {
        let index = 0;
        while (this.rows[row][index] === this.emptyType) {
            index++;
        }
        return { x: index, type: this.rows[row][index] };
    }

    getRowEndType(row) {
        let index = this.longestRow-1;
        while (this.rows[row][index] === this.emptyType) {
            index--;
        }
        return { x: index, type: this.rows[row][index] };
    }

    getColStartType(col) {
        let index = 0;
        while (this.rows[index][col] === this.emptyType) {
            index++;
        }
        return { y: index, type: this.rows[index][col] };
    }

    getColEndType(col) {
        let index = this.rows.length-1;
        while (this.rows[index][col] === this.emptyType) {
            index--;
        }
        return { y: index, type: this.rows[index][col] };
    }

    moveRight() {
        let { x, y } = this.currentLoc;
        if (x+1 >= this.longestRow){
            const pathItem = this.getRowStartType(y);
            if (pathItem.type === this.pathType) {
                this.currentLoc.x = pathItem.x;
            }
            return;
        }
        switch (this.rows[y][x + 1]) {
            case this.wallType:
                break;
            case this.emptyType:
                const pathItem = this.getRowStartType(y);
                if (pathItem.type === this.pathType) {
                    this.currentLoc.x = pathItem.x;
                }
                break;
            case this.pathType:
                this.currentLoc.x++;
                break;
            default:
                throw new Error('Invalid path type');
        }
    };

    moveDown() {
        let { x, y } = this.currentLoc;
        if ((y + 1) >= this.rows.length) {
            const pathItem = this.getColStartType(x);
            if (pathItem.type === this.pathType) {
                this.currentLoc.y = pathItem.y;
            }
        } else {
            switch (this.rows[y+1][x]) {
                case this.wallType:
                    break;
                case this.emptyType:
                    const pathItem = this.getColStartType(x);
                    if (pathItem.type === this.pathType) {
                        this.currentLoc.y = pathItem.y;
                    }
                    break;
                case this.pathType:
                    this.currentLoc.y++;
                    break;
                default:
                    throw new Error('Invalid path type');
            }
        }
    };

    moveLeft() {
        let { x, y } = this.currentLoc;
        if (x-1 < 0){
            const pathItem = this.getRowEndType(y);
            if (pathItem.type === this.pathType) {
                this.currentLoc.x = pathItem.x;
            }
            return;
        }
        switch (this.rows[y][x - 1]) {
            case this.wallType:
                break;
            case this.emptyType:
                const pathItem = this.getRowEndType(y);
                if (pathItem.type === this.pathType) {
                    this.currentLoc.x = pathItem.x;
                }
                break;
            case this.pathType:
                this.currentLoc.x--;
                break;
            default:
                throw new Error('Invalid path type');
        }
    }

    moveUp() {
        let { x, y } = this.currentLoc;
        if ((y - 1) < 0) {
            const pathItem = this.getColEndType(x);
            if (pathItem.type === this.pathType) {
                this.currentLoc.y = pathItem.y;
            }
        } else {
            switch (this.rows[y-1][x]) {
                case this.wallType:
                    break;
                case this.emptyType:
                    const pathItem = this.getColEndType(x);
                    if (pathItem.type === this.pathType) {
                        this.currentLoc.y = pathItem.y;
                    }
                    break;
                case this.pathType:
                    this.currentLoc.y--;
                    break;
                default:
                    throw new Error('Invalid path type');
            }
        }
    }

    move(pathItem) {
        if (pathItem === 0) {
            return;
        }
        const { facing } = this.currentLoc;

        for (let m = 0; m < pathItem; m++) {

            switch (facing) {
                case this.right:
                    this.moveRight();
                    break;
                case this.down:
                    this.moveDown();
                    break;
                case this.left:
                    this.moveLeft();
                    break;
                case this.up:
                    this.moveUp();
                    break;
                default:
                    throw new Error('invalid move direction!');
            }
            console.log({...this.currentLoc});
        }
    }

    updatePathLocation(pathItem) {
        switch (pathItem) {
            case 'L':
            case 'R':
                this.adjustDirection(pathItem);
                break;
            default:
                this.move(pathItem);
                break;
        }
    }

    followPath() {
        let nextPathItem = this.getNextPathItem();
        while (nextPathItem !== 'done') {
            this.updatePathLocation(nextPathItem);
            nextPathItem = this.getNextPathItem();
        }
    }

    process(text) {
        if (this.finishedProcessing(text)) {
            this.initializeContext();
            this.followPath();
            this.showResults();
        } else {
            this.processText(text);
        }
    }
}

module.exports.getFileReader = getFileReader;
module.exports.Solution1 = Solution1;


