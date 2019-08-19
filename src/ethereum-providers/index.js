import frame from './icons/Frame.png'
import cipher from './icons/Cipher.png'
import metamask from './icons/Metamask.png'
import status from './icons/Status.png'

export default [
  {
    id: 'frame',
    name: 'Frame',
    type: 'Desktop',
    image: frame,
    connect: () => {},
  },
  {
    id: 'metamask',
    name: 'Metamask',
    type: 'Desktop',
    image: metamask,
    connect: () => {},
  },
  {
    id: 'status',
    name: 'Status',
    type: 'Mobile',
    image: status,
    connect: () => {},
  },
  {
    id: 'cipher',
    name: 'Cipher',
    type: 'Mobile',
    image: cipher,
    connect: () => {},
  },
]
