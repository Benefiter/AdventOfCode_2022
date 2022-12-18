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
        this.valveState = [] // {isOpen: bool, minuteOpened, totalPressureReleased: 0};
        this.valveStates = [];
        this.paths = [['AA']];
        this.initialTimeMax = 18;
        this.maxTime = 30;
        this.maxPressureReleased = 0;
        this.currentExecution = [];
        this.currentValvesOpened = [];
        this.maxPressurePath = [];
    }

    showResults() {
        console.log({path: this.maxPressurePath});
        console.log({maxPressureReleased: this.maxPressureReleased});
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    processValve(text) {
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

    findBestPressure() {

    }

    setInitialPaths(time) {
        const newPaths = [];
        this.paths.forEach(x => {
            const nextPaths = this.valveSystem.get(x[x.length - 1]).otherTunnels;
            nextPaths.forEach(i => {
                const newPath = [...x]
                newPath.push(i);
                newPaths.push(newPath);
            })
        })
        this.paths = newPaths;
        if (time < this.initialTimeMax) {
            time++;
            this.setInitialPaths(time);
        }
    }

    addRemainingPaths(initialTime) {
        const updatedPaths = [];
        this.currentNewPaths.forEach(x => {
            const nextPaths = this.valveSystem.get(x[x.length - 1]).otherTunnels;
            nextPaths.forEach(i => {
                const newPath = [...x]
                newPath.push(i);
                updatedPaths.push(newPath);
            })
        })

        this.currentNewPaths = [...updatedPaths];
        if (initialTime < this.maxTime) {
            this.addRemainingPaths((initialTime + 1));
        }
    }

    calcPressures(path) {
        let time = 1;
        let pathIndex = 0;
        let state = 'open';
        this.currentValvesOpened = [];
        this.currentExecution = [];
        while (time < this.maxTime) {
            switch (state) {
                case 'open':
                    const valve = this.valveSystem.get(path[pathIndex]);
                    if (this.currentValvesOpened.includes(valve.name)) {
                        state = 'move';
                    } else if (valve.flowRate > 0) {
                        time++;
                        this.currentValvesOpened.push(valve.name);
                        this.currentExecution.push(valve.flowRate * (this.maxTime - time));
                        state = 'move';
                    } else {
                        state = 'move';
                    }
                    break;
                case 'move':
                    pathIndex++;
                    time++;
                    state = 'open';
                    break;
                default:
                    console.log(`Unknown state ${state}`);
                    break;
            }
        }
        const totalPressReleased = this.currentExecution.reduce((acc, curr) => {
            acc += curr;
            return acc;
        }, 0)
        if (this.maxPressureReleased < totalPressReleased) {
            this.maxPressureReleased = totalPressReleased;
            this.maxPressurePath = path;
            console.log({maxSoFar: totalPressReleased});
        }
    }

    findAllPaths() {
        // Find all possible paths in 30 minutes all starting from AA
        let startTime = 1;
        this.setInitialPaths(startTime);
        this.paths.forEach(p => {
            this.currentNewPaths = [[...p]];
            this.addRemainingPaths(this.initialTimeMax,);
            this.currentNewPaths.forEach(tip => this.calcPressures(tip));
        })
    }

    processValveData(text) {
        if (this.finishedProcessing(text)) {
            this.findAllPaths();
            this.findBestPressure();
            this.showResults();
        } else {
            this.processValve(text);
        }
    }
}

module
    .exports
    .getFileReader = getFileReader;
module
    .exports
    .Solution1 = Solution1;


