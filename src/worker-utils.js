/**
 * Fetch the given script and return it as a blob
 *
 * @param {string} scriptUrl Real world location of the script
 * @returns {Promise<Blob>} Blob representing the script
 */
export async function getBlobForScript(scriptUrl) {
  // In the future, we might support IPFS protocols in addition to http
  const res = await fetch(scriptUrl, {
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
