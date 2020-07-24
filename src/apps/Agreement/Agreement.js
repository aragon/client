import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  formatTokenAmount,
  Header,
  IconEdit,
  IconTrash,
  noop,
  Split,
  useLayout,
} from '@aragon/ui'
import { addressesEqual } from '../../web3-utils'
import { STATUS_ACTIVE, STATUS_PENDING } from './agreement-statuses'
import AgreementDetails from './AgreementDetails'
import AgreementDocument from './AgreementDocument'
import AgreementHeader from './AgreementHeader'
import { AppType } from '../../prop-types'
import ConfigurationChecklist from './ConfigurationChecklist'
import { dateFormat, durationToHours } from '../../date-utils'
import DisputableApps from './DisputableApps/DisputableApps'
import DisputableAppsEmpty from './DisputableApps/DisputableAppsEmpty'
import VersionHistory from './VersionHistory'
import VotePending from './VotePending'
import { usePermissions } from '../../contexts/PermissionsContext'

import { MOCK_AGREEMENTS, MOCK_AGREEMENT_DOC } from './mock-data'

function Agreement({ apps }) {
  const [checklistCompleted, setChecklistCompleted] = useState(true)
  const { layoutName } = useLayout()
  const { getAppRoles } = usePermissions()

  // TODO: Replace with real data
  const agreement = MOCK_AGREEMENTS[0]
  const { appAddress, stakingPool, versions, connectedApps } = agreement
  const { title, content } = agreement.currentVersion

  const agreementStatus = STATUS_ACTIVE
  const compactMode = layoutName === 'small'

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
      ['Share with members', true],
    ],
    []
  )

  const historyItems = useMemo(
    () =>
      versions.map(({ effectiveFrom }) =>
        dateFormat(effectiveFrom, 'onlyDate')
      ),
    [versions]
  )

  const appItems = useMemo(
    () =>
      connectedApps.map(
        ({
          appAddress,
          collateralToken: { address, decimals, symbol },
          actionAmount,
          challengeAmount,
          challengeDuration,
        }) => {
          const app = apps.find(app =>
            addressesEqual(app.proxyAddress, appAddress)
          )
          const roles = getAppRoles(app)
            .filter(({ role }) => role && role.name)
            .map(({ role }) => role.name)

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
            app: app,
            allowedActions: roles,
            actionCollateral: {
              amount: formatTokenAmount(actionAmount, decimals),
              symbol,
              address,
            },
            challengeCollateral: {
              amount: formatTokenAmount(challengeAmount, decimals),
              symbol,
              address,
            },
            settlementPeriod: durationToHours(challengeDuration),
          }
        }
      ),
    [connectedApps, apps, getAppRoles]
  )

  return (
    <React.Fragment>
      <Header
        primary="Agreement"
        secondary={
          <Button
            disabled
            mode="strong"
            label="Update Agreement"
            onClick={noop}
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
                title={title}
                status={agreementStatus}
                onSign={() => {
                  console.log('Signed')
                }}
                onShare={() => {
                  console.log('Shared')
                }}
              />
              <AgreementDetails
                ipfsUri={content}
                stakingAddress={stakingPool}
                contractAddress={appAddress}
              />
            </Box>
            {appItems.length > 0 ? (
              <DisputableApps items={appItems} />
            ) : (
              <DisputableAppsEmpty />
            )}
            <AgreementDocument content={MOCK_AGREEMENT_DOC} />
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
                <VersionHistory items={historyItems} />
              )}
            </Box>
          </React.Fragment>
        }
      />
    </React.Fragment>
  )
}

Agreement.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
}

export default React.memo(Agreement)
