import * as React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import truncate from 'lodash/truncate';
import Transition from 'react-transition-group/Transition';
import { StyledCard } from './style';

interface Props {
  group: { [key: string]: any };
  url: string;
  // FIXME: typings from 'withHover'
  hover: boolean;
  hoverEvents: { onMouseOver: () => void; onMouseOut: () => void };
}

const LocalpoolCard = ({ group, url, hover, hoverEvents }: Props) => (
  <StyledCard {...hoverEvents}>
    <div className="group-info" style={{ background: `url('${group.image}') no-repeat center` }}>
      <div className="group-name">{truncate(group.name, { length: 24 })}</div>
      <div className="group-types">
        {group.powerSources.includes('chp') && <i className="fa fa-2x fa-fire" />}
        {group.powerSources.includes('pv') && <i className="fa fa-2x fa-sun-o" />}
        {group.powerSources.includes('water') && <i className="fa fa-2x fa-tint" />}
        {group.powerSources.includes('wind') && <i className="fa fa-2x fa-modx" />}
      </div>
    </div>
    <div className="group-stats">
      <div className="stats-left">
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
      <div className="stats-right">
        <div className="group-stat">
          <div className="value">
            <i className="buzzn-television" style={{ color: group.showDisplayApp ? 'black' : 'grey' }} />
          </div>
          <div className="unit">&nbsp;</div>
          <div className="label">
            <FormattedMessage id="admin.groups.statDisplay" />
          </div>
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
  </StyledCard>
);

export default LocalpoolCard;
