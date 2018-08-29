import React from 'react'
import { IconBlank } from '@aragon/ui'
import RemoteImage from './RemoteImage'

// Tries to load an image for an icon, while displaying a blank icon.
// Use `children` or `render` to change the icon component to use.
class RemoteIcon extends React.Component {
  static defaultProps = {
    src: '',
    alt: '',

    render: null, // render is an alias of children and takes priority
    children: ({ alt, src }) => <img alt={alt} src={src} />,
  }

  render() {
    const { alt, src, render, children } = this.props
    const renderIcon = render || children

    return (
      <RemoteImage src={src}>
        {({ exists }) => (exists ? renderIcon({ alt, src }) : <IconBlank />)}
      </RemoteImage>
    )
  }
}

export default RemoteIcon
