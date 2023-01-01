const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

const terrainIndexValues = 'abcdefghijklmnopqrstuvwxyzE';


class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

// A data structure for queue used in BFS
class queueNode {
    constructor(pt, dist, trail) {
        this.pt = pt // The coordinates of the cell
        this.dist = dist // Cell's distance from the source
        this.trail = trail
    }
}

class Solution1 {
    constructor() {
        this.mat = [];
        this.rowLen = 0;
        this.rowCount = 0;
        this.src = null;
        this.dest = null;
        this.terrainIndex = terrainIndexValues.split('');

        // These arrays are used to get row and column
// numbers of 4 neighbours of a given cell
        this.rowNum = [-1, 0, 0, 1]
        this.colNum = [0, -1, 1, 0]

    }

    moveIsAllowed(from, to) {
        if (to === 'S') {
            return false;
        }
        const fromIndex = this.terrainIndex.indexOf(from);
        const toIndex = this.terrainIndex.indexOf(to);

        return (toIndex <= (fromIndex + 1));
    }

    buildTerrainGrid(text) {
        this.mat.push(text.split(''));
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    processTerrainLine(text) {
        if (this.finishedProcessing(text)) {
            this.execute();
        } else {
            this.buildTerrainGrid(text);
        }
    }

    initStartEnd() {
        this.rowLen = this.mat[0].length;
        this.rowCount = this.mat.length;
        let doneStart = false;
        let doneDest = false;
        for (let y = 0; y < this.rowCount; y++) {
            const currRow = this.mat[y];
            for (let x = 0; ((x < this.rowLen) && (!doneStart || !doneDest)); x++) {
                if (currRow[x] === 'S') {
                    this.src = new Point(y, x);
                    doneStart = true;
                } else if (currRow[x] === 'E') {
                    this.dest = new Point(y, x);
                    doneDest = true;
                }
            }
        }
    }

    // Check whether given cell(row,col)
// is a valid cell or not
    isValid(row, col) {
        return (row >= 0) && (row < this.rowCount) &&
            (col >= 0) && (col < this.rowLen)
    }

    draw( result, trail ){

        trail.forEach(t => {
            const {row, col} = t;
            result[row][col] = true;
        })

        result.forEach(row => {
            let rowStr = '';
            row.forEach(col => {
                rowStr = rowStr + (col ? 'x' : '.');
            })
            console.log(rowStr);
        })

    }
// Function to find the shortest path between
// a given source cell to a destination cell.
    BFS( src, dest) {

        // check source and destination cell
        // of the matrix have value 1
        if (this.mat[src.x][src.y] !== 'S' || this.mat[dest.x][dest.y] !== 'E')
            return -1

        let visited = new Array(this.rowCount).fill(false).map(() => new Array(this.rowLen).fill(false));
        let result = new Array(this.rowCount).fill(false).map(() => new Array(this.rowLen).fill(false));

        // Mark the source cell as visited
        visited[src.x][src.y] = true

        // Create a queue for BFS
        let q = []

        // Distance of source cell is 0
        let s = new queueNode(src, 0, [{row: src.x, col: src.y}])
        q.push(s) // Enqueue source cell

        // Do a BFS starting from source cell
        while (q) {

            let curr = q.shift() // Dequeue the front cell

            // If we have reached the destination cell,
            // we are done
            let pt = curr.pt
            if (pt.x === dest.x && pt.y === dest.y){
                console.log({trail: curr.trail});
                this.draw(result, curr.trail);
                return curr.dist;
            }

            const moveFrom = this.mat[pt.x][pt.y];

            // Otherwise enqueue its adjacent cells
            for (let i = 0; i < 4; i++) {
                let row = pt.x + this.rowNum[i]
                let col = pt.y + this.colNum[i]
                if (this.isValid(row, col)) {
                    const moveTo = this.mat[row][col];
                    // if adjacent cell is valid, has path
                    // and not visited yet, enqueue it.
                    if (this.moveIsAllowed(moveFrom, moveTo) && !visited[row][col]) {
                        visited[row][col] = true
                        let Adjcell = new queueNode(new Point(row, col),
                            curr.dist + 1, [...curr.trail, {row, col}])
                        q.push(Adjcell)
                    }
                }
            }
        }
        // Return -1 if destination cannot be reached
        return -1
    }

    execute() {
        this.initStartEnd();

        let dist = this.BFS(this.src, this.dest)

        if (dist !== -1)
            console.log(`Shortest Path is ${dist}`)
        else
            console.log("Shortest Path doesn't exist")
    }
}

module
    .exports
    .getFileReader = getFileReader;
module
    .exports
    .Solution1 = Solution1;

