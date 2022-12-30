const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

class Solution1 {
    constructor() {
        this.elves = [];
        this.initialElvesInfo = {};
        this.rounds = 0;
        this.maxRounds = 893;
        this.rules = [];
        this.elf = '#';
        this.empty = '.';
        this.elvesInfo = [];
        this.totalTilesInRectangle = 0;
        this.padding = 500;
    }

    showResults() {
        console.log({totalTitles: this.totalTilesInRectangle, totalRoundsRequired: this.rounds});
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }


    processText(text) {
        this.elves.push(text.split(''));
    }

    paddElvesSpace(){
        this.initialElvesInfo = {width: this.elves[0].length, height: this.elves.length};
        const rowlen = this.elves[0].length;
        const rowPad = [...Array(this.padding)].map(_ => (this.empty));
        this.elves = this.elves.map(r => {
        return [...rowPad, ...r, ...rowPad]
        })
        const emptyRowPad = [...Array((2 * this.padding) + rowlen)].map(_ => (this.empty));
        for (let i = 0; i < this.padding; i++){
            this.elves.unshift([...emptyRowPad]);
            this.elves.push([...emptyRowPad]);
        }
        // console.log(this.elves);
    }

    hasElf(x, y){
        return this.elves[y][x] === this.elf;
    }

    elfShouldMove(x, y){
        return (
            this.hasElf(x + 1, y) || // E
            this.hasElf(x - 1, y) || // W
            this.hasElf(x, y-1) || // N
            this.hasElf(x, y+1) || // S
            this.hasElf(x+1, y+1) || // SE
            this.hasElf(x+1, y-1) || // NE
            this.hasElf(x-1, y+1) || // SW
            this.hasElf(x - 1, y-1) // NW
        )
    }

    setProposedMove(elfInfo){
        let ruleIndex = 0;
        const { x, y } = elfInfo;
        let done = false;
        elfInfo.propX = elfInfo.propY = null;
        while ((ruleIndex < 4) && !done){
            //const {steps: [{x: 0, y: -1}, {x: 1, y: -1}, {x:-1, y: -1}], action: {x:0, y:-1}};
            const {steps, action} = this.rules[ruleIndex];
            const hasElf = steps.reduce((acc, curr) => {
                const {x: xAdd, y: yAdd} = curr;
                if (this.hasElf(x+xAdd, y+yAdd)){
                    acc = true;
                }
                return acc;
            }, false);
            if (!hasElf){
                done = true;
                const {x: propX, y: propY } = action;
                elfInfo.propX = x + propX;
                elfInfo.propY = y + propY;
            }
            ruleIndex++;
        }
    }

    determineElfMove(elfInfo){
        const { x, y } = elfInfo;
        if (this.elfShouldMove(x,y)){
            this.setProposedMove(elfInfo);
        }
    }

    doFirstHalf(){
        this.elvesInfo.forEach(elfInfo => {
            this.determineElfMove(elfInfo);
        })
    }

    moveElf(elfInfo){
        const {x, y, propX, propY } = elfInfo;
        if (propX === null){
            return;
        }

        this.elves[y][x] = this.empty;
        this.elves[propY][propX] = this.elf;
        elfInfo.x = propX;
        elfInfo.y = propY;
        elfInfo.propX = elfInfo.propY = null;
    }

    doSecondHalf(){
        const resetElfIds = [];
        if (!this.elvesInfo.some(elfInfo => (elfInfo.propX !== null))){
            console.log('*************************** ANSWER ***************************');
            console.log({rounds: this.rounds});
        }

        this.elvesInfo.forEach(elfInfo => {
            const {id, propX, propY} = elfInfo;
            if (propX !== null) {
                const resetElf = this.elvesInfo.some((curr) => {
                    if (id !== curr.id) {
                        const {propX: currX, propY: currY} = curr;
                        return (propX === currX) && (propY === currY);
                    }
                    return false;
                });
                if (resetElf){
                    resetElfIds.push(id);
                }
            }
        })
        this.elvesInfo.forEach(elfInfo => {
            const { id } = elfInfo;
            if (resetElfIds.includes(id)){
                elfInfo.propX = elfInfo.propY = null;
            } else {
                this.moveElf(elfInfo);
            }
        })
    }

    doRounds(){
        while ((this.rounds++ < this.maxRounds)){
            this.doFirstHalf();
            this.doSecondHalf();
            this.rotateRules();
        }
    }

    rotateRules(){
        const rule = this.rules.splice(0, 1);
        this.rules.push(rule[0]);
    }

    setupDirectionRules(){
        // If there is no Elf in the N, NE, or NW adjacent positions, the Elf proposes moving north one step.
        //     If there is no Elf in the S, SE, or SW adjacent positions, the Elf proposes moving south one step.
        //     If there is no Elf in the W, NW, or SW adjacent positions, the Elf proposes moving west one step.
        //     If there is no Elf in the E, NE, or SE adjacent positions, the Elf proposes moving east one step.
        const rule1 = {steps: [{x: 0, y: -1}, {x: 1, y: -1}, {x:-1, y: -1}], action: {x:0, y:-1}};
        const rule2 = {steps: [{x: 0, y: 1}, {x: 1, y: 1}, {x:-1, y: 1}], action: {x:0, y: 1}};
        const rule3 = {steps: [{x: -1, y: 0}, {x: -1, y: -1}, {x:-1, y: 1}], action: {x: -1, y: 0}};
        const rule4 = {steps: [{x: 1, y: 0}, {x: 1, y: -1}, {x:1, y: 1}], action: {x: 1, y:0}};
        this.rules = [rule1, rule2, rule3, rule4];
    }

    initElvesInfo(){
        let index = 0;
        this.elves.forEach((row, rIndex) => {
            row.forEach((col, colIndex) => {
                if (this.elves[rIndex][colIndex] === this.elf){
                    this.elvesInfo.push({id: index++, x: colIndex, y: rIndex, propX: null, propY: null});
                }
            })
        })
    }

    calcSmallestRectangle(){
        let smallestX = Number.MAX_VALUE, largestX = Number.MIN_VALUE, smallestY = Number.MAX_VALUE, largestY = Number.MIN_VALUE;
        
        this.elves.forEach((y, yIndex) => {
            y.forEach((x, xIndex) => {
                if (this.hasElf(xIndex, yIndex)){
                    if (xIndex < smallestX){
                        smallestX = xIndex;
                    }
                    if (xIndex > largestX){
                        largestX = xIndex;
                    }
                    if (yIndex < smallestY){
                        smallestY = yIndex;
                    }
                    if (yIndex > largestY){
                        largestY = yIndex;
                    }
                }
            })
        })
        
        this.totalTilesInRectangle = 0;
        for (let y = smallestY; y <= largestY; y++){
            for (let x = smallestX; x <= largestX; x++){
                if (!this.hasElf(x, y)){
                    this.totalTilesInRectangle++;
                }
            }
        }
    }

    calcEmptyTilesInRectangle (){
        
    }
    process(text) {
        if (this.finishedProcessing(text)) {
            this.paddElvesSpace();
            this.initElvesInfo();
            this.setupDirectionRules();
            this.doRounds();
            this.calcSmallestRectangle();
            this.calcEmptyTilesInRectangle();
            this.showResults();
        } else {
            this.processText(text);
        }
    }
}

module.exports.getFileReader = getFileReader;
module.exports.Solution1 = Solution1;


