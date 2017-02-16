import React from 'react';
import { Route } from 'react-router-dom';
import CoreDataContainer from './core_data';

export default ({ match: { url, params: { groupId, userId } } }) => (
  <div>
    <Route path={ `${url}/core-data` } groupId={ groupId } userId={ userId } component={ CoreDataContainer } />
    <Route path={ `${url}/contracts` } groupId={ groupId } userId={ userId } render={ () => (<div>Contracts</div>) } />
    <Route path={ `${url}/bank` } groupId={ groupId } userId={ userId } render={ () => (<div>Bank</div>) } />
    <Route path={ `${url}/register` } groupId={ groupId } userId={ userId } render={ () => (<div>Register</div>) } />
    <Route path={ `${url}/charts` } groupId={ groupId } userId={ userId } render={ () => (<div>Charts</div>) } />
  </div>
);
