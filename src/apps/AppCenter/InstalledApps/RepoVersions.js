import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Trail, animated } from 'react-spring'
import { Info, Tag, GU, useTheme, springs } from '@aragon/ui'
import { format } from 'date-fns'
import { TextLabel } from '../../../components/TextStyles'
import { RepoType } from '../../../prop-types'

const RepoVersions = ({ animate, repo: { currentVersion, versions } }) => {
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
            ({ timestamp, version }) => ({ progress }) => (
              <BodyTr
                key={name}
                style={{
                  opacity: progress,
                  transform: progress.interpolate(
                    v => `translate3d(${10 * (1 - v)}%, 0, 0)`
                  ),
                }}
              >
                <Td>
                  {version}{' '}
                  {version === currentVersion.version && (
                    <Tag
                      css={`
                        margin-left: ${1 * GU}px;
                      `}
                    >
                      current
                    </Tag>
                  )}
                </Td>
                <Td>{timestamp ? format(timestamp, 'dd/MM/yy') : ''}</Td>
              </BodyTr>
            )
            /* eslint-enable react/prop-types */
            }
          </Trail>
        </tbody>
      </table>

      <div
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <Info.Action>
          Minor and patch upgrades are front-end only, and are performed
          automatically.
        </Info.Action>
      </div>
    </div>
  )
}

RepoVersions.propTypes = {
  repo: RepoType.isRequired,
  animate: PropTypes.bool,
}

const BodyTr = styled(animated.tr)`
  &:first-child td {
    padding-top: 8px;
  }
`

const Td = styled.td`
  padding: 3px 0;
  text-align: right;
  &:first-child {
    text-align: left;
  }
`

export default RepoVersions
