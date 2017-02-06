import React from 'react';
import { Route } from 'react-router-dom';
import ListConnected from './list_container';
import MeterConnected from './meter';

export default ({ pathname }) => (
  <div>
    <Route exact path={ pathname } component={ ListConnected }/>
    <Route path={ `${pathname}/:id` } component={ MeterConnected }/>
  </div>
);
