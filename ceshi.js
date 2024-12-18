// 计算字符串的实际显示宽度（中文字符占 2 个单位，英文占 1 个单位）
function getDisplayWidth(str) {
  return str.split('').reduce((width, char) => {
    return width + (char.match(/[^\x00-\xff]/) ? 2 : 1); // 中文字符宽度为 2，英文为 1
  }, 0);
}

// 填充字符串到指定宽度，确保中英文混排对齐
function padToWidth(str, targetWidth) {
  const displayWidth = getDisplayWidth(str);
  const padding = targetWidth - displayWidth;
  return str + ' '.repeat(Math.max(0, padding));
}
// 修改的 generateTable 函数
function generateTable(headers, data, columnWidths) {
  // 创建分隔行
  const separator = '+' + columnWidths.map(width => '-'.repeat(width + 2)).join('+') + '+';

  // 创建标题行
  const headerRow = '|' + headers.map((header, index) => ` ${padToWidth(header, columnWidths[index])} `).join('|') + '|';

  // 创建数据行
  const dataRows = data.map(row =>
    '|' + headers.map((header, index) => {
      const key = Object.keys(row).find(k => k === header || k === header.replace(/\s+/g, ''));
      return ` ${padToWidth(String(row[key] || ''), columnWidths[index])} `;
    }).join('|') + '|'
  );

  // 组装表格
  return [separator, headerRow, separator, ...dataRows, separator].join('\n');
}

// 示例数据
const combinedStats = [
  { directory: '.(files)', files: 2, codeLines: 126, comment: 40, emptyLines: 20, total: 186 },
  { directory: 'code_line', files: 4, codeLines: 544, comment: 179, emptyLines: 60, total: 783 }
];

const finalResults = [
  { language: 'JavaScript', files: 6, codeLines: 670, comment: 219, emptyLines: 80, total: 969 }
];

const resulit = [
  { language: 'js', dirPath: 'code_line\\readDirectory.js', codeLines: 565, comment: 53, emptyLines: 106, total: 406 },
  { language: 'js', dirPath: 'index.js', codeLines: 136, comment: 11, emptyLines: 28, total: 97 }
];

// 显示 combinedStats 表格
const combinedStatsHeaders = ['directory', 'files', 'codeLines', 'comment', 'emptyLines', 'total'];
const combinedStatsWidths = [15, 10, 10, 10, 10, 10]; // 每列宽度
console.log('Combined Stats:\n');
console.log(generateTable(combinedStatsHeaders, combinedStats, combinedStatsWidths));

// 显示 finalResults 表格
const finalResultsHeaders = ['language', 'files', 'codeLines', 'comment', 'emptyLines', 'total'];
const finalResultsWidths = [15, 10, 15, 20, 15, 10];
console.log('\nFinal Results:\n');
console.log(generateTable(finalResultsHeaders, finalResults, finalResultsWidths));

// 显示 resulit 表格
const resulitHeaders = ['language', 'dirPath', 'codeLines', 'comment', 'emptyLines', 'total'];
const resulitWidths = [10, 50, 10, 10, 20, 10];
console.log('\nResulit:\n');
console.log(generateTable(resulitHeaders, resulit, resulitWidths));