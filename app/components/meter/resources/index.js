import React from 'react';
import { Route } from 'react-router-dom';
import MeterDataContainer from './meter_data';
import RegistersContainer from './registers';

export default ({ match: { url, params: { groupId, meterId } } }) => (
  <div>
    <Route path={`${url}/meter-data`} render={ () => <MeterDataContainer meterId={ meterId } /> } />
    <Route path={ `${url}/registers` } render={ () => <RegistersContainer {...{ meterId, groupId }} /> } />
    <Route path={ `${url}/formula` } render={ () => (<div>Formula</div>) } />
  </div>
);
