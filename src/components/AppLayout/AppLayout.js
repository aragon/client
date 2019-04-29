import React from 'react'
import PropTypes from 'prop-types'
import {
  AppBar,
  AppView,
  Button,
  ButtonIcon,
  NavigationBar,
  Viewport,
} from '@aragon/ui'
import { noop } from '../../utils'
import MenuButton from '../MenuPanel/MenuButton'

const AppLayout = ({
  children,
  title,
  afterTitle,
  navigationItems,
  onNavigationBack,
  smallViewPadding,
  largeViewPadding,
  onMenuOpen,
  mainButton,
}) => {
  return (
    <Viewport>
      {({ below }) => {
        return (
          <AppView
            style={{ height: '100%' }}
            padding={below('medium') ? smallViewPadding : largeViewPadding}
            appBar={
              <AppBar>
                <div
                  css={`
                    display: flex;
                    width: 100%;
                    height: 100%;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: nowrap;
                    padding: ${below('medium') ? '0' : '0 30px 0 0'};
                  `}
                >
                  <NavigationBar
                    compact={below('medium')}
                    onBack={onNavigationBack}
                    items={[
                      <span
                        css={`
                          display: flex;
                          height: 100%;
                          align-items: center;
                        `}
                      >
                        {below('medium') && <MenuButton onClick={onMenuOpen} />}
                        <span>{navigationItems[0] || title}</span>
                        {afterTitle}
                      </span>,
                      ...navigationItems.slice(1),
                    ]}
                  />
                  {mainButton &&
                    (mainButton.button ||
                      (below('medium') ? (
                        <ButtonIcon
                          onClick={mainButton.onClick}
                          label={mainButton.label}
                          disabled={mainButton.disabled}
                          css={`
                            width: auto;
                            height: 100%;
                            margin-left: 8px;
                            padding: 0 16px 0 8px;
                          `}
                        >
                          {mainButton.icon}
                        </ButtonIcon>
                      ) : (
                        <Button
                          mode="strong"
                          onClick={mainButton.onClick}
                          disabled={mainButton.disabled}
                        >
                          {mainButton.label}
                        </Button>
                      )))}
                </div>
              </AppBar>
            }
          >
            {children}
          </AppView>
        )
      }}
    </Viewport>
  )
}

AppLayout.defaultProps = {
  smallViewPadding: 20,
  largeViewPadding: 30,
  title: '',
  navigationItems: [],
  onNavigationBack: noop,
}

AppLayout.propTypes = {
  navigationItems: PropTypes.arrayOf(PropTypes.node),
  onNavigationBack: PropTypes.func,
  afterTitle: PropTypes.node,
  children: PropTypes.node,
  largeViewPadding: PropTypes.number,
  mainButton: PropTypes.shape({
    button: PropTypes.node,
    icon: PropTypes.node,
    label: PropTypes.node,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
  }),
  onMenuOpen: PropTypes.func,
  smallViewPadding: PropTypes.number,
  title: PropTypes.node.isRequired,
}

export default AppLayout
