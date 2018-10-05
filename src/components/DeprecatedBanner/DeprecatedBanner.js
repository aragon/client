import React from 'react'
import styled from 'styled-components'
import { theme, Text, SafeLink, Button } from '@aragon/ui'
import Banner from '../Banner/Banner'
import Modal from '../Modal/Modal'
import { ModalConsumer } from '../ModalManager/ModalManager'

const DEPRECATION_URL = 'https://blog.aragon.one/0-5-dao-deprecation/'

const DEPRECATION_TITLE =
  'Old 0.5 Rinkeby DAOs will be deprecated on Nov. 1, 2018'

const { negative, negativeText, accent, textDimmed } = theme

const DeprecatedBanner = props => (
  <ModalConsumer>
    {({ showModal }) => <DeprecatedDao showModal={showModal} {...props} />}
  </ModalConsumer>
)

class DeprecatedDao extends React.Component {
  handleClick = () => {
    const { dao, showModal } = this.props
    showModal(DeprecatedModal, { dao })
  }

  render() {
    const { children, dao } = this.props

    return (
      <React.Fragment>
        <Banner
          text={DEPRECATION_TITLE}
          textColor={negativeText}
          onClick={this.handleClick}
          buttonText="More info"
          color={negative}
          dao={dao}
        />
        {children}
      </React.Fragment>
    )
  }
}

const DeprecatedBody = ({ dao }) => (
  <React.Fragment>
    <TopParagraph color={textDimmed}>
      Over the last six months, we’ve made a lot of improvements to aragonOS.
      Unfortunately, a number of those improvements weren’t
      backwards-upgradeable with the contracts your DAOs were constructed with
      on Rinkeby. As a result, we’ve made the tough decision to deprecate all
      old testnet DAOs. Please see{' '}
      <StyledSafeLink href={DEPRECATION_URL} target="_blank">
        {DEPRECATION_URL}
      </StyledSafeLink>{' '}
      for more details.
    </TopParagraph>
    <Text.Paragraph color={textDimmed}>
      On <time dateTime="2018-11-01">Nov. 1, 2018</time>, this DAO will no
      longer be accessible on app.aragon.one. To help migrate, and in case you
      still need access to this DAO, we will continue hosting this version of
      Aragon Core on{' '}
      <StyledSafeLink
        href={`https://old-app.aragon.org/#/${dao}`}
        target="_blank"
      >
        old-app.aragon.org/#/
        {dao}
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
  margin-bottom: 1em;
`

const StyledSafeLink = styled(SafeLink)`
  text-decoration-color: ${accent};
  color: ${accent};
  word-break: break-all;
`

export default DeprecatedBanner
