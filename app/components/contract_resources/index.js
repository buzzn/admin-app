import React from 'react';
import { Route } from 'react-router-dom';

export default ({ match: { url, params: { groupId, contractId } } }) => (
  <div>
    <Route path={ `${url}/customer` } render={ () => (<div>Customer</div>) } />
    <Route path={ `${url}/contractor` } render={ () => (<div>Contractor</div>) } />
  </div>
);
