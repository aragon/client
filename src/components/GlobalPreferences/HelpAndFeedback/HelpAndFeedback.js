import React from 'react'
import PropTypes from 'prop-types'
import { Box, Checkbox, Info, GU } from '@aragon/ui'
import helpAndFeedbackSvg from './help-and-feedback.svg'

function HelpAndFeedback({ optedOut, onOptOutChange }) {
  // checked => not opted out
  const handleOptOutChange = checked => onOptOutChange(!checked)

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
        <Checkbox onChange={handleOptOutChange} checked={!optedOut} />
        Allow HelpScout feedback module
      </label>
      <img
        src={helAndFeedbackSvg}
        alt="HelpScout"
        css={`
          display: block;
          margin: 0 auto;
          margin-bottom: ${2 * GU}px;
          width: 300px;
          height: 156px;
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

HelpAndFeedback.propTypes = {
  optedOut: PropTypes.bool,
  onOptOutChange: PropTypes.func.isRequired,
}

export default React.memo(HelpAndFeedback)
