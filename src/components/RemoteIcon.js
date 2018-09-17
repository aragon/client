import React from 'react'
import { IconBlank } from '@aragon/ui'
import RemoteImage from './RemoteImage'

// Tries to load an image for an icon, while displaying a blank icon.
// Use `children` or `render` to change the icon component to use.
class RemoteIcon extends React.Component {
  static defaultProps = {
    src: '',
    alt: '',
    size: 22,

    render: null, // render is an alias of children and takes priority
    children: ({ src, alt, size }) => (
      <img src={src} alt={alt} width={size} height={size} />
    ),
  }

  render() {
    const { src, alt, size, render, children } = this.props
    const renderIcon = render || children

    return (
      <RemoteImage src={src}>
        {({ exists }) =>
          exists ? (
            renderIcon({ src, alt, size })
          ) : (
            <IconBlank width={size} height={size} />
          )
        }
      </RemoteImage>
    )
  }
}

export default RemoteIcon
