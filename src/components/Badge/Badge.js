import { styled, theme, colors } from '@aragon/ui'

// TODO: Add the colors to the theme
const Badge = styled.span`
  display: inline-flex;
  font-weight: 600;
  white-space: nowrap;

  ${({ aspect }) =>
    aspect === 'app'
      ? `
        padding: 1px 8px 0;
        font-size: 12px;
        border-radius: 9px;
        color: ${colors.Purple.Portage};
        background: ${colors.Purple.Lavender};
      `
      : `
        padding: 1px 3px 0;
        font-size: 11px;
        border-radius: 3px;
        color: ${theme.textSecondary};
        background: ${colors.Rain['Rain Sky']};
        text-transform: uppercase;
      `};
`

export default Badge
