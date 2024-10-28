const fs = require("fs")
/**
 * 用来统计代码行量//
 * @param {*} dirPath 
 */
const commentPatterns = {
    js: {
        singleLine: /\/\/.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//g,
        regex: /^\/\/.*/
    },
    java: {
        singleLine: /\/\/.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//g,
        regex: /^\/\/.*/
    },
    py: {
        singleLine: /#.*$/gm,
        multiLine: /(['"]{3})[\s\S]*?\1/g,
        regex: /^#/
    },
    xml: {
        multiLine: /<!--\s*[\s\S]*?\s*-->/g,
        regex: /^<!/,
        xml: "xml"
    },
    // html: {
    //     singleLine: /\/\/.*$/gm,
    //     multiLine: /<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g
    // },
    // lua: {
    //     singleLine: /--.*$/gm,
    //     multiLine: /--\[\[[\s\S]*?\]\]/g
    // },
    cs: {
        singleLine: /\/\/.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//g,
        regex: /^\/\/.*/
    },
    php: {
        singleLine: /\/\/.*$|#.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//g,
        regex: /^(?:\/\/|\#).*$/
    },
    css: {
        multiLine: /\/\*[\s\S]*?\*\//g
    }
};

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
                codeLines++;
                if (patterns.regex) {
                    if (line.trim().match(patterns.regex)) {
                        console.log(line);
                        commentLineCount++;
                    }
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
                console.log(comment);
                if (patterns.xml) {//xml文件处理，需要优化
                    if (comment.split('\n').length != 1) {
                        commentLineCount += comment.split('\n').length - 1;//-1是因为xml文件中匹配单行的时候增加了
                    }
                } else {
                    commentLineCount += comment.split('\n').length;
                }
            });
        }
        console.log(`文件: ${dirPath} 总行数: ${lineCount}  空行数: ${emptyLines} 注释行数: ${commentLineCount}`);//
    });
}
module.exports = {
    countLinesInDirectory
}