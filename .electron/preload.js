const { ipcRenderer } = require('electron')

process.once('loaded', () => {
  console.log('hola')
  try {
    require('devtron').install()
    window.__devtron = { require, process }
    console.log('manola')
  } catch (e) {}

  console.log('patata')
  console.log(ipcRenderer)
  window.ipcRenderer = ipcRenderer
})
