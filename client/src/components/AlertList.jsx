import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectAlerts } from '../redux/selectors/alertSelectors'

const AlertList = ({ alerts }) => (
  alerts.length > 0 ? alerts.map(({ message, alertType, id }) => <div key={id} className={`alert alert-${alertType}`}>{message}</div>) : null
)

const mapStateToProps = createStructuredSelector({
  alerts: selectAlerts
})

AlertList.propTypes = {
  alerts: PropTypes.array.isRequired
}

export default connect(mapStateToProps)(AlertList)