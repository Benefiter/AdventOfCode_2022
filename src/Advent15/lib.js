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
        this.empty = '.';
        this.deviceGrid = [];
        this.xOffset = 0;
        this.yOffset = 0;
        this.sensor = 'S';
        this.beacon = 'B';
    }

    showResults() {
        console.log({minx: this.minX, miny: this.minY, maxx: this.maxX, maxy: this.maxY, xOffset: this.xOffset, yOffset: this.yOffset});
        this.deviceGrid.forEach((r,index) => {
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

    addSensorAndBeacon(text){
        //Sensor at x=2, y=18: closest beacon is at x=-2, y=15
        const coordsList = text.replace(/Sensor at /gi, '').replace(/ closest beacon is at /gi,'').split(':');
        const sensorCoords = coordsList[0].split(',');
        const sensorX = +(sensorCoords[0].split('='))[1];
        const sensorY = +(sensorCoords[1].split('='))[1];
        if (sensorX < this.minX){
            this.minX = sensorX;
        }
        if (sensorY < this.minY){
            this.minY = sensorY;
        }
        if (sensorX > this.maxX){
            this.maxX = sensorX;
        }
        if (sensorY > this.maxY){
            this.maxY = sensorY;
        }
        this.sensorCoords.push({x: sensorX, y: sensorY});

        const beaconCoords = coordsList[1].split(',');
        const beaconX = +(beaconCoords[0].split('='))[1];
        const beaconY = +(beaconCoords[1].split('='))[1];
        if (beaconX < this.minX){
            this.minX = beaconX;
        }
        if (beaconY < this.minY){
            this.minY = beaconY;
        }
        if (beaconX > this.maxX){
            this.maxX = beaconX;
        }
        if (beaconY > this.maxY){
            this.maxY = beaconY;
        }
        this.beaconCoords.push({x: beaconX, y: beaconY});
    }

    populateGridWithDevices(){
        this.sensorCoords.forEach(c => {
            const {x, y} = c;
            this.deviceGrid[y+this.yOffset][x+this.xOffset] = this.sensor;
        })
        this.beaconCoords.forEach(c => {
            const {x, y} = c;
            this.deviceGrid[y+this.yOffset][x+this.xOffset] = this.beacon;
        })
    }

    createDeviceGrid(){
         this.xOffset = this.minX < 0 ? -1 * this.minX : 0;
         this.yOffset = this.minY < 0 ? -1 * this.minY : 0;

        let deviceRow = [];
        for (let x = (this.minX + this.xOffset); x <= (this.maxX + this.xOffset); x++){
            deviceRow.push(this.empty);
        }

        for (let y = (this.minY + this.yOffset); y <= (this.maxY + this.yOffset); y++){
            this.deviceGrid.push([...deviceRow]);
        }
    }

    processSensorLine(text) {
        if (this.finishedProcessing(text)) {
            this.createDeviceGrid();
            this.populateGridWithDevices();
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


