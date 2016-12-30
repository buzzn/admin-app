import React from 'react';
import { Link } from 'react-router';
import AuthButtons from '../auth_buttons';

export default ({ signedIn }) => (
  <nav className="navbar navbar-light bg-faded">
    <div className="container">
      { signedIn &&
        <ul className="nav navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link" activeClassName="active" activeOnlyWhenExact>My profile</Link>
          </li>
        </ul>
      }
      <div className="float-xs-right">
        <AuthButtons />
      </div>
    </div>
  </nav>
);
