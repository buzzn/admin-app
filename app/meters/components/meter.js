import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions';

export class Meter extends Component {
  componentWillMount() {
    const { loadMeter, params: { id } } = this.props;
    loadMeter(id);
  }

  render() {
    const { meter, loading } = this.props;

    if (loading) return (<div>Loading...</div>);

    if (!meter) return (<div>Meter not found</div>);

    return (
      <div className="meter">
        <h4>{ meter.attributes['first-name'] }</h4>
        <p>{ meter.attributes['about-me'] }</p>
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

export default connect(mapStateToProps, { loadMeter: actions.loadMeter })(Meter);
