/**
 * Fetch the given script and create a local URL for it
 *
 * @param {string} scriptUrl Real world location of the script
 * @returns {Promise<string>} Local url for the script
 */
export async function getDataUrlForScript(scriptUrl) {
  // In the future, we might support IPFS protocols in addition to http
  const blob = await fetchScriptUrlAsBlob(scriptUrl)
  return readAsDataUrl(blob)
}

const fetchScriptUrlAsBlob = async url => {
  const res = await fetch(url, {
    method: 'GET',
    mode: 'cors',
  })

  // If status is not a 2xx (based on Response.ok), assume it's an error
  // See https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch
  if (!(res && res.ok)) {
    throw res
  }

  return res.blob()
}

const readAsDataUrl = file => {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.addEventListener('loadend', () => resolve(reader.result))
    reader.addEventListener('error', reject)
    reader.readAsDataURL(file)
  })
}

export class WorkerSubscriptionPool {
  workers = new Map()
  addWorker = ({ app, connection, worker }) => {
    this.workers.set(app.proxyAddress, { app, connection, worker })
  }
  hasWorker = proxyAddress => {
    return this.workers.has(proxyAddress)
  }
  removeWorker = async (proxyAddress, clearCache) => {
    if (this.hasWorker(proxyAddress)) {
      const { connection, worker } = this.workers.get(proxyAddress)
      this.workers.delete(proxyAddress)

      worker.terminate()

      if (clearCache) {
        await connection.shutdownAndClearCache()
      } else {
        connection.shutdown()
      }
    }
  }
  unsubscribe = () => {
    this.workers.forEach(({ connection, worker }) => {
      // TODO: ask worker to nicely terminate itself first
      worker.terminate()
      connection.shutdown()
    })
  }
}
