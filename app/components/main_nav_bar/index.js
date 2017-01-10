import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Auth from '@buzzn/module_auth';

export const MainNavBar = ({ signedIn, dispatch, userMe }) => (
  <nav className="navbar navbar-dark navbar-fixed-top bg-inverse">
    <button type="button" className="navbar-toggler hidden-sm-up" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar" aria-label="Toggle navigation"></button>
    <a className="navbar-brand" href="#">Powergiver App</a>
    <div id="navbar">
      <nav className="nav navbar-nav float-xs-right">
        { signedIn ?
          <div>
            <Link to={ `/user/${userMe}` } className="nav-item nav-link" activeOnlyWhenExact>My profile</Link>
            &nbsp;
            <button className="btn btn-outline-warning" onClick={ () => dispatch(Auth.actions.signOut()) }>Sign Out</button>
          </div> :
          <Link to="/" className="nav-item nav-link" activeOnlyWhenExact>Login</Link>
        }
      </nav>
    </div>
  </nav>
);

function mapStateToProps(state) {
  return {
    userMe: state.app.userMe,
  };
}

export default connect(mapStateToProps)(MainNavBar);
