import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import EagleAnimation from './EagleAnimation'
import { theme, breakpoint, Button, colors } from '@aragon/ui'
const medium = css => breakpoint('medium', css)

class ErrorCard extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    supportUrl: PropTypes.string,
    showReloadButton: PropTypes.bool,
    detailsTitle: PropTypes.string,
    detailsContent: PropTypes.node,
  }
  static defaultProps = {
    title: 'Error :(',
    supportUrl: '',
    showReloadButton: false,
  }

  state = { showDetails: false }

  toggleMoreDetails = () => {
    const { showDetails } = this.state
    this.setState({ showDetails: !showDetails })
  }
  handleReloadClick = () => {
    location.reload()
  }

  render() {
    const {
      title,
      supportUrl,
      showReloadButton,
      detailsTitle,
      detailsContent,
      children,
    } = this.props
    const { showDetails } = this.state
    return (
      <div>
        <EagleAnimation />
        <Card>
          <h1>{title}</h1>
          {children && <Content>{children}</Content>}
          {(detailsContent || detailsTitle) && (
            <div>
              <DetailsButton onClick={this.toggleMoreDetails}>
                {showDetails ? 'Hide details…' : 'More details…'}
              </DetailsButton>
              {showDetails && (
                <DetailsContainer>
                  {detailsTitle && <h2>{detailsTitle}</h2>}
                  {detailsContent}
                </DetailsContainer>
              )}
            </div>
          )}
          {(supportUrl || showReloadButton) && (
            <ButtonBox>
              {supportUrl && (
                <IssueLink mode="text" href={supportUrl} target="_blank">
                  Tell us what went wrong
                </IssueLink>
              )}
              {supportUrl && showReloadButton && <ButtonsSpacer />}
              {showReloadButton && (
                <Button mode="strong" onClick={this.handleReloadClick} compact>
                  Reload
                </Button>
              )}
            </ButtonBox>
          )}
        </Card>
      </div>
    )
  }
}

const Card = styled.div`
  position: relative;
  z-index: 2;
  padding: 30px;
  border: solid 1px #c9c9c9;
  border-radius: 4px;
  max-width: 550px;
  margin: auto 15px;
  margin-top: -90px;
  color: ${theme.textSecondary};
  background: white;
  box-shadow: 0px 0px 19px 0px #c9c9c9;
  h1 {
    color: ${theme.textDimmed};
    margin-bottom: 10px;
    font-size: 20px;
    ${medium(`
      margin-bottom: 20px;
      font-size: 30px;
    `)};
  }
`

const Content = styled.div`
  a {
    color: ${theme.accent};
  }
  a:hover,
  a:active {
    color: ${colors['Eagle']['Dark Cerulean']};
  }
`

const ButtonsSpacer = styled.span`
  width: 10px;
`

const DetailsButton = styled.button`
  color: black;
  text-decoration: underline;
  margin: 20px 0;
  padding-left: 0;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  outline: none;
`

const DetailsContainer = styled.div`
  overflow: auto;
  padding: 15px;
  max-height: 200px;
  border-radius: 4px;
  color: ${theme.text};
  font-size: 14px;
  line-height: 1.6;
  white-space: pre;
  background: #f6f6f6;

  h2 {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 10px;
  }
`

const ButtonBox = styled.div`
  margin: 20px 0 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const IssueLink = styled(Button.Anchor)`
  margin-left: -10px;
  color: ${theme.textSecondary};
  text-decoration: none;
  &:hover {
    color: ${theme.textPrimary};
  }
`

export default ErrorCard
