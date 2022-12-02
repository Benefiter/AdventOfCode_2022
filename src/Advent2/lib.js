const rocks = ['A', 'X'];
const papers = ['B', 'Y'];
const scissors = ['C', 'Z'];
const loose = 0;
const draw = 3;
const win = 6;
const rock = 1;
const paper = 2;
const scissor = 3;

const arbitrateScore = (first, second) => {
    if (first === 'rock' && second === 'rock'){
        return draw + rock;
    }
    if (first === 'rock' && second === 'paper'){
        return win + paper;
    }
    if (first === 'rock' && second === 'scissor'){
        return loose + scissor;
    }

    if (first === 'paper' && second === 'rock'){
        return loose + rock;
    }
    if (first === 'paper' && second === 'paper'){
        return draw + paper;
    }
    if (first === 'paper' && second === 'scissor'){
        return win + scissor;
    }

    if (first === 'scissor' && second === 'rock'){
        return win + rock;
    }
    if (first === 'scissor' && second === 'paper'){
        return loose + paper;
    }
    if (first === 'scissor' && second === 'scissor'){
        return draw + scissor;
    }
}

module.exports.arbitrateScore = arbitrateScore;
module.exports.loose = loose;
module.exports.draw = draw;
module.exports.win = win;
module.exports.rock = rock;
module.exports.paper = paper;
module.exports.scissor = scissor;
module.exports.rocks = rocks;
module.exports.papers = papers;
module.exports.scisssors = scissors;