const fs = require("fs")
const path = require("path")
const countLines = require("./fileCounter")
const validFileExtensions = ['.js', '.py', '.java', '.xml', '.html', '.lua', '.cs', '.php', '.css', '.vue', '.ts', '.go']
const blacklist = require('./blackList');

/**
 * 检查文件路径是否在黑名单中
 */
function isBlackListed(filePath, combinedBlacklist) {
    for (let pattern of combinedBlacklist) {
        if (filePath.includes(pattern)) {
            return true;
        }
    }
    return false;
}

/**
 * 处理文件逻辑
 */
function processFile(filePath, promises) {
    const ext = path.extname(filePath);
    if (validFileExtensions.includes(ext))
        promises.push(countLines.countLinesInDirectory(filePath));
}

/**
 * 递归处理文件夹逻辑
 */
function processDirectory(filePath, promises, combinedBlacklist) {
    const files = fs.readdirSync(filePath); // 读取文件夹内容,返回目录下文件数组列表如：[ '.git', 'app.js', 'code_line', 'read.js', 'README.md' ]
    for (const file of files) {
        const fullPath = path.join(filePath, file); // 拼接路径
        const stats = fs.statSync(fullPath); // 获取文件状态
        if (stats.isDirectory()) {
            // 如果是文件夹，递归处理
            findFiles(fullPath, promises, combinedBlacklist);
        } else if (stats.isFile()) {
            // 如果是文件，处理文件
            processFile(fullPath, promises);
        }
    }
}

function findFiles(filePath, promises, combinedBlacklist) {
    if (!fs.existsSync(filePath)) {
        console.log("您输入的目录不存在！");
        return;
    }
    // 检查黑名单
    if (isBlackListed(filePath, combinedBlacklist)) return;
    try {
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            // 如果是目录，处理目录
            processDirectory(filePath, promises, blacklist);
        } else if (stats.isFile()) {
            // 如果是文件，处理文件
            processFile(filePath, promises);
        }
    } catch (error) {
        console.error(`文件系统操作出现错误: ${error.message}`);
    }
}
async function calculateTotalLines(directory, showSummary = false, userExcludeDirs = [], exportResult = false) {
    const promises = [];
    const combinedBlacklist = [...blacklist, ...userExcludeDirs];

    findFiles(directory, promises, combinedBlacklist);
    try {
        const results = await Promise.all(promises);
        const languageCodeLines = {};
        let totalCodeLines = 0;
        let outputText = "";


        // 定义列宽
        const colWidths = {
            path: 100,
            lineCount: 10,
            emptyLines: 10,
            commentLines: 12,
            codeLines: 12
        };

        if (!showSummary) {
            outputText += "= = = = = = 文件统计信息 = = = = = =\n";
            outputText += "文件路径".padEnd(colWidths.path - 20) +
                "总行数".padEnd(colWidths.lineCount) +
                "空行数".padEnd(colWidths.emptyLines) +
                "注释行数".padEnd(colWidths.commentLines) +
                "有效代码行数".padEnd(colWidths.codeLines) + "\n";
            outputText += "-".repeat(colWidths.path + colWidths.lineCount + colWidths.emptyLines + colWidths.commentLines + colWidths.codeLines) + "\n";
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
                outputText += relativePath.padEnd(colWidths.path - 14) +
                    String(lineCount).padEnd(colWidths.lineCount + 3) +
                    String(emptyLines).padEnd(colWidths.emptyLines + 3) +
                    String(commentLineCount).padEnd(colWidths.commentLines + 3) +
                    String(codeLines).padEnd(colWidths.codeLines) + "\n";
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
        outputText += "= = = = = = = = = = = = = = = = = = = = = = = = = = = = = =\n"
        console.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
        outputText += "每种语言的有效代码行数\r\n"
        let output = '每种语言的有效代码行数：';
        console.log(output);
        if (languageCodeLines) {
            for (let extension in languageCodeLines) {
                console.log(`${extension}: ${languageCodeLines[extension]} `);
                outputText += `${extension}: ${languageCodeLines[extension]} \n`
            }
        }
        outputText += "= = = = = = = = = = = = = = = = = = = = = = = = = = = = = =\n"
        console.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
        outputText += `所有文件的有效代码总行数: ${totalCodeLines}`
        console.log(`所有文件的有效代码总行数: ${totalCodeLines}`);
        if (exportResult) {
            fs.writeFile("output.txt", outputText, { encoding: 'utf8' }, (err) => {
                if (err) {
                    console.error(`文件写入失败: ${err.message}`);
                } else {
                    console.log(`结果已导出到 output.txt`);
                }
            });
        }

    } catch (error) {
        console.error(`统计文件行数时发生错误: ${error.message}`);
    }

}

module.exports = { calculateTotalLines };