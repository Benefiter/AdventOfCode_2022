const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

const terrainIndexValues = 'abcdefghijklmnopqrstuvwxyzE';


// User defined Pair class
class Pair {
    constructor(x, y) {
        this.first = x;
        this.second = y;
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
    }

    moveIsAllowed(from, to){
        const fromIndex = this.terrainIndex.indexOf(from);
        const toIndex = this.terrainIndex.indexOf(to);
        return (toIndex <= (fromIndex + 1));
    }
// Check if it is possible to go to (x, y) from the current
// position. The function returns false if the cell has
// value 0 or already visited
    isSafe(visited, x, y, movingFrom) {
        return (x >= 0 && x < this.mat.length && y >= 0
            && y < this.mat[0].length
            && !visited[x][y])
            && this.moveIsAllowed(movingFrom, this.mat[x][y]);
    }

    findShortestPath(visited, i, j, x, y,
                     min_dist, dist) {
        if (i === x && j === y) {
            min_dist = Math.min(dist, min_dist);
            return min_dist;
        }
        // set (i, j) cell as visited
        visited[i][j] = true;
        const moveFrom = this.mat[i][j];
        let moveTo;
        // go to the bottom cell
        if (this.isSafe(visited,i + 1, j, moveFrom)) {
            moveTo = this.mat[i+1][j];
            min_dist
                = this.findShortestPath(visited, i + 1, j, x, y,
                min_dist, dist + 1);
        }
        // go to the right cell
        if (this.isSafe(visited, i, j + 1, moveFrom)) {
            moveTo = this.mat[i][j+1];
            min_dist
                = this.findShortestPath(visited, i, j + 1, x, y,
                min_dist, dist + 1);
        }
        // go to the top cell
        if (this.isSafe(visited,i - 1, j, moveFrom)) {
            moveTo = this.mat[i-1][j];
            min_dist
                = this.findShortestPath(visited,i - 1, j, x, y,
                min_dist, dist + 1);
        }
        // go to the left cell
        if (this.isSafe(visited, i, j - 1, moveFrom)) {
            moveTo = this.mat[i][j-1];
            min_dist
                = this.findShortestPath(visited, i, j - 1, x, y,
                min_dist, dist + 1);
        }
        // backtrack: remove (i, j) from the visited matrix
        visited[i][j] = false;
        return min_dist;
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

// Wrapper over findShortestPath() function
    findShortestPathLength(src, dest) {
        if (this.mat.length === 0 || this.mat[src.first][src.second] === 0
            || this.mat[dest.first][dest.second] === 0)
            return -1;

        // construct an `M × N` matrix to keep track of visited
        // cells
        let visited = [];
        for (let i = 0; i < this.mat.length; i++)
            visited.push(new Array(this.mat[0].length));

        let dist = Number.MAX_SAFE_INTEGER;
        dist = this.findShortestPath(visited, src.first,
            src.second, dest.first,
            dest.second, dist, 0);

        if (dist !== Number.MAX_SAFE_INTEGER)
            return dist;
        return -1;
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
                    this.src = new Pair(y, x);
                    doneStart = true;
                } else if (currRow[x] === 'E') {
                    this.dest = new Pair ( y, x );
                    doneDest = true;
                }
            }
        }
    }

    execute() {
        this.initStartEnd();
        let dist = this.findShortestPathLength(this.src, this.dest);
        if (dist !== -1)
            console.log("Shortest Path is " + dist);

        else
            console.log("Shortest Path doesn't exist");
    }
}

module
    .exports
    .getFileReader = getFileReader;
module
    .exports
    .Solution1 = Solution1;

