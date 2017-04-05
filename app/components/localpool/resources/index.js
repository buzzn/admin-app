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
      <Route path={ `${url}/bank` } render={ () => (<div>Bank</div>) }/>
      <Route path={ `${url}/tax` } render={ () => (<div>Tax</div>) }/>
      <Route path={ `${url}/system` } render={ () => <MetersContainer groupId={groupId}/> }/>
      <Route path={ `${url}/charts` } render={ () => <ChartsContainer groupId={groupId}/> }/>
    </div>
  );
};
