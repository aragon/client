const { app, BrowserWindow } = require('electron')
const windowStateKeeper = require('electron-window-state')

let win = null

const meteorRootURL = 'http://localhost:3000'

function createWindow() {
  const windowState = windowStateKeeper({
    defaultWidth: 1280,
    defaultHeight: 800,
  })

  win = new BrowserWindow({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    titleBarStyle: 'hidden',
    'node-integration': false,
  })

  windowState.manage(win)

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
