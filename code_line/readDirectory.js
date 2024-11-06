const fs = require("fs")
const path = require("path")
const countLines = require("./fileCounter")
const validFileExtensions = ['.js', '.py', '.java', '.xml', '.html', '.lua', '.cs', '.php', '.css', '.vue', '.ts']
const blacklist = require('./blackList');

function isBlackListed(filePath, blacklist) {
    for (let pattern of blacklist) {
        if (filePath.includes(pattern)) {
            return true;
        }
    }
    return false;
}

function findFiles(filePath, promises, showSummary = false) {
    if (fs.existsSync(filePath)) {//判断文件目录是否存在
        if (!isBlackListed(filePath, blacklist)) {
            let stats = fs.statSync(filePath)//获取文件信息
            if (stats.isDirectory()) {
                const files = fs.readdirSync(filePath)//返回目录下文件数组列表[ '.git', 'app.js', 'code_line', 'read.js', 'README.md' ]
                for (let i = 0; i < files.length; i++) {
                    let currentFilePath = path.join(filePath, files[i])//处理路径拼接
                    stats = fs.statSync(currentFilePath)//获取文件信息
                    if (stats.isDirectory()) {//判断是否为目录
                        findFiles(currentFilePath, promises, showSummary);
                    } else {
                        const ext = path.extname(currentFilePath);
                        if (validFileExtensions.includes(ext))
                            promises.push(countLines.countLinesInDirectory(currentFilePath, showSummary));
                    }
                }
            } else if (stats.isFile()) {
                promises.push(countLines.countLinesInDirectory(filePath, showSummary));
            }
        }
    } else {
        console.log("您输入的目录不存在！")
    }
}
async function calculateTotalLines(directory, showSummary = false) {
    const promises = [];
    findFiles(directory, promises, showSummary);
    const results = await Promise.all(promises);
    const languageCodeLines = {};
    let totalCodeLines = 0;

    results.forEach(({ extension, codeLines }) => {
        if (!languageCodeLines[extension]) {
            languageCodeLines[extension] = 0;
        }
        languageCodeLines[extension] += codeLines;
        totalCodeLines += codeLines;
    });
    console.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
    let output = '每种语言的有效代码行数：';
    console.log(output);
    // console.log("每种语言的有效代码行数：");
    if (languageCodeLines) {
        for (let extension in languageCodeLines) {
            console.log(`${extension}: ${languageCodeLines[extension]} `);
        }
    }
    // console.log(output);
    // console.log("每种语言的有效代码行数：", languageCodeLines);
    console.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
    console.log(`所有文件的有效代码总行数: ${totalCodeLines}`);
}

module.exports = { calculateTotalLines };