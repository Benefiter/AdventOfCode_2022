const { getFileReader, FolderData2 } = require('./lib');
const user_file = './commands.data';
const r = getFileReader(user_file);

const folderData = new FolderData2();
r.on('line', function (text) {
    folderData.process(text);
});