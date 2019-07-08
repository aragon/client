import EventTarget from '@ungap/event-target'

class SandboxedWorker extends EventTarget {
  constructor(scriptUrl, { name } = {}) {
    super()

    this.name = name
    this.iframe = document.createElement('iframe')
    this.iframe.sandbox = 'allow-scripts'
    this.iframe.style = 'position: absolute; width: 0; height: 0; opacity:0;'

    const source = `
      <script>
        const fetchScriptUrlAsBlob = async url => {
          // In the future, we might support IPFS protocols in addition to http
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
        async function getObjectUrlForScript(scriptUrl) {
          const blob = await fetchScriptUrlAsBlob(scriptUrl)
          return URL.createObjectURL(blob)
        }
        const init = async () => {
          // WebWorkers can only load scripts from the local origin, so we
          // have to fetch the script (from an IPFS gateway) and process it locally.
          const workerUrl = await getObjectUrlForScript('${scriptUrl}')

          const worker = new Worker(workerUrl, { name: '${name}' })

          // Must use '*' for origin as we've sandboxed the iframe's origin
          worker.addEventListener('message', event => window.parent.postMessage({ from: '${name}', msg: event.data }, '*'), false)
          worker.addEventListener(
            'error',
            error => {
              console.error('Error from worker for ${name} (loaded from ${scriptUrl}):', error.message, error)
              window.parent.postMessage(
                {
                  from: '${name}',
                  error: {
                    filename: error.filename,
                    message: error.message,
                    lineno: error.lineno,
                  },
                },
                '*'
              )
            },
            false
            )
          window.addEventListener('message', ({ data, source }) => {
            if (source === window.parent) {
              worker.postMessage(data)
            }
          })

          // Clean up the url we created to spawn the worker
          URL.revokeObjectURL(workerUrl)
        }

        init()
          .catch(err => {
            console.error("Failed to load ${name}'s script (${scriptUrl}): ", err)
          })
      </script>
    `
    this.iframe.srcdoc = source
    document.body.appendChild(this.iframe)

    window.addEventListener('message', this.handleIframeMessage, false)
  }

  postMessage(msg) {
    if (this.iframe) {
      // Must use '*' for origin as we've sandboxed the iframe's origin
      this.iframe.contentWindow.postMessage(msg, '*')
    }
  }

  terminate() {
    window.removeEventListener('message', this.handleIframeMessage)
    if (this.iframe) {
      this.iframe.remove()
    }
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

export default SandboxedWorker
