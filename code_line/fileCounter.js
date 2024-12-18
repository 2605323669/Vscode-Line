const fs = require("fs")
const commentPatterns = require("./commentPatterns");
const path = require("path")

/**
 * 根据文件类型选择适当的注释正则表达式
 */
function getCommentPatternsByExtension(fileName) {
    // 提取文件后缀
    const fileExtension = fileName.slice(fileName.lastIndexOf('.') + 1);
    // 查找对应的注释配置
    const patterns = commentPatterns[fileExtension];
    if (!patterns) {
        throw new Error(`.${fileExtension}文件不在统计范围内！`);
    }
    return patterns;
}

/**
 * 核心功能对文件进行代码统计
 */
function countLinesInDirectory(dirPath) {
    return new Promise((resolve, reject) => {
        let emptyLines = 0;
        let codeLines = 0;
        let commentLineCount = 0;//注释行数

        // let data = ''; // 用于存储整个文件内容
        // const stream = fs.createReadStream(dirPath, 'utf8');
        // const reader = readline.createInterface({ input: stream });

        // reader.on('line', (line) => {
        //     data += line + '\n'; // 将每一行追加到数据中，后续用于多行注释匹配
        // });

        // reader.on('close', () => {
        //     try {
        //         const lineCount = data.split('\n').length;//总行数
        //         const patterns = getCommentPatternsByExtension(dirPath);
        //         const updatedContent = data.replace(patterns.multiLine, '/*COMMENT*/');
        //         // const updatedContent = data.replace(patterns.multiLine, (match) => {
        //         //     console.log("Matched Comment:\n", match); // 输出匹配到的字符串
        //         //     return '/*COMMENT*/'; // 替换为占位内容
        //         // });
        //         const lines = updatedContent.split('\n');
        //         const regex = /^\/\*COMMENT\*/;
        //         lines.forEach(line => {
        //             if (line.trim() === '') {
        //                 emptyLines++;
        //             }
        //             // else if (line.trim() !== '/*COMMENT*/') {
        //             else if (!line.trim().match(regex)) {
        //                 if (patterns.singleLine) {
        //                     if (!line.trim().match(patterns.singleLine)) {
        //                         codeLines++;
        //                     }
        //                 }
        //             }
        //         });
        //         commentLineCount = lineCount - emptyLines - codeLines;
        //         const extension = dirPath.slice(dirPath.lastIndexOf('.') + 1);
        //         resolve({
        //             extension,
        //             dirPath,
        //             lineCount,
        //             emptyLines,
        //             commentLineCount,
        //             codeLines
        //         });//不能用return 因为fs.readFile是异步操作，用Promise和async来处理
        //     } catch (error) {
        //         reject(new Error(`在处理文件 ${dirPath} 时发生错误: ${err.message}`));
        //     }
        // });
        // reader.on('error', (err) => {
        //     reject(new Error(`无法读取文件: ${err.message}`));
        // });
        // 读取文件并统计行数  
        fs.readFile(dirPath, 'utf8', (err, data) => {
            if (err) {
                return reject(new Error(`无法读取文件: ${err.message}`));
            }
            try {
                const lineCount = data.split('\n').length;//总行数
                const patterns = getCommentPatternsByExtension(dirPath);
                const updatedContent = data.replace(patterns.multiLine, '/*COMMENT*/');
                // const updatedContent = data.replace(patterns.multiLine, (match) => {
                //     console.log("Matched Comment:\n", match); // 输出匹配到的字符串
                //     return '/*COMMENT*/'; // 替换为占位内容
                // });
                const lines = updatedContent.split('\n');
                const regex = /^\/\*COMMENT\*/;
                lines.forEach(line => {
                    if (line.trim() === '') {
                        emptyLines++;
                    }
                    // else if (line.trim() !== '/*COMMENT*/') {
                    else if (!line.trim().match(regex)) {
                        if (patterns.singleLine) {
                            if (!line.trim().match(patterns.singleLine)) {
                                codeLines++;
                            }
                        }
                    }
                });
                commentLineCount = lineCount - emptyLines - codeLines;
                const extension = dirPath.slice(dirPath.lastIndexOf('.') + 1);
                resolve({
                    extension,
                    dirPath,
                    lineCount,
                    emptyLines,
                    commentLineCount,
                    codeLines
                });//不能用return 因为fs.readFile是异步操作，用Promise和async来处理
            } catch (error) {
                reject(new Error(`在处理文件 ${dirPath} 时发生错误: ${err.message}`));
            }

        });
    });
}

module.exports = {
    countLinesInDirectory
}