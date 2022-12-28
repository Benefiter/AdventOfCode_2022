const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

class Solution1 {
    constructor() {
        this.originalSequence = [];
        this.mixedSequence = [];
    }

    showResults() {
        console.log({originalSequence: this.originalSequence, mixedSequence: this.mixedSequence, groveCoords: this.groveCoords});
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }


    processText(text) {
        this.originalSequence.push({val: +text, id: this.originalSequence.length + 1});
    }

    mixSequence(){
        const sl = this.originalSequence.length;
        this.originalSequence.forEach((i) => {
            const indexOfCurrent = this.mixedSequence.findIndex(m => ((m.val === i.val) && (m.id === i.id)));
            //                  *
            // 1, 2, -21, 4, 5, 6, 7, 8, 9, 10, 11, 12 // move -21 = move it -(21 % list_length)
            // 1, 2, 33, 4, 5, 6, 7, 8, 9, 10, 11, 12 // move + 21 = move it  +(33 % list_length)
            //                                      *
            // 1, 2, 7, 10, 5, 6, 7, 8, 9, 10, 11, 12 // move 10 => 10 < list_length and overflows end => move to after digit (list_length % 10).
            // 1, 2, 7, -10, 5, 6, 7, 8, 9, 10, 11, 12 // move -10 => -10 > list length from start => move before digit +(list_length % -10) ahead of -10
            const s = i.val;
            if (s > 0){
                if ((s + indexOfCurrent) > sl){
                    const itemFromFrontToInsertAfter = ((s+indexOfCurrent) % sl);
                    this.mixedSequence.splice( indexOfCurrent, 1);
                    this.mixedSequence.splice(itemFromFrontToInsertAfter,0, {...i});
                }else{
                    this.mixedSequence.splice(indexOfCurrent,1);
                    this.mixedSequence.splice(indexOfCurrent + s, 0, {...i});
                }
            } else {
                if ((s + indexOfCurrent) < 0){
                    const itemFromFrontToInsertBefore = (((s + indexOfCurrent) * -1) % sl);
                    this.mixedSequence.splice( indexOfCurrent, 1);
                    this.mixedSequence.splice(itemFromFrontToInsertBefore + 1, 0, {...i});
                }else{
                    this.mixedSequence.splice(indexOfCurrent,1);
                    this.mixedSequence.splice(indexOfCurrent + s, 0, {...i});
                }
            }
        })
    }

    findCoords(){
        const list = this.mixedSequence;
        const listLength = list.length;
        // 1, 2, -3, 4, 0, 3, -2
        // Then, the grove coordinates can be found by looking at the 1000th, 2000th, and 3000th numbers after the value 0,
        // wrapping around the list as necessary. In the above example, the 1000th number after 0 is 4, the 2000th is -3,
        // and the 3000th is 2; adding these together produces 3.
        const indexOfZero = list.findIndex(m => m.val === 0);
        const mod1000 = ((1000 + indexOfZero)) % listLength;
        const mod2000 = ((2000 + indexOfZero)) % listLength;
        const mod3000 = ((3000 + indexOfZero)) % listLength;
        const fourthAfter0 = list[mod1000].val;
        const fifthAfter0 = list[mod2000].val;
        const sixthAfter0 = list[mod3000].val;
        this.groveCoords = fourthAfter0 + fifthAfter0 + sixthAfter0;
    }
    process(text) {
        if (this.finishedProcessing(text)) {
            this.mixedSequence = [...this.originalSequence];
            this.mixSequence();
            this.findCoords();
            this.showResults();
        } else {
            this.processText(text);
        }
    }
}

module.exports.getFileReader = getFileReader;
module.exports.Solution1 = Solution1;


