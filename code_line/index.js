const readDirectory = require("./readDirectory");
const fs = require("fs")
// 可以通过执行命令传入目录参数  
const params = process.argv.slice(2);  // 使用 slice 而不是 splice，第二个参数是传入的目录路径
const filePath = params[0];
// const filePath = "F:\\毕业设计\\毕业设计\\毕业设计2"
// const filePath = "C:\\Users\\86158\\Desktop\\开源软件\\Test"
// "F:\\node_pkg"
// F:\\毕业设计\\毕业设计\\毕业设计2
//C:\Users\86158\Desktop\开源软件\Test
//C:\Users\86158\Desktop\开源软件\Test\example.pys   F:\毕业设计\鸡哥\webgradesign
const showSummary = params.includes("--summary");
// readDirectory.calculateTotalLines(filePath, showSummary);
if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isDirectory()) {
    console.error('没有提供路径或路径不存在！请检查！');
    process.exit(1);  // 如果没有提供目录路径，则退出程序  
}
readDirectory.calculateTotalLines(filePath, showSummary);