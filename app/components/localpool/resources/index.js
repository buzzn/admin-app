import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PowertakersContainer from './powertakers';
import ChartsContainer from './charts';
import ContractsContainer from './contracts';
import MetersContainer from './meters';

export default ({ match: { url, isExact, params: { groupId } } }) => {
  if (isExact) return (<Redirect to={ `${url}/powertakers` }/>);

  return (
    <div>
      <Route path={ `${url}/powertakers` } render={ () => <PowertakersContainer groupId={groupId}/> }/>
      <Route path={ `${url}/contracts` } render={ () => <ContractsContainer groupId={groupId}/> }/>
      <Route path={ `${url}/tariffs` } render={ () => (<div>Tariffs</div>) }/>
      <Route path={ `${url}/system` } render={ () => <MetersContainer groupId={groupId}/> }/>
      <Route path={ `${url}/billing` } render={ () => (<div>Billing</div>) }/>
      <Route path={ `${url}/charts` } render={ () => <ChartsContainer groupId={groupId}/> }/>
      <Route path={ `${url}/documents` } render={ () => (<div>Documents</div>) }/>
    </div>
  );
};
