const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

class Solution1 {
    constructor() {
    }

    showResults() {
        console.log('Not implemented');
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }


    processText(text) {
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


