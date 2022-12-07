const maxFolderSize = 100000;

const getFileReader = (file) => {
    const f = require('fs');
    const readline = require('readline');
    return readline.createInterface({
        input: f.createReadStream(file)
    });
};

const print = (folder, level = 0) => {
    let padding = '';
    for (let i = 0; i < level; i++) {
        padding += '-';
    }
    const {name, files, folders, size: folderSize } = folder;
    console.log(`${padding} Directory: ${name} ${folderSize}`);
    files.forEach((file) => {
        const {name, size} = file;
        console.log(`${padding} ${name} ${size}`);
    });
    folders.forEach((f) => print(f, level+1));
}
const calcFileTotal = (files) => {
    return files.reduce((acc, curr) => {
        acc += curr.size;
        return acc;
    },0);
}
const calcFolderSizes = (folder) => {
    folder.size = calcFileTotal(folder.files) + folder.folders.reduce((acc, curr) => {
        acc += calcFolderSizes(curr);
        return acc;
    },0);
    return folder.size;
};
const calcSumFoldersSmallerThanMaxFolderSize = (folder) => {
    return folder.folders.reduce((acc, cur) => {
        acc += calcSumFoldersSmallerThanMaxFolderSize(cur);
        return acc;
    }, folder.size <= maxFolderSize ? folder.size : 0);
};

const determineSizeOfFolderToDelete = (folder, requiredSpaceToFreeUp) => {
    return folder.folders.reduce((acc, cur) => {
        acc = [...acc, ...determineSizeOfFolderToDelete(cur, requiredSpaceToFreeUp)];
        if (cur.size >= requiredSpaceToFreeUp){
            acc.push(cur.size);
        }
        return acc;
    }, []);
};

module.exports.getFileReader = getFileReader;
module.exports.print = print;
module.exports.calcFolderSizes = calcFolderSizes;
module.exports.calcSumFoldersSmallerThanMaxFolderSize = calcSumFoldersSmallerThanMaxFolderSize;
module.exports.determineSizeOfFolderToDelete = determineSizeOfFolderToDelete;


