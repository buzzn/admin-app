import React from 'react';
import { connect } from 'react-redux';
import Auth from '@buzzn/module_auth';

const AuthButtons = ({ token }) => (
  <div>
    { !token ?
      <div>
        <Auth.PasswordSignIn />
      </div> :
      <div>
        <Auth.SignOutButton />
      </div>
    }
  </div>
);

function mapStateToProps(state) {
  return { token: state.auth.token };
}

export default connect(mapStateToProps)(AuthButtons);
