import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import MeterDataContainer from './meter_data';
import RegistersContainer from './registers';
import FormulasContainer from './formulas';

export default ({ match: { url, isExact, params: { groupId, meterId } } }) => {
  if (isExact) return (<Redirect to={ `${url}/meter-data` }/>);

  return (
    <div>
      <Route path={ `${url}/meter-data` } render={ () => <MeterDataContainer {...{ meterId, groupId }} /> } />
      <Route path={ `${url}/registers` } render={ () => <RegistersContainer {...{ meterId, groupId }} /> } />
      <Route path={ `${url}/formula` } render={ () => <FormulasContainer {...{ meterId, groupId }} /> } />
    </div>
  );
};
