import React from 'react'
import getDisplayName from 'react-display-name'

// Higher-order component for convenient subscriptions to an aragon.js cache key
const observeCache = (
  cacheKey,
  { defaultValue, forcedValue } = {}
) => Component =>
  class extends React.Component {
    static displayName = `ObserveCache(${getDisplayName(Component)})`
    static propTypes = {
      cache: ({ cache }, _, componentName) => {
        if (cache && typeof cache.observe !== 'function') {
          throw new Error(
            `Invalid prop \`cache\` supplied to \`${componentName}\` ` +
              '(wrapped by `observeCache()`). ' +
              '`cache` must be an aragon.js Cache-like object. ' +
              `Given ${cache} instead.`
          )
        }
      },
    }
    componentDidMount() {
      this.observeUpdates(this.props.cache)
    }
    componentWillReceiveProps({ cache: nextCache }) {
      const { cache } = this.props
      // If a new cache gets passed in, unsubscribe from the old and subscribe to the new
      if (nextCache !== cache) {
        this.observeUpdates(nextCache)
      }
    }
    observeUpdates = cache => {
      if (cache) {
        cache
          .update(cacheKey, value => ({
            ...defaultValue,
            ...value,
            ...forcedValue,
          }))
          .then(() => {
            this.setState({ observable: cache.observe(cacheKey) })
          })
      }
    }
    render() {
      return <Component {...this.state} {...this.props} />
    }
  }

export default observeCache
