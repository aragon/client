import React from 'react'
import styled from 'styled-components'
import { theme, Text } from '@aragon/ui'
import { noop } from '../utils'
import { lerp } from '../math-utils'
import TemplateCard from './TemplateCard'

class Template extends React.PureComponent {
  static defaultProps = {
    onSelect: noop,
  }
  handleTemplateSelect = template => {
    this.props.onSelect(template)
  }
  render() {
    const { hideProgress, templates, activeTemplate } = this.props
    return (
      <Main>
        <Content
          style={{
            willChange: 'transform',
            transform: `translateX(${lerp(hideProgress, 0, 50)}%)`,
            opacity: 1 - Math.abs(hideProgress),
          }}
        >
          <Title>
            <Text size="great" weight="bold" color={theme.textDimmed}>
              Create a new organization
            </Text>
          </Title>

          <p>
            <Text size="large" color={theme.textSecondary}>
              Choose a template to get started quickly. Don’t worry − you can
              change it later.
            </Text>
          </p>

          <Templates>
            {[...templates.entries()].map(([template, { label, icon }], i) => (
              <TemplateCardWrapper key={i}>
                <TemplateCard
                  template={template}
                  icon={icon}
                  label={label}
                  active={template === activeTemplate}
                  onSelect={this.handleTemplateSelect}
                />
              </TemplateCardWrapper>
            ))}
          </Templates>
        </Content>
      </Main>
    )
  }
}

const Main = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 100px;
  padding-top: 140px;
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

const Templates = styled.div`
  display: flex;
  margin-top: 50px;
`

const TemplateCardWrapper = styled.div`
  & + & {
    margin-left: 25px;
  }
`

export default Template
