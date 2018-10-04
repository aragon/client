import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import EagleAnimation from './EagleAnimation'
import { theme, breakpoint, Button } from '@aragon/ui'
const medium = css => breakpoint('medium', css)

class NotFound extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    issue: PropTypes.bool,
    reload: PropTypes.bool,
    detailsTitle: PropTypes.string,
    detailsContent: PropTypes.node,
  }
  static defaultProps = {
    title: 'Not found :(',
  }

  state = { details: false }

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
      issue,
      reload,
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
          {children}
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
          {(issue || reload) && (
            <ButtonBox>
              {issue && (
                <IssueLink
                  mode="text"
                  href="https://github.com/aragon/aragon/issues"
                  target="_blank"
                >
                  Tell us what went wrong
                </IssueLink>
              )}
              {reload && (
                <Button mode="strong" onClick={this.handleReloadClick}>
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
  background: white;
  box-shadow: 0px 0px 19px 0px #c9c9c9;
  padding: 30px;
  border: solid 1px #c9c9c9;
  border-radius: 4px;
  max-width: 550px;
  color: ${theme.textSecondary};
  margin: auto 15px;
  margin-top: -90px;
  z-index: 2;
  position: relative;
  a {
    cursor: pointer;
    color: ${theme.accent};
  }
  a:hover,
  a:active {
    color: ${theme.gradientStartActive};
  }
  h1 {
    color: ${theme.textDimmed};
    font-size: 20px;
    margin-bottom: 20px;
    ${medium('font-size: 30px;')};
  }
`

const DetailsButton = styled.button`
  color: black;
  text-decoration: underline;
  margin: 20px 0;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  outline: none;
`

const DetailsContainer = styled.div`
  background: #f6f6f6;
  padding: 15px;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  color: ${theme.text};
  font-size: 14px;
  line-height: 1.6;
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
  color: ${theme.textSecondary} !important;
  text-decoration: none;
  &:hover {
    color: ${theme.gradientStartActive} !important;
  }
`

export default NotFound
