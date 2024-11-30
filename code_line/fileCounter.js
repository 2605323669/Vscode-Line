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

        // 读取文件并统计行数  
        fs.readFile(dirPath, 'utf8', (err, data) => {
            if (err) {
                return reject(new Error(`无法读取文件: ${err.message}`));
            }
            try {
                const lineCount = data.split('\n').length;
                const lines = data.split('\n');
                const patterns = getCommentPatternsByExtension(dirPath);
                lines.forEach(line => {
                    //trim()方法将空白字符转换为空字符串
                    if (line.trim() === '') emptyLines++;
                    else {
                        if (patterns.singleLine) {
                            if (line.trim().match(patterns.singleLine)) {
                                commentLineCount++;
                            }
                        }
                    }
                });
                // /<!--[^]*?\n[^]*?-->/g,
                // /<!--[^]*?\n[^]*?-->/g
                //多行注释行数统计
                if (patterns.multiLine) {
                    // const cleanedCode = data.replace(patterns.regex, ''); 
                    // console.log(cleanedCode);
                    const allComments = data.match(patterns.multiLine) || [];
                    // console.log(multiLineComments);
                    let a = 0;
                    multiLineComments.forEach(comment => {
                        // console.log(comment);
                        commentLineCount += comment.split('\n').length;
                        // console.log(a + "          " + comment + "          " + commentLineCount);
                        //  a++;
                    });
                }
                codeLines = lineCount - emptyLines - commentLineCount;
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