import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Groups from 'groups';
import Charts from '@buzzn/module_charts';
import ChartLayout from './charts_layout';

import './style.scss';

export class Analytics extends React.Component {
  componentDidMount() {
    const { group, loadGroup, match: { params: { groupId } }, setGroupId } = this.props;
    if (group.id !== groupId) loadGroup(groupId);
    setGroupId({ groupId });
  }

  render() {
    const { group, setGroup } = this.props;

    if (group.status === 404 || group.status === 403) {
      setGroup({ _status: null });
      return <Redirect to="/groups" />;
    }

    return (
      <div>
        <h5>Analytics</h5>
        <Charts.ChartWrapperContainer Layout={ChartLayout} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { group: state.groups.group };
}

export default connect(mapStateToProps, {
  setGroupId: Charts.actions.setGroupId,
  loadGroup: Groups.actions.loadGroup,
  setGroup: Groups.actions.setGroup,
})(Analytics);
