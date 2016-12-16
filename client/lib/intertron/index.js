export default class Intertron {
  constructor() {

  }

  async call(method, ...args) {
    const repId = ipcRenderer.sendSync(method, ...args)
    return new Promise((resolve, reject) => {
      ipcRenderer.on(repId, (e, data) => {
        resolve(data)
      })
    })
  }
}
