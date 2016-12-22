import React from 'react';
import { connect } from 'react-redux';
import Auth from '@buzzn/module_auth';

const AuthBar = ({ token }) => (
  <nav className="navbar navbar-light bg-faded">
    <div className="container">
      { !token ?
        <div className="float-xs-right">
          <Auth.PasswordSignIn />
        </div> :
        <div className="float-xs-right">
          <Auth.SignOutButton />
        </div>
      }
    </div>
  </nav>
);

function mapStateToProps(state) {
  return { token: state.auth.token };
}

export default connect(mapStateToProps)(AuthBar);
