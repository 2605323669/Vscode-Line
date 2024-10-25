const fs = require("fs") //导入文件系统模块
const path = require("path")
// 从命令行参数获取目录路径 

const params = process.argv.slice(2); // 忽略前两个参数（node 和 脚本名）  
const srcDir = params[0] ? path.resolve(params[0]) : process.cwd(); // 如果没有提供路径，则使用当前工作目录

// console.log("执行成功")

function getAllFiles(filePath) {
    let allFilePaths = [];
    if (fs.existsSync(filePath)) {
        const files = fs.readdirSync(filePath);
        for (let i = 0; i < files.length; i++) {
            let file = files[i]; // 文件名称（不包含文件路径）
            let currentFilePath = path.join(filePath, file); // 使用 path.join 来处理路径拼接
            let stats = fs.lstatSync(currentFilePath);
            if (stats.isDirectory()) {
                allFilePaths = allFilePaths.concat(getAllFiles(currentFilePath));
            } else {
                allFilePaths.push(currentFilePath);
            }
        }
    } else {
        console.warn(`指定的目录${filePath}不存在！`);
    }

    return allFilePaths;
}
function main() {
    console.log(srcDir);
    let allFiles = getAllFiles(srcDir);//获取当前文件夹下所有文件信息
    // console.log(allFiles);
    console.log(`文件数量:${allFiles.length}`);
    for (let i = 0; i < allFiles.length; i++) {//遍历所有文件
        let currentFilePath = allFiles[i]; 
        console.log(currentFilePath);
    }
}
main();