import React, { Fragment, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text, Card, theme, Button, SafeLink, IconClose } from '@aragon/ui'

import { ModalContext } from '../../wrappers/modal'
import { useProfile } from '../../hooks'
import { open } from '../../stateManagers/modal'
import {
  IconPencil,
  IconGitHub,
  IconTwitter,
  IconLocation,
  IconEthereum,
  IconVerified,
  IconGlobe,
} from '../../assets'

const InformationCard = () => {
  const [activePopover, setPopover] = useState('')
  const {
    ethereumAddress,
    description,
    name,
    location,
    website,
    twitter,
    github,
    userLoaded,
    viewMode,
  } = useProfile()

  const { dispatchModal } = useContext(ModalContext)

  // return early if there is no profile to display
  if (!userLoaded) return <div />

  const PopoverCard = ({ social }) => (
    <VerifyCard>
      <Text.Block size="xlarge">Verify my {social}</Text.Block>
      <CardCloseButton type="button" onClick={() => setPopover('')}>
        <IconClose />￼
      </CardCloseButton>

      <Text.Block size="small">
        Aragon manages profiles using 3box.io. To verify your {social}, you must
        visit your 3box profile.
      </Text.Block>
      <Link size="small" href="https://3box.io">
        Take me to my 3box
      </Link>
    </VerifyCard>
  )

  PopoverCard.propTypes = { social: PropTypes.string }

  const RenderName = ({ name }) =>
    name ? (
      <Text.Block size="xxlarge" style={{ fontWeight: '700' }}>
        {name}
      </Text.Block>
    ) : (
      <Center>
        <Text
          style={{ cursor: 'pointer' }}
          size="large"
          color={theme.accent}
          onClick={() => dispatchModal(open('basicInformation'))}
        >
          Add name
        </Text>
      </Center>
    )

  RenderName.propTypes = { name: PropTypes.string }

  const RenderDescription = ({ description }) =>
    description ? (
      <Text.Block>{description}</Text.Block>
    ) : (
      <Center>
        <Text.Block
          style={{ cursor: 'pointer' }}
          size="large"
          color={theme.accent}
          onClick={() => dispatchModal(open('basicInformation'))}
        >
          Add bio
        </Text.Block>
      </Center>
    )

  RenderDescription.propTypes = { description: PropTypes.string }

  const RenderLocation = ({ location }) => (
    <Social>
      <IconLocation width="13px" height="13px" color={theme.textTertiary} />
      {location ? (
        <Text size="normal" color={theme.textTertiary}>
          {location}
        </Text>
      ) : (
        <Text
          style={{ cursor: 'pointer' }}
          color={theme.accent}
          onClick={() => dispatchModal(open('basicInformation'))}
        >
          Add location
        </Text>
      )}
    </Social>
  )

  RenderLocation.propTypes = { location: PropTypes.string }

  const RenderEmpty = () => (
    <Center height="130px">
      <Text.Block style={{ textAlign: 'center' }} size="xlarge">
        You have no name, bio or location
      </Text.Block>
      <Text
        style={{ cursor: 'pointer' }}
        size="small"
        color={theme.accent}
        onClick={() => dispatchModal(open('basicInformation'))}
      >
        Add basic information
      </Text>
    </Center>
  )

  const RenderGitHub = ({ github: { username } }) => (
    <Social>
      <IconGitHub width="13px" height="13px" color={theme.textTertiary} />
      {username ? (
        <div>
          <Link href={`https://github.com/${username}`}>{username}</Link>
          <Verified />
        </div>
      ) : (
        <div>
          <Button
            compact
            mode="outline"
            style={{ position: 'relative' }}
            onClick={() => setPopover('github')}
          >
            Verify my GitHub account
          </Button>
          {activePopover === 'github' && <PopoverCard social="GitHub" />}
        </div>
      )}
    </Social>
  )

  RenderGitHub.propTypes = { github: PropTypes.object }

  const RenderTwitter = ({ twitter: { username } }) => (
    <Social>
      <IconTwitter width="13px" height="13px" color={theme.textTertiary} />
      {username ? (
        <div>
          <Link href={`https://twitter.com/${username}`}>{username}</Link>
          <Verified />
        </div>
      ) : (
        <div>
          <Button
            compact
            mode="outline"
            style={{ position: 'relative' }}
            onClick={() => setPopover('twitter')}
          >
            Verify my Twitter account
          </Button>

          {activePopover === 'twitter' && <PopoverCard social="Twitter" />}
        </div>
      )}
    </Social>
  )

  RenderTwitter.propTypes = { twitter: PropTypes.object }

  const RenderWebsite = ({ website }) =>
    website && (
      <Social>
        <IconGlobe width="13px" height="13px" color={theme.textPrimary} />
        <Link href={website} placeholder="website" size="small">
          {website}
        </Link>
      </Social>
    )

  RenderWebsite.propTypes = { website: PropTypes.string }

  return (
    <StyledCard>
      <div>
        <Details>
          {!(name || description || location) ? (
            <RenderEmpty />
          ) : (
            <Fragment>
              <RenderName name={name} />
              <RenderDescription description={description} />
              <RenderLocation location={location} />
            </Fragment>
          )}
          <RenderWebsite website={website} />
          <Separator />
          <RenderTwitter twitter={twitter} />
          <RenderGitHub github={github} />
          <Separator />
          <Social>
            <IconEthereum
              width="13px"
              height="13px"
              color={theme.textTertiary}
            />
            <EthAddr>{ethereumAddress}</EthAddr>
          </Social>
        </Details>
        {!viewMode && (
          <Icons>
            <IconPencil
              width="16px"
              color={theme.accent}
              onClick={() => dispatchModal(open('basicInformation'))}
            />
          </Icons>
        )}
      </div>
    </StyledCard>
  )
}

const StyledCard = styled(Card).attrs({ width: '100%', height: 'auto' })`
  padding: 16px;
  padding-top: 52px;
  position: relative;
`
const Center = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: ${({ height }) => height || '40px'};
`
const VerifyCard = styled(Card).attrs({
  width: '286px',
  height: '170px',
})`
  background: white;
  padding: 13px 20px;
  position: absolute;
  left: 52px;
  z-index: 2;
  > :not(:last-child) {
    margin-bottom: 13px;
  }
`
const CardCloseButton = styled.button`
  ${VerifyCard} & {
    position: absolute;
    ￼padding: 20px;
    top: 13px;
    right: 13px;
    cursor: pointer;
    background: none;
    border: 0;
    outline: 0;
    &::-moz-focus-inner {
      border: 0;
    }
  }
￼`
const Social = styled.div`
  display: flex;
  align-items: center;
  > :nth-child(2) {
    margin-left: 8px;
    flex: 1;
  }
`
const Link = styled(SafeLink).attrs({
  target: '_blank',
})`
  color: ${theme.accent};
  text-decoration: none;
  &:hover,
  &:focus {
    text-decoration: underline;
  }
`
const Verified = styled(IconVerified)`
  margin-left: 8px;
`
const EthAddr = styled(Text).attrs({ size: 'small' })`
  color: ${theme.textTertiary};
  word-break: break-all;
`
const Icons = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  visibility: hidden;
  > * {
    background: white;
    box-sizing: content-box;
    padding: 4px;
    cursor: pointer;
  }
  ${StyledCard}:hover & {
    visibility: visible;
  }
`
const Details = styled.div`
  width: 100%;
  > :not(:last-child) {
    margin-bottom: 7px;
  }
`
const Separator = styled.hr`
  height: 1px;
  border: 0;
  width: 100%;
  margin: 13px 0 !important; // override Details > :not(:last-child)
  background: ${theme.contentBorder};
`

export default InformationCard
