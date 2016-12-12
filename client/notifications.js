import notify from "notifyjs"
const Notify = notify.default

class Notifications {
  startListening() {
    if (!Notify.needsPermission) {
      console.log('send it')
      //this.doNotification()
    } else if (Notify.isSupported()) {
      Notify.requestPermission(this.onPermissionGranted, this.onPermissionDenied)
    }
  }

  doNotification() {
    const myNotification = new Notify('Hey hey', {
      body: 'This is an awesome notification'
    })
    myNotification.show()
  }

  onPermissionGranted() {
    console.log('Permission has been granted by the user')
    this.doNotification()
  }

  onPermissionDenied() {
    console.warn('Permission has been denied by the user')
  }
}

export default new Notifications()
