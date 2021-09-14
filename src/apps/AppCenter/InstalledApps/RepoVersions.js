import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Trail, animated } from 'react-spring'
import {
  Info,
  Tag,
  GU,
  springs,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'
import { RepoType } from '../../../prop-types'
import { dateFormat } from '../../../util/date'

const { tr: AnimTr } = animated

const RepoVersions = ({ animate, repo: { currentVersion, versions } }) => {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const padding = (layoutName === 'small' ? 2 : 3) * GU

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      `}
    >
      <table
        css={`
          border-collapse: collapse;
          width: 100%;
          margin-top: ${0.5 * GU}px;
        `}
      >
        <tbody>
          <Trail
            items={versions}
            keys={v => v.version}
            from={{ progress: 0 }}
            to={{ progress: 1 }}
            config={springs.smooth}
            delay={150}
            immediate={!animate}
            native
          >
            {/* eslint-disable react/prop-types */
            ({ timestamp, version }) => ({ progress }) => {
              const currentItem =
                Boolean(currentVersion) && version === currentVersion.version

              return (
                <AnimTr
                  key={name}
                  css={
                    currentItem ? `background: ${theme.surfaceSelected}` : ''
                  }
                  style={{
                    opacity: progress,
                    transform: progress.interpolate(
                      v => `translate3d(${10 * (1 - v)}%, 0, 0)`
                    ),
                  }}
                >
                  <Td
                    css={`
                      padding-left: ${padding}px;
                    `}
                  >
                    {version}{' '}
                    {currentItem && (
                      <Tag
                        css={`
                          margin-left: ${1 * GU}px;
                        `}
                      >
                        current
                      </Tag>
                    )}
                  </Td>
                  <Td
                    css={`
                      padding-right: ${padding}px;
                      text-align: right;
                      color: ${theme.surfaceContentSecondary};
                      ${textStyle('body2')}
                    `}
                  >
                    {timestamp ? (
                      <time
                        dateTime={dateFormat(timestamp)}
                        title={dateFormat(timestamp, 'standard')}
                      >
                        {dateFormat(timestamp, 'onlyDate')}
                      </time>
                    ) : (
                      ''
                    )}
                  </Td>
                </AnimTr>
              )
            }
            /* eslint-enable react/prop-types */
            }
          </Trail>
        </tbody>
      </table>

      <div
        css={`
          margin: ${2 * GU}px ${padding}px;
        `}
      >
        {currentVersion ? (
          <Info>
            Minor and patch upgrades are front-end only, and are performed
            automatically.
          </Info>
        ) : (
          <Info mode="warning">
            This organization is currently using an unpublished version of this
            application.
          </Info>
        )}
      </div>
    </div>
  )
}

RepoVersions.propTypes = {
  repo: RepoType.isRequired,
  animate: PropTypes.bool,
}

const Td = styled.td`
  padding: ${1 * GU}px 0;
`

export default RepoVersions
