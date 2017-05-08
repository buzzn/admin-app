import React from 'react';
import { Route, Link } from 'react-router-dom';

import './style.scss';

export default ({ to, ...rest }) => (
  <Route path={ to } children={ ({ match }) => (
    <li className="nav-pill">
      <Link className={ `btn ${match ? 'btn-primary' : 'btn-outline-primary'}` } to={ to } { ...rest } />
    </li>
  ) } />
);
