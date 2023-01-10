class FormModelGenerator {
    constructor(formJson, xlsColumn, modelFolder, xlsSheet) {
        this.formDetails = formJson || [];
        this.fs = require('fs');
        this.reportNamespacePart = '';
        this.classProps = [];
        this.classHasListProp = new Set();
        this.xlsColumn = xlsColumn || 'C';
        this.modelFolder = modelFolder;
        this.modelInfo = [];
        this.xlsSheet = xlsSheet;
    }

    appendLineToFile(fileName, line) {
        this.fs.appendFileSync(fileName, `${line}\n`, err => {
            if (err) {
                throw new Error(`appendFileSync failed: Exception: ${err.message}`);
            }
        });
    };

    writeLineToFile(fileName, line) {
        this.fs.writeFileSync(fileName, line);
    }

    writeClassHeader(fileName, className, classHasList) {
        this.writeLineToFile(fileName, 'using System.Xml.Serialization;\n');
        if (classHasList) {
            this.appendLineToFile(fileName, 'using System.Collections.Generic;')
        }
        this.appendLineToFile(fileName, `\nnamespace Anow.Api.Exports.AppraisalInstitute.Models.${this.reportNamespacePart};`);
        this.appendLineToFile(fileName, '');
        this.appendLineToFile(fileName, `[XmlRoot(ElementName = "${className}")]`);
        if (className === 'FORMINFO') {
            this.appendLineToFile(fileName, `public class ${className} : Api.Exports.AppraisalInstitute.Models.${className}`);
        } else {
            this.appendLineToFile(fileName, `public class ${className}`);
        }
        this.appendLineToFile(fileName, '{');
    }

    writeClassPropertyAsClass(fileName, propName) {
        this.appendLineToFile(fileName, `   [XmlElement(ElementName = "${propName}")]`);
        this.appendLineToFile(fileName, `   public ${propName} ${propName} { get; set; }`);
    }

    writeClassPropertyAsString(fileName, propName) {
        this.appendLineToFile(fileName, `   [XmlElement(ElementName = "${propName}")]`);
        this.appendLineToFile(fileName, `   public string ${propName} { get; set; }`);
    }

    writeClassPropertyAsAttribute(fileName, propName) {
        this.appendLineToFile(fileName, `   [XmlAttribute(AttributeName = "${propName}")]`);
        this.appendLineToFile(fileName, `   public string ${propName} { get; set; }`);
    }

    writeClassPropertyAsList(fileName, propName) {
        this.appendLineToFile(fileName, `   [XmlElement(ElementName = "${propName}")]`);
        this.appendLineToFile(fileName, `    public List<${propName}> ${propName} { get; set; }`);
    }

    closeClassFile(fileName) {
        this.appendLineToFile(fileName, '}')
    }

    deriveModelInfoFromXLSColumnData() {
        if (!this.formDetails[this.xlsSheet]){
            throw new Error(`Specified sheet (${this.xlsSheet}) could not be found. Please provide a valid sheet reference.`);
        }
        this.formDetails[this.xlsSheet].forEach((line, index) => {
            if (index === 0) {
                this.reportNamespacePart = line.A || '';
                const openBracePos = this.reportNamespacePart.indexOf('(');
                const closeBracePos = this.reportNamespacePart.indexOf(')');
                if (openBracePos !== -1 && closeBracePos !== -1) {
                    const temp = [...this.reportNamespacePart];
                    temp.splice(openBracePos - 1, closeBracePos - openBracePos + 2);
                    this.reportNamespacePart = temp.join('');
                }
                this.reportNamespacePart = this.reportNamespacePart.replaceAll(' ', '');
            }
            if (line[this.xlsColumn] && line[this.xlsColumn] !== '') {
                this.modelInfo.push(line[this.xlsColumn])
            }
        })

    }

    createModelFiles(){
        this.modelInfo.forEach(x => {
            const items = x.split('/');
            if (items.length > 2) {
                items.forEach((i, index) => {
                    if (index === items.length - 1) {
                        // add as property to class
                        if (items[index].startsWith('@')) {
                            this.classProps.push({
                                className: items[index - 1],
                                prop: items[index].replace('@', ''),
                                type: 'attribute'
                            });
                        } else {
                            this.classProps.push({
                                className: items[index - 1],
                                prop: items[index],
                                type: 'string'
                            });
                        }
                    } else if (index > 0) {
                        const item = items[index];
                        if (item.includes('[@') && item.includes('=')) {
                            const propNameAndClassName = item.split('=')[0];
                            const codeItems = propNameAndClassName.split('[@');
                            if (codeItems.length === 2) {
                                this.classHasListProp.add(this.normalizeClassOrPropName(items[index - 1]));
                                this.classProps.push({
                                    className: items[index - 1],
                                    prop: codeItems[0],
                                    type: 'list'
                                });
                                this.classProps.push({
                                    className: codeItems[0],
                                    prop: codeItems[1],
                                    type: 'attribute'
                                });
                            }
                        } else {
                            // to class list
                            this.classProps.push({
                                className: items[index - 1],
                                prop: items[index],
                                type: 'class'
                            });
                        }
                    }
                })
            } else if (items.length > 1) {
                if ((items[1].startsWith('@') && items[0] === 'FORMINFO')) {
                    // Handle these: (Do nothing)
                    // FORMINFO/@FORMNUM
                    // FORMINFO/@FILENUM
                    // FORMINFO/@VENDOR
                    // FORMINFO/@VERSION
                    // FORMINFO/@CASE_NO
                    // FORMINFO/@DOCID
                }
            }
        })
    }
    parseClasses() {
        this.modelInfo = [];
        try {
            this.deriveModelInfoFromXLSColumnData();
            this.createModelFiles();
        } catch (e) {
            console.clear();
            console.log(`Exception thrown: ${e.message}`)
            console.log(`Please verify the supplied xls column ("${this.xlsColumn}") is valid!`);
            process.exit(-3);
        }
    }

    normalizeClassOrPropName(name) {
        if (name.includes('[@') && name.includes('=')) {
            const propNameAndClassName = name.split('=')[0];
            const codeItems = propNameAndClassName.split('[@');
            if (codeItems.length === 2) {
                return codeItems[0];
            } else {
                throw new Error('Malformed list type definition in Excel data');
            }
        }
        return name;
    }

    createModels() {
        const createdClasses = [];
        this.classProps.forEach(p => {
            const { className, prop, type } = p;
            const normalizedClassName = this.normalizeClassOrPropName(className);
            const normalizedProp = this.normalizeClassOrPropName(prop);
            if (!createdClasses.some(c => c.className === normalizedClassName)) {
                const classHasList = this.classHasListProp.has(normalizedClassName);
                createdClasses.push({
                    className: normalizedClassName,
                    propsAdded: [],
                    stringPropsAdded: [],
                    attrPropsAdded: [],
                    listPropsAdded: []
                });
                this.writeClassHeader(`${this.modelFolder}/${normalizedClassName}.cs`, normalizedClassName, classHasList);
            }
            switch (type) {
                case 'class':
                    const currentClass = createdClasses.find(c => c.className === normalizedClassName);
                    const { propsAdded } = currentClass;
                    if (currentClass && !propsAdded.find(p => p === prop)) {
                        this.writeClassPropertyAsClass(`${this.modelFolder}/${normalizedClassName}.cs`, normalizedProp);
                        propsAdded.push(prop);
                    }
                    break;
                case 'string':
                    const currentClassString = createdClasses.find(c => c.className === normalizedClassName);
                    const { stringPropsAdded } = currentClassString;
                    if (currentClassString && !stringPropsAdded.find(p => p === prop)) {
                        this.writeClassPropertyAsString(`${this.modelFolder}/${normalizedClassName}.cs`, normalizedProp);
                        stringPropsAdded.push(prop);
                    }
                    break;
                case 'attribute':
                    const currentClassAttribute = createdClasses.find(c => c.className === normalizedClassName);
                    const { attrPropsAdded } = currentClassAttribute;
                    if (currentClassAttribute && !attrPropsAdded.find(p => p === prop)) {
                        this.writeClassPropertyAsAttribute(`${this.modelFolder}/${normalizedClassName}.cs`, normalizedProp);
                        attrPropsAdded.push(prop);
                    }
                    break;
                case 'list':
                    const currentClassList = createdClasses.find(c => c.className === normalizedClassName);
                    const { listPropsAdded } = currentClassList;
                    if (currentClassList && !listPropsAdded.find(p => p === prop)) {
                        this.writeClassPropertyAsList(`${this.modelFolder}/${normalizedClassName}.cs`, normalizedProp);
                        listPropsAdded.push(prop);
                    }
                    break;
                default:
                    throw new Error(`Unknown type encountered (${type})`);
            }
        })
        createdClasses.forEach(c => {
            this.closeClassFile(`${this.modelFolder}/${this.normalizeClassOrPropName(c.className)}.cs`);
        })
    }

    generateModels() {
        this.parseClasses();
        this.createModels();
    }

}

module.exports.FormModelGenerator = FormModelGenerator;


