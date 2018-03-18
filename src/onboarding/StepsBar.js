import React from 'react'
import styled from 'styled-components'
import { Motion, spring } from 'react-motion'
import { spring as springConf, Text } from '@aragon/ui'
import * as Steps from './steps'
import { lerp } from '../math-utils'

const STEPS_COUNT = Steps.ProgressBarGroups.length

class ProgressBar extends React.Component {
  static defaultProps = {
    activeGroup: Steps.ProgressBarGroups[0].group,
  }
  currentStepIndex() {
    return Steps.ProgressBarGroups.findIndex(
      ({ group }) => group === this.props.activeGroup
    )
  }
  render() {
    const stepIndex = this.currentStepIndex()
    const visible = stepIndex > -1

    return (
      <Motion
        style={{
          showProgress: spring(Number(visible), springConf('fast')),
          stepProgress:
            stepIndex > 0 ? spring(stepIndex, springConf('fast')) : 0,
        }}
      >
        {({ showProgress, stepProgress }) => (
          <Main
            style={{
              pointerEvents: visible ? 'auto' : 'none',
              transform: `translateY(${lerp(showProgress, -40, 0)}px)`,
              opacity: showProgress,
            }}
          >
            <Progress>
              <Line />
              <Line
                style={{
                  transform: `scaleX(
                    ${Math.max(0, stepProgress) / (STEPS_COUNT - 1)}
                  )`,
                }}
                active
              />
              <StepsContainer>
                {Steps.ProgressBarGroups.map(({ label }, index) => (
                  <StepWrapper
                    key={index}
                    label={label}
                    active={
                      stepIndex >= index ||
                      Math.floor(stepProgress + 0.05) >= index + 1
                    }
                  />
                ))}
              </StepsContainer>
            </Progress>
          </Main>
        )}
      </Motion>
    )
  }
}

class StepWrapper extends React.PureComponent {
  render() {
    const { label, active } = this.props
    return (
      <Step>
        <Text color={active ? COLOR_ACTIVE : COLOR_TEXT} smallcaps>
          {label}
        </Text>
        <Disc active={active} />
      </Step>
    )
  }
}

const COLOR_TEXT = '#C0C0C0'
const COLOR_INACTIVE = '#D8D8D8'
const COLOR_ACTIVE = '#02B9E4'

const Main = styled.div`
  position: absolute;
  display: flex;
  top: 40px;
  width: 100%;
  justify-content: center;
`

const Progress = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  max-width: 790px;
  height: 40px;
`

const Line = styled.div`
  position: absolute;
  z-index: 1;
  bottom: 4px;
  width: ${100 - 100 / STEPS_COUNT}%;
  margin-left: calc(${100 / STEPS_COUNT}% / 2);
  height: 2px;
  background: ${({ active }) => (active ? COLOR_ACTIVE : COLOR_INACTIVE)};
  transform-origin: 0 50%;
`

const StepsContainer = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  width: 100%;
`

const Step = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: ${100 / STEPS_COUNT}%;
  height: 100%;
  text-align: center;
  color: ${COLOR_TEXT};
`

const Disc = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background: ${({ active }) => (active ? COLOR_ACTIVE : COLOR_INACTIVE)};
`

export default ProgressBar
