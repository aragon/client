import React from 'react'
import PropTypes from 'prop-types'
import {
  BackButton,
  Bar,
  Box,
  Button,
  Field,
  GU,
  TextInput,
  useTheme,
} from '@aragon/ui'
import DomainField, {
  DOMAIN_CHECK,
} from '../../components/DomainField/DomainField'

function OpenOrg({ onBack }) {
  const theme = useTheme()
  return (
    <Box padding={5 * GU}>
      <Bar
        css={`
          margin: -${5 * GU}px -${5 * GU}px 0;
          border: 0;
          border-bottom: 1px solid ${theme.border};
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        `}
      >
        <BackButton onClick={onBack} />
      </Bar>

      <div
        css={`
          display: flex;
          flex-direction: column;
          width: 100%;
          height: ${36 * GU}px;
        `}
      >
        <DomainField label="Name of existing organization" css="flex-grow: 1" />
        <div
          css={`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <Button mode="strong">Open organization</Button>
        </div>
      </div>
    </Box>
  )
}

OpenOrg.propTypes = {
  onBack: PropTypes.func.isRequired,
}

export default OpenOrg
