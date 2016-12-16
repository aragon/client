const { app, BrowserWindow } = require('electron')
const path = require('path')
const windowStateKeeper = require('electron-window-state')

const Intertron = require('./intertron.js')
const Keybase = require('./keybase')

new Intertron({ Keybase })

const meteorRootURL = 'http://localhost:3000'

let win = null

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
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
    },
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
