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
import Check from '../Check'

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
        <div
          css={`
            display: flex;
            align-items: center;
            flex-grow: 1;
          `}
        >
          <div
            css={`
              display: flex;
              width: 100%;
            `}
          >
            <Field
              label="Name of existing organization"
              css={`
                width: 100%;
              `}
            >
              <TextInput
                wide
                placeholder="Type an organization name"
                adornment={
                  <div
                    css={`
                      height: 100%;
                      display: flex;
                      align-items: center;
                      border-left: 1px solid ${theme.border};
                      padding: 0 ${2 * GU}px;
                    `}
                  >
                    .aragonid.eth
                  </div>
                }
                adornmentPosition="end"
              />
            </Field>
            <div
              css={`
                display: flex;
                align-items: center;
                height: ${5 * GU}px;
                margin-top: ${2.5 * GU}px;
                margin-left: ${2 * GU}px;
              `}
            >
              <Check />
            </div>
          </div>
        </div>
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
