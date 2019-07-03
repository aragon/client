import React, { useState } from 'react'
import { Box, Checkbox, Info, GU } from '@aragon/ui'
import helAndFeedbackSvg from './help-and-feedback.svg'

const HELPSCOUT_OPTOUT_KEY = 'HELPSCOUT_OPTOUT'

function HelpAndFeedback() {
  const { handleHelpAndFeedbackChange, optedOut } = useHelpAndFeedback()

  return <View onChange={handleHelpAndFeedbackChange} checked={!optedOut} />
}

function useHelpAndFeedback() {
  const [optedOut, setOptedOut] = useState(
    localStorage.getItem(HELPSCOUT_OPTOUT_KEY) === 'true'
  )

  const handleHelpAndFeedbackChange = value => {
    // if value === true, then the user has not optedOut
    const optedOut = !value
    setOptedOut(optedOut)
    if (optedOut) {
      localStorage.setItem(HELPSCOUT_OPTOUT_KEY, 'true')
      return
    }
    localStorage.removeItem(HELPSCOUT_OPTOUT_KEY)
  }

  return { optedOut, handleHelpAndFeedbackChange }
}

function View({ onChange, checked }) {
  return (
    <Box heading="HelpScout">
      <label
        css={`
          cursor: pointer;
          display: block;
          text-align: center;
          margin-bottom: ${2 * GU}px;
        `}
      >
        <Checkbox onChange={onChange} checked={checked} />
        Allow HelpScout feedback module
      </label>
      <img
        src={helAndFeedbackSvg}
        alt="HelpScout"
        css={`
          display: block;
          margin: 0 auto;
          margin-bottom: ${2 * GU}px;
        `}
      />
      <Info>
        Help Scout lets you easily browse the knowledge base and open tickets so
        you can get support when using Aragon organizations. Disabling it will
        disable that functionality as well.
      </Info>
    </Box>
  )
}

export default HelpAndFeedback
