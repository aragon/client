import React, { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Header,
  IconEdit,
  IconTrash,
  Split,
  useLayout,
} from '@aragon/ui'
import { STATUS_ACTIVE, STATUS_PENDING } from './agreement-statuses'
import AgreementDetails from './AgreementDetails'
import AgreementHeader from './AgreementHeader'
import DisputableApps from './DisputableApps/DisputableApps'
import DisputableAppsEmpty from './DisputableApps/DisputableAppsEmpty'

const Agreement = React.memo(function Agreement() {
  const [agreementStatus, setAgreementStatus] = useState(STATUS_PENDING)
  const { layoutName } = useLayout()

  const compactMode = layoutName === 'small'

  // TODO: Replace with real data
  const mockAppItem = useMemo(() => {
    return {
      entryActions: [
        [
          () => {
            console.log('Update disputable app')
          },
          <IconEdit />,
          'Update',
        ],
        [
          () => {
            console.log('Remove disputable app')
          },
          <IconTrash />,
          'Remove',
        ],
      ],
      allowedActions: ['Action one', 'Action two', 'Action three'],
      actionCollateral: {
        amount: 100,
        symbol: 'ANT',
        address: '0x960b236A07cf122663c4303350609A66A7B288C0',
      },
      challengeCollateral: {
        amount: 100,
        symbol: 'ANT',
        address: '0x960b236A07cf122663c4303350609A66A7B288C0',
      },
      signerEligibility: {
        amount: 5,
        symbol: 'ANT',
        address: '0x960b236A07cf122663c4303350609A66A7B288C0',
      },
      challengeEligibility: 'Open to everyone',
      challengePeriod: 48,
      settlementPeriod: 24,
    }
  }, [])

  const mockAppItems = useMemo(() => [mockAppItem, mockAppItem, mockAppItem], [
    mockAppItem,
  ])

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
                ipfsLink="QmXpcBiGZ7Uep2tmhxLhfA8ak1aYDUyevFSnpUa4Gc9kRn"
                authorAddress="0xc41e4c10b37d3397a99d4a90e7d85508a69a5c4c"
                stakingAddress="0x7c708ac7db979fa06705f8880f29f82cfc406993"
                contractAddress="0x7c708ac7db979fa06705f8880f29f82cfc406993"
              />
            </Box>
            {mockAppItems.length > 0 ? (
              <DisputableApps items={mockAppItems} />
            ) : (
              <DisputableAppsEmpty />
            )}
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
