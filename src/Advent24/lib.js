const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

class Solution1 {
    constructor() {
        this.blizzards = [];
        this.start = {};
        this.end = {};
    }

    showResults() {
        console.log('Not implemented');
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }


    processText(text) {
        const row = text.split('');
        const blizzardRow = row.map(c => c === '.' ? [] : [c]);
        this.blizzards.push(blizzardRow);
        this.minuteElapsed = 0;
        this.maxMins = 20;
    }

    initContext(){
        this.start = {x:1, y: 0};
        this.end = {x: this.blizzards[0].length - 2, y:this.blizzards.length - 1};
        this.minuteElapsed = 0;
        this.display();
    }

    getBlankBlizzardGrid(){
        return this.blizzards.map((row, rowIndex) => {
            if (rowIndex === 0 || rowIndex === this.blizzards.length-1){
                return [...row];
            }else{
                return row.map((col, colIndex) => {
                    if (colIndex === 0 || colIndex === row.length-1){
                        return [...col];
                    }else {
                        return [];
                    }
                })
            }
        })
    }

    getInfoForCol(col){
        if (col[0] === '#' || col[0] === '.'){
            return col[0];
        }

        if (col.length === 0){
            return '.';
        }
        if (col.length === 1){
            return col[0]
        } else {
            return col.length;
        }
    };

    display(){
        this.blizzards.forEach(row => {
            let rowStr = '';
            row.forEach(col => {
                rowStr += this.getInfoForCol(col);
            })
            console.log(rowStr);
        })
    }

    updateBlizzards(){
        const updatedBlizzards = this.getBlankBlizzardGrid();
        const rlen = updatedBlizzards[0].length;
        for (let i = 1; i <= this.blizzards.length-2; i++){
            const updatedBlizzardRow = updatedBlizzards[i];
            this.blizzards[i].forEach((col, colIndex) => {
                if (colIndex !== 0 && colIndex !== rlen-1){
                    col.forEach(b => {
                        switch (b){
                            case '<':
                                if (colIndex === 1){
                                    updatedBlizzardRow[rlen-2].push(b);
                                } else {
                                    updatedBlizzardRow[colIndex-1].push(b);
                                }
                                break;
                            case '>':
                                if (colIndex === rlen-2){
                                    updatedBlizzardRow[1].push(b);
                                } else {
                                    updatedBlizzardRow[colIndex+1].push(b);
                                }
                                break;
                            case '^':
                                if (i === 1){
                                    updatedBlizzards[updatedBlizzards.length-2][colIndex].push(b);
                                } else {
                                    updatedBlizzards[i-1][colIndex].push(b);
                                }
                                break;
                            case 'v':
                                if (i === this.blizzards.length-2){
                                    updatedBlizzards[1][colIndex].push(b);
                                } else {
                                    updatedBlizzards[i+1][colIndex].push(b);
                                }
                                break;
                            default:
                                throw new Error('Unknown blizzard type');

                        }
                    })
                }
            })
        }
        this.blizzards = updatedBlizzards;
        this.display();
    }

    execute(){
        while (this.minuteElapsed < this.maxMins){
            this.updateBlizzards();
            this.minuteElapsed++;
        }
    }

    process(text) {
        if (this.finishedProcessing(text)) {
            this.initContext();
            this.execute();
            this.showResults();
        } else {
            this.processText(text);
        }
    }
}

module.exports.getFileReader = getFileReader;
module.exports.Solution1 = Solution1;


