console.log('started data url worker')

const readAsDataUrl = file => {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.addEventListener('loadend', () => resolve(reader.result))
    reader.addEventListener('error', reject)
    reader.readAsDataURL(file)
  })
}

self.onmessage = function(event) {
  readAsDataUrl(event.data.blob)
    .then(dataUrl => {
      self.postMessage({
        id: event.data.id,
        url: dataUrl,
      })
    })
    .catch(err => {
      console.error('could not get data uri', event)
    })
}
