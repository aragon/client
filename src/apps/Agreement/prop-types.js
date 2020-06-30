import PropTypes from 'prop-types'

const AppItemType = PropTypes.shape({
  actionCollateral: PropTypes.shape({
    address: PropTypes.string,
    amount: PropTypes.number,
    symbol: PropTypes.string,
  }),
  allowedActions: PropTypes.arrayOf(PropTypes.string).isRequired,
  challengeCollateral: PropTypes.shape({
    address: PropTypes.string,
    amount: PropTypes.number,
    symbol: PropTypes.string,
  }),
  challengeEligibility: PropTypes.string.isRequired,
  challengePeriod: PropTypes.number.isRequired,
  entryActions: PropTypes.arrayOf(PropTypes.array),
  signerEligibility: PropTypes.shape({
    address: PropTypes.string,
    amount: PropTypes.number,
    symbol: PropTypes.string,
  }),

  settlementPeriod: PropTypes.number.isRequired,
})

export const AppItemsType = PropTypes.arrayOf(AppItemType)
