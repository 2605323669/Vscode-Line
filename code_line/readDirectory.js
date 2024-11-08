const fs = require("fs")
const path = require("path")
const countLines = require("./fileCounter")
const validFileExtensions = ['.js', '.py', '.java', '.xml', '.html', '.lua', '.cs', '.php', '.css', '.vue', '.ts', '.go']
const blacklist = require('./blackList');

function isBlackListed(filePath, blacklist) {
    for (let pattern of blacklist) {
        if (filePath.includes(pattern)) {
            return true;
        }
    }
    return false;
}

function findFiles(filePath, promises) {
    // console.log(directory);
    if (fs.existsSync(filePath)) {//判断文件目录是否存在
        if (!isBlackListed(filePath, blacklist)) {
            let stats = fs.statSync(filePath)//获取文件信息
            if (stats.isDirectory()) {
                const files = fs.readdirSync(filePath)//返回目录下文件数组列表[ '.git', 'app.js', 'code_line', 'read.js', 'README.md' ]
                for (let i = 0; i < files.length; i++) {
                    let currentFilePath = path.join(filePath, files[i])//处理路径拼接
                    stats = fs.statSync(currentFilePath)//获取文件信息
                    if (stats.isDirectory()) {//判断是否为目录
                        findFiles(currentFilePath, promises);
                    } else {
                        const ext = path.extname(currentFilePath);
                        if (validFileExtensions.includes(ext))
                            promises.push(countLines.countLinesInDirectory(currentFilePath));
                    }
                }
            } else if (stats.isFile()) {
                promises.push(countLines.countLinesInDirectory(filePath));
            }
        }
    } else {
        console.log("您输入的目录不存在！")
    }
}
async function calculateTotalLines(directory, showSummary = false) {
    const promises = [];
    findFiles(directory, promises);
    const results = await Promise.all(promises);
    const languageCodeLines = {};
    let totalCodeLines = 0;

    // 定义列宽
    const colWidths = {
        path: 100,
        lineCount: 10,
        emptyLines: 10,
        commentLines: 12,
        codeLines: 12
    };

    if (!showSummary) {
        // 打印表头
        console.log("= = = = = = 文件统计信息 = = = = = =");
        console.log(
            "文件路径".padEnd(colWidths.path - 20) +
            "总行数".padEnd(colWidths.lineCount) +
            "空行数".padEnd(colWidths.emptyLines) +
            "注释行数".padEnd(colWidths.commentLines) +
            "有效代码行数".padEnd(colWidths.codeLines)
        );
        console.log("-".repeat(colWidths.path + colWidths.lineCount + colWidths.emptyLines + colWidths.commentLines + colWidths.codeLines));
    }

    // 打印每个文件的统计信息
    results.forEach(({ extension, codeLines, lineCount, emptyLines, commentLineCount, dirPath }) => {
        if (!showSummary) {
            const relativePath = path.relative(directory, dirPath);  // 计算相对路径
            console.log(
                relativePath.padEnd(colWidths.path - 14) +
                String(lineCount).padEnd(colWidths.lineCount + 3) +
                String(emptyLines).padEnd(colWidths.emptyLines + 3) +
                String(commentLineCount).padEnd(colWidths.commentLines + 3) +
                String(codeLines).padEnd(colWidths.codeLines)
            );
        }

        if (!languageCodeLines[extension]) {
            languageCodeLines[extension] = 0;
        }
        languageCodeLines[extension] += codeLines;
        totalCodeLines += codeLines;
    });
    console.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
    let output = '每种语言的有效代码行数：';
    console.log(output);
    if (languageCodeLines) {
        for (let extension in languageCodeLines) {
            console.log(`${extension}: ${languageCodeLines[extension]} `);
        }
    }
    console.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
    console.log(`所有文件的有效代码总行数: ${totalCodeLines}`);
}

module.exports = { calculateTotalLines };