#!/usr/bin/env node
const { mainModule } = require("process");
const readDirectory = require("./code_line/readDirectory");
const fs = require("fs")
const promptSync = require('prompt-sync')();

/**
 * 统一处理错误，并提供更友好的错误信息
 * @param {*} message --错误信息
 */
function handleError(message) {
    console.error(`错误：${message}。请检查命令行参数或使用 node index --help 查看帮助信息。`);
    process.exit(1);
}

/**
 * 打印程序的使用帮助信息，提供命令行参数的说明。
 */
function printHelp() {
    console.log("用法: node index <路径> [--summary] [--export] [--exclude <排除目录1> <排除目录2> ...] [--type <文件类型>]");
    console.log("  --summary       简化输出结果");
    // console.log("  --export       导出结果到文件");
    console.log("  --exclude      排除指定目录");
    console.log("  --type         指定文件类型");
    console.log("  --help         显示帮助信息");
}

/**
 * 解析命令行参数
 * @param {string[]} args - 命令行参数
 * @returns {{ filePath: string, showSummary: boolean, exportResult: boolean, exclude: boolean, userExcludeDirs: string[], fileTypes: string[] }}
 */
function parseArguments(args) {
    const params = args.slice(2);
    const filePath = params[0];
    let showSummary = false;
    let exportResult = false;
    let exclude = false;
    let userExcludeDirs = [];
    let fileTypes = [];

    if (filePath === "--help" && params.length === 1) {
        printHelp();
        process.exit(1);
    } else if (params.includes("--help")) {
        handleError(`含有无效的参数`);
    }

    for (let i = 1; i < params.length; i++) {
        const param = params[i];
        if (param === "--help") {
            help = true;
            break;
        } else if (param === "--summary") {
            showSummary = true;
        } else if (param === "--export") {
            exportResult = true;
        } else if (param === "--type") {
            let isType = false;
            while (i + 1 < params.length && !params[i + 1].startsWith("--")) {
                isType = true;
                fileTypes.push(params[++i]);
            }
            if (!isType) {
                handleError(`type后面未跟指定类型文件`);
            }
        } else if (param === "--exclude") {
            exclude = true;
            while (i + 1 < params.length) {
                if (!params[i + 1].startsWith("--")) {
                    userExcludeDirs.push(params[++i]);
                } else {
                    break;
                }
            }
        } else {
            handleError(`无效的参数 '${param}'`);
        }
    }
    return { filePath, showSummary, exportResult, exclude, userExcludeDirs, fileTypes };
}

/**
 * 验证解析后的参数是否有效
 * @param {string} filePath - 文件路径
 * @returns {boolean}
 */
function validateArguments(filePath) {
    if (!filePath || !fs.existsSync(filePath) || (!fs.statSync(filePath).isDirectory() && !fs.statSync(filePath).isFile())) {
        return false;
    }
    return true;
}

/**
 * 解析排除目录参数
 * @param {boolean} exclude - 是否排除目录
 * @returns {string[]} - 用户输入的排除目录列表
 */
function parseExcludeDirectories(exclude) {
    let userExcludeDirs = [];
    if (exclude) {
        console.log("请输入要排除的目录或文件（输入 'done' 结束）：");
        const input = promptSync();
        do {
            if (input !== "done") {
                userExcludeDirs.push(input);
            }
        } while (input !== "done");
    }
    return userExcludeDirs;
}

/**
 * 项目的入口
 */
function main() {
    // 解析命令行参数
    const { filePath, showSummary, exportResult, exclude, userExcludeDirs, fileTypes } = parseArguments(process.argv);

    // 验证路径
    if (!validateArguments(filePath)) {
        console.error('没有提供路径或路径不存在！请检查！');
        process.exit(1);
    }

    // 解析排除目录参数
    if (exclude && !userExcludeDirs) {
        const finalExcludeDirs = parseExcludeDirectories(exclude);
        readDirectory.calculateTotalLines(filePath, showSummary, finalExcludeDirs, exportResult, fileTypes);
    } else {
        readDirectory.calculateTotalLines(filePath, showSummary, userExcludeDirs, exportResult, fileTypes);
    }
}
// function getConfig() {
//     // 读取文件，这里使用同步读取只是为了示例简单化
//     const rawdata = fs.readFileSync('config.json');
//     const config = JSON.parse(rawdata);
//     return config;
// }

// function main() {
//     const config = getConfig();

//     // 验证路径
//     if (!validateArguments(config.filePath)) {
//         console.error('没有提供路径或路径不存在！请检查！');
//         process.exit(1);
//     }

//     // 使用配置中的数据
//     readDirectory.calculateTotalLines(config.filePath, config.showSummary, config.userExcludeDirs, config.exportResult, config.fileTypes);
// }

main();