import React from 'react'
import styled from 'styled-components'
import { IconBlank } from '@aragon/ui'
import { appIconUrl } from '../../utils'
import RemoteIcon from '../../components/RemoteIcon'
import IconKernel from '../../icons/IconKernel'

class AppIcon extends React.Component {
  static defaultProps = {
    size: 22,
    app: null,
    isCoreApp: false,
  }
  render() {
    const { app, isCoreApp, size, ...props } = this.props

    return (
      <Main {...props}>
        {(() => {
          if (isCoreApp) {
            return <IconKernel size={size} />
          }
          if (app && app.baseUrl) {
            return <RemoteIcon size={size} src={appIconUrl(app)} />
          }
          return <IconBlank width={size} height={size} />
        })()}
      </Main>
    )
  }
}

const Main = styled.span`
  display: flex;
  align-items: center;
`

export default AppIcon
