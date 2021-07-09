import React from 'react'
import PropTypes from 'prop-types'
import { Transition, animated } from 'react-spring'
import { Button, springs, ButtonIcon, IconCross, GU } from '@aragon/ui'
import Banner, { BANNER_HEIGHT } from '../Banner/Banner'

const MIGRATE_REWARD_URL =
  'https://help.aragon.org/article/99-aragon-govern-migration-reward-program'

const BANNER_TEXT = 'Your DAO is eligible for the migration reward program.'

const MigrateBanner = React.memo(({ visible, onClose }) => {
  return (
    <React.Fragment>
      <Transition
        items={visible}
        from={{ height: 0 }}
        enter={{ height: BANNER_HEIGHT }}
        leave={{ height: 0 }}
        config={springs.smooth}
        native
      >
        {visible =>
          visible &&
          /* eslint-disable react/prop-types */
          (({ height }) => (
            <animated.div style={{ overflow: 'hidden', height }}>
              <Banner
                text={BANNER_TEXT}
                button={
                  <Button
                    href={MIGRATE_REWARD_URL}
                    onClick={onClose}
                    mode="normal"
                    size="mini"
                  >
                    <span style={{ color: '#00C2FF', fontWeight: 'bold' }}>
                      Apply Now!
                    </span>
                  </Button>
                }
                color="linear-gradient(107.79deg, #00ace2 1.46%, #02dfed 100%)"
                textColor="#FFFFFF"
              />
              <ButtonIcon
                label="Close"
                onClick={onClose}
                css={`
                  position: absolute;
                  z-index: 2;
                  top: ${0.5 * GU}px;
                  right: ${2 * GU}px;
                  color: #f6f9fc;
                `}
              >
                <IconCross />
              </ButtonIcon>
            </animated.div>
          ))
        /* eslint-enable react/prop-types */
        }
      </Transition>
    </React.Fragment>
  )
})

MigrateBanner.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool,
}

export default MigrateBanner
