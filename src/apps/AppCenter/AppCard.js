import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Card,
  GU,
  IconExternal,
  textStyle,
  unselectable,
  useLayout,
  useTheme,
} from '@aragon/ui'

const AppCard = React.memo(function AppCard({
  onClick,
  link,
  icon,
  name,
  tag,
  description,
}) {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'
  const handleClick = useCallback(() => onClick(link), [onClick, link])

  return (
    <Card onClick={handleClick} css={onClick ? 'display: block;' : ''}>
      <CardMain compactMode={compactMode}>
        {link && <StyledIconExternal compactMode={compactMode} theme={theme} />}
        <Icon compactMode={compactMode}>{icon}</Icon>
        <Name compactMode={compactMode}>{name}</Name>
        <TagWrapper compactMode={compactMode} link={link}>
          {tag}
        </TagWrapper>
        <Description theme={theme} compactMode={compactMode}>
          {description}
        </Description>
      </CardMain>
    </Card>
  )
})

AppCard.propTypes = {
  onClick: PropTypes.func,
  link: PropTypes.string,
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  tag: PropTypes.node.isRequired,
  description: PropTypes.string.isRequired,
}

const CardMain = styled.section`
  ${unselectable};
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  white-space: initial;

  ${({ compactMode }) =>
    compactMode
      ? `
          display: grid;
          grid-template-columns: auto 1fr;
          grid-template-rows: auto auto;
          grid-template-areas:
            "icon title"
            "icon description";
          padding: ${3 * GU}px ${1.5 * GU}px ${1.5 * GU}px ${3 * GU}px;
        `
      : `
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: ${5 * GU}px;
        `}
`

const Icon = styled.div`
  height: ${9 * GU}px;
  width: ${9 * GU}px;
  ${({ compactMode }) =>
    compactMode
      ? `
        grid-area: icon;
        margin-right: ${1.5 * GU}px;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      `
      : `
        margin-bottom: ${2 * GU}px;
      `}
`

const Name = styled.p`
  display: flex;
  width: 100%;
  ${textStyle('title4')}
  ${({ compactMode }) =>
    compactMode
      ? `
        grid-area: title;
        align-self: flex-end;
      `
      : `
        justify-content: center;
        margin-bottom: ${1 * GU}px;
      `}
`

const TagWrapper = styled.div`
  ${({ compactMode, link }) =>
    compactMode
      ? `
        position: absolute;
        top: ${1.5 * GU}px;
        right: ${(link ? 5 : 1.5) * GU}px;
      `
      : `
        max-width: 100%;
        padding: 0 ${2.5 * GU}px;
        margin-bottom: ${1 * GU}px;
      `}
`

const Description = styled.p`
  color: ${({ theme }) => theme.contentSecondary};
  ${textStyle('body2')};
  text-align: left;
  grid-area: description;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: fit-content;

  ${({ compactMode }) =>
    compactMode
      ? `
        -webkit-line-clamp: 2;
        margin-top: ${0.5 * GU}px;
      `
      : `
        text-align: center;
        padding: 0 1rem;
        -webkit-line-clamp: 3;
      `}
`

function StyledIconExternal({ compactMode, theme }) {
  const paddingGU = compactMode ? 1 : 1.5
  return (
    <IconExternal
      css={`
        color: ${theme.surfaceIcon};
        position: absolute;
        top: ${paddingGU * GU}px;
        right: ${paddingGU * GU}px;
      `}
    />
  )
}
StyledIconExternal.propTypes = {
  compactMode: PropTypes.bool,
  theme: PropTypes.object.isRequired,
}

export default AppCard
