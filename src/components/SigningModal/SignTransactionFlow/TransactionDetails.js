import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { textStyle, GU, Info, noop } from '@aragon/ui'
import AnnotatedDescription from './AnnotatedDescription'
import { AppType } from '../../../prop-types'
import DetailField from '../DetailField'
import { getAppByProxyAddress } from '../utils'
import LocalIdentityBadge from '../../../components/IdentityBadge/LocalIdentityBadge'
import SignerButton from '../SignerButton'
import TransactionJourney from '../TransactionJourney'

function TransactionDetails({
  actionPaths,
  apps,
  directPath,
  intent,
  onCreate,
}) {
  const showPaths = !directPath

  const pathItems = useMemo(
    () =>
      showPaths
        ? actionPaths.map(({ name, description, to }, i) => [
            name,
            {
              app: getAppByProxyAddress(to, apps),
              content: (
                <p>
                  {/* Make last path description generic */}
                  {i === actionPaths.length - 1
                    ? 'The proposed action will be automatically executed if the previous step on the path is completed successfully'
                    : description}
                </p>
              ),
            },
          ])
        : [
            [
              intent.name,
              {
                app: getAppByProxyAddress(intent.to, apps),
                content: (
                  <p>
                    You are able to directly interact with the {intent.name}{' '}
                    app.
                  </p>
                ),
              },
            ],
          ],
    [actionPaths, apps, showPaths, intent]
  )

  return (
    <React.Fragment>
      <DetailField title="Action requirements">
        <p>
          {showPaths
            ? 'You have met the requirements to propose this action through the following transaction path.'
            : 'The action is protected by a permission, and you hold that permission. '}
        </p>
      </DetailField>

      <DetailField
        title={
          showPaths ? 'Indirect transaction path' : 'Direct transaction path'
        }
      >
        <TransactionJourney
          items={pathItems}
          css={`
            padding-top: ${0.5 * GU}px;
            max-width: ${60 * GU}px;
          `}
        />
      </DetailField>

      <Info mode="description" title="Action to be triggered">
        <p>This transaction will {showPaths ? 'eventually' : ''} perform</p>
        <div
          css={`
            margin-top: ${0.5 * GU}px;
            margin-bottom: ${0.5 * GU}px;
            margin-left: ${1 * GU}px;
          `}
        >
          <AnnotatedDescription intent={intent} />
        </div>
      </Info>

      {intent.external && (
        <ExternalMessage
          installed={intent.installed}
          to={intent.to}
          css={`
            margin-top: ${2 * GU}px;
          `}
        />
      )}

      <SignerButton onClick={onCreate}>Create transaction</SignerButton>
    </React.Fragment>
  )
}

TransactionDetails.propTypes = {
  actionPaths: PropTypes.array,
  apps: PropTypes.arrayOf(AppType).isRequired,
  directPath: PropTypes.bool.isRequired,
  intent: PropTypes.object.isRequired,
  onCreate: PropTypes.func,
}

TransactionDetails.defaultProps = {
  onCreate: noop,
}

/* eslint-disable react/prop-types */
function ExternalMessage({ installed, to, className }) {
  return (
    <div className={className}>
      <Info mode="warning" title="Warning">
        {installed ? (
          `Be aware that this is an attempt to execute a transaction on
          another app that is installed in this organization. You may
          want to double check that app’s functionality before
          proceeding.`
        ) : (
          <React.Fragment>
            Be aware that this is an attempt to execute a transaction on an{' '}
            <strong css="font-weight: 800">external contract</strong> that may
            not have been reviewed or audited. This means that it might behave
            unexpectedly. Please{' '}
            <strong css="font-weight: 800">
              make sure you trust the contract at
            </strong>{' '}
            <LocalIdentityBadge
              entity={to}
              labelStyle={`
                      ${textStyle('body3')}
                    `}
              compact
            />{' '}
            before proceeding.
          </React.Fragment>
        )}
      </Info>
    </div>
  )
}
/* eslint-enable react/prop-types */

export default TransactionDetails
