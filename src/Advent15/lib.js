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
        this.deviceGrid.forEach((r, index) => {
            let row = '';
            r.forEach(c => {
                row += c;
            })
            console.log(`row${index} ${row}`);
        })
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

        this.xOffset = 100;
        this.yOffset = 100;

        let deviceRow = [];
        for (let x = 0; x <= (this.maxX + (2 * this.xOffset)); x++) {
            deviceRow.push(this.empty);
        }

        for (let y = 0; y <= (this.maxY + (2 * this.yOffset)); y++) {
            this.deviceGrid.push([...deviceRow]);
        }
    }

    setBeaconRangeIndicator(x, y) {
        // if (x < 0  || x > (this.maxX + this.xOffset) || y < 0 || y > (this.maxY + this.yOffset)){
        //     // console.log(`not processing ${x}, ${y}`);
        //     return;
        // }
        // console.log(`******* processing ${x}, ${y}`);

        if (this.deviceGrid[y][x] === this.empty) {
            this.deviceGrid[y][x] = this.noBeaconInDeviceRange;
            // console.log(`set ${x},${y} to ${this.deviceGrid[y][x]}`);
        }
    }

    setNoCloseBeaconInRangeState({ x, y }, manhattan) {
        this.setBeaconRangeIndicator(x, y - manhattan)
        this.showResults();
        const manhattanRange = [];
        for (let m = manhattan - 1; m > 0; m--) {
            manhattanRange.push(m);
        }
        // console.log({manhattan, manhattanRange});
        for (let j = 1; j < manhattan; j++) {
            const xRange = manhattanRange[j - 1];
            for (let i = (-1 * xRange); i <= xRange; i++) {
                this.setBeaconRangeIndicator(x + i, y - j);
            }
        }
        this.showResults();

        for (let i = x - manhattan; i <= x + manhattan; i++) {
            this.setBeaconRangeIndicator(i, y);
        }

        this.showResults();

        for (let j = 1; j < manhattan; j++) {
            const xRange = manhattanRange[j - 1];
            for (let i = (-1 * xRange); i <= xRange; i++) {
                this.setBeaconRangeIndicator(x + i, y + j);
            }
        }
        // this.showResults();

        this.setBeaconRangeIndicator(x, y + manhattan);

        this.showResults();
        console.log(`sensor at ${x}, ${y}`);

    }

    adjustSensorLocations() {
        return [...this.sensorCoords].map(s => ({ x: s.x + this.xOffset, y: s.y + this.yOffset }));
    }

    setNoBeaconsCoverageForSensors() {
        const listAdjusted = this.adjustSensorLocations();
        listAdjusted.forEach((s, index) => {
            this.setNoCloseBeaconInRangeState(s, this.manhattan[index]);
        })
    }

    processSensorLine(text) {
        if (this.finishedProcessing(text)) {
            // console.log({manhattanVals: this.manhattan});
            this.createDeviceGrid();
            this.populateGridWithDevices();
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
module.exports.Solution1 = Solution1;


