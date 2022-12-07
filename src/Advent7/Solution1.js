const { getFileReader, FolderData } = require('./lib');
const user_file = './commands.data';
const r = getFileReader(user_file);

const folderData = new FolderData();
r.on('line', function (text) {
    folderData.process(text);
});
