import React, { useCallback, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Header,
  Split,
  IconEdit,
  useLayout,
  IconTrash,
} from '@aragon/ui'
import DisputableApps from './DisputableApps/DisputableApps'
import DisputableAppsEmpty from './DisputableApps/DisputableAppsEmpty'
import AgreementDetails from './AgreementDetails'
import AgreementDocument from './AgreementDocument'
import AgreementHeader from './AgreementHeader'
import ConfigurationChecklist from './ConfigurationChecklist'
import VersionHistory from './VersionHistory'
import VotePending from './VotePending'
import { STATUS_PENDING, STATUS_ACTIVE } from './agreement-statuses'

const Agreement = React.memo(function Agreement() {
  const { layoutName } = useLayout()
  const [checklistCompleted, setChecklistCompleted] = useState(false)
  const [agreementStatus, setAgreementStatus] = useState(STATUS_PENDING)

  const handleChecklistClose = useCallback(() => {
    setChecklistCompleted(true)
  }, [])

  // TODO: Replace with real data
  const mockEndDate = useMemo(() => {
    const NOW = Date.now()
    const DAY = 1000 * 60 * 60 * 24

    return new Date(NOW + 5 * DAY)
  }, [])

  // TODO: Replace with real data
  const mockChecklistItems = useMemo(
    () => [
      ['Create Agreement', true],
      ['Set permissions', true],
      ['Set actions requirements', true],
      ['Share with members', false],
    ],
    []
  )

  // TODO: Replace with real data
  const mockHistoryItems = useMemo(
    () => ['2020/05/22', '2020/05/21', '2020/05/20'],
    []
  )

  // TODO: Replace with real data
  const mockAppItem = useMemo(() => {
    return {
      entryActions: [
        [
          () => {
            console.log('Update disputable app')
          },
          IconEdit,
          'Update',
        ],
        [
          () => {
            console.log('Remove disputable app')
          },
          IconTrash,
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
            display={layoutName === 'small' ? 'icon' : 'label'}
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
                StakingHash="0x281c36aee917b24d8e5f59481f6639d81e4cf7125b09fb93a2b43c31ef3fc115"
                ContractHash="0x281c36aee917b24d8e5f59481f6639d81e4cf7125b09fb93a2b43c31ef3fc115"
              />
            </Box>
            {mockAppItems.length > 0 ? (
              <DisputableApps items={mockAppItems} />
            ) : (
              <DisputableAppsEmpty />
            )}
            <AgreementDocument title="DAO Agreement" />
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            {!checklistCompleted && (
              <ConfigurationChecklist
                items={mockChecklistItems}
                onClose={handleChecklistClose}
              />
            )}

            <Box heading="Version history" padding={0}>
              {agreementStatus === STATUS_PENDING && (
                <VotePending endDate={mockEndDate} />
              )}
              {agreementStatus === STATUS_ACTIVE && (
                <VersionHistory items={mockHistoryItems} />
              )}
            </Box>
          </React.Fragment>
        }
      />
    </React.Fragment>
  )
})

export default Agreement
