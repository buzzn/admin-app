// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Charts from '@buzzn/module_charts';
import ChartLayout from './charts_layout';

import './style.scss';

type Props = {
  match: { params: { groupId: string } },
  // TODO: replace with action
  setGroupId: Function,
};

export class Analytics extends React.Component<Props> {
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
