import StoredList from './StoredList'
const labels = new StoredList('custom-labels')

console.log('items: ', labels.getItems())
// labels.update([])

const find = address => item =>
  address && item.address.toLowerCase() === address.toLowerCase()

const add = ({ address, label }) => {
  labels.add({ address, label })
}

const resolve = address => {
  const list = labels.getItems()
  const item = list.find(find(address))
  return item ? item.label : false
}

const getAll = () => {
  return labels.getItems()
}

const update = ({ address, label }) => {
  const list = labels.getItems()
  const item = list.find(find(address))
  if (!item) {
    throw new Error(`There is no label for ${address}`)
  }
  const newList = list.map(item =>
    item.address === address ? { address, label } : item
  )
  labels.update(newList)
}

const removeAll = () => {
  labels.update([])
}

const remove = address => {
  const list = labels.getItems()
  const item = list.find(find(address))
  if (!item) {
    throw new Error(`There is no label for ${address}`)
  }
  const newList = list.filter(item => item.address !== address)
  labels.update(newList)
}

const set = ({ address, label }) => {
  const list = labels.getItems()
  const item = list.find(find(address))
  item ? update({ address, label }) : add({ address, label })
}

export { set, resolve, getAll, removeAll, remove }
