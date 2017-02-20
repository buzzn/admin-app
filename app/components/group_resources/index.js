import React from 'react';
import { Route } from 'react-router-dom';
import PowertakersContainer from './powertakers';
import ChartsContainer from './charts';

export default ({ match: { url, params: { groupId } } }) => (
  <div>
    <Route path={ `${url}/powertakers` } groupId={ groupId } component={ PowertakersContainer } />
    <Route path={ `${url}/contracts` } groupId={ groupId } render={ () => (<div>Contracts</div>) } />
    <Route path={ `${url}/bank` } groupId={ groupId } render={ () => (<div>Bank</div>) } />
    <Route path={ `${url}/tax` } groupId={ groupId } render={ () => (<div>Tax</div>) } />
    <Route path={ `${url}/system` } groupId={ groupId } render={ () => (<div>System</div>) } />
    <Route path={ `${url}/charts` } groupId={ groupId } component={ ChartsContainer } />
  </div>
);
