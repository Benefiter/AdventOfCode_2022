const readline = require('readline');
const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

class Solution1 {
    constructor() {
        this.lists = [];
        this.listResults = [];
    }

    showResults() {
        const sumOfIndices = this.listResults.reduce((acc, curr, index) => {
            if (curr) {
                acc += (index + 1);
            }
            return acc;
        }, 0)
        console.log({ sumOfIndices });
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    buildListPairs(text) {
        this.lists.push(JSON.parse(text));
    }

    compareLists(l1, l2) {
        // console.log({ compareLists: '', l1, l2 });
        if (!Array.isArray(l1)) {
            if (!Array.isArray(l2)) {
                if (l1 === l2) return null;
                return (l1 < l2);
            } else {
                return this.checkListOrder([l1], l2);
            }
        } else {
            if (!Array.isArray(l2)) {
                return this.checkListOrder(l1, [l2]);
            } else {
                return this.checkListOrder(l1, l2);
            }
        }
    }

    checkListOrder(l1, l2) {
        // console.log({ checkListOrder: '', l1, l2 });
        let result = null;
        if (l1.length === l2.length || l1.length > l2.length) {
            l1.forEach((l, index) => {
                if (result === null) {
                    if (index >= l2.length) {
                        result = false;
                    } else {
                        const compList = l2[index];
                        result = this.compareLists(l, compList);
                    }
                }
            })
        } else {
            l2.forEach((l, index) => {
                if (result === null) {
                    if (index >= l1.length) {
                        result = true;
                    } else {
                        const compList = l1[index];
                        result = this.compareLists(compList, l);
                    }
                }
            })
        }
        return result;
    }

    compare(i) {
        const leftList = this.lists[i * 2];
        const rightList = this.lists[i * 2 + 1];
        this.listResults[i] = this.checkListOrder(leftList, rightList);
    }

    compareListPairs() {
        const size = this.lists.length / 2;
        for (let i = 0; i < size; i++) {
            this.compare(i);
        }
    }

    processListLine(text) {
        if (this.finishedProcessing(text)) {
            this.compareListPairs();
            this.showResults();
        } else {
            if (text !== '') {
                this.buildListPairs(text);
            }
        }
    }

}

class Solution2 extends Solution1 {
    constructor() {
        super();
        this.sortedList = [];
    }

    showResults1(){
        console.log({listLength: this.lists.length});
        this.sortedList.forEach(l => console.log(l));
        const firstIndex = this.sortedList.findIndex(l => JSON.stringify(l) === '[[2]]') + 1;
        const secondIndex = this.sortedList.findIndex(l => JSON.stringify(l) === '[[6]]') + 1;
        console.log({code: firstIndex * secondIndex});
    }

    sortList(){
        this.sortedList = this.lists.sort((b, a) => {
            const result =  this.checkListOrder(a, b) ? 1 : -1;
            console.log({a, b, result});
            return result;
        });
    }

    processListLine(text) {
        if (this.finishedProcessing(text)) {
            this.sortList();
            this.showResults1();
        } else {
            if (text !== '') {
                this.buildListPairs(text);
            }
        }
    }

}

module
    .exports
    .getFileReader = getFileReader;
module.exports.Solution1 = Solution1;
module.exports.Solution2 = Solution2;


