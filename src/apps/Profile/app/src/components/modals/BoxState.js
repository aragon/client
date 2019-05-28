import React from 'react'
import PropTypes from 'prop-types'
import { Text, IconCheck, IconAttention, IconError } from '@aragon/ui'
import styled from 'styled-components'

import { FlexDirectionRow, FlexDirectionCol } from '../styled-components'
import { ModalWrapper } from './ModalWrapper'

const ProfileStatus = ({ loading, error, complete, title }) => {
  let Icon
  let text
  if (complete) {
    Icon = IconCheck
    text = 'Message signed!'
  } else if (error) {
    Icon = IconError
    text = 'Error signing message'
  } else if (loading) {
    Icon = IconAttention
    text = 'Loading'
  } else {
    Icon = IconAttention
    text = 'Waiting for signature...'
  }

  return (
    <AlignColCenter>
      <Text smallcaps>{title}</Text>
      <Icon width="100px" height="100px" />
      <Text>{text}</Text>
    </AlignColCenter>
  )
}

ProfileStatus.defaultProps = {
  loading: false,
  error: false,
  complete: false,
  title: '',
}

const BoxState = ({
  messageSigning: {
    creatingProf,
    createdProfError,
    createdProfSuccess,
    openingProf,
    openedProfError,
    openedProfSuccess,
    syncingProf,
    syncedProfError,
    syncedProfSuccess,
  },
  signaturesRequired,
}) => {
  const needsToUnlock = signaturesRequired.indexOf('unlock') > -1
  const needsToCreate = signaturesRequired.indexOf('create') > -1
  return (
    <ModalWrapper title="3BOX">
      <Text size="large" style={{ margin: '1.5rem 0 2rem 0' }}>
        {`Your wallet should open and you need to sign ${
          signaturesRequired.length
        } message${signaturesRequired.length > 1 ? 's after another ' : ''}
        to create your profile and save your updates.`}
      </Text>
      <JustifyRowCenter>
        {needsToUnlock && (
          <ProfileStatus
            awaitingSig={openingProf}
            complete={openedProfSuccess && syncedProfSuccess}
            error={openedProfError || syncedProfError}
            loading={syncingProf}
            title="Grant aragon access to your 3box"
          />
        )}
        {needsToCreate && (
          <ProfileStatus
            awaitingSig={creatingProf}
            error={createdProfError}
            complete={createdProfSuccess}
            title="Profile creation"
          />
        )}
      </JustifyRowCenter>
    </ModalWrapper>
  )
}

BoxState.propTypes = {
  messageSigning: PropTypes.shape({
    creatingProf: PropTypes.bool.isRequired,
    createdProfError: PropTypes.bool.isRequired,
    createdProfSuccess: PropTypes.bool.isRequired,
    openingProf: PropTypes.bool.isRequired,
    openedProfError: PropTypes.bool.isRequired,
    openedProfSuccess: PropTypes.bool.isRequired,
    syncingProf: PropTypes.bool.isRequired,
    syncedProfError: PropTypes.bool.isRequired,
    syncedProfSuccess: PropTypes.bool.isRequired,
  }).isRequired,
  signaturesRequired: PropTypes.array.isRequired,
}

const AlignColCenter = styled(FlexDirectionCol)`
  align-items: center;
`

const JustifyRowCenter = styled(FlexDirectionRow)`
  justify-content: center;
`

export default BoxState
