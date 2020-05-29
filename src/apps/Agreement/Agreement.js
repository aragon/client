import React, { useCallback, useMemo } from 'react'
import { Box, Button, Header, Split, IconEdit, useLayout } from '@aragon/ui'
import DisputableApps from './DisputableApps'
import AgreementDetails from './AgreementDetails'
import AgreementDoc from './AgreementDoc'
import AgreementHeader from './AgreementHeader'

function Agreement() {
  const { layoutName } = useLayout()

  const testItem = useMemo(() => {
    return {
      actions: ['Action one', 'Action two', 'Action three'],
      collateral: 100,
      challenge: 100,
      signerEligibility: 1,
      challengeEligibility: 'everyone',
      challengePeriod: 48,
      settlementPeriod: 24,
    }
  }, [])

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
            <DisputableApps items={testItems} />
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
}

export default Agreement
