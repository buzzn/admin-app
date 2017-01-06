import React from 'react';
import { Match } from 'react-router';
import ListContainer from './list_container';
import Meter from './meter';

export default ({ pathname }) => (
  <div>
    <Match exactly pattern={ pathname } component={ ListContainer }/>
    <Match pattern={ `${pathname}/meter/:id` } component={ Meter }/>
  </div>
);
