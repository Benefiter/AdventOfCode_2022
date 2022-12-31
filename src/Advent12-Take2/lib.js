const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

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
        this.seenTrails = [];
        this.duplicateTrails = [];
        this.debug = true;
        this.testLimit = 1000000;
        this.minTrailLength = Number.MAX_VALUE;
        this.lastMinTrail = [];
        this.excludeList = [];
        this.shortestTrail = [];
    }

    showResults() {
        // console.log({ map: this.terrainMap, maplen: this.rowCount, rowLen: this.rowLen, terrainIndex: this.terrainIndex });
        this.trails.forEach((t, index) => {
            // if (last.x === this.end.x && last.y === this.end.y) {
            // if (t[0].direction === 'down' && t[1].direction === 'right' && t[2].direction === 'down') {
            // console.log({ totalSteps: t.length, first: t[0], last });
            console.log(`***************************  LIST ${index} trail steps: ${t.length}`);
            t.forEach(e => console.log(e));
            // }
            // }
        });
        console.log({ totalTrails: this.trails.length });
        const leastSteppedTrail = this.trails.reduce((acc, curr) => {
            if (curr.length < acc) {
                acc = curr.length;
            }
            return acc;
        }, Number.MAX_VALUE)
        console.log({ leastSteppedTrail });
        // this.terrainInfo.forEach(r => {
        //     r.forEach(c => console.log(c));
        // })
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    buildTerrainGrid(text) {
        this.terrainMap.push(text.split(''));
    }

    tiVal(val) {
        return this.terrainIndex.indexOf(val);
    }

    initInfo(x, y, currVal) {
        const info = { left: 'y', right: 'y', up: 'y', down: 'y', x, y, end: false };
        if (x === 0) {
            info.left = 'n/a';
            info.right = (this.tiVal(currVal) + 1) >= (this.tiVal(this.terrainMap[y][x + 1])) ? 'y' : 'n';
        } else {
            if (x === this.rowLen - 1) {
                info.right = 'n/a';

                const leftCheckVal = this.terrainMap[y][x - 1];
                if (['S', 'E'].includes(leftCheckVal)) {
                    info.left = 'n';
                } else {
                    info.left = (this.tiVal(currVal) + 1) >= (this.tiVal(leftCheckVal)) ? 'y' : 'n';
                }
            } else {
                const rightCheckVal = this.terrainMap[y][x + 1];
                if (['S', 'E'].includes(rightCheckVal)) {
                    info.right = 'n';
                } else {
                    info.right = (this.tiVal(currVal) + 1) >= (this.tiVal(rightCheckVal)) ? 'y' : 'n';
                }

                const leftCheckVal = this.terrainMap[y][x - 1];
                if (['S', 'E'].includes(leftCheckVal)) {
                    info.left = 'n';
                } else {
                    info.left = (this.tiVal(currVal) + 1) >= (this.tiVal(leftCheckVal)) ? 'y' : 'n';
                }
            }
        }
        if (y === 0) {
            info.up = 'n/a';
            info.down = (this.tiVal(currVal) + 1) >= (this.tiVal(this.terrainMap[1][x])) ? 'y' : 'n';
        } else {
            if (y === this.rowCount - 1) {
                info.down = 'n/a';
                const upCheckVal = this.terrainMap[y - 1][x];
                if (['S', 'E'].includes(upCheckVal)) {
                    info.up = 'n';
                } else {
                    info.up = (this.tiVal(currVal) + 1) >= (this.tiVal(upCheckVal)) ? 'y' : 'n';
                }
            } else {
                const upCheckVal = this.terrainMap[y - 1][x];
                if (['S', 'E'].includes(upCheckVal)) {
                    info.up = 'n';
                } else {
                    info.up = (this.tiVal(currVal) + 1) >= (this.tiVal(upCheckVal)) ? 'y' : 'n';
                }

                const downCheckVal = this.terrainMap[y + 1][x];
                if (['S', 'E'].includes(downCheckVal)) {
                    info.down = 'n';
                } else {
                    info.down = (this.tiVal(currVal) + 1) >= (this.tiVal(downCheckVal)) ? 'y' : 'n';
                }
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
                if (currRow[x] === 'S') {
                    this.start = { x, y };
                    terrainInfoRow.push({
                        left: x === 0 ? 'n' : 'y',
                        right: (x === (this.rowLen - 1)) ? 'n' : 'y',
                        up: y > 0 ? 'y' : 'n',
                        down: (y === this.rowCount - 1) ? 'n' : 'y',
                        x, y, start: true, end: false
                    });
                } else if (currRow[x] === 'E') {
                    this.end = { x, y };
                    terrainInfoRow.push({ left: 'n', right: 'n', up: 'n', down: 'n', x, y, start: false, end: true });
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

    alreadyHit(x, y, trail) {
        if (this.excluded(x,y)) return true;
        return trail.some(t => ((t.x === x) && (t.y === y)));
    };

    excluded(x, y){
        return this.excludeList.some(el => ((el.x === x) && (el.y === y)));
    }

    findNextMatchIndex(matchList, duplicatesCopy, startIndex) {
        let resultIndex = -1;
        duplicatesCopy.every((l, index) => {
            if (l.length === matchList.length) {
                if (index >= startIndex) {
                    if (l.every((rec, recIndex) => {
                        // console.log({ rec, matchListItem: matchList[recIndex] });
                        return (rec.x === matchList[recIndex].x &&
                            rec.y === matchList[recIndex].y &&
                            rec.direction === matchList[recIndex].direction);
                    })) {
                        resultIndex =  index;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            } else {
                return false;
            }
        })
        console.log({resultIndex});
        return resultIndex;
    }

    matchFound(matchedSequentialDups, currentMatchedSequentialDups) {
        let doMatch = true;
        matchedSequentialDups.forEach(ll => {
            if (doMatch) {
                doMatch = ll.every((l, index) => {
                    const currListToMatch = currentMatchedSequentialDups[index];
                    if (l.length !== currListToMatch.length) return false;
                    return l.every((source, index) => {
                        const matchee = currListToMatch[index];
                        return ((source.x === matchee.x) && (source.y === matchee.y) && (source.direction === matchee.direction));
                    });
                })
            }
        })
        return doMatch;
    }

    checkForDuplicateTrail(trail) {
        if (this.debug === false) return;
        if (this.duplicateTrails.length > this.testLimit) {
            // this.duplicateTrails.forEach((t, index) => {
            //     if (index > (this.testLimit - 1)) {
            //         for (let i=t.length -3 ; i < t.length; i++ ){
            //             console.log({val: t[i], listLen: t.length});
            //         }
            //     }
            // })
            const duplicatesCopy = [...this.duplicateTrails];
            const matchedSequentialDups = []
            this.duplicateTrails.forEach((l) => {
                const currentMatchedSequentialDups = [];
                let nextMatchIndex = this.findNextMatchIndex(l, duplicatesCopy, 0);
                while (nextMatchIndex !== -1) {
                    currentMatchedSequentialDups.push(duplicatesCopy[nextMatchIndex]);
                    nextMatchIndex = this.findNextMatchIndex(l, duplicatesCopy, nextMatchIndex);
                }
                if (!this.matchFound(matchedSequentialDups, currentMatchedSequentialDups)) {
                    matchedSequentialDups.push(currentMatchedSequentialDups);
                    console.log({ matchedSequentialDupsLength: matchedSequentialDups.length });
                }
            })
            this.duplicateTrails = [];
            this.seenTrails = [];
            // this.debug = false;
        }
        if (this.seenTrails.length === 0) {
            this.seenTrails.push(trail);
            return;
        }
        this.seenTrails.forEach(t => {
            if (trail.length === t.length) {
                if (t.every((rec, index) => {
                    const compareRec = trail[index];
                    return ((rec.x === compareRec.x) &&
                        (rec.y === compareRec.y) &&
                        (rec.direction === compareRec.direction));
                })) {
                    this.duplicateTrails.push(trail);
                    // console.log({duplicateTrails: this.duplicateTrails.length});
                } else {
                    this.seenTrails.push(trail);
                    console.log({ seenTrails: this.seenTrails.length });
                }
            }
        })
    }

    pop(trail){
        trail.pop();
        // if (trail.length === 0){
        //     console.log('trailLength is zero');
        // }
        // if (trail.length === 1){
        //     console.log({trail});
        // }
        // if (trail.length === 2){
        //     console.log({trail});
        // }
        // if (trail.length <= this.minTrailLength){
        //     if (this.lastMinTrail.length === 0){
        //         this.lastMinTrail = [...trail];
        //         this.minTrailLength = trail.length;
        //         return;
        //     }
        //     const sameTrail = trail.every((rec, index) => {
        //         if (trail.length !== this.lastMinTrail.length){
        //             return false;
        //         }
        //
        //         const checkRec = this.lastMinTrail[index];
        //         return (rec.x === checkRec.x && rec.y === checkRec.y && rec.direction === checkRec.direction);
        //     })
        //
        //     if (sameTrail){
        //         console.log('***** Same Trail');
        //     } else {
        //         console.log('##### Different Trail');
        //     }
        //     this.minTrailLength = trail.length;
        //     console.log(trail)
        //     console.log({minTrailLength: this.minTrailLength})
        // }
    }

    findPaths(item, direction, trail) {
        // console.log({item, direction, trail});
        const { x, y, end } = item;
        // console.log({item, direction, trail});
        // await askQuestion("Paused ");
        // this.checkForDuplicateTrail(trail);

        if (end) {
            console.log({end, trailLength: trail.length + 1, shortestTrail: this.shortestTrail.length});
            trail.push({ x, y, direction });
            if (this.shortestTrail.length === 0){
                this.shortestTrail = [...trail];
            }else{
                if (trail.length < this.shortestTrail.length){
                    this.shortestTrail = [...trail];
                    console.log({shortestTrail: this.shortestTrail.length});
                }
            }
            //this.trails.push([...trail]);
            // console.log({ popped: trail.pop() });
            trail.pop();
            // console.log({shortestTrail: this.shortestTrail});
            return true;
        }

        if ([{x, y:y+1, direction: 'up'} , {x, y:y-1, direction: 'down'}, {x:x-1, y, direction: 'left'}, {x:x+1, y, direction: 'right'}].reduce((acc, curr) => {
            const {x, y, direction} = curr;
            if (item[direction] === 'y') {
                acc = acc && (this.alreadyHit(x, y, trail));
                return acc;
            }
        }, true)){
            if (!this.excludeList.some(item => {
                return ((item.x === x) && (item.y === y))
            })) {
                this.excludeList.push({ x, y });
                console.log({ exludedListLength: this.excludeList.length });
            }
            return;
        }

        // if (this.alreadyHit(x, y + 1, trail) &&
        //     this.alreadyHit(x, y - 1, trail) &&
        //     this.alreadyHit(x - 1, y, trail) &&
        //     this.alreadyHit(x + 1, y, trail)) {
        //     // console.log('All 4 already hit');
        //     // console.log({x, y, item, direction, trail});
        //     this.excludeList.push({x, y});
        //     return;
        // }
        if (item.down === 'y' && direction !== 'up' && !this.alreadyHit(x, y + 1, trail)) {

            trail.push({ x, y, direction: 'down' });
            // console.log({terrainInfoFor: 'up', x, y, info: this.terrainInfo[y+1][x]});

            this.findPaths(this.terrainInfo[y + 1][x], 'down', trail);
            // console.log({ popped: trail.pop() });
            this.pop(trail);
            // console.log(`return from item.down. trail length ${trail.length}`);
        }
        if (item.up === 'y' && direction !== 'down' && !this.alreadyHit(x, y - 1, trail)) {
            trail.push({ x, y, direction: 'up' });

            // console.log({item, direction});
            // console.log({terrainInfoFor: 'up', x, y, info: this.terrainInfo[y-1][x]});
            this.findPaths(this.terrainInfo[y - 1][x], 'up', trail);
            // console.log({ popped: trail.pop() });
            this.pop(trail);
            // console.log(`return from item.up. trail length ${trail.length}`);
        }
        if (item.left === 'y' && direction !== 'right' && !this.alreadyHit(x - 1, y, trail)) {
            trail.push({ x, y, direction: 'left' });

            this.findPaths(this.terrainInfo[y][x - 1], 'left', trail);
            // console.log({ popped: trail.pop() });
            this.pop(trail);
            // console.log(`return from item.left. trail length ${trail.length}`);
        }
        if (item.right === 'y' && direction !== 'left' && !this.alreadyHit(x + 1, y, trail)) {
            trail.push({ x, y, direction: 'right' });

            this.findPaths(this.terrainInfo[y][x + 1], 'right', trail);
            // console.log({ popped: trail.pop() });
            this.pop(trail);
            // console.log(`return from item.right. trail length ${trail.length}`);
        }
        // this.trails.push(trail);
        return false;
    };

    processTerrainLine(text) {
        if (this.finishedProcessing(text)) {
            this.initTerrainMap();
            console.log({ startLoc: this.start, endLoc: this.end });
            console.log({startInfo: this.terrainInfo[this.start.y][this.start.x]});
            const { x, y } = this.start;
            this.findPaths(this.terrainInfo[y][x], 'start', []);
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


