const { ipcMain } = require('electron')

function flattenObj(obj, prefix = '') {
  const flattenedObj = {}
  for (const key of Object.keys(obj)) {
    const newPrefix = (prefix) ? `${prefix}.${key}` : key
    if (obj[key] instanceof Function) {
      flattenedObj[newPrefix] = obj[key]
    } else {
      const newFlattenedObj = flattenObj(obj[key], newPrefix)
      Object.assign(flattenedObj, newFlattenedObj)
    }
  }
  return flattenedObj
}

class Intertron {
  constructor(exposedObj) {
    this.methods = flattenObj(exposedObj)
    for (const key of Object.keys(this.methods)) {
      this.addListener(key)
    }
  }

  addListener(path) {
    ipcMain.on(path, (e, ...args) => {
      const id = `reply:${Math.random().toString(36).substr(2, 32)}`
      this.methods[path](...args, (err, ...res) => {
        e.sender.send(id, ...res)
      })
      e.returnValue = id
    })
  }
}

module.exports = Intertron
