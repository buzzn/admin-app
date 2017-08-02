import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import CoreDataContainer from './core_data';
import ContractContainer from './contract';
import BankContainer from './bank';

export default ({ match: { url, isExact } }) => {
  if (isExact) return (<Redirect to={ `${url}/powertaker` }/>);

  return (
    <div>
      <Route path={ `${url}/powertaker` } component={ CoreDataContainer }/>
      <Route path={ `${url}/contract` } component={ ContractContainer }/>
      <Route path={ `${url}/bank` } component={ BankContainer }/>
    </div>
  );
};
