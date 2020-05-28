import React, { useCallback } from 'react'
import {
  Box,
  Button,
  Header,
  Split,
  Field,
  Link,
  TransactionBadge,
  IdentityBadge,
  GU,
  IconEdit,
  useLayout,
} from '@aragon/ui'
import DisputableApps from './DisputableApps'
import DocPreview from './DocPreview'
import TitleWithActions from './TitleWithActions'

/* eslint-disable react/prop-types */
function InfoField({ label, children, ...props }) {
  return (
    <Field
      label={label}
      {...props}
      css={`
        margin-bottom: 0;
      `}
    >
      {({ id }) => <React.Fragment>{children}</React.Fragment>}
    </Field>
  )
}
/* eslint-enable react/prop-types */

function Agreement() {
  const { layoutName } = useLayout()

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
              <TitleWithActions />

              <div
                css={`
                  display: grid;
                  grid-gap: ${layoutName === 'small' ? GU * 3 : GU * 4}px;
                  grid-template-columns: ${layoutName === 'small'
                    ? '1fr'
                    : '1fr 1fr 1fr'};
                `}
              >
                <InfoField
                  label="Agreement IPFS Link"
                  css={`
                    ${(layoutName === 'medium' || layoutName === 'large') &&
                      'grid-column: span 2;'};
                  `}
                >
                  <Link
                    href=""
                    css={`
                      max-width: 90%;
                    `}
                  >
                    <span
                      css={`
                        display: block;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        text-align: left;
                      `}
                    >
                      QmXpcBiGZ7Uep2tmhxLhfA8ak1aYDUyevFSnpUa4Gc9kRn
                    </span>
                  </Link>
                </InfoField>
                <InfoField label="Created by">
                  <IdentityBadge
                    customLabel="Wesley Crusher"
                    entity="0xc41e4c10b37d3397a99d4a90e7d85508a69a5c4c"
                  />
                </InfoField>
                <InfoField label="Arbitrator">Aragon Court</InfoField>
                <InfoField label="Staking Pool">
                  <TransactionBadge transaction="0x281c36aee917b24d8e5f59481f6639d81e4cf7125b09fb93a2b43c31ef3fc115" />
                </InfoField>
                <InfoField label="Agreement Contract">
                  <TransactionBadge transaction="0x281c36aee917b24d8e5f59481f6639d81e4cf7125b09fb93a2b43c31ef3fc115" />
                </InfoField>
              </div>
            </Box>
            <DisputableApps items={testItems} />
            <DocPreview />
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
