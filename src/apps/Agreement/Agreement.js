import React, { useState } from 'react'
import { Box, Button, Header, Split, IconEdit, useLayout } from '@aragon/ui'
import AgreementDetails from './AgreementDetails'
import AgreementHeader from './AgreementHeader'
import { STATUS_PENDING, STATUS_ACTIVE } from './agreement-statuses'

const Agreement = React.memo(function Agreement() {
  const [agreementStatus, setAgreementStatus] = useState(STATUS_PENDING)
  const { layoutName } = useLayout()

  const compactMode = layoutName === 'small'

  return (
    <React.Fragment>
      <Header
        primary="Agreement"
        secondary={
          <Button
            mode="strong"
            label="Update Agreement"
            onClick={() => {
              // TODO: This is just for testing the status change effect on UI state
              setAgreementStatus(
                agreementStatus === STATUS_ACTIVE
                  ? STATUS_PENDING
                  : STATUS_ACTIVE
              )
            }}
            icon={<IconEdit />}
            display={compactMode ? 'icon' : 'label'}
          />
        }
      />

      <Split
        primary={
          <React.Fragment>
            <Box>
              <AgreementHeader
                title="DAO Agreement"
                status={agreementStatus}
                onSign={() => {
                  console.log('Signed')
                }}
                onShare={() => {
                  console.log('Shared')
                }}
              />
              <AgreementDetails
                IPFSLink="QmXpcBiGZ7Uep2tmhxLhfA8ak1aYDUyevFSnpUa4Gc9kRn"
                AuthorHash="0xc41e4c10b37d3397a99d4a90e7d85508a69a5c4c"
                StakingHash="0x7c708ac7db979fa06705f8880f29f82cfc406993"
                ContractHash="0x7c708ac7db979fa06705f8880f29f82cfc406993"
              />
            </Box>
            <Box>Disputable apps</Box>

            <Box>Agreement doc</Box>
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            <Box>Checklist</Box>

            <Box>Version history</Box>
          </React.Fragment>
        }
      />
    </React.Fragment>
  )
})

export default Agreement
