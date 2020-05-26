import React from 'react'
import { Box, Button, Header, Split } from '@aragon/ui'
import DisputableAppsList from './DisputableAppsList'
import DocPreview from './DocPreview'
import Overview from './Overview'

function Agreement() {
  const testItem = {
    actions: ['Action one', 'Action two', 'Action three'],
    collateral: 100,
    challenge: 100,
    signerEligibility: 1,
    challengeEligibility: 'everyone',
    challengePeriod: 48,
    settlementPeriod: 24,
  }

  const testItems = [testItem, testItem, testItem]

  return (
    <React.Fragment>
      <Header
        primary="Agreement"
        secondary={<Button mode="strong" label="Update Agreement" />}
      />

      <Split
        primary={
          <React.Fragment>
            <Overview />
            <DisputableAppsList items={testItems} />
            <DocPreview />
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            <Box heading="Configuration checklist">Config checklist</Box>
            <Box heading="Version history">Version history</Box>
          </React.Fragment>
        }
      />
    </React.Fragment>
  )
}

export default Agreement
