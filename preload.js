// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// 暴露一个函数给渲染进程，该函数会发送 IPC 消息到主进程
contextBridge.exposeInMainWorld('electron', {
  selectFile: () => ipcRenderer.invoke('dialog:openFile'),
  selectDir: () => ipcRenderer.invoke('dialog:openDirectory'),
  calculateTotalLines: (filePath) => ipcRenderer.invoke('calculateTotalLines', filePath)
});

// 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
