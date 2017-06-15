import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import CoreDataContainer from './core_data';

export default ({ match: { url, isExact, params: { groupId, powertakerId } } }) => {
  if (isExact) return (<Redirect to={ `${url}/core-data` }/>);

  return (
    <div>
      <Route path={ `${url}/core-data` } render={ () => <CoreDataContainer groupId={ groupId } powertakerId={ powertakerId }/> }/>
      <Route path={ `${url}/contracts` } render={ () => (<div>Contracts</div>) }/>
      <Route path={ `${url}/bank` } render={ () => (<div>Bank</div>) }/>
      <Route path={ `${url}/register` } render={ () => (<div>Register</div>) }/>
      <Route path={ `${url}/charts` } render={ () => (<div>Charts</div>) }/>
    </div>
  );
};
