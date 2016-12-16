const { ipcRenderer } = require('electron')

process.once('loaded', () => {
  window.ipcRenderer = ipcRenderer

  try {
    require('devtron').install()
    window.__devtron = { require, process }
  } catch (e) {}
})
