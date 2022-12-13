const readline = require('readline');
const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

async function askQuestion(query){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

const terrainIndexValues = 'abcdefghijklmnopqrstuvwxyz';
class Solution1 {
    constructor() {
        this.terrainIndex = terrainIndexValues.split('');
        this.terrainMap = [];
        this.terrainInfo = [];
        this.rowLen = 0;
        this.rowCount = 0;
        this.trails = [];
        this.start = {};
        this.end = {};
    }

    showResults() {
        // console.log({ map: this.terrainMap, maplen: this.rowCount, rowLen: this.rowLen, terrainIndex: this.terrainIndex });
        console.log({ trails: this.trails });
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    buildTerrainGrid(text) {
        this.terrainMap.push(text.split(''));
    }

    tiVal(val){
        return this.terrainIndex.indexOf(val);
    }

    initInfo(x, y, currVal){
        const info = {left: 'y', right: 'y', up: 'y', down: 'y', x, y, end: false};
        if (x === 0){
            info.left = 'n/a';
            info.right = (this.tiVal(currVal) + 1) >= (this.tiVal(this.terrainMap[y][x+1])) ? 'y' : 'n';
        } else {
            if (x === this.rowLen - 1){
                info.right = 'n/a';
                if (this.terrainMap[y][x-1] === 'S'){
                    info.left = 'n';
                }else {
                    info.left = (this.tiVal(currVal) + 1) >= (this.tiVal(this.terrainMap[y][x - 1])) ? 'y' : 'n';
                }
            } else {
                info.right = (this.tiVal(currVal) + 1) >= (this.tiVal(this.terrainMap[y][x+1])) ? 'y' : 'n';
                if (this.terrainMap[y][x-1] === 'S'){
                    info.left = 'n';
                }else {
                    info.left = (this.tiVal(currVal) + 1) >= (this.tiVal(this.terrainMap[y][x-1])) ? 'y' : 'n';
                }
            }
        }
        if (y === 0){
            info.up = 'n/a';
            info.down = (this.tiVal(currVal) + 1) >= (this.tiVal(this.terrainMap[1][x])) ? 'y' : 'n';
        } else {
            if (y === this.rowCount - 1){
                info.down = 'n/a';
                if (this.terrainMap[y-1][x] === 'S'){
                    info.up = 'n';
                }else {
                    info.up = (this.tiVal(currVal) + 1) >= (this.tiVal(this.terrainMap[y-1][x])) ? 'y' : 'n';
                }
            } else {
                if (this.terrainMap[y-1][x] === 'S'){
                    info.up = 'n';
                }else {
                    info.up = (this.tiVal(currVal) + 1) >= (this.tiVal(this.terrainMap[y-1][x])) ? 'y' : 'n';
                }
                info.down = (this.tiVal(currVal) + 1) >= (this.tiVal(this.terrainMap[y+1][x])) ? 'y' : 'n';
            }
        }

        if (currVal === 'z') {
            console.log(` set ${x} ${y} to END`);
            info.end = true;
        }

       // const ans =  await askQuestion("Paused initInfo... ");
        return info;
    };

    initTerrainMap() {
        this.rowLen = this.terrainMap[0].length;
        this.rowCount = this.terrainMap.length;
        for (let y = 0; y < this.rowCount; y++) {
            const currRow = this.terrainMap[y];
            const terrainInfoRow = [];
            for (let x = 0; x < this.rowLen; x++) {
                if (currRow[x] === 'S'){
                    this.start = {x, y};
                    terrainInfoRow.push({
                        left: x === 0 ? 'n' : 'y',
                        right: (x === (this.rowLen - 1)) ? 'n' : 'y', up: 'y', down: 'y', x, y, start: true, end: false});
                }
                else if (currRow[x] === 'E'){
                    this.end = {x, y};
                    terrainInfoRow.push({left: 'n', right: 'n', up: 'n', down: 'n', x, y, start: false, end: true});
                } else {
                    terrainInfoRow.push(this.initInfo(x, y, currRow[x]));
                }
            }
            this.terrainInfo.push(terrainInfoRow);
        }
        // const val = this.terrainMap[3][6];
        // // console.log({test: this.tiVal(val), val});
        // // console.log({start: this.start, end: this.end});
    }

    alreadyHit(x, y, trail){
        return trail.some(t => ((t.x === x) && (t.y === y)));
    };

    async findPaths(item, direction, trail){
        // console.log({item, direction, trail});
        const { x, y, end } = item;
        console.log({item, direction, trail});
        // await askQuestion("Paused ");

        if (end){
            console.log('found end and pushed trail to storage');
            this.trails.push([...trail]);
            return true;
        }
        if (item.down === 'y' && direction !== 'up' && !this.alreadyHit(x,y+1,trail)){
            trail.push({x, y, direction: 'down'});
            console.log({terrainInfoFor: 'up', x, y, info: this.terrainInfo[y+1][x]});
            if (this.findPaths(this.terrainInfo[y+1][x],'down', trail)) return true;
            console.log({popped: trail.pop()});
        }
        if (item.up === 'y' && direction !== 'down' && !this.alreadyHit(x,y-1,trail)){
            trail.push({x, y, direction: 'up'});
            console.log({terrainInfoFor: 'up', x, y, info: this.terrainInfo[y-1][x]});
            if (this.findPaths(this.terrainInfo[y-1][x],'up', trail)) return true;
            console.log({popped: trail.pop()});
        }
        if (item.left === 'y' && direction !== 'right' && !this.alreadyHit(x-1,y,trail)){
            trail.push({x, y, direction: 'left'});
            if (this.findPaths(this.terrainInfo[y][x-1],'left', trail)) return true;
            console.log({popped: trail.pop()});
        }
        if (item.right === 'y' && direction !== 'left' && !this.alreadyHit(x+1,y,trail)){
            trail.push({x, y, direction: 'right'});
            if (this.findPaths(this.terrainInfo[y][x+1],'right', trail)) return true;
            console.log({popped: trail.pop()});
        }
        // this.trails.push(trail);
        return false;
    };

    processTerrainLine(text) {
        if (this.finishedProcessing(text)) {
            this.initTerrainMap();
            const {x, y} = this.start;
            this.findPaths(this.terrainInfo[y][x], '', [{x, y, direction: 'start'}]);
            this.showResults();
        } else {
            this.buildTerrainGrid(text);
        }
    }

}

module
    .exports
    .getFileReader = getFileReader;
module
    .exports
    .Solution1 = Solution1;


