const fs = require('fs');

// 统计数据
const result = [
  {
    dirPath: 'D:\\zuoye\\Vscode-Line\\ceshi.js',
    extension: 'JavaScript',
    codeLines: 41,
    commentLineCount: 14,
    emptyLines: 10,
    lineCount: 65
  },
  {
    dirPath: 'D:\\zuoye\\Vscode-Line\\code_line\\blackList.js',
    extension: 'JavaScript',
    codeLines: 7,
    commentLineCount: 12,
    emptyLines: 0,
    lineCount: 19
  },
  {
    dirPath: 'D:\\zuoye\\Vscode-Line\\code_line\\commentPatterns.js',
    extension: 'JavaScript',
    codeLines: 74,
    commentLineCount: 0,
    emptyLines: 0,
    lineCount: 74
  },
  {
    dirPath: 'D:\\zuoye\\Vscode-Line\\code_line\\fileCounter.js',
    extension: 'JavaScript',
    codeLines: 57,
    commentLineCount: 61,
    emptyLines: 7,
    lineCount: 125
  },
  {
    dirPath: 'D:\\zuoye\\Vscode-Line\\code_line\\readDirectory.js',
    extension: 'JavaScript',
    codeLines: 409,
    commentLineCount: 102,
    emptyLines: 53,
    lineCount: 564
  },
  {
    dirPath: 'D:\\zuoye\\Vscode-Line\\index.js',
    extension: 'JavaScript',
    codeLines: 97,
    commentLineCount: 28,
    emptyLines: 11,
    lineCount: 136
  }
];

const combinedStats = [
  {
    directory: '.(files)',
    files: 2,
    code: 138,
    comment: 42,
    blank: 21,
    total: 201
  },
  {
    directory: 'code_line',
    files: 4,
    code: 547,
    comment: 175,
    blank: 60,
    total: 782
  }
];

const finalResults = [
  {
    language: 'JavaScript',
    files: 6,
    codeLines: 685,
    commentLineCount: 217,
    emptyLines: 81,
    lineCount: 983
  }
];

// 格式化输出函数，增加对齐的控制
function formatRow(data, columnsWidth) {
  return data.map((item, index) => {
    const strItem = String(item);
    const padLength = columnsWidth[index] - strItem.length;
    return strItem + ' '.repeat(padLength);
  }).join(' | ');
}

// 获取列宽度
function getColumnsWidth(headers, rows) {
  const columnsWidth = headers.map((header, index) => {
    let maxLength = header.length;
    rows.forEach(row => {
      const cellLength = String(row[index]).length;
      maxLength = Math.max(maxLength, cellLength);
    });
    return maxLength;
  });
  return columnsWidth;
}

// 写入文件
function writeToFile(filename) {
  const fileContent = [];

  // 表头
  const header1 = ['File Path', 'Extension', 'Code Lines', 'Comment Lines', 'Empty Lines', 'Total Lines'];
  const header2 = ['Directory', 'Files', 'Code', 'Comment', 'Blank', 'Total'];
  const header3 = ['Language', 'Files', 'Code Lines', 'Comment Line Count', 'Empty Lines', 'Line Count'];

  // 获取列宽
  const row1Width = getColumnsWidth(header1, result.map(item => [item.dirPath, item.extension, item.codeLines, item.commentLineCount, item.emptyLines, item.lineCount]));
  const row2Width = getColumnsWidth(header2, combinedStats.map(item => [item.directory, item.files, item.code, item.comment, item.blank, item.total]));
  const row3Width = getColumnsWidth(header3, finalResults.map(item => [item.language, item.files, item.codeLines, item.commentLineCount, item.emptyLines, item.lineCount]));

  // 格式化表头和数据
  fileContent.push(formatRow(header1, row1Width));
  fileContent.push('-'.repeat(fileContent[0].length));
  result.forEach(item => {
    fileContent.push(formatRow([item.dirPath, item.extension, item.codeLines, item.commentLineCount, item.emptyLines, item.lineCount], row1Width));
  });
  fileContent.push('');

  fileContent.push(formatRow(header2, row2Width));
  fileContent.push('-'.repeat(fileContent[0].length));
  combinedStats.forEach(item => {
    fileContent.push(formatRow([item.directory, item.files, item.code, item.comment, item.blank, item.total], row2Width));
  });
  fileContent.push('');

  fileContent.push(formatRow(header3, row3Width));
  fileContent.push('-'.repeat(fileContent[0].length));
  finalResults.forEach(item => {
    fileContent.push(formatRow([item.language, item.files, item.codeLines, item.commentLineCount, item.emptyLines, item.lineCount], row3Width));
  });

  // 写入文件
  fs.writeFileSync(filename, fileContent.join('\n'), 'utf8');
  console.log(`文件已保存到 ${filename}`);
}

// 调用函数
writeToFile('output.txt');