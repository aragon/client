import React from 'react'
import styled from 'styled-components'
import { Motion, spring } from 'react-motion'
import {
  theme,
  spring as springConf,
  Text,
  TextInput,
  IconCheck,
} from '@aragon/ui'
import { lerp } from '../math-utils'
import { noop } from '../utils'

class Domain extends React.Component {
  static defaultProps = {
    domain: '',
    onDomainChange: noop,
  }
  handleDomainChange = event => {
    this.props.onDomainChange(event.target.value)
  }
  render() {
    const { visible, direction, domain } = this.props
    return (
      <Motion
        style={{
          showProgress: spring(Number(visible), springConf('slow')),
        }}
      >
        {({ showProgress }) => (
          <Main
            style={{
              pointerEvents: visible ? 'auto' : 'none',
              opacity: showProgress,
            }}
          >
            <Content
              style={{
                transform: `translateX(${lerp(
                  showProgress,
                  50 * (visible ? direction : -direction),
                  0
                )}%)`,
              }}
            >
              <Title>
                <Text size="great" weight="bold" color={theme.textDimmed}>
                  Claim a domain name
                </Text>
              </Title>

              <p>
                <Text size="large" color={theme.textSecondary}>
                  Check if your chosen URL for your organization is available
                </Text>
              </p>

              <Field>
                <TextInput
                  id="domain-field"
                  placeholder="organizationname"
                  onChange={this.handleDomainChange}
                  style={{ textAlign: 'right' }}
                  value={domain}
                />
                <label htmlFor="domain-field">
                  <Text weight="bold"> .aragonid.eth</Text>
                </label>
                <CheckContainer active={domain}>
                  <IconCheck />
                </CheckContainer>
              </Field>
            </Content>
          </Main>
        )}
      </Motion>
    )
  }
}

const Main = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 100px;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Title = styled.h1`
  font-size: 37px;
  margin-bottom: 40px;
`

const Field = styled.p`
  display: flex;
  align-items: center;
  margin-top: 40px;
  label {
    margin: 0 15px 0 10px;
  }
`

const CheckContainer = styled.span`
  width: 20px;
  transform: scale(${({ active }) => (active ? '1, 1' : '0, 0')});
  transform-origin: 50% 50%;
  transition: transform 100ms ease-in-out;
`

export default Domain
