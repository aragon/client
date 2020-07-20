import React, { useMemo, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Info, IdentityBadge, textStyle, noop, GU } from '@aragon/ui'
import { AppType } from '../../prop-types'
import { getAppByProxyAddress, getErrorMessage } from './utils'
import InfoField from './InfoField'
import LocalLabelAppBadge from '../../components/LocalLabelAppBadge/LocalLabelAppBadge'
import MultiScreenModal from './MultiScreenModal'
import {
  STEPPER_WORKING,
  STEPPER_SUCCESS,
  STEPPER_ERROR,
  STEP_SUCCESS,
} from './TransactionStepper/stepper-statuses'
import TransactionStepper from './TransactionStepper/TransactionStepper'
import { useWallet } from '../../wallet'

function SignMessageFlow({ signatureBag, visible, apps, onClose }) {
  const [error, setError] = useState()
  const { web3: walletWeb3, account } = useWallet()

  const infoMessages = useMemo(() => {
    return {
      [STEPPER_WORKING]: `Open your Ethereum provider (Metamask or similar) to sign the message. Do not close the web browser window until the process is finished.`,
      [STEPPER_SUCCESS]: `Success! The signature request was completed. You can close this window.`,
      [STEPPER_ERROR]: getErrorMessage(`Your message wasn't signed.`, error),
    }
  }, [error])

  const { message, requestingApp } = useMemo(() => {
    const { requestingApp, message } = signatureBag
    return {
      message: message || '',
      requestingApp: getAppByProxyAddress(requestingApp, apps),
    }
  }, [signatureBag, apps])

  const handleMsgSign = useCallback(
    async ({ setStepWorking, setStepSuccess, setStepError }) => {
      try {
        const signature = await walletWeb3.eth.personal.sign(
          signatureBag.message,
          account
        )
        setStepWorking()

        signatureBag.resolve(signature)
        setStepSuccess()
      } catch (err) {
        signatureBag.reject(err)
        setError(err)
        setStepError()
      }
    },
    [signatureBag, account, walletWeb3]
  )

  const transactionSteps = useMemo(
    () => [
      {
        title: 'Sign message',
        handleSign: handleMsgSign,
        descriptions: {
          [STEP_SUCCESS]: 'Message signed',
        },
      },
    ],
    [handleMsgSign]
  )

  const modalScreens = useMemo(
    () => [
      {
        title: 'Sign Message',
        content: modalProps => (
          <React.Fragment>
            <p
              css={`
                margin-bottom: ${2 * GU}px;
              `}
            >
              You are about to sign this message with enabled account{' '}
              <IdentityBadge
                entity={account}
                connectedAccount
                compact
                labelStyle={`
                  ${textStyle('body3')}
                `}
              />
            </p>
            <InfoField title="Signature requested by">
              <LocalLabelAppBadge app={requestingApp} apps={[]} noIdentifier />
            </InfoField>

            <Info mode="description" title="Message to be signed">
              {message}
            </Info>

            <Info
              css={`
                margin-top: ${2 * GU}px;
              `}
            >
              By signing this message you confirm that have control over the
              enabled account. Your Ethereum address will then be publicly
              associated with the signed message. This won’t cost you any ETH.
            </Info>
            <Button
              wide
              mode="strong"
              onClick={modalProps.nextScreen}
              css={`
                margin-top: ${2 * GU}px;
              `}
            >
              Sign message
            </Button>
          </React.Fragment>
        ),
      },
      {
        title: 'Sign Message',
        content: () => (
          <div
            css={`
              padding-top: ${3 * GU}px;
            `}
          >
            <TransactionStepper steps={transactionSteps} info={infoMessages} />
          </div>
        ),
      },
    ],
    [transactionSteps, message, requestingApp, account, infoMessages]
  )

  return (
    <MultiScreenModal
      visible={visible}
      screens={modalScreens}
      onClose={onClose}
    />
  )
}

SignMessageFlow.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  signatureBag: PropTypes.object,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
}

SignMessageFlow.defaultProps = {
  onClose: noop,
}

export default SignMessageFlow
