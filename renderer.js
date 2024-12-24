// 定义语言选项数据
const languages = [
    { value: 'all', label: '所有文件类型' },
    { value: 'js', label: 'JavaScript' },
    { value: 'py', label: 'Python' },
    { value: 'java', label: 'Java' }, // 可扩展其他语言
    { value: 'xml', label: 'XML' },
    { value: 'html', label: 'HTML' },
    { value: 'lua', label: 'Lua' },
    { value: 'cs', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'css', label: 'CSS' },
    { value: 'vue', label: 'Vue' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'go', label: 'Go' },
    { value: 'rs', label: 'Rust' },
];

// 动态渲染语言选项到 <select> 中
function renderLanguageOptions() {
    const languageSelect = document.getElementById('language-select'); // 获取 <select> 元素

    if (!languageSelect) {
        console.error('language-select element not found');
        return;
    }

    // 清空原有选项（如果有）
    languageSelect.innerHTML = '';

    // 动态添加 <option> 元素
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.value;       // 设置 <option> 的 value
        option.textContent = lang.label; // 设置显示的文本内容
        languageSelect.appendChild(option); // 将 <option> 添加到 <select> 中
    });

    console.log('Language options rendered successfully!');
}

// 表格切换逻辑
function setupTableSwitching() {
    const switchButtons = document.querySelectorAll('.table-switch');
    const tables = document.querySelectorAll('.table-container');

    switchButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTable = button.getAttribute('data-table');

            // 隐藏所有表格
            tables.forEach(table => {
                table.style.display = 'none';
            });

            // 显示目标表格
            document.getElementById(targetTable).style.display = 'block';
        });
    });
}

// 在页面加载完成后执行渲染
window.onload = () => {
    renderLanguageOptions(); // 调用渲染函数
    setupTableSwitching(); // 初始化表格切换逻辑
};

// 更新页面上显示的路径
function updateSelectedPath(path) {
    const selectedPathDiv = document.getElementById('selected-path');
    selectedPathDiv.textContent = `当前选择路径: ${path}`;
}

// 点击选择文件按钮，调用文件选择功能
document.getElementById('select-file').addEventListener('click', async () => {
    try {
        // 调用 preload.js 中暴露的 selectFile 方法
        const filePaths = await window.electron.selectFile();
        if (filePaths && filePaths.length > 0) {
            console.log('Selected file: ', filePaths[0]);
            updateSelectedPath(filePaths[0]);
            countLines(filePaths[0]);
        } else {
            console.log('No file selected.');
            updateSelectedPath('无');
        }
    } catch (error) {
        console.error('Error selecting file:', error);
    }
});

// 点击选择目录按钮，调用目录选择功能
document.getElementById('select-dir').addEventListener('click', async () => {
    try {
        // 调用 preload.js 中暴露的 selectDir 方法
        const dirPaths = await window.electron.selectDir();
        if (dirPaths && dirPaths.length > 0) {
            console.log('Selected directory: ', dirPaths[0]);
            updateSelectedPath(dirPaths[0]);
            countLines(dirPaths[0]);
        } else {
            console.log('No directory selected.');
            updateSelectedPath('无');
        }
    } catch (error) {
        console.error('Error selecting directory:', error);
    }
});

async function countLines(filePath) {
    console.log();
    const [totalLines, combinedStats, finalResults] = await window.electron.calculateTotalLines(filePath);

    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';

    // 遍历 totalLines 数组，每个元素包含一个文件的统计信息
    totalLines.forEach(fileStats => {
        // 提取每个文件的统计信息
        const {
            dirPath,
            codeLines,
            commentLineCount,
            emptyLines,
            lineCount,
            extension
        } = fileStats;

        // 创建一个新的表格行
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dirPath}</td>
            <td>${extension}</td>
            <td>${codeLines}</td>
            <td>${commentLineCount}</td>
            <td>${emptyLines}</td>
            <td>${lineCount}</td>
        `;
        fileList.appendChild(row); // 将新行添加到表格中
    });


    const fileDetailsList = document.getElementById('file-details-list');
    fileDetailsList.innerHTML = '';

    // 遍历 totalLines 数组，每个元素包含一个文件的统计信息
    combinedStats.forEach(fileStats => {
        // 提取每个文件的统计信息
        const {
            directory,
            files,
            code,
            comment,
            blank,
            total
        } = fileStats;

        // 创建一个新的表格行
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${directory}</td>
                <td>${files}</td>
                <td>${code}</td>
                <td>${comment}</td>
                <td>${blank}</td>
                <td>${total}</td>
            `;
        fileDetailsList.appendChild(row); // 将新行添加到表格中
    });


    const languageList = document.getElementById('language-list');
    languageList.innerHTML = '';

    // 遍历 totalLines 数组，每个元素包含一个文件的统计信息
    finalResults.forEach(fileStats => {
        // 提取每个文件的统计信息
        const {
            language,
            files,
            codeLines,
            commentLineCount,
            emptyLines,
            lineCount
        } = fileStats;

        // 创建一个新的表格行
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${language}</td>
                <td>${files}</td>
                <td>${codeLines}</td>
                <td>${commentLineCount}</td>
                <td>${emptyLines}</td>
                <td>${lineCount}</td>
            `;
        languageList.appendChild(row); // 将新行添加到表格中
    });
}