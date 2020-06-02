import React, { useEffect, useState } from 'react'
import {
  Box,
  Checkbox,
  useLayout,
  GU,
  useTheme,
  ProgressBar,
  textStyle,
  Button,
  springs,
} from '@aragon/ui'
import PropTypes from 'prop-types'
import checklistCompleteGraphic from './assets/checklist-complete.png'
import { Transition, animated } from 'react-spring'

function countProgress(items) {
  return items.filter(([_, checked]) => checked).length
}

const AnimatedDiv = animated.div

function ConfigurationChecklist({ items, onCloseClick, onTestProgress }) {
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
            <BoxInner>
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
            </BoxInner>
          ))
        }
      </Transition>
      {!checklistComplete &&
        items.map(([label, checked]) => (
          <BoxInner key={label}>
            <ChecklistItem label={label} checked={checked} />
          </BoxInner>
        ))}

      <BoxInner>
        <div
          css={`
            padding-bottom: ${GU}px;
          `}
        >
          <label
            css={`
              ${textStyle('label2')}

              display: flex;
              justify-content: space-between;
              color: ${theme.surfaceContentSecondary};

              line-height: 1.2;
              margin-bottom: ${GU}px;
            `}
          >
            <span>Progress</span>
            <span>
              {progress}/{items.length}
            </span>
          </label>
          <ProgressBar value={barProgress} />
          {checklistComplete ? (
            <Button
              label="Close"
              wide
              onClick={onCloseClick}
              css={`
                margin-top: ${2 * GU}px;
              `}
            />
          ) : (
            <Button
              label="Test progress"
              wide
              onClick={onTestProgress}
              css={`
                margin-top: ${2 * GU}px;
              `}
            />
          )}
        </div>
      </BoxInner>
    </Box>
  )
}

ConfigurationChecklist.propTypes = {
  items: PropTypes.arrayOf(PropTypes.array),
  onCloseClick: PropTypes.func,
  onTestProgress: PropTypes.func,
}

/* eslint-disable react/prop-types */
function ChecklistItem({ label, checked }) {
  return (
    <label
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <Checkbox
        checked={checked}
        css={`
          margin-right: ${1 * GU}px;
          /* Align checkbox flush with left edge */
          margin-left: 0;
        `}
      />
      <span
        css={`
          line-height: 1.1;
        `}
      >
        {label}
      </span>
    </label>
  )
}

function BoxInner({ children, ...props }) {
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
