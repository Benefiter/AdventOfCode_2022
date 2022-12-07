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

    finishedProcessing(text) {
        return text.startsWith('end');
    }

    isCommand(text) {
        return text.startsWith('$');
    }

    commandIsNavigateToParentFolder(cmd) {
        return cmd === '..';
    }

    isRootFolder(folder) {
        return folder === '/';
    }
    addFolder(name){
        this.parentFolder = this.currentFolder;
        this.currentFolder = this.parentFolder.folders.find(f => f.name === name);
        if (!this.currentFolder) {
            this.currentFolder = {
                name,
                files: [],
                folders: [],
                parent: this.parentFolder
            };
            this.parentFolder.folders.push(this.currentFolder);
        }
    }
    handleCDCommand(command) {
        this.currentCommand = 'cd';
        const folder = command[2];
        if (this.commandIsNavigateToParentFolder(folder)) {
            // cd ..
            this.currentFolder = this.currentFolder.parent;
            this.parentFolder = this.currentFolder.parent;
        } else if (this.isRootFolder(folder)) {
            // root folder
            this.currentFolder = this.rootFolder;
            this.parentFolder = null;
        } else {
            // add folder
            this.addFolder(folder)
        }
    }

    folderData(val) {
        return val === 'dir'
    }

    getFile(fileName) {
        return this.currentFolder.files.find((f) => f.name === fileName);
    }

    addFileStatToThisFolder(fileName, fileSize) {
        this.currentFolder.files.push({ name: fileName, size: fileSize });
    }

    getFolder(folderName) {
        return this.currentFolder.folders.find((f) => f.name === folderName);
    }

    addFolderStatToCurrentFolder(name) {
        this.currentFolder.folders.push({
            name,
            folders: [],
            files: [],
            parent: this.currentFolder
        });
    }

    handleLSOutput(text) {
        const lsLine = text.split(' ');
        if (this.folderData(lsLine[0])) {
            // folder data...
            const f = this.getFolder(lsLine[1]);
            if (!f) {
                this.addFolderStatToCurrentFolder(lsLine[1]);
            }
        } else {
            // file data...
            const file = this.getFile(lsLine[1]);
            if (file) {
                file.size = lsLine[0];
            } else {
                this.addFileStatToThisFolder(lsLine[1], +lsLine[0]);
            }
        }
    }

    processCommand(text) {
        // process command ls or cd or
        const command = text.split(' ');
        // console.log({command});
        switch (command[1]) {
            case 'cd':
                this.handleCDCommand(command);
                break;
            case 'ls':
                this.currentCommand = 'ls';
                break;
            default:
                console.log('unknown command');
                break;
        }
    }

    process(text) {
        if (this.finishedProcessing(text)) {
            this.showResults();
        } else {
            if (this.isCommand(text)) {
                this.processCommand(text);
            } else {
                if (this.currentCommand === 'ls') {
                    this.handleLSOutput(text);
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

    getRequiredSpaceToFreeUp() {
        const usedSpace = this.rootFolder.size;
        const availableSpace = this.totalDiskSpace - usedSpace;
        //console.log({ usedSpace, availableSpace, requiredSpaceToFreeUp });
        return this.minSpaceForUpdate - availableSpace;
    }

    getSmallestFolderToGiveRequiredFreeSpace(choices) {
        return choices.reduce((acc, cur) => {
            acc = cur < acc ? cur : acc;
            return acc;
        }, Array.isArray(choices) ? choices[0] : 0);
    }

    showResults() {
        calcFolderSizes(this.rootFolder);
        const choices = determineSizeOfFolderToDelete(this.rootFolder, this.getRequiredSpaceToFreeUp());
        const result = this.getSmallestFolderToGiveRequiredFreeSpace(choices);
        console.log({ result });
    }
}

module.exports.getFileReader = getFileReader;
module.exports.FolderData = FolderData;
module.exports.FolderData2 = FolderData2;


