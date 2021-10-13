import React from 'react'
import PropTypes from 'prop-types'
import { textStyle, GU, Link, useTheme, ProgressBar, Info } from '@aragon/ui'
import { useWallet } from '../../contexts/wallet'
import DeploymentStepsItem from './DeploymentStepsItem'
import { TransactionStatusType } from '../../prop-types'

function DeploymentStepsPanel({ transactionsStatus, pending, allSuccess }) {
  const theme = useTheme()
  const { providerInfo } = useWallet()

  return (
    <aside
      css={`
        display: flex;
        flex-direction: column;
        width: 100%;
        min-height: 100%;
        padding: ${16 * GU}px ${3 * GU}px ${2 * GU}px;
        background: ${theme.surface};
        border-right: 1px solid ${theme.border};
      `}
    >
      <ProgressBar
        value={Math.max(
          0,
          Math.min(
            1,
            allSuccess
              ? 1
              : transactionsStatus.length
              ? pending / transactionsStatus.length
              : 0
          )
        )}
      />
      <div
        css={`
          padding: ${3 * GU}px 0 ${3 * GU}px;
          ${textStyle('body1')};
          text-align: center;
          color: ${theme.surfaceContentSecondary};
        `}
      >
        Launching your organization
      </div>

      <div
        css={`
          flex-grow: 1;
          padding-top: ${8 * GU}px;
          padding-bottom: ${3 * GU}px;
        `}
      >
        <h1
          css={`
            ${textStyle('label2')};
            color: ${theme.surfaceContentSecondary};
          `}
        >
          Signature process
        </h1>

        <div>
          {transactionsStatus.map(({ name, status }, index) => (
            <DeploymentStepsItem
              key={index}
              index={index}
              name={name}
              status={status}
            />
          ))}
        </div>
      </div>

      {!allSuccess && (
        <Info mode="warning">
          It might take some time before these transactions get processed.
          Please be patient and <strong>do not close this window</strong> until
          it finishes.{' '}
          {providerInfo.id === 'metamask' && (
            <>
              Additionally, do not use the{' '}
              <InlineLink href="https://metamask.zendesk.com/hc/en-us/articles/360015489251-How-to-Speed-Up-a-Transaction">
                "Speed Up"
              </InlineLink>{' '}
              MetaMask feature, otherwise you may not be able to finish creating
              your organization.{' '}
            </>
          )}
          For more details,{' '}
          <InlineLink href="https://help.aragon.org/article/39-launch-taking-a-long-time-to-process">
            refer to the help desk.
          </InlineLink>
        </Info>
      )}
    </aside>
  )
}

DeploymentStepsPanel.propTypes = {
  allSuccess: PropTypes.bool.isRequired,
  pending: PropTypes.number.isRequired,
  transactionsStatus: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      status: TransactionStatusType.isRequired,
    })
  ).isRequired,
}

const InlineLink = ({ href, children }) => (
  <Link href={href} css={'display: inline; white-space: normal'}>
    {children}
  </Link>
)

InlineLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default DeploymentStepsPanel
