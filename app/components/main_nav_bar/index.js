import React from 'react';
import { Link } from 'react-router';
import AuthButtons from '../auth_buttons';

export default ({ signedIn }) => (
  <nav className="navbar navbar-dark navbar-fixed-top bg-inverse">
    <button type="button" className="navbar-toggler hidden-sm-up" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar" aria-label="Toggle navigation"></button>
    <a className="navbar-brand" href="#">Powergiver App</a>
    <div id="navbar">
      <nav className="nav navbar-nav float-xs-right">
        { signedIn ?
          <Link to="/" className="nav-item nav-link" activeOnlyWhenExact>My profile</Link> :
          <Link to="/login" className="nav-item nav-link" activeOnlyWhenExact>Login</Link>
        }
      </nav>
      <AuthButtons />
    </div>
  </nav>

);
