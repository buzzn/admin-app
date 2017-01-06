import React from 'react';
import { Match } from 'react-router';
import ListContainer from './list_container';
import Profile from './profile';

export default ({ pathname }) => (
  <div>
    <Match exactly pattern={ pathname } component={ ListContainer }/>
    <Match pattern={ `${pathname}/profile/:id` } component={ Profile }/>
  </div>
);
