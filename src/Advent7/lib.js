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
    const { name, files, folders, size: folderSize } = folder;
    console.log(`${padding} Directory: ${name} ${folderSize}`);
    files.forEach((file) => {
        const { name, size } = file;
        console.log(`${padding} ${name} ${size}`);
    });
    folders.forEach((f) => print(f, level + 1));
}
const calcFileTotal = (files) => {
    return files.reduce((acc, curr) => {
        acc += curr.size;
        return acc;
    }, 0);
}
const calcFolderSizes = (folder) => {
    folder.size = calcFileTotal(folder.files) + folder.folders.reduce((acc, curr) => {
        acc += calcFolderSizes(curr);
        return acc;
    }, 0);
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
        if (cur.size >= requiredSpaceToFreeUp) {
            acc.push(cur.size);
        }
        return acc;
    }, []);
};

class FolderData {
    constructor() {
        this.rootFolder = {
            name: '/',
            files: [],
            folders: [],
            parentFolder: null,
        }
        this.currentFolder = this.rootFolder;
        this.parentFolder = null;
        this.currentCommand = null;
    }

    showResults() {
        calcFolderSizes(this.rootFolder);
        // print(this.rootFolder);
        console.log({ result: calcSumFoldersSmallerThanMaxFolderSize(this.rootFolder) });
    }

    process(text) {
        if (text.startsWith('end')) {
            this.showResults();
        } else {
            if (text.startsWith('$')) {
                // process command ls or cd or
                const command = text.split(' ');
                // console.log({command});
                switch (command[1]) {
                    case 'cd':
                        this.currentCommand = 'cd';
                        const folder = command[2];
                        if (folder === '..') {
                            this.currentFolder = this.currentFolder.parent;
                            this.parentFolder = this.currentFolder.parent;
                        } else if (folder === '/') {
                            this.currentFolder = this.rootFolder;
                            this.parentFolder = null;
                        } else {
                            this.parentFolder = this.currentFolder;
                            this.currentFolder = this.parentFolder.folders.find(f => f.name === folder);
                            if (!this.currentFolder) {
                                this.currentFolder = {
                                    name: folder,
                                    files: [],
                                    folders: [],
                                    parent: this.parentFolder
                                };
                                this.parentFolder.folders.push(this.currentFolder);
                            }
                        }
                        break;
                    case 'ls':
                        this.currentCommand = 'ls';
                        break;
                    default:
                        console.log('unknown command');
                        break;
                }
            } else {
                if (this.currentCommand === 'ls') {
                    const lsLine = text.split(' ');
                    if (lsLine[0] === 'dir') {
                        const f = this.currentFolder.folders.find((f) => f.name === lsLine[1]);
                        if (!f) {
                            this.currentFolder.folders.push({
                                name: lsLine[1],
                                folders: [],
                                files: [],
                                parent: this.currentFolder
                            });
                        }
                    } else {
                        const file = this.currentFolder.files.find((f) => f.name === lsLine[1]);
                        if (file) {
                            file.size = lsLine[0];
                        } else {
                            this.currentFolder.files.push({ name: lsLine[1], size: +lsLine[0] });
                        }
                    }
                }
            }
        }
    }
}

class FolderData2 extends FolderData {
    constructor() {
        super();
        this.totalDiskSpace = 70000000;
        this.minSpaceForUpdate = 30000000;
    }

    showResults() {
        calcFolderSizes(this.rootFolder);
        // print(this.rootFolder);
        const usedSpace = this.rootFolder.size;
        const availableSpace = this.totalDiskSpace - usedSpace;
        const requiredSpaceToFreeUp = this.minSpaceForUpdate - availableSpace;
        console.log({usedSpace, availableSpace, requiredSpaceToFreeUp});
        const choices = determineSizeOfFolderToDelete(this.rootFolder, requiredSpaceToFreeUp);
        const result = choices.reduce((acc, cur) => {
            acc = cur < acc ? cur : acc;
            return acc;
        },Array.isArray(choices) ? choices[0] : 0);
        console.log({result});
    }
}
module.exports.getFileReader = getFileReader;
module.exports.FolderData = FolderData;
module.exports.FolderData2 = FolderData2;


