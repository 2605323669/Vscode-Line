const fs = require("fs")
const path = require("path")
const countLines = require("./fileCounter")

filePath = "C:\\Users\\86158\\Desktop\\开源软件\\Test\\example.css"

function findFiles(filePath) {
    console.log(filePath)
    // if (fs.existsSync(filePath)) {//判断文件目录是否存在
    //     console.log("路径存在！")
    //     const files = fs.readdirSync(filePath)//返回目录下文件数组列表[ '.git', 'app.js', 'code_line', 'read.js', 'README.md' ]
    //     console.log(files)
    //     for (let i = 0; i < files.length; i++) {
    //         // console.log(files[i])
    //         let currentFilePath = path.join(filePath, files[i])
    //         console.log(currentFilePath)
    //         let stats = fs.statSync(currentFilePath)//获取文件信息
    //         if (stats.isDirectory()) {//判断是否为目录
    //             findFiles(currentFilePath);
    //         } else {
    //             countLines.countLinesInDirectory(currentFilePath)
    //         }
    //     }
    // } else {
    //     console.log("您输入的目录不存在！")
    // }
    countLines.countLinesInDirectory(filePath)
}

findFiles(filePath)