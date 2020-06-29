import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Transition, animated } from 'react-spring'
import {
  Box,
  Button,
  ProgressBar,
  springs,
  textStyle,
  useLayout,
  useTheme,
  GU,
} from '@aragon/ui'
import checklistCompleteGraphic from './assets/checklist-complete.png'

function countProgress(items) {
  return items.filter(([_, checked]) => checked).length
}

const AnimatedDiv = animated.div

function ConfigurationChecklist({ items, onClose }) {
  const [progress, setProgress] = useState(countProgress(items))
  const theme = useTheme()

  const barProgress = (1 / items.length) * progress
  const checklistComplete = items.length === progress

  useEffect(() => {
    setProgress(countProgress(items))
  }, [items])

  return (
    <Box heading="Configuration checklist" padding={0}>
      <Transition
        native
        items={checklistComplete}
        from={{
          opacity: 0,
          transform: 'scale(0.7)',
        }}
        enter={{
          opacity: 1,
          transform: 'scale(1)',
        }}
        config={springs.smooth}
      >
        {show =>
          show &&
          (props => (
            <BoxSection>
              <AnimatedDiv
                style={props}
                css={`
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                `}
              >
                <h2
                  css={`
                    text-align: center;
                    margin-bottom: ${2 * GU}px;
                  `}
                >
                  All done! Congratulations!
                </h2>
                <img
                  src={checklistCompleteGraphic}
                  css={`
                    height: 130px;
                  `}
                />
              </AnimatedDiv>
            </BoxSection>
          ))
        }
      </Transition>
      {!checklistComplete &&
        items.map(([label, checked]) => (
          <BoxSection key={label}>
            <ChecklistItem label={label} checked={checked} />
          </BoxSection>
        ))}

      <BoxSection>
        <div
          css={`
            padding-bottom: ${1 * GU}px;
          `}
        >
          <label
            css={`
              display: flex;
              justify-content: space-between;
              color: ${theme.surfaceContentSecondary};
              margin-bottom: ${1 * GU}px;

              ${textStyle('label2')}
            `}
          >
            <span>Progress</span>
            <span>
              {progress}/{items.length}
            </span>
          </label>
          <ProgressBar value={barProgress} />
          {checklistComplete && (
            <Button
              label="Close"
              wide
              onClick={onClose}
              css={`
                margin-top: ${2 * GU}px;
              `}
            />
          )}
        </div>
      </BoxSection>
    </Box>
  )
}

ConfigurationChecklist.propTypes = {
  items: PropTypes.arrayOf(PropTypes.array),
  onClose: PropTypes.func,
}

/* eslint-disable react/prop-types */

// Checklist items use a custom style and not a standard checkbox because they are non-interactive and thus should not:
// - Look like other elements that are known to be interactive
// - Have or inherit hover, active or focus states
function ChecklistItem({ label, checked }) {
  const theme = useTheme()

  return (
    <label
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${3 * GU}px;
          height: ${3 * GU}px;
          border-radius: 100%;
          margin-right: ${1.5 * GU}px;
          background-color: ${theme.infoSurface};
        `}
      >
        {checked && <Check color={theme.surfaceContent} />}
      </div>
      <span
        css={`
          color: ${checked
            ? theme.surfaceContent
            : theme.surfaceContentSecondary};
        `}
      >
        {label}
      </span>
    </label>
  )
}

const Check = ({ color }) => (
  <svg width="12" height="8" viewBox="0 0 12 8">
    <path
      d={`
        M11.059 1.393
        L4.335  7.395
        L0.944  3.260
        L2.104  2.309
        L4.503  5.234
        L10.060 0.274
        L11.059 1.393
        Z
      `}
      fill={color}
    />
  </svg>
)

function BoxSection({ children, ...props }) {
  const { layoutName } = useLayout()
  const theme = useTheme()

  return (
    <div
      css={`
        padding: ${2 * GU}px ${layoutName === 'small' ? 2 * GU : 3 * GU}px;

        & + & {
          border-top: 1px solid ${theme.border};
        }
      `}
      {...props}
    >
      {children}
    </div>
  )
}
/* eslint-enable react/prop-types */

export default ConfigurationChecklist
