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

/**
 * 对传进来的目录进行处理
 */
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

/**
 * 格式化日期 
 */
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
 * 生成编程语言表格框架
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
        `| ${"语言".padEnd(colWidths.language - 2)} | `
        + `${"文件数".padEnd(colWidths.files - 3)} | `
        + `${"有效行".padStart(colWidths.code - 3)} | `
        + `${"注释行".padStart(colWidths.comment - 3)} | `
        + `${"空行".padStart(colWidths.blank - 2)} | `
        + `${"总行".padStart(colWidths.total - 2)} |`
    ];

    const separator = [
        `+${"-".repeat(colWidths.language + 2)}`
        + `+${"-".repeat(colWidths.language + 2)}`
        + `+${"-".repeat(colWidths.code + 2)}`
        + `+${"-".repeat(colWidths.comment + 2)}`
        + `+${"-".repeat(colWidths.blank + 2)}`
        + `+${"-".repeat(colWidths.total + 2)}+`
    ];

    // 3. 内容行
    const rows = results.map(({ language, files, codeLines, commentLineCount, emptyLines, lineCount }) => {
        return `| ${language.padEnd(colWidths.language)} | `
            + `${String(files).padStart(colWidths.files)} | `
            + `${String(codeLines).padStart(colWidths.code)} | `
            + `${String(commentLineCount).padStart(colWidths.comment)} | `
            + `${String(emptyLines).padStart(colWidths.blank)} | `
            + `${String(lineCount).padStart(colWidths.total)} |`;
    });

    return [
        separator[0],
        header[0],
        separator[0],
        ...rows,
        separator[0],
    ].join("\n");
}

/**
 * 生成文件信息表格框架
 */
function generateFilesTable(results, directory) {
    // 1. 动态计算 filename 列宽
    const maxFilenameLength = Math.max(...results.map(r => path.relative(directory, r.dirPath).length), 8); // 最小宽度为 "filename".length
    const colWidths = {
        filename: maxFilenameLength + 2, // +2 为了给表格边界留余地
        language: 12,
        code: 12,
        comment: 12,
        blank: 12,
        total: 12,
    };

    // 2. 表头
    const header = [
        //进行了手动调整，后续需要修改！
        `| ${"文件路径".padEnd(colWidths.filename - 4)} | `
        + `${"语言".padEnd(colWidths.language - 2)} | `
        + `${"有效行".padStart(colWidths.code - 3)} | `
        + `${"注释行".padStart(colWidths.comment - 3)} | `
        + `${"空行".padStart(colWidths.blank - 2)} | `
        + `${"总行".padStart(colWidths.total - 2)} |`
    ];
    const separator = [
        `+${"-".repeat(colWidths.filename + 2)}+`
        + `${"-".repeat(colWidths.language + 2)}+`
        + `${"-".repeat(colWidths.code + 2)}+`
        + `${"-".repeat(colWidths.comment + 2)}+`
        + `${"-".repeat(colWidths.blank + 2)}+`
        + `${"-".repeat(colWidths.total + 2)}+`
    ]; 9

    // 3. 内容行
    const rows = results.map(({ dirPath, extension, codeLines, commentLineCount, emptyLines, lineCount }) => {
        const relativePath = path.relative(directory, dirPath);
        return `| ${relativePath.padEnd(colWidths.filename)} | `
            + `${extension.padEnd(colWidths.language)} | `
            + `${String(codeLines).padStart(colWidths.code)} | `
            + `${String(commentLineCount).padStart(colWidths.comment)} | `
            + `${String(emptyLines).padStart(colWidths.blank)} | `
            + `${String(lineCount).padStart(colWidths.total)} |`;
    });

    // 4. 总计行
    const total = results.reduce(
        (acc, { codeLines, commentLineCount, emptyLines, lineCount }) => {
            acc.code += codeLines;
            acc.comment += commentLineCount;
            acc.blank += emptyLines;
            acc.total += lineCount;
            return acc;
        },
        { code: 0, comment: 0, blank: 0, total: 0 }
    );

    const totalRow = `| ${"总数".padEnd(colWidths.filename - 2)} | `
        + `${"".padEnd(colWidths.language)} | `
        + `${String(total.code).padStart(colWidths.code)} | `
        + `${String(total.comment).padStart(colWidths.comment)} | `
        + `${String(total.blank).padStart(colWidths.blank)} | `
        + `${String(total.total).padStart(colWidths.total)} |`;

    // 5. 拼接表格
    return [
        separator[0],
        header[0],
        separator[0],
        ...rows,
        separator[0],
        totalRow,
        separator[0],
    ].join("\n");
}

/**
 * 接受目录参数，对结果进行保存输出
 */
async function calculateTotalLines(directory, showSummary = false, userExcludeDirs = [], exportResult = false) {
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

        // 打印每个文件的统计信息
        const result = [];
        let languageStats = {};
        const finalResults = [];
        results.forEach(({ extension, codeLines, lineCount, emptyLines, commentLineCount, dirPath }) => {
            if (!showSummary) {
                totalLineCount += lineCount;
                totalEmptyLines += emptyLines;
                totalCommentLineCount += commentLineCount;
                fileCount += 1;
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
                //在这里totalCodeLines应该在这，但是现在短暂放在外面
                extension = language;
                result.push({
                    dirPath,
                    extension,
                    codeLines,
                    commentLineCount,
                    emptyLines,
                    lineCount
                });


                // // 添加列标题
                // let csvContent = 'dirPath,codeLines\n';
                // // 提取 dirPath 和 codeLines 并拼接成 CSV 格式
                // csvContent += result.map(item => `${item.dirPath},${item.codeLines}`).join('\n');
                // // 指定导出文件路径
                // const outputPath = path.join(__dirname, 'codeLines_with_dirPath.csv');
                // // 将数据写入 CSV 文件
                // fs.writeFileSync(outputPath, csvContent);

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
                languageStats[language].files++;
                languageStats[language].codeLines += codeLines;
                languageStats[language].lineCount += lineCount;
                languageStats[language].emptyLines += emptyLines;
                languageStats[language].commentLineCount += commentLineCount;
            }
        });
        if (!showSummary) {
            // 打印表头
            outputText += "\n= = = = = = 文件统计信息 = = = = = =\n";
            outputText += generateFilesTable(result, directory);
        }
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
        output += "总计 : " + fileCount + "个文件，" + totalCodeLines + "行代码，" + totalCommentLineCount + "行注释，" + totalEmptyLines
            + "个空行，" + "全部共" + totalLineCount + "行。\n\n";
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