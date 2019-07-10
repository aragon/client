class WorkerSubscriptionPool {
  workers = new Map()
  addWorker({ app, connection, worker }) {
    this.workers.set(app.proxyAddress, { app, connection, worker })
  }
  hasWorker(proxyAddress) {
    return this.workers.has(proxyAddress)
  }
  async removeWorker(proxyAddress, { clearCache } = {}) {
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
  unsubscribe() {
    this.workers.forEach(({ connection, worker }) => {
      // TODO: ask worker to nicely terminate itself first
      worker.terminate()
      connection.shutdown()
    })

    // Reset pool
    this.workers.clear()
  }
}

export default WorkerSubscriptionPool
