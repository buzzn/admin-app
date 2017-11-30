// @flow
import * as React from 'react';
import { Card } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Transition from 'react-transition-group/Transition';
import type { GroupStats } from 'groups/reducers';

import './style.scss';

type Props = {
  group: Object,
  url: string,
  groupStats: void | GroupStats,
  hover: boolean,
  onMouseOver: Function,
  onMouseOut: Function,
};

const LocalpoolCard = ({ group, url, groupStats, hover, onMouseOver, onMouseOut }: Props) => (
  <Card className="localpool-card" onMouseOver={ onMouseOver } onMouseOut={ onMouseOut }>
    <div className="group-info" style={{ background: `url('${group.image}') no-repeat center` }}>
      <div className="group-name">{ group.name }</div>
      <div className="group-types">
        {
          groupStats &&
            <React.Fragment>
              { groupStats.fire && <i className="fa fa-2x fa-fire"/> }
              { groupStats.solar && <i className="fa fa-2x fa-sun-o"/> }
            </React.Fragment>
        }
      </div>
    </div>
    <div className="group-stats">
      {
        groupStats &&
          <React.Fragment>
            <div className="group-stat">
              <div className="value">{ groupStats.production.split(' ')[0] }</div>
              <div className="unit">{ groupStats.production.split(' ')[1] }</div>
              <div className="label"><FormattedMessage id="admin.groups.statProduction"/></div>
            </div>
            <div className="group-stat">
              <div className="value">{ groupStats.consumption.split(' ')[0] }</div>
              <div className="unit">{ groupStats.consumption.split(' ')[1] }</div>
              <div className="label"><FormattedMessage id="admin.groups.statConsumption"/></div>
            </div>
            <div className="group-stat">
              <div className="value">{ groupStats.autarchy ? `${(Number(groupStats.autarchy) * 100).toFixed(0)}%` : 'n.a.' }</div>
              <div className="unit">&nbsp;</div>
              <div className="label"><FormattedMessage id="admin.groups.statAutarchy"/></div>
            </div>
          </React.Fragment>
      }
    </div>
    <Transition in={ hover } timeout={ 0 }>
      {
        (state) => {
          const defaultStyle = { transition: 'opacity 300ms ease-in-out', opacity: 0 };
          const transitions = { entering: { opacity: 0 }, entered: { opacity: 1 } };
          return (
            <Link to={`${url}/${group.id}`} className="hover-overlay" style={{ ...defaultStyle, ...transitions[state] }}>
              <span className="view-details">View Details</span>
            </Link>
          );
        }
      }
    </Transition>
  </Card>
);

LocalpoolCard.defaultProps = {
  groupStats: {
    consumption: '',
    production: '',
    autarchy: null,
    solar: false,
    fire: false,
  },
};

export default LocalpoolCard;
