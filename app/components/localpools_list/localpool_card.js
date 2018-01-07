import * as React from 'react';
import { Card } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Transition from 'react-transition-group/Transition';

import './style.scss';

const LocalpoolCard = ({ group, url, hover, onMouseOver, onMouseOut }) => (
  <Card className="localpool-card" onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
    <div className="group-info" style={{ background: `url('${group.image}') no-repeat center` }}>
      <div className="group-name">{group.name}</div>
      <div className="group-types">
        {group.powerSources.includes('chp') && <i className="fa fa-2x fa-fire" />}
        {group.powerSources.includes('pv') && <i className="fa fa-2x fa-sun-o" />}
        {group.powerSources.includes('water') && <i className="fa fa-2x fa-tint" />}
        {group.powerSources.includes('wind') && <i className="fa fa-2x fa-modx" />}
      </div>
    </div>
    <div className="group-stats">
      <div className="group-stat">
        <div className="value">--</div>
        <div className="unit">--</div>
        <div className="label">
          <FormattedMessage id="admin.groups.statProduction" />
        </div>
      </div>
      <div className="group-stat">
        <div className="value">--</div>
        <div className="unit">--</div>
        <div className="label">
          <FormattedMessage id="admin.groups.statConsumption" />
        </div>
      </div>
      <div className="group-stat">
        <div className="value">n.a.</div>
        <div className="unit">&nbsp;</div>
        <div className="label">
          <FormattedMessage id="admin.groups.statAutarchy" />
        </div>
      </div>
    </div>
    <Transition in={hover} timeout={0}>
      {(state) => {
        const defaultStyle = { transition: 'opacity 300ms ease-in-out', opacity: 0 };
        const transitions = { entering: { opacity: 0 }, entered: { opacity: 1 } };
        return (
          <Link to={`${url}/${group.id}`} className="hover-overlay" style={{ ...defaultStyle, ...transitions[state] }}>
            <span className="view-details">View Details</span>
          </Link>
        );
      }}
    </Transition>
  </Card>
);

export default LocalpoolCard;
