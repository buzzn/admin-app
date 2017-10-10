import React, { Component } from 'react';
import { connect } from 'react-redux';
import Charts from '@buzzn/module_charts';
import ChartLayout from './charts_layout';

import './style.scss';

export class Analytics extends Component {
  componentWillMount() {
    const { match: { params: { groupId } }, setGroupId } = this.props;
    setGroupId({ groupId });
  }

  render() {
    return (
      <div>
        <h5>Analytics</h5>
        <Charts.ChartWrapperContainer Layout={ ChartLayout } />
      </div>
    );
  }
}

export default connect(() => ({}), { setGroupId: Charts.actions.setGroupId })(Analytics);
