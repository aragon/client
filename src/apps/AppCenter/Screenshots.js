import React from 'react'
import PropTypes from 'prop-types'
import { Link, GU, RADIUS } from '@aragon/ui'
import { RepoType } from '../../prop-types'
import { imgSrcFromBase } from '../../util/utils'

const Screenshots = React.memo(function Screenshots({
  screenshots,
  repo: { baseUrl },
}) {
  return (
    <div
      css={`
        overflow-x: auto;
      `}
    >
      <div
        css={`
          display: grid;
          grid-template-columns: repeat(${screenshots.length}, 1fr);
          grid-gap: ${3 * GU}px;
          width: 100%;
          /* some room for the box-shadow to show */
          padding: 5px;
        `}
      >
        {screenshots.map(({ src }, index) => {
          const url = imgSrcFromBase(baseUrl, src)

          return (
            <Link key={url} href={url} external>
              <img
                key={src}
                src={url}
                alt=""
                width="225"
                height="143"
                css={`
                  display: block;
                  border-radius: ${RADIUS}px;
                  box-shadow: 0px 3px 3px rgba(111, 116, 126, 0.15);
                `}
              />
            </Link>
          )
        })}
      </div>
    </div>
  )
})

Screenshots.propTypes = {
  repo: RepoType.isRequired,
  screenshots: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default Screenshots
