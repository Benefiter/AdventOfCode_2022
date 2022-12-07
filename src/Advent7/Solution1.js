const { getFileReader } = require('./lib');
const user_file = './commands.data';
const r = getFileReader(user_file);
const rootFolder = {
    name: '/',
    files: [],
    folders: [],
    parentFolder: null,
}
const maxFolderSize = 100000;
let currentFolder = rootFolder;
let parentFolder = null;
let currentCommand = null;
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

r.on('line', function (text) {
    if (text.startsWith('end')) {
        calcFolderSizes(rootFolder);
        print(rootFolder);
        console.log({result: calcSumFoldersSmallerThanMaxFolderSize(rootFolder)});
        // console.log(rootFolder);
    } else {
        if (text.startsWith('$')){
            // process command ls or cd or
            const command = text.split(' ');
            console.log({command});
            switch (command[1]){
                case 'cd':
                    currentCommand = 'cd';
                    const folder = command[2];
                    if (folder === '..') {
                        currentFolder = currentFolder.parent;
                        parentFolder = currentFolder.parent;
                    }
                    else if (folder === '/') {
                        currentFolder = rootFolder;
                        parentFolder = null;
                    } else {
                        parentFolder = currentFolder;
                        currentFolder = parentFolder.folders.find(f => f.name === folder);
                        if (!currentFolder) {
                            currentFolder = {name: folder, files: [], folders: [], parent: parentFolder};
                            parentFolder.folders.push(currentFolder);
                        }
                    }
                    break;
                case 'ls':
                    currentCommand = 'ls';
                    break;
                default:
                    console.log('unknown command');
                    break;
            }
        } else {
            if (currentCommand === 'ls'){
                const lsLine = text.split(' ');
                if (lsLine[0] === 'dir') {
                    const f = currentFolder.folders.find((f) => f.name === lsLine[1]);
                    if (!f){
                        currentFolder.folders.push({name: lsLine[1], folders: [], files: [], parent: currentFolder});
                    }
                } else {
                    const file = currentFolder.files.find((f) => f.name === lsLine[1]);
                    if (file){
                        file.size = lsLine[0];
                    } else {
                        currentFolder.files.push({name: lsLine[1], size: +lsLine[0]});
                    }
                }
            }
        }
    }
});
