import React, { useCallback, useMemo } from 'react'
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
import AgreementDoc from './AgreementDoc'
import AgreementHeader from './AgreementHeader'

const Agreement = React.memo(function Agreement() {
  const { layoutName } = useLayout()

  const handleUpdateApp = useCallback(() => {
    console.log('Update app entry')
  }, [])
  const handleRemoveApp = useCallback(() => {
    console.log('Remove app entry')
  }, [])

  const testItem = useMemo(() => {
    return {
      entryActions: [
        [handleUpdateApp, IconEdit, 'Update'],
        [handleRemoveApp, IconTrash, 'Remove'],
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
  }, [handleUpdateApp, handleRemoveApp])

  const testItems = useMemo(() => [testItem, testItem, testItem], [testItem])

  const handleUpdateAgreement = useCallback(() => {}, [])

  return (
    <React.Fragment>
      <Header
        primary="Agreement"
        secondary={
          <Button
            mode="strong"
            onClick={handleUpdateAgreement}
            label="Update Agreement"
            icon={<IconEdit />}
            display={layoutName === 'small' ? 'icon' : 'label'}
          />
        }
      />

      <Split
        primary={
          <React.Fragment>
            <Box>
              <AgreementHeader />
              <AgreementDetails
                IPFSLink="QmXpcBiGZ7Uep2tmhxLhfA8ak1aYDUyevFSnpUa4Gc9kRn"
                AuthorHash="0xc41e4c10b37d3397a99d4a90e7d85508a69a5c4c"
                StakingHash="0x281c36aee917b24d8e5f59481f6639d81e4cf7125b09fb93a2b43c31ef3fc115"
                ContractHash="0x281c36aee917b24d8e5f59481f6639d81e4cf7125b09fb93a2b43c31ef3fc115"
              />
            </Box>
            {testItems && testItems.length > 0 ? (
              <DisputableApps items={testItems} />
            ) : (
              <DisputableAppsEmpty />
            )}
            <AgreementDoc />
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            <Box heading="Configuration checklist">Configuration checklist</Box>
            <Box heading="Version history">Version history</Box>
          </React.Fragment>
        }
      />
    </React.Fragment>
  )
})

export default Agreement
