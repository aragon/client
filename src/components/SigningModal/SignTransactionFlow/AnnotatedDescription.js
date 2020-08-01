import React from 'react'
import PropTypes from 'prop-types'
import { textStyle, Link, GU } from '@aragon/ui'
import LocalIdentityBadge from '../../../components/IdentityBadge/LocalIdentityBadge'
import { useRouting } from '../../../routing'

function AnnotatedDescription({ intent }) {
  const routing = useRouting()
  const { description, annotatedDescription } = intent

  return (
    <React.Fragment>
      {annotatedDescription
        ? annotatedDescription.map(({ type, value }, index) => {
            if (type === 'address' || type === 'any-account') {
              return (
                <span
                  key={index}
                  css={`
                    position: relative;
                    display: inline-flex;
                    vertical-align: middle;
                    margin-right: ${0.5 * GU}px;
                  `}
                >
                  <LocalIdentityBadge
                    entity={type === 'any-account' ? 'Any account' : value}
                    labelStyle={`
                      ${textStyle('body3')}
                    `}
                    compact
                  />
                </span>
              )
            }
            if (type === 'app') {
              return (
                <Link
                  key={index}
                  href={`#${routing.path(({ mode }) => ({
                    mode: {
                      ...mode,
                      name: 'org',
                      instanceId: 'permissions',
                      instancePath: `/app/${value.proxyAddress}`,
                    },
                  }))}`}
                  focusRingSpacing={[3, 2]}
                  css={`
                    margin-right: ${0.25 * GU}px;
                  `}
                >
                  {value.name}
                </Link>
              )
            }
            if (type === 'role' || type === 'kernelNamespace') {
              return (
                <span
                  key={index}
                  css={`
                    margin-right: ${0.5 * GU}px;
                    font-style: italic;
                  `}
                >
                  “{value.name}”
                </span>
              )
            }
            if (type === 'apmPackage') {
              return (
                <span
                  key={index}
                  css={`
                    display: inline-flex;
                    vertical-align: middle;
                    margin-right: ${0.5 * GU}px;
                  `}
                >
                  <LocalIdentityBadge
                    entity={value.name}
                    labelStyle={`${textStyle('body3')}`}
                  />
                </span>
              )
            }
            return (
              <span
                key={index}
                css={`
                  margin-right: ${0.5 * GU}px;
                `}
              >
                {value}
              </span>
            )
          })
        : description || 'an action'}
    </React.Fragment>
  )
}

AnnotatedDescription.propTypes = {
  intent: PropTypes.object.isRequired,
}

export default AnnotatedDescription
