import React from 'react'

function Notifications() {
  return (
    <section>
      <h2>General notifications</h2>
      <label>
        App notifications and reminders (upcoming votes, created incoming or
        outgoing transactions, added or removed tokens, etc.).{' '}
        <input type="checkbox" />
      </label>
      <label>
        New releases and features announcements. <input type="checkbox" />
      </label>
      <label>
        Calendar reminders of selected events or tasks.{' '}
        <input type="checkbox" />
      </label>
      <button>Manage triggers</button>
    </section>
  )
}

export default Notifications
