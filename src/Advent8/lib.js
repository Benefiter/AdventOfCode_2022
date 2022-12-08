const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

class Solution1 {
    constructor() {
        this.grid = [];
        this.currTreeSize = 0;
        this.col = 0;
        this.row = 0;
        this.totalTreesVisible = 0;
        this.gridCols = 0;
        this.gridRows = 0;
    }

    visibleFromLeft() {
        let isVisible = true;
        for (let x = 0; x < this.col; x++) {
            if (this.grid[this.row][x].size >= this.currTreeSize) {
                isVisible = false;
            }
        }
        return isVisible;
    }

    visibleFromRight() {
        let isVisible = true;
        for (let x = this.col + 1; x < this.gridCols; x++) {
            if (this.grid[this.row][x].size >= this.currTreeSize) {
                isVisible = false;
            }
        }
        return isVisible;
    }

    visibleFromTop() {
        let isVisible = true;
        for (let y = 0; y < this.row; y++) {
            if (this.grid[y][this.col].size >= this.currTreeSize) {
                isVisible = false;
            }
        }
        return isVisible;
    }

    visibleFromBottom() {
        let isVisible = true;
        for (let y = this.row + 1; y < this.gridRows; y++) {
            if (this.grid[y][this.col].size >= this.currTreeSize) {
                isVisible = false;
            }
        }
        return isVisible;
    }

    showResults() {
        const treesVisibleFromTheEdge = ((this.grid.length - 2) * 2) + ((this.grid[0].length * 2));
        console.log({ treesVisibleFromTheEdge });
        this.totalTreesVisible = treesVisibleFromTheEdge;
        for (this.row = 1; this.row < (this.gridRows - 1); this.row++) {
            for (this.col = 1; this.col < (this.gridCols - 1); this.col++) {
                this.currTreeSize = this.grid[this.row][this.col].size;
                let visibleCount = 0;
                if (this.visibleFromLeft() ||
                    this.visibleFromRight() ||
                    this.visibleFromTop() ||
                    this.visibleFromBottom()) visibleCount++;
                this.grid[this.row][this.col].visibleCount = visibleCount;
                this.totalTreesVisible += visibleCount;
            }
        }
        this.grid.forEach(l => console.log(l));
        console.log({ result: this.totalTreesVisible });
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    printGrid() {
        this.grid.forEach(l => console.log(l));
        console.log({ width: this.grid[0].length, height: this.grid.length });
    }

    processText(text) {
        this.grid.push(text.split('').map(s => ({ size: +s, visibleCount: 0 })));
    }

    processGridLine(text) {
        if (this.finishedProcessing(text)) {
            this.gridCols = this.grid[0].length;
            this.gridRows = this.grid.length;
            this.printGrid();
            this.showResults();
        } else {
            this.processText(text);
        }
    }
}

class Solution2 extends Solution1{
    constructor() {
        super();
        this.highestScenicScore = 0;
    }

    viewingDistanceFromLeft() {
        let viewingDistance = 0;
        let v = 0;
        for (let x = this.col - 1; x >= 0; x--, v++) {
            if (this.grid[this.row][x].size >= this.currTreeSize) {
                if (viewingDistance === 0) viewingDistance = v+1;
            }
        }
        return viewingDistance > 0 ? viewingDistance : v;
    }

    viewingDistanceFromRight() {
        let viewingDistance = 0;
        let v = 0;
        for (let x = this.col + 1; x < this.gridCols; x++, v++) {
            if (this.grid[this.row][x].size >= this.currTreeSize) {
                if (viewingDistance === 0) viewingDistance = v+1;
            }
        }
        return viewingDistance > 0 ? viewingDistance : v;
    }

    viewingDistanceFromTop() {
        let viewingDistance = 0;
        let v = 0;
        for (let y = this.row - 1; y >= 0; y--, v++) {
            if (this.grid[y][this.col].size >= this.currTreeSize) {
                if (viewingDistance === 0) viewingDistance = v+1;
            }
        }
        return viewingDistance > 0 ? viewingDistance : v;
    }

    viewingDistanceFromBottom() {
        let viewingDistance = 0;
        let v = 0;
        for (let y = this.row + 1; y < this.gridRows; y++, v++) {
            if (this.grid[y][this.col].size >= this.currTreeSize) {
                if (viewingDistance === 0) viewingDistance = v+1;
            }
        }
        return viewingDistance > 0 ? viewingDistance : v;
    }

    showResults() {
        for (this.row = 1; this.row < (this.gridRows - 1); this.row++) {
            for (this.col = 1; this.col < (this.gridCols - 1); this.col++) {
                this.currTreeSize = this.grid[this.row][this.col].size;
                const currScenicScore =
                    this.viewingDistanceFromLeft() *
                    this.viewingDistanceFromRight() *
                    this.viewingDistanceFromTop() *
                    this.viewingDistanceFromBottom();
                if (currScenicScore > this.highestScenicScore){
                    this.highestScenicScore = currScenicScore;
                }
            }
        }
        this.grid.forEach(l => console.log(l));
        console.log({ result: this.highestScenicScore });
    }

    processText(text) {
        this.grid.push(text.split('').map(s => ({ size: +s})));
    }

    processGridLine(text) {
        if (this.finishedProcessing(text)) {
            this.gridCols = this.grid[0].length;
            this.gridRows = this.grid.length;
            this.printGrid();
            this.showResults();
        } else {
            this.processText(text);
        }
    }
}

module
    .exports
    .getFileReader = getFileReader;
module
    .exports
    .Solution1 = Solution1;
module
    .exports
    .Solution2 = Solution2;



