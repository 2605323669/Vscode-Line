const readDirectory = require("./readDirectory");
const fs = require("fs")
const promptSync = require('prompt-sync')();
// 可以通过执行命令传入目录参数  
const params = process.argv.slice(2);  // 使用 slice 而不是 splice，第二个参数是传入的目录路径
const showSummary = params.includes("--summary");
const filePath = params[0];
console.log("请输入要排除的目录或文件（输入 'done' 结束）：");
let userExcludeDirs = [];
let input = "";
do {
    input = promptSync();
    if (input !== "done") {
        userExcludeDirs.push(input);
    }
} while (input !== "done");
try {
    if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isDirectory()) {
        console.error('没有提供路径或路径不存在！请检查！');
        process.exit(1);  // 如果没有提供目录路径，则退出程序  
    }
} catch (error) {
    console.error('路径验证时出现错误:', error.message);
    process.exit(1);
}
console.log(userExcludeDirs);
readDirectory.calculateTotalLines(filePath, showSummary, userExcludeDirs);