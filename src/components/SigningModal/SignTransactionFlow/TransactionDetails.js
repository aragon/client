import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { textStyle, Link, GU, Info, Button, useTheme } from '@aragon/ui'
import AddressLink from '../AddressLink'
import { AppType } from '../../../prop-types'
import { getAppByProxyAddress } from '../utils'
import LocalIdentityBadge from '../../../components/IdentityBadge/LocalIdentityBadge'
import { modalProps } from '../prop-types'
import TransactionJourney from '../TransactionJourney'
import { useRouting } from '../../../routing'

function TransactionDetails({
  modalProps,
  actionPaths,
  intent,
  directPath,
  apps,
}) {
  const { nextScreen } = modalProps
  const showPaths = !directPath

  const pathItems = useMemo(
    () =>
      showPaths
        ? actionPaths.map(({ name, description, to }, i) => {
            return [
              name,
              {
                app: getAppByProxyAddress(to, apps),
                content: (
                  <p>
                    {/* Temporarily make last path description generic */}
                    {i === actionPaths.length - 1
                      ? 'The proposed action will be automatically executed if the previous step on the path is completed successfully'
                      : description}
                  </p>
                ),
              },
            ]
          })
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
      <InfoField title="Action requirements">
        <p>
          {showPaths
            ? 'You have met the requirements to propose this action through the following transaction path.'
            : 'The action is protected by a permission, and you hold that permission. '}
        </p>
      </InfoField>

      <InfoField
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
      </InfoField>

      <ActionToBeTriggered showPaths={showPaths} intent={intent} />

      {intent.external && (
        <ExternalMessage
          installed={intent.installed}
          to={intent.to}
          css={`
            margin-top: ${2 * GU}px;
          `}
        />
      )}

      <Button
        wide
        mode="strong"
        onClick={nextScreen}
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        Create transaction
      </Button>
    </React.Fragment>
  )
}

TransactionDetails.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  modalProps: modalProps,
  actionPaths: PropTypes.array,
  intent: PropTypes.object,
  directPath: PropTypes.bool,
}

/* eslint-disable react/prop-types */
function InfoField({ title, children }) {
  const theme = useTheme()
  return (
    <div
      css={`
        margin-bottom: ${3.5 * GU}px;
      `}
    >
      <h2
        css={`
          ${textStyle('label2')}

          color: ${theme.surfaceContentSecondary};
          margin-bottom: ${1 * GU}px;
        `}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

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

function ActionToBeTriggered({ showPaths, intent }) {
  const routing = useRouting()
  const { description, name, to, annotatedDescription } = intent

  return (
    <Info mode="description" title="Action to be triggered">
      <p>This transaction will {showPaths ? 'eventually' : ''} perform</p>
      <div
        css={`
          margin-top: ${0.5 * GU}px;
          margin-bottom: ${0.5 * GU}px;
          margin-left: ${1 * GU}px;
        `}
      >
        {annotatedDescription
          ? annotatedDescription.map(({ type, value }, index) => {
              if (type === 'address' || type === 'any-account') {
                return (
                  <span
                    key={index}
                    css={`
                      position: relative;
                      display: inline-flex;
                      vertical-align: middle;
                      margin-right: ${0.5 * GU}px;
                    `}
                  >
                    <LocalIdentityBadge
                      entity={type === 'any-account' ? 'Any account' : value}
                      labelStyle={`
                            ${textStyle('body3')}
                          `}
                      compact
                    />
                  </span>
                )
              }
              if (type === 'app') {
                return (
                  <Link
                    key={index}
                    href={`#${routing.path(({ mode }) => ({
                      mode: {
                        ...mode,
                        name: 'org',
                        instanceId: 'permissions',
                        instancePath: `/app/${value.proxyAddress}`,
                      },
                    }))}`}
                    focusRingSpacing={[3, 2]}
                    css={`
                      margin-right: ${0.25 * GU}px;
                    `}
                  >
                    {value.name}
                  </Link>
                )
              }
              if (type === 'role' || type === 'kernelNamespace') {
                return (
                  <span
                    key={index}
                    css={`
                      margin-right: ${0.5 * GU}px;
                      font-style: italic;
                    `}
                  >
                    “{value.name}”
                  </span>
                )
              }
              if (type === 'apmPackage') {
                return (
                  <span
                    key={index}
                    css={`
                      display: inline-flex;
                      vertical-align: middle;
                      margin-right: ${0.5 * GU}px;
                    `}
                  >
                    <LocalIdentityBadge
                      entity={value.name}
                      labelStyle={`${textStyle('body3')}`}
                    />
                  </span>
                )
              }
              return (
                <span
                  key={index}
                  css={`
                    margin-right: ${0.5 * GU}px;
                  `}
                >
                  {value}
                </span>
              )
            })
          : description || 'an action'}
      </div>
      <p>
        {' on '}
        <AddressLink to={to}>{name}</AddressLink>.
      </p>
    </Info>
  )
}
/* eslint-enable react/prop-types */

export default TransactionDetails
