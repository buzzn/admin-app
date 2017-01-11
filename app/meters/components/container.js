import React from 'react';
import { Match } from 'react-router';
import ListConnected from './list_container';
import MeterConnected from './meter';

export default ({ pathname }) => (
  <div>
    <Match exactly pattern={ pathname } component={ ListConnected }/>
    <Match pattern={ `${pathname}/:id` } component={ MeterConnected }/>
  </div>
);
