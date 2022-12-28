const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

class Solution1 {
    constructor() {
        this.valveSystem = new Map();
        this.paths = [{ valve: 'AA', time: 1, totalPressure: 0, openedValves: []}];
        this.maxTime = 30;
        this.maxPressureReleased = 0;
        this.maxPressurePath = [];
        this.pressurePaths = [];
    }

    showResults() {
        console.log({ path: this.maxPressurePath });
        console.log({ maxPressureReleased: this.maxPressureReleased });
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    addValve(text) {
        //Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
        let data = text.replace('tunnels', 'tunnel');
        data = data.replace('leads', 'lead');
        data = data.replace('valves', 'valve');

        let valveSystemItem = { name: '', flowRate: 0, otherTunnels: [] };
        const v = data.split(' has flow rate=');
        valveSystemItem.name = (v[0].split(' '))[1];
        const otherData = v[1].split('; tunnel lead to valve ');
        valveSystemItem.flowRate = +otherData[0];
        valveSystemItem.otherTunnels = otherData[1].split(', ');
        this.valveSystem.set(valveSystemItem.name, valveSystemItem);
    }

    calcPressure(pathSpec, nextValve, fm = false) {
        let forceMove = fm;
        let time = pathSpec.time;
        let totalPressure = pathSpec.totalPressure;
        const { openedValves } = pathSpec;

        const valve = this.valveSystem.get(nextValve);
        if (forceMove || openedValves.includes(valve.name)) {
            time++;
        } else if (valve.flowRate > 0) {
            time++;
            openedValves.push(nextValve);
            totalPressure += (valve.flowRate * (this.maxTime - time));
            time++;
        } else {
            time++;
        }

        if (this.maxPressureReleased < totalPressure) {
            this.maxPressureReleased = totalPressure;
            console.log({ maxSoFar: totalPressure });
        }
        pathSpec.time = time;
        pathSpec.totalPressure = totalPressure;
        pathSpec.openedValves = [...openedValves];
        pathSpec.valve = nextValve;

        if (time <= this.maxTime) {
            if (this.maxPressureReleased < totalPressure) {
                this.maxPressureReleased = totalPressure;
                console.log({ completedMaxPressureReleased: this.maxPressureReleased });
            }
            const nextPaths = this.valveSystem.get(nextValve).otherTunnels;
            nextPaths.forEach((i) => {
                let currPath = { ...pathSpec, openedValves: [...openedValves] };
                let currPath1 = { ...pathSpec, openedValves: [...openedValves] };
                let nv = i;
                while (this.calcPressure(currPath, nv)) {
                    // newPaths.push(newPath);
                }
                while (this.calcPressure(currPath1, nv, true)) {
                    // newPaths.push(newPath);
                }

                // console.log({completed: i});
            })
            return false;
        } else {
            return false;
        }
    }

    setupDistribution(paths) {
        if (paths.length > 0) {
            paths.forEach(x => {
                const { valve } = x;
                const nextPaths = this.valveSystem.get(valve).otherTunnels;
                nextPaths.forEach((i) => {
                    if (this.calcPressure(x, i)) {
                        // const newPath = { ...x, openedValves: [...x.openedValves] };
                        // this.pressurePaths.push([newPath]);
                    }
                    console.log({ doneOutterX: x, doneOutterI: i });
                })
            })
        }
    }

    processValveData(text) {
        if (this.finishedProcessing(text)) {
            this.setupDistribution(this.paths);
            // this.findBestPressure();
            this.showResults();
        } else {
            this.addValve(text);
        }
    }
}

module
    .exports
    .getFileReader = getFileReader;
module
    .exports
    .Solution1 = Solution1;


