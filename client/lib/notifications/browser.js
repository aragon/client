// @flow
import notify from 'notifyjs'

const Notify = notify.default

class BrowserNotifications {
  static requestPermission(cb?: Function) {
    Notify.requestPermission(cb)
  }

  static showNotification(title: string, body: string, notifyClick?: Function, notifyClose?: void) {
    const show = () => {
      const notification = new Notify(title, { body, notifyClick, notifyClose })
      notification.show()
    }

    if (!Notify.needsPermission) {
      show()
    } else if (Notify.isSupported()) {
      this.requestPermission(() => show())
    }
  }
}

export default BrowserNotifications
