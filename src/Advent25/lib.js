const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

class Solution1 {
    constructor() {
        this.fuelData = [];
        this.range= [-2, -1, 0, 1, 2];
        this.result = 0;
        this.ittCount = 0;
    }

    inc(result, i){
        if (result[i] < 2){
            result[i]++;
            return false;
        } else {
            return true;
        }
    }

    adjust(result){
        let i;
        let done = false;
        for (i = result.length - 1; i >=0 && !done; i--){
            if (result[i] > 2){
                done = true;
            }
        }
        done = false;
        let incPending = false;
        if (++i >= 0){
            while (i >= 0  && !done){
                if ((result[i-1] != null) && result[i] > 2){
                    result[i] = 0;
                    incPending = incPending ? incPending && this.inc(result, i-1) : this.inc(result, i-1);
                    i--;
                } else {
                    if (result[i-1] == null){
                        done = true;
                        if (this.inc(result, i)){
                            result.unshift(1);
                        }
                    }else{
                        if (incPending){
                            incPending = this.inc(result, i);
                        }
                        i--;
                    }
                }
            }
        }
        console.log({result});
        return result;
    }

    getDecFromSNAFU(result){
        return [...result].reverse().reduce((acc, curr, index) => {
            acc = acc + ((curr * (5 ** index)));
            return acc;
        }, 0);
    }

    doRange(result, index, sum){
        if ((index < result.length) && !this.done) {
            this.range.forEach(r => {
                if ([0,1,2,3, 4].includes(index)){
                    // Do nothing for first 3 preset elements
                } else {
                    result[index] = r;
                }
                const calcedSum = this.getDecFromSNAFU(result);

                if (calcedSum > sum){
                    console.log("********Greater than sum******");
                    console.log({calcedSum, sum, result});
                }
                if (this.ittCount % 10000000 === 0){
                    console.log({calcedSum, sum, result});
                }
                this.ittCount++;
                if (calcedSum === sum){
                    this.done = true;
                    this.result = [...result];
                }
                this.doRange(result, index+1, sum);
            })
        }
    }
    genSNAFUFrom(result, sum){
        const dec = this.getDecFromSNAFU(result);
        if (dec === sum) {
            console.log({result, dec, sum});
            throw new Error('genSNAFUFrom has failed!!');
        }

        this.doRange(result, 0, sum);
    }

    getSNAFU(sum){
        let done = false;
        let index = 0;
        while (!done){
            if ((5 ** index) <= sum){
                index++;
            } else {
                index--;
                done = true;
            }
        }

        let rem = sum;
        let result = [];
        for (let s = index; s >= 0; s--){
            const divisor = (5 ** s);
            if (rem >= divisor) {
                const digit = Math.floor(rem / divisor);
                result.push(digit);
                rem = rem - (digit * divisor);
            } else {
                result.push(0);
            }
        }
        // result = this.adjust(result, rem, sum);
        // // result = [2, -2, -1, 0, -2, -1, 2,
        // //     2,  -2,  2, 1, -2,  0,  2,
        // //     2,  2,  2, 2,  1,  1];

        result = [2, -2, -1, 0, -2, 0, 2,
            2,  2,  2, 1, 2,  2,  2,
            2,  2,  2, 2,  2,  2];
        this.genSNAFUFrom(result, sum);
        // while (true){
        //     //29694520452605
        //     //29696456289056
        //
        //     //29598999023375
        //     //let val = [2,-2,-1, -1, 0, -1, 2, 2, 2,2,2, 2, 2, 2, 2, 2, 2, 0, 0, 0]
        //
        //     //29751586914000
        //     //let val = [2,-2,-1, 0, 0, -1, 2, 2, 2,2,2, 2, 2, 2, 2, 2, 2, 0, 0, 0]
        //
        //
        //     //29745483399000
        //     //let val = [2,-2,-1, 0, 0, -1, -2, -2, -2,-2,-2, -2, -2, -2, -2, -2, 2, 0, 0, 0]
        //
        //     //29690551758375
        //     // let val = [2,-2,-1, 0, -2, 0, -2, -2, -2,-2,-2, -2, -2, -2, -2, -2, 2, 0, 0, 0]
        //     // let val = [2,-2,-1, 0, -2, 0, -2, -2, -2,-2,-2, -2, -2, -2, -2, -2, 2, 0, 0, 0]
        //
        //     //29686104726556
        // //     2, -2, -1, 0, -2, -1, -1,
        // //         -1,  1,  2, 1, -2,  0,  2,
        // //         2,  2,  2, 2,  1,  1
        // // ];
        //     let val =     [
        //         2, -2, -1, 0, -2, 0, 2,
        //             2,  -2,  2, 1, -2,  0,  2,
        //             2,  2,  2, 2,  1,  1
        //         ];
        //
        // //     2, -2, -1, 0, -2, 2, 2,
        // //         2,  -2,  2, 1, -2,  0,  2,
        // //         2,  2,  2, 2,  1,  1
        // // ];
        //     //let val = [2,-2,-1, -1, 0, -1, 2, 2, 2,2,2, 2, 2, 2, 2, 2, 2, 0, 0, 0]
        //     console.log(this.getDecFromSNAFU(val, sum));
        //     val = [1,2,2, 2, 0, 0, 0, 0, 0,0,0, 0, 0, 0, 0, 0, 1, 0, 1, 0]
        //     console.log(this.getDecFromSNAFU(val, sum));
        //     val = [1,-2,2, 2, 0, 0, 1, 0, 0,0,0, 2, 2, 0, 0, 0, 1, 0, 1, 0]
        //     console.log(this.getDecFromSNAFU(val, sum));
        //     val = [1,-2,2, 2, 2, 0, 1, 0, 0,0,0, 2, 2, 0, 0, 0, 1, 0, 1, 0]
        //     console.log(this.getDecFromSNAFU(val, sum));
        //     val = [1,-2,2, 2, 2, 2, 1, 0, 0,0,0, 2, 2, 0, 0, 0, 1, 0, 1, 0]
        //     console.log(this.getDecFromSNAFU(val, sum));
        //     val = [1,-2,2, 2, 2, 2, 2, 2, 0,0,0, 2, 2, 0, 0, 0, 1, 0, 1, 0]
        //     console.log(this.getDecFromSNAFU(val, sum));
        //     val = [1,-2,2, 2, 2, 2, 2, 2, 2,0,0, 2, 2, 0, 0, 0, 1, 0, 1, 0]
        //     console.log(this.getDecFromSNAFU(val, sum));
        //     val = [1,-2,2, 2, 2, 2, 2, 2, 2,2,0, 2, 2, 0, 0, 0, 1, 0, 1, 0]
        //     console.log(this.getDecFromSNAFU(val, sum));
        //     val = [1,-2,2, 2, 2, 2, 2, 2, 2,2,0, 2, 2, 0, 0, 0, 1, 0, 1, 0]
        //     console.log(this.getDecFromSNAFU(val, sum));
        //     val = [1,-2,2, 2, 2, 2, 2, 2, 2,2,0, 2, 2, 0, 0, 0, 1, 0, 1, 0]
        //     // console.log(this.getDecFromSNAFU(val, sum));
        //
        // }
    }

    showResults() {
        const sum = this.fuelData.reduce((acc, curr) => {
            acc += curr.finalValue;
            return acc;
        }, 0);
        this.getSNAFU(sum);
        console.log({sum, result: this.result});
    }

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    processText(text) {
        let initValue = text.split('');
        initValue = initValue.map(v => {
            if (v === '=') {
                return -2;
            }
            if (v === '-') {
                return -1;
            }
            return +v;
        })
        const reversedInitValue = [...initValue].reverse();
        const finalValue = reversedInitValue.reduce((acc, curr, index) => {
            acc += ((5 ** (index)) * +curr);
            return acc;
        }, 0);
        this.fuelData.push({initValue, finalValue});
    }

    process(text) {
        if (this.finishedProcessing(text)) {
            console.log(this.range);
            this.showResults();
        } else {
            this.processText(text);
        }
    }
}

module.exports.getFileReader = getFileReader;
module.exports.Solution1 = Solution1;


