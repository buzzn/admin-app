// @flow
import * as React from 'react';
import { Card } from 'reactstrap';
import { Link } from 'react-router-dom';
import Transition from 'react-transition-group/Transition';
import type { GroupStats } from 'groups/reducers';

import './style.scss';
import DefaultImage from 'images/energygroup_noimage_01.jpg';

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
    <div className="group-info" style={{ background: `url('${DefaultImage}') no-repeat center` }}>
      <div className="group-name">{ group.name }</div>
      <div className="group-types">
        {
          groupStats && [
            groupStats.fire && <i key={ 1 } className="fa fa-2x fa-fire"/>,
            groupStats.solar && <i key={ 2 } className="fa fa-2x fa-sun-o"/>,
          ]
        }
      </div>
    </div>
    <div className="group-stats">
      {
        groupStats && [
          <div key={ 1 } className="group-stat">
            <div className="value">{ groupStats.production.split(' ')[0] }</div>
            <div className="unit">{ groupStats.production.split(' ')[1] }</div>
            <div className="label">Production</div>
          </div>,
          <div key={ 2 } className="group-stat">
            <div className="value">{ groupStats.consumption.split(' ')[0] }</div>
            <div className="unit">{ groupStats.consumption.split(' ')[1] }</div>
            <div className="label">Consumption</div>
          </div>,
          <div key={ 3 } className="group-stat">
            <div className="value">{ groupStats.autarchy ? `${(Number(groupStats.autarchy) * 100).toFixed(0)}%` : 'n.a.' }</div>
            <div className="unit">&nbsp;</div>
            <div className="label">Autarchy</div>
          </div>,
        ]
      }
    </div>
    <Transition in={ hover } timeout={ 0 }>
      {
        (state) => {
          const defaultStyle = { transition: 'opacity 300ms ease-in-out', opacity: 0 };
          const transitions = { entering: { opacity: 0 }, entered: { opacity: 1 } };
          return (
            <div className="hover-overlay" style={{ ...defaultStyle, ...transitions[state] }}>
              <Link className="view-details" to={`${url}/${group.id}`}>View Details</Link>
            </div>
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
