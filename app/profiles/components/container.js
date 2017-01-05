import React from 'react';
import { Match } from 'react-router';
import ListConnected from './list_container';
import ProfileConnected from './profile';

export default ({ pathname }) => (
  <div>
    <Match exactly pattern={ pathname } component={ ListConnected }/>
    <Match pattern={ `${pathname}/profile/:id` } component={ ProfileConnected }/>
  </div>
);
