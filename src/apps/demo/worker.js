let counter = 100

// Mock subscribe to blockchain events from this app
postMessage({
  method: 'events',
  payload: {},
})

// Set cache
postMessage({
  method: 'cache',
  payload: {
    mode: 'set',
    key: 'counter',
    value: counter,
  },
})

addEventListener(
  'message',
  event => {
    const { data: { method } } = event
    // Mock handling a blockchain event
    if (method === 'events') {
      console.log('Received event:', event)
      postMessage({
        method: 'cache',
        payload: {
          mode: 'set',
          key: 'counter',
          value: --counter,
        },
      })
    } else {
      throw new Error("This worker only handles 'events' messages")
    }
  },
  false
)

console.log('Demo worker initialized')
