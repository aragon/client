import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import EagleAnimation from './EagleAnimation'
import { theme, breakpoint, Button } from '@aragon/ui'
const medium = css => breakpoint('medium', css)

class NotFound extends React.Component {
  state = { details: false }
  clickMoreDetails = () => {
    const details = this.state.details
    this.setState({ details: !details })
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
    const { details } = this.state
    return (
      <div>
        <EagleAnimation />
        <Card>
          <h1>{title}</h1>
          {children}
          {(detailsContent || detailsTitle) && (
            <div>
              <DetailsButton onClick={this.clickMoreDetails}>
                {details ? 'Hide details...' : 'More details...'}
              </DetailsButton>
              {details && (
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
                <IssueLink>
                  <Button.Anchor
                    mode="text"
                    href="https://github.com/aragon/aragon/issues"
                    target="_blank"
                  >
                    Tell us what went wrong
                  </Button.Anchor>
                </IssueLink>
              )}
              {reload && (
                <Button mode="strong" onClick={() => location.reload()}>
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
  -webkit-box-shadow: 0px 0px 19px 0px #c9c9c9;
  -moz-box-shadow: 0px 0px 19px 0px #c9c9c9;
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

const DetailsButton = styled.p`
  color: black;
  text-decoration: underline;
  margin: 20px 0;
  cursor: pointer;
`

const DetailsContainer = styled.div`
  background: #f6f6f6;
  padding: 15px;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: scroll;
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
  .issue-link {
    margin-left: -10px;
    color: inherit;
    text-decoration: none;
  }
`

const IssueLink = styled.div`
  a {
    margin-left: -10px;
    color: inherit;
    text-decoration: none;
  }
`

NotFound.propTypes = {
  title: PropTypes.string,
  issue: PropTypes.bool,
  reload: PropTypes.bool,
  detailsTitle: PropTypes.string,
}

NotFound.defaultProps = {
  title: 'Not found :(',
}

export default NotFound
