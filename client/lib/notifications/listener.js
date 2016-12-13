class NotificationsListener {
  constructor(_event, _title = 'Notification', _bodyFormatter = () => 'empty', _uriFormatter = () => '/home', _predicate = {}) {
    this.ev = _event
    this.title = _title
    this.bodyFormatter = _bodyFormatter
    this.uriFormatter = _uriFormatter
    this.predicate = _predicate
  }
}

export default NotificationsListener
