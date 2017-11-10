// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { MapStateToProps } from 'react-redux';
import type { GroupsStats, GroupStats as StatType } from 'groups/reducers';

import './style.scss';

type Props = {
  groupStats: StatType,
};

export const GroupStats = ({ groupStats }: Props) => {
  let stats = groupStats;
  if (!stats) {
    stats = {
      production: '',
      consumption: '',
    };
  }

  return (
    <div className="group-stats-widget">
      <div className="group-stat">
        <div className="value">{ stats.production.split(' ')[0] }</div>
        <div className="unit">{ stats.production.split(' ')[1] }</div>
        <div className="label">Production</div>
      </div>
      <div className="group-stat">
        <div className="value">{ stats.consumption.split(' ')[0] }</div>
        <div className="unit">{ stats.consumption.split(' ')[1] }</div>
        <div className="label">Consumption</div>
      </div>
      <div className="group-stat">
        <div className="value">{ stats.autarchy ? `${(Number(stats.autarchy) * 100).toFixed(0)}%` : 'n.a.' }</div>
        <div className="unit">&nbsp;</div>
        <div className="label">Autarchy</div>
      </div>
    </div>
  );
};

type ContainerProps = {
  groupId: string,
};

type State = {
  groups: { groupsStats: GroupsStats },
};

const mapStateToProps: MapStateToProps<State, ContainerProps, *> = (state, props) => (
  { groupStats: state.groups.groupsStats[props.groupId] }
);

export default connect(mapStateToProps)(GroupStats);
