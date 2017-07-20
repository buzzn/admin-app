import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChartsModule from '@buzzn/module_charts';
import ChartLayout from './charts_layout';

import './style.scss';

export class Charts extends Component {
  componentWillMount() {
    const { groupId, setGroupId } = this.props;
    setGroupId({ groupId });
  }

  render() {
    return (<div className="row">
      <div className="col-12">
        <h5>Analytics</h5>
        <ChartsModule.ChartWrapperContainer Layout={ ChartLayout } />
      </div>
    </div>);
  }
}

export default connect(() => ({}), { setGroupId: ChartsModule.actions.setGroupId })(Charts);
