import React from 'react'
import { styled, theme } from '@aragon/ui'

class RevokeFooter extends React.Component {
  handleRevokeClick = () => {
    this.props.onRevoke(this.props.permissionId)
  }
  render() {
    const { revokableBy } = this.props
    return (
      <Main>
        <p>
          <em>Revokable by {revokableBy}</em>
        </p>
        <p>
          <Link onClick={this.handleRevokeClick}>Revoke</Link>
        </p>
      </Main>
    )
  }
}

const Main = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  color: ${theme.textTertiary};
  a {
    text-decoration: underline;
  }
`

const Link = styled.a.attrs({ role: 'button' })`
  cursor: pointer;
`

export default RevokeFooter
