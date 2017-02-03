import React from 'react';
import { Route } from 'react-router-dom';
import ListConnected from './list';
import UserConnected from './user';

export default ({ pathname }) => (
  <div>
    <Route exact path={ pathname } component={ ListConnected }/>
    <Route path={ `${pathname}/:id` } component={ UserConnected }/>
  </div>
);
