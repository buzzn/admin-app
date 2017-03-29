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

    if (!meter.id) return (<div>Meter not found</div>);

    return (
      <div className="meter">
        <h4>{ meter.attributes.manufacturerName } { meter.attributes.manufacturerProductName } { meter.attributes.manufacturerProductSerialnumber }</h4>
        <Registers.ListContainer meterId={ meter.id } meterType={ meter.attributes.type } />
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
