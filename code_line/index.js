const readDirectory = require("./readDirectory");
const fs = require("fs")
const promptSync = require('prompt-sync')();

// 可以通过执行命令传入目录参数  
const params = process.argv.slice(2);  // 使用 slice 而不是 splice，第二个参数是传入的目录路径
const filePath = params[0];

if (params.length < 1) {
    console.error('用法: node index <路径> [--summary]');
    process.exit(1);
}

let showSummary = false;
let exportResult = false; // 新增参数，用于控制是否导出结果
let userExcludeDirs = [];
let input = "";

//验证路径
try {
    if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isDirectory()) {
        console.error('没有提供路径或路径不存在！请检查！');
        process.exit(1);  // 如果没有提供目录路径，则退出程序  
    }
} catch (error) {
    console.error('路径验证时出现错误:', error.message);
    process.exit(1);
}

// 处理可选的 --summary 标志和其他参数

// if (params.length > 1) {
//     if (params[1] !== "--summary") {
//         console.error('用法: node index <路径> [--summary]');
//         process.exit(1);
//     } else if (params.length == 2) {
//         showSummary = true;
//     } else {
//         console.error('用法: node index <路径> [--summary] (不应有其他参数)');
//         process.exit(1);
//     }
// }
if (params.length > 1) {
    for (let i = 1; i < params.length; i++) {
        if (params[i] === "--summary") {
            showSummary = true;
        } else if (params[i] === "--export") {
            exportResult = true;
        } else {
            console.error('用法: node index <路径> [--summary] [--export]');
            process.exit(1);
        }
    }
}
console.log("请输入要排除的目录或文件（输入 'done' 结束）：");
do {
    input = promptSync();
    if (input !== "done") {
        userExcludeDirs.push(input);
    }
} while (input !== "done");
// readDirectory.calculateTotalLines(filePath, showSummary, userExcludeDirs);
readDirectory.calculateTotalLines(filePath, showSummary, userExcludeDirs, exportResult);
