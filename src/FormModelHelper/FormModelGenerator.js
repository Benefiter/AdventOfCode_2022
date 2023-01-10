const { FormModelGenerator } = require('./lib');
const fs = require('fs');
const excelToJson = require('convert-excel-to-json');
var debug = typeof v8debug === 'object'
    || /--debug|--inspect|--prof|--logfile/.test(process.argv.join(' '));

const printUsage = () => {
    console.log('Usage:\n');
    console.log(`node FormModelGenerator.js xlsFile="<filenameLocation>" xlsColumn=["<XLSColumnToUse> || 'C' "] modelFolder=["<ModelFolder> || './' "] xlsSheet=["<SheetName> || 'Sheet1'"]\n\n`);
    console.log('');
    console.log('example: node FormModelGenerator.js xlsFile="/Users/benwilfred/source/repos/adventOfcode/src/formmodelhelper/1007.xls" xlsColumn="B" modelFolder="/Users/benwilfred/source/repos/adventOfcode/src/formmapper/Models" xlsSheet="1025_-2005.xls"\n\n\n\n');
}

const ValidArgs = ['xlsFile', 'xlsColumn', 'modelFolder', 'xlsSheet'];
const invalidArg = (argSpec) =>{
    return !ValidArgs.includes(argSpec);
}

const parseArgs = (args) => {
    let xlsFile='not_set';
    let xlsColumn = 'C';
    let modelFolder = "./";
    let xlsSheet = 'Sheet1';
    args.forEach(arg => {
        const argBits = arg.split('=');
        if ((argBits.length !== 2) || invalidArg(argBits[0])){
            console.log(`Invalid arg supplied - <${arg}>`);
            printUsage();
            process.exit(-10);
        } else {
            switch (argBits[0]){
                case 'xlsFile':
                    xlsFile = argBits[1];
                    break;
                case 'xlsColumn':
                    xlsColumn = argBits[1];
                    break;
                case 'modelFolder':
                    modelFolder = argBits[1];
                    break;
                case 'xlsSheet':
                    xlsSheet = argBits[1];
                    break;
                default:
                    // already handled above
                    break;
            }
        }
    })
    return { xlsFile, modelFolder, xlsColumn, xlsSheet };
}

const myArgs = process.argv.slice(debug ? 4 : 2);
if (myArgs.length === 0) {
    printUsage();
    process.exit(-1);
} else {
    const {xlsFile, xlsColumn, modelFolder, xlsSheet } = parseArgs(myArgs);

    if (!fs.existsSync(xlsFile)) {
        console.clear();
        console.log(`${xlsFile} does not exist! Please provide an existing xls file to parse.`);
        process.exit(-2);
    }
    if (!fs.existsSync(modelFolder)) {
        console.clear();
        console.log(`${modelFolder} does not exist! Please provide a valid target models folder.`);
        process.exit(-4);

    } else {
        const result = excelToJson({
            sourceFile: xlsFile,
            sheets: [xlsSheet]
        })

        const helper = new FormModelGenerator(result, xlsColumn, modelFolder, xlsSheet);
        helper.generateModels();
    }
}

