class StoredList {
  constructor(name) {
    this.name = name
    this.items = this.loadItems()
  }
  loadItems() {
    const value = localStorage.getItem(this.name)
    if (value === null) {
      return []
    }
    try {
      return JSON.parse(value)
    } catch (err) {
      this.update([])
      return []
    }
  }
  getItems() {
    return this.items
  }
  update(items = []) {
    localStorage.setItem(this.name, JSON.stringify(items))
    this.items = items
    return items
  }
  add(value) {
    return this.update([...this.items, value])
  }
  remove(index) {
    return this.update([
      this.items.slice(0, index),
      this.items.slice(index + 1),
    ])
  }
}

export default StoredList
