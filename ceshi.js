const fs = require('fs');

function generateChartHTML(data) {
    const languages = data.map(item => item.language);
    const codeLines = data.map(item => item.codeLines);

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>代码行数统计</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
        <h1>代码行数统计</h1>
        <canvas id="codeLinesChart" width="20" height="20"></canvas>
        <script>
            var ctx = document.getElementById('codeLinesChart').getContext('2d');
            var codeLinesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ${JSON.stringify(languages)},
                    datasets: [{
                        label: '代码行数',
                        data: ${JSON.stringify(codeLines)},
                        backgroundColor: [
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        </script>
    </body>
    </html>
    `;

    fs.writeFileSync('codeLinesChart.html', htmlContent, 'utf8');
    console.log('静态 HTML 文件包含代码行数图表已生成。');
}

// 你的数据数组
const data = [
  {
    language: 'JavaScript',
    files: 6,
    codeLines: 711,
    commentLineCount: 225,
    emptyLines: 81,
    lineCount: 1017
  },
  {
    language: 'HTML',
    files: 1,
    codeLines: 42,
    commentLineCount: 0,
    emptyLines: 2,
    lineCount: 44
  },
  {
    language: 'JavaScript',
    files: 6,
    codeLines: 711,
    commentLineCount: 225,
    emptyLines: 81,
    lineCount: 1017
  },
  {
    language: 'HTML',
    files: 1,
    codeLines: 42,
    commentLineCount: 0,
    emptyLines: 2,
    lineCount: 44
  },
  {
    language: 'JavaScript',
    files: 6,
    codeLines: 711,
    commentLineCount: 225,
    emptyLines: 81,
    lineCount: 1017
  },
  {
    language: 'HTML',
    files: 1,
    codeLines: 42,
    commentLineCount: 0,
    emptyLines: 2,
    lineCount: 44
  },
  {
    language: 'JavaScript',
    files: 6,
    codeLines: 711,
    commentLineCount: 225,
    emptyLines: 81,
    lineCount: 1017
  },
  {
    language: 'HTML',
    files: 1,
    codeLines: 42,
    commentLineCount: 0,
    emptyLines: 2,
    lineCount: 44
  }
];

generateChartHTML(data);
