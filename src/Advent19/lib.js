const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

// Blueprint 1:
// Each ore robot costs 4 ore.
//     Each clay robot costs 2 ore.
//     Each obsidian robot costs 3 ore and 14 clay.
//     Each geode robot costs 2 ore and 7 obsidian.

class BluePrint {
    constructor(number, ore, clay, obsidian, geode) {
        this.number = number;
        this.ore = ore;
        this.clay = clay;
        this.obsidian = obsidian;
        this.geode = geode;
    }

    show(){
        console.log({id: this.number, ore: this.ore, clay: this.clay, obsidian: this.obsidian, geode: this.geode});
    }

}
class Solution1 {
    constructor() {
        this.bluePrints = [];
    }

    showResults() {
        this.bluePrints.forEach(bp => bp.show());
    }


    finishedProcessing(text) {
        return text.startsWith('end');
    }


    processText(text) {
        const data = text.split(':');
        const bluePrintId = +data[0].replace('Blueprint ', '');
        const robotData =  data[1].split('.');
        const oreRobotCost = +((robotData[0].replace(' Each ore robot costs ', '')).split(' ')[0]);
        const clayRobotCost = +((robotData[1].replace(' Each clay robot costs ', '')).split(' ')[0]);
        const obsidianRobotCost =  (robotData[2].replace(' Each obsidian robot costs ', '')).split(' ');
        const obsidian = {ore: +obsidianRobotCost[0], clay: +obsidianRobotCost[3]};
        const geodeRobotCost = (robotData[3].replace(' Each geode robot costs ', '')).split(' ');
        const geode = {ore: +geodeRobotCost[0], obsidian: +geodeRobotCost[3]};

        this.bluePrints.push(new BluePrint(bluePrintId, {ore: oreRobotCost}, {ore: clayRobotCost}, obsidian, geode ))
    }

    process(text) {
        if (this.finishedProcessing(text)) {
            this.showResults();
        } else {
            this.processText(text);
        }
    }
}

module.exports.getFileReader = getFileReader;
module.exports.Solution1 = Solution1;


