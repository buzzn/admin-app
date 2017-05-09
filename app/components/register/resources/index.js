import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import Registers from 'registers';

export class RegisterResources extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    readings: PropTypes.array.isRequired,
    loadRegister: PropTypes.func.isRequired,
  };

  static defaultProps = {
    readings: [],
  };

  componentWillMount() {
    const { loading, readings, loadRegister, match: { params: { registerId } } } = this.props;
    if (!loading && readings.length === 0) loadRegister(registerId);
  }

  render() {
    const { readings, loading } = this.props;

    if (loading) return (<div>Loading...</div>);

    if (readings.length === 0) return (<div><h4>No readings.</h4></div>);

    return (
      <div>
        <h4>Readings</h4>
        List of all readings for a register.
        <div className="col-12 no-padding">
          <table className="table">
            <thead className="thead-default">
            <tr>
              <th>Date</th>
              <th>Value</th>
              <th>Reason</th>
              <th>Quality</th>
              <th>By</th>
            </tr>
            </thead>
            <tbody>
            {
              readings.map(reading => (
                <tr key={ reading.id }>
                  <td>{ moment(reading.timestamp).format('YYYY-MM-DD') }</td>
                  <td>{ reading.powerMilliwatt }</td>
                  <td>{ reading.reason }</td>
                  <td>{ reading.quality }</td>
                  <td>{ reading.source }</td>
                </tr>
              ))
            }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.registers.loadingRegister,
    readings: state.registers.readings,
  };
}

export default connect(mapStateToProps, { loadRegister: Registers.actions.loadRegister })(RegisterResources);
