import React from 'react'
import styled from 'styled-components'
import resolvePathname from 'resolve-pathname'

class AppIcon extends React.PureComponent {
  render() {
    const { app, iconUrl } = this.props
    const src =
      iconUrl || (app && resolvePathname('images/icon.svg', app.baseUrl))
    return src ? <Img width="28" height="28" src={src} alt="" /> : null
  }
}

const Img = styled.img`
  display: block;
`

export default AppIcon
