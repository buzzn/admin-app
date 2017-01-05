import React from 'react';
import { Match } from 'react-router';
import ListConnected from './list_container';
import GroupConnected from './group';

export default ({ pathname }) => (
  <div>
    <Match exactly pattern={ pathname } component={ ListConnected }/>
    <Match pattern={ `${pathname}/group/:id` } component={ GroupConnected }/>
  </div>
);
