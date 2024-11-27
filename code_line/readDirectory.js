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
    if (validFileExtensions.includes(ext)) {
        promises.push(countLines.countLinesInDirectory(filePath));
    }
}

/**
 * 递归处理文件夹逻辑
 */
function processDirectory(filePath, promises, combinedBlacklist) {

    // 读取文件夹内容,返回目录下文件数组列表如：[ '.git', 'app.js', 'code_line', 'read.js', 'README.md' ]
    const files = fs.readdirSync(filePath);
    for (const file of files) {
        const fullPath = path.join(filePath, file); // 拼接路径
        const stats = fs.statSync(fullPath); // 获取文件状态

        // 如果是文件夹，递归处理
        if (stats.isDirectory()) {
            findFiles(fullPath, promises, combinedBlacklist);

            // 如果是文件，处理文件
        } else if (stats.isFile()) {
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

        // 如果是目录，处理目录
        if (stats.isDirectory()) {
            processDirectory(filePath, promises, blacklist);

            // 如果是文件，处理文件
        } else if (stats.isFile()) {
            processFile(filePath, promises);
        }
    } catch (error) {
        console.error(`文件系统操作出现错误: ${error.message}`);
    }
}

// 格式化日期为 "yyyy-MM-dd HH:mm:ss"
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 生成表格框架
 */
function generateLanguagesTable(results) {
    const maxLanguageLength = Math.max(...results.map(r => r.language.length), 8);
    const colWidths = {
        language: maxLanguageLength + 2,
        files: 12,
        code: 12,
        comment: 12,
        blank: 12,
        total: 12,
    };
    // 2. 表头
    const header = [
        //进行了手动调整，后续需要修改！
        `| ${"语言".padEnd(colWidths.language - 4)} | `
        + `${"文件数".padEnd(colWidths.files - 5)} | `
        + `${"有效行".padStart(colWidths.code - 5)} | `
        + `${"注释行".padStart(colWidths.comment - 5)} | `
        + `${"空行".padStart(colWidths.blank - 4)} | `
        + `${"总行".padStart(colWidths.total - 4)} |`
    ];
    const separator = [
        `+${"-".repeat(colWidths.language)}`
        + `+${"-".repeat(colWidths.language)}`
        + `+${"-".repeat(colWidths.code)}`
        + `+${"-".repeat(colWidths.comment)}`
        + `+${"-".repeat(colWidths.blank)}`
        + `+${"-".repeat(colWidths.total)}+`
    ];
    // 3. 内容行
    const rows = results.map(({ language, files, codeLines, commentLineCount, emptyLines, lineCount }) => {
        return `| ${language.padEnd(colWidths.language - 2)} | `
            + `${String(files).padStart(colWidths.files - 2)} | `
            + `${String(codeLines).padStart(colWidths.code - 2)} | `
            + `${String(commentLineCount).padStart(colWidths.comment - 2)} | `
            + `${String(emptyLines).padStart(colWidths.blank - 2)} | `
            + `${String(lineCount).padStart(colWidths.total - 2)} |`;
    });
    return [
        separator[0],
        header[0],
        separator[0],
        ...rows,
        separator[0],
    ].join("\n");
}

async function calculateTotalLines(directory, showSummary = false, userExcludeDirs = [], exportResult = false) {
    //测试generateLanguagesTable函数
    // const headers = ['Path', 'Files', 'Code', 'Comment', 'Blank', 'Total'];
    // const results = [
    //     { language: "TypeScript", files: 8, codeLines: 5, commentLineCount: 0, emptyLines: 0, lineCount: 5 }, { language: "Go", files: 8, codeLines: 5, commentLineCount: 0, emptyLines: 0, lineCount: 5 }
    // ];
    // console.log(generateLanguagesTable(results));

    const promises = [];
    const combinedBlacklist = [...blacklist, ...userExcludeDirs];

    findFiles(directory, promises, combinedBlacklist);

    try {
        const results = await Promise.all(promises);
        // const languageCodeLines = {};
        const date = new Date();
        const formattedDate = formatDate(date);

        let totalLineCount = 0;
        let totalEmptyLines = 0;
        let totalCommentLineCount = 0;
        let totalCodeLines = 0;
        let fileCount = 0;
        let output = "";
        let outputText = "";

        output += "日期 : " + formattedDate + "\n";
        output += "目录 : " + directory + "\n";

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
            outputText += "\n= = = = = = 文件统计信息 = = = = = =\n";
            outputText += "-".repeat(colWidths.path + colWidths.lineCount + colWidths.emptyLines + colWidths.commentLines + colWidths.codeLines) + "\n";
            outputText += "文件路径".padEnd(colWidths.path - 20) +
                "总行数".padEnd(colWidths.lineCount) +
                "空行数".padEnd(colWidths.emptyLines) +
                "注释行数".padEnd(colWidths.commentLines) +
                "有效代码行数".padEnd(colWidths.codeLines) + "\n";
            outputText += "-".repeat(colWidths.path + colWidths.lineCount + colWidths.emptyLines + colWidths.commentLines + colWidths.codeLines) + "\n";
        }

        // 打印每个文件的统计信息
        const result = [];
        let languageStats = {};
        const finalResults = [];
        results.forEach(({ extension, codeLines, lineCount, emptyLines, commentLineCount, dirPath }) => {
            if (!showSummary) {
                const relativePath = path.relative(directory, dirPath);  // 计算相对路径
                outputText += relativePath.padEnd(colWidths.path - 14) +
                    String(lineCount).padEnd(colWidths.lineCount + 3) +
                    String(emptyLines).padEnd(colWidths.emptyLines + 3) +
                    String(commentLineCount).padEnd(colWidths.commentLines + 3) +
                    String(codeLines).padEnd(colWidths.codeLines) + "\n";
                totalLineCount += lineCount;
                totalEmptyLines += emptyLines;
                totalCommentLineCount += commentLineCount;
                fileCount += 1;
                //在这里totalCodeLines应该在这，但是现在短暂放在外面
                result.push({
                    dirPath,
                    extension,
                    codeLines,
                    commentLineCount,
                    emptyLines,
                    lineCount
                });
                // if (!languageCodeLines[extension]) {
                //     languageCodeLines[extension] = 0;
                // }
                // languageCodeLines[extension] += codeLines;
                totalCodeLines += codeLines;
                const languageMapping = {
                    "js": "JavaScript",
                    "py": "Python",
                    "java": "Java",
                    "xml": "XML",
                    "html": "HTML",
                    "lua": "Lua",
                    "cs": "C#",
                    "php": "PHP",
                    "css": "CSS",
                    "vue": "Vue",
                    "ts": "TypeScript",
                    "go": "Go"
                };
                const language = languageMapping[extension] || "Unknown";
                // 更新语言统计信息
                if (!languageStats[language]) {
                    languageStats[language] = {
                        files: 0,
                        codeLines: 0,
                        lineCount: 0,
                        emptyLines: 0,
                        commentLineCount: 0
                    };
                }
                // console.log(language);
                languageStats[language].files++;
                languageStats[language].codeLines += codeLines;
                languageStats[language].lineCount += lineCount;
                languageStats[language].emptyLines += emptyLines;
                languageStats[language].commentLineCount += commentLineCount;
            }
        });
        outputText += "-".repeat(colWidths.path + colWidths.lineCount + colWidths.emptyLines + colWidths.commentLines + colWidths.codeLines) + "\n";
        for (const language in languageStats) {
            if (languageStats.hasOwnProperty(language)) {
                finalResults.push({
                    language,
                    files: languageStats[language].files,
                    codeLines: languageStats[language].codeLines,
                    commentLineCount: languageStats[language].commentLineCount,
                    emptyLines: languageStats[language].emptyLines,
                    lineCount: languageStats[language].lineCount
                });
            }
        }
        // console.log(generateTable(result, directory));
        output += "总计 : " + fileCount + "个文件，" + totalCodeLines + "行代码，" + totalCommentLineCount + "行注释，" + totalEmptyLines
            + "个空行，" + "全部共" + totalLineCount + "行。\n\n";
        // outputText += "= = = = = = = = = = = = = = = = = = = = = = = = = = = = = =\n"
        // outputText += "每种语言的有效代码行数\r\n"
        // if (languageCodeLines) {
        //     for (let extension in languageCodeLines) {
        //         outputText += `${extension}: ${languageCodeLines[extension]} \n`
        //     }
        // }
        // outputText += "= = = = = = = = = = = = = = = = = = = = = = = = = = = = = =\n"
        // outputText += `所有文件的有效代码总行数: ${totalCodeLines}`
        output += "= = = = = = 编程语言 = = = = = =\n";
        output += generateLanguagesTable(finalResults);
        output += "\n" + outputText;
        console.log(output);
        if (exportResult) {
            fs.writeFile("output.txt", output, { encoding: 'utf8' }, (err) => {
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