import React from 'react';
import { Route } from 'react-router-dom';
import ListConnected from './list_container';
import GroupConnected from './group';

export const Container = ({ pathname }) => (
  <div>
    <Route exact path={ pathname } component={ ListConnected }/>
    <Route path={ `${pathname}/:id` } component={ GroupConnected }/>
  </div>
);

Container.propTypes = {
  pathname: React.PropTypes.string.isRequired,
};

export default Container;
