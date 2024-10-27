const fs = require("fs")
const path = require("path")

filePath = "F:\\node_pkg"
function countLinesInDirectory(dirPath) {
    // 读取文件并统计行数  
    fs.readFile(dirPath, 'utf8', (err, data) => {
        if (err) {
            return console.error(`无法读取文件: ${err}`);
        }
        const lineCount = data.split('\n').length;
        console.log(`文件: ${dirPath} 行数: ${lineCount}`);
    });
}