import React from 'react';
import { Match } from 'react-router';
import ListConnected from './list';
import UserConnected from './user';

export default ({ pathname }) => (
  <div>
    <Match exactly pattern={ pathname } component={ ListConnected }/>
    <Match pattern={ `${pathname}/:id` } component={ UserConnected }/>
  </div>
);
