const fs = require("fs")
const commentPatterns = require("./commentPatterns");
const path = require("path")
/**
 * 用来统计代码行量
 * @param {*} dirPath 
 */
// 根据文件类型选择适当的注释正则表达式
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

function countLinesInDirectory(dirPath) {
    return new Promise((resolve, reject) => {
        let emptyLines = 0;
        let codeLines = 0;
        let commentLineCount = 0;//注释行数
        let inBlockComment = null; // 用于存储当前块注释的结束标记

        // 读取文件并统计行数  
        fs.readFile(dirPath, 'utf8', (err, data) => {
            if (err) {
                return reject(new Error(`无法读取文件: ${err.message}`));
            }
            try {
                const languageConfig = getCommentPatternsByExtension(dirPath);
                const lineComments = languageConfig.lineComments || [];
                const blockComments = languageConfig.blockComments || [];
                const lines = data.split('\n');

                for (let line of lines) {
                    line = line.trim();

                    if (line === '') {
                        if (!inBlockComment) {
                            emptyLines++;
                        } else {
                            commentLineCount++;
                        }
                        continue;
                    }

                    // 如果在多行注释内
                    if (inBlockComment) {
                        commentLineCount++;

                        if (line.includes(inBlockComment)) {
                            inBlockComment = null;
                        }
                        continue;
                    }
                    let isHandled = false; 
                    if (blockComments.length > 0) {
                        for (const [start, end] of blockComments) {
                            const blockStartIndex = line.indexOf(start);
                            const blockEndIndex = line.indexOf(end);
                            if (blockStartIndex !== -1) {
                                commentLineCount++;
                                if (blockStartIndex > 0) {
                                    commentLineCount--;
                                    codeLines++; // 代码部分
                                    inBlockComment = end; // 进入块注释模式

                                }
                                else {
                                    inBlockComment = end;
                                }

                                // 如果块注释起始标记和结束标记在同一行
                                if (blockEndIndex > blockStartIndex) {
                                    inBlockComment = null; // 结束块注释

                                }
                                isHandled = true; // 当前行已处理
                                break;
                            }
                        }
                    }
                    // 检查是否为单行注释
                    if (!isHandled && lineComments.some(comment => line.startsWith(comment))) {
                        commentLineCount++;
                        isHandled = true;
                    }
                    // 如果既不是注释也不是空行，则为代码行
                    if (!isHandled) {
                        codeLines++;
                    }
                }
                const extension = dirPath.slice(dirPath.lastIndexOf('.') + 1);
                let lineCount = emptyLines + commentLineCount + codeLines;
                resolve({
                    extension,
                    dirPath,
                    lineCount,
                    emptyLines,
                    commentLineCount,
                    codeLines
                });//不能用return 因为fs.readFile是异步操作，用Promise和async来处理


                // // let a = 0;
                // const lineCount = data.split('\n').length;

                // const lines = data.split('\n');
                // const patterns = getCommentPatternsByExtension(dirPath);
                // lines.forEach(line => {
                //     //trim()方法将空白字符转换为空字符串
                //     if (line.trim() === '') {
                //         emptyLines++;
                //     }
                //     else {
                //         if (patterns.singleLine) {
                //             if (line.trim().match(patterns.singleLine)) {
                //                 // console.log(line.trim().match(patterns.singleLine));
                //                 commentLineCount++;
                //             }
                //         }
                //     }
                // });
                // //多行注释行数统计
                // if (patterns.multiLine) {
                //     // const cleanedCode = data.replace(patterns.regex, ''); 
                //     // console.log(cleanedCode);

                //     let multiLineComments;
                //     if (patterns.xml) {
                //         let allComments = data.match(patterns.multiLine) || [];
                //         multiLineComments = allComments.filter(comment => comment.includes("\n")); // 筛选出多行注释
                //     } else {
                //         multiLineComments = data.match(patterns.multiLine) || [];
                //     }
                //     // let a = 0;
                //     // const multiLineComments = allComments.filter(comment => comment.includes("\n")); // 筛选出多行注释
                //     // console.log(multiLineComments);
                //     multiLineComments.forEach(comment => {
                //         // console.log(comment);
                //         const nonEmptyLines = comment.split('\n').filter(line => line.trim() !== '').length;//解决多行注释中有单行注释的问题。
                //         commentLineCount += comment.split('\n').length;
                //         emptyLines -= comment.split('\n').length - nonEmptyLines;
                //     });
                // }
                // codeLines = lineCount - emptyLines - commentLineCount;
                // const extension = dirPath.slice(dirPath.lastIndexOf('.') + 1);
                // resolve({
                //     extension,
                //     dirPath,
                //     lineCount,
                //     emptyLines,
                //     commentLineCount,
                //     codeLines
                // });//不能用return 因为fs.readFile是异步操作，用Promise和async来处理
            } catch (error) {
                reject(new Error(`在处理文件 ${dirPath} 时发生错误: ${err.message}`));
            }

        });
    });
}
module.exports = {
    countLinesInDirectory
}