import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Registers from 'registers';
import Meters from 'meters';

export class RegistersList extends Component {
  static propTypes = {
    loading: React.PropTypes.bool.isRequired,
    registers: React.PropTypes.array.isRequired,
    meter: React.PropTypes.object.isRequired,
    loadRegisters: React.PropTypes.func.isRequired,
    loadMeter: React.PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { meterId, loadRegisters, loadMeter, meter, loadingMeter } = this.props;
    if ((!meter.id && !loadingMeter) || meterId !== meter.id) loadMeter(meterId);
    if (meter.id === meterId) loadRegisters({ meterId, meterType: meter.attributes.type });
  }

  componentWillReceiveProps({ meter, loadRegisters }) {
    if (meter.id && this.props.meter.id !== meter.id) {
      loadRegisters({ meterId: meter.id, meterType: meter.attributes.type });
    }
  }

  render() {
    const { registers, loading, groupId, meter } = this.props;

    if (loading) return (<div>Loading...</div>);

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
                  <td>{ register.attributes.obis }</td>
                  <td></td>
                  <td>
                    <Link
                      to={ `/localpools/${groupId}/system/${meter.id}/registers/${register.id}` }
                      className="btn btn-secondary btn-beige"
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
