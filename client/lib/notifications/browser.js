import notify from "notifyjs"
const Notify = notify.default

class BrowserNotifications {
  static requestPermission(cb) {
    Notify.requestPermission(cb)
  }

  static showNotification(title, body, notifyClick, notifyClose) {
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
