const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

// 引入 readDirectory 模块
const { calculateTotalLines } = require(path.join(__dirname, 'code_line', 'readDirectory'));

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
    win.webContents.openDevTools();
}

// 监听前端发出的文件选择请求
ipcMain.handle('dialog:openFile', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile']
    });
    return result.filePaths;
});

// 监听前端发出的目录选择请求
ipcMain.handle('dialog:openDirectory', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    return result.filePaths;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});