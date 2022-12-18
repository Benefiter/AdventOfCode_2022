const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

class Solution1 {
    constructor() {
        this.minX = Number.MAX_VALUE;
        this.minY = Number.MAX_VALUE;
        this.maxX = Number.MIN_VALUE;
        this.maxY = Number.MIN_VALUE;
        this.sensorCoords = [];
        this.beaconCoords = [];
        this.manhattan = [];
        this.empty = '.';
        this.deviceGrid = [];
        this.xOffset = 0;
        this.yOffset = 0;
        this.sensor = 'S';
        this.beacon = 'B';
        this.noBeaconInDeviceRange = '#';
        this.xTrueOffset = 0;
        this.yTrueOffset = 0;
        this.rowOfInterest = 10;
        this.results = new Set();
    }

    showResults() {
        console.log({
            minx: this.minX,
            miny: this.minY,
            maxx: this.maxX,
            maxy: this.maxY,
            xOffset: this.xOffset,
            yOffset: this.yOffset
        });

        console.log(`row ${this.rowOfInterest} = ${this.results.size}`);
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    addSensorAndBeacon(text) {
        //Sensor at x=2, y=18: closest beacon is at x=-2, y=15
        const coordsList = text.replace(/Sensor at /gi, '').replace(/ closest beacon is at /gi, '').split(':');
        const sensorCoords = coordsList[0].split(',');
        const sensorX = +(sensorCoords[0].split('='))[1];
        const sensorY = +(sensorCoords[1].split('='))[1];
        if (sensorX < this.minX) {
            this.minX = sensorX;
        }
        if (sensorY < this.minY) {
            this.minY = sensorY;
        }
        if (sensorX > this.maxX) {
            this.maxX = sensorX;
        }
        if (sensorY > this.maxY) {
            this.maxY = sensorY;
        }
        this.sensorCoords.push({ x: sensorX, y: sensorY });

        const beaconCoords = coordsList[1].split(',');
        const beaconX = +(beaconCoords[0].split('='))[1];
        const beaconY = +(beaconCoords[1].split('='))[1];
        if (beaconX < this.minX) {
            this.minX = beaconX;
        }
        if (beaconY < this.minY) {
            this.minY = beaconY;
        }
        if (beaconX > this.maxX) {
            this.maxX = beaconX;
        }
        if (beaconY > this.maxY) {
            this.maxY = beaconY;
        }
        this.beaconCoords.push({ x: beaconX, y: beaconY });
        this.manhattan.push((Math.abs(sensorX - beaconX)) + (Math.abs(sensorY - beaconY)));
    }

    populateGridWithDevices() {
        this.sensorCoords.forEach(c => {
            const { x, y } = c;
            this.deviceGrid[y + this.yOffset][x + this.xOffset] = this.sensor;
        })
        this.beaconCoords.forEach(c => {
            const { x, y } = c;
            this.deviceGrid[y + this.yOffset][x + this.xOffset] = this.beacon;
        })
    }

    createDeviceGrid() {
        this.xTrueOffset = this.minX < 0 ? -1 * this.minX : 0;
        this.yTrueOffset = this.minY < 0 ? -1 * this.minY : 0;

        this.xOffset = 0;
        this.yOffset = 0;
    }

    setBeaconRangeIndicator(x, y) {
        // if (x < 0  || x > (this.maxX + this.xOffset) || y < 0 || y > (this.maxY + this.yOffset)){
        //     // console.log(`not processing ${x}, ${y}`);
        //     return;
        // }
        // console.log(`******* processing ${x}, ${y}`);

        if (y === this.rowOfInterest) {
            const hasSensorAtLocation = this.sensorCoords.some(s => {
                return ((s.x === x) && (s.y === y));
            });
            const hasDeviceAtLocation = hasSensorAtLocation || this.beaconCoords.some(s => {
                return ((s.x === x) && (s.y === y));
            });
            if (!hasDeviceAtLocation) {
                const item = `${x}_${y}`;
                if (!this.results.has(item)) {
                    this.results.add(item);
                    // console.log({setSize: this.results.size});
                }
            }
        }
    }

    setNoCloseBeaconInRangeState({ x, y }, manhattan) {
        if (y > this.rowOfInterest) {
            if ((y - manhattan) <= this.rowOfInterest) {
                //continue...
            } else {
                return;
            }
        } else {
            if ((y + manhattan) >= this.rowOfInterest) {
                //continue...
            } else {
                return;
            }
        }
        this.setBeaconRangeIndicator(x, y - manhattan)
        const manhattanRange = [];
        for (let m = manhattan - 1; m > 0; m--) {
            manhattanRange.push(m);
        }
        // console.log({manhattan, manhattanRange});
        for (let j = 1; j < manhattan; j++) {
            if ((y - j === this.rowOfInterest)) {
                const xRange = manhattanRange[j - 1];
                for (let i = (-1 * xRange); i <= xRange; i++) {
                    this.setBeaconRangeIndicator(x + i, y - j);
                }
            }
        }

        if ((y === this.rowOfInterest)) {
            for (let i = x - manhattan; i <= x + manhattan; i++) {
                this.setBeaconRangeIndicator(i, y);
            }
        }

        for (let j = 1; j < manhattan; j++) {
            if ((y + j === this.rowOfInterest)) {
                const xRange = manhattanRange[j - 1];
                for (let i = (-1 * xRange); i <= xRange; i++) {
                    this.setBeaconRangeIndicator(x + i, y + j);
                }
            }
        }
        // this.showResults();

        this.setBeaconRangeIndicator(x, y + manhattan);

        // console.log(`sensor at ${x}, ${y}`);

    }

    adjustSensorLocations() {
        return [...this.sensorCoords].map(s => ({ x: s.x + this.xOffset, y: s.y + this.yOffset }));
    }

    setNoBeaconsCoverageForSensors() {
        this.sensorCoords.forEach((s, index) => {
            this.setNoCloseBeaconInRangeState(s, this.manhattan[index]);
        })
    }

    processSensorLine(text) {
        if (this.finishedProcessing(text)) {
            // console.log({manhattanVals: this.manhattan});
            this.createDeviceGrid();
            // this.populateGridWithDevices();
            this.setNoBeaconsCoverageForSensors();
            this.showResults();
        } else {
            this.addSensorAndBeacon(text);
        }
    }
}

class Solution2 {
    constructor() {
        this.minX = Number.MAX_VALUE;
        this.minY = Number.MAX_VALUE;
        this.maxX = Number.MIN_VALUE;
        this.maxY = Number.MIN_VALUE;
        this.sensorCoords = [];
        this.beaconCoords = [];
        this.manhattan = [];
        this.manhattanRange = new Map();
        this.empty = '.';
        this.deviceGrid = [];
        this.xOffset = 0;
        this.yOffset = 0;
        this.sensor = 'S';
        this.beacon = 'B';
        this.noBeaconInDeviceRange = '#';
        this.xTrueOffset = 0;
        this.yTrueOffset = 0;
        this.rowOfInterest = 2000000;
        this.results = new Set();
        this.maxCheckRow = 4000000;
        this.maxCheckCol = 4000000;
        this.minCheckCol = 0;
        this.minCheckRow = 0;
        this.done = false;
        // this.resultsList = [];
    }

    showResults() {
        console.log({
            minx: this.minX,
            miny: this.minY,
            maxx: this.maxX,
            maxy: this.maxY,
            xOffset: this.xOffset,
            yOffset: this.yOffset
        });

        this.rowOfInterest = 10;
        console.log(`row ${this.rowOfInterest} = ${this.results.size}`);
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    addSensorAndBeacon(text) {
        //Sensor at x=2, y=18: closest beacon is at x=-2, y=15
        const coordsList = text.replace(/Sensor at /gi, '').replace(/ closest beacon is at /gi, '').split(':');
        const sensorCoords = coordsList[0].split(',');
        const sensorX = +(sensorCoords[0].split('='))[1];
        const sensorY = +(sensorCoords[1].split('='))[1];
        if (sensorX < this.minX) {
            this.minX = sensorX;
        }
        if (sensorY < this.minY) {
            this.minY = sensorY;
        }
        if (sensorX > this.maxX) {
            this.maxX = sensorX;
        }
        if (sensorY > this.maxY) {
            this.maxY = sensorY;
        }
        this.sensorCoords.push({ x: sensorX, y: sensorY });

        const beaconCoords = coordsList[1].split(',');
        const beaconX = +(beaconCoords[0].split('='))[1];
        const beaconY = +(beaconCoords[1].split('='))[1];
        if (beaconX < this.minX) {
            this.minX = beaconX;
        }
        if (beaconY < this.minY) {
            this.minY = beaconY;
        }
        if (beaconX > this.maxX) {
            this.maxX = beaconX;
        }
        if (beaconY > this.maxY) {
            this.maxY = beaconY;
        }
        this.beaconCoords.push({ x: beaconX, y: beaconY });
        const m = (Math.abs(sensorX - beaconX)) + (Math.abs(sensorY - beaconY));
        if (((sensorY - m) > this.maxCheckRow) || ((sensorX - m) > this.maxCheckCol)) {
            this.sensorCoords.pop();
        } else {
            const rangeLoc = this.manhattan.length;
            this.manhattan.push(m);
            const manhattanRange = new Map();
            let mapIndex = 0;
            for (let i = m - 1; i > 0; i--) {
                manhattanRange.set(mapIndex, i);
                mapIndex++;
                // console.log(`Map test ${m} map value = ${manhattanRange.get(m)}`);
            }
            this.manhattanRange.set(rangeLoc, manhattanRange);
        }
    }

    createDeviceGrid() {
        this.xTrueOffset = this.minX < 0 ? -1 * this.minX : 0;
        this.yTrueOffset = this.minY < 0 ? -1 * this.minY : 0;

        this.xOffset = 0;
        this.yOffset = 0;
    }

    setBeaconRangeIndicator(x, y) {
        // if (x < 0  || x > (this.maxX + this.xOffset) || y < 0 || y > (this.maxY + this.yOffset)){
        //     // console.log(`not processing ${x}, ${y}`);
        //     return;
        // }
        // console.log(`******* processing ${x}, ${y}`);

        // if (y === this.rowOfInterest) {
        // const hasSensorAtLocation = this.sensorCoords.some(s => {
        //     return ((s.x === x) && (s.y === y));
        // });
        // const hasDeviceAtLocation = hasSensorAtLocation || this.beaconCoords.some(s => {
        //     return ((s.x === x) && (s.y === y));
        // });
        // if (!hasDeviceAtLocation) {
        const item = `${x}_${y}`;
        if (!this.results.has(item)) {
            this.results.add(item);
        }
        // }
        // }
    }

    addToResults(item) {
        if (item === '928237_497181') {
            console.log('Debug stop');
        }

        if (!this.results.has(item)) {
            this.results.add(item);
        }
    }

    setNoCloseBeaconInRangeState({ x, y }, inManhattan, manhattanRange) {
        const manhattan = inManhattan < this.maxCheckRow ? inManhattan : this.maxCheckRow;
        if ((x <= this.maxCheckCol) && (x >= this.minCheckCol)) {
            if ((y <= this.maxCheckRow) && (y >= this.minCheckRow)) {
                if ((y - manhattan) <= this.rowOfInterest) {
                    //continue...
                } else {
                    return;
                }
            } else {
                if ((y + manhattan) >= this.rowOfInterest) {
                    //continue...
                } else {
                    return;
                }
            }
            // this.setBeaconRangeIndicator(x, y - manhattan)
            if ((y-manhattan) === this.rowOfInterest && (y - manhattan >= 0) && (y - manhattan <= this.maxCheckRow)) {
                const item = `${x}_${y - manhattan}`;
                this.addToResults(item);
            }

            // const manhattanRange = new Map();
            // let mapIndex = 0;
            // for (let m = manhattan - 1; m > 0; m--) {
            //     manhattanRange.set(mapIndex, m);
            //     mapIndex++;
            //     // console.log(`Map test ${m} map value = ${manhattanRange.get(m)}`);
            // }
            // console.log({manhattan, manhattanRange});
            let j1 = 1;
            while ((j1 < manhattan) && ((y - j1) >= this.rowOfInterest)) {

                // for (let j = 1; j < manhattan; j++) {
                if ((y - j1 === this.rowOfInterest)) {
                    const xRange = manhattanRange.get(j1 - 1);

                    let i = (-1 * x);
                    let done = false;
                    while (i <= xRange && !done) {
                        if ((x + i > this.maxCheckCol) || ((y - j1) > this.maxCheckRow) || ((y - j1) < 0)) {
                            done = true;
                        } else {
                            const item = `${x + i}_${y - j1}`;
                            this.addToResults(item);
                            i++;
                        }
                    }


                    // for (let i = (-1 * xRange); i <= xRange; i++) {
                    //     // this.setBeaconRangeIndicator(x + i, y - j);
                    //     const item = `${x+i}_${y-j}`;
                    //     if (!this.results.has(item)) {
                    //         this.results.add(item);
                    //     }
                    // }
                }
                j1++;
            }

            if ((y === this.rowOfInterest)) {

                let i = x - manhattan;
                if (i < 0) i = 0;
                let done2 = false;
                while (i <= (x + manhattan) && !done2) {
                    if ((i > this.maxCheckCol) || ((y) > this.maxCheckRow) || ((y - j) < 0)) {
                        done2 = true;
                    } else {
                        const item = `${i}_${y}`;
                        this.addToResults(item);
                        i++;
                    }
                }


                // for (let i = x - manhattan; i <= x + manhattan; i++) {
                //     // this.setBeaconRangeIndicator(i, y);
                //     const item = `${i}_${y}`;
                //     if (!this.results.has(item)) {
                //         this.results.add(item);
                //     }
                // }
            }

            let j = 1;
            while ((j < manhattan) && ((y + j) <= this.rowOfInterest)) {
                // for (let j = 1; j < manhattan; j++) {
                if ((y + j === this.rowOfInterest)) {
                    const xRange = manhattanRange.get(j - 1);

                    let i = (-1 * x);
                    let done1 = false;
                    while (i <= xRange && !done1) {
                        if ((x + i > this.maxCheckCol) || ((y + j) > this.maxCheckRow)) {
                            done1 = true;
                        } else {
                            const item = `${x + i}_${y + j}`;
                            this.addToResults(item);
                            i++;
                        }
                    }


                    // for (let i = (-1 * xRange); i <= xRange; i++) {
                    //     // this.setBeaconRangeIndicator(x + i, y + j);
                    //     const item = `${x + i}_${y + j}`;
                    //     if (!this.results.has(item)) {
                    //         this.results.add(item);
                    //     }
                    // }
                }
                j++;
            }
            // this.showResults();

            // this.setBeaconRangeIndicator(x, y + manhattan);
            if ((y + manhattan) === this.rowOfInterest && (y + manhattan >= 0) && (y + manhattan <= this.maxCheckRow)) {
                const item1 = `${x}_${y + manhattan}`;
                this.addToResults(item1);
            }

        }
        // console.log(`sensor at ${x}, ${y}`);

    }

    setNoBeaconsCoverageForSensors() {
        console.log({ manhattan: this.manhattan, sensors: this.sensorCoords.length });
        //let prvSet = null;
        let startRow = 0;
        let endRow = this.maxCheckRow;
        if (process.argv.length > 2) {
            startRow = +process.argv[2];
            if (process.argv.length > 3)
                endRow = +process.argv[3];
        }
        console.log({ startRow, endRow });
        for (let row = startRow; row <= endRow; row++) {
            this.rowOfInterest = row;
            this.sensorCoords.forEach((s, index) => {
                this.setNoCloseBeaconInRangeState(s, this.manhattan[index], this.manhattanRange.get(index));
            })
            console.log({ resultsLen: this.results.size });
            if (this.results.size < (this.maxCheckCol + 1)) {
                for (let col = this.minCheckCol; col <= this.maxCheckCol; col++) {
                    // const hasSensorAtLocation = this.sensorCoords.some(s => {
                    //     return ((s.x === col) && (s.y === row));
                    // });
                    // const hasDeviceAtLocation = hasSensorAtLocation || this.beaconCoords.some(s => {
                    //     return ((s.x === col) && (s.y === row));
                    // });
                    // if (!hasDeviceAtLocation) {
                    const checkVal = `${col}_${row}`;
                    if (!this.results.has(checkVal)) {
                        console.log(`row ${row}: Can't find ${checkVal}`);
                        console.log(`Frequency = (${col} * 4000000) + ${row} = ${(col * 4000000) + row}`);
                        this.done = true;
                        process.exit(0);
                    }
                    // }
                }
            }
            console.log(`${row}`);
            // if (prvSet !== null) {
            //     let difference = new Set(
            //         [...this.results].filter(x => !prvSet.has(x)));
            //     console.log({ difference });
            // }
            // prvSet = new Set(this.results);
            this.results = new Set();
        }
        // this.resultsList.forEach((l, index) => {
        //     let o = '';
        //     l.forEach(i => {
        //         o = `${o} ${i}`;
        //     })
        //     console.log(`len: ${l.size}: index: ${index} ${o}`);
        // })
        // this.resultsList.forEach((l, index) => {
        //     for (let col = this.minCheckCol; col <= this.maxCheckCol; col++) {
        //         const hasSensorAtLocation = this.sensorCoords.some(s => {
        //             return ((s.x === col) && (s.y === row));
        //         });
        //         const hasDeviceAtLocation = hasSensorAtLocation || this.beaconCoords.some(s => {
        //             return ((s.x === col) && (s.y === row));
        //         });
        //         if (!hasDeviceAtLocation) {
        //             const checkVal = `${col}_${row}`;
        //             if (!this.results.has(checkVal)) {
        //                 console.log(`row ${row}: Can't find ${checkVal}`);
        //                 console.log(`Frequency = (${col} * 4000000) + ${row}`);
        //             }
        //         }
        //     }
        // })
    }

    processSensorLine(text) {
        if (this.finishedProcessing(text)) {
            this.createDeviceGrid();
            this.setNoBeaconsCoverageForSensors();
            this.showResults();
        } else {
            this.addSensorAndBeacon(text);
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


