import React from 'react';
import { Route, Link } from 'react-router-dom';

import './style.scss';

export default ({ to, ...rest }) => (
  <Route path={ to } children={ ({ match }) => (
    <li className="nav-item">
      <Link className={ `nav-link ${match ? 'active' : ''}` } to={ to } { ...rest } />
    </li>
  ) } />
);
