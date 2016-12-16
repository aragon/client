const {ipcRenderer} = require('electron')

process.once('loaded', () => {
  try {
    require('devtron').install()
    window.__devtron = { require, process }
  } catch (e) {}

  window.ipcRenderer = ipcRenderer
})
