import React from 'react';
import { Route } from 'react-router-dom';
import Powertakers from './powertakers';

export default ({ match: { url, params: { groupId } } }) => (
  <div>
    <Route path={ `${url}/powertakers` } groupId={ groupId } component={ Powertakers } />
    <Route path={ `${url}/contracts` } groupId={ groupId } render={ () => (<div>Contracts</div>) } />
    <Route path={ `${url}/bank` } groupId={ groupId } render={ () => (<div>Bank</div>) } />
    <Route path={ `${url}/tax` } groupId={ groupId } render={ () => (<div>Tax</div>) } />
    <Route path={ `${url}/system` } groupId={ groupId } render={ () => (<div>System</div>) } />
    <Route path={ `${url}/charts` } groupId={ groupId } render={ () => (<div>Charts</div>) } />
  </div>
);
