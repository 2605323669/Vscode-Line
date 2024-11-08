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
        console.error(`未找到与.${fileExtension}文件匹配的注释模式`);
        return {};
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
                return console.error(`无法读取文件: ${err}`);
            }
            const lineCount = data.split('\n').length;
            const lines = data.split('\n');
            const patterns = getCommentPatternsByExtension(dirPath);
            lines.forEach(line => {
                //trim()方法将空白字符转换为空字符串
                if (line.trim() === '') emptyLines++;
                else {
                    if (patterns.singleLine) {
                        if (line.trim().match(patterns.singleLine)) {
                            // console.log(line);
                            commentLineCount++;
                        }
                        // if (patterns.regex1) { //用来处理lua文件 --               --[[--]]
                        //     if (line.trim().match(patterns.regex1) || line.trim().match(patterns.regex2)) {
                        //         commentLineCount--;
                        //     }
                        // }
                    }
                }
            });

            // 单行注释行数统计
            // if (patterns.singleLine) {
            //     const singleLineComments = data.match(patterns.singleLine) || [];
            //     commentLineCount += singleLineComments.length;
            //     console.log(`${singleLineComments}`);
            // }

            //多行注释行数统计
            if (patterns.multiLine) {
                const multiLineComments = data.match(patterns.multiLine) || [];
                multiLineComments.forEach(comment => {
                    // if (patterns.xml) {//xml文件处理，需要优化
                    //     if (comment.split('\n').length != 1) {
                    //         commentLineCount += comment.split('\n').length - 1;//-1是因为xml文件中匹配单行的时候增加了
                    //     }
                    // } else {
                    //     commentLineCount += comment.split('\n').length;
                    // }
                    // console.log(comment);
                    // console.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
                    commentLineCount += comment.split('\n').length;
                });
            }
            codeLines = lineCount - emptyLines - commentLineCount;
            // console.log('rootDir:', rootDir);
            // console.log('dirPath:', dirPath);
            // const relativePath = path.relative(rootDir, dirPath);
            // if (!showSummary)
            // console.log(`文件: ${relativePath} 总行数: ${lineCount}  空行数: ${emptyLines} 注释行数: ${commentLineCount} 有效代码行数: ${codeLines} `);
            const extension = dirPath.slice(dirPath.lastIndexOf('.') + 1);
            resolve({
                extension,
                dirPath,
                lineCount,
                emptyLines,
                commentLineCount,
                codeLines
            });//不能用return 因为fs.readFile是异步操作，用Promise和async来处理
        });
    });
}
module.exports = {
    countLinesInDirectory
}