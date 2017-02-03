import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions';

import Registers from '../../registers';

export class Meter extends Component {
  componentWillMount() {
    const { loadMeter, match: { params: { id } } } = this.props;
    loadMeter(id);
  }

  render() {
    const { meter, loading } = this.props;

    if (loading) return (<div>Loading...</div>);

    if (!meter) return (<div>Meter not found</div>);

    return (
      <div className="meter">
        <h4>{ meter.attributes['manufacturer-name'] } { meter.attributes['manufacturer-product-name'] } { meter.attributes['manufacturer-product-serialnumber'] }</h4>
        <Registers.ListContainer meterId={ meter.id } meterType={ meter.type } />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    meter: state.meters.meter,
    loading: state.meters.loadingMeter,
  };
}

export default connect(mapStateToProps, {
  loadMeter: actions.loadMeter,
})(Meter);
