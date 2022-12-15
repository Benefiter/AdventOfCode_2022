const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

class Solution1 {
    constructor() {
        this.paths = [];
        this.pathStructure = [];
        this.sandSource = 500;
        this.maxX = 0;
        this.maxY = 0;
        this.minX = Number.MAX_VALUE;
        this.minY = Number.MAX_VALUE;
        this.air = '.';
        this.rock = '#';
        this.sand = 's';
        this.done = false;
        this.unitsOfSand = 0;
        this.sandIsMoving = false;
    }

    showResults() {
        for (let y = 0; y <= this.maxY; y++) {
            let stringVal = `${y}: `;
            for (let x = this.minX; x <= this.maxX; x++) {
                stringVal = `${stringVal}${this.pathStructure[y][x]}`;
            }
            console.log(stringVal);
        }
        console.log({ unitsOfSand: this.unitsOfSand });
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    setMaxs(paths) {
        paths.forEach(p => {
            const [x, y] = p.split(',');
            if (+x > this.maxX) {
                this.maxX = +x;
            }
            if (+y > this.maxY) {
                this.maxY = +y;
            }
            if (+x < this.minX) {
                this.minX = +x;
            }
            if (+y < this.minY) {
                this.minY = +y;
            }
        })
    }

    getPaths(text) {
        const pathItem = text.replace(/ -> /gi, '$');
        const paths = pathItem.split('$');
        this.setMaxs(paths);
        this.paths.push(paths);
    }

    isRock(x, y) {
        return this.pathStructure[y][x] === this.rock;
    }

    isSand(x, y) {
        return this.pathStructure[y][x] === this.sand;
    }

    isAir(x, y) {
        return this.pathStructure[y][x] === this.air;
    }

    isFilled(x, y) {
        return this.isRock(x, y) || this.isSand(x, y);
    }

    moveLeft(startX, startY) {
        let x = startX - 1;
        let y = startY + 1;
        if (this.isFilled(x, y)) {
            return false;
        }
        // now move down as much as possible
        while (y < this.maxY && this.isAir(x, y + 1)) {
            y++;
        }
        if (y === this.maxY) {
            this.done = true;
        } else if (!this.moveLeft(x, y)) {
            if (!this.moveRight(x, y)) {
                this.pathStructure[y][x] = this.sand;
                this.sandIsMoving = false;
            }
        }
        return true;
    }

    moveRight(startX, startY) {
        let x = startX + 1;
        let y = startY + 1;
        if (this.isFilled(x, y)) {
            return false;
        }
        // now move down as much as possible
        while (y < this.maxY && this.isAir(x, y + 1)) {
            y++;
        }
        if (y === this.maxY) {
            this.done = true;
        } else if (!this.moveLeft(x, y)) {
            if (!this.moveRight(x, y)) {
                this.pathStructure[y][x] = this.sand;
                this.sandIsMoving = false;
            }
        }
        return true;
    }

    moveSandUnitToRest(startX, startY) {
        let x = startX;
        let y = startY;
        while (this.sandIsMoving && !this.done) {
            if (this.isAir(x, y + 1)) {
                while (this.isAir(x, y + 1)) {
                    y++;
                }
                if (y === this.maxY) {
                    this.done = true;
                } else {
                    if (this.isFilled(x, y + 1) && !this.isAir(x - 1, y + 1) && !this.isAir(x + 1, y + 1)) {
                        this.pathStructure[y][x] = this.sand;
                        this.sandIsMoving = false;
                    } else if (!this.moveLeft(x, y)) {
                        if (!this.moveRight(x, y)) {
                            console.log(`Something is wrong. Can't move left or right from x=${x}, y=${y}`);
                            this.done = true;
                        }
                    }
                }
            }
        }
    }
    ;

    processSandUnits() {
        const y = 0;
        const x = 500;
        while (!this.done) {
            this.sandIsMoving = true;
            this.moveSandUnitToRest(x, y)
            if (!this.done) {
                this.unitsOfSand++;
            }
        }
    }

    fillYs(s, e, x) {
        for (let i = s; i <= e; i++) {
            // console.log(`filling [${i}][${x}`)
            let before = '';
            let after = '';
            this.pathStructure[i].forEach(c => {
                before = before += c;
            });
            this.pathStructure[i][x] = this.rock;
            this.pathStructure[i].forEach(c => {
                after = after += c;
            });
            // console.log({before, after});
        }
    }

    fillXs(s, e, y) {
        for (let i = s; i <= e; i++) {
            // console.log(`filling [${y}][${i}`)

            let before = '';
            let after = '';
            this.pathStructure[y].forEach(c => {
                before = before += c;
            });
            this.pathStructure[y][i] = this.rock;
            this.pathStructure[y].forEach(c => {
                after = after += c;
            });
            // console.log({before, after});
        }
    }

    buildPath(prvX, prvY, x, y) {
        if (prvX === x) {
            prvY < y ? this.fillYs(prvY, y, x) : this.fillYs(y, prvY, x);
        } else {
            prvX < x ? this.fillXs(prvX, x, y) : this.fillXs(x, prvX, y);
        }
    }

    buildPaths() {
        // console.log({paths: this.paths});
        this.paths.forEach((pathList) => {
            let x, y;
            let prvX, prvY;
            pathList.forEach((p, index) => {
                if (index === 0) {
                    [prvX, prvY] = p.split(',');
                } else {
                    [x, y] = p.split(',');
                    this.buildPath(+prvX, +prvY, +x, +y);
                    prvX = x;
                    prvY = y;
                }
            })
        });
    }

    initPathStructure() {
        let row = [];
        for (let x = 0; x <= this.maxX; x++) {
            row.push(this.air);
        }
        for (let y = 0; y <= this.maxY; y++) {
            this.pathStructure.push([...row]);
        }
    }

    processListLine(text) {
        if (this.finishedProcessing(text)) {
            this.initPathStructure();
            this.buildPaths();
            this.processSandUnits();
            this.showResults();
        } else {
            if (text !== '') {
                this.getPaths(text);
            }
        }
    }

}

class Solution2 {
    constructor() {
        this.paths = [];
        this.pathStructure = [];
        this.sandSource = 500;
        this.maxX = 0;
        this.maxY = 0;
        this.minX = Number.MAX_VALUE;
        this.minY = Number.MAX_VALUE;
        this.air = '.';
        this.rock = '#';
        this.sand = 's';
        this.done = false;
        this.unitsOfSand = 0;
        this.sandIsMoving = false;
        this.extraX = 200;
        this.extraY = 2;
    }

    showResults() {
        for (let y = 0; y <= this.maxY; y++) {
            let stringVal = `${y}: `;
            for (let x = 0; x <= this.maxX; x++) {
                stringVal = `${stringVal}${this.pathStructure[y][x]}`;
            }
            console.log(stringVal);
        }
        console.log({ unitsOfSand: this.unitsOfSand });
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    setMaxs(paths) {
        paths.forEach(p => {
            const [x, y] = p.split(',');
            if (+x > this.maxX) {
                this.maxX = +x;
            }
            if (+y > this.maxY) {
                this.maxY = +y;
            }
            if (+x < this.minX) {
                this.minX = +x;
            }
            if (+y < this.minY) {
                this.minY = +y;
            }
        })
    }

    getPaths(text) {
        const pathItem = text.replace(/ -> /gi, '$');
        const paths = pathItem.split('$');
        this.setMaxs(paths);
        this.paths.push(paths);
    }

    isRock(x, y) {
        return this.pathStructure[y][x] === this.rock;
    }

    isSand(x, y) {
        return this.pathStructure[y][x] === this.sand;
    }

    isAir(x, y) {
        return this.pathStructure[y][x] === this.air;
    }

    isFilled(x, y) {
        return this.isRock(x, y) || this.isSand(x, y);
    }

    moveLeft(startX, startY) {
        let x = startX - 1;
        let y = startY + 1;
        if (this.isFilled(x, y)) {
            return false;
        }
        // now move down as much as possible
        while ((y < this.maxY ) && this.isAir(x, y + 1)) {
            y++;
        }
        if (!this.moveLeft(x, y)) {
            if (!this.moveRight(x, y)) {
                this.pathStructure[y][x] = this.sand;
                this.sandIsMoving = false;
            }
        }
        return true;
    }

    moveRight(startX, startY) {
        let x = startX + 1;
        let y = startY + 1;
        if (this.isFilled(x, y)) {
            return false;
        }
        // now move down as much as possible
        while ((y < this.maxY) && this.isAir(x, y + 1)) {
            y++;
        }
        if (!this.moveLeft(x, y)) {
            if (!this.moveRight(x, y)) {
                this.pathStructure[y][x] = this.sand;
                this.sandIsMoving = false;
            }
        }
        return true;
    }

    moveSandUnitToRest(startX, startY) {
        let x = startX;
        let y = startY;
        while (this.sandIsMoving && !this.done) {
            if (this.isAir(x, y )) {
                while (this.isAir(x, y + 1)) {
                    y++;
                }

                if (this.isFilled(x, y + 1) && !this.isAir(x - 1, y + 1) && !this.isAir(x + 1, y + 1)) {
                    this.pathStructure[y][x] = this.sand;
                    this.sandIsMoving = false;
                } else if (!this.moveLeft(x, y)) {
                    if (!this.moveRight(x, y)) {
                        console.log(`Something is wrong. Can't move left or right from x=${x}, y=${y}`);
                        this.done = true;
                    }
                }
            }
        }
    }
    ;

    processSandUnits() {
        const y = 0;
        const x = this.sandSource;
        while (!this.done) {
            this.sandIsMoving = true;
            this.moveSandUnitToRest(x, y)
            if (!this.done) {
                this.unitsOfSand++;
            }
            if (this.isSand(this.sandSource, 0)) {
                this.done = true;
            }
        }
    }

    fillYs(s, e, x) {
        for (let i = s; i <= e; i++) {
            // console.log(`filling [${i}][${x}`)
            let before = '';
            let after = '';
            this.pathStructure[i].forEach(c => {
                before = before += c;
            });
            this.pathStructure[i][x] = this.rock;
            this.pathStructure[i].forEach(c => {
                after = after += c;
            });
            // console.log({before, after});
        }
    }

    fillXs(s, e, y) {
        for (let i = s; i <= e; i++) {
            // console.log(`filling [${y}][${i}`)

            let before = '';
            let after = '';
            this.pathStructure[y].forEach(c => {
                before = before += c;
            });
            this.pathStructure[y][i] = this.rock;
            this.pathStructure[y].forEach(c => {
                after = after += c;
            });
            // console.log({before, after});
        }
    }

    buildPath(prvX, prvY, x, y) {
        if (prvX === x) {
            prvY < y ? this.fillYs(prvY, y, x) : this.fillYs(y, prvY, x);
        } else {
            prvX < x ? this.fillXs(prvX, x, y) : this.fillXs(x, prvX, y);
        }
    }

    buildPaths() {
        // console.log({paths: this.paths});
        this.paths.forEach((pathList) => {
            let x, y;
            let prvX, prvY;
            pathList.forEach((p, index) => {
                if (index === 0) {
                    [prvX, prvY] = p.split(',');
                } else {
                    [x, y] = p.split(',');
                    this.buildPath(+prvX, +prvY, +x, +y);
                    prvX = x;
                    prvY = y;
                }
            })
        });
    }

    initPathStructure() {
        let row = [];
        let lastRow = []
        for (let x = 0; x <= this.maxX; x++) {
            row.push(this.air);
            lastRow.push(this.rock);
        }
        for (let y = 0; y <= this.maxY; y++) {
            if (y === this.maxY){
                this.pathStructure.push([...lastRow]);
            }else{
                this.pathStructure.push([...row]);
            }
        }
    }

    processListLine(text) {
        if (this.finishedProcessing(text)) {
            this.maxX += this.extraX;
            this.maxY += this.extraY;
            this.initPathStructure();
            this.buildPaths();
            this.processSandUnits();
            this.showResults();
        } else {
            if (text !== '') {
                this.getPaths(text);
            }
        }
    }

}

module
    .exports
    .getFileReader = getFileReader;
module.exports.Solution1 = Solution1;
module.exports.Solution2 = Solution2;


