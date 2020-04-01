import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Info, GU, TextInput, isAddress } from '@aragon/ui'
import { Header, Navigation, ScreenPropsType } from '../../kit'

function DictatorScreen({
  dataKey,
  screenProps: { back, data, next, screenIndex, screens },
}) {
  const screenData = (dataKey ? data[dataKey] : data) || {}
  const nextScreen = screens[screenIndex + 1]

  const [dictator, setDictator] = useState(screenData.dictator || '')
  const [displayError, setDisplayError] = useState(false)

  const handleDictatorChange = useCallback(event => {
    setDictator(event.target.value)
    setDisplayError(false)
  }, [])

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      if (isAddress(dictator)) {
        next(dataKey ? { ...data, [dataKey]: dictator } : { ...data, dictator })
      } else {
        setDisplayError(true)
      }
    },
    [data, dataKey, dictator, next]
  )

  // focus on mount
  const handleDictatorFieldRef = useCallback(ref => {
    if (ref) {
      ref.focus()
    }
  }, [])

  return (
    <form>
      <Header title="Dictator" />

      <TextInput
        ref={handleDictatorFieldRef}
        onChange={handleDictatorChange}
        placeholder="Dictator's address"
        value={dictator}
        wide
      />

      {displayError ? (
        <Info
          mode="error"
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          <strong>YOU HAVE FAILED TO PROVIDE A VALID DICTATOR!</strong>
        </Info>
      ) : (
        <Info
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          <p>Choose the dictator.</p>
          <p>
            We assume <strong>YOU</strong> would want this position.
          </p>
        </Info>
      )}

      <Navigation
        backEnabled
        nextEnabled={Boolean(nextScreen && dictator.trim())}
        nextLabel={
          nextScreen ? `Next: ${nextScreen[0]}` : 'Launch your organization'
        }
        onBack={back}
        onNext={handleSubmit}
      />
    </form>
  )
}

DictatorScreen.propTypes = {
  dataKey: PropTypes.string,
  screenProps: ScreenPropsType.isRequired,
}

DictatorScreen.defaultProps = {
  dataKey: null,
}

export default DictatorScreen
