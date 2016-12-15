const { app, BrowserWindow } = require('electron')

let win = null

const meteorRootURL = 'http://localhost:3000'

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 900,
    titleBarStyle: 'hidden',
    'node-integration': false,
  })

  win.loadURL(meteorRootURL)

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', () => {
  createWindow(meteorRootURL)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) createWindow()
})
