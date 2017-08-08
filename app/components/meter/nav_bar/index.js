import React from 'react';
import { connect } from 'react-redux';
import NavLink from 'components/nav_link';

export const MeterNavBar = ({ meter, match: { url } }) => (
  <div className="row">
    <div className="col-12">
      <ul className="nav nav-pills nav-justified">
        <NavLink to={ `${url}/meter-data` }>Meter data</NavLink>
        {
          meter.type &&
          (meter.type === 'meter_real' ?
            <NavLink to={ `${url}/registers` }>Registers</NavLink> :
            <NavLink to={ `${url}/formula` }>Formula</NavLink>)
        }
      </ul>
    </div>
  </div>
);

function mapStateToProps(state) {
  return {
    meter: state.meters.meter,
  };
}

export default connect(mapStateToProps)(MeterNavBar);
