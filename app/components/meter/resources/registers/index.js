import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Registers from 'registers';
import Meters from 'meters';

export class RegistersList extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    registers: PropTypes.array.isRequired,
    meter: PropTypes.object.isRequired,
    loadRegisters: PropTypes.func.isRequired,
    loadMeter: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { meterId, loadRegisters, loadMeter, meter, loadingMeter } = this.props;
    if ((!meter.id && !loadingMeter) || meterId !== meter.id) loadMeter(meterId);
    if (meter.id === meterId) loadRegisters({ meterId, meterType: meter.type });
  }

  componentWillReceiveProps({ meter, loadRegisters }) {
    if (meter.id && this.props.meter.id !== meter.id) {
      loadRegisters({ meterId: meter.id, meterType: meter.type });
    }
  }

  render() {
    const { registers, loading, groupId, meter } = this.props;

    if (meter.status === 404) return (<div>Meter not found</div>);

    if (loading || !meter.id) return (<div>Loading...</div>);

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
    loading: state.registers.loadingRegisters,
    registers: state.registers.registers,
    meter: state.meters.meter,
    loadingMeter: state.meters.loadingMeter,
  };
}

export default connect(mapStateToProps, {
  loadRegisters: Registers.actions.loadRegisters,
  loadMeter: Meters.actions.loadMeter,
})(RegistersList);
