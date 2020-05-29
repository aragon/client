import EventTarget from '@ungap/event-target'
import {
  workerFrameSandbox,
  workerFrameSandboxDisabled,
} from '../security/configuration'

/**
 * A few notes on WebWorker security, and why this "sandboxed" version is
 * necessary:
 *
 * As we run untrusted code in WebWorkers, we want to make them isolated and
 * sandboxed from the parent application (i.e. the code you're reading) and any
 * other code it may have loaded (e.g. other untrusted applications).
 *
 * WebWorkers, by default, have no DOM or localStorage access. They were mostly
 * designed to run background jobs, listening to its parent for instructions.
 * This default allows WebWorkers to be "mostly" sandboxed, such that there is
 * already a limited attack surface for malicious scripts to target.
 *
 * **Unforunately**, one of those exposed, attackable surfaces is the indexedDB
 * storage API. WebWorkers have unconstrained access to any indexedDB databases
 * available in the same origin (note that WebWorkers are also only able to load
 * scripts from the same origin). For a full listing of the methods and APIs
 * available, see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Functions_and_classes_available_to_workers.
 *
 * As we store a lot of information in indexedDB (due to its feature set over
 * localStorage), this means Bad Things could happen if we loaded a malicious
 * script that manipulated some indexedDB databases.
 *
 * One way to solve this problem is to use a data URL instead of a string or
 * object URL. WebWorkers created with data URLs are created with opaque
 * ("orphaned") origins (see https://html.spec.whatwg.org/multipage/workers.html#dom-worker)
 * and this negates the same-origin access.
 *
 * However, consuming and processing data URLs was found to be hugely
 * inefficient and resulted in severe performance degradation upon the initial
 * load of a script.
 *
 * Thus, we instead chose to "wrap" these WebWorkers with an iframe, using the
 * iframe to create the opaque origin (unless disabled; see Safari bug).
 */

class SandboxedWorker extends EventTarget {
  constructor(scriptUrl, { name } = {}) {
    super()

    this.name = name
    this.iframe = document.createElement('iframe')
    if (!workerFrameSandboxDisabled) {
      this.iframe.sandbox = workerFrameSandbox
    }
    this.iframe.style = `
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      opacity: 0;
      border: 0;
    `

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

          window.addEventListener('unload', () => {
            // Clean up the url we created to spawn the worker when the iframe is unloaded
            // Note that we **NEED** to do this late, as Chrome 83+ appears to have
            // introduced a race condition with starting workers using object URLs,
            // preventing us from synchronously revoking this object URL immediately.
            URL.revokeObjectURL(workerUrl)
          })
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
