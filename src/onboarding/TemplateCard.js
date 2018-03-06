import React from 'react'
import styled from 'styled-components'
import { theme, font, IconCheck } from '@aragon/ui'
import { noop } from '../utils'

class TemplateCard extends React.Component {
  static defaultProps = {
    template: null,
    active: false,
    onSelect: noop,
    label: '',
  }
  handleClick = () => {
    this.props.onSelect(this.props.template)
  }
  render() {
    const { active, icon, label } = this.props
    return (
      <Main onClick={this.handleClick} active={active}>
        <Content>
          <CheckContainer active={active}>
            <IconCheck />
          </CheckContainer>
          <img src={icon} alt="" />
          {label}
        </Content>
      </Main>
    )
  }
}

const Main = styled.button`
  position: relative;
  width: 140px;
  height: 170px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  border-radius: 3px;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ active }) =>
    active ? theme.positive : theme.contentBorder};
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
  transition-property: border-color, transform, box-shadow;

  @media (min-width: 1180px) {
    width: 170px;
    height: 200px;
  }

  &:focus {
    outline: 0;
  }
  &:focus,
  &:hover {
    ${({ active }) =>
      active
        ? ''
        : `
            transform: $translateY(-1px);
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.15);
          `};
  }
  &:active {
    transform: translateY(0);
    box-shadow: none;
    border-color: ${theme.contentBorderActive};
  }
`

const Content = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  padding-top: 20px;
  ${font({ size: 'small' })};

  @media (min-width: 1180px) {
    padding-top: 45px;
    ${font({ size: 'large' })};
  }
  img {
    margin-bottom: 15px;
  }
`

const CheckContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  transform: scale(${({ active }) => (active ? '1, 1' : '0, 0')});
  transition: transform 150ms ease-in-out;
`

export default TemplateCard
