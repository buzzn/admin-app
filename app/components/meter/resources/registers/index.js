import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Meters from 'meters';

export class RegistersList extends Component {
  static propTypes = {
    registers: PropTypes.array.isRequired,
    meter: PropTypes.object.isRequired,
    loadMeter: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { meterId, groupId, loadMeter, meter, loadingMeter } = this.props;
    if ((!meter.id && !loadingMeter) || meterId !== meter.id) loadMeter({ meterId, groupId });
  }

  render() {
    const { registers, loadingMeter, groupId, meter } = this.props;

    if (meter.status === 404) return (<div>Meter not found</div>);

    if (loadingMeter || !meter.id) return (<div>Loading...</div>);

    return (
      <div className="row">
        <div className="col-12">
          <h5>Registers</h5>
          List of all registers for a meter.
        </div>
        <div className="col-12 no-padding">
          <table className="table">
            <thead className="thead-default">
            <tr>
              <th>Type</th>
              <th>OBIS</th>
              <th>Last reading</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            {
              registers.map(register => (
                <tr key={ register.id }>
                  <td></td>
                  <td>{ register.obis }</td>
                  <td>{ register.lastReading }</td>
                  <td>
                    <Link
                      to={ `/localpools/${groupId}/system/${meter.id}/registers/${register.id}` }
                      className="btn btn-outline-secondary"
                      style={{ float: 'right', marginRight: '15px' }}>
                      View
                    </Link>
                  </td>
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
    registers: state.meters.meterRegisters,
    meter: state.meters.meter,
    loadingMeter: state.meters.loadingMeter,
  };
}

export default connect(mapStateToProps, {
  loadMeter: Meters.actions.loadMeter,
})(RegistersList);
