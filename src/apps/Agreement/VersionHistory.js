import React from 'react'
import {
  Box,
  Timer,
  Link,
  GU,
  useTheme,
  ContextMenu,
  ContextMenuItem,
  IconView,
  useLayout,
} from '@aragon/ui'

function VersionHistory() {
  return (
    <Box padding={0} heading="Version history">
      <CreationPending />
      <HistoryEntry />
      <HistoryEntry />
    </Box>
  )
}

function CreationPending() {
  const { layoutName } = useLayout()

  const NOW = Date.now()
  const DAY = 1000 * 60 * 60 * 24

  const endDate = new Date(NOW + 5 * DAY)

  return (
    <div
      css={`
        padding: ${layoutName === 'small' ? GU * 2 : GU * 3}px;
      `}
    >
      <h2
        css={`
          line-height: 1.2;
        `}
      >
        Agreement creation pending
      </h2>
      <Link
        href=""
        css={`
          line-height: 1;
          margin-bottom: ${GU * 2}px;
        `}
      >
        <span>View vote</span>
      </Link>
      <Timer end={endDate} />
    </div>
  )
}

function HistoryEntry() {
  const theme = useTheme()
  const { layoutName } = useLayout()

  return (
    <div
      css={`
        display: flex;
        justify-content: space-between;
        padding: ${layoutName === 'small' ? GU * 2 : GU * 3}px;
        & + & {
          border-top: 1px solid ${theme.border};
        }
      `}
    >
      <div>
        <h2
          css={`
            line-height: 1.2;
            margin-bottom: ${GU}px;
          `}
        >
          Updated Agreement
        </h2>
        <p
          css={`
            color: ${theme.surfaceContentSecondary};
          `}
        >
          2020/05/20
        </p>
      </div>
      <div>
        <ContextMenu>
          <ContextMenuItem>
            <span
              css={`
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${theme.surfaceIcon};
              `}
            >
              <IconView />
            </span>
            <span
              css={`
                margin-left: ${1 * GU}px;
              `}
            >
              Review this version
            </span>
          </ContextMenuItem>
        </ContextMenu>
      </div>
    </div>
  )
}

export default VersionHistory
