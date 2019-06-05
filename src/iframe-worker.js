import { getObjectUrlForScript, fetchScriptUrlAsBlob } from './worker-utils'

class IframeWorker extends EventTarget {
  constructor(scriptUrl, { name }) {
    super()

    this.name = name
    this.iframe = document.createElement('iframe')
    this.iframe.sandbox = 'allow-scripts'

    const source = `
      <script>
        const getObjectUrlForScript = ${getObjectUrlForScript.toString()}
        const fetchScriptUrlAsBlob = ${fetchScriptUrlAsBlob.toString()}
        const init = async () => {
          let workerUrl = ''
          try {
            // WebWorkers can only load scripts from the local origin, so we
            // have to fetch the script (from an IPFS gateway) and process it locally.
            //
            // Note that we **SHOULD** use a data url, to ensure the Worker is
            // created with an opaque ("orphaned") origin, see
            // https://html.spec.whatwg.org/multipage/workers.html#dom-worker.
            //
            // The opaque origin is a necessary part of creating the WebWorker sandbox;
            // even though the script never has access to the DOM or local storage, it can
            // still access global features like IndexedDB if it is not enclosed in an
            // opaque origin.
            workerUrl = await getObjectUrlForScript('${scriptUrl}')
          } catch (e) {
            console.error("Failed to load ${name}'s script (${scriptUrl}): ", e)
            return
          }
          const worker = new Worker(workerUrl, { name: '${name}' })
          worker.addEventListener('error', error => window.parent.postMessage({ from: '${name}', error }, '*'), false)
          worker.addEventListener('message', event => window.parent.postMessage({ from: '${name}', msg: event.data }, '*'), false)
          window.addEventListener('message', ({ data }) => worker.postMessage(data))
          // Clean up the url we created to spawn the worker
          URL.revokeObjectURL(workerUrl)
        }
        init()
      </script>
    `
    this.iframe.srcdoc = source
    document.body.appendChild(this.iframe)

    window.addEventListener('message', this.handleIframeMessage, false)
  }

  postMessage(msg) {
    this.iframe.contentWindow.postMessage(msg, '*')
  }

  terminate() {
    window.removeListener('message', this.handleIframeMessage)
    document.removeChild(this.iframe)
    this.iframe = null
  }

  handleIframeMessage = event => {
    const {
      source,
      data: { from, error, msg },
    } = event
    if (source === this.iframe.contentWindow && from === this.name) {
      this.dispatchEvent(
        new MessageEvent(error ? 'error' : 'message', {
          data: error || msg,
        })
      )
    }
  }
}

export default IframeWorker
