import React from 'react'
import styled from 'styled-components'
import { IconBlank } from '@aragon/ui'
import { appIconUrl } from '../../utils'
import RemoteIcon from '../../components/RemoteIcon'
import IconKernel from '../../icons/IconKernel'
import { isCoreApp } from '../../aragonos-utils'

class AppIcon extends React.Component {
  static defaultProps = {
    size: 22,
    app: null,
  }
  render() {
    const { app, size, ...props } = this.props

    return (
      <Main {...props}>
        {(() => {
          if (isCoreApp(app.appId)) {
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
