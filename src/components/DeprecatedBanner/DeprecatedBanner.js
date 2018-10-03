import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { ModalConsumer } from '../ModalManager/ModalManager'
import { theme, Text, SafeLink } from '@aragon/ui'
import Banner from '../Banner/Banner'
import Modal from '../Modal/Modal'

const { negative, negativeText, accent, textDimmed } = theme

const StyledSafeLink = styled(SafeLink)`
  text-decoration-color: ${accent};
  color: ${accent};
  word-break: break-all;
`

const DeprecatedBody = ({ dao }) => (
  <Text color={textDimmed}>
    Over the last six months, we’ve made a lot of improvements to aragonOS.
    Unfortunately a number of those improvements weren’t backwards-upgradeable
    with the currently deployed contracts that you might have been using on
    Rinkeby. So we’ve had to make the hard decision to deprecate those old
    testnet DAOs. Please see{' '}
    <StyledSafeLink
      href="https://blog.aragon.one/0-5-dao-deprecation/"
      target="_blank"
    >
      https://blog.aragon.one/0-5-dao-deprecation
    </StyledSafeLink>{' '}
    for more details.
    <br />
    <br />
    What this means for this DAO is that on 1/11/18 it will no longer be
    accessible at the current URL. To help manage this migration, and in case
    you still need access to your old DAOs, we’ll be hosting this DAO created
    with 0.5 at{' '}
    <StyledSafeLink href="https://old-app.aragon.org/{dao}">
      old-app.aragon.org/
      {dao}
    </StyledSafeLink>{' '}
    for a few months after 1/11/18.
  </Text>
)

const DeprecatedModal = ({ onHide, dao }) => (
  <Modal
    title="Deprecation notice for 0.5 Rinkeby DAOs"
    body={<DeprecatedBody dao={dao} />}
    hideText="Close"
    moreText="Learn more"
    onHide={onHide}
    onMore={() => window.open('URL', '_blank', 'noopener noreferrer')}
  />
)

class DeprecatedBanner extends Component {
  render() {
    return (
      <ModalConsumer>
        {({ showModal }) => (
          <Fragment>
            <Banner
              text="This Rinkeby DAO will be deprecated on 1/11/18"
              textColor={negativeText}
              onClick={this.onClick(showModal)}
              btnText="More info"
              backgroundColor={negative}
              dao={this.props.dao}
            />
            {this.props.children}
          </Fragment>
        )}
      </ModalConsumer>
    )
  }

  onClick = showModal => () => {
    showModal(DeprecatedModal, { dao: this.props.dao })
  }
}

export default DeprecatedBanner
