import React from 'react'
import styled from 'styled-components'
import { theme, Text, SafeLink, Button, Modal, ModalConsumer } from '@aragon/ui'
import Banner from '../Banner/Banner'

const { negative, negativeText, accent, textDimmed } = theme

const CURRENT_DOMAIN = 'app.aragon.org'
const OLD_DAO_DOMAIN = 'app-v05.aragon.org'
const DEPRECATION_URL =
  'https://blog.aragon.org/deprecation-notice-on-v0-5-rinkeby-daos'

const DEPRECATION_TITLE =
  'Old 0.5 Rinkeby organizations will be deprecated on Oct. 29, 2018'

const DeprecatedBanner = props => (
  <ModalConsumer>
    {({ showModal }) => <DeprecatedDao showModal={showModal} {...props} />}
  </ModalConsumer>
)

class DeprecatedDao extends React.Component {
  static defaultProps = {
    lightMode: false,
  }

  handleClick = () => {
    const { dao, showModal } = this.props
    showModal(DeprecatedModal, { dao })
  }

  render() {
    const { children, lightMode } = this.props

    return (
      <React.Fragment>
        <Banner
          text={DEPRECATION_TITLE}
          color={lightMode ? theme.infoBackground : negative}
          textColor={lightMode ? theme.textPrimary : negativeText}
          button={
            <Button
              onClick={this.handleClick}
              mode={lightMode ? 'strong' : 'normal'}
              size="mini"
            >
              More info
            </Button>
          }
        />
        {children}
      </React.Fragment>
    )
  }
}

const DeprecatedBody = ({ dao }) => (
  <React.Fragment>
    <TopParagraph color={textDimmed}>
      Over the last seven months, we’ve made a lot of improvements to aragonOS.
      Unfortunately, a number of those improvements weren’t
      backwards-upgradeable with the contracts your organizations were
      constructed with on Rinkeby. As a result, we’ve made the tough decision to
      deprecate all old testnet organizations. Please see{' '}
      <StyledSafeLink href={DEPRECATION_URL} target="_blank">
        our blog post
      </StyledSafeLink>{' '}
      for more details.
    </TopParagraph>
    <Text.Paragraph color={textDimmed}>
      On <time dateTime="2018-10-29">Oct. 29, 2018</time>, organizations created
      on Rinkeby will no longer be accessible on {CURRENT_DOMAIN}. To help
      migrate, and in case you still need access to{' '}
      {dao ? 'this organization' : 'old organizations'}, we will continue
      hosting {dao ? 'it' : 'them'} on{' '}
      <StyledSafeLink
        href={`https://${OLD_DAO_DOMAIN}/${dao ? `#/${dao}` : ''}`}
        target="_blank"
      >
        {OLD_DAO_DOMAIN}
      </StyledSafeLink>{' '}
      until the end of <time dateTime="2019-03">March, 2019</time>.
    </Text.Paragraph>
  </React.Fragment>
)

const DeprecatedModal = ({ onHide, dao }) => (
  <Modal
    title={DEPRECATION_TITLE}
    body={<DeprecatedBody dao={dao} />}
    onHide={onHide}
    More={
      <Button.Anchor mode="strong" href={DEPRECATION_URL} target="_blank">
        Learn more
      </Button.Anchor>
    }
  />
)

const TopParagraph = styled(Text.Paragraph)`
  margin-bottom: 20px;
`

const StyledSafeLink = styled(SafeLink)`
  text-decoration-color: ${accent};
  color: ${accent};
`

export default DeprecatedBanner
