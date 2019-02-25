import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { IconBlank } from '@aragon/ui'
import { appIconUrl } from '../../utils'
import RemoteIcon from '../../components/RemoteIcon'
import IconKernel from '../../icons/IconKernel'

class AppIcon extends React.Component {
  static propTypes = {
    app: PropTypes.object,
    size: PropTypes.number.isRequired,
  }

  static defaultProps = {
    size: 22,
    app: null,
  }
  render() {
    const { app, size, ...props } = this.props
    return (
      <Main {...props}>
        {(() => {
          if (app && app.isAragonOsInternalApp) {
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
