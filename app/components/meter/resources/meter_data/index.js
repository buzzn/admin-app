import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Meters from 'meters';

export class MeterData extends Component {
  static propTypes = {
    meter: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    loadMeter: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { meter, loadMeter, loading, meterId } = this.props;
    if (!meter.id && !loading) loadMeter(meterId);
  }

  render() {
    const { loading, meter } = this.props;

    if (meter.status === 404) return (<div>Meter not found</div>);

    if (loading || !meter.id) return (<div>Loading...</div>);

    return (
      <div className="row">
        <div className="col-6">
          <div className="row">
            <div className="col-6">Meter number:</div>
            <div className="col-6">{ meter.manufacturerProductSerialnumber }</div>
          </div>
          <div className="row">
            <div className="col-6">Manufacturer:</div>
            <div className="col-6">{ meter.manufacturerName }</div>
          </div>
          <div className="row">
            <div className="col-6">Type:</div>
            <div className="col-6">{ meter.manufacturerProductName }</div>
          </div>
          <div className="row">
            <div className="col-6">Owner:</div>
            <div className="col-6">{ meter.ownership }</div>
          </div>
          <div className="row">
            <div className="col-6">Type:</div>
            <div className="col-6">{ meter.type }</div>
          </div>
          <div className="row">
            <div className="col-6">Size:</div>
            <div className="col-6">{ meter.meterSize }</div>
          </div>
        </div>
        <div className="col-6">
          <div className="row">
            <div className="col-6">Metering point id:</div>
            <div className="col-6"></div>
          </div>
          <div className="row">
            <div className="col-6">Label:</div>
            <div className="col-6">{ meter.directionLabel }</div>
          </div>
          <div className="row">
            <div className="col-6">Energy:</div>
            <div className="col-6"></div>
          </div>
          <div className="row">
            <div className="col-6">Manufactured in:</div>
            <div className="col-6">{ meter.buildYear }</div>
          </div>
        </div>
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

export default connect(mapStateToProps, { loadMeter: Meters.actions.loadMeter })(MeterData);
