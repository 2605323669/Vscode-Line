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
 * 生成文件信息表格框架
 */
function generateFolderTable(results) {
    // 1. 动态计算 filename 列宽
    const maxFilenameLength = Math.max(...results.map(r => 
        r.directory.length
    ), 8); // 最小宽度为 "filename".length
    const colWidths = {
        directory: maxFilenameLength + 2, // +2 为了给表格边界留余地
        files: 12,
        code: 12,
        comment: 12,
        blank: 12,
        total: 12,
    };

    // 2. 表头
    const header = [
        //进行了手动调整，后续需要修改！
        `| ${"文件夹".padEnd(colWidths.directory - 4)} | `
        + `${"文件数".padEnd(colWidths.files - 2)} | `
        + `${"有效行".padStart(colWidths.code - 3)} | `
        + `${"注释行".padStart(colWidths.comment - 3)} | `
        + `${"空行".padStart(colWidths.blank - 2)} | `
        + `${"总行".padStart(colWidths.total - 2)} |`
    ];
    const separator = [
        `+${"-".repeat(colWidths.directory + 2)}+`
        + `${"-".repeat(colWidths.files + 2)}+`
        + `${"-".repeat(colWidths.code + 2)}+`
        + `${"-".repeat(colWidths.comment + 2)}+`
        + `${"-".repeat(colWidths.blank + 2)}+`
        + `${"-".repeat(colWidths.total + 2)}+`
    ]; 9

    // 3. 内容行
    const rows = results.map(({ directory, files, code, comment, blank, total }) => {
        return `| ${directory.padEnd(colWidths.directory)} | `
            + `${String(files).padStart(colWidths.files)} | `
            + `${String(code).padStart(colWidths.code)} | `
            + `${String(comment).padStart(colWidths.comment)} | `
            + `${String(blank).padStart(colWidths.blank)} | `
            + `${String(total).padStart(colWidths.total)} |`;
    });


    // 5. 拼接表格
    return [
        separator[0],
        header[0],
        separator[0],
        ...rows,
        separator[0],
    ].join("\n");
}

function mergeSubdirectories(directoryStats) {
    const dirs = Object.keys(directoryStats);

    // 按路径长度排序，确保子目录在父目录之前
    dirs.sort((a, b) => b.length - a.length);

    dirs.forEach(dir => {
        const parentDir = path.dirname(dir); // 获取父目录
        // console.log(dir + "  " + parentDir);
        if (parentDir !== "." && directoryStats[parentDir]) {
            directoryStats[parentDir].files += directoryStats[dir].files;
            directoryStats[parentDir].code += directoryStats[dir].code;
            directoryStats[parentDir].comment += directoryStats[dir].comment;
            directoryStats[parentDir].blank += directoryStats[dir].blank;
            directoryStats[parentDir].total += directoryStats[dir].total;
        }
    });
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

        // 打印每个文件的统计信息
        const result = [];
        let languageStats = {};
        const finalResults = [];
        const directoryStats = {};
        const aggregatedDirectoryStats = {};
        //new Map();
        let dirPathSt = [];//用来临时存放文件夹的
        results.forEach(({ extension, codeLines, lineCount, emptyLines, commentLineCount, dirPath }) => {
            const directoryPath = path.dirname(dirPath);
            let relativeDir = path.relative(directory, directoryPath);
            if (relativeDir === '') relativeDir = ".";

            if (!directoryStats[relativeDir]) {
                directoryStats[relativeDir] = {
                    files: 0,
                    code: 0,
                    comment: 0,
                    blank: 0,
                    total: 0
                };
            }
            directoryStats[relativeDir].files++;
            directoryStats[relativeDir].code += codeLines;
            directoryStats[relativeDir].comment += commentLineCount;
            directoryStats[relativeDir].blank += emptyLines;
            directoryStats[relativeDir].total += lineCount;
            // let dirPath1 = path.relative(directory,dirPath);
            // if(dirPath1.includes('\\')){
            //     console.log("不是文件！");
            // }else{
            //     console.log("是文件！");
            // }
            // 获取文件的目录路径
            // const directoryPath = path.dirname(dirPath);
            // let relativeDir2 = directoryPath.replace(directory, '');
            // if (relativeDir2 === '') {
            //     relativeDir2 = ".";
            // } else {
            //     relativeDir2 += "(files)"
            // }
            // // console.log(relativeDir2);
            // if (!directoryStats[relativeDir2]) {
            //     directoryStats[relativeDir2] = {
            //         files: 0,
            //         code: 0,
            //         comment: 0,
            //         blank: 0,
            //         total: 0,
            //     };
            // }

            // directoryStats[relativeDir2].files++;
            // directoryStats[relativeDir2].code += codeLines;
            // directoryStats[relativeDir2].comment += commentLineCount;
            // directoryStats[relativeDir2].blank += emptyLines;
            // directoryStats[relativeDir2].total += lineCount;

            // let parentDir = relativeDir2;


            // let parts = parentDir.split("\\");
            // let extractedPathParts = parts.slice(0, parts.length - 1);

            // // 将数组元素重新组合成字符串
            // let extractedPath = extractedPathParts.join("\\");

            // // console.log(extractedPath);
            // while (extractedPath) {
            //     let extractedPath1 = extractedPath;
            //     directoryStats[extractedPath1] = {
            //         files: 0,
            //         code: 0,
            //         comment: 0,
            //         blank: 0,
            //         total: 0,
            //     };
            //     // directoryStats[extractedPath1].files += directoryStats[relativeDir2].files;
            //     // directoryStats[extractedPath1].code += directoryStats[relativeDir2].code;
            //     // directoryStats[extractedPath1].comment += directoryStats[relativeDir2].comment;
            //     // directoryStats[extractedPath1].blank += directoryStats[relativeDir2].blank;
            //     // directoryStats[extractedPath1].total += directoryStats[relativeDir2].total;
            //     // console.log(extractedPath1);
            //     let extractedPath2 = extractedPath1;
            //     extractedPath2 += "(files)";
            //     // console.log(extractedPath2);
            //     dirPathSt.push({
            //         extractedPath1: extractedPath1,
            //         relativeDir2: relativeDir2,
            //         extractedPath2: extractedPath2,

            //     });
            //     // directoryStats[extractedPath1].files += directoryStats[extractedPath2].files;
            //     // directoryStats[extractedPath1].code += directoryStats[extractedPath2].code;
            //     // directoryStats[extractedPath1].comment += directoryStats[extractedPath2].comment;
            //     // directoryStats[extractedPath1].blank += directoryStats[extractedPath2].blank;
            //     // directoryStats[extractedPath1].total += directoryStats[extractedPath2].total;
            //     parts = extractedPath.split("\\");
            //     extractedPathParts = parts.slice(0, parts.length - 1);
            //     extractedPath = extractedPathParts.join("\\");
            // }
            // while (parentDir && parentDir !== "." && parentDir !== path.parse(directory).root) {
            //     parentDir = path.dirname(parentDir);
            //     console.log("Current parentDir:", parentDir);

            //     if (!directoryStats[parentDir]) {
            //         directoryStats[parentDir] = {
            //             files: 0,
            //             code: 0,
            //             comment: 0,
            //             blank: 0,
            //             total: 0,
            //         };
            //     }

            //     directoryStats[parentDir].files++;
            //     directoryStats[parentDir].code += codeLines;
            //     directoryStats[parentDir].comment += commentLineCount;
            //     directoryStats[parentDir].blank += emptyLines;
            //     directoryStats[parentDir].total += lineCount;
            //     if (parentDir === path.parse(directory).root) {
            //         break;
            //     }
            // }
            // 如果目录统计数据中还没有这个目录，初始化它
            // if (!directoryStats.has(directoryPath)) {
            //     directoryStats.set(directoryPath, { files: 0, code: 0, comment: 0, blank: 0, total: 0 });
            // }

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
        Object.keys(directoryStats).forEach(dir => {
            aggregatedDirectoryStats[dir] = { ...directoryStats[dir] };
        });
        mergeSubdirectories(aggregatedDirectoryStats);
        const combinedStats = [];
        Object.keys(aggregatedDirectoryStats).forEach(dir => {
            // combinedStats.push({
            //     directory: dir,
            //     isDirect: false,
            //     ...aggregatedDirectoryStats[dir],
            // });

            // if (directoryStats[dir]) {
            //     combinedStats.push({
            //         directory: `${dir} (files)`,
            //         isDirect: true,
            //         ...directoryStats[dir],
            //     });
            // }
            const direct = directoryStats[dir];
            const aggregated = aggregatedDirectoryStats[dir];

            // 如果直接统计和汇总统计一致，只保留汇总
            if (
                direct &&
                direct.files === aggregated.files &&
                direct.code === aggregated.code &&
                direct.comment === aggregated.comment &&
                direct.blank === aggregated.blank &&
                direct.total === aggregated.total
            ) {
                combinedStats.push({
                    directory: dir,
                    ...aggregated,
                });
            } else {
                // 汇总统计
                combinedStats.push({
                    directory: dir,
                    ...aggregated,
                });

                // 直接统计
                if (direct) {
                    combinedStats.push({
                        directory: `${dir} (files)`,
                        ...direct,
                    });
                }
            }
        });
        let ttue = [];
        // console.log(dirPathSt);

        // dirPathSt.forEach(obj => {
        //     if (!ttue[obj.extractedPath2]) {
        //         directoryStats[obj.extractedPath1].files += directoryStats[obj.relativeDir2].files + directoryStats[obj.extractedPath2].files;
        //         directoryStats[obj.extractedPath1].code += directoryStats[obj.relativeDir2].code + directoryStats[obj.extractedPath2].code;
        //         directoryStats[obj.extractedPath1].comment += directoryStats[obj.relativeDir2].comment + directoryStats[obj.extractedPath2].comment;
        //         directoryStats[obj.extractedPath1].blank += directoryStats[obj.relativeDir2].blank + directoryStats[obj.extractedPath2].blank;
        //         directoryStats[obj.extractedPath1].total += directoryStats[obj.relativeDir2].total + directoryStats[obj.extractedPath2].total;
        //         ttue[obj.extractedPath2] = true;
        //     } else {
        //         directoryStats[obj.extractedPath1].files += directoryStats[obj.relativeDir2].files;
        //         directoryStats[obj.extractedPath1].code += directoryStats[obj.relativeDir2].code;
        //         directoryStats[obj.extractedPath1].comment += directoryStats[obj.relativeDir2].comment;
        //         directoryStats[obj.extractedPath1].blank += directoryStats[obj.relativeDir2].blank;
        //         directoryStats[obj.extractedPath1].total += directoryStats[obj.relativeDir2].total;
        //     }
        // })

        if (!showSummary) {
            // 打印表头
            outputText += "\n= = = = = = 文件统计信息 = = = = = =\n";
            outputText += generateFilesTable(result, directory);
        }
        let dirPathStats = [];
        for (const directory1 in directoryStats) {
            if (directoryStats.hasOwnProperty(directory1)) {
                dirPathStats.push({
                    directory1,
                    files: directoryStats[directory1].files,
                    code: directoryStats[directory1].code,
                    comment: directoryStats[directory1].comment,
                    blank: directoryStats[directory1].blank,
                    total: directoryStats[directory1].total
                });
            }
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
        output += "= = = = = = 目录 = = = = = =\n";;
        output += generateFolderTable(combinedStats)
        output += "\n\n= = = = = = 编程语言 = = = = = =\n";
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