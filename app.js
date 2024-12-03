const fs = require("fs")
// function parseComments(text, languageConfig) {
//     const lineComments = languageConfig.lineComments || [];
//     const blockComments = languageConfig.blockComments || [];

//     let commentCount = 0;
//     let codeCount = 0;
//     let blankCount = 0;
//     let inBlockComment = false;

//     const lines = text.split('\n');
//     let a = 0
//     for (let line of lines) {
//         line = line.trim();
//         a++
//         // 跳过空行
//         if (line === '') {
//             if (!inBlockComment) {
//                 blankCount++;
//             } else {
//                 commentCount++;
//             }
//             continue;
//         }

//         // 如果处于多行注释状态
//         if (inBlockComment) {
//             commentCount++;
//             if (line.includes(blockComments[0][1])) {
//                 inBlockComment = false; // 结束块注释
//             }
//             // console.log(a + " " + commentCount);
//             continue;
//         }

//         // 检查单行注释
//         if (lineComments.some(comment => line.startsWith(comment))) {
//             // console.log(a);
//             commentCount++;
//             continue;
//         }
//         if (blockComments.length > 0) {
//             // 检查多行注释的开始和结束
//             const blockStartIndex = line.indexOf(blockComments[0][0]);
//             const blockEndIndex = line.indexOf(blockComments[0][1]);
//             // console.log(a + " " + blockStartIndex + " " + blockEndIndex);
//             if (blockStartIndex !== -1) {
//                 // console.log(a);
//                 if (blockStartIndex > 0) {
//                     // 如果多行注释开始标记在代码后，分离代码和注释部分
//                     codeCount++; // 代码部分
//                     // console.log(a);
//                     inBlockComment = true; // 进入块注释状态
//                     // commentCount++;
//                 } else {
//                     // 如果是纯注释行的多行注释
//                     inBlockComment = true;
//                     commentCount++;
//                     // console.log(a + " " + commentCount);
//                 }
//                 // 如果多行注释结束标记也在同一行
//                 if (blockEndIndex > blockStartIndex) {
//                     inBlockComment = false;
//                 }
//                 continue;
//             }
//         }

//         // 如果既不是注释也不是空行，则为代码行
//         codeCount++;


//     }

//     return { code: codeCount, comment: commentCount, blank: blankCount };
// }

// 示例：解析一个包含多种注释的 JavaScript 文件
function parseComments(text, languageConfig) {
    const lineComments = languageConfig.lineComments || [];
    const blockComments = languageConfig.blockComments || [];

    let commentCount = 0;
    let codeCount = 0;
    let blankCount = 0;
    let inBlockComment = null; // 用于存储当前块注释的结束标记

    const lines = text.split('\n');
    let a = 0; // 行号

    for (let line of lines) {
        line = line.trim();
        a++;

        // 跳过空行
        if (line === '') {
            if (!inBlockComment) {
                blankCount++;
            } else {
                commentCount++;
            }
            continue;
        }

        // 如果在多行注释内
        if (inBlockComment) {
            commentCount++;
            //  console.log(a);
            if (line.includes(inBlockComment)) {
                // 如果找到了结束标记，退出块注释
                inBlockComment = null;

            }
            continue;
        }

        // // 检查是否为单行注释
        // if (lineComments.some(comment => line.startsWith(comment))) {
        //     commentCount++;
        //     console.log(a);
        //     continue;
        // }
        let isHandled = false; // 标记是否已处理当前行
        // 检查多行注释的开始标记
        if (blockComments.length > 0) {
            for (const [start, end] of blockComments) {
                const blockStartIndex = line.indexOf(start);
                const blockEndIndex = line.indexOf(end);

                if (blockStartIndex !== -1) {
                    commentCount++;
                    // console.log(a + " " + blockStartIndex + " " + blockEndIndex);
                    // 如果块注释起始标记在代码部分之后

                    if (blockStartIndex > 0) {
                        commentCount--;
                        codeCount++; // 代码部分
                        // console.log(a);
                        inBlockComment = end; // 进入块注释模式

                    }
                    else {
                        // 如果整行是块注释
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
            commentCount++;
            isHandled = true;
        }
        // 如果既不是注释也不是空行，则为代码行
        if (!isHandled) {
            // console.log(a);
            codeCount++;
        }
    }

    return { code: codeCount, comment: commentCount, blank: blankCount };
}

// 示例：解析一个包含多种注释的 Python 文件
const languagesConfig = {
    javascript: {
        lineComments: ['//'], // 单行注释
        blockComments: [['/*', '*/']], // 多行注释  未解决问题：如果*/ 和/*在同一行
    },
    python: {
        lineComments: ['#'], // 单行注释
        blockComments: [['\'\'\'', '\'\'\''], ['"""', '"""']], // 多行注释
    },
    java: {
        lineComments: ['//'], // 单行注释
        blockComments: [['/*', '*/']], // 多行注释
    },
    xml: {
        blockComments: [['<!--', '-->']], // 块注释
    },
    html: {
        lineComments: ['//'], // 单行注释
        blockComments: [['<!--', '-->'], ['/*', '*/']], // 块注释
    },
    lua: {
        lineComments: ['--'], // 单行注释
        blockComments: [['--[[', ']]']], // 多行注释
    },
    csharp: {
        lineComments: ['//'], // 单行注释
        blockComments: [['/*', '*/']], // 多行注释
    },
    php: {
        lineComments: ['//', '#'], // 单行注释
        blockComments: [['/*', '*/']], // 多行注释
    },
    css: {
        blockComments: [['/*', '*/']], // 多行注释
    },
    vue: {
        lineComments: ['//'], // 单行注释
        blockComments: [['/*', '*/'], ['<!--', '-->']], // 多行注释和模板注释
    },
    typescript: {
        lineComments: ['//'], // 单行注释
        blockComments: [['/*', '*/']], // 多行注释
    },
    go: {
        lineComments: ['//'], // 单行注释
        blockComments: [['/*', '*/']], // 多行注释
    },
};
const filePath = "C:\\Users\\86158\\Desktop\\开源软件\\Test\\example.lua";

// 执行注释解析

fs.readFile(filePath, 'utf8', (err, data) => {
    const result = parseComments(data, languagesConfig.lua);
    console.log(result);
});