import PropTypes from 'prop-types'

const DisputableAppDetail = PropTypes.shape({
  actionCollateral: PropTypes.shape({
    address: PropTypes.string,
    amount: PropTypes.string,
    symbol: PropTypes.string,
  }),
  allowedActions: PropTypes.arrayOf(PropTypes.string).isRequired,
  challengeCollateral: PropTypes.shape({
    address: PropTypes.string,
    amount: PropTypes.string,
    symbol: PropTypes.string,
  }),
  settlementPeriod: PropTypes.number.isRequired,
  entryActions: PropTypes.arrayOf(PropTypes.array),
})

export const DisputableAppDetailsType = PropTypes.arrayOf(DisputableAppDetail)
