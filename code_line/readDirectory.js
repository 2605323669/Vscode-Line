const fs = require("fs")
const path = require("path")
const countLines = require("./fileCounter")
const validFileExtensions = ['.js', '.py', '.java', '.xml', '.html', '.lua', '.cs', '.php', '.css'];

function findFiles(filePath) {
    if (fs.existsSync(filePath)) {//判断文件目录是否存在
        let stats = fs.statSync(filePath)//获取文件信息
        if (stats.isDirectory()) {
            const files = fs.readdirSync(filePath)//返回目录下文件数组列表[ '.git', 'app.js', 'code_line', 'read.js', 'README.md' ]
            for (let i = 0; i < files.length; i++) {
                let currentFilePath = path.join(filePath, files[i])//处理路径拼接
                stats = fs.statSync(currentFilePath)//获取文件信息
                if (stats.isDirectory()) {//判断是否为目录
                    findFiles(currentFilePath);
                } else {
                    const ext = path.extname(currentFilePath);
                    if (validFileExtensions.includes(ext))
                        countLines.countLinesInDirectory(currentFilePath)
                }
            }
        } else if (stats.isFile()) {
            countLines.countLinesInDirectory(filePath)
        }
    } else {
        console.log("您输入的目录不存在！")
    }
}


module.exports = { findFiles };